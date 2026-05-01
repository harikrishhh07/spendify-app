from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15))
    currency = db.Column(db.String(10), default='INR')

    incomes = db.relationship('Income', backref='user', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='user', cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', cascade='all, delete-orphan')
    savings = db.relationship('Saving', backref='user', cascade='all, delete-orphan')
    payment_methods = db.relationship('PaymentMethod', backref='user', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.user_id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phoneNumber': self.phone_number,
            'currency': self.currency
        }

class Category(db.Model):
    __tablename__ = 'category'
    category_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'Income' or 'Expense'

    expenses = db.relationship('Expense', backref='category')

    def to_dict(self):
        return {
            'id': self.category_id,
            'name': self.name,
            'type': self.type
        }

class PaymentMethod(db.Model):
    __tablename__ = 'payment_method'
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    method_name = db.Column(db.String(50), nullable=False)

    expenses = db.relationship('Expense', backref='payment_method')

    def to_dict(self):
        return {
            'id': self.payment_id,
            'userId': self.user_id,
            'methodName': self.method_name
        }

class Income(db.Model):
    __tablename__ = 'income'
    income_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    source = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': str(self.income_id), # React usually expects string IDs
            'userId': self.user_id,
            'amount': float(self.amount),
            'date': self.date.strftime('%Y-%m-%d'),
            'source': self.source,
            'type': 'income'
        }

class Expense(db.Model):
    __tablename__ = 'expense'
    __table_args__ = (
        db.CheckConstraint('amount > 0', name='check_positive_amount'),
    )
    expense_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.category_id'), nullable=False)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment_method.payment_id'))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    description = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': str(self.expense_id),
            'userId': self.user_id,
            'categoryId': self.category_id,
            'paymentId': self.payment_id,
            'amount': float(self.amount),
            'date': self.date.strftime('%Y-%m-%d'),
            'description': self.description,
            'type': 'expense',
            'categoryName': self.category.name if self.category else None,
            'paymentMethod': self.payment_method.method_name if self.payment_method else None
        }

class Budget(db.Model):
    __tablename__ = 'budget'
    budget_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.category_id'))
    start_date = db.Column(db.Date, default=date.today)
    end_date = db.Column(db.Date)
    period_month = db.Column(db.Integer)
    period_year = db.Column(db.Integer)
    alert_threshold = db.Column(db.Integer, default=80)  # Alert when 80% of budget is spent
    is_active = db.Column(db.Boolean, default=True)
    exceeded_notification_sent = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.budget_id,
            'userId': self.user_id,
            'categoryId': self.category_id,
            'amount': float(self.amount),
            'periodMonth': self.period_month,
            'periodYear': self.period_year,
            'alertThreshold': self.alert_threshold,
            'isActive': self.is_active,
            'exceededNotificationSent': self.exceeded_notification_sent
        }

class Saving(db.Model):
    __tablename__ = 'saving'
    saving_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    goal_name = db.Column(db.String(100), nullable=False) # NOT NULL constraint
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.Date, default=date.today)

    def to_dict(self):
        return {
            'id': self.saving_id,
            'userId': self.user_id,
            'goalName': self.goal_name,
            'amount': float(self.amount),
            'date': self.date.strftime('%Y-%m-%d') if self.date else None
        }
