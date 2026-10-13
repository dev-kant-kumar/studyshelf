# MCA notes: authoring standard

Start with Semester 1; publish individual, coherent topics in syllabus order. Paper 1 Unit 1 now has 15 separate chapters covering all 15 distinct syllabus topics. The introduction URL is preserved. Semester 1 remains in progress.

Every note should include:

- Specific outcomes and explicit syllabus coverage.
- Prerequisites explained or linked to published notes.
- Clear definitions, worked examples, and reasoning steps.
- Relevant diagrams/code/tables rather than decorative assets.
- Common misconceptions and the conditions behind simplified models.
- Extra depth appropriate to MCA: trade-offs, correctness, complexity, systems implications, or practical application as relevant to the topic.
- Original practice questions, answer checkpoints, and a revision checklist.
- Verified primary references and clear next-topic boundaries.

Do not assume familiarity with a prerequisite because the student is enrolled in MCA. Introduce essential terms before using them. Do not call a unit complete until all its listed topics and required prerequisite material are covered.

Maintain the course registry in syllabus.js. Do not place notes or topic lists inside page components. Preserve stable IDs; future PYQs can reference the course/semester/paper/unit and stable note slug. Keep original practice questions distinct from verified PYQs. Add year, paper identity, question number, and source to PYQs when actual papers are supplied; never invent prior exam questions or frequency claims.

Next publication: Paper 1 Unit 2. Cover all Semester 1 theory papers and the supplied lab papers progressively. Lab material needs executable exercises and expected observations, not only theory summaries.


## Self-contained chapters and tagged Q&A

Teach prerequisite vocabulary in the chapter, develop mechanisms step by step, and include derived calculations, traced execution, complete worked cases, meaningful boundary tests, misconceptions, and answer explanations. Optional references must support verification rather than substitute for explanations. Do not claim that one chapter replaces an entire computing degree or covers an unfinished unit.

Use shared FAQ with plus/minus controls. Each question needs a stable id, level (easy/medium/hard), purpose tags, and a substantive answer. Tags include Concept check, Exam practice, Interview practice, Practical, and Curious learner. They indicate intended practice, not verified past-paper or employer provenance. Keep question data beside its own note.

Before declaring a unit complete, enumerate ALL topics from its syllabus under topics in syllabus.js. Normalise duplicate source wording without deleting any distinct topic; retain the original syllabusText. Map authored notes through coveredTopics; the catalogue rejects unknown topic IDs. The subject page shows covered and upcoming topics. Coverage means authored topic material exists, not that the student has mastered it. Review the actual depth before assigning a covered topic.

Current first-unit coverage: 15 of 15 topics, each mapped to a separate chapter. Network foundations precede data communication in reading order to introduce prerequisites; the coverage list retains syllabus topic order. Original practice is labelled separately from future verified PYQs. The source repeats Evolution of Computers; this is normalised to one topic while the original outline remains intact.
