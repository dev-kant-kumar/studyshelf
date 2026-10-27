-- Unit 3 isolated scratch exercise. Run once in a fresh database.
-- SQL Server: a local FAST_FORWARD cursor uses @@FETCH_STATUS and explicit cleanup in normal and error paths.
BEGIN TRANSACTION;

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

CREATE TABLE U3CursorResult (student_id INTEGER NOT NULL PRIMARY KEY, name VARCHAR(80) NOT NULL);
DECLARE @id INTEGER, @name VARCHAR(80);
DECLARE c CURSOR LOCAL FAST_FORWARD FOR
  SELECT student_id, name FROM U3Student
  WHERE programme = 'MCA' ORDER BY student_id;
BEGIN TRY
  OPEN c;
  FETCH NEXT FROM c INTO @id, @name;
  WHILE @@FETCH_STATUS = 0
  BEGIN
    INSERT INTO U3CursorResult VALUES (@id, @name);
    FETCH NEXT FROM c INTO @id, @name;
  END;
  CLOSE c;
  DEALLOCATE c;
END TRY
BEGIN CATCH
  IF CURSOR_STATUS('local', 'c') >= 0 CLOSE c;
  IF CURSOR_STATUS('local', 'c') > -3 DEALLOCATE c;
  THROW;
END CATCH;
SELECT student_id, name FROM U3CursorResult ORDER BY student_id;
