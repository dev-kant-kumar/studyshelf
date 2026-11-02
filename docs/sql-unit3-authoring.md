# DBMS Unit 3: SQL and backend engineering

## Location and scope

The expanded SQL material lives directly in MCA semester 1, DBMS paper 4, Unit 3. There is no separate Developer Shelf SQL course. The Developer Shelf links to the Unit 3 entry point.

Canonical entry: `/notes/mca-sem1-paper4-unit3-sql-foundations`.

Content source: `frontend/src/app/main-website/notesData/MCA/semesters/sem1/paper4/unit3/learning/`.

- `data/`: original explanations, commented examples, expected results, exercises, and primary references.
- `data/course.js`: learning sequence, original URL mappings, and topic links.
- `Unit3Lesson.jsx`: structured lesson rendering within the existing note reader.
- `SqlExample.jsx`: highlighted editing, explicit run action, actual/expected results, errors, and cancellation.
- `sql.worker.js`: fresh in-memory PostgreSQL practice database per run.
- `SqlDiagram.jsx`: accessible code-native diagrams with captions and text descriptions.

Thirty expanded lessons plus five retained college-focused topics produce 35 Unit 3 notes. All original 15 note URLs remain registered. Where a legacy note now hosts expanded material, its original explanations, DBMS selector, revision, and questions remain in the expandable college section. These use U3Student/U3Course, while the backend lessons use the separately named backend_lab shop schema. Do not imply that these datasets are interchangeable.

## Research and documentation approach

Primary engine baseline: [PostgreSQL 18 manuals](https://www.postgresql.org/docs/18/sql.html), including syntax, data types, constraints, queries, concurrency, indexing, EXPLAIN, and backup/restore. Application contracts use the [node-postgres documentation](https://node-postgres.com/features/queries). Security guidance uses [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

Documentation design draws on [Diataxis](https://diataxis.fr/) for the distinct needs of tutorials, task-oriented labs, explanation, and reference; [Google Technical Writing](https://developers.google.com/tech-writing/one) for clear audience-aware explanations; and [W3C WAI table guidance](https://www.w3.org/WAI/tutorials/tables/) for captions and header relationships. These are design references, not a claim of certification or complete conformance to an unspecified global standard.

Each lesson should establish a concrete skill, explain the relevant model, show executable examples, interpret the result, discuss a failure or boundary, and provide practice with a hint and an explained solution. Use diagrams for relationships or behavior, tables for comparisons/results, inline code for syntax, and emphasis for important distinctions. Avoid minimum word counts as a substitute for teaching quality.

## Executable verification

From `frontend`:

```text
npm run lint
npm test
npm run verify:sql
npm run build
```

`verify:sql` executes 102 SQL examples/solutions against embedded PostgreSQL 18.6, including 96 exact-result assertions. It resets the fixture between examples and compares driver-independent SQL values. Plan outputs and date-expression examples are executed but are not all compared to fixed text/timings. It does not infer teaching completeness from chapter counts.

The companion checkout implementation and independent-connection tests are downloadable from `/examples/sql-backend/`. They were run successfully on an isolated native PostgreSQL 18.6 cluster in Windows Temp, bound to localhost on a dedicated port. That temporary server was stopped afterwards. Four behavioral cases passed: idempotent replay/payload conflict, competing stock reservations, concurrent identical requests, and rollback after an injected downstream failure. The wrapper plus cases produces five passing Node test results.

Oracle and other legacy dialect examples retain their previous verification status; PostgreSQL execution does not establish their server compatibility. Role provisioning, RLS under a non-owner role, host backup/restore, migration lock behavior, and all manual two-session isolation experiments are documented labs, not automatically verified by the embedded checks.

## Practice engine boundaries

PGlite loads only after the learner clicks Run. Each run executes in a dedicated worker with a fresh in-memory fixture. Query text stays in the browser. Results show the actual server version, up to 100 displayed rows, errors with SQLSTATE when provided, and a stale-results notice after edits. Cancel and a 45-second worker deadline terminate runaway work; a statement timeout is also configured.

The browser has one connection and is not an Oracle emulator. Do not add a selector that relabels the engine or claims to execute translated SQL. Multi-session tests use the local PostgreSQL lab. The downloadable setup explicitly resets backend_lab and is labelled for disposable databases only.

PGlite adds a lazily loaded worker and engine assets (approximately 10 MB WASM and 6 MB filesystem data before transfer compression). Ordinary note reading must not initialize or fetch that engine. Dependency build warnings about third-party eval are not suppressed by weakening browser security settings.

## Maintaining the catalogue

Every expanded lesson must have a `main.jsx` in its canonical Unit 3 note directory and matching metadata in MCA `syllabus.js`. `dbms-unit3.test.js` checks that the expanded lessons load through Unit 3 and that all original topic sources survive. Changes to lesson title/summary must update their note metadata. Keep the official syllabus text and its 17 topic identifiers unchanged; supplemental backend material is clearly additional depth.

Prerendering must keep SVG accessibility titles inside SVGs rather than hoisting them into HTML metadata. Build verification counts page titles under head, separately from diagram titles.

## Learning, examination, and interview use

The introduction now teaches SQL from zero using a visible table, one-column SELECT, a token-by-token explanation, and a two-column SELECT before database-product distinctions. Installation is optional operational material. `data/studyGuides.js` supplies topic-specific prerequisites, plain-language learning bridges, formal definitions, examination model answers, interview questions, and follow-up reasoning across all 35 topics. These sections share the existing reader and appear in its table of contents. Browser engine implementation details no longer precede the first explanation.
