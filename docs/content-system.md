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

From frontend: `npm run test`, `npm run build`, `npm run lint`. Catalogue tests cover imported counts, published note propagation, metadata edits, draft exclusion, missing files, and invalid/duplicate IDs.

The public frontend includes themes, saved notes, reading preferences, search, and reader layouts. A development-only reader fixture at /dev/reader allows layout checks without publishing notes. Prerendering/server rendering and publishing services remain separate launch work.


## Unit 1 topic chapters

Paper 1 Unit 1 has 15 separately routed chapters. Each note maps exactly one distinct source topic through `coveredTopics`. Keep the original introduction slug stable. The source repeats Evolution of Computers; the original outline is retained while its distinct-topic checklist contains one entry.

New structured chapters store teaching sections, worked examples, comparisons, revision prompts, tagged questions with stable IDs, and primary references in `chapter.json`, rendered by the local `unit1/TopicChapter.jsx`. Their `main.jsx` entry points retain the existing folder discovery contract. Rich custom chapters remain ordinary JSX. Use easy, medium, and hard question levels and purpose tags; these are original practice, not PYQs.
