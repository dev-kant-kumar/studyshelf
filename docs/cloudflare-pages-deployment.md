# Cloudflare Pages deployment

The site is prepared as a static, prerendered React website. No Pages Functions, backend bindings, or mail provider are required for the current public frontend.

## Project settings

- Root directory: `frontend` when deploying from the StudyShelf repository root.
- Framework preset: Vite (or None with the explicit settings below).
- Build command: `npm run build`.
- Output directory: `dist` (relative to frontend).
- Build runtime: Node 22 or a later compatible runtime supported by the installed Vite version.
- Public environment: `VITE_SITE_URL=https://studyshelf.devkantkumar.com` and `VITE_CONTACT_EMAIL=<dedicated-StudyShelf-inbox>`.

The production domain is `studyshelf.devkantkumar.com`. Update `VITE_SITE_URL` in the Cloudflare Pages production build environment before redeploying, because an environment variable overrides the source default. The build rejects the former misspelled hostname. Deploy the rebuilt output, then run `npm run verify:production -- https://studyshelf.devkantkumar.com` from `frontend` to check live canonicals, the sitemap, robots.txt, and response status codes. Submit the corrected sitemap in the Search Console property for this domain and inspect affected chapter URLs after the live check passes.

Do not put secrets in VITE_ variables. Cloudflare builds deliberately fail if either public setting is absent. The final subdomain can be chosen later; changing VITE_SITE_URL and rebuilding updates canonical metadata, sitemap URLs, and page links in correction reports. The inbox must exist and receive mail; this project does not provision it.

## Generated output

Every public route has an HTML file containing its rendered page content and metadata. Note pages include authored chapter text before JavaScript runs. The build also emits sitemap.xml, robots.txt, and 404.html. Search and Saved are noindex and excluded from the sitemap; development previews are not emitted.

Cloudflare serves matching HTML at extensionless paths. Unknown paths use the generated top-level 404.html and a 404 response. Do not add `/* /index.html 200` or remove 404.html. These would turn missing URLs into successful SPA responses.

The _headers file supplies basic response headers and noindex on the pages.dev host pattern. Cloudflare also applies noindex to preview deployment responses. Verify both the preview and production response headers after creating the project.

## Contact behaviour

Contact is independent of the author’s portfolio. The form collects name, email, category, subject, optional page URL, and message in memory. Submission is unavailable until the planned Cloudflare Workers backend is connected. It never claims delivery. The dedicated email address is available as a direct fallback. Reader correction links prefill the chapter URL.

## Release verification

1. Set the chosen domain and actual inbox, rebuild, and run `npm run lint`, `npm test`, and `npm run verify:build`.
2. Create the Cloudflare Pages project or upload the complete dist output. Add the custom domain through Pages and complete its DNS configuration.
3. Reload a nested note URL directly, inspect its page source, and confirm it includes the chapter text and correct canonical URL.
4. Request a nonexistent path and verify HTTP 404, then follow the recovery links.
5. Verify search, bookmarks, printing, theme preferences, unit controls, help answers, and the Contact form validation and unavailable-submission status on desktop and mobile.
6. Verify the dedicated inbox receives an email sent manually, and inspect preview noindex headers before exposing the production domain.

This work prepares the deployable frontend. It does not create a Cloudflare account/project, choose the final domain, configure DNS, provision an inbox, or deploy publicly.

Primary references: https://developers.cloudflare.com/pages/configuration/serving-pages/ and https://developers.cloudflare.com/pages/configuration/headers/.

## Future contact backend

Connect the form submit handler in `frontend/src/app/main-website/pages/Contact/Contact.jsx` to the Workers endpoint. Its fields are `name`, `email`, `category`, `subject`, `pageUrl`, and `message`. Validate them on the server, add abuse protection, and return confirmed success before clearing fields or showing delivery status. The current frontend intentionally sends no request and stores no contact submissions.
