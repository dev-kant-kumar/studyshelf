import assert from 'node:assert/strict'
import { readFile, readdir, access } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { parseHTML } from 'linkedom'
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat()
}
const pages = (await files('dist')).filter(file => file.endsWith('.html'))
assert.ok(pages.length > 20, 'The build must include the catalogue and published chapters')
const indexable = new Set(), titles = new Set(), descriptions = new Set()
let linkCount = 0, articleCount = 0
for (const file of pages) {
  const html = await readFile(file, 'utf8')
  const { document } = parseHTML(html)
  assert.equal(document.querySelectorAll('h1').length, 1, `${file}: exactly one main heading`)
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1)
  const canonical = document.querySelector('link[rel="canonical"]').getAttribute('href')
  const url = new URL(canonical)
  const expectedPath = relative('dist', file).replaceAll('\\', '/').replace(/\.html$/, '')
  assert.equal(url.protocol, 'https:')
  assert.equal(url.pathname, expectedPath === 'index' ? '/' : `/${expectedPath}`, `${file}: self canonical`)
  assert.ok(!url.search && !url.hash)
  const robots = document.querySelector('meta[name="robots"]').getAttribute('content')
  if (!robots.includes('noindex')) {
    indexable.add(canonical)
    const title = document.querySelector('title').textContent
    const description = document.querySelector('meta[name="description"]').getAttribute('content')
    assert.ok(!titles.has(title), `${file}: unique indexable title`)
    assert.ok(description && !descriptions.has(description), `${file}: unique indexable description`)
    titles.add(title); descriptions.add(description)
  }
  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent))
  assert.ok(schemas.length > 0, `${file}: static structured data`)
  for (const schema of schemas) {
    assert.equal(schema['@context'], 'https://schema.org')
    for (const node of schema['@graph'] ?? [schema]) {
      if (node['@type'] === 'BreadcrumbList') {
        assert.ok(node.itemListElement.length >= 2)
        for (const [index, item] of node.itemListElement.entries()) {
          assert.equal(item.position, index + 1)
          assert.equal(new URL(item.item).origin, url.origin)
        }
      }
      if (node['@type'] === 'Article') {
        articleCount++
        assert.equal(node.url, canonical)
        assert.ok(node.headline && node.author.name && node.author.url)
        assert.match(node.dateModified, /^\d{4}-\d{2}-\d{2}$/)
      }
    }
  }
  for (const picture of document.querySelectorAll('picture')) {
    const img = picture.querySelector('img')
    assert.ok(Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0, `${file}: illustration dimensions reserve layout space`)
    assert.notEqual(img.getAttribute('alt'), null, `${file}: image accessibility`)
    for (const element of picture.querySelectorAll('[srcset]')) {
      assert.ok(element.getAttribute('sizes'), `${file}: responsive image sizing`)
      for (const candidate of element.getAttribute('srcset').split(',')) {
        const source = candidate.trim().split(/\s+/)[0]
        await access(join('dist', source.slice(1)))
      }
    }
  }
  const image = new URL(document.querySelector('meta[property="og:image"]').getAttribute('content'))
  assert.equal(image.origin, url.origin)
  await access(join('dist', image.pathname.slice(1)))
  const preview = await readFile(join('dist', image.pathname.slice(1)))
  assert.equal(preview.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${file}: PNG social image`)
  assert.equal(preview.readUInt32BE(16), 1200, `${file}: social image width`)
  assert.equal(preview.readUInt32BE(20), 630, `${file}: social image height`)
  assert.equal(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'), image.href, `${file}: matching share images`)
  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href')
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const target = new URL(href, url.origin).pathname
    const isDownload = anchor.hasAttribute('download') || target.endsWith('.pdf')
    await access(join('dist', target === '/' ? 'index.html' : isDownload ? target.slice(1) : `${target.slice(1)}.html`))
    linkCount++
  }
  assert.equal(document.querySelectorAll('template[id^="B:"], div[hidden][id^="S:"]').length, 0, `${file}: no unresolved suspense segments`)

  assert.equal(document.querySelectorAll('title').length, 1, `${file}: one page title`)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${file}: one canonical URL`)
  assert.ok(!html.includes('�') && !html.includes('src="/src/'), `${file}: valid text and production assets`)
  assert.ok(html.includes('<h1'), `${file}: readable page heading before JavaScript`)
  assert.ok(!html.includes('Opening the shelf…') && !html.includes('Loading note…'), `${file}: resolved content, not a loading shell`)
  assert.ok(html.includes('href="https://devkantkumar.com/"') && html.includes('href="https://unyrisetech.com/"'), `${file}: author and company credit links`)
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/g)) await access(join('dist', match[1].slice(1)))
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.ok(!sitemap.includes('/dev/reader') && !sitemap.includes('/saved</loc>') && !sitemap.includes('/search</loc>'))
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'No duplicate sitemap URLs')
assert.deepEqual(new Set(sitemapUrls), indexable, 'Sitemap includes exactly the indexable canonical pages')
assert.ok(articleCount >= 15, 'All published articles have structured data')
for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const path = new URL(match[1]).pathname
  await access(join('dist', path === '/' ? 'index.html' : `${path.slice(1)}.html`))
}
const note = await readFile('dist/notes/mca-sem1-paper1-unit1-protocols.html', 'utf8')
assert.ok(note.includes('TCP supplies an ordered reliable byte stream'), 'Published note text is prerendered')
const missing = await readFile('dist/404.html', 'utf8')
assert.ok(missing.includes('noindex, follow') && missing.includes('404 / Page not found'))
console.log(`Verified ${pages.length} rendered HTML pages, ${indexable.size} indexable URLs, ${articleCount} articles, ${linkCount} internal links, structured data, metadata, assets, and the 404 page.`)
