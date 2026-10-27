# SQL learning coverage audit

Audited 27 October 2026. Scope: current MCA semester 1 DBMS Unit 3 chapters, related Unit 1 material, the SQL section of the backend roadmap, and the shared lesson/editor implementation. This is a curriculum assessment, not a claim that every page on the site was exhaustively reviewed.

## Finding

Unit 3 is a compact syllabus-oriented introduction. It is not yet a self-contained SQL course or a PostgreSQL backend development course. The chapter structure covers the named Unit 3 syllabus areas, but broad titles hide substantial teaching gaps. More diagrams alone will not fix this.

The backend roadmap already identifies many appropriate skills. A checklist item is not a lesson, a runnable example, or evidence that a student can apply the skill.

## Measured inventory

Source: `frontend/src/app/main-website/notesData/MCA/semesters/sem1/paper4/unit3/*/chapter.json`.

- 15 chapters; 24 section-level code examples; 46 FAQ entries.
- Approximately 7,472 instructional word tokens across introductions, section paragraphs, and worked-example explanations. Counted with Python regex `\b[\w]+\b`; excludes SQL, outcomes, headings, tables, lists, FAQs, and revision material. This measures compression, not quality or mastery.
- Basic SQL: 532 such tokens and two section code examples, despite covering SELECT, filtering, operators, aliases, ordering, INSERT, UPDATE, and DELETE.
- Advanced SQL: 527 such tokens and three section code examples, spanning joins, logical query stages, CTEs, windows, and top-N reasoning.
- Six dialect choices are available. Repeated dialect versions are not six different teaching examples.
- Shared schema, diagrams, expected-result explanations, downloadable scripts, and SQLite checks are useful foundations.
- The editor supports editing and copying, but has no execution/result feedback loop. SQLite verification does not validate the PostgreSQL or Oracle versions on those servers.

### Chapter evidence

Counts below are section code examples, not independent exercises or mastery scores.

- SQL foundations: 3 examples. Dataset creation and inspection; SQL versus procedural SQL. Needs a complete installation/connection/tooling path and a slower first-query sequence.
- Basic SQL: 2. Important operators appear together in prose. Needs separate worked lessons for predicates, DISTINCT, sorting, INSERT, UPDATE, DELETE, and safe changes.
- Advanced SQL: 3. Needs independently explained join types, join cardinality, CTEs, window functions, and deliberate practice for each.
- Database languages: 1. Binding template and transaction discussion; no end-to-end application driver lesson.
- Set operations: 1. Worked difference query; UNION, UNION ALL, and INTERSECT need their own contrasting examples and exercises.
- Aggregate functions: 2. Useful starting point; expand empty groups, NULL behavior, join fan-out, conditional aggregation, and multiple grouping scenarios.
- NULL values: 3. Useful truth-table and NOT EXISTS material; retain and extend with COALESCE, NULLIF, and application-facing cases.
- Views: 1. Expand update rules, security boundaries, and PostgreSQL materialized-view maintenance with examples.
- Subqueries: 1. Expand scalar, correlated, EXISTS, IN, ANY, and ALL into worked comparisons with cardinality and NULL cases.
- Integrity constraints: 1. Good conceptual starting point; add complete successful/failing writes and referential-action scenarios.
- SQL constraints: 1. Expand defaults, identity/generated values, ALTER TABLE, schema evolution, and constraint errors.
- Indexing: 2. Introductory index design and plan commands. Needs measured plans on meaningful data volumes and before/after reasoning.
- Cursors: 1. Retain for syllabus/procedural SQL; add lifecycle and failure cases. Do not prioritize ahead of everyday application SQL.
- Stored procedures: 1. A count procedure is a beginning; add parameter modes, functions versus procedures, errors, and application calls.
- Triggers: 1. Includes useful NULL-aware audit and multi-row considerations. Needs more guided scenarios and documented backend trade-offs.

## Benchmark: what W3Schools contributes

[W3Schools SQL tutorial](https://www.w3schools.com/sql/default.asp) separates many individual language features into discoverable lessons. It pairs explanations and examples with a browser editor and exercises, and provides reference material separately.

The relevant pattern is concept -> syntax -> sample data -> query -> result -> explanation -> learner practice. It is not simply a longer introduction or a larger sidebar. We should write original explanations and examples rather than copy its lessons.

W3Schools is a useful benchmark for approachable SQL fundamentals. It is not the sole definition of PostgreSQL backend competence. PostgreSQL's [SQL language documentation](https://www.postgresql.org/docs/current/sql.html) provides the broader baseline for types, schemas, privileges, data modification, queries, functions, concurrency, and performance.

## Required learning areas and current gaps

These are qualitative assessments against a proposed backend learning path. They are not percentages of the SQL language.

1. **Getting started - incomplete.** Add PostgreSQL installation or container setup, connection settings, psql/GUI use, creating a scratch database, executing scripts, inspecting tables, resetting fixtures, and reading errors. Give Oracle learners an equivalent setup path.
2. **Everyday query syntax - introduced, too compressed.** Teach selection, aliases, DISTINCT, comparison/logical operators, precedence, LIKE, IN, BETWEEN, NULL tests, ordering, and limits separately with results and exercises.
3. **CRUD - partial.** Add dedicated INSERT/UPDATE/DELETE lessons, multiple-row writes, INSERT SELECT, PostgreSQL RETURNING and ON CONFLICT, affected-row checks, and safe transaction-based practice.
4. **Expressions and functions - insufficient.** Add CASE, COALESCE, NULLIF, casts, arithmetic/precision, text functions, date/time arithmetic, and deliberate handling of missing values.
5. **Data types - insufficient for backend work.** Teach numeric precision, booleans, text, UUID, timestamps/time zones, JSONB, arrays, and driver-side conversions. Separate everyday essentials from advanced reference material.
6. **Relationships and joins - partial.** Cover inner/left/right/full/cross/self joins, many-to-many tables, duplicate amplification, ON versus WHERE for outer joins, and NULL-extended results.
7. **Grouping and analytical queries - partial.** Expand aggregates/HAVING, conditional aggregates, subquery forms, CTE composition, recursive CTEs, windows, frames, ranking, LAG/LEAD, and ties. Recursion and advanced frames can follow core backend competence.
8. **Schema design and change - partial foundations.** Unit 1 supplies related concepts, but add applied normalization, key choices, constraints, referential actions, schemas, identity/default/generated values, ALTER TABLE, migrations, seeds, and safe deployment changes.
9. **Transactions and concurrency - conceptual introduction only.** Add reproducible two-session isolation, lost-update prevention, row locks, deadlocks, retries, savepoints, and invariant-preserving writes. Related Unit 1 diagrams are not a substitute for executable labs. See [PostgreSQL concurrency control](https://www.postgresql.org/docs/current/mvcc.html).
10. **Backend integration - roadmap, not taught workflow.** Add driver connection, bound parameters, dynamic identifier allowlists, pools, same-client transactions, release/rollback on failure, timeouts, SQLSTATE handling, pagination, and testing. The [node-postgres transaction guide](https://node-postgres.com/features/transactions) demonstrates the same-client transaction requirement; the [pooling guide](https://node-postgres.com/features/pooling) covers connection lifecycle.
11. **Performance - introductory.** Teach EXPLAIN ANALYZE with actual plans, estimates versus actual rows, buffers, selectivity, composite/partial/expression indexes, write overhead, offset versus keyset pagination, and ORM N+1 queries. Use sufficiently large reproducible fixtures.
12. **Security and operations - mentions/checklists, not a complete learning path.** Add practical least-privilege roles, injection prevention, configuration/secrets, migrations, backup/restore verification, and basic slow-query diagnosis. Row-level security and deeper administration can be advanced tracks.

## Proposed structure

Maintain one canonical lesson library with two navigation paths rather than duplicating all content:

- **MCA Unit 3 path:** syllabus mapping, Oracle SQL/PLSQL examples, exam questions, procedural topics, and practical lab tasks.
- **SQL for backend developers path:** common SQL foundations followed by a coherent PostgreSQL application track. Link Unit 3 lessons where suitable.

Keep DBMS selection, but explain semantic differences as well as syntax changes. An unsupported feature needs an honest explanation or alternative, not an apparently equivalent translation. Verify each advertised executable dialect on its engine before claiming it was tested.

### Delivery order

1. Rebuild foundations and everyday SQL into focused lessons, with predictable datasets and query/result explanations. Fix the beginner learning sequence before adding more advanced headings.
2. Expand relationships, aggregation, subqueries, CTEs, and windows into separate learnable units. Add complete schema design and data-type lessons.
3. Add PostgreSQL backend labs: parameterized CRUD API, pagination, migrations, pooling, transactions, concurrency, and index/plan diagnosis.
4. Complete Oracle procedural depth and advanced PostgreSQL/reference material, keeping both paths connected to shared foundations.
5. Add a practice execution/result experience with clear engine identity and reset behavior. Browser SQLite must not be presented as executing PostgreSQL or Oracle SQL. Local execution instructions should remain complete even before an online runner exists.

## Definition of a finished lesson

- One clear skill, prerequisites, and an explanation that does not assume unexplained vocabulary.
- Syntax with parameter/keyword explanations and documented dialect differences.
- Visible input rows, executable examples, expected output, and reasoning about why those rows appear.
- Multiple contrasting cases, including realistic mistakes and relevant NULL, duplicate, empty-result, or boundary cases.
- A diagram where relationships, execution stages, or concurrency are easier to understand visually.
- Independent exercises with expected behavior, hints, and explained solutions. FAQs supplement practice; they do not replace it.
- A backend use case where applicable, plus a concise revision/reference section and next lesson.
- Engine/version verification for runnable claims. Automated content-shape checks alone do not establish teaching quality.

Do not impose a minimum word count as a quality gate. A narrow predicate lesson can be short; joins and concurrency require substantially more worked reasoning.

## Completion evidence for the backend path

A learner should be able to build a small users/products/orders/inventory API using PostgreSQL: design constraints, implement parameterized queries, paginate consistently, migrate a schema, preserve stock under concurrent orders, recover from transaction failures, diagnose a slow query with a plan, and restore a backup. Supply the project, fixtures, tests, expected outcomes, and explained solutions inside Study Shelf.

The goal is a self-contained learning journey. Primary documentation remains linked for version-specific details and deeper reference, rather than being required to fill missing explanations in the core lessons.
