import { site } from '@/config/site'
import StructuredData from './StructuredData'
export default function DocumentHead({ title, description = site.description, path = '/', noindex = false, article = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `BCA & MCA Study Notes | ${site.name}`
  const url = `${site.url}${path}`, image = `${site.url}/social-preview.png`
  const page = { '@type': path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : 'WebPage', '@id': `${url}#page`, url, name: fullTitle, description, inLanguage: 'en', isPartOf: { '@id': `${site.url}/#website` } }
  const graph = [{ '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: `${site.url}/`, inLanguage: 'en' }, page]
  if (article && typeof article === 'object') {
    graph.push({ '@type': 'Article', '@id': `${url}#article`, headline: title, description, url, mainEntityOfPage: { '@id': page['@id'] }, inLanguage: 'en', isAccessibleForFree: true, author: { '@type': 'Person', name: article.author ?? site.author, url: site.authorUrl }, ...(article.updatedAt ? { dateModified: article.updatedAt } : {}), ...(article.publishedAt ? { datePublished: article.publishedAt } : {}) })
  }
  return <><title>{fullTitle}</title><meta name="description" content={description} /><meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} /><link rel="canonical" href={url} /><meta property="og:title" content={fullTitle} /><meta property="og:description" content={description} /><meta property="og:url" content={url} /><meta property="og:type" content={article ? 'article' : 'website'} /><meta property="og:site_name" content={site.name} /><meta property="og:image" content={image} /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="Study Shelf - BCA and MCA study notes" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={fullTitle} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image} /><meta name="twitter:image:alt" content="Study Shelf - BCA and MCA study notes" /><StructuredData data={{ '@context': 'https://schema.org', '@graph': graph }} /></>
}
