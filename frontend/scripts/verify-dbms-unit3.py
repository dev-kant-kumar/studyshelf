"""Execute Unit 3's SQLite-compatible examples in isolated scratch databases.

This does not claim execution of PostgreSQL, Oracle, MySQL, MariaDB, or SQL Server.
Run from any directory with Python's standard-library sqlite3 module.
"""
from pathlib import Path
import json
import sqlite3

frontend = Path(__file__).resolve().parents[1]
unit = frontend / 'src/app/main-website/notesData/MCA/semesters/sem1/paper4/unit3'
examples = frontend / 'public/examples/dbms-unit3'
setup = (examples / 'setup-sqlite.sql').read_text(encoding='utf-8')


def database():
    db = sqlite3.connect(':memory:')
    db.executescript(setup)
    assert db.execute('PRAGMA foreign_keys').fetchone() == (1,)
    return db


def execute(db, code):
    """Keep complete trigger bodies together, and return the last result set."""
    pending = ''
    result = None
    for character in code:
        pending += character
        if character == ';' and sqlite3.complete_statement(pending):
            cursor = db.execute(pending)
            if cursor.description:
                result = [list(row) for row in cursor.fetchall()]
            pending = ''
    if pending.strip():
        raise AssertionError('Incomplete SQL statement: ' + pending)
    return result


checks = json.loads((frontend / 'test/fixtures/dbms-unit3-queries.json').read_text(encoding='utf-8'))
for case in checks:
    with database() as db:
        actual = execute(db, case['code'])
        assert actual == case['expected'], (case['name'], actual, case['expected'])

with sqlite3.connect(':memory:') as db:
    db.executescript((examples / 'queries-sqlite.sql').read_text(encoding='utf-8'))

for invalid in [
    "INSERT INTO U3Enrolment VALUES (101, 'DB101', 50)",
    "INSERT INTO U3Enrolment VALUES (999, 'DB101', 50)",
    "INSERT INTO U3Enrolment VALUES (104, 'UNKNOWN', 50)",
    "UPDATE U3Enrolment SET mark = 120 WHERE student_id = 101",
    "INSERT INTO U3Student (student_id, name) VALUES (105, NULL)",
    "DELETE FROM U3Student WHERE student_id = 101",
]:
    with database() as db:
        try:
            db.execute(invalid)
        except sqlite3.IntegrityError:
            db.rollback()
        else:
            raise AssertionError('Invalid write was accepted: ' + invalid)

trigger = json.loads((unit / 'triggers/chapter.json').read_text(encoding='utf-8'))
trigger_code = next(section['sqlVariants']['sqlite']['code'] for section in trigger['sections'] if 'sqlVariants' in section)
trigger_ddl = trigger_code.split('\nUPDATE U3Enrolment', 1)[0]
with database() as db:
    assert execute(db, trigger_code) == [[101, 'DB101', 82, 83], [102, 'DB101', 88, 89]]

with database() as db:
    db.executescript(trigger_ddl)
    db.execute('BEGIN')
    db.execute("UPDATE U3Enrolment SET mark = 70 WHERE student_id = 103 AND course_code = 'DB101'")
    assert db.execute('SELECT old_mark, new_mark FROM U3MarkAudit').fetchall() == [(None, 70)]
    db.execute("UPDATE U3Enrolment SET mark = 70 WHERE student_id = 103 AND course_code = 'DB101'")
    assert db.execute('SELECT COUNT(*) FROM U3MarkAudit').fetchone() == (1,)
    db.execute("UPDATE U3Enrolment SET mark = NULL WHERE student_id = 103 AND course_code = 'DB101'")
    assert db.execute('SELECT old_mark, new_mark FROM U3MarkAudit').fetchall() == [(None, 70), (70, None)]
    db.rollback()
    assert db.execute('SELECT COUNT(*) FROM U3MarkAudit').fetchone() == (0,)
    assert db.execute("SELECT mark FROM U3Enrolment WHERE student_id = 103 AND course_code = 'DB101'").fetchone() == (None,)

for name, expected in [
    ('cursors', [[101, 'Asha'], [102, 'Ravi'], [104, 'Neha']]),
    ('stored-procedures', [[2]]),
    ('triggers', [[101, 'DB101', 82, 83], [102, 'DB101', 88, 89]]),
]:
    with sqlite3.connect(':memory:') as db:
        assert execute(db, (examples / f'{name}-sqlite.sql').read_text(encoding='utf-8')) == expected

print(f'Passed {len(checks)} exact-result cases, workbook execution, six constraint failures,')
print('multirow/NULL/no-op/rollback trigger checks, and three standalone SQLite downloads.')
