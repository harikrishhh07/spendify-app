# 🔐 How to Get Your 16-Character Gmail App Password

## Prerequisites
You MUST have **2-Step Verification** enabled on your Google account. If not, enable it first:
1. Go to: https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the setup wizard
4. Once enabled, proceed with the steps below

---

## Step-by-Step Guide to Get App Password

### Step 1: Open Google Account Settings
- Go to: **https://myaccount.google.com/apppasswords**
- OR manually:
  - Visit: https://myaccount.google.com/security
  - Scroll down to "App passwords" section (only visible if 2FA is enabled)
  - Click "App passwords"

### Step 2: Select App and Device
You'll see a dropdown menu that looks like this:

```
Select app:      [Mail          ▼]
Select device:   [Windows Computer ▼]
```

**Action:**
1. Click first dropdown → Select **"Mail"**
2. Click second dropdown → Select **"Windows Computer"** (or your device type)

### Step 3: Generate Password
- Click the **"Generate"** button
- Google will show you a 16-character password in a popup

### Step 4: Copy the Password
The password looks like:
```
abcd efgh ijkl mnop
```
(Note: It has spaces between groups of 4 characters)

**Important:** 
- ✅ Copy it WITH spaces
- ⏰ Do this immediately - it won't appear again
- 📋 Don't screenshot or share it

### Step 5: Use in .env File

Update `backend/.env`:
```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## Visual Guide

### What You See on Screen

**BEFORE clicking Generate:**
```
┌─────────────────────────────────────┐
│ Select the app and device           │
├─────────────────────────────────────┤
│ Select app:      [Mail           ▼] │
│ Select device:   [Windows Comp...▼] │
│                                     │
│              [Generate]             │
└─────────────────────────────────────┘
```

**AFTER clicking Generate:**
```
┌─────────────────────────────────────┐
│ Here's your app password            │
├─────────────────────────────────────┤
│                                     │
│    abcd efgh ijkl mnop              │ ← Copy this!
│                                     │
│  [Copy to clipboard]                │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### "App passwords" section not visible?
**Solution:** Enable 2-Step Verification first
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Enable"
4. Follow setup steps
5. Then try app passwords again

### "This app isn't supported"?
**Solution:** Make sure you selected:
- App: **Mail** (not Gmail)
- Device: **Windows Computer** (or your OS)

### Lost the password?
**Solution:** Generate a new one
1. Go back to app passwords
2. The old password will appear in a list
3. Click **"Remove"** on old password
4. Click **"Generate"** to create a new one
5. Copy the new password

---

## Final Steps After Getting Password

1. ✅ Copy the 16-character password
2. ✅ Open `backend/.env` file
3. ✅ Update `MAIL_PASSWORD=` with your password
4. ✅ Update `MAIL_USERNAME=` with your Gmail
5. ✅ Save the file
6. ✅ Restart backend (`python3 app.py`)
7. ✅ Test with budget alert

---

## Security Notes
- 🔒 Each app password is unique to that app
- 🔑 You can create multiple app passwords for different apps
- 🗑️ Can delete any app password anytime
- 📱 App password only works with 2-Step Verification enabled

---

## Example

**Your Google Account:** harikrishna@gmail.com
**Your App Password:** `wxyz abcd efgh ijkl`

**Update backend/.env to:**
```
MAIL_USERNAME=harikrishna@gmail.com
MAIL_PASSWORD=wxyz abcd efgh ijkl
```

That's it! Your budget alerts will now send to your email. 📧
