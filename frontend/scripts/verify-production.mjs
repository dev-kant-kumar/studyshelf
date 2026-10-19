import assert from 'node:assert/strict'
import { parseHTML } from 'linkedom'

const origin = new URL(process.argv[2] || process.env.VITE_SITE_URL || '')
assert.ok(origin.protocol === 'https:' && origin.pathname === '/' && !origin.search && !origin.hash && !origin.username && !origin.password, 'Provide an HTTPS production origin: npm run verify:production -- https://your-domain')
async function request(path) {
  const response = await fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(20000) })
  return { response, body: await response.text() }
}
const robots = await request('/robots.txt')
assert.equal(robots.response.status, 200, 'robots.txt must return 200')
assert.ok(robots.body.includes(`Sitemap: ${origin.origin}/sitemap.xml`), 'robots.txt must reference the production sitemap')
assert.ok(!/^Disallow:\s*\/\s*$/im.test(robots.body), 'robots.txt must not block the whole site')
const sitemap = await request('/sitemap.xml')
assert.equal(sitemap.response.status, 200, 'sitemap.xml must return 200')
const { document: xml } = parseHTML(sitemap.body)
const urls = [...xml.querySelectorAll('loc')].map(node => node.textContent.trim())
assert.ok(urls.length, 'Sitemap must contain URLs')
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique')
for (const url of urls) assert.equal(new URL(url).origin, origin.origin, 'Sitemap URLs must use the production origin')
for (const url of urls) {
  const { response, body } = await request(new URL(url).pathname)
  assert.equal(response.status, 200, `${url}: direct request must return 200`)
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${url}: response header must allow indexing`)
  const { document } = parseHTML(body)
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, `${url}: exactly one canonical`)
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url, `${url}: production self-canonical`)
  assert.ok(!/noindex/i.test(document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''), `${url}: page must allow indexing`)
  assert.equal(document.querySelectorAll('h1').length, 1, `${url}: prerendered main heading`)
}
for (const path of ['/search', '/saved']) {
  const { response, body } = await request(path)
  assert.equal(response.status, 200, `${path}: expected utility page`)
  const { document } = parseHTML(body)
  assert.ok(/noindex/i.test(`${response.headers.get('x-robots-tag') || ''} ${document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''}`), `${path}: must be noindex`)
}
const missing = await request('/seo-verification-nonexistent-page-8a67c2')
assert.equal(missing.response.status, 404, 'Unknown paths must return HTTP 404')
console.log(`Verified ${urls.length} production sitemap pages, canonical URLs, indexing directives, robots.txt, utility pages, and HTTP 404.`)
