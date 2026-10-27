-- Unit 3 isolated scratch exercise. Run once in a fresh database.
-- MySQL: run with mysql-client DELIMITER support. @marked is a session variable receiving the OUT value.
CREATE TABLE U3Student (
  student_id INTEGER NOT NULL,
  name VARCHAR(80) NOT NULL,
  programme VARCHAR(20) DEFAULT 'MCA' NOT NULL,
  email VARCHAR(120),
  CONSTRAINT u3_student_pk PRIMARY KEY (student_id)
) ENGINE=InnoDB;
CREATE TABLE U3Course (
  course_code VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  CONSTRAINT u3_course_pk PRIMARY KEY (course_code),
  CONSTRAINT u3_credits_ck CHECK (credits BETWEEN 1 AND 6)
) ENGINE=InnoDB;
CREATE TABLE U3Enrolment (
  student_id INTEGER NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  mark INTEGER NULL,
  CONSTRAINT u3_enrol_pk PRIMARY KEY (student_id, course_code),
  CONSTRAINT u3_student_fk FOREIGN KEY (student_id) REFERENCES U3Student(student_id),
  CONSTRAINT u3_course_fk FOREIGN KEY (course_code) REFERENCES U3Course(course_code),
  CONSTRAINT u3_mark_ck CHECK (mark BETWEEN 0 AND 100)
) ENGINE=InnoDB;

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

DELIMITER //
CREATE PROCEDURE U3CountMarked(IN p_course VARCHAR(10), OUT p_marked BIGINT)
BEGIN
  IF p_course IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course code is required';
  END IF;
  SELECT COUNT(mark) INTO p_marked FROM U3Enrolment
  WHERE course_code = p_course;
END//
DELIMITER ;
CALL U3CountMarked('DB101', @marked);
SELECT @marked AS recorded_marks;
