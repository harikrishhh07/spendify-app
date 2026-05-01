from app import create_app
from models import db, User, Category, PaymentMethod, Income, Expense, Budget, Saving
from datetime import date

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing data safely
        db.drop_all()
        db.create_all()

        print("Seeding Users...")
        user1 = User(user_id=1, first_name='Hari', last_name='Krishna', email='hari.krishna@example.com', phone_number='9876543210')
        user2 = User(user_id=2, first_name='Sidda', last_name='Vikram', email='sidda.vikram@example.com', phone_number='9123456789')
        db.session.add_all([user1, user2])
        
        print("Seeding Categories...")
        cat1 = Category(category_id=1, name='Food', type='Expense')
        cat2 = Category(category_id=2, name='Transport', type='Expense')
        cat3 = Category(category_id=3, name='Entertainment', type='Expense')
        cat4 = Category(category_id=4, name='Salary', type='Income')
        db.session.add_all([cat1, cat2, cat3, cat4])
        
        print("Seeding Payment Methods...")
        pm1 = PaymentMethod(payment_id=1, user_id=1, method_name='Cash')
        pm2 = PaymentMethod(payment_id=2, user_id=1, method_name='Credit Card')
        pm3 = PaymentMethod(payment_id=3, user_id=2, method_name='UPI')
        pm4 = PaymentMethod(payment_id=4, user_id=2, method_name='Debit Card')
        db.session.add_all([pm1, pm2, pm3, pm4])
        
        db.session.commit() # Commit parents before creating children

        print("Seeding Incomes...")
        inc1 = Income(user_id=1, amount=55000, date=date(2026, 2, 1), source='Monthly Salary')
        inc2 = Income(user_id=1, amount=15000, date=date(2026, 2, 15), source='Freelancing Project')
        inc3 = Income(user_id=2, amount=48000, date=date(2026, 2, 1), source='Monthly Salary')
        inc4 = Income(user_id=2, amount=10000, date=date(2026, 2, 20), source='Part-time Work')
        db.session.add_all([inc1, inc2, inc3, inc4])

        print("Seeding Expenses...")
        exp1 = Expense(user_id=1, category_id=1, payment_id=2, amount=2500, date=date(2026, 2, 5), description='Grocery Shopping')
        exp2 = Expense(user_id=1, category_id=2, payment_id=1, amount=1200, date=date(2026, 2, 10), description='Bus Pass')
        exp3 = Expense(user_id=1, category_id=3, payment_id=2, amount=1800, date=date(2026, 2, 14), description='Movie Night')
        exp4 = Expense(user_id=2, category_id=1, payment_id=3, amount=2200, date=date(2026, 2, 8), description='Restaurant')
        exp5 = Expense(user_id=2, category_id=2, payment_id=3, amount=900, date=date(2026, 2, 12), description='Auto Fare')
        exp6 = Expense(user_id=2, category_id=3, payment_id=4, amount=1500, date=date(2026, 2, 18), description='Concert Ticket')
        db.session.add_all([exp1, exp2, exp3, exp4, exp5, exp6])

        print("Seeding Budgets and Savings...")
        bud1 = Budget(user_id=1, amount=12000, start_date=date(2026, 2, 1), end_date=date(2026, 2, 28), period_month=2, period_year=2026)
        bud2 = Budget(user_id=2, amount=10000, start_date=date(2026, 2, 1), end_date=date(2026, 2, 28), period_month=2, period_year=2026)
        
        sav1 = Saving(user_id=1, goal_name='Emergency Fund', amount=15000, date=date(2026, 2, 25))
        sav2 = Saving(user_id=2, goal_name='Vacation Trip', amount=8000, date=date(2026, 2, 26))
        
        db.session.add_all([bud1, bud2, sav1, sav2])
        
        db.session.commit()
        print("Database seeded successfully with dummy data!")

if __name__ == '__main__':
    seed_database()
