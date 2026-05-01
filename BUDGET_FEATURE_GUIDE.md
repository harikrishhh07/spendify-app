# Budget Feature Setup Guide

## ✅ What's Been Implemented

The budget feature is now fully integrated into your Spendify app with the following capabilities:

### Backend Features
- **Budget Management API**
  - Create budgets with custom thresholds
  - Update budget amounts and alert settings
  - Delete budgets
  - Track spending against budgets in real-time
  - Multiple budgets per month (one per category or one for all expenses)

- **Email Notifications**
  - Automatic emails sent when you reach 80% of budget (customizable threshold)
  - Beautiful HTML email templates
  - Budget summary with spending breakdown
  - One notification per budget per month (prevents email spam)

### Frontend Features
- **Budget Management Page** (`/budget`)
  - Create new budgets with custom alert thresholds
  - View all budgets with real-time spending progress
  - Color-coded progress indicators (green → yellow → orange → red)
  - One-click budget deletion
  - Reset notification alerts manually
  - Category-specific budgets supported

## 🔧 Email Setup Instructions

To enable email notifications, you need to configure Gmail credentials:

### Step 1: Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer" (or your device)
5. Google will generate a 16-character password
6. Copy this password

### Step 2: Set Environment Variables
Create a `.env` file in the `backend/` directory:

```bash
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

Replace with your actual Gmail and the 16-character app password.

### Step 3: Restart Backend
The app will automatically use these environment variables on next restart.

## 📊 How It Works

### Budget Creation
1. Navigate to the **Budget** page from the navbar
2. Click **"Create New Budget"**
3. Enter:
   - Budget Amount (e.g., 5000 for monthly budget)
   - Category (optional - leave empty for all categories)
   - Alert Threshold (default 80%)
4. Click **"Create Budget"**
5. Budget is active immediately for the current month

### Budget Monitoring
- The budget page shows:
  - Current spending vs. budget limit
  - Spending progress bar with visual color coding
  - Remaining budget amount
  - Budget status (On Track / Over)
  
### Email Alerts
When you cross the alert threshold:
- An email is automatically sent to your registered email
- Email includes budget summary and spending breakdown
- After alert is sent, it won't repeat until you manually reset it
- Click **"🔔 Reset Alert"** button to enable alerts again

## 🎯 Usage Examples

### Example 1: Monthly Budget
- Budget Amount: ₹10,000
- Category: Leave empty (covers all expenses)
- Alert Threshold: 80%
- Email sent when you spend ₹8,000

### Example 2: Category-Specific Budget
- Budget Amount: ₹2,000 for groceries
- Category: Select "Groceries"
- Alert Threshold: 75%
- Email sent when you spend ₹1,500 on groceries

### Example 3: Tight Control
- Budget Amount: ₹5,000
- Alert Threshold: 50% (get alerts early!)
- Email sent when you spend ₹2,500

## 🔄 Integration with Expenses

- Budgets are **checked automatically** when you add an expense
- The system calculates spending for the current month
- Email notifications are sent if threshold is crossed
- No manual action needed - it all happens in the background

## 📱 Features in Detail

### Progress Indicators
- **Green** (0-49%): Within budget, good spending
- **Yellow** (50-79%): Approaching budget limit
- **Orange** (80-99%): Near budget limit, alert sent
- **Red** (100%+): Over budget, exceeded

### Budget Dashboard Cards
- **Budget**: Total budget limit
- **Spent**: Amount spent this month
- **Remaining**: Money left in budget
- **Status**: On Track ✓ or Over ⚠️

### Reset Alerts
- Each budget sends one alert per month when threshold is crossed
- Manually reset to enable alerts again for the same budget
- Useful if you plan to increase spending temporarily

## ⚙️ Advanced Configuration

### Gmail Issues?
If emails aren't sending:
1. **Check credentials**: Make sure MAIL_USERNAME and MAIL_PASSWORD are set in `.env`
2. **App password**: Use the 16-character app password, not your regular Gmail password
3. **2FA enabled**: Required for app-specific passwords
4. **Less secure apps**: Gmail may block the app initially - check your Gmail security warnings

### Multiple Email Providers
To use a different email provider, update `app.py`:

```python
# For Outlook
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587

# For Zoho
app.config['MAIL_SERVER'] = 'smtp.zoho.com'
app.config['MAIL_PORT'] = 587
```

## 🧪 Testing the Feature

1. **Create a budget** with a low amount (e.g., ₹1,000)
2. **Add an expense** that crosses the alert threshold
3. **Check your email** - you should receive the alert
4. **In the Budget page**, the progress bar shows red and says "Over"
5. **Click "Reset Alert"** to re-enable notifications

## 📝 Database Schema

The Budget model now includes:
- `budget_id`: Primary key
- `user_id`: Foreign key to User
- `amount`: Budget limit amount
- `category_id`: Optional category (null = all categories)
- `period_month`: Month (1-12)
- `period_year`: Year
- `alert_threshold`: Percentage to trigger alert (default 80)
- `is_active`: Whether budget is active
- `exceeded_notification_sent`: Track if alert was sent this month

## 🔐 Security Notes
- Email credentials stored only in `.env` (never commit to git)
- All budget operations require authentication
- Users can only see their own budgets
- Emails contain no sensitive data beyond budget amounts

## 🚀 Next Steps

1. **Set up `.env`** with your Gmail credentials
2. **Restart the backend** to load environment variables
3. **Test by creating a budget** and adding an expense
4. **Check your email** for the notification

Enjoy your new budget tracking feature! 💰
