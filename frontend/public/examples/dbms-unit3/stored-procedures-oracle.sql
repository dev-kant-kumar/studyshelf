-- Unit 3 isolated scratch exercise. Run once in a fresh database.
-- Oracle 19c: run as a script. SET SERVEROUTPUT ON and slash are SQL*Plus/SQL Developer client commands. The call prints Recorded marks: 2.
CREATE TABLE U3Student (
  student_id NUMBER(10) NOT NULL,
  name VARCHAR2(80) NOT NULL,
  programme VARCHAR2(20) DEFAULT 'MCA' NOT NULL,
  email VARCHAR2(120),
  CONSTRAINT u3_student_pk PRIMARY KEY (student_id)
);
CREATE TABLE U3Course (
  course_code VARCHAR2(10) NOT NULL,
  title VARCHAR2(100) NOT NULL,
  credits NUMBER(10) NOT NULL,
  CONSTRAINT u3_course_pk PRIMARY KEY (course_code),
  CONSTRAINT u3_credits_ck CHECK (credits BETWEEN 1 AND 6)
);
CREATE TABLE U3Enrolment (
  student_id NUMBER(10) NOT NULL,
  course_code VARCHAR2(10) NOT NULL,
  mark NUMBER(10) NULL,
  CONSTRAINT u3_enrol_pk PRIMARY KEY (student_id, course_code),
  CONSTRAINT u3_student_fk FOREIGN KEY (student_id) REFERENCES U3Student(student_id),
  CONSTRAINT u3_course_fk FOREIGN KEY (course_code) REFERENCES U3Course(course_code),
  CONSTRAINT u3_mark_ck CHECK (mark BETWEEN 0 AND 100)
);

INSERT INTO U3Student VALUES (101, 'Asha', 'MCA', 'asha@example.test');
INSERT INTO U3Student VALUES (102, 'Ravi', 'MCA', NULL);
INSERT INTO U3Student VALUES (103, 'Mira', 'MBA', 'mira@example.test');
INSERT INTO U3Student VALUES (104, 'Neha', 'MCA', 'neha@example.test');

INSERT INTO U3Course VALUES ('DB101', 'Database Systems', 3);
INSERT INTO U3Course VALUES ('CS101', 'C Programming', 4);
INSERT INTO U3Course VALUES ('AI101', 'Artificial Intelligence', 3);

INSERT INTO U3Enrolment VALUES (101, 'DB101', 82);
INSERT INTO U3Enrolment VALUES (102, 'DB101', 88);
INSERT INTO U3Enrolment VALUES (103, 'DB101', NULL);
INSERT INTO U3Enrolment VALUES (101, 'CS101', 91);
INSERT INTO U3Enrolment VALUES (103, 'CS101', 74);

COMMIT;

CREATE OR REPLACE PROCEDURE U3CountMarked(
  p_course IN U3Course.course_code%TYPE,
  p_marked OUT NUMBER
) AS
BEGIN
  IF p_course IS NULL THEN
    RAISE_APPLICATION_ERROR(-20001, 'Course code is required');
  END IF;
  SELECT COUNT(mark) INTO p_marked FROM U3Enrolment
  WHERE course_code = p_course;
END;
/
SET SERVEROUTPUT ON
DECLARE
  v_marked NUMBER;
BEGIN
  U3CountMarked('DB101', v_marked);
  DBMS_OUTPUT.PUT_LINE('Recorded marks: ' || v_marked);
END;
/
