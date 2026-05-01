from flask import Blueprint, request, jsonify, send_file, current_app
from datetime import datetime, date
from models import db, User, Category, PaymentMethod, Income, Expense, Budget, Saving
from colors import SpendifyColors
from sqlalchemy import func
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib import colors as reportlab_colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from flask_mail import Message, Mail
from dateutil.relativedelta import relativedelta

api_bp = Blueprint('api', __name__)

# EMAIL UTILITY FUNCTION
def send_budget_alert_email(user_email, user_name, budget_amount, current_spending, percentage):
    """Send budget exceeded notification email"""
    try:
        from app import mail
        
        if not user_email:
            print("Error: No email address provided")
            return False
        
        subject = f"⚠️ Budget Alert: You've reached {percentage}% of your budget!"
        html_body = f"""
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: {SpendifyColors.TEXT_PRIMARY}; margin: 0; padding: 0; background-color: {SpendifyColors.BG_DARK};">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: {SpendifyColors.BG_DARK};">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, {SpendifyColors.ACCENT_HOVER}, {SpendifyColors.PRIMARY_ACCENT}); border-radius: 12px; line-height: 56px; font-size: 28px; font-weight: bold; color: {SpendifyColors.BG_DARK};">S</div>
                        <h1 style="margin: 16px 0 0 0; font-size: 28px; font-weight: 700; color: {SpendifyColors.TEXT_PRIMARY};">Spendify</h1>
                    </div>

                    <!-- Alert Message -->
                    <div style="background-color: {SpendifyColors.BG_SURFACE}; border-radius: 16px; border: 1px solid {SpendifyColors.BORDER}; padding: 32px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; margin-bottom: 20px; gap: 12px;">
                            <span style="font-size: 32px;">🚨</span>
                            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: {SpendifyColors.DANGER};">Budget Alert</h2>
                        </div>
                        
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: {SpendifyColors.TEXT_PRIMARY}; line-height: 1.6;">Hi <strong>{user_name}</strong>,</p>
                        
                        <p style="margin: 0 0 24px 0; font-size: 16px; color: {SpendifyColors.TEXT_PRIMARY}; line-height: 1.6;">Your current spending has reached <strong style="color: {SpendifyColors.ACCENT_HOVER};">{percentage}%</strong> of your monthly budget.</p>
                    </div>

                    <!-- Budget Details Card -->
                    <div style="background-color: {SpendifyColors.BG_SURFACE}; border-radius: 16px; border: 2px solid {SpendifyColors.BORDER_HOVER}; border-left-color: {SpendifyColors.PRIMARY_ACCENT}; padding: 24px; margin-bottom: 24px;">
                        <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid {SpendifyColors.BORDER};">
                            <p style="margin: 0; font-size: 12px; font-weight: 600; color: {SpendifyColors.TEXT_SECONDARY}; text-transform: uppercase; letter-spacing: 0.5px;">Budget Limit</p>
                            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: 700; color: {SpendifyColors.PRIMARY_ACCENT};">₹{budget_amount:,.2f}</p>
                        </div>
                        
                        <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid {SpendifyColors.BORDER};">
                            <p style="margin: 0; font-size: 12px; font-weight: 600; color: {SpendifyColors.TEXT_SECONDARY}; text-transform: uppercase; letter-spacing: 0.5px;">Current Spending</p>
                            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: 700; color: {SpendifyColors.DANGER};">₹{current_spending:,.2f}</p>
                        </div>
                        
                        <div>
                            <p style="margin: 0; font-size: 12px; font-weight: 600; color: {SpendifyColors.TEXT_SECONDARY}; text-transform: uppercase; letter-spacing: 0.5px;">Remaining Budget</p>
                            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: 700; color: {SpendifyColors.SUCCESS};">₹{max(0, budget_amount - current_spending):,.2f}</p>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div style="background-color: {SpendifyColors.BG_SURFACE}; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: {SpendifyColors.TEXT_SECONDARY};">Spending Progress</p>
                        <div style="width: 100%; height: 12px; background-color: {SpendifyColors.BG_SURFACE_SECONDARY}; border-radius: 999px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(90deg, {SpendifyColors.PRIMARY_ACCENT}, {SpendifyColors.ACCENT_HOVER}); width: {min(100, percentage)}%; border-radius: 999px;"></div>
                        </div>
                        <p style="margin: 12px 0 0 0; text-align: right; font-size: 14px; font-weight: 600; color: {SpendifyColors.PRIMARY_ACCENT};">{percentage}%</p>
                    </div>

                    <!-- Recommendation -->
                    <div style="background-color: rgba(93, 202, 165, 0.1); border: 1px solid {SpendifyColors.SUCCESS}; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                        <p style="margin: 0; color: {SpendifyColors.SUCCESS}; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            💡 <strong>Tip:</strong> You can adjust your budget or category limits anytime in the Spendify app.
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <a href="https://spendify.app" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, {SpendifyColors.PRIMARY_ACCENT}, {SpendifyColors.ACCENT_HOVER}); color: {SpendifyColors.BG_DARK}; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; transition: all 0.3s ease;">
                            Open Spendify Dashboard
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="border-top: 1px solid {SpendifyColors.BORDER}; padding-top: 24px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: {SpendifyColors.TEXT_SECONDARY}; font-size: 12px;">
                            This is an automated message from Spendify. Please do not reply to this email.
                        </p>
                        <p style="margin: 0; color: {SpendifyColors.TEXT_SECONDARY}; font-size: 11px;">
                            © 2026 Spendify - Your Financial Companion | <a href="https://spendify.app/privacy" style="color: {SpendifyColors.PRIMARY_ACCENT}; text-decoration: none;">Privacy Policy</a> | <a href="https://spendify.app/terms" style="color: {SpendifyColors.PRIMARY_ACCENT}; text-decoration: none;">Terms</a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        print(f"Attempting to send email to: {user_email}")
        print(f"Mail server config: {current_app.config.get('MAIL_SERVER')}")
        print(f"Mail username: {current_app.config.get('MAIL_USERNAME')}")
        
        msg = Message(
            subject=subject, 
            recipients=[user_email], 
            html=html_body
        )
        mail.send(msg)
        print(f"Email successfully sent to {user_email}")
        return True
    except Exception as e:
        print(f"Error sending email to {user_email}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

# --- USER ROUTES ---
@api_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@api_bp.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Auto-create user from Google Auth payload
        user = User(
            first_name=data.get('firstName', 'User'),
            last_name=data.get('lastName', ''),
            email=email
        )
        db.session.add(user)
        db.session.commit()
        
    return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200

# --- INCOME ROUTES ---
@api_bp.route('/incomes', methods=['GET'])
def get_incomes():
    user_id = request.args.get('userId')
    if user_id:
        incomes = Income.query.filter_by(user_id=user_id).all()
    else:
        incomes = Income.query.all()
    return jsonify([income.to_dict() for income in incomes])

@api_bp.route('/incomes', methods=['POST'])
def add_income():
    data = request.get_json()
    try:
        new_income = Income(
            user_id=data['userId'],
            amount=data['amount'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date() if 'date' in data else datetime.today().date(),
            source=data.get('source', 'General')
        )
        db.session.add(new_income)
        db.session.commit()
        return jsonify(new_income.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# --- EXPENSE ROUTES ---
@api_bp.route('/expenses', methods=['GET'])
def get_expenses():
    user_id = request.args.get('userId')
    if user_id:
        expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()
    else:
        expenses = Expense.query.all()
    return jsonify([expense.to_dict() for expense in expenses])

@api_bp.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    try:
        # Check amount constraint manually as well
        if float(data['amount']) <= 0:
            return jsonify({'error': 'Expense amount must be greater than 0'}), 400
            
        new_expense = Expense(
            user_id=data['userId'],
            category_id=data['categoryId'],
            payment_id=data.get('paymentId'),
            amount=data['amount'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date() if 'date' in data else datetime.today().date(),
            description=data.get('description', '')
        )
        db.session.add(new_expense)
        db.session.commit()
        
        # Check budget after adding expense
        user = User.query.get(data['userId'])
        check_and_notify_budget(user, data['userId'])
        
        return jsonify(new_expense.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def check_and_notify_budget(user, user_id):
    """Check if user has exceeded budget and send notification"""
    if not user:
        print(f"User not found for user_id: {user_id}")
        return
    
    try:
        today = datetime.today().date()
        
        # Get all active budgets for current month
        budgets = Budget.query.filter_by(
            user_id=user_id, 
            period_month=today.month,
            period_year=today.year,
            is_active=True
        ).all()
        
        print(f"Found {len(budgets)} active budgets for user {user_id}")
        
        for budget in budgets:
            # Calculate current spending for this month
            if budget.category_id:
                # Category-specific budget
                current_spending = db.session.query(func.sum(Expense.amount)).filter(
                    Expense.user_id == user_id,
                    Expense.category_id == budget.category_id,
                    func.month(Expense.date) == today.month,
                    func.year(Expense.date) == today.year
                ).scalar() or 0
            else:
                # Overall budget
                current_spending = db.session.query(func.sum(Expense.amount)).filter(
                    Expense.user_id == user_id,
                    func.month(Expense.date) == today.month,
                    func.year(Expense.date) == today.year
                ).scalar() or 0
            
            budget_amount = float(budget.amount)
            current_spending = float(current_spending)
            alert_threshold = budget.alert_threshold
            
            percentage = (current_spending / budget_amount * 100) if budget_amount > 0 else 0
            
            print(f"Budget {budget.budget_id}: Spent {current_spending} of {budget_amount} ({percentage:.1f}%), Threshold: {alert_threshold}%, Notification sent: {budget.exceeded_notification_sent}")
            
            # Send alert if threshold is reached and notification not already sent
            if percentage >= alert_threshold and not budget.exceeded_notification_sent:
                print(f"Sending email to {user.email} for budget {budget.budget_id}")
                email_sent = send_budget_alert_email(
                    user.email, 
                    user.first_name, 
                    budget_amount, 
                    current_spending, 
                    int(percentage)
                )
                
                if email_sent:
                    budget.exceeded_notification_sent = True
                    db.session.commit()
                    print(f"Email sent and notification flag updated for budget {budget.budget_id}")
                else:
                    print(f"Failed to send email for budget {budget.budget_id}")
                
    except Exception as e:
        print(f"Error in check_and_notify_budget: {str(e)}")
        import traceback
        traceback.print_exc()

@api_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'})

# --- CATEGORY ROUTES ---
@api_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

# --- BUDGET ROUTES ---
@api_bp.route('/budgets', methods=['GET'])
def get_budgets():
    user_id = request.args.get('userId')
    if user_id:
        budgets = Budget.query.filter_by(user_id=user_id).all()
    else:
        budgets = Budget.query.all()
    return jsonify([budget.to_dict() for budget in budgets])

@api_bp.route('/budgets', methods=['POST'])
def create_budget():
    """Create a new budget"""
    data = request.get_json()
    try:
        # Get current month/year if not provided
        today = datetime.today().date()
        period_month = data.get('periodMonth', today.month)
        period_year = data.get('periodYear', today.year)
        
        # Check if budget already exists for this month
        existing_budget = Budget.query.filter_by(
            user_id=data['userId'],
            period_month=period_month,
            period_year=period_year
        ).first()
        
        if existing_budget:
            return jsonify({'error': 'Budget already exists for this month'}), 400
        
        new_budget = Budget(
            user_id=data['userId'],
            category_id=data.get('categoryId'),
            amount=data['amount'],
            period_month=period_month,
            period_year=period_year,
            alert_threshold=data.get('alertThreshold', 80),
            is_active=data.get('isActive', True),
            exceeded_notification_sent=False
        )
        db.session.add(new_budget)
        db.session.commit()
        
        return jsonify(new_budget.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    """Update an existing budget"""
    budget = Budget.query.get_or_404(budget_id)
    data = request.get_json()
    
    try:
        if 'amount' in data:
            budget.amount = data['amount']
        if 'alertThreshold' in data:
            budget.alert_threshold = data['alertThreshold']
        if 'isActive' in data:
            budget.is_active = data['isActive']
        if 'exceededNotificationSent' in data:
            budget.exceeded_notification_sent = data['exceededNotificationSent']
        
        db.session.commit()
        return jsonify(budget.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    """Delete a budget"""
    budget = Budget.query.get_or_404(budget_id)
    try:
        db.session.delete(budget)
        db.session.commit()
        return jsonify({'message': 'Budget deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/budgets/<int:budget_id>/spending', methods=['GET'])
def get_budget_spending(budget_id):
    """Get current spending against a specific budget"""
    budget = Budget.query.get_or_404(budget_id)
    
    try:
        # Calculate current spending for this month
        current_spending = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == budget.user_id,
            func.month(Expense.date) == budget.period_month,
            func.year(Expense.date) == budget.period_year,
            Expense.category_id == budget.category_id if budget.category_id else True
        ).scalar() or 0
        
        current_spending = float(current_spending)
        budget_amount = float(budget.amount)
        percentage = (current_spending / budget_amount * 100) if budget_amount > 0 else 0
        
        return jsonify({
            'budgetId': budget.budget_id,
            'budgetAmount': budget_amount,
            'currentSpending': current_spending,
            'remaining': budget_amount - current_spending,
            'percentageUsed': round(percentage, 2),
            'isExceeded': current_spending > budget_amount
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- SAVINGS/GOALS ROUTES ---
@api_bp.route('/savings', methods=['GET'])
def get_savings():
    user_id = request.args.get('userId')
    if user_id:
        savings = Saving.query.filter_by(user_id=user_id).all()
    else:
        savings = Saving.query.all()
    return jsonify([saving.to_dict() for saving in savings])

@api_bp.route('/savings', methods=['POST'])
def add_saving():
    data = request.get_json()
    try:
        new_saving = Saving(
            user_id=data['userId'],
            goal_name=data['goalName'],
            amount=data['amount'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date() if 'date' in data else datetime.today().date()
        )
        db.session.add(new_saving)
        db.session.commit()
        return jsonify(new_saving.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/savings/<int:saving_id>', methods=['DELETE'])
def delete_saving(saving_id):
    saving = Saving.query.get_or_404(saving_id)
    db.session.delete(saving)
    db.session.commit()
    return jsonify({'message': 'Saving goal deleted successfully'})

# --- SUMMARY DASHBOARD ROUTE (Demonstrates DBMS Concepts) ---
@api_bp.route('/summary/<int:user_id>', methods=['GET'])
def get_financial_summary(user_id):
    """
    Demonstrates SQL Aggregates (SUM) and basic subqueries via SQLAlchemy.
    """
    # 1. Calculate Total Income
    total_income = db.session.query(func.sum(Income.amount)).filter(Income.user_id == user_id).scalar() or 0
    
    # 2. Calculate Total Expense
    total_expense = db.session.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0
    
    # 3. Get latest Budget
    budget = Budget.query.filter_by(user_id=user_id).order_by(Budget.budget_id.desc()).first()
    budget_limit = float(budget.amount) if budget else 0
    
    # 4. Calculate Expenses Grouped by Category (Demonstrates GROUP BY & JOIN)
    category_breakdown = db.session.query(
        Category.name, 
        func.sum(Expense.amount).label('total')
    ).join(Expense, Category.category_id == Expense.category_id) \
     .filter(Expense.user_id == user_id) \
     .group_by(Category.name).all()
     
    breakdown_list = [{'category': item[0], 'amount': float(item[1])} for item in category_breakdown]

    return jsonify({
        'userId': user_id,
        'totalIncome': float(total_income),
        'totalExpense': float(total_expense),
        'netBalance': float(total_income - total_expense),
        'budgetLimit': budget_limit,
        'categoryBreakdown': breakdown_list
    })

# --- PDF EXPORT ROUTE ---
@api_bp.route('/transactions/export-pdf/<int:user_id>', methods=['GET'])
def export_transactions_pdf(user_id):
    """
    Generate and download a PDF report of all transactions for a user.
    """
    try:
        # Get user
        user = User.query.get_or_404(user_id)
        
        # Get all transactions
        expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()
        incomes = Income.query.filter_by(user_id=user_id).order_by(Income.date.desc()).all()
        
        # Get summary
        total_income = db.session.query(func.sum(Income.amount)).filter(Income.user_id == user_id).scalar() or 0
        total_expense = db.session.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0
        
        # Create PDF in memory
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        
        # Define styles with dark luxury colors
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=reportlab_colors.HexColor(SpendifyColors.PRIMARY_ACCENT),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=reportlab_colors.HexColor(SpendifyColors.TEXT_SECONDARY),
            spaceAfter=12,
            alignment=TA_CENTER
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=reportlab_colors.HexColor(SpendifyColors.PRIMARY_ACCENT),
            spaceAfter=8,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        # Create elements list
        elements = []
        
        # Add title
        elements.append(Paragraph("SPENDIFY", title_style))
        elements.append(Paragraph(f"Transaction Report - {user.first_name} {user.last_name}", subtitle_style))
        elements.append(Paragraph(f"Email: {user.email}", subtitle_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add summary section
        elements.append(Paragraph("Financial Summary", heading_style))
        summary_data = [
            ['Metric', 'Amount'],
            ['Total Income', f"₹{float(total_income):,.2f}"],
            ['Total Expense', f"₹{float(total_expense):,.2f}"],
            ['Net Balance', f"₹{float(total_income - total_expense):,.2f}"]
        ]
        summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.PRIMARY_ACCENT)),
            ('TEXTCOLOR', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.BG_DARK)),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), reportlab_colors.HexColor(SpendifyColors.BG_SURFACE)),
            ('GRID', (0, 0), (-1, -1), 1, reportlab_colors.Color(201/255.0, 169/255.0, 110/255.0, 0.45)),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (-1, -1), reportlab_colors.HexColor(SpendifyColors.TEXT_PRIMARY)),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [reportlab_colors.HexColor(SpendifyColors.BG_SURFACE), reportlab_colors.HexColor(SpendifyColors.BG_SURFACE_SECONDARY)])
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Add expenses section
        if expenses:
            elements.append(Paragraph("Expenses", heading_style))
            expense_data = [['Date', 'Description', 'Category', 'Amount']]
            for exp in expenses:
                expense_data.append([
                    str(exp.date),
                    exp.description[:20] if exp.description else '-',
                    exp.category.name if exp.category else '-',
                    f"₹{float(exp.amount):,.2f}"
                ])
            
            expense_table = Table(expense_data, colWidths=[1.2*inch, 1.8*inch, 1.3*inch, 1.2*inch])
            expense_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.DANGER)),
                ('TEXTCOLOR', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.TEXT_PRIMARY)),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('ALIGN', (1, 1), (1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 1, reportlab_colors.Color(201/255.0, 169/255.0, 110/255.0, 0.18)),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('TEXTCOLOR', (0, 0), (-1, -1), reportlab_colors.HexColor(SpendifyColors.TEXT_PRIMARY)),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [reportlab_colors.HexColor(SpendifyColors.BG_SURFACE), reportlab_colors.HexColor(SpendifyColors.BG_SURFACE_SECONDARY)])
            ]))
            elements.append(expense_table)
            elements.append(Spacer(1, 0.3*inch))
        
        # Add incomes section
        if incomes:
            elements.append(Paragraph("Incomes", heading_style))
            income_data = [['Date', 'Source', 'Amount']]
            for inc in incomes:
                income_data.append([
                    str(inc.date),
                    inc.source or 'General',
                    f"₹{float(inc.amount):,.2f}"
                ])
            
            income_table = Table(income_data, colWidths=[1.5*inch, 2.5*inch, 1.5*inch])
            income_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.SUCCESS)),
                ('TEXTCOLOR', (0, 0), (-1, 0), reportlab_colors.HexColor(SpendifyColors.TEXT_PRIMARY)),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('ALIGN', (1, 1), (1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 1, reportlab_colors.Color(201/255.0, 169/255.0, 110/255.0, 0.18)),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('TEXTCOLOR', (0, 0), (-1, -1), reportlab_colors.HexColor(SpendifyColors.TEXT_PRIMARY)),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [reportlab_colors.HexColor(SpendifyColors.BG_SURFACE), reportlab_colors.HexColor(SpendifyColors.BG_SURFACE_SECONDARY)])
            ]))
            elements.append(income_table)
        
        # Add footer
        elements.append(Spacer(1, 0.4*inch))
        elements.append(Paragraph(f"<b>Report Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", subtitle_style))
        elements.append(Paragraph("© 2026 Spendify - Your Financial Companion", subtitle_style))
        
        # Build PDF
        doc.build(elements)
        pdf_buffer.seek(0)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'Spendify_Transactions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- TEST EMAIL ROUTE ---
@api_bp.route('/test-email/<int:user_id>', methods=['GET'])
def test_email(user_id):
    """
    Test email sending functionality
    Usage: GET /api/test-email/4
    """
    try:
        user = User.query.get_or_404(user_id)
        
        email_sent = send_budget_alert_email(
            user.email,
            user.first_name,
            5000.00,  # Sample budget
            4500.00,  # Sample spending
            90  # Sample percentage
        )
        
        if email_sent:
            return jsonify({
                'success': True,
                'message': f'Test email sent successfully to {user.email}',
                'email': user.email
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send test email. Check backend logs for details.'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

# --- DELETE USER (RESET ACCOUNT DATA) ---
@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user and all their associated data (expenses, budgets, savings, incomes, payment methods).
    Cascade delete is enabled on all relationships via the User model.
    """
    try:
        user = User.query.get_or_404(user_id)
        user_email = user.email
        user_name = f"{user.first_name} {user.last_name}"
        
        # Delete the user (cascade delete will handle all related records)
        db.session.delete(user)
        db.session.commit()
        
        print(f"User account deleted: {user_name} ({user_email})")
        
        return jsonify({
            'success': True,
            'message': f'Account and all associated data for {user_name} have been permanently deleted.'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to delete account: {str(e)}'
        }), 400
