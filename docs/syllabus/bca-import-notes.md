# BCA syllabus import

Source: user-supplied `BCA.pdf`, retained at `docs/syllabus/BCA.pdf` and served unchanged at `/syllabus/BCA.pdf`. The document has 59 pages. Course structure and credits are on pages 1-3. Its stated CBCS introduction session is 2018-21. This is not a claim that the document applies to every current BCA intake.

The catalogue contains six semesters, 49 paper/option entries, 156 theory units, and 17 lab/project descriptions. Each of Semesters 5 and 6 has two elective alternatives, with one option contributing credits. Each semester totals 25 credits, for 150 credits when one elective per group is chosen. No BCA note is marked published by this import.

Navigation titles, paper codes, credits and total marks follow the structure tables. The detailed pages supply unit headings, unit text, external examination marks and practical guidance. Unit counts follow the actual document rather than assuming five per subject. Labs and project work have practical descriptions, not invented numbered units. Reference-book lists are excluded from unit text. Whitespace and Unicode dash punctuation are normalised; technical content and the source's question-allocation markers are retained.

## Source inconsistencies

- Business Communications uses BCA F1001 in the structure table and ENG F1001 in its detailed heading on page 11.
- Accounting and Financial Management, BCA C6003, is incorrectly headed Optimization Techniques on page 52. Its units cover accounting and financial management. The catalogue retains the table title, original detailed heading and a visible clarification.
- TALLY Lab uses BCA C6006 in the table and BCA P6006 on page 55.
- Management Information System uses BCA E6007 in the elective table and BCA E6006 on page 58.
- Artificial Intelligence uses BCA E6008 in the elective table and BCA E6007 on page 59.
- Java Programming Lab refers to Data and File Structure lab in its body while linking to BCA C3002.
- HTML Lab refers to BCA C4004, while HTML is listed as BCA C4003.
- Internet Concept and Web Design Lab refers to Visual Programming Lab in its body while linking to BCA C5001.

These conflicts are displayed on affected subject pages. Confirm the intended paper codes and practical references with the department rather than silently repairing the source.

## Reproduction and verification

`frontend/scripts/import-bca-syllabus.py` imports the retained PDF using pypdf. It refuses to overwrite a populated catalogue unless `--refresh` is explicitly supplied. Refresh is for reviewing the import, not routine builds; it overwrites imported metadata and must not be run after authoring chapter metadata without review.

`frontend/test/bca-syllabus.test.js` checks semester, paper, unit and practical counts, elective alternatives, absence of invented published notes, and source discrepancies. Normal build verification checks the static BCA routes, local source-PDF links, canonical metadata and sitemap membership. Rendered samples from the source are retained for visual review.

The BCA social card now says Six semesters. Syllabus and study planning. It was edited with the built-in image generation tool, preserving the previous card except for the availability line, then resized to 1200 x 630 and saved as `frontend/public/social-preview-bca-syllabus.png`.
