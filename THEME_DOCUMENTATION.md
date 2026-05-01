# Spendify - Dark Luxury Theme Documentation

## 🎨 Color Palette Overview

Spendify now features a unified **Dark Luxury** color palette across both frontend and backend, creating a premium, sophisticated financial management experience.

### Core Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Obsidian | `#0A0A0A` | Page background |
| Dark Charcoal | `#111111` | Card/surface background |
| Secondary Surface | `#1A1A1A` | Additional surface layers |
| **Champagne Gold** | `#C9A96E` | Primary accent, buttons, highlights |
| Light Gold | `#E2C28A` | Hover states, lighter accents |
| Warm Ivory | `#F5F3EE` | Primary text |
| Muted Gray | `#888780` | Secondary text, metadata |
| Teal | `#5DCAA5` | Success, positive actions |
| Red | `#E24B4A` | Danger, negative actions, alerts |

### Border & Visual Effects

- **Subtle Border**: `rgba(201, 169, 110, 0.18)` - Minimal visual separation
- **Light Border**: `rgba(201, 169, 110, 0.25)` - Standard borders
- **Hover Border**: `rgba(201, 169, 110, 0.45)` - Interactive states
- **Highlight**: `rgba(201, 169, 110, 0.15)` - Selection/focus states

---

## 🎬 Frontend Animations

### A) Custom Cursor System
- **Hidden default cursor** via `cursor: none`
- **7px gold circle** following mouse instantly
- **34px gold ring** with smooth lag effect (0.1 lerp factor)
- **Interactive scaling**: Ring 2x + dot 0.4x on hover
- **Click feedback**: Dot scales to 2x on mousedown

### B) Page Load Entrance
- Staggered animation for all direct children
- `opacity: 0 → 1`, `translateY(30px) → 0`
- 0.1s delay between each child
- Duration: 0.7s, Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

### C) Scroll Reveal
- **IntersectionObserver** triggers at 15% viewport entry
- Smooth reveal from bottom: `translateY(40px) → 0`
- Duration: 0.8s with cubic-bezier easing
- **Once-only trigger**: Unobserves after first animation

### D) Button Micro-Interactions
- Smooth transitions: 0.15s (transform), 0.2s (background), 0.2s (box-shadow)
- **Hover**: `translateY(-2px)` + gold shadow `0 6px 24px rgba(201,169,110,0.25)`
- **Active**: `translateY(0)` + `scale(0.97)`

### E) Card Hover Lift
- `transform: translateY(-4px)` on hover
- Border color smoothly transitions to hover state
- Duration: 0.3s cubic-ease

### F) Navigation Scroll Behavior
- Detects scroll > 40px
- Adds `.scrolled` class with darker background
- `background: rgba(10,10,10,0.95)` + subtle gold border-bottom
- Smooth 0.3s transition

---

## 💻 Backend Integration

### Color Configuration File: `colors.py`

The backend includes a centralized color configuration class:

```python
from colors import SpendifyColors

# Access colors
SpendifyColors.PRIMARY_ACCENT   # #C9A96E
SpendifyColors.SUCCESS          # #5DCAA5
SpendifyColors.DANGER           # #E24B4A
```

### Email Templates

All email notifications use the dark luxury theme:

**Features:**
- Dark background with gold accents
- Premium gradient header with Spendify logo
- Color-coded sections (danger red for alerts, teal for success)
- Smooth progress bars with gold gradients
- Professional footer with links

**Current Themed Emails:**
- Budget Alert Notifications (80%+ threshold)
- Custom recommendations in gold accent

### PDF Report Generation

PDF exports use the dark luxury palette:

- **Headers**: Champagne gold backgrounds with contrasting text
- **Summary Tables**: Gold headers with dark surfaces
- **Expense Tables**: Red headers for visual distinction
- **Income Tables**: Teal headers for success indication
- **Overall Styling**: Premium dark surfaces with gold accents

---

## 📁 File Structure

### Frontend
```
src/
├── index.css              # Color variables + animation keyframes
├── App.jsx                # Cursor logic + scroll reveal
├── components/
│   └── Navbar.jsx         # Scroll detection for nav
├── pages/
│   ├── Dashboard.jsx
│   ├── AddExpense.jsx
│   ├── ExpenseHistory.jsx
│   ├── Reports.jsx
│   ├── Goals.jsx
│   ├── Budget.jsx
│   ├── Profile.jsx
│   └── Login.jsx

index.html                 # Cursor divs + Tailwind config
tailwind.config.js         # Color palette extension
```

### Backend
```
backend/
├── colors.py              # NEW - Unified color palette
├── app.py                 # Flask configuration
├── routes.py              # API endpoints (updated with color imports)
├── models.py              # Database models
├── seed.py                # Database seeding
└── requirements.txt       # Dependencies
```

---

## 🎯 Implementation Details

### CSS Variable System (Frontend)

```css
:root {
  --color-bg-dark: #0A0A0A;
  --color-surface: #111111;
  --color-primary-accent: #C9A96E;
  /* ... etc */
}
```

### Animation Classes

```css
/* Page load */
.app-container > div > * {
  animation: slideInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(40px); }
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* Cursor */
#cursor-dot { width: 7px; background: #C9A96E; }
#cursor-ring { width: 34px; border: 1.5px solid #C9A96E; }
```

### Backend Color Import

```python
from colors import SpendifyColors
from reportlab.lib import colors as reportlab_colors

# In email templates:
background-color: {SpendifyColors.BG_DARK}
color: {SpendifyColors.TEXT_PRIMARY}
```

---

## 🚀 Usage Guidelines

### Adding New Components

1. **Use CSS variables** for colors: `color: var(--color-text-primary)`
2. **Use Tailwind classes**: `bg-slate-800`, `text-yellow-400` (mapped to palette)
3. **For backend**: Import from `colors.py` and use in templates/PDFs

### Email Templates

```python
from colors import SpendifyColors

html_body = f"""
<div style="background-color: {SpendifyColors.BG_SURFACE}; 
           color: {SpendifyColors.TEXT_PRIMARY};">
    <!-- Content -->
</div>
"""
```

### Animation Best Practices

- **Page transitions**: Use `.animate-in` class
- **Hover effects**: Use transition utilities
- **Scroll animations**: Elements automatically get `.reveal` class
- **Custom animations**: Add to `/* SPENDIFY ANIMATIONS */` block

---

## 📱 Color Consistency

### When to Use Each Color

- **Primary Accent (#C9A96E)**: Buttons, links, main CTAs, headers
- **Text Primary (#F5F3EE)**: Body text, main content
- **Text Secondary (#888780)**: Metadata, hints, small text
- **Success (#5DCAA5)**: Income, positive metrics, confirmations
- **Danger (#E24B4A)**: Expenses, alerts, errors
- **Background (#0A0A0A)**: Main page background
- **Surface (#111111)**: Cards, panels, modals

---

## ✅ Verification Checklist

- [x] Frontend: All pages converted to dark luxury palette
- [x] Frontend: Custom cursor system implemented
- [x] Frontend: All 6 animation types working
- [x] Frontend: Navbar scroll detection active
- [x] Backend: Color configuration file created
- [x] Backend: Email templates themed
- [x] Backend: PDF generation updated
- [x] Unified color palette across stack

---

## 📞 Support

For color or animation issues:

1. Check `colors.py` (backend) or `index.css` (frontend)
2. Verify imports: `from colors import SpendifyColors`
3. Use inspector to verify computed values
4. Check for conflicting Tailwind classes

---

**Last Updated**: April 30, 2026  
**Version**: 1.0 - Dark Luxury Theme Release  
**Status**: ✨ Complete & Production Ready
