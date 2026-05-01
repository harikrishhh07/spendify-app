# Antigravity (Self Expense Management System) - DBMS Mini-Project Report Material

## 1. Relational Schema & Normalization (Up to 3NF)
**Normalization Explanation:**
The schema is designed in Third Normal Form (3NF). 
- **1NF:** All tables have a primary key, and all attributes contain atomic values. 
- **2NF:** It is in 1NF, and all non-key attributes are fully functionally dependent on the primary key (no partial dependencies).
- **3NF:** It is in 2NF, and there are no transitive dependencies. For example, `category_name` is stored in the `CATEGORY` table rather than repeating it in the `EXPENSE` table. `EXPENSE` only holds the `category_id` (Foreign Key).

### Tables & Constraints
1. **USER**: `user_id` (PK), `first_name`, `last_name`, `email` (UNIQUE), `phone_number`, `currency`. 
2. **CATEGORY**: `category_id` (PK), `name`, `type`. 
3. **PAYMENT_METHOD**: `payment_id` (PK), `user_id` (FK to USER), `method_name`. 
4. **INCOME**: `income_id` (PK), `user_id` (FK to USER), `amount`, `date`, `source`. 
5. **EXPENSE**: `expense_id` (PK), `user_id` (FK to USER), `category_id` (FK to CATEGORY), `payment_id` (FK to PAYMENT_METHOD), `amount` (CHECK > 0), `date`, `description`. 
6. **BUDGET**: `budget_id` (PK), `user_id` (FK to USER), `amount`, `start_date`, `end_date`, `period_month`, `period_year`. 
7. **SAVING**: `saving_id` (PK), `user_id` (FK to USER), `goal_name` (NOT NULL), `amount`, `date`. 
8. **INCOME_AUDIT**: `audit_id` (PK), `income_id`, `user_id`, `amount`, `inserted_at`.

### Cardinality Rules
- **USER to INCOME / EXPENSE / BUDGET / SAVING:** 1-to-Many (One user can have many records, but each record belongs to exactly one user).
- **CATEGORY to EXPENSE:** 1-to-Many (One category can map to multiple expenses).
- **PAYMENT_METHOD to EXPENSE:** 1-to-Many (One payment method can be used for multiple expenses).

---

## 2. ER Diagram Description (Textual Representation)
**Description for Viva:**
"Our Entity-Relationship (ER) diagram models the financial ecosystem of a single user. At the center is the **USER** entity (PK: user_id), acting as the parent to all transactions. The USER has a 1-to-N relationship with **INCOME**, **EXPENSE**, **BUDGET**, **SAVING**, and **PAYMENT_METHOD**. The **EXPENSE** entity acts as a junction point, pulling data not only from USER, but also holding N-to-1 relationships with the **CATEGORY** entity (PK: category_id) and the **PAYMENT_METHOD** entity (PK: payment_id). Attributes like `Total Expense` and `Total Saving` are derived attributes, represented by dashed ovals, because they are computed dynamically via SQL aggregate functions (SUM) rather than hardcoded."

---

## 3. Firebase to SQL Architecture Mapping
### Architecture Mapping Table
| Frontend Feature | Firebase/localStorage Equivalent | SQL Table Mapped To | Key Difference |
|------------------|----------------------------------|---------------------|----------------|
| User Auth/Profile | `auth.currentUser` / JSON Object | `USER` table | SQL strictly enforces email uniqueness at the DB level via UNIQUE constraints. |
| Add Earnings | `addDoc(collection(db, "income"))`| `INCOME` table | SQL requires rigorous type checking (DECIMAL) and structured Foreign Keys. |
| Add Spendings | `addDoc(collection(db, "expense"))`| `EXPENSE` table | SQL ensures relationships (Category, Payment Method) exist before insertion via FK constraints. |
| Expense Labels | Hardcoded JSON array / NoSQL maps | `CATEGORY` table | SQL centralizes categories, preventing typos and ensuring 3NF compliance. |
| Payment Modes | String field in NoSQL document | `PAYMENT_METHOD` table| SQL allows users to define custom payment modes as a distinct referenced entity. |
| Monthly Limit | LocalStorage key `budgetLimit` | `BUDGET` table | SQL handles time-series budgets tied strictly to the `period_month`. |
| Goals Tracking | JSON array inside LocalStorage | `SAVING` table | SQL prevents null goal names natively using `NOT NULL` constraints. |

**Simple Explanation for Faculty:**
"Sir/Madam, in our actual prototype, we used Firebase and localStorage to rapidly build the UI without managing a dedicated server. For example, in Firebase, an expense is just a JSON document. However, in our relational model, this maps to the `EXPENSE` table, which strictly enforces Foreign Keys connecting it to the `USER`, `CATEGORY`, and `PAYMENT_METHOD` tables. This guarantees data integrity that NoSQL lacks."

---

## 4. Honest Project Presentation Strategy
**If asked why the frontend uses Firebase for a DBMS project:**
"The deployed prototype of Antigravity uses Firebase and localStorage for implementation because it allows rapid front-end development and immediate user testing without requiring a dedicated server to be hosted online. However, the entire system architecture was fully modeled, designed, and demonstrated using rigorous SQL principles for this project review. This includes complete ER modeling, normalization to 3NF, robust DDL/DML scripts, relational constraints, joins, views, triggers, and cursors to showcase our core DBMS competencies."

---

## 5. Lightweight Local SQL Demo Recommendation
To demonstrate SQL queries live without altering the existing Antigravity code, you have three options:
- **Option A:** MySQL with XAMPP & phpMyAdmin (Industry standard, requires installation).
- **Option B:** DB Browser for SQLite (Lightweight desktop app, no background server).
- **Option C (RECOMMENDED):** **sqliteonline.com** or **paiza.io (MySQL)**. Requires zero installation. 

**Why Option C?** As a student needing a quick setup for project review, simply open sqliteonline.com, select "MySQL", paste the provided `schema.sql` and `seed.sql`, and click Run. You can instantly run the 15 queries during your viva.

---

## 6. 15 Essential SQL Queries for Review Demonstration

### 1. Simple SELECT with WHERE (Filter expenses by user)
**SQL Statement:**
```sql
SELECT description, amount, date FROM EXPENSE WHERE user_id = 1;
```
**Expected Output:**
| description | amount | date |
|-------------|--------|------------|
| Grocery Shopping | 2500.00 | 2026-02-05 |
| Bus Pass | 1200.00 | 2026-02-10 |
| Movie Night | 1800.00 | 2026-02-14 |

**Explanation:** This query fetches the description, amount, and date for all expenses made specifically by User 1. It filters the rows using the WHERE clause.
**Concept:** Basic Selection and Filtering.

### 2. INNER JOIN between two tables
**SQL Statement:**
```sql
SELECT e.description, e.amount, c.name AS category_name
FROM EXPENSE e
INNER JOIN CATEGORY c ON e.category_id = c.category_id;
```
**Expected Output:**
| description | amount | category_name |
|-------------|--------|---------------|
| Grocery Shopping| 2500.00| Food |
| Bus Pass | 1200.00| Transport |
| Movie Night | 1800.00| Entertainment |
| ... | ... | ... |

**Explanation:** This links the `EXPENSE` table with the `CATEGORY` table using the `category_id`. It replaces the numerical category ID with the human-readable category name.
**Concept:** Simple INNER JOIN.

### 3. INNER JOIN across four tables
**SQL Statement:**
```sql
SELECT u.first_name, e.description, c.name AS category, p.method_name, e.amount
FROM EXPENSE e
INNER JOIN USER u ON e.user_id = u.user_id
INNER JOIN CATEGORY c ON e.category_id = c.category_id
INNER JOIN PAYMENT_METHOD p ON e.payment_id = p.payment_id;
```
**Expected Output:**
| first_name | description | category | method_name | amount |
|------------|-------------|----------|-------------|--------|
| Hari | Grocery Shopping | Food | Credit Card | 2500.00|
| Sidda | Restaurant | Food | UPI | 2200.00|
| ... | ... | ... | ... | ... |

**Explanation:** This query generates a complete, readable expense report by pulling the user's name, category name, and payment method from four different tables. It uses multiple INNER JOINs chained together.
**Concept:** Complex Multi-table JOIN.

### 4. LEFT JOIN (Users with budgets)
**SQL Statement:**
```sql
SELECT u.first_name, b.amount AS budget_limit
FROM USER u
LEFT JOIN BUDGET b ON u.user_id = b.user_id;
```
**Expected Output:**
| first_name | budget_limit |
|------------|--------------|
| Hari | 12000.00 |
| Sidda | 10000.00 |

**Explanation:** This query lists all users alongside their budget limits. By using a LEFT JOIN, it guarantees that all users are shown, even if they haven't set a budget yet (in which case it would show NULL).
**Concept:** LEFT OUTER JOIN.

### 5. GROUP BY with COUNT (Expenses per category)
**SQL Statement:**
```sql
SELECT c.name AS category, COUNT(e.expense_id) AS total_transactions
FROM EXPENSE e
JOIN CATEGORY c ON e.category_id = c.category_id
GROUP BY c.name;
```
**Expected Output:**
| category | total_transactions |
|---------------|--------------------|
| Food | 2 |
| Transport | 2 |
| Entertainment | 2 |

**Explanation:** This groups the expense records based on their category. It then uses the COUNT function to calculate how many separate expense transactions occurred in each category.
**Concept:** Aggregation with COUNT and GROUP BY.

### 6. GROUP BY with SUM (Total expenses per user)
**SQL Statement:**
```sql
SELECT u.first_name, SUM(e.amount) AS total_spent
FROM USER u
JOIN EXPENSE e ON u.user_id = e.user_id
GROUP BY u.first_name;
```
**Expected Output:**
| first_name | total_spent |
|------------|-------------|
| Hari | 5500.00 |
| Sidda | 4600.00 |

**Explanation:** This groups records by the user's first name. It calculates the total money spent by each user by summing up their expense amounts.
**Concept:** Aggregation with SUM.

### 7. Aggregate functions AVG, MIN, MAX
**SQL Statement:**
```sql
SELECT 
    AVG(amount) AS avg_expense, 
    MIN(amount) AS min_expense, 
    MAX(amount) AS max_expense
FROM EXPENSE;
```
**Expected Output:**
| avg_expense | min_expense | max_expense |
|-------------|-------------|-------------|
| 1683.33 | 900.00 | 2500.00 |

**Explanation:** This query calculates the average, minimum, and maximum expense amounts across the entire application. It provides high-level statistical insights into user spending behavior.
**Concept:** Multiple Aggregate Functions.

### 8. HAVING clause (Users exceeding 45% of budget)
**SQL Statement:**
```sql
SELECT u.first_name, SUM(e.amount) AS spent, b.amount AS budget
FROM USER u
JOIN EXPENSE e ON u.user_id = e.user_id
JOIN BUDGET b ON u.user_id = b.user_id
GROUP BY u.first_name, b.amount
HAVING SUM(e.amount) > (b.amount * 0.45);
```
**Expected Output:**
| first_name | spent | budget |
|------------|---------|----------|
| Hari | 5500.00 | 12000.00 |
| Sidda | 4600.00 | 10000.00 |

**Explanation:** This query groups spending by user and compares it against their budget. The HAVING clause acts like a WHERE clause but for aggregated groups, filtering out users who haven't spent more than 45% of their budget.
**Concept:** HAVING clause filtering groups.

### 9. Nested Subquery (Expenses above overall average)
**SQL Statement:**
```sql
SELECT description, amount 
FROM EXPENSE 
WHERE amount > (SELECT AVG(amount) FROM EXPENSE);
```
**Expected Output:**
| description | amount |
|------------------|---------|
| Grocery Shopping | 2500.00 |
| Movie Night | 1800.00 |
| Restaurant | 2200.00 |

**Explanation:** The inner query first calculates the overall average expense amount. The outer query then fetches all expenses that are strictly greater than that computed average.
**Concept:** Single-row Subquery.

### 10. UNION (Combined transaction history)
**SQL Statement:**
```sql
SELECT date, 'Income' AS type, source AS description, amount FROM INCOME WHERE user_id = 1
UNION
SELECT date, 'Expense' AS type, description, amount FROM EXPENSE WHERE user_id = 1
ORDER BY date DESC;
```
**Expected Output:**
| date | type | description | amount |
|------------|---------|---------------------|----------|
| 2026-02-15 | Income | Freelancing Project | 15000.00 |
| 2026-02-14 | Expense | Movie Night | 1800.00 |
| 2026-02-10 | Expense | Bus Pass | 1200.00 |
| ... | ... | ... | ... |

**Explanation:** This merges records from the INCOME and EXPENSE tables into a single result set. It creates a unified bank-style ledger for User 1, sorted chronologically.
**Concept:** UNION set operator.

### 11. ORDER BY with LIMIT (Top 3 highest expenses)
**SQL Statement:**
```sql
SELECT description, amount 
FROM EXPENSE 
ORDER BY amount DESC 
LIMIT 3;
```
**Expected Output:**
| description | amount |
|------------------|---------|
| Grocery Shopping | 2500.00 |
| Restaurant | 2200.00 |
| Movie Night | 1800.00 |

**Explanation:** This query sorts all expenses in descending order based on the amount. The LIMIT clause restricts the output to only the top 3 rows, effectively finding the three largest purchases.
**Concept:** Sorting and Limiting.

### 12. LIKE search (Keyword search)
**SQL Statement:**
```sql
SELECT description, amount 
FROM EXPENSE 
WHERE description LIKE '%Shopping%';
```
**Expected Output:**
| description | amount |
|------------------|---------|
| Grocery Shopping | 2500.00 |

**Explanation:** This query searches the expense descriptions for the word "Shopping" anywhere in the text. The '%' symbols act as wildcards matching any sequence of characters before or after the keyword.
**Concept:** Pattern Matching with LIKE.

### 13. Net Balance Calculation (Math in SELECT)
**SQL Statement:**
```sql
SELECT 
    u.first_name,
    (SELECT SUM(amount) FROM INCOME WHERE user_id = u.user_id) - 
    (SELECT SUM(amount) FROM EXPENSE WHERE user_id = u.user_id) AS net_balance
FROM USER u;
```
**Expected Output:**
| first_name | net_balance |
|------------|-------------|
| Hari | 64500.00 |
| Sidda | 53400.00 |

**Explanation:** This query uses correlated subqueries directly within the SELECT clause. It mathematically subtracts a user's total expenses from their total income to compute their net current balance.
**Concept:** Correlated Subqueries and Arithmetic operations.

### 14. NOT IN subquery (Categories used by U1 but not U2)
**SQL Statement:**
```sql
SELECT name FROM CATEGORY 
WHERE category_id IN (SELECT category_id FROM EXPENSE WHERE user_id = 1)
  AND category_id NOT IN (SELECT category_id FROM EXPENSE WHERE user_id = 2);
```
**Expected Output:**
| name |
|------|
*(Empty set in this specific dummy data as both used Food, Transport, and Entertainment)*

**Explanation:** This query finds which expense categories User 1 has utilized. It then filters out any categories that User 2 has also utilized, isolating categories unique to User 1's spending habits.
**Concept:** NOT IN Subquery.

### 15. Date Range Filter
**SQL Statement:**
```sql
SELECT description, amount, date 
FROM EXPENSE 
WHERE date BETWEEN '2026-02-01' AND '2026-02-28';
```
**Expected Output:**
| description | amount | date |
|-------------|--------|------------|
| Grocery Shopping | 2500.00| 2026-02-05 |
| Bus Pass | 1200.00| 2026-02-10 |
| ... | ... | ... |

**Explanation:** This queries the database for all expenses that occurred strictly within the month of February 2026. It uses the BETWEEN operator to define an inclusive date range.
**Concept:** Date filtering using BETWEEN.
