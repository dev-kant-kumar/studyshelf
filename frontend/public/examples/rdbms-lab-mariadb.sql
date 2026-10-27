-- Study Shelf: rdbms example for MariaDB
-- Run once in a fresh scratch database.

CREATE TABLE Student (
  student_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Course (
  course_code VARCHAR(10) PRIMARY KEY,
  title VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Enrolment (
  student_id INTEGER NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  mark NUMERIC(5,2) CHECK (mark BETWEEN 0 AND 100),
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES Student(student_id),
  FOREIGN KEY (course_code) REFERENCES Course(course_code)
) ENGINE=InnoDB;

INSERT INTO Student VALUES
  (101, 'Asha'),
  (102, 'Ravi');

INSERT INTO Course VALUES
  ('DB101', 'Database Systems');

INSERT INTO Enrolment VALUES
  (101, 'DB101', 82),
  (102, 'DB101', NULL);

SELECT s.name, c.title, e.mark
FROM Enrolment AS e
JOIN Student AS s ON s.student_id = e.student_id
JOIN Course AS c ON c.course_code = e.course_code
ORDER BY s.student_id;
