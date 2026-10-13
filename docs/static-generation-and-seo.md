# Static generation and SEO

`npm run build` bundles the frontend, renders 66 public routes plus the 404 page, and verifies the generated output. Routes come from the live curriculum and publication catalogue, so publishing a chapter adds its static page automatically. A failed render or verification fails the build.

## Rendered content

The output contains complete chapter text, worked examples, syllabus outlines, question answers, and internal chapter links before JavaScript runs. Completed React suspense segments are moved into their final positions. The build removes streaming runtime scripts and converts the imported chapter SVG to a production-safe inline asset. With JavaScript disabled, unit panels and answers are shown through a noscript stylesheet. With JavaScript enabled, existing accordion and reading preferences work normally.

React replaces the initial static tree on startup. Build-time metadata is marked and removed before React takes ownership, preventing duplicate or stale canonical, title, and description tags during client navigation.

## Metadata and structured data

Every page has a self-referencing HTTPS canonical, a description, robots directives, Open Graph metadata, and Twitter preview metadata. The shared 1200 x 630 social preview is in `frontend/public/social-preview.png`. The default home title targets BCA and MCA study notes; semester and subject titles and descriptions include their course and semester.

JSON-LD includes WebSite and WebPage data, ContactPage or AboutPage where appropriate, breadcrumbs reflecting the visible trail, and Article data for published chapters. Author identity points to Dev Kant Kumar. Modified dates come from the chapter metadata. Publication dates are omitted unless explicitly supplied. No fabricated ratings, credentials, or publication timestamps are included.

References: [Google Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article), [Google breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## Indexing and sitemaps

The sitemap is derived from each rendered page's robots directive rather than an independent allowlist. Search, saved notes, the BCA placeholder, empty paper entries without outlines or notes, and 404 are noindex. Useful supplied syllabus pages remain indexable even when their notes are forthcoming. The current output has 51 indexable canonical URLs. Chapter lastmod values use authored update dates, never build time. Robots.txt points to the canonical sitemap.

[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) describes accurate lastmod values and sitemap submission.

## Automated verification

The build checks one H1, title, description and canonical per page; unique titles and descriptions for indexable pages; HTTPS self-canonicals; valid JSON-LD; article authors and dates; breadcrumb positions; production asset availability; every local navigation link; absence of loading placeholders; exact sitemap and robots agreement; and the noindex 404. At implementation time all 67 pages, 15 articles, and 2,151 internal links passed.

## Production launch

Choose the final subdomain and set VITE_SITE_URL and VITE_CONTACT_EMAIL in Cloudflare Pages before building. Confirm real 200 responses for published routes and a 404 response for unknown paths. Keep preview pages noindex. After deployment, verify the domain in Google Search Console, submit /sitemap.xml, and inspect the home page and a chapter with URL Inspection and Rich Results Test. These account-level steps have not been performed locally. Search indexing and enhanced search appearances are not guaranteed by this implementation.

See [Cloudflare Pages deployment](./cloudflare-pages-deployment.md) for deployment settings. Update publication metadata when chapter content changes, and rebuild to refresh the static pages and sitemap.
