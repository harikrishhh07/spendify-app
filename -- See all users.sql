-- See all users
SELECT * FROM user;

-- See all expenses with category names
SELECT e.*, c.name AS category_name FROM expense e LEFT JOIN category c ON e.category_id = c.category_id;

-- See all incomes
SELECT * FROM income;

-- See all categories
SELECT * FROM category;

-- See all budgets
SELECT * FROM budget;

-- See all savings
SELECT * FROM saving;