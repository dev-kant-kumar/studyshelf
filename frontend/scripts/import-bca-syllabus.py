"""Import the supplied VBU BCA PDF. Refuse to overwrite an authored catalogue."""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
source = root.parent / 'docs/syllabus/BCA.pdf'
target = root / 'src/app/main-website/notesData/BCA/syllabus.js'
if target.exists() and 'semesters: []' not in target.read_text(encoding='utf-8') and '--refresh' not in sys.argv:
    raise SystemExit('BCA catalogue already populated; refusing to overwrite authored metadata.')
def clean(text):
    return text.replace('\u2014', '-').replace('\u2013', '-').replace('\ufffd', '-').replace('\u00ad', '').replace('\x00', '')
def squash(text):
    return re.sub(r'\s+', ' ', clean(text)).strip()
reader = PdfReader(source)
pages = [clean(page.extract_text()) for page in reader.pages]
rows=[]
for page_number in [1,2]:
    for match in re.finditer(r'^BCA\s+([FCP]\d{4})\s+(.+?)\s+(\d+)\s+(\d+)\s*$', pages[page_number-1], re.M):
        code,title,credits,marks=match.groups()
        rows.append((int(code[1]),code,squash(title),int(credits),int(marks),page_number))
assert len(rows)==45, len(rows)
rows += [(5,'E5007','E-Commerce',4,100,3),(5,'E5008','Software Testing',4,100,3),(6,'E6007','Management Information System',4,100,3),(6,'E6008','Artificial Intelligence',4,100,3)]
# Detailed pages follow the structure order except elective alternatives at the end.
detail_pages={}
for index,text in enumerate(pages[10:],11):
    code=re.search(r'\((?:BCA|ENG)[ -]*([FCP E]\d{4})\)',text)
    if code: detail_pages[code[1].strip()]=index
# The PDF disagrees with its structure table on these codes. Match by inspected title/page.
detail_pages.update({'F1001':11,'C6006':55,'E6007':58,'E6008':59})
notes={
 'F1001':'The structure table uses BCA F1001; the detailed page labels this paper ENG F1001.',
 'C6003':'The structure table names Accounting and Financial Management. PDF page 52 is headed Optimization Techniques (BCA C6003), but its five units cover accounting and financial management. The table title and detailed unit text are retained.',
 'C6006':'The structure table labels TALLY Lab BCA C6006; its detailed page uses BCA P6006.',
 'E6007':'The elective table uses BCA E6007 for Management Information System; the detailed page uses BCA E6006.',
 'E6008':'The elective table uses BCA E6008 for Artificial Intelligence; the detailed page uses BCA E6007.',
 'P3007':'The Java Programming Lab page refers to Data and File Structure lab in its body, while pointing to theory paper BCA C3002. The supplied wording is retained.',
 'P4008':'The HTML Lab page refers to theory paper BCA C4004, while the structure table lists HTML as BCA C4003. Confirm the intended reference with your department.',
 'P5005':'The Internet Concept and Web Design Lab page calls its exercises Visual Programming Lab while referring to BCA C5001. The supplied wording is retained.',
}
semesters=[]
for number in range(1,7):
    entries=[row for row in rows if row[0]==number]
    # Alternatives appear before practical entries, following the structure table's elective slot.
    entries.sort(key=lambda row: 2 if row[1].startswith('P') or row[1] in ['C6005','C6006'] else 1 if row[1].startswith('E') else 0)
    papers=[]
    for _,code,title,credits,marks,table_page in entries:
        page_number=detail_pages[code]
        text=pages[page_number-1]
        matches=list(re.finditer(r'^[ \t]*Unit[ \t-]*(\d+)[ \t]*[:.\-]?[ \t]*([^\n]*)',text,re.M|re.I))
        units=[]
        for j,m in enumerate(matches):
            end=matches[j+1].start() if j+1<len(matches) else len(text)
            body=text[m.end():end]
            body=re.split(r'^[ \t]*(?:TEXT\s*BOOKS?|REFER\w*\s*BOOKS?|REFERENCES|RECOMMENDED\s*BOOKS?)\b[ \t]*:?',body,flags=re.M|re.I)[0]
            heading=squash(m[2]).rstrip(':')
            if len(heading)>110:
                body=m[2]+'\n'+body
                heading=''
            units.append({'id':f'unit{m[1]}','number':int(m[1]),'title':heading or f'Unit {m[1]} syllabus','syllabusText':squash(body),'sourcePage':page_number,'notes':[]})
        practical = code.startswith('P') or code in ['C6005','C6006']
        paper={'id':f'paper{len(papers)+1}','code':f'BCA {code}','title':title,'kind':'elective' if code.startswith('E') else 'sessional' if practical else 'foundation' if code.startswith('F') else 'core','credits':credits,'marks':marks,'sourcePage':table_page,'detailPage':page_number,'detailTitle':next(line.strip() for line in text.splitlines() if '(' in line and ('BCA' in line or 'ENG' in line)),'units':units}
        exam=re.search(r'FULL MARKS\s*-\s*(\d+)',text)
        if exam: paper['examMarks']=int(exam[1])
        if practical:
            match=re.search(r'(Experiment problems|One month industrial project)[\s\S]*',text,re.I)
            assert match,code
            paper['practicalText']=squash(match[0])
        else: assert units,code
        if code.startswith('E'): paper['electiveGroup']='Elective I' if number==5 else 'Elective II'
        if code in notes: paper['sourceNote']=notes[code]
        papers.append(paper)
    # One option per elective group contributes to semester credits.
    sem_credits=sum(p['credits'] for p in papers if p['kind']!='elective')+(4 if number in [5,6] else 0)
    semesters.append({'id':f'sem{number}','number':number,'title':f'Semester {number}','credits':sem_credits,'papers':papers})
data={'id':'bca','name':'BCA','description':'Bachelor of Computer Applications','university':'Vinoba Bhave University, Hazaribag','universityLogo':'/illustrations/vbu-logo-64.webp','version':'CBCS, introduced for session 2018-21','versionNote':'This catalogue follows the supplied VBU BCA CBCS document introduced for 2018-21. Confirm applicability to your course and batch with your college. Syllabus outlines are available; BCA chapter notes have not yet been published.','source':{'file':'docs/syllabus/BCA.pdf','url':'/syllabus/BCA.pdf','label':'Read the supplied VBU BCA syllabus (PDF)','pages':len(pages)},'semesters':semesters}
assert sum(len(s['papers']) for s in semesters)==49
assert all(len({u['number'] for u in p['units']})==len(p['units']) for s in semesters for p in s['papers'])
target.write_text('// Imported from the supplied VBU BCA syllabus. See docs/syllabus/bca-import-notes.md.\nexport default '+json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'semesters':len(semesters),'papers':sum(len(s['papers']) for s in semesters),'units':sum(len(p['units']) for s in semesters for p in s['papers']),'practicalEntries':sum('practicalText' in p for s in semesters for p in s['papers']),'credits':[s['credits'] for s in semesters]}))
