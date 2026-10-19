# StudyShelf frontend design

Date: 13 October 2026. Status: recommended direction, ready for frontend implementation. Scope: public frontend at studyshelf.devkantkumar.com; admin and backend are excluded.

## 1. Direction and rationale

**A modern study library with a focused documentation-style reader.** Help BCA/MCA students find the right topic, understand it, and revisit it during revision. Prioritise reading and syllabus navigation over a large marketing homepage.

Use pale blue-grey surfaces, deep blue actions, book-like titles, and clean sans-serif text. Design light and dark themes together. On the first visit respect the operating-system theme; offer Light / Dark / System and persist the user's explicit choice.

This is the strongest fit for the current brief, not a universal best palette or a claim about improving grades or preventing eye strain. The current cream/green starter is an initial scaffold, not the final visual specification. A neon portfolio treatment would compete with reading; a playful classroom treatment would skew too young.

The UI/UX skill research favoured documentation-style search, rational grids, and restrained decoration. Adopt those structural ideas. Its generic purple/green palette and wellness/children-oriented typography matches were rejected as insufficiently specific to university technical notes.

**Signature:** a slim syllabus marker on catalogue rows, displaying actual course, semester, and unit labels. This index-like detail gives StudyShelf an identity and helps students locate material. In the reader, it becomes breadcrumbs and the active unit marker. Never invent syllabus labels to fill the design.

## 2. Identity and writing

- Brand: StudyShelf. Descriptor: BCA & MCA study notes.
- Homepage headline: “Find your topic. Keep learning.”
- Supporting copy: “Notes, examples, and revision material for computer applications students.” Mention only available resource types.
- Author credit: “Notes by Dev Kant Kumar.” Footer credit: “Built by Unyrise Tech.”
- Use direct, friendly sentence case. Actions: Read notes, Browse MCA, Save note, Copy link, Print note, Clear filters.
- Avoid invented ratings, testimonials, counts, complete-syllabus claims, and guaranteed exam questions.
- Attribute references and clearly distinguish original notes from university documents.

## 3. Colour tokens

Use semantic CSS variables in shared styles. Components must not invent hex colours. Most of the viewport stays neutral; blue identifies actions/location and gold identifies occasional teaching callouts. Course identity always has a text label.

### Light

- `--background: #F6F8FC` - page canvas.
- `--surface: #FFFFFF` - reader, controls, main panels.
- `--surface-muted: #EDF2FA` - secondary panels and hover surfaces.
- `--text: #17243B` - primary ink.
- `--text-muted: #526078` - readable metadata and supporting copy.
- `--primary: #2457C5` - actions, links, active navigation, focus.
- `--primary-hover: #1B439C`; `--on-primary: #FFFFFF`.
- `--primary-subtle: #E8EFFD` - selected navigation background with primary text.
- `--border: #DCE3EF` - decorative dividers.
- `--control-border: #7B879A` - necessary input/control outlines.
- `--accent: #785500`; `--accent-subtle: #FFF4CC` - key-concept callouts.
- `--success: #166534`; `--danger: #B42318` - labelled status text on white.

### Dark

- `--background: #101725`; `--surface: #162033`; `--surface-muted: #1D2A41`.
- `--text: #E6EDF8`; `--text-muted: #ADBBD0`.
- `--primary: #93B4FF`; `--primary-hover: #B0C8FF`; `--on-primary: #10213F`.
- `--primary-subtle: #203458` - selected navigation surface.
- `--border: #33415A`; `--control-border: #70809A`.
- `--accent: #F3D780`; `--accent-subtle: #302A18`.
- `--success: #86EFAC`; `--danger: #FDA29B` - labelled status text on dark surface.

### Contrast validation

Calculated with WCAG relative luminance for opaque solid colours:

- Light main text on white: 15.53:1; muted text on page background: 5.98:1.
- White button label on blue and blue link on white: 6.47:1.
- Dark main text on reader surface: 13.84:1; muted text: 8.38:1.
- Dark primary link on surface: 7.93:1; button label on primary: 7.79:1.
- Focus against page canvas: light 6.09:1, dark 8.72:1.
- Control outlines against their surfaces: light 3.64:1, dark 4.07:1.

These checks validate listed pairs, not a certified interface. Check actual hover, selected, syntax, callout, error, and disabled combinations when implemented. Aim for at least 4.5:1 for ordinary readable text and 3:1 for necessary control indicators. Subtle decorative borders are not substitutes for accessible control outlines. Underline links in article prose; active navigation also has a marker and aria-current.

## 4. Typography

**Source Sans 3:** default note body, technical section headings, navigation, controls, metadata, and catalogue rows. Weights 400, 600, 700. Adobe describes it as designed for UI environments.

**Literata:** wordmark, homepage heading, page titles, and note titles. Weights 500, 600. Its long-form-reading origin supports a book-like identity; it does not prove serif is best for every reader. A later reading preference may allow Literata prose without changing controls.

**System monospace:** code and compact index labels. Use ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace. Do not download a third family at launch.

- UI body: 16px / 1.5; metadata: 14px / 1.5.
- Article prose: 18px / 1.75 desktop, 17px / 1.7 mobile.
- Buttons/navigation: 16px / 1.25, weight 600.
- Homepage heading: 48px / 1.12 desktop, 34px / 1.15 mobile; maximum around 56px.
- Page/note title: 36px / 1.2 desktop, 28px / 1.25 mobile.
- Article h2: 28px / 1.3 desktop, 24px mobile. Article h3: 22px / 1.4.
- Code: 15px / 1.6. Avoid ligatures that obscure literal operators.

Implement rem units and fluid headings. Keep prose around 65–72ch, left-aligned with normal tracking. Space paragraphs around 1em apart, with more room before headings than after. Reading sizes: 16 / 18 / 20 / 22px; enlarged text must reflow.

Self-host licensed WOFF2 assets when implementing, retain licence files, load only used weights/styles, and use font-display: swap. Fallbacks: Source Sans 3 → system-ui → sans-serif; Literata → Georgia → serif. If Hindi content is introduced, validate a Devanagari family separately.

## 5. Spacing and visual language

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Gutters: 16px mobile, 24px tablet, 32px desktop.
- Catalogue width: maximum 1200px; reader shell: maximum 1440px.
- Cards: 12px radius; controls: 8px; small tags: 6px.
- Main panels use borders; dropdowns and drawers may use one restrained shadow.
- Lucide icons only, typically 18–20px with consistent strokes and descriptive accessible names.
- Product mark: compact book/shelf SVG plus wordmark. No illustration is required.
- No textures behind prose, animated particles, parallax, decorative 3D, autoplay media, or continuous ambient motion.

## 6. Information architecture

Discovery flow: **course → semester → subject → unit → note**. Units can be sections within the subject page rather than mandatory separate pages.

University, regulation year, subjects, and programme length vary. Record syllabus identity when supplied; label unmapped material “General topic notes”. Do not assume a fixed semester count or publish an invented curriculum. Keep stable content IDs independent of names.

Desktop navigation: logo, BCA, MCA, Search, Saved, theme control. About belongs in the footer. Mobile: logo, search trigger, menu trigger; the menu contains course links, Saved, and theme settings. Subject navigation is separately labelled.

Reading needs no account. Saved notes and reading settings initially live on this device. Account sync and progress dashboards are future features.

## 7. Pages

### Home - `/`

Compact header, short headline, labelled search, BCA/MCA selectors, recent publications when real content exists, short explanation, footer. Prioritise discovery in the first viewport. Empty library: retain course entry points and an honest publication message. No fake note cards or counts. Show recently viewed only after actual local history exists.

### Course - `/courses/:course`

Breadcrumbs, course title, scope text, syllabus label/selector if real versions exist, available semesters. Show genuine subject availability. A planned semester may say “Not published yet”; do not make it look like a working populated destination.

### Semester - `/courses/:course/semesters/:semester`

Course context, semester title, syllabus identity, subject rows. Each row contains supplied subject title/code, coverage summary, and actual note availability. Add filters only when content volume justifies them.

### Subject - `/courses/:course/semesters/:semester/subjects/:subject`

Subject title, syllabus/version context, ordered unit groups, and note links with resource type and updated date. Separate notes, revision material, and practice only when they exist. Use factual note counts; completion percentages require a verified syllabus map.

General-topic material can use `/subjects/:subject` without forcing an unsupported semester mapping.

### Note reader - `/notes/:noteSlug`

One canonical URL per note regardless of its course placements. Keep navigation context without creating duplicate full articles.

Header: breadcrumb, title, learning objective, author, updated date, syllabus label, and calculated reading time if available. Actions: Save note, Copy link, Print note. Show Download PDF only when a real file exists.

Article: explanations, examples, code/diagrams as appropriate, key points, references, and related notes. These are useful content patterns, not obligatory filler sections. End with previous/next in the selected learning sequence and a correction-report link with a working destination.

Reading controls: text size, theme, Focus mode. Focus mode hides optional sidebars and retains a visible exit. No floating controls may cover mobile prose.

### Search - `/search?q=...`

Visible label and submit action. Initially search titles, subject names, tags, and summaries. Result rows show title, matching excerpt, and course/subject context. Keep query and filters in URL parameters; browser Back restores them. Start with course filtering, adding semester/subject filters only when useful. Provide Clear filters, no-results guidance, loading, and retryable-error states.

### Saved - `/saved`

Reuse note rows with Remove from saved. Label “Saved on this device”. Empty state links to course browsing. A stored ID that no longer resolves displays an unavailable-note message and remove action.

### About - `/about`

Author, scope, source attribution, publication approach, syllabus limitations, and corrections contact. Link to Dev Kant's portfolio.

### Privacy - `/privacy`

Explain actual local storage, analytics, and contact services. Write from implemented behaviour; do not claim no tracking without verification. Add other policy pages only when they have substantive content.

### Not found - unmatched routes

Short explanation with search and course links. Unknown course/subject/note IDs are not found; valid empty subjects get empty states instead.

## 8. Layout and responsive behaviour

Use CatalogueLayout and ReaderLayout within the existing MainWebsiteLayout.

Catalogue: centred container; two course selectors on desktop, stacked on mobile. Subjects/search use comfortable rows with wrapping titles rather than large card grids.

Reader at >=1280px: approximately 224px subject sidebar, flexible article capped near 72ch, 192px table of contents, 24–32px gaps. Collapse optional sidebars if enlarged text leaves insufficient article space.

At 1024–1279px: subject sidebar plus article, with an in-flow “On this page” disclosure before prose. Below 1024px: single column, labelled subject drawer, and in-flow TOC disclosure. Use document scrolling; sidebar scrolling is allowed only when necessary.

Header about 64px desktop, 56px mobile. Sticky sidebars sit below it, have bounded height, and do not overlay article content. Set scroll padding and heading scroll margin so anchors/focus are not obscured. Mobile menus use safe-area padding where needed.

Print: black text on white, hide navigation and actions, retain attribution/source URL, and prevent clipped figures/code. Do not depend on dark-theme colours for printed output.

## 9. Components

- NoteRow, CourseSelector, SemesterRow: factual location and availability; save controls stay separate from links.
- SubjectNavigation: collapsible units and clear current-note state.
- Breadcrumbs: semantic navigation with accessible full labels when shortened.
- TableOfContents: stable unique heading anchors and a current-section marker without moving keyboard focus on scroll.
- Callout: Definition, Example, Key point, Common mistake; label and icon supplement colour.
- CodeBlock: language, contrast-tested syntax, Copy code feedback, local horizontal overflow. Never widen the page.
- Diagrams: responsive SVG where possible, captions and meaningful text alternatives; enlargement must be keyboard usable.
- Equations: add accessible rendering only when content requires it; test zoom/overflow.
- Comparison content: semantic tables with captions/headers and labelled mobile overflow when necessary.
- Shared ThemeControl, ReadingPreferences, SearchField, EmptyState, ErrorState, skeletons, and drawer primitives.

## 10. Interaction and accessibility

Target WCAG 2.2 AA; the implementation must be tested, not inferred from tokens.

- Native semantic controls, labelled inputs, skip link, landmarks, one page h1, correct heading hierarchy.
- Keyboard menus, Escape dismissal, modal focus containment, and restored trigger focus.
- Announce route changes and meaningful search/save/copy updates; avoid announcements on every keystroke or scroll.
- Visible 2–3px focus outlines; selected/error/success states use words or indicators as well as colour.
- Text remains usable at 200% enlargement; reflow at 320 CSS pixels except inherently two-dimensional content.
- Support spacing overrides without clipping: 1.5 line height, paragraph spacing 2em, letter spacing 0.12em, word spacing 0.16em. These are test conditions, not required defaults.
- Aim for 44px touch targets; this is a product comfort target above the AA 24px target-size baseline and its exceptions.
- Respect reduced motion. Use 120–180ms control transitions and at most 200ms drawer entry. No reveal animation for prose.
- Theme initialisation happens before paint to prevent flashing; explicit preference overrides System.
- No hover-only essential actions or disabled pinch zoom. Loading reserves space. Distinguish failure from empty results.
- Handle clipboard/storage failure honestly; never claim a note was persistently saved when storage failed.

## 11. Modular frontend implementation

### Content architecture update

The user-created notesData structure is now the content contract: `notesData/MCA/syllabus.js` with `MCA/semesters/sem1/paper1/unit1/<note-id>/main.jsx`. One syllabus file per course supplies all catalogue metadata. `notesData/index.js` auto-discovers those files, builds the shared catalogue, and exposes generic selectors. Subject/unit/note data must never be copied into page components or another manually maintained array. Page components render shared layouts; note bodies remain beside their own assets. See content-system.md for the authoring contract. The supplied VBU syllabus version is now known: CBCS introduced for session 2020–22; current-intake applicability still needs confirmation.

Keep package.json, package-lock.json, and node_modules inside frontend. No workspace or admin/backend changes are needed.

- `src/config/`: site metadata and navigation.
- `src/app/main-website/`: existing route and global layout composition.
- `src/app/main-website/layouts/`: CatalogueLayout and ReaderLayout.
- `src/app/main-website/pages/`: Home, Course, Semester, Subject, Note, Search, Saved, About, Privacy.
- `pages/<Page>/components/`: page-specific components.
- `shared/components/`: navigation, breadcrumbs, note rows, states.
- `shared/hooks/`: theme, saved notes, reading settings, optional TOC observation.
- `shared/data/`: labelled fixtures and verified metadata during frontend development.
- `src/lib/`: content adapters and utilities.
- `src/ui/`: accessible primitive controls.
- `src/styles/`: tokens.css, typography.css, prose.css, print.css; imported by index.css.

Reuse installed React Router, Tailwind v4, Lucide, clsx, and tailwind-merge. Small hooks/context suffice for public reading preferences; no Redux or animation dependency is needed for this scope. Choose Markdown, sanitisation, syntax, and math packages only after note format is decided. Never render arbitrary unsanitised HTML.

Use a common content adapter so local data can later become API data. Metadata needs stable id/slug, title, summary, author, publication/update times, content type, syllabus identity, and course/subject/unit mappings. Drafts must not appear in public search/navigation.

## 12. Performance and search readiness

Prioritise text, small fonts, dimensioned media, route splitting, and lazy-loaded rich rendering where warranted. Limit or paginate search results; do not virtualise normal note prose. Working local search must not imply remote publishing exists.

Each public note needs unique metadata, a canonical URL, and crawlable content. Decide prerendering/SSR before public launch; the client-only Vite shell is an initial frontend, not the complete publication strategy. Check deep-route hosting behaviour and proper not-found responses. Keep preview deployments out of search.

## 13. Implementation order and validation

1. Theme tokens, font loading, typography, primitives, responsive shell.
2. Home/course/semester/subject discovery and honest empty/error states with labelled fixtures.
3. Note reader, subject navigation/TOC, prose blocks, mobile drawer, print.
4. URL-driven search, local saved notes, reading controls, share/copy feedback.
5. About/privacy, content metadata, launch rendering strategy.

Validate 320, 375, 768, 1024, 1280, 1440px in both themes. Inspect a realistic long note containing code, diagram, table, and long headings. Check keyboard flow, route focus, anchors, drawers, zoom, spacing overrides, reduced motion, real rendered contrast, filters/Back, storage/clipboard failure, print, and empty/loading/error states. Run frontend build/lint and visual checks.

Future scope: revision packs, quizzes, multilingual notes, offline access, account sync. Introduce navigation only when features work. Marketplace links should accompany relevant paid resources without interrupting free reading.

## 14. Sources and unresolved content

These primary references support font roles and accessibility criteria; palette selection remains a project design judgment.

- [Source Sans 3](https://github.com/adobe-fonts/source-sans): UI font project and licence.
- [Literata](https://github.com/googlefonts/literata): long-form-reading font project.
- [W3C contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).
- [W3C visual presentation](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation): additional AAA guidance informing line length; not claimed as an AA requirement.
- [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

The supplied MCA curriculum now identifies Vinoba Bhave University and the CBCS version introduced for session 2020–22, with all listed papers and detailed units imported. Applicability to the current intake, BCA syllabus, available authored notes, note format, and publication cadence remain to be confirmed. Imported syllabus outlines are not complete study notes.
