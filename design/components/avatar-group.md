# AvatarGroup

## Sources
- `018_components-avatargroup__mixed-content.png`
- `019_components-avatargroup__overflow.png`
- `021_components-avatargroup__size-variants.png`

## Anatomy
1. **Stack of Avatars** — circular avatars laid out left to right, each one **overlapping the previous** by a fixed amount. The later avatar sits *on top* of the earlier one (z-order increases left→right), and each avatar carries a **ring/notch cut in the page-background colour** so the overlap reads as a crisp crescent gap rather than two touching circles.
2. **Overflow counter** — the final item in the row is another circular avatar of identical size showing `+N` (e.g. "+2", "+3", "+4", "+5", "+6") in the same accent fill and dark text as the text avatars.
3. Children may be any Avatar content type — image, text initials, icon fallback — mixed freely in one group (story 018 shows photo, "AB", photo, person icon, then "+2").

The group is right-aligned in these stories (the stack grows leftwards from a right edge), which may just be the story layout.

## Variants
No named "variant" axis. The configurable axes shown are:
- **max** (children shown before collapsing): `max=5`, `max=4`, `max=3`, `max=2`, each with 7 children — producing +3, +4, +5, +6 respectively. So `max` counts the visible real avatars and the +N bubble is additional (max=5 → 4 initials + "+3"… note: with max=5 and 7 children the page renders AB, CD, EF, GH and "+3", i.e. **the overflow bubble occupies one of the max slots**).
- **spacing**: `medium` and `small` (named in 021's row labels as "40px / medium", "40px / small" etc.).
  - `medium` — modest overlap; adjacent circles overlap by roughly 25–30% of their diameter.
  - `small` — tighter overlap, roughly 40–45% of the diameter, so the row is visibly narrower for the same number of avatars.

## Sizes
Same size scale as Avatar: **40px, 32px, 24px, 18px** (all four shown crossed with both spacings in 021, for eight rows total). The +N bubble matches the avatar size exactly and its digits scale down with the group.

## States
No state columns (no hover/focus/disabled). The only behavioural axis is overflow collapsing.

## Shape and spacing
- All avatars in the group stories are **circular** (no rounded/square group shown).
- Negative horizontal margin creates the overlap; the exact pitch differs by the spacing prop.
- Each avatar has a background-coloured ring of ~2px around it that produces the visible separation where circles overlap.
- The +N bubble is flush with the stack, using the same overlap.

## Typography
`+N` label uses the same face and size as avatar initials for that size (≈16px at 40px, down to ≈8px at 18px), regular weight, dark on accent.

## Colour notes
- All avatars and the +N bubble in these stories use the **saffron/tan accent** (~#d3986e) with near-black glyphs — the demo does not vary accent within a group except for the photo children.
- The separator ring is the page background ~#1a171b, not a lighter grey.

## Notable details
- Page headings, quoted verbatim: "Mixed Content - Images, text, and icon avatars", "Overflow - +N behavior at different max values", "Size Variants - All sizes by spacing options". Row captions read "max=5 with 7 children", "max=4 with 7 children", "max=3 with 7 children", "max=2 with 7 children", and "40px / medium", "32px / medium", "24px / medium", "18px / medium", "40px / small", "32px / small", "24px / small", "18px / small".
- The +N bubble is styled as a **peer avatar**, not as a muted/neutral chip — it takes the same accent fill as the real avatars.
- No tooltip/popover on the overflow is visible in the static captures.
