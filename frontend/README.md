# StudyShelf public frontend

React + Vite with Tailwind utilities. Dependencies stay inside this folder.

## Local development

From `frontend`, run `npm install` if needed, then `npm run dev`.

- `/`: home and course discovery.
- `/courses/mca`: imported syllabus, four semesters, subject and unit navigation.
- `/courses/bca`: honest placeholder until a syllabus is supplied.
- `/search`: published-note search with course filtering and browser-history support.
- `/saved`: device-local saved notes and unavailable-bookmark removal.
- `/about`, `/help`, `/contact`, `/content-policy`, `/updates`, and `/privacy`: author and scope, reading help, independent contact, content standards, latest chapters, and privacy controls.
- `/dev/reader`: development-only layout fixture. It is absent from production routing and bundles, search, published counts and recent history. It does not offer bookmarking.

The reader supports font/size preferences, focus mode, heading links, reading time, subject navigation, clipboard actions, diagram enlargement and print utilities. Test future note bodies against the reader fixture when adding new content components.

## Adding the first note

Follow `../docs/content-system.md`. Course metadata comes from one `notesData/<Course>/syllabus.js`; note bodies and assets live inside their own folders. Do not add topic arrays or authored content to page components. Imported syllabus outlines are not published notes.

## Verification

Run `npm run lint`, `npm run test`, and `npm run build`. For browser verification, use `/dev/reader`, the catalogue, search and empty saved states. Check both themes, narrow widths, larger text, keyboard dialogs, copied-code feedback and heading anchors. Actual note content still needs checking when it is added.

## Publication boundary

`npm run build` creates the production bundle, then prerenders every published public route, including all note bodies, to HTML. It also generates a sitemap, robots.txt, and a real 404 page. Cloudflare Pages serves matching extensionless HTML paths and uses the top-level 404.html for missing paths. Do not add a catch-all SPA rewrite, which would mask missing pages. See `../docs/cloudflare-pages-deployment.md`.

Set `VITE_SITE_URL` to the final StudyShelf subdomain and `VITE_CONTACT_EMAIL` to its dedicated inbox. Values are public frontend configuration, not secrets. Cloudflare builds fail when either is missing. The Contact page collects name, email, category, subject, optional page URL, and message in memory. Submission is unavailable until the planned Cloudflare Workers backend is connected. The dedicated email address is a direct fallback. All support links stay within StudyShelf. Authenticated admin publishing and backend services are separate work.

## Static generation and SEO

See [static generation and SEO](../docs/static-generation-and-seo.md). The production build automatically verifies rendered content, metadata, structured data, sitemap indexability, assets, and local navigation links. Set the final production origin before deployment, then verify and submit the sitemap in Search Console.
