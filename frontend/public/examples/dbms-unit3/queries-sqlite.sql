-- Unit 3 query workbook. Fresh scratch database only.
-- Expected logical rows are included before each query.
PRAGMA foreign_keys = ON;
BEGIN;

CREATE TABLE U3Student (
  student_id INTEGER NOT NULL,
  name VARCHAR(80) NOT NULL,
  programme VARCHAR(20) DEFAULT 'MCA' NOT NULL,
  email VARCHAR(120),
  CONSTRAINT u3_student_pk PRIMARY KEY (student_id)
);
CREATE TABLE U3Course (
  course_code VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  CONSTRAINT u3_course_pk PRIMARY KEY (course_code),
  CONSTRAINT u3_credits_ck CHECK (credits BETWEEN 1 AND 6)
);
CREATE TABLE U3Enrolment (
  student_id INTEGER NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  mark INTEGER NULL,
  CONSTRAINT u3_enrol_pk PRIMARY KEY (student_id, course_code),
  CONSTRAINT u3_student_fk FOREIGN KEY (student_id) REFERENCES U3Student(student_id),
  CONSTRAINT u3_course_fk FOREIGN KEY (course_code) REFERENCES U3Course(course_code),
  CONSTRAINT u3_mark_ck CHECK (mark BETWEEN 0 AND 100)
);

INSERT INTO U3Student VALUES
  (101, 'Asha', 'MCA', 'asha@example.test'),
  (102, 'Ravi', 'MCA', NULL),
  (103, 'Mira', 'MBA', 'mira@example.test'),
  (104, 'Neha', 'MCA', 'neha@example.test');

INSERT INTO U3Course VALUES
  ('DB101', 'Database Systems', 3),
  ('CS101', 'C Programming', 4),
  ('AI101', 'Artificial Intelligence', 3);

INSERT INTO U3Enrolment VALUES
  (101, 'DB101', 82),
  (102, 'DB101', 88),
  (103, 'DB101', NULL),
  (101, 'CS101', 91),
  (103, 'CS101', 74);

COMMIT;

-- baseline
-- Expected: [[101, "CS101", 91], [101, "DB101", 82], [102, "DB101", 88], [103, "CS101", 74], [103, "DB101", null]]
SELECT student_id, course_code, mark
FROM U3Enrolment
ORDER BY student_id, course_code;

-- basic-filter
-- Expected: [[102, "Ravi"], [104, "Neha"]]
SELECT student_id, name
FROM U3Student
WHERE programme = 'MCA' AND student_id >= 102
ORDER BY student_id;

-- left-join-count
-- Expected: [["AI101", 0], ["CS101", 2], ["DB101", 3]]
SELECT c.course_code, COUNT(e.student_id) AS enrolled
FROM U3Course c
LEFT JOIN U3Enrolment e ON e.course_code = c.course_code
GROUP BY c.course_code
ORDER BY c.course_code;

-- cte-mean
-- Expected: [["DB101", 85]]
WITH CourseMean AS (
  SELECT course_code, AVG(mark) AS mean_mark
  FROM U3Enrolment
  GROUP BY course_code
)
SELECT course_code, mean_mark
FROM CourseMean
WHERE mean_mark >= 85
ORDER BY course_code;

-- window-rank
-- Expected: [["CS101", 101, 91, 1], ["CS101", 103, 74, 2], ["DB101", 102, 88, 1], ["DB101", 101, 82, 2], ["DB101", 103, null, 3]]
SELECT course_code, student_id, mark,
       ROW_NUMBER() OVER (
         PARTITION BY course_code
         ORDER BY CASE WHEN mark IS NULL THEN 1 ELSE 0 END,
                  mark DESC, student_id
       ) AS position
FROM U3Enrolment
ORDER BY course_code, position;

-- set-difference
-- Expected: [[102]]
SELECT student_id FROM U3Enrolment WHERE course_code = 'DB101'
EXCEPT
SELECT student_id FROM U3Enrolment WHERE course_code = 'CS101'
ORDER BY student_id;

-- aggregate-summary
-- Expected: [["AI101", 0, 0, null], ["CS101", 2, 2, 82.5], ["DB101", 3, 2, 85]]
SELECT c.course_code, COUNT(e.student_id) AS enrolled,
       COUNT(e.mark) AS marked, AVG(e.mark * 1.0) AS mean_mark
FROM U3Course c
LEFT JOIN U3Enrolment e ON e.course_code = c.course_code
GROUP BY c.course_code
ORDER BY c.course_code;

-- having
-- Expected: [["DB101", 3, 85]]
SELECT course_code, COUNT(*) AS enrolled, AVG(mark * 1.0) AS mean_mark
FROM U3Enrolment
GROUP BY course_code
HAVING COUNT(*) >= 3
ORDER BY course_code;

-- is-null
-- Expected: [[102, "Ravi"]]
SELECT student_id, name
FROM U3Student
WHERE email IS NULL
ORDER BY student_id;

-- not-in-null
-- Expected: []
SELECT s.student_id, s.name
FROM U3Student s
WHERE s.student_id NOT IN (
  SELECT e.mark FROM U3Enrolment e
)
ORDER BY s.student_id;

-- not-exists
-- Expected: [[104, "Neha"]]
SELECT s.student_id, s.name
FROM U3Student s
WHERE NOT EXISTS (
  SELECT 1 FROM U3Enrolment e
  WHERE e.student_id = s.student_id
)
ORDER BY s.student_id;

-- view-summary
-- Expected: [["AI101", 0], ["CS101", 2], ["DB101", 3]]
CREATE VIEW U3CourseSummary AS
SELECT c.course_code, COUNT(e.student_id) AS enrolled
FROM U3Course c
LEFT JOIN U3Enrolment e ON e.course_code = c.course_code
GROUP BY c.course_code;

SELECT course_code, enrolled
FROM U3CourseSummary
ORDER BY course_code;

-- correlated-mean
-- Expected: [[102, 88]]
SELECT e.student_id, e.mark
FROM U3Enrolment e
WHERE e.course_code = 'DB101'
  AND e.mark > (
    SELECT AVG(x.mark * 1.0) FROM U3Enrolment x
    WHERE x.course_code = e.course_code
  )
ORDER BY e.student_id;

-- constraint-default
-- Expected: [[1, "pending"]]
CREATE TABLE U3RegistrationRule (
  registration_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  reference_code VARCHAR(20) NOT NULL,
  status VARCHAR(12) DEFAULT 'pending' NOT NULL,
  CONSTRAINT u3_rule_pk PRIMARY KEY (registration_id),
  CONSTRAINT u3_rule_ref_uq UNIQUE (reference_code),
  CONSTRAINT u3_rule_student_fk FOREIGN KEY (student_id)
    REFERENCES U3Student(student_id),
  CONSTRAINT u3_rule_status_ck CHECK (status IN ('pending', 'confirmed'))
);
INSERT INTO U3RegistrationRule (registration_id, student_id, reference_code)
VALUES (1, 101, 'R-101');
SELECT registration_id, status FROM U3RegistrationRule;

-- index-result
-- Expected: [[101, 82], [102, 88]]
CREATE INDEX u3_enrol_course_mark
ON U3Enrolment(course_code, mark);

SELECT student_id, mark
FROM U3Enrolment
WHERE course_code = 'DB101' AND mark >= 80
ORDER BY mark, student_id;

