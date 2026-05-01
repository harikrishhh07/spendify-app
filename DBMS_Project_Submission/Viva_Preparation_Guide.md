# Antigravity - DBMS Viva Preparation Guide

## 1. 2-Minute Spoken Presentation Script

"Good morning, Dr. Sakthitharan. My project is 'Antigravity', a Self Expense Management System. While our deployed frontend prototype utilizes Firebase to enable rapid development and real-time UI testing without a dedicated backend server, the core architecture of Antigravity is fully designed and modeled using rigorous relational database principles. 

For this project, I have designed a highly normalized schema up to 3NF, consisting of 7 tables including USER, INCOME, EXPENSE, CATEGORY, and BUDGET. This ensures zero data redundancy. I have implemented strict referential integrity using Foreign Keys, and added CHECK and UNIQUE constraints to maintain data accuracy.

During this review, I am ready to demonstrate advanced DBMS concepts. I have prepared 15 diverse SQL queries showcasing joins, nested subqueries, and aggregate grouping. Furthermore, I have implemented 3 Database Views for financial reporting, 3 Triggers to automatically audit incomes and block over-budget spending, and 3 Stored Procedure Cursors to compute running totals. I would be happy to walk you through the ER diagram or execute any query live to prove the robustness of the backend architecture."

---

## 2. 25 Likely Faculty Viva Questions & Answers

### Basic (Tables, Keys, Normalization)

**1. What is the Primary Key in your EXPENSE table?**
"I used `expense_id` as the Primary Key. It uniquely identifies each transaction."

**2. Why did you use Foreign Keys in your project?**
"I used Foreign Keys to enforce referential integrity. For example, the `user_id` in the `EXPENSE` table must exist in the `USER` table. This prevents orphan records."

**3. What is 1NF? Is your database in 1NF?**
"1NF means all columns contain atomic, indivisible values, and every table has a Primary Key. Yes, my database is in 1NF."

**4. How did you achieve 3NF?**
"To achieve 3NF, I removed transitive dependencies. Instead of storing the category name directly in the `EXPENSE` table, I created a separate `CATEGORY` table and linked it using `category_id`. Now, if a category name changes, I only update it in one place."

**5. What is a CHECK constraint? Where did you use it?**
"A CHECK constraint limits the values accepted by a column. I used it on the `EXPENSE` table to ensure `amount > 0`, so a user cannot enter a negative expense."

**6. Why is email UNIQUE in the USER table?**
"To prevent duplicate account registrations. The UNIQUE constraint ensures no two users can share the exact same email address."

**7. Can a Primary Key be NULL?**
"No, a Primary Key must be unique and NOT NULL to uniquely identify a record."

**8. What does ON DELETE CASCADE do in your schema?**
"If a `USER` is deleted, ON DELETE CASCADE automatically deletes all their linked records in `EXPENSE`, `INCOME`, and `BUDGET`, maintaining database consistency."

### Intermediate (Joins, Views, Triggers, Cursors)

**9. What is the difference between INNER JOIN and LEFT JOIN?**
"INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table, and matching rows from the right table, showing NULL if there is no match."

**10. What is a Database View?**
"A View is a virtual table based on the result-set of an SQL statement. It simplifies complex queries."

**11. Name one View you created and its purpose.**
"I created `vw_financial_summary`. It abstracts away the math and joins, instantly showing the total income, expense, and net balance for each user."

**12. What is a Trigger?**
"A Trigger is a set of SQL instructions that automatically execute in response to an INSERT, UPDATE, or DELETE event on a table."

**13. Explain your `trg_check_budget` trigger.**
"It is a BEFORE INSERT trigger on the `EXPENSE` table. It checks the user's monthly budget, and if the new expense pushes their total spending over the limit, it throws an error and blocks the insertion."

**14. What does the `trg_income_audit` trigger do?**
"It is an AFTER INSERT trigger. Whenever a new income is added, it silently copies the details into an `INCOME_AUDIT` table to track financial history."

**15. What is a Cursor in DBMS?**
"A Cursor allows row-by-row processing of a query result set inside a stored procedure, which is useful when complex logic needs to be applied to each row individually."

**16. How did you use a Cursor in your project?**
"I used a cursor in `proc_label_expenses` to loop through all expenses one by one, checking the amount, and dynamically labeling them as 'Low', 'Medium', or 'High' spend."

**17. What is the difference between a Trigger and a Stored Procedure?**
"A Trigger runs automatically based on an event, whereas a Stored Procedure must be explicitly called by the user or application."

### Advanced (Transactions, Concurrency, Schema)

**18. What does the GROUP BY clause do in your queries?**
"GROUP BY groups rows that have the same values into summary rows. I used it with SUM to calculate total expenses per user."

**19. What is the difference between WHERE and HAVING?**
"WHERE filters individual rows before grouping. HAVING filters groups after the GROUP BY clause is applied. I used HAVING to find users whose total spending exceeded 45% of their budget."

**20. What is a Subquery?**
"A subquery is a query nested inside another query. I used one to find expenses that were greater than the overall average expense."

**21. What is the UNION operator?**
"UNION combines the result sets of two or more SELECT statements into a single column. I used it to combine Income and Expense records into one unified ledger."

**22. How would you handle a transaction failure in this system?**
"I would use the ACID properties, specifically Atomicity. If a user transfers money, I would wrap the UPDATE statements in a `START TRANSACTION`. If one fails, I use `ROLLBACK`. If both succeed, I use `COMMIT`."

**23. What is a Derived Attribute in an ER Diagram?**
"A derived attribute is one whose value is calculated from other attributes, like `net_balance` which is `Total Income - Total Expense`. It is shown as a dashed oval."

**24. How would you extend this schema in the future?**
"I could add a `BILL_REMINDER` table, or a `FRIENDS_SPLIT` table with an N-to-N relationship between users to track shared expenses."

### Bonus (Firebase Question)

**25. Why did you build the UI with Firebase if this is a DBMS course?**
"Sir, the deployed prototype uses Firebase for rapid frontend UI development so we could test the application immediately without server hosting. However, the exact data architecture mapped in Firebase has been rigorously modeled, designed, and demonstrated using relational SQL principles for this review. All my DBMS concepts—normalization, constraints, triggers, and cursors—are fully implemented in the provided SQL schema to prove my understanding of the subject."

---

## 3. One-Page Cheat Sheet

### Tables & Primary Keys
- **USER** (`user_id`)
- **CATEGORY** (`category_id`)
- **PAYMENT_METHOD** (`payment_id`)
- **INCOME** (`income_id`)
- **EXPENSE** (`expense_id`)
- **BUDGET** (`budget_id`)
- **SAVING** (`saving_id`)

### Relationships (Foreign Keys)
- `EXPENSE` ➔ `USER` (`user_id`)
- `EXPENSE` ➔ `CATEGORY` (`category_id`)
- `EXPENSE` ➔ `PAYMENT_METHOD` (`payment_id`)
- `INCOME` / `BUDGET` / `SAVING` ➔ `USER` (`user_id`)

### Advanced Features Summary
- **trg_check_budget (Trigger):** Blocks expense if over monthly limit.
- **trg_income_audit (Trigger):** Logs new income to audit table.
- **trg_protect_old_expense (Trigger):** Prevents deleting expenses > 30 days old.
- **vw_financial_summary (View):** Shows total income, expense, and net balance.
- **vw_expense_details (View):** Joins 4 tables for a readable expense report.
- **vw_budget_status (View):** Shows budget percentage used and status.
- **proc_income_summary (Cursor):** Calculates total income per user row-by-row.
- **proc_label_expenses (Cursor):** Labels expenses Low/Med/High row-by-row.
- **proc_running_total (Cursor):** Calculates a cumulative spending total.

### 15 Queries Quick Reference
1. **SELECT WHERE:** Filter user expenses.
2. **INNER JOIN (2):** Expense + Category.
3. **INNER JOIN (4):** Full readable report.
4. **LEFT JOIN:** Users + Budgets.
5. **GROUP BY COUNT:** Transactions per category.
6. **GROUP BY SUM:** Total spent per user.
7. **AVG/MIN/MAX:** Statistics.
8. **HAVING:** Users > 45% budget.
9. **Subquery:** Expenses > average.
10. **UNION:** Ledger (Income + Expense).
11. **ORDER BY LIMIT:** Top 3 expenses.
12. **LIKE:** Keyword search ('Shopping').
13. **Math in SELECT:** Net balance.
14. **NOT IN:** Categories unique to User 1.
15. **BETWEEN:** Feb 2026 filter.

### Mini Glossary (5 words each)
1. **Primary Key:** Unique identifier for a record.
2. **Foreign Key:** Links to another table's PK.
3. **Normalization:** Organizing data to reduce redundancy.
4. **Trigger:** Code running automatically on events.
5. **View:** Virtual table from a query.
6. **Cursor:** Processes query results row-by-row.
7. **Subquery:** A query inside another query.
8. **Schema:** The blueprint of the database.
9. **Constraint:** Rule applied to a column.
10. **Join:** Combines rows from two tables.
