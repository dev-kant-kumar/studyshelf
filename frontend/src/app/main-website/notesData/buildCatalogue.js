const validId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function unique(items, context) {
  const ids = new Set();
  for (const item of items) {
    if (typeof item.id !== "string" || !validId.test(item.id))
      throw new Error(`${context}: invalid ID ${item.id}`);
    if (ids.has(item.id))
      throw new Error(`${context}: duplicate ID ${item.id}`);
    ids.add(item.id);
  }
}

// Pure builder shared by Vite discovery and tests. Pages maintain no course arrays.
export function buildCatalogue(syllabusModules, contentModules) {
  const courses = [],
    notes = [];
  for (const [path, module] of Object.entries(syllabusModules)) {
    const match = path.match(/^\.\/([^/]+)\/syllabus\.js$/);
    if (!match) throw new Error(`Unexpected syllabus path: ${path}`);
    const folder = match[1],
      source = module.default;
    if (!source?.name || !source.description)
      throw new Error(`${path}: course name and description required.`);
    unique([source], path);
    unique(source.semesters ?? [], `${source.id} semesters`);
    const course = {
      ...source,
      folder,
      href: `/courses/${source.id}`,
      semesters: [],
    };
    for (const semester of source.semesters ?? []) {
      if (!Number.isInteger(semester.number) || semester.number < 1)
        throw new Error(`${semester.id}: invalid semester number.`);
      unique(semester.papers ?? [], `${source.id}/${semester.id} papers`);
      const sem = {
        ...semester,
        href: `${course.href}/semesters/${semester.id}`,
        papers: [],
      };
      for (const paper of semester.papers ?? []) {
        if (!paper.title) throw new Error(`${paper.id}: paper title required.`);
        unique(paper.units ?? [], `${semester.id}/${paper.id} units`);
        const subject = {
          ...paper,
          href: `${sem.href}/subjects/${paper.id}`,
          units: [],
        };
        for (const unit of paper.units ?? []) {
          if (!unit.title)
            throw new Error(`${paper.id}/${unit.id}: unit title required.`);
          unique(unit.notes ?? [], `${paper.id}/${unit.id} notes`);
          unique(unit.topics ?? [], `${paper.id}/${unit.id} topics`);
          const section = {
            ...unit,
            href: `${subject.href}#${unit.id}`,
            notes: [],
          };
          for (const note of unit.notes ?? []) {
            if (!["draft", "published"].includes(note.status))
              throw new Error(`${note.id}: status must be draft or published.`);
            if (note.coveredTopics?.some(id => !unit.topics?.some(topic => topic.id === id)))
              throw new Error(`${note.id}: unknown covered topic`);
            if (note.status === "draft") continue;
            if (!note.title || !note.summary)
              throw new Error(
                `${note.id}: published title and summary required.`,
              );
            const contentPath = `./${folder}/semesters/${semester.id}/${paper.id}/${unit.id}/${note.id}/main.jsx`;
            const loadComponent = contentModules[contentPath];
            if (typeof loadComponent !== "function")
              throw new Error(`${note.id}: missing content ${contentPath}`);
            const slug = `${source.id}-${semester.id}-${paper.id}-${unit.id}-${note.id}`;
            const entry = {
              ...note,
              slug,
              href: `/notes/${slug}`,
              courseId: source.id,
              semesterId: semester.id,
              paperId: paper.id,
              unitId: unit.id,
              courseName: source.name,
              paperTitle: paper.title,
              loadComponent,
            };
            section.notes.push(entry);
            notes.push(entry);
          }
          section.notes.sort(
            (a, b) =>
              (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
          );
          section.topicCoverage = (unit.topics ?? []).map(topic => ({
            ...topic,
            notes: section.notes.filter(note => note.coveredTopics?.includes(topic.id)),
          }));
          subject.units.push(section);
        }
        subject.noteCount = subject.units.reduce(
          (n, unit) => n + unit.notes.length,
          0,
        );
        sem.papers.push(subject);
      }
      sem.noteCount = sem.papers.reduce((n, paper) => n + paper.noteCount, 0);
      course.semesters.push(sem);
    }
    course.semesters.sort((a, b) => a.number - b.number);
    course.noteCount = course.semesters.reduce(
      (n, semester) => n + semester.noteCount,
      0,
    );
    courses.push(course);
  }
  unique(courses, "courses");
  unique(
    notes.map((note) => ({ id: note.slug })),
    "note slugs",
  );
  courses.sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
  );
  return { courses, notes };
}
