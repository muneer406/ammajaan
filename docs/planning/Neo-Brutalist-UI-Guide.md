# Neo-Brutalist UI Guide

This guide defines the visual and interaction language for the project.

## Visual Direction

- Bold geometric blocks.
- Hard edges and high-contrast color planes.
- Thick borders and offset shadows.
- Functional, unapologetic hierarchy.
- Minimal gradients, maximal structure.

## Design Tokens

Use CSS variables to ensure consistency.

```css
:root {
  --bg: #f4f1e8;
  --surface: #fff8e7;
  --ink: #111111;
  --accent-a: #ff5d2a;
  --accent-b: #00b3ff;
  --accent-c: #ffd500;
  --border: 3px solid var(--ink);
  --radius: 0px;
  --shadow-offset: 6px;
  --shadow: 6px 6px 0 var(--ink);
}
```

## Typography

- Headings: `Space Grotesk` or `Archivo Black`.
- Body: `IBM Plex Sans` or `Work Sans`.
- Avoid default sans-serif stacks as the primary visual identity.
- Use heavy weights for key labels and prices.

## Core Component Rules

- Cards:
  - Flat fill color + thick border + offset shadow.
  - On hover, shift `translate(-2px, -2px)` and increase shadow offset feeling.
- Buttons:
  - Rectangular, no rounded corners.
  - Strong label contrast.
  - Pressed state should physically move down-right.
- Inputs:
  - Thick border, clear focus ring.
  - Avoid subtle placeholder-only labeling.
- Tabs/Filters:
  - Use blocky chips with active inversion (dark bg/light text).

## Layout Rules

- Maintain strong spacing rhythm (8px grid).
- Use asymmetric accents (highlight strips, stickers, labels).
- Keep product grids clean while allowing bold card visuals.
- Mobile first, then scale to tablet/desktop.

## Motion Rules

- Use purposeful motion only:
  - Page intro slide/fade.
  - Staggered card reveal.
  - Button press micro-interaction.
- Keep durations short (150ms to 280ms).
- Prefer spring for cards and ease-out for page transitions.

## Color Usage

- Use one dominant neutral background.
- Use accent colors as semantic highlights:
  - Add to cart: accent-a.
  - Wishlist: accent-b.
  - Price/rating chips: accent-c.
- Keep text contrast high for accessibility.

## Page-Level Notes

- Home:
  - Feature hero with oversized heading and hard-edge CTA.
- Products:
  - Left filter block on desktop; top stacked controls on mobile.
- Product details:
  - Split layout with strong visual divider.
- Cart/Checkout:
  - Summary panel should look like a pinned receipt card.

## Dos and Donts

- Do use thick outlines, hard shadows, and bold contrast.
- Do keep a consistent component silhouette language.
- Do not use glassmorphism, soft blur, or subtle neumorphism.
- Do not over-animate every element.
- Do not mix too many typefaces.

## Implementation Checklist

- [ ] Define tokens in global CSS.
- [ ] Create reusable `NeoButton`, `NeoCard`, `NeoInput` styles.
- [ ] Add hover/pressed interaction states.
- [ ] Apply consistent border and shadow system app-wide.
- [ ] Validate readability and contrast on mobile.
