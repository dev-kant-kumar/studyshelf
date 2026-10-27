-- Study Shelf: dbms-structure example for Oracle
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(80) NOT NULL,
  programme VARCHAR2(20) NOT NULL
);

CREATE TABLE Course (
  course_code VARCHAR2(10) PRIMARY KEY,
  title VARCHAR2(100) NOT NULL,
  seats_available NUMBER(10) NOT NULL CHECK (seats_available >= 0)
);

CREATE TABLE Enrolment (
  student_id NUMBER(10) NOT NULL,
  course_code VARCHAR2(10) NOT NULL,
  mark NUMBER(10) CHECK (mark BETWEEN 0 AND 100),
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES Student(student_id),
  FOREIGN KEY (course_code) REFERENCES Course(course_code)
);

INSERT INTO Student VALUES (101, 'Asha', 'MCA');
INSERT INTO Student VALUES (102, 'Ravi', 'MCA');
INSERT INTO Student VALUES (103, 'Mira', 'MBA');
INSERT INTO Student VALUES (104, 'Neha', 'MCA');

INSERT INTO Course VALUES ('DB101', 'Database Systems', 2);
INSERT INTO Course VALUES ('CS101', 'C Programming', 5);

INSERT INTO Enrolment VALUES (101, 'DB101', 82);
INSERT INTO Enrolment VALUES (102, 'DB101', 88);
INSERT INTO Enrolment VALUES (103, 'DB101', NULL);
INSERT INTO Enrolment VALUES (103, 'CS101', 91);

COMMIT;

SELECT s.name, e.mark
FROM Student s
JOIN Enrolment e ON e.student_id = s.student_id
WHERE e.course_code = 'DB101' AND e.mark >= 80
ORDER BY s.name;
