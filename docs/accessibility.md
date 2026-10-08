# Accessibility baseline (PRD §56 language support; WCAG-minded, no audit claimed)

## Shipped now (code-enforced)
- `html lang="en"`, one `h1` per page, real `<label>`/`<button>`/`<select>` elements
- Skip-to-content link in root layout (keyboard users)
- `role="status" aria-live="polite"` on all form feedback
- Visible `:focus-visible` outlines on every interactive element
- `prefers-reduced-motion` respected
- Language captured as a dropdown (20 options incl. Yoruba/Igbo/Hausa/Swahili/Amharic/Zulu);
  stored on the profile and used as matching signal §12 priority #9

## Language barrier cushioning (staged)
- Now: preference stored; copy kept plain and pressure-free
- Phase 10: opt-in auto-translation offer (§56); cultural similarity never boosts matching

## Visual impairment support (staged)
- Now: semantics + focus + live regions + contrast-checked group colors
- Still MANUAL: full screen-reader pass (NVDA/VoiceOver), 200% zoom check,
  color-independence check (selection must not rely on color alone — selected
  cards also deepen in shade; needs-page chips invert to white)

## Not claimed
No formal WCAG conformance statement until a human assistive-tech audit runs.
