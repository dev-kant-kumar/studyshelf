# Static generation and SEO

## SEO follow-up - 2026-10-19

The homepage now targets VBU MCA study notes, syllabus, and revision. Course and semester headings name their course context. Chapter search titles add VBU and the course name while Article schema retains the original chapter headline. BCA remains explicitly forthcoming and its empty course page remains noindex. Course cards show current publication counts.

Catalogue pages link to the official VBU MCA syllabus PDF at https://www.vbu.ac.in/resources/assets/img/syllubs/pg/MCASyllabus.pdf and distinguish the CBCS syllabus version from the study session. The VBU guide describes current coverage without claiming that every other paper lacks chapters.

The corrected production origin is https://studyshelf.devkantkumar.com. Live checks on 2026-10-19 confirmed that this host serves the site, but the deployed canonicals, sitemap URLs, and robots.txt still referenced an incorrectly spelled host that failed DNS resolution. The local configuration is corrected; redeployment is required to update the live metadata. Google indexing remains unverified.

After deployment, run `npm run verify:production -- https://studyshelf.devkantkumar.com` from `frontend`. This checks every sitemap URL for direct HTTP 200 responses, production self-canonicals, indexability, and a rendered H1, plus robots.txt, utility-page noindex, and a real HTTP 404 for an unknown route. It does not prove Google indexing or measure Core Web Vitals.

In Google Search Console, verify domain ownership, submit `/sitemap.xml`, and inspect the homepage and representative chapters. Review queries, clicks, impressions, CTR, indexing, and Core Web Vitals after data becomes available. New course chapters, verified previous-year papers, earned external links, and live mobile performance measurements remain ongoing work.

Validation for this follow-up: 84 rendered pages, 68 indexable URLs, 29 articles, and 3,480 local navigation links passed build verification. All 10 tests passed. Lint completed with an existing CodeBlock.jsx effect warning. Historical implementation counts below describe the earlier baseline.

`npm run build` bundles the frontend, renders 66 public routes plus the 404 page, and verifies the generated output. Routes come from the live curriculum and publication catalogue, so publishing a chapter adds its static page automatically. A failed render or verification fails the build.

## Rendered content

The output contains complete chapter text, worked examples, syllabus outlines, question answers, and internal chapter links before JavaScript runs. Completed React suspense segments are moved into their final positions. The build removes streaming runtime scripts and converts the imported chapter SVG to a production-safe inline asset. With JavaScript disabled, unit panels and answers are shown through a noscript stylesheet. With JavaScript enabled, existing accordion and reading preferences work normally.

React replaces the initial static tree on startup. Build-time metadata is marked and removed before React takes ownership, preventing duplicate or stale canonical, title, and description tags during client navigation.

## Metadata and structured data

Every page has a self-referencing HTTPS canonical, a description, robots directives, Open Graph metadata, and Twitter preview metadata. The 1200 x 630 social previews are selected by link category from `frontend/public/social-preview-*.png`. The default home title targets BCA and MCA study notes; semester and subject titles and descriptions include their course and semester.

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

## Social sharing previews

Sharing images are selected by URL through `frontend/src/config/socialPreviews.js`. The homepage and general pages use `social-preview-site.png`, describing Study Shelf across BCA, MCA, and developer learning. MCA course routes and MCA note slugs use `social-preview-vbu-mca.png`. BCA course routes and BCA note slugs use `social-preview-bca.png`, which states that course material is coming soon. Developer pages, including the Node.js roadmap, use `social-preview-developers.png`. Article course metadata also supplies a fallback for future note URL formats.

Every card is a 1200 x 630 PNG. Open Graph and Twitter use the selected absolute HTTPS URL and matching descriptive alternative text. Each page keeps its own title and description. The homepage search/share title describes the whole site. Build verification checks actual image format and dimensions, and routing tests cover course descendants, note slugs, general pages, and similar unmatched prefixes.

Artwork was created with the built-in image generation tool. MCA prompt: blue and off-white Study Shelf card with an open book and stacked books; VBU MCA study notes, syllabus, examples and revision. Variant prompts: preserve the reference palette and layout; root headline Study Shelf with Learn. Revise. Build. and BCA & MCA study resources. Developer learning.; BCA Learning with Build your foundation. and Computing concepts. Course material coming soon.; Developer Shelf with Learn. Build. Ship. and Roadmaps. Projects. Practical development. All cards include studyshelf.devkantkumar.com. Generated artwork was resized to 1200 x 630 for delivery.
