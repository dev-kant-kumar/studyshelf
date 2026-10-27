-- Study Shelf: views example for Oracle
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(80) NOT NULL,
  programme VARCHAR2(20) NOT NULL
);

INSERT INTO Student VALUES (101, 'Asha', 'MCA');
INSERT INTO Student VALUES (102, 'Ravi', 'MBA');
INSERT INTO Student VALUES (103, 'Mira', 'MCA');

COMMIT;

CREATE VIEW MCAStudents AS
SELECT student_id, name
FROM Student
WHERE programme = 'MCA';

SELECT student_id, name
FROM MCAStudents
ORDER BY student_id;
