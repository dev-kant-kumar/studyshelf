import { createServer } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { parseHTML } from 'linkedom'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', mode: 'production' })
try {
  const { paths, site, noteDates, render } = await server.ssrLoadModule('/src/entry-prerender.jsx')
  if (process.env.CF_PAGES && (!process.env.VITE_SITE_URL || !process.env.VITE_CONTACT_EMAIL)) throw new Error('Cloudflare Pages builds require VITE_SITE_URL and the dedicated VITE_CONTACT_EMAIL. Set them in the project environment variables before deployment.')
  const origin = new URL(site.url)
  if (origin.hostname === 'studyself.devkantkumar.com') throw new Error('VITE_SITE_URL uses the misspelled host. Set it to https://studyshelf.devkantkumar.com and rebuild.')
  if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('VITE_SITE_URL must be an HTTPS origin without a path, query, fragment, or credentials.')
  if (new Set(paths).size !== paths.length) throw new Error('Duplicate static routes')
  const sitemapPaths = []
  const template = await readFile('dist/index.html', 'utf8')
  async function save(path, outputPath) {
    const rendered = await render(path)
    const { document } = parseHTML(`<html><body>${rendered}</body></html>`)
    // Move completed React suspense segments into place for a script-free static page.
    for (const segment of document.querySelectorAll('div[hidden][id^="S:"]')) {
      const placeholder = document.getElementById(segment.id.replace('S:', 'B:'))
      if (!placeholder) throw new Error(`Missing suspense placeholder: ${segment.id}`)
      let node = placeholder.nextSibling
      let depth = 0
      while (node) {
        if (node.nodeType === 8) {
          if (node.data === '/$' && depth === 0) break
          if (node.data === '/$') depth--
          else if (['$', '$?', '$!', '$~'].includes(node.data)) depth++
        }
        const next = node.nextSibling
        node.remove()
        node = next
      }
      while (segment.firstChild) placeholder.parentNode.insertBefore(segment.firstChild, placeholder)
      placeholder.remove()
      segment.remove()
    }
    for (const script of document.querySelectorAll('script:not([type="application/ld+json"])')) script.remove()
    for (const asset of document.querySelectorAll('[src^="/src/"]')) {
      const source = asset.getAttribute('src')
      const data = await readFile(resolve(source.slice(1)))
      if (!source.endsWith('.svg')) throw new Error(`Unsupported prerender asset: ${source}`)
      asset.setAttribute('src', `data:image/svg+xml;base64,${data.toString('base64')}`)
    }
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content')
    const metadata = Array.from(document.querySelectorAll('title, meta, link, script[type="application/ld+json"]')).filter(element => !element.closest('svg')).map(element => {
      element.setAttribute('data-static-head', '')
      const tag = element.outerHTML
      element.remove()
      return tag
    }).join('')
    if (robots && !robots.includes('noindex')) sitemapPaths.push(path)
    const html = template.replace('</head>', () => `${metadata}</head>`).replace('<div id="root"></div>', () => `<div id="root">${document.body.innerHTML}</div>`)
    const file = resolve('dist', outputPath)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }
  for (const path of paths) await save(path, path === '/' ? 'index.html' : `${path.slice(1)}.html`)
  await save('/404', '404.html')
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapPaths.map(path => `<url><loc>${escape(site.url + path)}</loc>${noteDates[path] ? `<lastmod>${noteDates[path]}</lastmod>` : ''}</url>`).join('')}</urlset>\n`)
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`)
  console.log(`Prerendered ${paths.length} public pages and a 404 page; generated sitemap and robots.txt.`)
} finally { await server.close() }
