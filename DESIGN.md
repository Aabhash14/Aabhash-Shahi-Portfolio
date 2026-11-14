---
name: Aabhash Shahi
description: QA engineer portfolio. A ruled, near-white record of scope and proof, in Inter with one blue accent, light and dark.
colors:
  bg: "#F8F9FB"
  surface: "#FFFFFF"
  surface-2: "#FAFBFC"
  text: "#111111"
  text-2: "#666666"
  text-3: "#8A8A8A"
  border: "#E6E8EB"
  border-strong: "#D5D9DE"
  accent: "#2563EB"
  accent-hover: "#1D4ED8"
  accent-soft: "#EFF6FF"
  accent-line: "#BFD3FB"
  accent-on: "#FFFFFF"
  grid-line: "rgba(17,17,17,.055)"
  scrim: "rgba(11,13,16,.5)"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 3.4vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.034em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.25rem + 1.9vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  figure:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 2.4vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  lead:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body-list:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  r-1: "6px"
  r-2: "8px"
  r-3: "12px"
  r-4: "16px"
  r-pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  s-10: "128px"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.r-2}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.r-2}"
    padding: "0 16px"
    height: "40px"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.r-2}"
    size: "40px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.meta}"
    rounded: "{rounded.r-pill}"
    padding: "6px 12px"
  chip-key:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.meta}"
    rounded: "{rounded.r-pill}"
    padding: "6px 12px"
  chip-building:
    textColor: "{colors.text-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.r-pill}"
    padding: "6px 12px"
  badge-current:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "5px 12px"
  nav-link:
    textColor: "{colors.text-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.r-2}"
    padding: "8px 12px"
---

# Design System: Aabhash Shahi

## Overview

**Creative North Star: "The Ruled Record"**

The site reads like a well-kept test log: a near-white ground, white bands for the sections that carry the most proof, and content laid out as rows separated by one-pixel hairlines. Structure comes from rules and alignment, not from boxes, colour fields or ornament. One blue accent marks what is current, chosen or done, and it shows up rarely enough to mean something. Inter does all the talking, in tight negative tracking at heading sizes and plain at reading sizes.

The density is calm but not sparse. Every region spans the grid, figures sit in tabular numerals, and the reading text is set large enough (18px prose, 14px functional floor) for a fast skim on a laptop or a phone. Light and dark are peers: every token has a dark value, and nothing is produced by inverting the light theme.

The tokens in `styles.css` define this world for the live pages. The Shortlist build (`ui-options/6-shortlist.html`) extends it inside the same world, adding the readable type ramp, the accent-line token, the ruled-row grammar, key chips and the flow-track motion. Where the two files disagree on a value, the prose below says so.

**Key Characteristics:**
- Near-white ground, white surface bands, one blue accent, matched light and dark themes.
- Hairline rules (1px) separate rows, sections and table cells; cards are rare.
- Inter only, weights 400, 500 and 600; negative tracking that grows with size.
- Figures and dates in tabular numerals.
- Shadows stay faint and appear mostly as a response to hover or for floating layers.
- Motion is short and eased, with one signature sequence: the flow track.

## Colors

A cool, nearly colourless neutral scale carries everything; a single saturated blue does the pointing.

### Primary
- **Proof Blue** (accent): links inside meta, the active nav underline, the current-role dot and badge, flow-track stops once lit, focus rings, text selection, the primary button's hover. In dark theme it lifts to a lighter blue (#60A5FA) for contrast.
- **Proof Blue Deep** (accent-hover): pressed and hover state of accent-filled controls.
- **Blue Wash** (accent-soft): the fill behind key chips, the "current" badge and the current timeline dot's halo.
- **Blue Hairline** (accent-line): the border of key chips, so the wash has an edge without a full-strength accent outline. Added by the Shortlist build.
- **On-Accent** (accent-on): text and icons placed on an accent fill.

### Neutral
- **Cool Paper** (bg): the page ground in light theme; near-black (#0B0D10) in dark.
- **White Band** (surface): buttons, chips, dialogs and the alternating section bands that hold projects, client coverage and contact.
- **Raised Paper** (surface-2): hover fill for cards and nav links, the expanded case-study button, portrait backgrounds.
- **Ink** (text): headings, figures, primary labels.
- **Graphite** (text-2): secondary prose, descriptions, meta.
- **Pewter** (text-3): tertiary text, list markers, quiet labels.
- **Hairline** (border): every row and section rule.
- **Firm Hairline** (border-strong): table header rules, button outlines, inactive track stops, dashed "still building" rules.
- **Grid Line** and **Scrim**: the faint diagram grid in the live hero and the backdrop behind the case-study dialog.

### Named Rules
**The One Blue Rule.** The accent is the only chromatic colour in the system. It marks state (current, active, selected, done, focused), never decoration or large fills; washes use accent-soft, edges use accent-line.

**The Peer Themes Rule.** Every colour token is defined twice, once per theme, by hand. Dark is never computed by inversion or filter.

## Typography

**Display Font:** Inter (with -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif)
**Body Font:** Inter (same stack)

**Character:** One family at three weights. Headings get their presence from weight 600 and tracking that tightens as size grows; reading text stays at default tracking and generous leading.

### Hierarchy
- **Display** (600, fluid 36 to 56px, 1.06): the page H1 and the contact headline, held to about 19ch. The live `styles.css` display runs larger (up to 64px, -0.038em).
- **Headline** (600, fluid 30 to 44px, 1.08): section H2s.
- **Title** (600, 26px, 1.2): project and role names. Sub-group titles (skills, credentials) step down to 20px.
- **Figure** (600, fluid 36 to 56px, line-height 1, tabular): the proof band numbers. A unit word trails at a smaller size.
- **Lead** (400, fluid 18 to 21px, 1.55, Graphite): the paragraph under an H1 or section head, max about 56 to 58ch.
- **Body** (400, 18px, 1.6 to 1.65): project descriptions and prose, max about 64ch.
- **Body-list** (400, 17px, 1.6): bullet lists, case-study tables, about paragraphs, button text.
- **Meta** (400 to 500, 15px): nav links, tags, dates' sub-lines, captions.
- **Label** (500 to 600, 14px): the smallest functional text: badges, column labels, lab type pills, the monogram.

### Named Rules
**The Fourteen Floor Rule.** No functional text is set below 14px. The Shortlist ramp (18 / 17 / 15 / 14) is the reference; the live `styles.css` scale still carries 12 and 13px labels, which predate this ramp.

**The Tabular Proof Rule.** Figures, dates and ratios use tabular numerals so columns of proof line up.

## Layout

A single centred container with fluid side padding (clamp 20px to 48px). The live pages cap it at 1120px; the Shortlist build widens it to 1240px for a 12-column feel. Sections stack full width, each opened by a hairline top rule, with block padding of 96px in the live pages and a fluid 56 to 88px in the Shortlist build.

Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px in `styles.css`. The Shortlist build fills the gaps with 20, 40 and 80px steps and renumbers its scale accordingly, so its `--s-5` is 20px where the live file's is 24px; reconcile the names before the two files share components. Column gaps in the Shortlist build are fluid (clamp 32px to 72px).

The ruled-row grammar is the main layout device:
- **Project rows** split 4fr / 8fr: name, type, impact and the case-study toggle on the left; description and flow track on the right. The case study opens full width beneath, on the same 4 / 8 split, as a ruled definition table.
- **Section heads** split 5fr / 7fr: H2 left, lead right, bottom-aligned.
- **Paired lists** (labs) are one row-major list in two columns, so paired rows end level.
- **Proof band**: four equal columns divided by vertical hairlines, two by two on narrow screens.
- **Balanced columns** (skills) pack top-down in three, two, then one column.

Responsive behaviour stacks rather than hides: below 1120px the section links drop into a horizontally scrolling second row of the bar; below 920px split rows become single columns in reading order; below 640px the first screen orders H1, lead, resume button, then the 2 x 2 figures.

## Elevation & Depth

Depth is mostly tonal: Cool Paper ground, White Band sections, Raised Paper on hover, all divided by hairlines. Shadows are faint, cool and soft, used at rest only for small resting controls in the live site and otherwise as a hover response or for layers that float (dialog, toast).

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(17,17,17,.04)`): resting buttons and the portrait in the live pages.
- **Lift** (`box-shadow: 0 4px 12px -4px rgba(17,17,17,.08), 0 2px 4px -2px rgba(17,17,17,.04)`): hover on buttons and cards, the status pill.
- **Float** (`box-shadow: 0 16px 48px -12px rgba(17,17,17,.14)`): the case-study dialog and the toast. The Shortlist build uses .16 alpha.

Dark theme swaps all three for black-based shadows at higher alpha (see sidecar).

### Named Rules
**The Rules Before Shadows Rule.** Borders carry structure; shadows only lift. If a layout needs a shadow to read as separate, it needs a hairline instead.

## Shapes

Gently rounded, never soft. Controls use 8px (r-2), small marks and focus rings 6px (r-1), framed media and grouped grids 12px (r-3), the dialog and the Shortlist portrait 16px (r-4). Tags, badges and the status pill are full pills. Rows themselves have no corners: they are open, bounded only by top or bottom hairlines. Dashed strokes are reserved for two quiet signals: material that is not yet finished (skills still being built) and the seam where a folded case study opens out of its row.

## Components

### Buttons
Quiet and solid: outlined white by default, one filled primary per group.
- **Shape:** gently rounded (8px).
- **Primary:** Ink fill with Cool Paper text, 40px tall, 16px side padding, 14px weight 500; turns Proof Blue on hover, Proof Blue Deep when pressed. The Shortlist build instead fills the primary with Proof Blue at rest (52px tall, 17px text, 10px corners); pick one before adoption.
- **Secondary:** White Band fill, hairline border, Ink text; border firms and the button lifts by 1px or gains the Lift shadow on hover.
- **Icon button:** 34 to 40px square, hairline border, for the theme toggle and menu.
- **Text link:** Graphite text with a faint underline (24% opacity line in live, Firm Hairline in Shortlist) that strengthens on hover.

### Chips
- **Default:** White Band fill, hairline border, meta size. Live chips are 6px-cornered and 12px text; Shortlist tags are pills at 15px.
- **Key:** Blue Wash fill, Blue Hairline border, Proof Blue text, weight 500: the tools a role or skill group actually leaned on.
- **Building:** transparent fill, dashed Firm Hairline border, Graphite text: skills honestly marked as still in progress.
- **Current badge:** Blue Wash pill with Proof Blue label text, on the current role.

### Cards / Containers
- **Corner Style:** 12px on grouped grids (live work and labs grids), none on Shortlist rows.
- **Background:** White Band, Raised Paper on hover.
- **Shadow Strategy:** Lift on hover only (see Elevation & Depth).
- **Border:** 1px hairline; live grids use a 1px gap over a border-coloured background to draw internal rules.
- **Internal Padding:** 24 to 32px.

### Navigation
Sticky bar on Cool Paper; a hairline appears under it once the page scrolls (the live bar also blurs and tints). Monogram "AS" in an Ink square with 8px corners, then the name in weight 600. Links are meta size in Graphite, Ink on hover; the current link gets a 1.5 to 2px Proof Blue underline. Below the breakpoint the live site uses a menu panel of ruled rows; the Shortlist build uses a scrolling second row.

### Case-study table
A definition list on the project's 4 / 8 grid: labels in weight 600 on the left, Graphite answers on the right, each pair opened by a hairline. The block is separated from the project row by a dashed seam and opens by animating its grid row from 0fr to 1fr.

### Flow track (signature)
Each project's process drawn as a row of stops joined by a 2px Hairline segment. When the track scrolls into view, segments fill with Proof Blue and stops turn solid, one after another (170ms stagger, ease-out); the final stop is set in Ink weight 600 and scales up slightly. On phones the track turns vertical. With reduced motion, tracks render already lit.

## Do's and Don'ts

### Do:
- **Do** separate rows and sections with 1px hairlines (border) and use Firm Hairline only for header rules, outlines and inactive stops.
- **Do** keep the accent to state: current, active, selected, done, focused.
- **Do** define every new colour in both themes by hand.
- **Do** set prose at 18px, lists at 17px, meta at 15px, and nothing functional under 14px.
- **Do** put figures, dates and ratios in tabular numerals.
- **Do** use the Key chip for tools that carried real work and the dashed Building chip for skills still in progress.
- **Do** honour reduced motion: transitions collapse to zero and sequences render in their end state.

### Don't:
- **Don't** introduce a second chromatic colour for decoration; the one blue is the whole palette's signal.
- **Don't** use dashed strokes for anything beyond in-progress material and the case-study seam.
- **Don't** lean on shadows to separate content that a hairline can separate.
- **Don't** produce dark theme by inverting or filtering the light theme.
