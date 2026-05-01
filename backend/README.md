# Spendify - Flask API Backend

This is the Flask backend implementation of the Spendify application, built specifically to demonstrate core **Database Management Systems (DBMS)** concepts for academic review.

## Architecture
- **Framework:** Python / Flask
- **Database:** SQLite (default, zero configuration)
- **ORM:** SQLAlchemy
- **Schema:** Fully Normalized to 3NF

## How This Demonstrates DBMS Concepts

1. **Relational Models & Normalization (3NF):** 
   Open `models.py`. You will see exactly 7 discrete classes (`User`, `Category`, `PaymentMethod`, `Income`, `Expense`, `Budget`, `Saving`). The `Expense` model does not store raw strings for categories; instead, it stores a `category_id` demonstrating 3NF to eliminate redundancy.
2. **Referential Integrity (Foreign Keys):** 
   We enforce strict relationships. For instance, `db.ForeignKey('user.user_id', ondelete='CASCADE')` ensures no expense can exist without a valid user, and deleting a user wipes their data.
3. **Database Constraints:** 
   - We applied a `CHECK` constraint mathematically on the `Expense` table: `db.CheckConstraint('amount > 0')`.
   - We applied `UNIQUE` on the `User.email` column.
   - We applied `NOT NULL` via `nullable=False` across the models.
4. **SQL Joins & Aggregates:**
   Open `routes.py` and inspect the `/api/summary/<user_id>` route. It uses SQLAlchemy's ORM translation to write raw SQL `JOIN`s and `SUM()` aggregates `func.sum()` combined with `group_by()` to calculate the user's dashboard statistics efficiently.

---

## Setup Instructions

This backend is designed to be extremely easy to start. You need Python installed.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed the Database with Dummy Data:**
   ```bash
   python seed.py
   ```
   *This creates a `spendify.db` SQLite file containing the Indian context dummy data exactly as per your DBMS report (Hari Krishna, Sidda Vikram, etc.).*

5. **Run the Flask Application:**
   ```bash
   python app.py
   ```
   The backend will now be running at `http://127.0.0.1:5000`.

---

## Testing API Endpoints
You can open a browser or use Postman to view your data:
- View all users: `http://localhost:5000/api/users`
- View Hari's financial summary: `http://localhost:5000/api/summary/1`
- View all expenses: `http://localhost:5000/api/expenses`

---

## Future Frontend Integration Guide

To connect your existing React frontend to this Flask backend, you do **not** need to redesign the UI. You simply need to replace the `localStorage` or Firebase SDK calls with standard `fetch()` API calls.

**Example: Modifying `ExpenseContext.jsx`**

*Current approach (localStorage/Firebase):*
```javascript
const addExpense = (expense) => {
    // saving to local storage
    setExpenses([...expenses, expense]);
};
```

*New approach (Flask Backend):*
```javascript
const addExpense = async (expense) => {
    const response = await fetch('http://127.0.0.1:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 1, // Assuming logged in user
            categoryId: expense.category_id,
            amount: expense.amount,
            description: expense.description
        })
    });
    
    if (response.ok) {
        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]);
    }
};
```
By swapping out the data-access layer function bodies, your frontend components remain completely identical.
