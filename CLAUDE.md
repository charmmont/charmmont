@AGENTS.md

# Deepbloom Design System
**Version 1.0 — Single source of truth for all UI decisions.**
**Brand:** Deepbloom · deepbloom.me · *Root deep, bloom safe.*

All CSS tokens are defined in `app/globals.css`. Use `var(--token-name)` everywhere. Never hardcode colour hex values or approximations.

---

## Colour Tokens

```css
/* Backgrounds */
--color-bg:           #FAF7F2;   /* Parchment — primary page background */
--color-bg-card:      #FFFFFF;   /* White — cards, modals, raised surfaces */
--color-bg-subtle:    #F3F0EA;   /* Slightly darker parchment */

/* Brand Greens */
--color-pine:         #2D4A3E;   /* Primary brand, headlines, CTAs */
--color-sage:         #7A9E8E;   /* Secondary accent, italic hero word */
--color-sage-light:   #A8C4B8;   /* Tertiary, dividers */

/* Text */
--color-text-primary:   #1C1C1A;
--color-text-secondary: #6B6B65;
--color-text-inverse:   #FAF7F2; /* On dark/pine backgrounds */

/* Borders */
--color-border:        rgba(45, 74, 62, 0.10);
--color-border-hover:  rgba(45, 74, 62, 0.22);
--color-border-strong: rgba(45, 74, 62, 0.35);

/* Tags */
--color-tag-bg:   rgba(45, 74, 62, 0.07);
--color-tag-text: #2D4A3E;

/* Shadows */
--shadow-sm:   0 2px 10px rgba(45, 74, 62, 0.05);
--shadow-md:   0 4px 22px rgba(45, 74, 62, 0.08);
--shadow-lg:   0 18px 60px rgba(45, 74, 62, 0.11);
--shadow-card: 0 4px 22px rgba(45, 74, 62, 0.07);

/* Status */
--color-active:    rgba(45, 74, 62, 0.08);  /* active nav item bg */
--color-active-t:  #2D4A3E;
--color-complete:  rgba(122, 158, 142, 0.12);
--color-complete-t:#2D4A3E;
--color-paused:    rgba(107, 107, 101, 0.10);
--color-paused-t:  #6B6B65;

/* Radius */
--radius-sm: 8px | --radius-md: 12px | --radius-lg: 16px
--radius-xl: 20px | --radius-2xl: 24px | --radius-full: 9999px
```

**Never:** use `#000`, `#fff` for text/bg, introduce new colours, use pine below 55% opacity for text.

---

## Typography

**Fonts:** `--font-display: 'Playfair Display'` | `--font-body: 'DM Sans'`

- Headings (h1–h4): always `var(--font-display)`, weight 700–900, `letter-spacing: -0.025em` to `-0.03em`
- Body copy: `var(--font-body)`, weight 300 (lead/card desc) or 400 (standard), never 600/700
- Labels/tags: DM Sans, ALL CAPS, `letter-spacing: 0.08–0.10em`, weight 500, `font-size: 9.5–11px`
- **Italic sage accent:** one key word per section heading, `<em style="font-style:italic; color:var(--color-sage)">word</em>`
- **Never:** mix fonts in one element, use Playfair below h4 size, use font-weight 600+ in body copy

---

## Buttons

**Primary:** `bg: var(--color-pine)`, pill shape (`border-radius: var(--radius-full)`), `box-shadow: 0 5px 22px rgba(45,74,62,0.28)`. Hover: `translateY(-2px)`, stronger shadow.

**Ghost:** transparent bg, `border: 1.5px solid var(--color-border)`, pine text. Hover: border darkens.

**Inverse (on pine bg):** `bg: var(--color-bg)`, pine text, `box-shadow: 0 8px 28px rgba(0,0,0,0.18)`.

**Portal small:** `padding: 8px 18px`, `font-size: 12px`, pine bg.

**All buttons always pill-shaped. Never squared.**

---

## Cards

**Public offer card:** `border-radius: var(--radius-xl)`, `padding: 28px 30px`, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow-card)`. Hover: `translateY(-5px)`, stronger shadow.

**Portal dashboard card:** `border-radius: 18px`, `padding: 22px 24px`, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow-sm)`.

**Belief/quote block:** `border-left: 3px solid [pine|sage|sage-light]`, left corners `border-radius: 0`, right corners `var(--radius-lg)`. Cycle border colours: pine → sage → sage-light.

---

## Navigation

**Public nav:** sticky, height 66px, `background: rgba(250,247,242,0.92)`, `backdrop-filter: blur(14px)` (applied on scroll), `padding: 0 60px`. Uses `LogoMark` SVG + wordmark.

**Portal nav:** 222px sidebar (desktop), `background: var(--color-bg-card)`, sticky. Mobile: 54px top bar + slide-in drawer.

**LogoMark SVG** is defined in `components/Navigation.tsx` and `components/PortalNav.tsx`. Use the same paths everywhere.

---

## Section Layout (Public)

- Section vertical padding: `72px` top
- Section horizontal padding: `60px` desktop, `24px` mobile
- Max content width: 1200px (`max-w-6xl`)
- Grid gaps: `18px` (cards), `56px` (two-col features)
- Section tags always: DM Sans, uppercase, `letter-spacing: 0.10em`, `color: var(--color-sage)`, `font-size: 9.5px`

---

## Portal Layout

- `PortalShell`: `display: flex`, sidebar (222px) + `<main style="flex:1; padding: 30px 34px">`
- Mobile: sidebar hidden, 54px top bar + drawer
- Dashboard grid: `grid-template-columns: 1.6fr 1fr`, gap 14px
- Metric grid: `repeat(4, 1fr)`, gap 14px

---

## Animations (defined in globals.css)

`fadeUp`, `slideRight`, `rootDraw`, `leafIn`, `floatA`, `floatB`, `ripple`, `dotPulse`, `iconFloat`

Always respect `prefers-reduced-motion` (already in globals.css).

---

## Do / Never

| ✅ Do | ❌ Never |
|---|---|
| Use `var(--color-*)` tokens everywhere | Hardcode hex values |
| DM Sans for all body/UI text | Use Inter or system-ui for body |
| Playfair Display for all headings | Use DM Sans for headings |
| Pill buttons (`border-radius: var(--radius-full)`) | Square/lightly-rounded buttons |
| One italic sage `<em>` per heading | Full italic headings |
| `72px` vertical section padding | Ad-hoc padding |
| Sidebar for portal nav | Top bar for portal on desktop |
| `box-shadow: var(--shadow-card)` on cards | Border-only cards (no shadow) |
| ALL CAPS with letter-spacing for labels | Sentence case labels |
| `pointer-events: none` on botanical SVGs | Interactive botanical elements |
