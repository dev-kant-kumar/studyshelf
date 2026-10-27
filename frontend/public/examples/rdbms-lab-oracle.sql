-- Study Shelf: rdbms example for Oracle
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(80) NOT NULL
);

CREATE TABLE Course (
  course_code VARCHAR2(10) PRIMARY KEY,
  title VARCHAR2(100) NOT NULL
);

CREATE TABLE Enrolment (
  student_id NUMBER(10) NOT NULL,
  course_code VARCHAR2(10) NOT NULL,
  mark NUMBER(5,2) CHECK (mark BETWEEN 0 AND 100),
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES Student(student_id),
  FOREIGN KEY (course_code) REFERENCES Course(course_code)
);

INSERT INTO Student VALUES (101, 'Asha');
INSERT INTO Student VALUES (102, 'Ravi');

INSERT INTO Course VALUES ('DB101', 'Database Systems');

INSERT INTO Enrolment VALUES (101, 'DB101', 82);
INSERT INTO Enrolment VALUES (102, 'DB101', NULL);

COMMIT;

SELECT s.name, c.title, e.mark
FROM Enrolment e
JOIN Student s ON s.student_id = e.student_id
JOIN Course c ON c.course_code = e.course_code
ORDER BY s.student_id;
