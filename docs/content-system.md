# Folder-based notes system

## Your structure is the contract

```
frontend/src/app/main-website/notesData/
  index.js                         # shared catalogue API; not edited for new content
  buildCatalogue.js                # validates and derives data
  MCA/
    syllabus.js                    # edit this ONE file for MCA metadata
    semesters/
      sem1/
        paper1/
          unit1/
            introduction/
              main.jsx            # authored note body
              diagram.svg         # optional local assets
  BCA/
    syllabus.js                    # separate course metadata; currently empty
```

Follows Unyrise Tech's blog discovery pattern: eager metadata and lazy React content. Vite discovers course syllabus files and note components automatically. Routes are generic. No page-specific subject arrays are needed.

## Add a note

1. Create `MCA/semesters/sem1/paper1/unit1/introduction/main.jsx`.
2. Default-export a React component containing only the note body; the shared reader supplies title, context, and navigation.
3. In `MCA/syllabus.js`, find sem1 → paper1 → unit1 and add this entry to its `notes` array:

```js
notes: [
  {
    id: 'introduction',
    title: 'Introduction to computers',
    summary: 'What a computer is and the role of its main components.',
    status: 'draft',
    order: 1,
    tags: ['computers', 'fundamentals'],
    // updatedAt: 'YYYY-MM-DD', // actual update date when ready
  },
]
```

Change status to `published` only after writing the note. The note then appears in subject lists, the reader sidebar, search, and derived counts. Its URL is `/notes/mca-sem1-paper1-unit1-introduction`.

```jsx
// unit1/introduction/main.jsx
import Diagram from './diagram.svg'
export default function Introduction() {
  return <>
    <h2>What is a computer?</h2>
    <p>Write your explanation here.</p>
    <img src={Diagram} alt="Describe the meaningful relationships in the diagram" />
  </>
}
```

The optional diagram import requires an actual file; omit it if none exists. Keep content/assets in this note folder. Global navigation, titles, and syllabus metadata do not belong in main.jsx.

## Add a subject or unit

Create a paper folder within the chosen semester, such as `sem1/paper10`. Add its metadata to that semester's `papers` array in the same syllabus.js. Add unit entries and matching folders below it. Required IDs use lowercase letters/numbers and optional hyphens.

```js
{
  id: 'paper10',
  code: 'your supplied code',
  title: 'Your subject title',
  kind: 'core',
  credits: 4,
  marks: 100,
  units: [
    { id: 'unit1', number: 1, title: 'Your unit title', notes: [] },
  ],
}
```

This is a structural example, not a university subject to publish without verification. Source fields are optional for future manually authored subjects. Adding a folder alone cannot supply its name or syllabus; the single syllabus file registers that information. Files not listed as published notes do not create catalogue links.

## Add a course

Create `notesData/<CourseFolder>/syllabus.js` with a default export containing id, name, description, and semesters. The discovery glob adds it to Home and Header automatically. No new route is necessary. BCA already has a course placeholder with no fabricated semester data.

## What auto-sync means

- In development, Vite hot reload picks up syllabus changes and new matched files. All pages import the same derived catalogue.
- Production requires rebuilding and redeploying after local file edits. This is build-time discovery, not server-side filesystem monitoring.
- IDs determine folders and URLs: keep IDs stable when changing display titles. Changing IDs requires moving folders and redirecting old public URLs.
- Drafts are filtered from public catalogue, reader lookup, and search. This is editorial hiding, not security: frontend files may still be emitted as assets. Do not put secrets or private documents in the frontend.
- A published note with missing content, duplicate IDs, or invalid IDs fails validation instead of silently making a broken page.
- The registry is one syllabus.js per course, with index.js as the single shared read API. There is no second manually maintained course/subject list.

## Imported PDF

Original: docs/syllabus/MCASyllabus.pdf. Full raw extraction: mca-syllabus-extracted.md. Readable paper index: mca-syllabus-summary.md.

Vinoba Bhave University, Hazaribag; two-year MCA; CBCS introduced for session 2020–22. Current-intake applicability is not independently verified. The supplied structure contains 18 core theory papers, 6 elective alternatives, and 12 sessional/project entries across 4 semesters. The six elective alternatives are not six additional compulsory papers.

The 120 detailed units are imported as syllabus outlines, not authored study notes. Lab/project entries with no detailed unit descriptions remain empty. Keep source titles/code/credits/marks: some detailed-page headings differ from the course-structure table, and both are retained. Raw extraction preserves source wording and occasional PDF spacing artefacts. Refer to the PDF for exact tables, equations, and reading lists.

The one-time extraction script refuses to overwrite a populated syllabus.js so rerunning it cannot silently erase authored metadata.

## Checks

Shared code blocks resolve language names, aliases, filenames/extensions, and common MIME labels through the CodeMirror language catalogue. Grammars load on demand and are cached by the language description; destroying an editor cancels applying late grammar results. Plain-text and unrecognised educational labels remain plain text. Use accurate labels such as `c`, `sql`, `postgresql`, `js`, `tsx`, `python`, `bash`, `html`, or `json`; no per-chapter highlighter registration is needed. The language tests load every bundled grammar and check representative syntax tokens, including the SQL regression.

From frontend: `npm run test`, `npm run build`, `npm run lint`. Catalogue tests cover imported counts, published note propagation, metadata edits, draft exclusion, missing files, and invalid/duplicate IDs.

The public frontend includes themes, saved notes, reading preferences, search, and reader layouts. A development-only reader fixture at /dev/reader allows layout checks without publishing notes. Prerendering/server rendering and publishing services remain separate launch work.


## Unit 1 topic chapters

Paper 1 Unit 1 has 15 separately routed chapters. Each note maps exactly one distinct source topic through `coveredTopics`. Keep the original introduction slug stable. The source repeats Evolution of Computers; the original outline is retained while its distinct-topic checklist contains one entry.

New structured chapters store teaching sections, worked examples, comparisons, revision prompts, tagged questions with stable IDs, and primary references in `chapter.json`, rendered by the local `unit1/TopicChapter.jsx`. Their `main.jsx` entry points retain the existing folder discovery contract. Rich custom chapters remain ordinary JSX. Use easy, medium, and hard question levels and purpose tags; these are original practice, not PYQs.

## Data Structures through C: Unit 1

Paper 2 Unit 1 has 14 separately routed chapters covering history and importance, sample programming, program structure and execution, constants/variables/types/declarations, operators and expressions, precedence and associativity, mathematical and character functions, branching, loops, one-dimensional arrays, two-dimensional arrays, multidimensional arrays, dynamic arrays, and strings. Each chapter maps to its own topic in syllabus.js; the original source outline remains intact.

Content lives under `MCA/semesters/sem1/paper2/unit1/`, with local chapter.json data and a local TopicChapter.jsx renderer using shared code blocks and tagged FAQ. Examples target C11. Dynamic arrays introduce necessary pointer and ownership vocabulary before Unit 2. All 15 complete C examples were compiled with GCC using `-std=c11 -Wall -Wextra -Wpedantic -Werror` and executed; the marks example also passed valid-boundary and invalid-input checks. Allocation-failure behaviour is explained and reviewed, but was not forced during execution.

## Database Management System: Unit 1

Paper 4 Unit 1 has 15 separately routed chapters, one per distinct syllabus topic, in source order. The original syllabus wording remains intact. Chapters live under `MCA/semesters/sem1/paper4/unit1/`, using local `chapter.json` files and `TopicChapter.jsx`. Fifty-four accessible SVG diagrams illustrate the mechanisms; 54 original questions have stable IDs, difficulty levels, purpose tags, and complete answers. No questions are presented as verified PYQs.

The connected college example introduces prerequisite vocabulary, worked cases, SQL, comparisons, misconceptions, and review checklists. References include database vendor documentation and university teaching material. SQL blocks use the shared editable code component; editing does not execute SQL. The complete view and relational examples were checked using SQLite for their portable SQL subset, including expected rows, foreign-key rejection, duplicate-key rejection, mark bounds, and NULL aggregation. PostgreSQL-specific metadata inspection and view update behaviour were reviewed against PostgreSQL documentation, not executed against a PostgreSQL server.

The DBMS types chapter gives each of its nine data models a dedicated explanation and structural diagram. Six additional visuals explain deployment and concurrent-use classifications, and one compares OLTP with OLAP. The local renderer supports nested teaching subsections so each figure stays beside the type it explains.

The remaining 14 DBMS Unit 1 chapters include 28 additional worked diagrams covering lost updates, fact ownership, integrity, user perspectives, metadata maintenance, schema changes and states, both forms of independence, ER associations, role and identity boundaries, recovery intervals, index trade-offs, query strategies, buffering and WAL, deployment tiers, relational operations, and view filtering, update ambiguity, and freshness. Each figure has alt text, an explanatory caption, and explicit dimensions. A font-metric check verifies text fits the new diagrams; the production build verifies the rendered routes and assets.

The DBMS structure chapter now provides a full component map, entry-path and terminology reference, per-stage inputs and outputs, catalogue and storage roles, scheduling and recovery, a complete SQL dataset and trace, an illustrative physical operator tree, stated cost assumptions, diagnostic cases, practical variations, and 12 full answers. The SQL companion is served at `/examples/dbms-structure-lab.sql`; it matches the displayed setup and query. SQLite execution verified the result and predicate variants, NULL handling, foreign-key/key/range failures, failed-unit rollback, and the successful guarded seat transaction. PostgreSQL plan commands and internals are documented with primary references; no PostgreSQL plan or timing is claimed as observed output.


## SQL database variants

SQL code blocks offer PostgreSQL (default), Oracle, MySQL, MariaDB, SQLite, and SQL Server. The reader's choice is stored with reading preferences and shared across blocks and pages. Syntax highlighting follows the selected dialect. Each block retains separate temporary edits per database; Copy and Reset apply to the selected version. Editing does not execute SQL.

For structured DBMS chapters, provide `sqlVariants` beside `code` and `language: "sql"`. Keys are `postgresql`, `oracle`, `mysql`, `mariadb`, `sqlite`, and `sqlserver`; each value contains `code`, a platform-specific `note`, and optionally `download: { href, filename }`. Keep the baseline `code` equal to the PostgreSQL variant. Author and review real variants instead of translating arbitrary SQL with string replacement. Missing variants explicitly display Original SQL without claiming compatibility.

All eight current SQL examples have six authored variants. Complete structure, relational, and view labs have matching downloads in `frontend/public/examples/`. Oracle examples target 19c-compatible syntax; SQL Server notes identify client batch separators. Version and transaction requirements appear beside the code. Tests verify variant coverage, preference migration, language resolution, download consistency, and important dialect differences. The three SQLite downloads were executed in isolated in-memory databases; the structure fixture also passed expected-row, foreign-key, duplicate-key, and mark-bound checks. Other database variants were reviewed against vendor documentation but not executed on those servers.


## MCA professor directory

`pages/Professors/facultyData.js` holds seven selected faculty listings transcribed from the official VBU MCA page, retrieved 27 October 2026. Stable IDs resolve individual `/professors/:professor` pages and are referenced by routine entries instead of duplicating names and contact details. The directory supports name, specialization, and qualification search. Profiles preserve published contacts, report source experience without recalculating it, and disclose the source's missing update date. No timetable or current teaching assignments are inferred from faculty specializations. The supplied MCA Semester 1 routine is now available; remaining schedules are pending.

The directory is linked from MCA, the VBU guide, and the footer. All profile routes are prerendered with canonical metadata. Validate faculty updates against the source and retain provenance; do not infer degrees, titles, present employment, or office hours. The linked legacy Word profiles are not imported because the sampled source link returned 404.

The directory covers BCA and MCA teaching, confirmed by the project owner. Both course pages link to the same faculty records; the official MCA page remains the source for biographical and contact details. Each faculty record lists both course IDs for routine associations.


## Class routines and departmental staff

`pages/Routine/routineData.js` stores supplied schedules independently of the syllabus catalogue. MCA Semester 1 is transcribed from the project owner's image at `/routines/mca-sem1.png`; source receipt date is 27 October 2026, not an effective date. Preserve merged two-hour labs, the daily recess, library, and tutorial. No BCA or other semester schedule is inferred. `/routine` uses shareable course, semester, view, and day query parameters. Today, current sessions, and next classes use Asia/Kolkata time and update every 30 seconds. This is a regular weekly routine, not a holiday calendar or cancellation service.

The faculty data also includes four departmental staff from the official page's image labels. They remain separate from professors and have no inferred academic title, qualification, or contact information. The source spells Arshad Alam as "arsad alam" in the image label and uses "Md.Arshad-Alam.pdf" for the linked profile; the display name is normalized while `sourceName` retains the label. Linked staff PDFs could not be retrieved (www paths returned 404; the bare host failed certificate validation). AK resolves to Abhishek Kumar and AA to Arshad Alam for lab/library assignments. Other routine abbreviations resolve to stable professor IDs. New schedules should reuse those IDs and retain source provenance.

Routine displays use syllabus paper numbers and full paper titles (including distinct lab papers) plus full staff names. Source abbreviations remain internal transcription keys and are not shown in the day view, weekly view, or current-session banner.
