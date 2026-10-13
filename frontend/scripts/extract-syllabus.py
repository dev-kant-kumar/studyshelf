"""One-time import of the user-supplied PDF; not a runtime dependency.

Run only for a fresh import. Refuses to overwrite authored syllabus metadata.
"""
import json
import re
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'docs/syllabus/MCASyllabus.pdf'
TARGET = ROOT / 'src/app/main-website/notesData/MCA/syllabus.js'
if TARGET.exists() and TARGET.read_text(encoding='utf-8').strip():
    raise SystemExit('syllabus.js already contains data; import would overwrite authored metadata.')
reader = PdfReader(SOURCE)
pages = [page.extract_text() for page in reader.pages]
rows = re.findall(r'MCA\s+([CEP]\d{4})\s+(.+?)\s+(\d+\.\d)\s+(\d+)', '\n'.join(pages[6:8]))
assert len(rows) == 36, f'Expected 36 course entries, found {len(rows)}'
semester_papers = {i: [] for i in range(1, 5)}
for code, title, credits, marks in rows:
    semester = int(code[1])
    paper_id = f'paper{len(semester_papers[semester]) + 1}'
    detail = next(((i + 1, text) for i, text in enumerate(pages[8:], 8)
                   if re.search(r'\(MCA\s+' + code + r'\)', text)), None)
    units = []
    detail_title = None
    if detail:
        page_number, text = detail
        detail_title = next(line.strip() for line in text.splitlines() if f'(MCA {code})' in line)
        headings = list(re.finditer(r'^\s*UNIT[\s-]*(\d+)\s*:?\s*(.*)$', text, re.M | re.I))
        for index, heading in enumerate(headings):
            end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
            body = text[heading.end():end]
            body = re.split(r'\n\s*(?:Text\s*Books?|Reference\s*Books?|References)\s*:', body, flags=re.I)[0]
            units.append({'id': f'unit{heading[1]}', 'number': int(heading[1]),
                          'title': heading[2].strip().rstrip(':'),
                          'syllabusText': re.sub(r'\s+', ' ', body).strip(),
                          'sourcePage': page_number, 'notes': []})
    paper = {'id': paper_id, 'code': f'MCA {code}', 'title': title.strip(),
             'kind': 'elective' if code[0] == 'E' else 'sessional' if code[0] == 'P' else 'core',
             'credits': float(credits), 'marks': int(marks),
             'sourcePage': 7 if semester <= 2 and code[0] != 'E' else 8,
             'detailPage': detail[0] if detail else None,
             'detailTitle': detail_title, 'units': units}
    if code[0] == 'E':
        paper['electiveGroup'] = 'Elective I' if semester == 2 else 'Elective II'
    semester_papers[semester].append(paper)
    paper_dir = TARGET.parent / f'semesters/sem{semester}/{paper_id}'
    paper_dir.mkdir(parents=True, exist_ok=True)
    (paper_dir / '.gitkeep').touch()
    for unit in units:
        unit_dir = paper_dir / unit['id']
        unit_dir.mkdir(exist_ok=True)
        (unit_dir / '.gitkeep').touch()
data = {'id': 'mca', 'name': 'MCA', 'description': 'Master of Computer Applications',
        'university': 'Vinoba Bhave University, Hazaribag',
        'version': 'CBCS, introduced for session 2020–22',
        'versionNote': 'Imported from the supplied PDF; applicability to the current intake is not independently confirmed.',
        'source': {'file': 'docs/syllabus/MCASyllabus.pdf', 'pages': 32},
        'semesters': [{'id': f'sem{i}', 'number': i, 'title': f'Semester {i}',
                       'credits': 30, 'papers': semester_papers[i]} for i in range(1, 5)]}
TARGET.write_text('// Single source of truth for this course. Content lives in semesters/ folders.\n'
                  'export default ' + json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
summary = ['# Imported MCA syllabus', '', data['university'], data['version'], '', data['versionNote'],
           '', 'Course titles follow the structure tables on PDF pages 7–8. Detailed-page titles are retained separately where they differ.',
           'Elective options are alternatives within each elective group, not additional compulsory papers.',
           'Labs/sessionals without detailed unit descriptions remain unit-free; no lab syllabus is invented.', '']
for semester in data['semesters']:
    summary += [f"## {semester['title']}", '']
    for paper in semester['papers']:
        summary += [f"- {paper['code']}: {paper['title']} ({paper['kind']}, {paper['credits']:g} credits, {paper['marks']} marks)"]
    summary.append('')
(ROOT.parent / 'docs/syllabus/mca-syllabus-summary.md').write_text('\n'.join(summary), encoding='utf-8')
print(f'Imported {len(rows)} papers, {sum(len(p["units"]) for s in semester_papers.values() for p in s)} units, no authored notes.')
