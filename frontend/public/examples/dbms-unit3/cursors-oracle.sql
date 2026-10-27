-- Unit 3 isolated scratch exercise. Run once in a fresh database.
-- Oracle 19c PL/SQL: run as a SQL*Plus/SQL Developer script. The slash submits the anonymous block; it is not API SQL.
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

CREATE TABLE U3CursorResult (student_id NUMBER(10) NOT NULL PRIMARY KEY, name VARCHAR2(80) NOT NULL);
DECLARE
  CURSOR c IS SELECT student_id, name FROM U3Student
    WHERE programme = 'MCA' ORDER BY student_id;
  v_id U3Student.student_id%TYPE;
  v_name U3Student.name%TYPE;
BEGIN
  OPEN c;
  LOOP
    FETCH c INTO v_id, v_name;
    EXIT WHEN c%NOTFOUND;
    INSERT INTO U3CursorResult VALUES (v_id, v_name);
  END LOOP;
  CLOSE c;
EXCEPTION
  WHEN OTHERS THEN
    IF c%ISOPEN THEN CLOSE c; END IF;
    RAISE;
END;
/
SELECT student_id, name FROM U3CursorResult ORDER BY student_id;
