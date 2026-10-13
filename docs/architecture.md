# Architecture
Follows Unyrise Tech's frontend / admin-panel / backend / docs separation.

Public app: src/app/main-website contains MainWebsite, MainWebsiteRoutes, MainWebsiteLayout, pages, and shared components/data. Keep page-only components in pages/<Page>/components. Put cross-page UI in shared/components. src/config holds site settings; src/lib holds reusable utilities; src/store is reserved for state; src/ui is reserved for UI primitives.

Admin app follows src/app/admin with routes, layout, pages, and shared components. It is a scaffold, not a secured publishing system.

Backend reserves config, routes, controllers, services, repositories, db, middlewares, validations, lib, and utils. Add the API separately with dedicated resources.

Next implementation: define university/syllabus and course → semester → subject → unit → note; then implement authenticated publishing and reading pages. Do not invent syllabus details. For public launch, add prerendering or server rendering for indexable note content, canonical URLs, metadata, sitemap, and deployment SPA fallbacks. Keep admin/private routes out of search and enforce API authentication.
