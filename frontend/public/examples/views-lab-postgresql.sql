-- Study Shelf: views example for PostgreSQL
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  programme VARCHAR(20) NOT NULL
);

INSERT INTO Student VALUES
  (101, 'Asha', 'MCA'),
  (102, 'Ravi', 'MBA'),
  (103, 'Mira', 'MCA');

CREATE VIEW MCAStudents AS
SELECT student_id, name
FROM Student
WHERE programme = 'MCA';

SELECT student_id, name
FROM MCAStudents
ORDER BY student_id;
