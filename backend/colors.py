# SPENDIFY DARK LUXURY COLOR PALETTE
# Backend color configuration to match frontend branding

class SpendifyColors:
    """Unified color palette for Spendify - Dark Luxury Theme"""
    
    # Background Colors
    BG_DARK = "#0A0A0A"          # Deep obsidian - page background
    BG_SURFACE = "#111111"       # Dark charcoal - card/surface background
    BG_SURFACE_SECONDARY = "#1A1A1A"  # Secondary surface
    
    # Primary Accent
    PRIMARY_ACCENT = "#C9A96E"   # Champagne gold - primary brand color
    ACCENT_HOVER = "#E2C28A"     # Lighter gold - hover state
    
    # Text Colors
    TEXT_PRIMARY = "#F5F3EE"     # Warm ivory - primary text
    TEXT_SECONDARY = "#888780"   # Muted warm gray - secondary text
    
    # Borders & Dividers
    BORDER = "rgba(201, 169, 110, 0.18)"      # Subtle gold border
    BORDER_LIGHT = "rgba(201, 169, 110, 0.25)" # Light gold border
    BORDER_HOVER = "rgba(201, 169, 110, 0.45)" # Hover state border
    
    # Status & Semantics
    SUCCESS = "#5DCAA5"          # Teal - success/positive actions
    DANGER = "#E24B4A"           # Red - danger/negative/errors
    WARNING = "#F4B860"          # Warm orange - warnings
    
    # Special
    HIGHLIGHT = "rgba(201, 169, 110, 0.15)"   # Highlight/selection color
    
    # Email Template Specific
    EMAIL_BG = "#0F0F0F"         # Dark background for emails
    EMAIL_SURFACE = "#1A1A1A"    # Card background for emails
    EMAIL_TEXT = "#F5F3EE"       # Primary text for emails
    EMAIL_TEXT_MUTED = "#888780" # Muted text for emails
    EMAIL_ACCENT = "#C9A96E"     # Accent for emails
    EMAIL_SUCCESS = "#5DCAA5"    # Success color for emails
    EMAIL_DANGER = "#E24B4A"     # Danger color for emails

# Quick access dictionary
COLORS = {
    'bg_dark': SpendifyColors.BG_DARK,
    'bg_surface': SpendifyColors.BG_SURFACE,
    'primary_accent': SpendifyColors.PRIMARY_ACCENT,
    'text_primary': SpendifyColors.TEXT_PRIMARY,
    'text_secondary': SpendifyColors.TEXT_SECONDARY,
    'success': SpendifyColors.SUCCESS,
    'danger': SpendifyColors.DANGER,
    'warning': SpendifyColors.WARNING,
}
