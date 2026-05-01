# 📧 Email Notification Setup Guide

## Issue: Gmail Authentication Required

The budget email notification system needs Gmail credentials to send emails. Follow these steps:

## Step 1: Get Your Gmail App Password

1. Go to: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select:
   - **App**: Mail
   - **Device**: Windows Computer (or your device type)
5. Google generates a **16-character password** - copy it
6. Close the dialog (password won't appear again)

**Example app password**: `abcd efgh ijkl mnop`

## Step 2: Update .env File

Edit `backend/.env`:

```
MAIL_USERNAME=your-actual-email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```

Replace:
- `your-actual-email@gmail.com` - Your Gmail address
- `abcd efgh ijkl mnop` - The 16-character app password (with spaces)

## Step 3: Restart Backend

The app will automatically load `.env` variables on restart.

## ✅ How to Test

### Option 1: Test Email Route
Once backend is running:
```
GET http://127.0.0.1:5000/api/test-email/4
```

Check backend terminal for output and your email for the test message.

### Option 2: Test with Real Budget
1. Create a budget: ₹500 with 50% alert
2. Add an expense: ₹300
3. Check your email for budget alert

## 🔍 Troubleshooting

### Email Not Sending?
1. **Check terminal logs** - Look for error messages
2. **Verify credentials** - Make sure .env file is updated
3. **Check 2FA** - Enabled 2-Step Verification? Required for app passwords
4. **Gmail security** - Check https://myaccount.google.com/security for warnings
5. **Try test route** - Use `/api/test-email/4` to test manually

### Common Errors

**Error: "Username and Password not accepted"**
- Solution: Get a fresh 16-character app password

**Error: "MAIL_USERNAME not configured"**
- Solution: Update .env file and restart backend

**Error: "SMTPAuthenticationError"**
- Solution: Use 16-char app password, not your Gmail password

## 📋 Quick Checklist

- [ ] Have 2FA enabled on Gmail account
- [ ] Got 16-character app password from apppasswords
- [ ] Updated `backend/.env` with email and password
- [ ] Restarted backend (`python3 app.py`)
- [ ] Tested with `/api/test-email/4` route
- [ ] Received test email successfully
- [ ] Created budget and exceeded threshold
- [ ] Received budget alert email

## 🔐 Security Notes

- `.env` is in `.gitignore` - Never commit credentials
- App passwords are tied to Google account security
- Can create/delete app passwords anytime at apppasswords page
- Only this app uses the app password

## Need Help?

If emails still aren't sending:
1. Check backend terminal for detailed error messages
2. Visit https://support.google.com/mail/?p=BadCredentials for Gmail help
3. Verify Gmail account has 2FA enabled
4. Try creating a new app password
