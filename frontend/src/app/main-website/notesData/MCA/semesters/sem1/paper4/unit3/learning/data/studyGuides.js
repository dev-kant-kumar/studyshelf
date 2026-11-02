// Original topic-specific learning bridges, examination model answers, and interview practice.
export const studyGuides = {
  "set-operations": {
    "before": [
      "select",
      "subqueries-sets"
    ],
    "introduction": "A join combines columns from related rows. A set operation instead combines or compares complete query results with the same shape. Think of two customer lists: everyone in either list, only people in both lists, or people in the first list but not the second.",
    "definition": "SQL set operations combine union-compatible query results. UNION removes duplicate tuples, UNION ALL preserves occurrences, INTERSECT returns common tuples, and EXCEPT returns tuples present in the left result but absent from the right.",
    "examQuestion": "Compare UNION, UNION ALL, INTERSECT, and EXCEPT with examples.",
    "examAnswer": [
      "The inputs need compatible column counts and types. UNION combines them and removes duplicate tuples; UNION ALL retains duplicate occurrences.",
      "For inputs A = {1,2} and B = {2,3}, UNION produces {1,2,3}, INTERSECT produces {2}, and A EXCEPT B produces {1}. UNION ALL preserves both occurrences of 2.",
      "Set operations combine or compare rows vertically. A join combines related columns. EXCEPT is directional: reversing its operands changes the answer. ORDER BY on the final combined query defines its presentation order."
    ],
    "interviewQuestion": "Why might UNION produce the wrong transaction count?",
    "interviewAnswer": "It removes duplicate result tuples even when they represent separate occurrences. Use UNION ALL when each occurrence must remain.",
    "followUp": "Is EXCEPT commutative?",
    "followUpAnswer": "No. A EXCEPT B and B EXCEPT A express different differences."
  },
  "sql-constraints": {
    "before": [
      "schema-design"
    ],
    "introduction": "A constraint is a rule the database checks, not just a validation message in a form. Separate presence, uniqueness, acceptable values, and valid references: one rule does not automatically imply the others.",
    "definition": "A SQL constraint is a database-enforced restriction on valid stored data. Common constraints include NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, and CHECK.",
    "examQuestion": "Explain the main SQL constraints and distinguish DEFAULT from validation.",
    "examAnswer": [
      "NOT NULL requires a value. UNIQUE prevents duplicate keys under the engine’s NULL policy. PRIMARY KEY combines unique identity with non-nullability.",
      "FOREIGN KEY enforces a reference to an eligible parent key. CHECK rejects rows where its predicate is false, but UNKNOWN can pass, so add NOT NULL independently when required.",
      "A DEFAULT supplies an omitted value; it is not a general test of supplied values. For example, a supplied negative stock is rejected by CHECK(stock >= 0), while valid stock passes. Referential actions determine what happens to dependent rows when a parent changes."
    ],
    "interviewQuestion": "Why can CHECK(age >= 18) accept NULL?",
    "interviewAnswer": "The comparison is UNKNOWN, not FALSE. Add NOT NULL if age must be known.",
    "followUp": "Does DEFAULT replace an explicitly supplied NULL?",
    "followUpAnswer": "Normally no. It supplies the value when the column is omitted or DEFAULT is requested."
  },
  "cursors": {
    "before": [
      "views-procedures"
    ],
    "introduction": "A normal SQL statement acts on a set of rows. A cursor lets procedural code fetch from a query result in controlled steps. Learn the set-based solution first, then use a cursor when the task actually needs stateful row-by-row processing.",
    "definition": "A cursor is a database mechanism for accessing a query result incrementally. Its lifecycle generally includes declaration, opening, fetching, termination checks, and closing under the engine’s procedural and transaction rules.",
    "examQuestion": "Explain the cursor lifecycle and compare it with set-based SQL.",
    "examAnswer": [
      "An explicit cursor is declared for a query, opened, fetched until its end-of-data condition is reached, and closed. Variables receive each fetched row before the procedural body processes it.",
      "Oracle cursor attributes such as %FOUND, %NOTFOUND, and %ROWCOUNT describe cursor state. Oracle also provides implicit cursors for suitable statements. Equivalent PostgreSQL or MySQL routines use their own syntax and state contracts.",
      "A set-based UPDATE or aggregate can express many multi-row operations without a procedural loop. Row-by-row processing adds state and may add work. Cursor lifetime and error handling must also respect connection and transaction resources."
    ],
    "interviewQuestion": "Should every multi-row update use a cursor?",
    "interviewAnswer": "No. One set-based UPDATE usually expresses the operation more clearly and lets the database optimize it. Use a cursor only for a justified per-row algorithm or fetch contract.",
    "followUp": "Is a cursor the same as API pagination?",
    "followUpAnswer": "No. A database cursor is connection/transaction-related query state; a pagination cursor is usually an application continuation token."
  },
  "stored-procedures": {
    "before": [
      "views-procedures",
      "transactions"
    ],
    "introduction": "When several database steps are reused, a stored routine can give them an explicit callable interface. Its inputs, outputs, exceptions, and transaction behavior must be understood just like an application function’s contract.",
    "definition": "A stored procedure is a named database routine invoked to perform defined operations, with parameters and procedural behavior determined by the DBMS and routine language.",
    "examQuestion": "Explain stored procedure parameters, exception handling, and practical use.",
    "examAnswer": [
      "A procedure is a named database routine with a defined calling interface. Input parameters supply values, output parameters return values, and input/output parameters serve both roles under the selected engine’s syntax.",
      "The routine either completes its intended operations or propagates/handles an error according to its contract. Silently swallowing an exception can report success after incomplete work. Transaction-control rules differ between DBMS products and between functions and procedures.",
      "Stored routines can centralize reusable operations and privilege boundaries, but require deployment, versioning, and tests. Dynamic SQL can remain injectable, and procedural loops can remain inefficient; being stored in the database does not eliminate those risks."
    ],
    "interviewQuestion": "Does a stored procedure prevent SQL injection automatically?",
    "interviewAnswer": "No. A routine that concatenates untrusted text into dynamic SQL can still be injectable. Use safe binding and restrict structural choices.",
    "followUp": "Are Oracle PL/SQL and PostgreSQL PL/pgSQL interchangeable?",
    "followUpAnswer": "No. They have similar procedural concepts but different syntax, features, invocation, and transaction rules."
  },
  "triggers": {
    "before": [
      "views-procedures",
      "transactions"
    ],
    "introduction": "A trigger runs because another database event occurs. That makes it useful for some audit or consistency tasks, but its effects are less visible to the code issuing the original write. Always explain when it fires and what else it changes.",
    "definition": "A trigger is database logic automatically executed in response to a specified event, with timing, granularity, and access to old/new row values defined by the DBMS.",
    "examQuestion": "Explain trigger timing, row versus statement execution, and audit behavior.",
    "examAnswer": [
      "A BEFORE trigger runs before the defined change and an AFTER trigger runs afterwards. A row trigger runs for each affected row; a statement trigger runs at statement granularity. OLD and NEW represent applicable prior and resulting row values.",
      "An audit trigger should check an actual change, for example OLD.price IS DISTINCT FROM NEW.price in PostgreSQL. An UPDATE affecting two qualifying rows can create two audit rows under a row-level trigger.",
      "Transactional audit writes roll back with the original transaction. Triggers can add hidden work or recursion, so their affected tables and firing rules must be documented. External messages do not automatically share database rollback and need a reliable delivery design."
    ],
    "interviewQuestion": "Does UPDATE OF price mean the price actually changed?",
    "interviewAnswer": "It identifies a statement mentioning that column, not necessarily a different value. Compare OLD and NEW with appropriate NULL semantics.",
    "followUp": "What happens to the audit insert if the original transaction rolls back?",
    "followUpAnswer": "A transactional audit insert in the same transaction rolls back too. An external message or email does not automatically share that rollback."
  },
  "start": {
    "before": [],
    "introduction": "",
    "definition": "SQL (Structured Query Language) is a language used to define, retrieve, and manipulate data in relational database systems. Its commands support tasks such as creating tables, querying rows, and inserting, updating, or deleting stored records.",
    "examQuestion": "What is SQL? Explain its uses with a simple example.",
    "examAnswer": [
      "SQL stands for Structured Query Language. It is used to communicate with a relational DBMS. Oracle Database and PostgreSQL are database products; SQL is the language they implement.",
      "SELECT name FROM users; retrieves the name column from the users table. SELECT specifies what to display, and FROM identifies the input table. The result does not modify stored records.",
      "SQL also supports INSERT to add rows, UPDATE to change rows, DELETE to remove rows, and CREATE TABLE to define a table. A table organizes records into rows and attributes into columns."
    ],
    "interviewQuestion": "Is SQL a database? Is PostgreSQL the same thing as SQL?",
    "interviewAnswer": "SQL is a language, not the database or the server. PostgreSQL is a DBMS that implements SQL and manages storage, permissions, and execution. Other DBMS products implement SQL with some different syntax and behavior.",
    "followUp": "Does SELECT name FROM users remove the other columns?",
    "followUpAnswer": "No. It chooses the columns in the returned result. The stored table remains unchanged. This distinction separates reading a view of data from modifying stored data."
  },
  "syntax": {
    "before": [
      "start"
    ],
    "introduction": "You can already ask for a column from a table. Now learn how to read the parts of a SQL statement so that a new query does not look like an unexplained string of keywords. Keep the distinction between a value such as Asha and a name such as users in mind.",
    "definition": "SQL syntax is the set of rules for forming valid SQL statements from keywords, identifiers, literals, operators, and delimiters. Comments document intent without becoming executable instructions.",
    "examQuestion": "Explain SQL keywords, identifiers, literals, and comments with examples.",
    "examAnswer": [
      "In SELECT name FROM users WHERE name = 'Asha';, SELECT, FROM, and WHERE are keywords; name and users identify database objects; Asha is a string literal.",
      "Single quotes delimit character strings. Double quotes delimit identifiers in standard SQL and PostgreSQL. A semicolon separates statements in a script. A comma separates selected expressions.",
      "Use -- for a line comment and /* ... */ for a block comment. A valid statement can still express the wrong business condition; syntax checking does not establish correctness."
    ],
    "interviewQuestion": "Why does SELECT id name FROM users run instead of reporting a missing comma?",
    "interviewAnswer": "PostgreSQL can interpret name as an alias for id. The query returns one column with a different label. Use SELECT id, name FROM users when two columns are intended.",
    "followUp": "Can you bind a column name using $1?",
    "followUpAnswer": "A positional parameter supplies a data value, not SQL structure. Select a column or ordering expression from trusted application-owned choices instead."
  },
  "sample-schema": {
    "before": [
      "start",
      "syntax"
    ],
    "introduction": "Before joining several tables, know what each table represents. In this shop, a customer places an order and the order contains product lines. One order containing two products is still one order, but it needs two line-item rows. Read the example rows before calculating totals.",
    "definition": "A relational schema describes tables, their attributes and types, keys, and integrity constraints. Primary keys identify rows, while foreign keys express references to keys in related tables.",
    "examQuestion": "Explain the relationship between users, orders, products, and order_items.",
    "examAnswer": [
      "One user can have many orders; orders.user_id references users.id. One order can contain many line items; order_items.order_id references orders.id.",
      "A product can appear in many orders. order_items connects orders and products and stores quantity and the agreed unit price. Its composite primary key prevents duplicate product membership within one order.",
      "Keep the purchase price on the line item because the current catalog price may change. Draw the relationships and identify the one and many ends rather than listing table names alone."
    ],
    "interviewQuestion": "Why store unit_price on order_items when products already has price?",
    "interviewAnswer": "They represent different facts: the catalog price now and the price agreed at purchase time. Historical orders must not change when the catalog changes.",
    "followUp": "Is an order count the same as a line count?",
    "followUpAnswer": "No. An order can have multiple lines, and a line can represent multiple units. Establish the unit being counted before choosing COUNT or SUM."
  },
  "select": {
    "before": [
      "start",
      "syntax"
    ],
    "introduction": "Imagine a customer list containing more information than a screen needs. SELECT lets you choose the information to display and calculate new output values. This lesson changes the shape of a result; it does not change the records saved in the database.",
    "definition": "SELECT retrieves a result from database relations. Its select list specifies output columns or expressions. Aliases label output expressions, and DISTINCT removes duplicate tuples from the selected result.",
    "examQuestion": "Explain projection, aliases, and DISTINCT using SELECT statements.",
    "examAnswer": [
      "Projection chooses output attributes: SELECT id, name FROM users returns those two columns. An expression such as price * stock calculates a result without updating either stored column.",
      "AS assigns a meaningful label to a selected expression. DISTINCT removes repeated complete result rows, not independent repetitions in each selected column.",
      "For SELECT DISTINCT user_id, status FROM orders, each different pair remains. One user with paid and pending orders can still appear twice. Use an explicit ORDER BY when the answer requires a display order."
    ],
    "interviewQuestion": "Does SELECT DISTINCT user_id, status guarantee one row per user?",
    "interviewAnswer": "No. It produces one row per distinct pair of values. Define which status should represent the user, aggregate appropriately, or use EXISTS when only the existence of a matching order matters.",
    "followUp": "Why avoid SELECT * in a durable API?",
    "followUpAnswer": "New columns can unintentionally change the response or expose internal data. Explicit columns make the response contract and required data easier to review."
  },
  "filtering": {
    "before": [
      "select"
    ],
    "introduction": "A SELECT query can return every row, but most questions need only some of them. WHERE describes which rows to keep. Start by stating the rule in ordinary language, then translate each condition and its grouping into SQL.",
    "definition": "WHERE filters input rows using a Boolean search condition. Only rows for which the condition evaluates to TRUE are retained; FALSE and UNKNOWN are rejected.",
    "examQuestion": "Explain WHERE, AND, OR, BETWEEN, IN, and LIKE with examples.",
    "examAnswer": [
      "WHERE price >= 500 applies a comparison to each input row. AND requires both conditions, OR requires at least one, and NOT negates a condition under SQL three-valued logic.",
      "BETWEEN includes both endpoints: price BETWEEN 500 AND 1500 includes 500 and 1500 but excludes 499. IN tests candidate membership. LIKE uses % for a sequence of characters and _ for one character.",
      "Parentheses make mixed AND/OR rules explicit. For a reporting day, created_at >= start AND created_at < next_day includes the start and excludes the next period. WHERE retains only predicates evaluating to TRUE."
    ],
    "interviewQuestion": "Why can adding OR accidentally expose records from another user?",
    "interviewAnswer": "AND binds more tightly than OR. A condition such as owner_id = $1 AND state = 'paid' OR state = 'pending' can allow every pending row. Group the state alternatives so ownership applies to both.",
    "followUp": "Does binding a LIKE pattern make % literal?",
    "followUpAnswer": "No. Binding prevents SQL structure injection; wildcard semantics still apply inside the pattern. Define whether the endpoint accepts patterns or literal search text."
  },
  "nulls": {
    "before": [
      "filtering"
    ],
    "introduction": "Sometimes a value is not known: Mira has not provided an email address. SQL represents that absence with NULL. It is not an empty address and it is not the word NULL. This affects comparisons, filtering, and calculations.",
    "definition": "NULL is a marker for missing or unknown information. Ordinary comparisons involving NULL produce UNKNOWN; SQL conditions therefore use three-valued logic: TRUE, FALSE, and UNKNOWN.",
    "examQuestion": "Explain NULL handling and why IS NULL is required.",
    "examAnswer": [
      "NULL differs from zero, empty text, and false. email = NULL evaluates to UNKNOWN and does not select missing emails. Use email IS NULL or email IS NOT NULL.",
      "WHERE retains only TRUE. For example: FALSE AND UNKNOWN is FALSE, while TRUE AND UNKNOWN is UNKNOWN.",
      "COUNT(*) counts rows, while COUNT(email) excludes NULL emails. COALESCE selects the first non-null argument. Do not replace every unknown value with zero unless zero is the correct domain meaning."
    ],
    "interviewQuestion": "Why can NOT IN return no rows when a subquery contains NULL?",
    "interviewAnswer": "A candidate cannot be proven unequal to an unknown value, so the overall predicate can be UNKNOWN rather than TRUE. NOT EXISTS with a clear matching condition often expresses the anti-match requirement more safely.",
    "followUp": "How do you compare two nullable values safely?",
    "followUpAnswer": "In PostgreSQL, IS DISTINCT FROM and IS NOT DISTINCT FROM provide null-aware comparisons. Ordinary equality does not treat two missing values as equal."
  },
  "sorting-pagination": {
    "before": [
      "select",
      "filtering"
    ],
    "introduction": "A product page needs a defined order before “first ten products” has a useful meaning. Pagination divides that ordered result into manageable pieces. The challenge is to keep the ordering rule precise while other requests add or change rows.",
    "definition": "ORDER BY defines the ordering of result rows. Pagination returns bounded portions of an ordered result using an offset or a key-based continuation condition.",
    "examQuestion": "Compare offset pagination and keyset pagination.",
    "examAnswer": [
      "LIMIT/OFFSET returns a bounded result after skipping an offset. It supports page-number navigation but deep offsets may process many preceding entries.",
      "Keyset pagination continues after the last returned ordering tuple, such as (created_at, id). A unique tie-breaker makes equal timestamps deterministic.",
      "Inserts and deletes can shift offset pages, while updates to ordering keys can also affect keyset traversal. Neither mechanism alone creates an immutable snapshot. Choose according to navigation and consistency requirements."
    ],
    "interviewQuestion": "Why is ORDER BY created_at insufficient for stable pages?",
    "interviewAnswer": "Several rows can have the same timestamp. Add a unique tie-breaker such as id and include every ordering field in the continuation cursor.",
    "followUp": "Can keyset pagination jump directly to page 500?",
    "followUpAnswer": "Not naturally without a known boundary. It is suited to continuing from a cursor; arbitrary page numbers and consistent exports need different contracts."
  },
  "writes": {
    "before": [
      "select",
      "filtering"
    ],
    "introduction": "Until now, the queries have read information. A write changes the saved records. Learn INSERT, UPDATE, and DELETE as three distinct operations, and identify the intended rows before running a change.",
    "definition": "Data manipulation statements insert, update, and delete rows. INSERT creates records, UPDATE changes selected records, and DELETE removes selected records; predicates determine the scope of updates and deletes.",
    "examQuestion": "Explain INSERT, UPDATE, DELETE, and the role of WHERE.",
    "examAnswer": [
      "INSERT INTO users(name,email) VALUES (...) creates a row using explicitly named columns. Defaults supply omitted values where defined.",
      "UPDATE changes the set of rows satisfying its predicate. DELETE removes that set. Without WHERE, each can affect every row in the table.",
      "Use transactions for a reversible practice change and inspect the affected rows. PostgreSQL RETURNING retrieves values from the changed rows. ON CONFLICT requires a suitable uniqueness rule and handles a defined conflict case."
    ],
    "interviewQuestion": "Why is SELECT stock followed by an unconditional UPDATE unsafe?",
    "interviewAnswer": "Two requests may read the same old stock before either writes. Put availability into one atomic UPDATE predicate or protect the decision with an appropriate transaction/lock strategy.",
    "followUp": "Does ON CONFLICT make checkout idempotent?",
    "followUpAnswer": "No. A complete workflow must identify a repeated request, compare its meaning, and return the prior outcome without repeating other effects such as stock reduction."
  },
  "joins": {
    "before": [
      "select",
      "filtering",
      "sample-schema"
    ],
    "introduction": "An order stores the customer number, but a report needs the customer name. A join combines related rows so one result can include both. Before studying join types, decide what one output row should represent: one order, one product line, or one customer.",
    "definition": "A join combines rows from two relations according to a matching condition. An inner join returns matching combinations; an outer join additionally preserves unmatched rows from one or both inputs using NULL-extended columns.",
    "examQuestion": "Compare INNER JOIN and LEFT JOIN using customers and orders.",
    "examAnswer": [
      "The condition orders.user_id = users.id associates an order with its customer. INNER JOIN returns only matching pairs, so a customer without orders is absent.",
      "LEFT JOIN preserves every customer. An unmatched customer has NULL in the right-hand order columns. A customer with two matching orders produces two joined rows, not one.",
      "A right-table eligibility condition in ON restricts eligible matches while preserving unmatched left rows. Putting that condition in WHERE can reject the NULL-extended rows. COUNT(o.id) counts actual matched orders; COUNT(*) also counts the preserved unmatched row."
    ],
    "interviewQuestion": "Why does COUNT(*) give one for a customer with no matched order?",
    "interviewAnswer": "A left join preserves one NULL-extended row. COUNT(*) counts that row, while COUNT(o.id) counts non-null matched order IDs and returns zero.",
    "followUp": "Should DISTINCT fix an inflated total after a join?",
    "followUpAnswer": "First fix the grain and relationship. Two independent one-to-many joins can multiply child rows. Aggregate each child to the required parent level before combining totals."
  },
  "aggregation": {
    "before": [
      "joins",
      "nulls"
    ],
    "introduction": "A list of order lines is detailed data. A report asks a different question: how much did each order cost? An aggregate combines values from several rows. GROUP BY decides which rows belong to each calculation.",
    "definition": "Aggregate functions summarize sets of input values. GROUP BY partitions rows into groups, and HAVING filters groups after aggregate evaluation, whereas WHERE filters input rows before grouping.",
    "examQuestion": "Differentiate WHERE and HAVING with a grouped query.",
    "examAnswer": [
      "WHERE removes individual input rows before grouping. GROUP BY forms groups, such as one group for each customer, and aggregates compute a value within each group.",
      "HAVING filters completed groups: HAVING SUM(amount) > 1000 retains customers whose total exceeds 1000. Filtering out an individual line below 1000 in WHERE would answer a different question.",
      "COUNT(*) counts rows, COUNT(column) excludes NULL values, and SUM over no input returns NULL. A customer with several order lines must be aggregated at the intended grain so joins do not multiply the total."
    ],
    "interviewQuestion": "Why can AVG of departmental averages be incorrect?",
    "interviewAnswer": "It weights each department equally even when their observation counts differ. Aggregate original observations or combine sums and counts with appropriate weights.",
    "followUp": "What is the difference between lines, units, and orders?",
    "followUpAnswer": "COUNT of line rows counts lines; SUM(quantity) counts units; a count at order grain counts orders. The intended business measure determines the query."
  },
  "subqueries-sets": {
    "before": [
      "filtering",
      "aggregation"
    ],
    "introduction": "Some questions depend on another answer: which products cost more than the average product? A subquery provides that intermediate answer. Set operations answer a different kind of question by combining or comparing complete query results.",
    "definition": "A subquery is a query nested within another SQL statement. Set operations combine compatible query results: UNION forms a union, INTERSECT finds common tuples, and EXCEPT finds tuples present only in the left result.",
    "examQuestion": "Explain scalar and correlated subqueries, and compare UNION with UNION ALL.",
    "examAnswer": [
      "A scalar subquery supplies one column from at most one row; no row yields NULL and multiple rows cause an error. An aggregate such as AVG can supply the threshold for a comparison.",
      "A correlated subquery references an outer query value. EXISTS tests whether a matching row exists without multiplying the outer rows.",
      "UNION removes duplicate result tuples; UNION ALL retains occurrences. Inputs need compatible column counts/types. EXCEPT and INTERSECT compare results rather than joining their columns side by side."
    ],
    "interviewQuestion": "Does a correlated subquery necessarily execute once per outer row?",
    "interviewAnswer": "That describes its logical dependency, not a required physical algorithm. PostgreSQL may transform the query. Inspect a plan rather than infer performance solely from the syntax.",
    "followUp": "When is UNION ALL preferable?",
    "followUpAnswer": "When duplicate occurrences must be preserved or branches are deliberately disjoint. Avoid paying for deduplication or silently removing meaningful repeated facts."
  },
  "ctes": {
    "before": [
      "subqueries-sets",
      "joins"
    ],
    "introduction": "When a query has several reasoning steps, name them. A CTE lets you say “first calculate order totals, then use those totals.” A recursive CTE repeats a relationship-following step, such as finding children and then their children.",
    "definition": "A common table expression is a named auxiliary query defined using WITH for use within one statement. A recursive CTE combines an anchor term with a recursive term to compute successive related rows.",
    "examQuestion": "Explain a recursive CTE and its termination condition.",
    "examAnswer": [
      "The anchor query selects starting rows, such as root categories. The recursive term joins child categories to the rows already reached.",
      "UNION ALL appends successive results. A path of visited IDs can prevent revisiting an ID and looping through a cycle. An application may also impose a maximum traversal depth.",
      "The CTE exists for one statement, not as a permanent table. Logical recursion does not guarantee output order; an explicit path ordering can define it. Materialization and physical execution depend on the optimizer and applicable CTE options."
    ],
    "interviewQuestion": "Does WITH always cache its result?",
    "interviewAnswer": "No. Eligible PostgreSQL CTEs can be folded into the parent query. MATERIALIZED and NOT MATERIALIZED affect supported cases, so use actual plans for a performance decision.",
    "followUp": "Does a self-referencing foreign key prevent cycles?",
    "followUpAnswer": "It checks that the referenced parent exists. It does not prove that following parent links can never return to an earlier node."
  },
  "windows": {
    "before": [
      "aggregation",
      "ctes"
    ],
    "introduction": "A summary total removes detail rows, but sometimes you want both: each order and its position among that customer’s orders. A window function adds a calculation while keeping the individual rows.",
    "definition": "A window function computes a value over a related set of rows defined by OVER, while retaining the input row grain. The window definition can specify partitioning, ordering, and a frame.",
    "examQuestion": "Compare GROUP BY with window functions and explain ranking ties.",
    "examAnswer": [
      "GROUP BY reduces input rows to one row per group. A window function keeps each detail row and attaches a calculated value, such as its rank within a customer’s orders.",
      "PARTITION BY separates independent calculation groups. ROW_NUMBER assigns unique positions; RANK leaves gaps after ties; DENSE_RANK does not. A unique tie-breaker makes row numbering deterministic.",
      "ORDER BY inside OVER controls the calculation, not final result ordering. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW gives a row-based running frame. A peer-inclusive default frame can include several tied rows at once and therefore change a running result."
    ],
    "interviewQuestion": "Why does LAST_VALUE sometimes return the current value rather than the partition’s last value?",
    "interviewAnswer": "It operates over the current frame. With the default ordered frame, that frame may end at the current peer group. Specify the intended full-partition frame when that is the requirement.",
    "followUp": "How do you filter the top row per customer?",
    "followUpAnswer": "Compute a deterministic ROW_NUMBER in a CTE or subquery, then filter rn = 1 in the outer query level."
  },
  "types": {
    "before": [
      "syntax",
      "writes"
    ],
    "introduction": "A value’s type describes which values are allowed and how operations behave. The text “12” and the number 12 may look similar on a screen but have different meanings. Choose types from the business meaning before choosing display formatting.",
    "definition": "A SQL data type specifies a domain of values and associated operations. Type choices affect valid input, precision, comparison, storage, and conversion between database and application values.",
    "examQuestion": "Discuss numeric and date/time type choices for a backend application.",
    "examAnswer": [
      "Use exact integer/numeric types where exact quantities or decimal amounts are required. Floating-point types approximate values and should not silently define invoice arithmetic.",
      "Use date for a calendar day and timestamptz for an event instant. A timestamp without time zone represents a local clock reading without identifying a unique instant.",
      "Correct type selection includes range, precision, rounding, time-zone, and driver-conversion policies. Defaults, NOT NULL, and CHECK constraints address different requirements and must be chosen separately."
    ],
    "interviewQuestion": "Does timestamptz remember the original named time zone?",
    "interviewAnswer": "No. It represents an instant and displays according to the session zone. Preserve the original zone separately when the domain needs it, such as recurring local schedules.",
    "followUp": "Why might a driver return numeric or bigint as a string?",
    "followUpAnswer": "The value may not be representable exactly as a JavaScript Number. Preserve precision rather than automatically coercing it."
  },
  "functions": {
    "before": [
      "select",
      "types",
      "nulls"
    ],
    "introduction": "An expression can transform a value without changing the stored row. A function is a named operation, such as converting a name to uppercase or rounding a decimal. Read nested expressions from the innermost operation outward.",
    "definition": "SQL functions accept arguments and produce values or sets according to their type and behavior contracts. Scalar functions transform values; aggregate functions combine values from multiple rows.",
    "examQuestion": "Explain string, numeric, date/time, and conditional functions with use cases.",
    "examAnswer": [
      "Use LOWER/UPPER/TRIM for defined text transformations, ROUND for an explicit decimal rounding policy, and date/time functions for a chosen reporting period.",
      "CASE selects a result by conditions; COALESCE selects the first non-null value; NULLIF can turn a chosen value into NULL. For example, COALESCE(email, 'not provided') changes how a missing value is displayed without updating the stored email.",
      "Function behavior depends on types, NULLs, collation, and time zone. An ordered ARRAY_AGG or STRING_AGG needs ordering inside the aggregate when element order matters."
    ],
    "interviewQuestion": "Does LOWER(TRIM(email)) validate an email address?",
    "interviewAnswer": "No. It performs text transformations. Validation, uniqueness, and the chosen identity/case policy are separate domain requirements.",
    "followUp": "Is CURRENT_TIMESTAMP a continuously moving clock during a transaction?",
    "followUpAnswer": "In PostgreSQL it is tied to transaction start. Use the appropriate statement or wall-clock function for the intended measurement."
  },
  "schema-design": {
    "before": [
      "sample-schema",
      "types",
      "writes"
    ],
    "introduction": "Application validation helps a person correct input. Database constraints protect the saved facts even when two requests arrive together or another program writes to the same tables. Start with the rule that must never be broken, then choose the constraint that expresses it.",
    "definition": "Relational design organizes facts according to keys and dependencies. Integrity constraints enforce valid row values, unique identities, and valid references between related tables.",
    "examQuestion": "Explain entity, referential, and domain integrity with constraints.",
    "examAnswer": [
      "Entity integrity requires a reliable identity, commonly a unique non-null primary key. Referential integrity requires a foreign key value to refer to an eligible parent key, subject to the relationship’s NULL policy.",
      "Domain integrity restricts allowed values using types and constraints. CHECK(stock >= 0) rejects negative stock, but NULL yields UNKNOWN and can pass; NOT NULL is a separate requirement.",
      "Normalization organizes facts according to dependencies to avoid inconsistent repeated updates. ON DELETE CASCADE removes owned dependent rows, while a restrictive action can protect independent history. The appropriate deletion action follows the relationship’s meaning."
    ],
    "interviewQuestion": "Can application validation replace a unique constraint?",
    "interviewAnswer": "No. Two requests can both validate before either commits. A database uniqueness rule is the final protection against conflicting concurrent inserts.",
    "followUp": "Does a foreign key automatically index the child columns?",
    "followUpAnswer": "Not in PostgreSQL. The referenced key is indexed, but indexes on referencing columns must be justified and created separately."
  },
  "json-arrays": {
    "before": [
      "types",
      "schema-design",
      "functions"
    ],
    "introduction": "Some product properties vary: a monitor has a size while a keyboard has a color. JSONB can store flexible attributes, but a flexible format does not remove the need to define valid data or relationships.",
    "definition": "JSONB is PostgreSQL’s decomposed representation of JSON data with query and indexing support. SQL arrays are typed ordered collections; neither automatically replaces relational keys and child tables.",
    "examQuestion": "Explain JSONB extraction, containment, and its modeling trade-offs.",
    "examAnswer": [
      "The -> operator returns JSON, while ->> extracts text. The @> operator tests containment. Missing keys and JSON null require deliberate handling.",
      "Keep frequently constrained identities and relationships in typed relational columns. Use JSONB for justified flexible attributes with a shape-validation policy.",
      "Choose an index for the operators actually used. A general document index and an expression index on one extracted field solve different access patterns and add different write costs."
    ],
    "interviewQuestion": "Should a list of related product IDs be stored in JSON instead of a linking table?",
    "interviewAnswer": "Not when the relationship needs foreign keys, independent updates, or attributes such as quantity and historical price. A linking table makes those rules explicit.",
    "followUp": "What can go wrong when replacing a whole JSON document from an application?",
    "followUpAnswer": "A stale read can overwrite another request’s independent field change. Use appropriate path updates or concurrency protection."
  },
  "views-procedures": {
    "before": [
      "joins",
      "schema-design"
    ],
    "introduction": "A frequently reused query can be given a name as a view. A calculation can become a function. A trigger runs because another statement changed data. These objects differ in when they run, what they store, and how visible their effects are.",
    "definition": "A view is a named query; a materialized view stores a query result requiring refresh. Functions and procedures encapsulate database logic, while triggers execute in response to specified database events.",
    "examQuestion": "Compare views, materialized views, stored routines, and triggers.",
    "examAnswer": [
      "An ordinary view stores a query definition and evaluates against the current snapshot. A materialized view stores results and may be stale until refreshed.",
      "A function returns a value or relation; a procedure is invoked through its procedure interface and has engine-specific transaction rules. Oracle PL/SQL and PostgreSQL PL/pgSQL implement related concepts but are not interchangeable languages.",
      "A trigger runs implicitly on its defined event. Timing and row/statement granularity determine when and how often it executes. Its transactional changes roll back with the parent operation, but external effects do not. Declarative constraints are preferable for invariants they can directly express."
    ],
    "interviewQuestion": "Can a trigger safely send an email as part of an order update?",
    "interviewAnswer": "A database rollback cannot necessarily undo an external delivery. Persist an outbox event in the transaction and deliver it through an idempotent worker.",
    "followUp": "Is a view automatically a security boundary?",
    "followUpAnswer": "No. Ownership, invoker/definer behavior, privileges, RLS, and view options must be reviewed for the intended boundary."
  },
  "migrations": {
    "before": [
      "schema-design",
      "transactions"
    ],
    "introduction": "A running application may have millions of rows and several deployed versions. A migration changes the data model while those readers and writers continue to exist. A command that works on an empty scratch table may block or break a live deployment.",
    "definition": "A database migration is a versioned, controlled change to schema or data, applied through a recorded deployment process with compatibility and recovery considerations.",
    "examQuestion": "Explain expand-migrate-contract for a column replacement.",
    "examAnswer": [
      "Expand by adding a compatible new representation. Deploy code that can coexist with old application instances, then backfill existing data in bounded work.",
      "Validate completeness and constraints before switching readers. Monitor locks, execution time, write volume, and downstream effects.",
      "Contract by removing the old representation only after its compatibility and rollback window ends. A down script cannot reconstruct deleted information without an appropriate recovery source."
    ],
    "interviewQuestion": "Does transactional DDL mean it cannot block requests?",
    "interviewAnswer": "No. Atomic rollback and lock strength are separate properties. Inspect lock behavior and use bounded lock-wait policies.",
    "followUp": "Why is CREATE INDEX CONCURRENTLY special?",
    "followUpAnswer": "It permits more concurrent write activity but cannot run in a normal transaction block and may require cleanup of an invalid index after failure."
  },
  "transactions": {
    "before": [
      "writes",
      "schema-design"
    ],
    "introduction": "A checkout changes several facts. If stock decreases but order creation fails, the database must not retain half the operation. A transaction groups related database work into one success or failure boundary.",
    "definition": "A transaction is a logical unit of database work governed by atomicity, consistency, isolation, and durability. COMMIT accepts its changes; ROLLBACK discards its uncommitted transactional changes.",
    "examQuestion": "Explain ACID properties using a checkout example.",
    "examAnswer": [
      "Atomicity means stock reservation, order, and line-item changes commit together or are rolled back. Consistency requires constraints and application invariants to hold.",
      "Isolation determines how concurrent transactions interact. Durability concerns survival of committed work under the configured storage and recovery guarantees.",
      "BEGIN starts the unit; COMMIT accepts its changes; ROLLBACK discards them on failure. A savepoint permits partial rollback but does not independently commit work."
    ],
    "interviewQuestion": "Why must a node-postgres transaction use one client?",
    "interviewAnswer": "Transaction state belongs to one connection. Separate pool.query calls may use different connections, so they do not form the intended transaction.",
    "followUp": "Should only the failing statement be retried after a serialization failure?",
    "followUpAnswer": "Retry the complete logical transaction against a fresh snapshot, with bounded attempts and a safe policy for external side effects."
  },
  "concurrency": {
    "before": [
      "transactions",
      "writes"
    ],
    "introduction": "Two individually correct requests can still interfere. If both buyers see one item available, reading stock in advance does not decide which buyer may reserve it. Use this lesson’s two-session lab to observe the conflict rather than guessing from sequential code.",
    "definition": "Concurrency control coordinates overlapping transactions while preserving required data invariants. MVCC supplies versioned snapshots; isolation levels and locking determine visibility and conflict behavior.",
    "examQuestion": "Explain READ COMMITTED, REPEATABLE READ, and SERIALIZABLE in PostgreSQL.",
    "examAnswer": [
      "Under PostgreSQL READ COMMITTED, each statement gets a new snapshot. REPEATABLE READ retains a transaction snapshot but can still permit serialization anomalies such as write skew.",
      "SERIALIZABLE makes successful concurrent outcomes equivalent to a serial ordering, potentially aborting conflicting transactions. The application must be prepared to retry the complete transaction safely.",
      "Row locks coordinate conflicting operations; acquiring multiple locks in a consistent order reduces deadlock cycles. UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock >= 1 protects the availability check inside the write, unlike an earlier unprotected SELECT followed by an unconditional change."
    ],
    "interviewQuestion": "Does SELECT FOR UPDATE lock a row that does not exist?",
    "interviewAnswer": "It locks selected existing rows, not a missing key. Use uniqueness, a carefully designed lock protocol, or suitable isolation for absence-based invariants.",
    "followUp": "When is SKIP LOCKED appropriate?",
    "followUpAnswer": "For work-queue consumers that intentionally skip claimed jobs. It provides an incomplete view and is not a general way to make ordinary reports correct or fast."
  },
  "indexes": {
    "before": [
      "filtering",
      "sorting-pagination",
      "schema-design"
    ],
    "introduction": "Finding a word in a book is easier with an index than by reading every page. A database index similarly provides another way to locate candidate rows. Unlike a book index, it must also be maintained whenever relevant data changes.",
    "definition": "An index is an auxiliary access structure that can accelerate supported search, join, and ordering operations. It requires storage and write maintenance, and the optimizer decides whether using it is beneficial.",
    "examQuestion": "Explain composite indexes and the costs of indexing.",
    "examAnswer": [
      "A composite index uses several key columns in a defined order. An index on (user_id, created_at DESC, id DESC) can support a customer-specific newest-order query by narrowing the customer range and matching the ordering.",
      "The benefit depends on selectivity, data size, and workload. A sequential scan can be cheaper on a small table or for a broad predicate. PostgreSQL chooses an access path rather than being required to use an available index.",
      "Indexes add storage and write/WAL work. A partial index covers a defined subset, an expression index covers a computed expression, and INCLUDE can store payload columns. Representative EXPLAIN results and workload measurements are needed to justify the cost."
    ],
    "interviewQuestion": "Should every foreign key and filter column get an index automatically?",
    "interviewAnswer": "No. Evaluate access patterns, referential checks, selectivity, write volume, and overlapping indexes. Constraints and indexes have related but different purposes.",
    "followUp": "Does an index-only scan always avoid the heap?",
    "followUpAnswer": "No. PostgreSQL also needs visibility information; heap fetches may still occur depending on the visibility map and workload."
  },
  "query-plans": {
    "before": [
      "indexes",
      "joins"
    ],
    "introduction": "A SQL query states the result you want. A query plan describes how the database intends to obtain it. Read the plan to test a specific performance hypothesis, such as whether a matching index avoids scanning and sorting many rows.",
    "definition": "A query execution plan is a tree of physical operations chosen by the optimizer. EXPLAIN shows planned operations; EXPLAIN ANALYZE executes the statement and reports actual execution measurements.",
    "examQuestion": "Explain how to investigate a slow query with EXPLAIN ANALYZE.",
    "examAnswer": [
      "Record the exact query, representative parameters, data size, and workload context. Compare estimated and actual rows, node loops, filtering, scans, sorting, and buffers.",
      "Costs are planner units, not elapsed milliseconds. An estimate error can propagate into a poor join or scan choice. Separate database work from lock waiting, pool waiting, and response transfer.",
      "Change one justified factor, such as an index or query shape, and measure again under comparable conditions. EXPLAIN ANALYZE on a write actually performs the write, so use an appropriate test or rollback boundary."
    ],
    "interviewQuestion": "Can you compare two plans by cost alone and claim a measured speedup?",
    "interviewAnswer": "No. Costs are estimates within a planning model. Measure actual behavior and describe cache, data, parameters, and concurrency.",
    "followUp": "Why multiply rows by loops when reading a plan?",
    "followUpAnswer": "Actual row/time figures at a repeatedly executed node are commonly per execution. Ignoring loops understates the work."
  },
  "node-postgres": {
    "before": [
      "transactions",
      "concurrency",
      "types"
    ],
    "introduction": "An API talks to PostgreSQL through a driver. A connection is one conversation with the server; a pool reuses several connections. Your code must keep values separate from SQL syntax and return every checked-out connection, including on failure.",
    "definition": "A database driver implements application/database communication. A connection pool manages reusable connections; parameterized queries bind data values separately from SQL structure.",
    "examQuestion": "Describe a safe application transaction using a pooled connection.",
    "examAnswer": [
      "Validate inputs and acquire one client. Start BEGIN and execute all related statements through that client with bound values.",
      "Commit on success; attempt rollback on failure; release the client in finally and discard a broken connection. Do not use independent pool.query calls inside that transaction.",
      "Set bounded timeouts, handle SQLSTATE according to the operation, preserve numeric/time meaning, and define safe retry and ambiguous-commit recovery policies."
    ],
    "interviewQuestion": "Does naming a prepared statement make an otherwise interpolated query safe?",
    "interviewAnswer": "No. Bind untrusted values correctly. Prepared-plan naming is a connection-level planning feature and does not replace safe query construction.",
    "followUp": "What happens when a client is never released?",
    "followUpAnswer": "The pool can exhaust its available connections, causing unrelated requests to wait or time out even when their SQL is fast."
  },
  "security": {
    "before": [
      "filtering",
      "node-postgres"
    ],
    "introduction": "There are two separate questions: can input change the SQL structure, and is this caller allowed to access the matching record? Parameter binding addresses the first. Ownership checks, privileges, and policies address the second.",
    "definition": "SQL injection occurs when untrusted input changes the intended SQL command structure. Prevention uses parameterized values and controlled SQL structure, alongside least privilege and independent authorization checks.",
    "examQuestion": "Explain SQL injection prevention and why authorization remains necessary.",
    "examAnswer": [
      "Bind values instead of concatenating them into SQL. Use allowlists for identifiers or sort fragments that cannot be supplied as value parameters.",
      "Include the authenticated ownership/tenant rule in the data access. A perfectly parameterized lookup by ID alone can still disclose another user’s record.",
      "Use a restricted runtime role and protect credentials. RLS also depends on the runtime role and trusted request context. Transaction-local settings avoid pooled context leaks; owners and BYPASSRLS roles have important exceptions."
    ],
    "interviewQuestion": "Can an attacker read another user’s order without SQL injection?",
    "interviewAnswer": "Yes, if the endpoint accepts an order ID but omits ownership authorization. This is an access-control defect even when every value is bound safely.",
    "followUp": "Is an application-set RLS variable a defense against arbitrary SQL access under that role?",
    "followUpAnswer": "Not by itself. An attacker with arbitrary SQL may set it too. State the trusted-identity and SQL-access assumptions of the policy."
  },
  "data-access": {
    "before": [
      "node-postgres",
      "joins",
      "aggregation"
    ],
    "introduction": "A request often needs a parent page and its child records. A simple loop can turn that into one initial query plus another query for every parent. The repository should make this cost and the intended response shape visible.",
    "definition": "A repository encapsulates persistence operations with explicit input, result, and transaction contracts. The N+1 query pattern performs one parent query followed by additional queries proportional to the returned parent count.",
    "examQuestion": "Explain the N+1 problem and two remedies.",
    "examAnswer": [
      "One order query followed by a separate line-item query for each order is an N+1 pattern. The number of network/database operations grows with the result size.",
      "Batch child lookup for a bounded set of parent IDs, or join/nest related data in a query designed at the required grain.",
      "Apply a parent-page limit before expanding children, preserve ordering, and inspect generated ORM SQL. Unbounded Promise.all can overload a pool rather than solve the query pattern."
    ],
    "interviewQuestion": "Why can LIMIT on a parent-child join return incomplete orders?",
    "interviewAnswer": "The limit applies to joined rows, so one parent’s children may consume the page or be cut off. Select the parent page first, then load its children.",
    "followUp": "Does choosing an ORM remove the need to know SQL?",
    "followUpAnswer": "No. You still own constraints, authorization, transaction boundaries, query count, result shape, and the performance of generated statements."
  },
  "advanced-postgres": {
    "before": [
      "ctes",
      "windows",
      "json-arrays",
      "indexes"
    ],
    "introduction": "These PostgreSQL tools solve particular problems, not milestones every query must use. Learn the access pattern first: one related row per parent, interval overlap, word-based search, or management of very large time-based data.",
    "definition": "PostgreSQL-specific relational features extend common SQL with tools such as LATERAL, DISTINCT ON, range operators, full-text search, and declarative partitioning. Their suitability depends on semantics and workload.",
    "examQuestion": "Explain LATERAL and DISTINCT ON, and discuss one advanced storage/search feature.",
    "examAnswer": [
      "LATERAL permits a FROM item to reference preceding items, useful for a bounded related lookup per parent. LEFT JOIN LATERAL can preserve parents with no matching child.",
      "DISTINCT ON retains the first row per specified group under a compatible ORDER BY. A deterministic tie-breaker is essential.",
      "For ranges, search, or partitioning, explain the actual requirement and matching operators/indexes. Partitioning does not replace indexes or automatically improve a small table."
    ],
    "interviewQuestion": "Is PostgreSQL full-text search equivalent to LIKE?",
    "interviewAnswer": "No. Full-text search processes words/lexemes using a configuration and query operators. LIKE matches character patterns. Language, ranking, and index design differ.",
    "followUp": "Does partitioning make id globally unique automatically?",
    "followUpAnswer": "No. Partitioned-table uniqueness has partition-key restrictions. Design and test the required identity rule explicitly."
  },
  "testing": {
    "before": [
      "writes",
      "transactions",
      "node-postgres"
    ],
    "introduction": "A query that looks correct can still return the wrong rows or fail under a real constraint. Test the behavior at the database boundary: valid data, rejected data, empty results, failure recovery, and independent concurrent connections.",
    "definition": "Database integration testing executes real schema and query behavior against an isolated database to verify results, constraints, transactions, and application/database contracts.",
    "examQuestion": "Design tests for a checkout transaction.",
    "examAnswer": [
      "Test a valid checkout and verify stock, order, and line items together. Inject a failure after an intermediate write and verify rollback leaves none of the partial changes.",
      "Test duplicate request keys, changed payloads, invalid quantities, missing references, and cross-user access. Assert structured errors and final state.",
      "Use separate connections for concurrency tests and control their synchronization. A mocked repository or single-connection embedded engine cannot establish multi-session isolation behavior."
    ],
    "interviewQuestion": "Why is catching any error insufficient in a constraint test?",
    "interviewAnswer": "An unrelated syntax or connection error could make the test appear to pass. Assert the expected SQLSTATE or specific domain outcome.",
    "followUp": "Should exact EXPLAIN timing be snapshotted?",
    "followUpAnswer": "No. Timings and valid plans change with versions, statistics, caches, and hardware. Assert behavior and investigate performance under described conditions."
  },
  "operations": {
    "before": [
      "migrations",
      "testing",
      "query-plans"
    ],
    "introduction": "A service must recover its data, not just answer queries while everything works. Operations starts with a recoverable backup, a verified restore, bounded imports, and enough monitoring to distinguish database work from waiting.",
    "definition": "Database operations includes controlled data transfer, backup and recovery, maintenance, and monitoring needed to preserve availability, integrity, and recoverability.",
    "examQuestion": "Explain why a backup must be validated by a restore drill.",
    "examAnswer": [
      "A backup file existing does not establish that the intended data, roles, extensions, and application behavior can be recovered. Restore into a separate environment and verify representative data and constraints.",
      "A logical dump records database objects/data for restoration; physical backups with WAL support a different recovery process, including point-in-time recovery when configured. Define acceptable data loss and restoration time, then measure the process against them.",
      "Include import validation, vacuum/statistics maintenance, long transactions, lock/pool waits, storage, and replication indicators in the operational plan."
    ],
    "interviewQuestion": "Does VACUUM normally shrink a table file back to the operating system?",
    "interviewAnswer": "Ordinary VACUUM generally makes space reusable inside the relation and maintains MVCC visibility. VACUUM FULL rewrites and has stronger locking/operational costs.",
    "followUp": "Why can an idle transaction harm performance?",
    "followUpAnswer": "It can retain locks, old snapshots/row versions, and a pool connection, delaying cleanup and other requests."
  },
  "capstone": {
    "before": [
      "testing",
      "security",
      "data-access",
      "operations"
    ],
    "introduction": "Now connect the separate skills into one operation whose correctness you can explain. A checkout must identify the caller, reserve stock, record the order, handle repeats, and recover from failure. Treat the required invariant as the design target.",
    "definition": "An invariant-preserving checkout coordinates validated, authorized, idempotent database changes in a transaction so that inventory, order records, and retry outcomes remain consistent.",
    "examQuestion": "Design a reliable checkout and describe the evidence needed to validate it.",
    "examAnswer": [
      "Validate quantity and trusted user identity; use a request key with payload matching. Atomically reserve available stock and create the order and lines on one connection.",
      "Commit a complete result or roll back all intermediate database changes. Resolve repeats from the stored outcome, and separate external actions through an explicit idempotent delivery workflow.",
      "Demonstrate competing-request correctness, duplicate-request behavior, injected failures, ownership isolation, a representative query-plan investigation, migration compatibility, and a restore check."
    ],
    "interviewQuestion": "What if the client loses the response after COMMIT?",
    "interviewAnswer": "The client may not know whether the operation succeeded. Reusing the same request key allows the service to recover the stored outcome; a new key can create a duplicate operation.",
    "followUp": "Why not call a payment provider inside the retryable database transaction?",
    "followUpAnswer": "A database rollback does not reverse an external charge, and retry can repeat it. Use a documented state/outbox workflow with idempotent external processing."
  }
}
