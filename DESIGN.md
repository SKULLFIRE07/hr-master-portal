---
name: HR Master Portal
description: A compact employee service directory with device light and dark themes.
colors:
  "bg": "#f4f6f9"
  "card": "#ffffff"
  "ink": "#1c2430"
  "sub": "#5b6675"
  "accent": "#2f6feb"
  "accent-soft": "#e8f0fe"
  "border": "#e3e7ee"
  "action": "#225dce"
  "error": "#ae2435"
  "focus": "#153f99"
  "dark-bg": "#14171c"
  "dark-card": "#1d2128"
  "dark-ink": "#eef1f5"
  "dark-sub": "#a2acb8"
  "dark-accent": "#5b8def"
  "dark-accent-soft": "#22314d"
  "dark-border": "#2a2f38"
  "dark-action": "#94b5ff"
  "dark-error": "#ff9ba9"
  "dark-focus": "#b5ceff"
  "dark-primary-fill": "#426fca"
  "calculator-error": "#ae2833"
  "calculator-success": "#216640"
  "calculator-dark-error": "#ff9ca5"
  "calculator-dark-success": "#8cdbac"
  "calculator-dark-button-ink": "#101a2c"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-.035em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 650
    lineHeight: 1.6
    letterSpacing: "-.025em"
  section:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.4
  panel:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  copy:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  calculator-total:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-.035em"
rounded:
  "button": "7px"
  "notice": "8px"
  "calculator-group": "12px"
  "service": "14px"
  "service-icon": "11px"
spacing:
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "14": "14px"
  "15": "15px"
  "16": "16px"
  "18": "18px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.card}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "9px 15px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "9px 15px"
  service-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.service}"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "10px 12px"
  notice:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.notice}"
    padding: "14px 16px"
  tab-active:
    textColor: "{colors.action}"
    padding: "12px 0"
---
# Design System: HR Master Portal

## Overview

**Creative North Star: "Blue system UI"**

A compact blue system interface helps employees find a service, read its guidance, and take an action. Rounded white or charcoal containers, restrained borders, and familiar controls carry the hierarchy.

The PRD pins the system font, blue palette, and device themes. This documentation records those shipped choices; it does not introduce an alternative visual identity.

**Key Characteristics:**
- Single-column service directory
- Blue action hierarchy and soft blue notices
- Flat bordered surfaces
- System typography and device themes

## Colors

The palette uses clear blue actions, cool neutral surfaces, and muted explanatory text. Frontmatter names preserve the source custom properties; `dark-` entries are their device-theme counterparts.

### Primary

- **Action blue:** `action` controls portal links, selected tabs and light-theme primary fills. `accent` carries service identity, tab underlines, selection and input accents. Dark primary fills use `dark-primary-fill` so white labels remain readable.
- **Soft blue:** `accent-soft` provides service-icon backgrounds and notices; its dark variant provides the same tonal hierarchy.

### Neutral

- **Page ground:** `bg` surrounds the directory; `card` carries accordions and portal fields. `ink` supplies content and `sub` supplies supporting text.
- **Quiet separators:** `border` divides contacts, tabs and containers. The dark variant is the shipped charcoal divider.
- **Functional states:** `error` and `focus` communicate portal validation and keyboard position. The calculator has its own error and success tokens and dark submit-label ink, preserved separately rather than silently normalized.

**The Action Blue Rule.** Use action blue for links and selected tabs; use the dedicated darker fill for primary buttons in the dark portal theme.

## Typography

**Display Font:** No separate display face; the PRD pins the system stack in frontmatter.
**Body Font:** The same system stack throughout the directory and calculator.

Familiar typography favors quick reading. Semibold labels and compact headings establish hierarchy without uppercase kickers.

### Hierarchy

- **Headline:** Portal title; mobile reduces it to 25px.
- **Title:** Directory introduction; mobile reduces it to 20px. Calculator headings use the same size with a tighter 1.25 line height and bold weight.
- **Section:** Accordion titles; mobile reduces them to 15px.
- **Panel:** Guidance headings; mobile reduces them to 16px.
- **Body / Copy:** Base text and explanatory paragraphs. Portal panel copy is limited to 68ch; mobile panel copy and steps reduce to 13px. Calculator base line height is 1.55.
- **Label / Caption:** Controls and supporting information. Mobile tabs and action labels reduce to 12px.
- **Calculator total:** A bold numeric result with tabular numerals. Calculator fields and result values also use tabular numerals.

## Layout

The page is a centered single column with maximum width 820px, 24px outer gutters, and 48px top padding. At 600px and below the gutters become 16px and top padding becomes 28px or the safe-area inset, whichever is larger. The header QR is hidden at that breakpoint.

Five service containers use 12px vertical gaps. Each carries exactly two tabs. The directory opens one accordion at a time; Payroll starts expanded. Desktop section headers and content use 24px horizontal padding; mobile uses 16px. Tabs have 24px gaps, reduced to 20px on mobile. Common spacing clusters around 8, 12, 16, 20 and 24px rather than a strict modular scale.

Portal forms use two equal columns with 18px gaps and collapse to one column at 600px. Contact rows similarly collapse from two columns to one. The embedded calculator keeps paired target/achievement fields until 359px, then stacks them. Its iframe height follows its content through same-origin messages.

## Elevation & Depth

No box shadows are shipped. Card fills, blue notice fills and thin borders create depth. The portal focus treatment is a three-pixel outline with four-pixel offset; calculator focus uses the accent color with three-pixel offset.

**The Flat Surface Rule.** Use borders and tonal fills to distinguish surfaces; the shipped interface has no box shadows.

## Shapes

Service containers have gently rounded corners, with a smaller radius on their icon tiles. Buttons and fields use compact curved corners; notices are slightly softer. The calculator uses 12px fieldset and result-summary corners and 8px control corners. Borders are consistently one pixel. Icons are inline stroke SVGs; disclosure signs remain native text indicators in nested details.

## Components

### Buttons

Primary actions use filled blue, white semibold labels and a minimum height of 42px. Secondary actions use the card fill with a quiet border. Both use 9px vertical and 15px horizontal padding; mobile horizontal padding reduces to 12px. Hover darkens through a brightness filter. Disabled primary actions use muted text on soft blue, without hover darkening. Calculator buttons use a 44px minimum, 8px corners and 10px by 17px padding; its dark submit label uses dark ink.

### Cards / Containers

Service cards pair card fill, one-pixel borders and 14px corners. Accordion headers have 88px minimum height on desktop and 83px on mobile; hovering uses the page ground. Content padding is 24px on desktop, with a 20px mobile bottom inset. The expanded chevron rotates through 180 degrees.

### Inputs / Fields

Portal selects and textareas use card fill, 7px corners, 10px by 12px padding and 44px minimum height. Textareas resize vertically and start at 110px. Labels are 13px semibold. Help text is muted and validation messages use the error token. Calculator number fields use page-ground fill, 8px corners and 44px minimum height; invalid fields also change their border color.

### Navigation

Tabs are text buttons on a bordered baseline with a 45px minimum target. Selected tabs use action blue and a two-pixel accent underline. Keyboard arrows, Home and End move among tabs; the selected panel is focusable. Accordion buttons expose expanded state and control their regions.

### Notices and contacts

Notices use soft blue with 14px by 16px padding and 8px corners. Contact rows use quiet dividing lines, muted role labels and semibold names; call and email links wrap and expose at least 40px targets. Nested contact groups use native details disclosures. Missing information uses explanatory text and disabled actions, without a status badge above the heading.

### Motion

Panel entry fades from reduced opacity and a one-pixel blur over 250ms. Chevron rotation takes 220ms; both use the same ease-out curve. Reduced-motion preferences remove panel animation, chevron transitions and smooth scrolling.

## Do's and Don'ts

### Do:

- **Do** preserve device light and dark variants when extending a component.
- **Do** keep keyboard focus visible and expose accordion and tab state semantically.
- **Do** use text to explain unavailable actions and contact information.
- **Do** keep the directory within its established single-column container.

### Don't:

- **Don't** add decorative elevation to the flat bordered containers.
- **Don't** introduce a display font; the system stack is explicitly pinned by the PRD.
- **Don't** use color alone to communicate calculation status or unavailable actions.
