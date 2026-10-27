-- Study Shelf: dbms-structure example for SQL Server
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  programme VARCHAR(20) NOT NULL
);

CREATE TABLE Course (
  course_code VARCHAR(10) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  seats_available INTEGER NOT NULL CHECK (seats_available >= 0)
);

CREATE TABLE Enrolment (
  student_id INTEGER NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  mark INTEGER NULL CHECK (mark BETWEEN 0 AND 100),
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES Student(student_id),
  FOREIGN KEY (course_code) REFERENCES Course(course_code)
);

INSERT INTO Student VALUES
  (101, 'Asha', 'MCA'),
  (102, 'Ravi', 'MCA'),
  (103, 'Mira', 'MBA'),
  (104, 'Neha', 'MCA');

INSERT INTO Course VALUES
  ('DB101', 'Database Systems', 2),
  ('CS101', 'C Programming', 5);

INSERT INTO Enrolment VALUES
  (101, 'DB101', 82),
  (102, 'DB101', 88),
  (103, 'DB101', NULL),
  (103, 'CS101', 91);

SELECT s.name, e.mark
FROM Student AS s
JOIN Enrolment AS e ON e.student_id = s.student_id
WHERE e.course_code = 'DB101' AND e.mark >= 80
ORDER BY s.name;
