# Colors

> Transcribed verbatim from `screenshots/114_foundations-colors__overview.png` (rendered in dark mode). No values were invented, renamed or corrected.

Tecton color tokens are generated from Token Studio into React theme paths and CSS variables. Use this page to trace a token across all three names.

## Usage

Each row maps the Figma or Token Studio source token to the preferred React theme path and the framework-neutral CSS variable. Product React code should use the theme path; non-MUI consumers should use the CSS variable.

| Card | Guidance | Example | Link |
| --- | --- | --- | --- |
| Source tokens | Use semantic source paths when comparing generated values back to Token Studio or Figma. | `semantic.color.text.text` | Open source token files |
| React and MUI | Use theme.palette.tecton.* inside sx callbacks, styled components, and component overrides. | `theme.palette.tecton.text.primary` | Open MUI runtime files |
| CSS consumers | Use generated CSS variables for vanilla CSS, Angular, Tailwind, PrimeNG, and other adapters. | `var(--tecton-color-text-primary)` | Open generated output files |

### How to read these tables

- Columns are exactly the columns the page renders: **Token**, **Value**, **Source token**, **React theme path**, **CSS variable**.
- A trailing `…` is text that is cut off in the capture. In the *Source token*, *React theme path* and *Token* columns the page itself renders an ellipsis; in the *CSS variable* column the text runs past the right edge of the captured table (nothing is rendered beyond x=2813 of the 3200px-wide screenshot), so only the visible prefix is recorded.
- The page shows a single (dark-mode) value per token. There is no light column on this page.
- Readings marked `(?)` are uncertain.

## Text

Core text colors used for product UI copy, metadata, placeholders, disabled text, and inverse surfaces.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **Text primary**<br>Default product UI text. | `#f6f5f8` | `semantic.color.text.text` | `theme.palette.tecton.text.primary` | `--tecton-color-text-primary` |
| **Text secondary**<br>Secondary labels, descriptions, and met… | `#a7a2ac` | `semantic.color.text.subtleText` | `theme.palette.tecton.text.secondary` | `--tecton-color-text-seconda…` |
| **Text disabled**<br>Disabled text. | `#545356` | `semantic.color.text.disabledText` | `theme.palette.tecton.text.disabled` | `--tecton-color-text-disable…` |
| **Text placeholder**<br>Input placeholder text. | `#6a696c` | `semantic.color.text.placeholderText` | `theme.palette.tecton.text.placeholder` | `--tecton-color-text-placeho…` |
| **Text inverse**<br>Text on inverse or high-contrast surface… | `#131214` | `semantic.color.text.inverseText` | `theme.palette.tecton.text.inverse` | `--tecton-color-text-inverse` |
| **Text subtlest**<br>Lowest-emphasis readable text. | `#89848e` | `semantic.color.text.subtlestText` | `theme.palette.tecton.text.subtlest` | `--tecton-color-text-subtles…` |

_6 rows._

## Surfaces

Background and divider colors used for pages, elevated surfaces, cards, menus, popovers, and separators.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **Background default**<br>App and page background. | `#1d1c1f` | `semantic.color.surface.base.background` | `theme.palette.tecton.background.defau…` | `--tecton-color-bg-default` |
| **Background paper**<br>Paper-like surface background. | `#131214` | `semantic.color.surface.elevation 1.backgro…` | `theme.palette.tecton.background.paper` | `--tecton-color-bg-paper` |
| **Background elevated**<br>Cards, menus, popovers, and raised doc… | `#131214` | `semantic.color.surface.elevation 1.backgro…` | `theme.palette.tecton.background.eleva…` | `--tecton-color-bg-elevated` |
| **Divider medium**<br>Default divider or border. | `#57515c` | `semantic.color.divider.fill` | `theme.palette.tecton.divider.medium` | `--tecton-color-divider-medi…` |
| **Divider subtle**<br>Low-emphasis separators. | `#342f39` | `semantic.color.divider.subtleFill` | `theme.palette.tecton.divider.subtle` | `--tecton-color-divider-subt…` |
| **Divider strong**<br>High-emphasis separators. | `#6e6873` | `semantic.color.divider.strongFill` | `theme.palette.tecton.divider.strong` | `--tecton-color-divider-stro…` |

_6 rows._

## Actions

Color roles for filled, outlined, text-only, disabled, and focus states. Prefer component props when a Tecton component owns this behavior.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **primary Background**<br>Default filled action surface. | `#5d4d68` | `semantic.color.roles.action.primary.backgr…` | `theme.palette.tecton.primary.main` | `--tecton-color-action-prima…` |
| **primary Text**<br>Default text on the action surface. | `#e5e0eb` | `semantic.color.roles.action.primary.contra…` | `theme.palette.tecton.primary.contrast…` | `--tecton-color-action-prima…` |
| **primary Hover background**<br>Mouse hover surface. | `#74647f` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.hover` | `--tecton-color-action-prima…` |
| **primary Focus background**<br>Keyboard focus surface. | `#74647f` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.focused` | `--tecton-color-action-prima…` |
| **primary Press background**<br>Mouse down or pressed surface. | `#80708b` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.pressed` | `--tecton-color-action-prima…` |
| **primary Active background**<br>Selected or toggled surface. | `#80708b` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.activated` | `--tecton-color-action-prima…` |
| **primary Hover text**<br>Text on hover. | `#ffffff` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.hoverText` | `--tecton-color-action-prima…` |
| **primary Focus text**<br>Text on keyboard focus. | `#ffffff` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.focusedT…` | `--tecton-color-action-prima…` |
| **primary Press text**<br>Text while pressed. | `#ffffff` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.pressedT…` | `--tecton-color-action-prima…` |
| **primary Active text**<br>Text while selected or toggled. | `#ffffff` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.activate…` | `--tecton-color-action-prima…` |
| **primary Adornment**<br>Default icon or adornment color. | `#beb1c8` | `semantic.color.roles.action.primary.adornm…` | `theme.palette.tecton.primary.adornment` | `--tecton-color-action-prima…` |
| **primary Hover adornment**<br>Icon or adornment on hover. | `#ffffffb3` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.hoverAdo…` | `--tecton-color-action-prima…` |
| **primary Focus adornment**<br>Icon or adornment on focus. | `#ffffffb3` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.focusAdo…` | `--tecton-color-action-prima…` |
| **primary Press adornment**<br>Icon or adornment while pressed. | `#ffffffcc` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.pressAdo…` | `--tecton-color-action-prima…` |
| **primary Active adornment**<br>Icon or adornment while selected. | `#ffffffcc` | `semantic.color.roles.action.primary.states…` | `theme.palette.tecton.primary.activeAd…` | `--tecton-color-action-prima…` |
| **secondary Background**<br>Default filled action surface. | `#3a343e` | `semantic.color.roles.action.secondary.back…` | `theme.palette.tecton.secondary.main` | `--tecton-color-action-secon…` |
| **secondary Text**<br>Default text on the action surface. | `#bab3c0` | `semantic.color.roles.action.secondary.cont…` | `theme.palette.tecton.secondary.contra…` | `--tecton-color-action-secon…` |
| **secondary Hover background**<br>Mouse hover surface. | `#514659` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.hover` | `--tecton-color-action-secon…` |
| **secondary Focus background**<br>Keyboard focus surface. | `#514659` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.focused` | `--tecton-color-action-secon…` |
| **secondary Press background**<br>Mouse down or pressed surface. | `#5a4f62` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.pressed` | `--tecton-color-action-secon…` |
| **secondary Active background**<br>Selected or toggled surface. | `#5a4f62` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.activa…` | `--tecton-color-action-secon…` |
| **secondary Hover text**<br>Text on hover. | `#e4e0ea` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.hoverT…` | `--tecton-color-action-secon…` |
| **secondary Focus text**<br>Text on keyboard focus. | `#e4e0ea` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.focuse…` | `--tecton-color-action-secon…` |
| **secondary Press text**<br>Text while pressed. | `#efecf3` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.presse…` | `--tecton-color-action-secon…` |
| **secondary Active text**<br>Text while selected or toggled. | `#efebf4` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.activa…` | `--tecton-color-action-secon…` |
| **secondary Adornment**<br>Default icon or adornment color. | `#9a91a2` | `semantic.color.roles.action.secondary.ador…` | `theme.palette.tecton.secondary.adornm…` | `--tecton-color-action-secon…` |
| **secondary Hover adornment**<br>Icon or adornment on hover. | `#cbc4d5` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.hoverA…` | `--tecton-color-action-secon…` |
| **secondary Focus adornment**<br>Icon or adornment on focus. | `#cbc4d5` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.focusA…` | `--tecton-color-action-secon…` |
| **secondary Press adornment**<br>Icon or adornment while pressed. | `#cac5d2` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.pressA…` | `--tecton-color-action-secon…` |
| **secondary Active adornment**<br>Icon or adornment while selected. | `#cdc4d8` | `semantic.color.roles.action.secondary.stat…` | `theme.palette.tecton.secondary.active…` | `--tecton-color-action-secon…` |
| **tertiary Background**<br>Default filled action surface. | `#00000000` | `semantic.color.roles.action.tertiary.backg…` | `theme.palette.tecton.tertiary.main` | `--tecton-color-action-terti…` |
| **tertiary Text**<br>Default text on the action surface. | `#bab3c0` | `semantic.color.roles.action.tertiary.contr…` | `theme.palette.tecton.tertiary.contras…` | `--tecton-color-action-terti…` |
| **tertiary Hover background**<br>Mouse hover surface. | `#3a343e` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.hover` | `--tecton-color-action-terti…` |
| **tertiary Focus background**<br>Keyboard focus surface. | `#3a343e` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.focused` | `--tecton-color-action-terti…` |
| **tertiary Press background**<br>Mouse down or pressed surface. | `#433d47` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.pressed` | `--tecton-color-action-terti…` |
| **tertiary Active background**<br>Selected or toggled surface. | `#433d47` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.activat…` | `--tecton-color-action-terti…` |
| **tertiary Hover text**<br>Text on hover. | `#cac5d2` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.hoverTe…` | `--tecton-color-action-terti…` |
| **tertiary Focus text**<br>Text on keyboard focus. | `#cac5d2` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.focused…` | `--tecton-color-action-terti…` |
| **tertiary Press text**<br>Text while pressed. | `#e3e0e8` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.pressed…` | `--tecton-color-action-terti…` |
| **tertiary Active text**<br>Text while selected or toggled. | `#e3e0e8` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.activat…` | `--tecton-color-action-terti…` |
| **tertiary Adornment**<br>Default icon or adornment color. | `#9a91a2` | `semantic.color.roles.action.tertiary.adorn…` | `theme.palette.tecton.tertiary.adornme…` | `--tecton-color-action-terti…` |
| **tertiary Hover adornment**<br>Icon or adornment on hover. | `#bcb2c4` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.hoverAd…` | `--tecton-color-action-terti…` |
| **tertiary Focus adornment**<br>Icon or adornment on focus. | `#bcb2c4` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.focusAd…` | `--tecton-color-action-terti…` |
| **tertiary Press adornment**<br>Icon or adornment while pressed. | `#cac5d2` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.pressAd…` | `--tecton-color-action-terti…` |
| **tertiary Active adornment**<br>Icon or adornment while selected. | `#cbc4d5` | `semantic.color.roles.action.tertiary.state…` | `theme.palette.tecton.tertiary.activeA…` | `--tecton-color-action-terti…` |
| **outlined Background**<br>Default outlined action surface. | `#00000000` | `semantic.color.roles.action.outline.backgr…` | `theme.palette.tecton.outlined.bg` | `--tecton-color-action-outli…` |
| **outlined Border**<br>Default outlined action border. | `#5a4f62` | `semantic.color.roles.action.outline.border` | `theme.palette.tecton.outlined.border` | `--tecton-color-action-outli…` |
| **outlined Strong border**<br>High-emphasis outlined border. | `#aaa1b2` | `semantic.color.roles.action.outline.strong…` | `theme.palette.tecton.outlined.strongB…` | `--tecton-color-action-outli…` |
| **outlined Text**<br>Default outlined action text. | `#aaa1b2` | `semantic.color.roles.action.outline.contra…` | `theme.palette.tecton.outlined.contras…` | `--tecton-color-action-outli…` |
| **outlined Hover background**<br>Outlined hover surface. | `#433d47` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.bgHover` | `--tecton-color-action-outli…` |
| **outlined Focus background**<br>Outlined focus surface. | `#433d47` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.bgFocus…` | `--tecton-color-action-outli…` |
| **outlined Press background**<br>Outlined pressed surface. | `#4e4853` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.bgPress…` | `--tecton-color-action-outli…` |
| **outlined Active background**<br>Outlined selected surface. | `#4e4853` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.bgActiv…` | `--tecton-color-action-outli…` |
| **outlined Hover border**<br>Border on hover. | `#cac5d2` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.borderH…` | `--tecton-color-action-outli…` |
| **outlined Focus border**<br>Border on focus. | `#cac5d2` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.borderF…` | `--tecton-color-action-outli…` |
| **outlined Press border**<br>Border while pressed. | `#d8d5de` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.borderP…` | `--tecton-color-action-outli…` |
| **outlined Active border**<br>Border while selected. | `#d9d5e1` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.borderA…` | `--tecton-color-action-outli…` |
| **outlined Hover text**<br>Outlined text on hover. | `#e4e0ea` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.hoverTe…` | `--tecton-color-action-outli…` |
| **outlined Focus text**<br>Outlined text on focus. | `#e4e0ea` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.focused…` | `--tecton-color-action-outli…` |
| **outlined Press text**<br>Outlined text while pressed. | `#efecf3` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.pressed…` | `--tecton-color-action-outli…` |
| **outlined Active text**<br>Outlined text while selected. | `#efebf4` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.activat…` | `--tecton-color-action-outli…` |
| **outlined Adornment**<br>Default outlined icon color. | `#8b8293` | `semantic.color.roles.action.outline.adornm…` | `theme.palette.tecton.outlined.adornme…` | `--tecton-color-action-outli…` |
| **outlined Hover adornment**<br>Outlined icon on hover. | `#cbc4d5` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.hoverAd…` | `--tecton-color-action-outli…` |
| **outlined Focus adornment**<br>Outlined icon on focus. | `#cbc4d5` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.focusAd…` | `--tecton-color-action-outli…` |
| **outlined Press adornment**<br>Outlined icon while pressed. | `#d8d5de` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.pressAd…` | `--tecton-color-action-outli…` |
| **outlined Active adornment**<br>Outlined icon while selected. | `#d9d5e1` | `semantic.color.roles.action.outline.states…` | `theme.palette.tecton.outlined.activeA…` | `--tecton-color-action-outli…` |
| **textOnly Text**<br>Default text-only action text. | `#9a91a2` | `semantic.color.roles.action.textOnly.text` | `theme.palette.tecton.textOnly.text` | `--tecton-color-action-text-…` |
| **textOnly Focus background**<br>Focus-only background for text actions. | `#00000080` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.bgFocus…` | `--tecton-color-action-text-…` |
| **textOnly Hover text**<br>Text-only hover text. | `#bcb2c4` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.hoverTe…` | `--tecton-color-action-text-…` |
| **textOnly Focus text**<br>Text-only focus text. | `#bcb2c4` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.focusTe…` | `--tecton-color-action-text-…` |
| **textOnly Press text**<br>Text-only pressed text. | `#beb1c8` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.pressTe…` | `--tecton-color-action-text-…` |
| **textOnly Active text**<br>Text-only selected text. | `#beb1c8` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.activeT…` | `--tecton-color-action-text-…` |
| **textOnly Adornment**<br>Default text-only icon color. | `#716679` | `semantic.color.roles.action.textOnly.adorn…` | `theme.palette.tecton.textOnly.adornme…` | `--tecton-color-action-text-…` |
| **textOnly Hover adornment**<br>Text-only icon on hover. | `#8e8199` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.hoverAd…` | `--tecton-color-action-text-…` |
| **textOnly Focus adornment**<br>Text-only icon on focus. | `#8e8199` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.focusAd…` | `--tecton-color-action-text-…` |
| **textOnly Press adornment**<br>Text-only icon while pressed. | `#90809e` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.pressAd…` | `--tecton-color-action-text-…` |
| **textOnly Active adornment**<br>Text-only icon while selected. | `#90809e` | `semantic.color.roles.action.textOnly.state…` | `theme.palette.tecton.textOnly.activeA…` | `--tecton-color-action-text-…` |
| **disabled Filled background**<br>Disabled filled action surface. | `#00000066` | `semantic.color.roles.disabled.filled.disab…` | `theme.palette.tecton.disabled.filledBg` | `--tecton-color-disabled-fil…` |
| **disabled Filled text**<br>Disabled filled action text. | `#545356` | `semantic.color.roles.disabled.filled.disab…` | `theme.palette.tecton.disabled.filledT…` | `--tecton-color-disabled-fil…` |
| **disabled Filled adornment**<br>Disabled filled icon color. | `#403f42` | `semantic.color.roles.disabled.filled.disab…` | `theme.palette.tecton.disabled.filledA…` | `--tecton-color-disabled-fil…` |
| **disabled Outline background**<br>Disabled outlined action surface. | `#00000000` | `semantic.color.roles.disabled.outline.disa…` | `theme.palette.tecton.disabled.outline…` | `--tecton-color-disabled-out…` |
| **disabled Outline border**<br>Disabled outlined border. | `#323134` | `semantic.color.roles.disabled.outline.disa…` | `theme.palette.tecton.disabled.outline…` | `--tecton-color-disabled-out…` |
| **disabled Outline text**<br>Disabled outlined text. | `#4b4a4d` | `semantic.color.roles.disabled.outline.disa…` | `theme.palette.tecton.disabled.outline…` | `--tecton-color-disabled-out…` |
| **disabled Outline adornment**<br>Disabled outlined icon color. | `#403f42` | `semantic.color.roles.disabled.outline.disa…` | `theme.palette.tecton.disabled.outline…` | `--tecton-color-disabled-out…` |
| **disabled Text-only text**<br>Disabled text-only action text. | `#4b4a4d` | `semantic.color.roles.disabled.textOnly.sta…` | `theme.palette.tecton.disabled.textOnl…` | `--tecton-color-disabled-tex…` |
| **disabled Text-only adornment**<br>Disabled text-only icon color. | `#403f42` | `semantic.color.roles.disabled.textOnly.sta…` | `theme.palette.tecton.disabled.textOnl…` | `--tecton-color-disabled-tex…` |
| **Focus ring**<br>Keyboard focus outline. | `#ff52a8` | `semantic.color.focusOutline` | `theme.palette.tecton.focusRing` | `--tecton-color-focus-ring` |

_87 rows._

## Status

Status colors for success, error, warning, info, and neutral treatments.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **success Main**<br>Primary status color. | `#78c692` | `semantic.color.roles.success.main` | `theme.palette.tecton.success.main` | `--tecton-color-status-succe…` |
| **success Bright**<br>High-visibility status accent. | `#ace4bd` | `semantic.color.roles.success.bright` | `theme.palette.tecton.success.bright` | `--tecton-color-status-succe…` |
| **success Muted**<br>Low-emphasis status accent. | `#217846` | `semantic.color.roles.success.muted` | `theme.palette.tecton.success.muted` | `--tecton-color-status-succe…` |
| **success Filled background**<br>Filled status surface. | `#4fa66f` | `semantic.color.roles.success.filled.backgr…` | `theme.palette.tecton.success.filled.b…` | `--tecton-color-status-succe…` |
| **success Filled text**<br>Text on filled status surface. | `#001607` | `semantic.color.roles.success.filled.contra…` | `theme.palette.tecton.success.filled.c…` | `--tecton-color-status-succe…` |
| **success Filled adornment**<br>Icon on filled status surface. | `#001607` | `semantic.color.roles.success.filled.adornm…` | `theme.palette.tecton.success.filled.a…` | `--tecton-color-status-succe…` |
| **success Filled hover background**<br>Filled status hover surface. | `#61b67f` | `semantic.color.roles.success.filled.states…` | `theme.palette.tecton.success.filled.h…` | `--tecton-color-status-succe…` |
| **success Filled focus background**<br>Filled status focus surface. | `#61b67f` | `semantic.color.roles.success.filled.states…` | `theme.palette.tecton.success.filled.f…` | `--tecton-color-status-succe…` |
| **success Filled press background**<br>Filled status pressed surface. | `#78c692` | `semantic.color.roles.success.filled.states…` | `theme.palette.tecton.success.filled.p…` | `--tecton-color-status-succe…` |
| **success Filled active background**<br>Filled status selected surface. | `#78c692` | `semantic.color.roles.success.filled.states…` | `theme.palette.tecton.success.filled.a…` | `--tecton-color-status-succe…` |
| **success Outline background**<br>Outlined status surface. | `#00000000` | `semantic.color.roles.success.outline.backg…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline strong border**<br>Outlined status emphasis border. | `#78c692` | `semantic.color.roles.success.outline.stron…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline text**<br>Outlined status text. | `#92d6a8` | `semantic.color.roles.success.outline.contr…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline adornment**<br>Outlined status icon color. | `#78c692` | `semantic.color.roles.success.outline.adorn…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline hover border**<br>Outlined status border on hover. | `#61b67f` | `semantic.color.roles.success.outline.state…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline focus border**<br>Outlined status border on focus. | `#61b67f` | `semantic.color.roles.success.outline.state…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline press border**<br>Outlined status border while pressed. | `#92d6a8` | `semantic.color.roles.success.outline.state…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **success Outline active border**<br>Outlined status border while selected. | `#92d6a8` | `semantic.color.roles.success.outline.state…` | `theme.palette.tecton.success.outline.…` | `--tecton-color-status-succe…` |
| **error Main**<br>Primary status color. | `#c16e6c` | `semantic.color.roles.error.main` | `theme.palette.tecton.error.main` | `--tecton-color-status-error…` |
| **error Bright**<br>High-visibility status accent. | `#e3a6a6` | `semantic.color.roles.error.bright` | `theme.palette.tecton.error.bright` | `--tecton-color-status-error…` |
| **error Muted**<br>Low-emphasis status accent. | `#832d28` | `semantic.color.roles.error.muted` | `theme.palette.tecton.error.muted` | `--tecton-color-status-error…` |
| **error Filled background**<br>Filled status surface. | `#c16e6c` | `semantic.color.roles.error.filled.backgrou…` | `theme.palette.tecton.error.filled.bac…` | `--tecton-color-status-error…` |
| **error Filled text**<br>Text on filled status surface. | `#2e0000` | `semantic.color.roles.error.filled.contrast…` | `theme.palette.tecton.error.filled.con…` | `--tecton-color-status-error…` |
| **error Filled adornment**<br>Icon on filled status surface. | `#2e0000` | `semantic.color.roles.error.filled.adornment` | `theme.palette.tecton.error.filled.ado…` | `--tecton-color-status-error…` |
| **error Filled hover background**<br>Filled status hover surface. | `#d89291` | `semantic.color.roles.error.filled.states.h…` | `theme.palette.tecton.error.filled.hov…` | `--tecton-color-status-error…` |
| **error Filled focus background**<br>Filled status focus surface. | `#d89291` | `semantic.color.roles.error.filled.states.f…` | `theme.palette.tecton.error.filled.foc…` | `--tecton-color-status-error…` |
| **error Filled press background**<br>Filled status pressed surface. | `#e3a6a6` | `semantic.color.roles.error.filled.states.p…` | `theme.palette.tecton.error.filled.pre…` | `--tecton-color-status-error…` |
| **error Filled active background**<br>Filled status selected surface. | `#e3a6a6` | `semantic.color.roles.error.filled.states.a…` | `theme.palette.tecton.error.filled.act…` | `--tecton-color-status-error…` |
| **error Outline background**<br>Outlined status surface. | `#00000000` | `semantic.color.roles.error.outline.backgro…` | `theme.palette.tecton.error.outline.ba…` | `--tecton-color-status-error…` |
| **error Outline strong border**<br>Outlined status emphasis border. | `#cc7f7d` | `semantic.color.roles.error.outline.strongB…` | `theme.palette.tecton.error.outline.st…` | `--tecton-color-status-error…` |
| **error Outline text**<br>Outlined status text. | `#cc7f7d` | `semantic.color.roles.error.outline.contras…` | `theme.palette.tecton.error.outline.co…` | `--tecton-color-status-error…` |
| **error Outline adornment**<br>Outlined status icon color. | `#cc7f7d` | `semantic.color.roles.error.outline.adornme…` | `theme.palette.tecton.error.outline.ad…` | `--tecton-color-status-error…` |
| **error Outline hover border**<br>Outlined status border on hover. | `#d89291` | `semantic.color.roles.error.outline.states.…` | `theme.palette.tecton.error.outline.ho…` | `--tecton-color-status-error…` |
| **error Outline focus border**<br>Outlined status border on focus. | `#d89291` | `semantic.color.roles.error.outline.states.…` | `theme.palette.tecton.error.outline.fo…` | `--tecton-color-status-error…` |
| **error Outline press border**<br>Outlined status border while pressed. | `#ecbbbc` | `semantic.color.roles.error.outline.states.…` | `theme.palette.tecton.error.outline.pr…` | `--tecton-color-status-error…` |
| **error Outline active border**<br>Outlined status border while selected. | `#e3a6a6` | `semantic.color.roles.error.outline.states.…` | `theme.palette.tecton.error.outline.ac…` | `--tecton-color-status-error…` |
| **warning Main**<br>Primary status color. | `#f9a308` | `semantic.color.roles.warning.main` | `theme.palette.tecton.warning.main` | `--tecton-color-status-warni…` |
| **warning Bright**<br>High-visibility status accent. | `#fddf91` | `semantic.color.roles.warning.bright` | `theme.palette.tecton.warning.bright` | `--tecton-color-status-warni…` |
| **warning Muted**<br>Low-emphasis status accent. | `#995b04` | `semantic.color.roles.warning.muted` | `theme.palette.tecton.warning.muted` | `--tecton-color-status-warni…` |
| **warning Filled background**<br>Filled status surface. | `#e59306` | `semantic.color.roles.warning.filled.backgr…` | `theme.palette.tecton.warning.filled.b…` | `--tecton-color-status-warni…` |
| **warning Filled text**<br>Text on filled status surface. | `#1d0f01` | `semantic.color.roles.warning.filled.contra…` | `theme.palette.tecton.warning.filled.c…` | `--tecton-color-status-warni…` |
| **warning Filled adornment**<br>Icon on filled status surface. | `#1d0f01` | `semantic.color.roles.warning.filled.adornm…` | `theme.palette.tecton.warning.filled.a…` | `--tecton-color-status-warni…` |
| **warning Filled hover background**<br>Filled status hover surface. | `#f9a308` | `semantic.color.roles.warning.filled.states…` | `theme.palette.tecton.warning.filled.h…` | `--tecton-color-status-warni…` |
| **warning Filled focus background**<br>Filled status focus surface. | `#f9a308` | `semantic.color.roles.warning.filled.states…` | `theme.palette.tecton.warning.filled.f…` | `--tecton-color-status-warni…` |
| **warning Filled press background**<br>Filled status pressed surface. | `#fbbc3b` | `semantic.color.roles.warning.filled.states…` | `theme.palette.tecton.warning.filled.p…` | `--tecton-color-status-warni…` |
| **warning Filled active background**<br>Filled status selected surface. | `#fbbc3b` | `semantic.color.roles.warning.filled.states…` | `theme.palette.tecton.warning.filled.a…` | `--tecton-color-status-warni…` |
| **warning Outline background**<br>Outlined status surface. | `#00000000` | `semantic.color.roles.warning.outline.backg…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline strong border**<br>Outlined status emphasis border. | `#f9a308` | `semantic.color.roles.warning.outline.stron…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline text**<br>Outlined status text. | `#fbbc3b` | `semantic.color.roles.warning.outline.contr…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline adornment**<br>Outlined status icon color. | `#f9a308` | `semantic.color.roles.warning.outline.adorn…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline hover border**<br>Outlined status border on hover. | `#e59306` | `semantic.color.roles.warning.outline.state…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline focus border**<br>Outlined status border on focus. | `#e59306` | `semantic.color.roles.warning.outline.state…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline press border**<br>Outlined status border while pressed. | `#fbbc3b` | `semantic.color.roles.warning.outline.state…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **warning Outline active border**<br>Outlined status border while selected. | `#fbbc3b` | `semantic.color.roles.warning.outline.state…` | `theme.palette.tecton.warning.outline.…` | `--tecton-color-status-warni…` |
| **info Main**<br>Primary status color. | `#8ca7de` | `semantic.color.roles.info.main` | `theme.palette.tecton.info.main` | `--tecton-color-status-info` |
| **info Bright**<br>High-visibility status accent. | `#b7c9eb` | `semantic.color.roles.info.bright` | `theme.palette.tecton.info.bright` | `--tecton-color-status-info-…` |
| **info Muted**<br>Low-emphasis status accent. | `#3766c4` | `semantic.color.roles.info.muted` | `theme.palette.tecton.info.muted` | `--tecton-color-status-info-…` |
| **info Filled background**<br>Filled status surface. | `#6086d2` | `semantic.color.roles.info.filled.background` | `theme.palette.tecton.info.filled.back…` | `--tecton-color-status-info-…` |
| **info Filled text**<br>Text on filled status surface. | `#0a1324` | `semantic.color.roles.info.filled.contrastT…` | `theme.palette.tecton.info.filled.cont…` | `--tecton-color-status-info-…` |
| **info Filled adornment**<br>Icon on filled status surface. | `#1d3566` | `semantic.color.roles.info.filled.adornment` | `theme.palette.tecton.info.filled.ador…` | `--tecton-color-status-info-…` |
| **info Filled hover background**<br>Filled status hover surface. | `#7495d8` | `semantic.color.roles.info.filled.states.ho…` | `theme.palette.tecton.info.filled.hove…` | `--tecton-color-status-info-…` |
| **info Filled focus background**<br>Filled status focus surface. | `#7495d8` | `semantic.color.roles.info.filled.states.fo…` | `theme.palette.tecton.info.filled.focu…` | `--tecton-color-status-info-…` |
| **info Filled press background**<br>Filled status pressed surface. | `#8ca7de` | `semantic.color.roles.info.filled.states.pr…` | `theme.palette.tecton.info.filled.pres…` | `--tecton-color-status-info-…` |
| **info Filled active background**<br>Filled status selected surface. | `#8ca7de` | `semantic.color.roles.info.filled.states.ac…` | `theme.palette.tecton.info.filled.acti…` | `--tecton-color-status-info-…` |
| **info Outline background**<br>Outlined status surface. | `#00000000` | `semantic.color.roles.info.outline.backgrou…` | `theme.palette.tecton.info.outline.bac…` | `--tecton-color-status-info-…` |
| **info Outline strong border**<br>Outlined status emphasis border. | `#a0b6e4` | `semantic.color.roles.info.outline.strongBo…` | `theme.palette.tecton.info.outline.str…` | `--tecton-color-status-info-…` |
| **info Outline text**<br>Outlined status text. | `#b7c9eb` | `semantic.color.roles.info.outline.contrast…` | `theme.palette.tecton.info.outline.con…` | `--tecton-color-status-info-…` |
| **info Outline adornment**<br>Outlined status icon color. | `#a0b6e4` | `semantic.color.roles.info.outline.adornment` | `theme.palette.tecton.info.outline.ado…` | `--tecton-color-status-info-…` |
| **info Outline hover border**<br>Outlined status border on hover. | `#8ca7de` | `semantic.color.roles.info.outline.states.h…` | `theme.palette.tecton.info.outline.hov…` | `--tecton-color-status-info-…` |
| **info Outline focus border**<br>Outlined status border on focus. | `#8ca7de` | `semantic.color.roles.info.outline.states.f…` | `theme.palette.tecton.info.outline.foc…` | `--tecton-color-status-info-…` |
| **info Outline press border**<br>Outlined status border while pressed. | `#b7c9eb` | `semantic.color.roles.info.outline.states.p…` | `theme.palette.tecton.info.outline.pre…` | `--tecton-color-status-info-…` |
| **info Outline active border**<br>Outlined status border while selected. | `#b7c9eb` | `semantic.color.roles.info.outline.states.a…` | `theme.palette.tecton.info.outline.act…` | `--tecton-color-status-info-…` |
| **neutral Main**<br>Primary status color. | `#959497` | `semantic.color.roles.neutral.main` | `theme.palette.tecton.neutral.main` | `--tecton-color-status-neutr…` |
| **neutral Bright**<br>High-visibility status accent. | `#c8c7ca` | `semantic.color.roles.neutral.bright` | `theme.palette.tecton.neutral.bright` | `--tecton-color-status-neutr…` |
| **neutral Muted**<br>Low-emphasis status accent. | `#6a696c` | `semantic.color.roles.neutral.muted` | `theme.palette.tecton.neutral.muted` | `--tecton-color-status-neutr…` |
| **neutral Filled background**<br>Filled status surface. | `#2c2b2e` | `semantic.color.roles.neutral.filled.backgr…` | `theme.palette.tecton.neutral.filled.b…` | `--tecton-color-status-neutr…` |
| **neutral Filled text**<br>Text on filled status surface. | `#c8c7ca` | `semantic.color.roles.neutral.filled.contra…` | `theme.palette.tecton.neutral.filled.c…` | `--tecton-color-status-neutr…` |
| **neutral Filled adornment**<br>Icon on filled status surface. | `#b6b5b8` | `semantic.color.roles.neutral.filled.adornm…` | `theme.palette.tecton.neutral.filled.a…` | `--tecton-color-status-neutr…` |
| **neutral Filled hover background**<br>Filled status hover surface. | `#4b4a4d` | `semantic.color.roles.neutral.filled.states…` | `theme.palette.tecton.neutral.filled.h…` | `--tecton-color-status-neutr…` |
| **neutral Filled focus background**<br>Filled status focus surface. | `#4b4a4d` | `semantic.color.roles.neutral.filled.states…` | `theme.palette.tecton.neutral.filled.f…` | `--tecton-color-status-neutr…` |
| **neutral Filled press background**<br>Filled status pressed surface. | `#545356` | `semantic.color.roles.neutral.filled.states…` | `theme.palette.tecton.neutral.filled.p…` | `--tecton-color-status-neutr…` |
| **neutral Filled active background**<br>Filled status selected surface. | `#545356` | `semantic.color.roles.neutral.filled.states…` | `theme.palette.tecton.neutral.filled.a…` | `--tecton-color-status-neutr…` |
| **neutral Outline background**<br>Outlined status surface. | `#00000000` | `semantic.color.roles.neutral.outline.backg…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline strong border**<br>Outlined status emphasis border. | `#b6b5b8` | `semantic.color.roles.neutral.outline.stron…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline text**<br>Outlined status text. | `#c8c7ca` | `semantic.color.roles.neutral.outline.contr…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline adornment**<br>Outlined status icon color. | `#b6b5b8` | `semantic.color.roles.neutral.outline.adorn…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline hover border**<br>Outlined status border on hover. | `#a5a4a7` | `semantic.color.roles.neutral.outline.state…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline focus border**<br>Outlined status border on focus. | `#a5a4a7` | `semantic.color.roles.neutral.outline.state…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline press border**<br>Outlined status border while pressed. | `#c8c7ca` | `semantic.color.roles.neutral.outline.state…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |
| **neutral Outline active border**<br>Outlined status border while selected. | `#c8c7ca` | `semantic.color.roles.neutral.outline.state…` | `theme.palette.tecton.neutral.outline.…` | `--tecton-color-status-neutr…` |

_90 rows._

## Accents

Small set of accent fills and readable text colors for avatar-like and categorical treatments.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **lemon fill**<br>Accent fill color. | `#9e9813` | `semantic.color.accent.lemon.main` | `theme.palette.tecton.accent.lemon.fill` | `--tecton-color-accent-lemon…` |
| **lemon text**<br>Text on accent fill. | `#d6ce1a` | `semantic.color.accent.lemon.contrastText` | `theme.palette.tecton.accent.lemon.con…` | `--tecton-color-accent-lemon…` |
| **graphite fill**<br>Accent fill color. | `#98939d` | `semantic.color.accent.graphite.main` | `theme.palette.tecton.accent.graphite.…` | `--tecton-color-accent-graph…` |
| **graphite text**<br>Text on accent fill. | `#cac6ce` | `semantic.color.accent.graphite.contrastText` | `theme.palette.tecton.accent.graphite.…` | `--tecton-color-accent-graph…` |
| **pink fill**<br>Accent fill color. | `#c2867a` | `semantic.color.accent.pink.main` | `theme.palette.tecton.accent.pink.fill` | `--tecton-color-accent-pink-…` |
| **pink text**<br>Text on accent fill. | `#e1c3bd` | `semantic.color.accent.pink.contrastText` | `theme.palette.tecton.accent.pink.cont…` | `--tecton-color-accent-pink-…` |
| **saffron fill**<br>Accent fill color. | `#cb8553` | `semantic.color.accent.saffron.main` | `theme.palette.tecton.accent.saffron.f…` | `--tecton-color-accent-saffr…` |
| **saffron text**<br>Text on accent fill. | `#e5c2a9` | `semantic.color.accent.saffron.contrastText` | `theme.palette.tecton.accent.saffron.c…` | `--tecton-color-accent-saffr…` |
| **lime fill**<br>Accent fill color. | `#84a138` | `semantic.color.accent.lime.main` | `theme.palette.tecton.accent.lime.fill` | `--tecton-color-accent-lime-…` |
| **lime text**<br>Text on accent fill. | `#b0d54e` | `semantic.color.accent.lime.contrastText` | `theme.palette.tecton.accent.lime.cont…` | `--tecton-color-accent-lime-…` |
| **blue fill**<br>Accent fill color. | `#8ca7de` | `semantic.color.accent.blue.main` | `theme.palette.tecton.accent.blue.fill` | `--tecton-color-accent-blue-…` |
| **blue text**<br>Text on accent fill. | `#b7c9eb` | `semantic.color.accent.blue.contrastText` | `theme.palette.tecton.accent.blue.cont…` | `--tecton-color-accent-blue-…` |
| **azure fill**<br>Accent fill color. | `#29a6a6` | `semantic.color.accent.azure.main` | `theme.palette.tecton.accent.azure.fill` | `--tecton-color-accent-azure…` |
| **azure text**<br>Text on accent fill. | `#68d9d9` | `semantic.color.accent.azure.contrastText` | `theme.palette.tecton.accent.azure.con…` | `--tecton-color-accent-azure…` |

_14 rows._

## Component Tokens

Component-scoped color tokens. The preferred public path is theme.palette.tecton.component.*; deprecated shortcuts are intentionally omitted.

| Token | Value | Source token | React theme path | CSS variable |
| --- | --- | --- | --- | --- |
| **table / cell / background**<br>Component-scoped color token. Prefer … | `#1d1c1f` | `semantic.component.table.cell.background` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **table / cell / background-alt**<br>Component-scoped color token. Prefer … | `#323134` | `semantic.component.table.cell.backgroundAlt` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **table / cell / states / active-back…**<br>Component-scoped color token. Prefer … | `#4e4853` | `semantic.component.table.cell.states.activ…` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **table / cell / states / hover-back…**<br>Component-scoped color token. Prefer … | `#3a343e` | `semantic.component.table.cell.states.hover…` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **table / header / background**<br>Component-scoped color token. Prefer … | `#433d47` | `semantic.component.table.header.background` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **table / footer**<br>Component-scoped color token. Prefer … | `#28232c` | `semantic.component.table.footer` | `theme.palette.tecton.component.table.…` | `--tecton-color-component-ta…` |
| **top-nav / solid-background**<br>Component-scoped color token. Prefer … | `#000000` | `semantic.component.topNav.solidBackground` | `theme.palette.tecton.component.topNav…` | `--tecton-color-component-to…` |
| **top-nav / contrast-text**<br>Component-scoped color token. Prefer … | `#ffffff80` | `semantic.component.topNav.contrastText` | `theme.palette.tecton.component.topNav…` | `--tecton-color-component-to…` |
| **top-nav / adornment**<br>Component-scoped color token. Prefer … | `#90809e` | `semantic.component.topNav.adornment` | `theme.palette.tecton.component.topNav…` | `--tecton-color-component-to…` |
| **input / filled / background**<br>Component-scoped color token. Prefer … | `#28232c` | `semantic.component.input.filled.background` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / contrast-text**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.filled.contrastTe…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / hover-bac…**<br>Component-scoped color token. Prefer … | `#342f39` | `semantic.component.input.filled.states.hov…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / focus-bac…**<br>Component-scoped color token. Prefer … | `#342f39` | `semantic.component.input.filled.states.foc…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / press-bac…**<br>Component-scoped color token. Prefer … | `#3a343e` | `semantic.component.input.filled.states.pre…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / active-bac…**<br>Component-scoped color token. Prefer … | `#3a343e` | `semantic.component.input.filled.states.act…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / hover-con…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.filled.states.hov…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / focus-con…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.filled.states.foc…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / press-con…**<br>Component-scoped color token. Prefer … | `#e3e0e8` | `semantic.component.input.filled.states.pre…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / active-con…**<br>Component-scoped color token. Prefer … | `#d8d6dc` | `semantic.component.input.filled.states.act…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / hover-ado…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.filled.states.hov…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / focus-ado…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.filled.states.foc…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / press-ador…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.filled.states.pre…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / states / active-ado…**<br>Component-scoped color token. Prefer … | `#bab3c0` | `semantic.component.input.filled.states.act…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / adornment**<br>Component-scoped color token. Prefer … | `#8b8293` | `semantic.component.input.filled.adornment` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / value-text**<br>Component-scoped color token. Prefer … | `#f7f6f8` | `semantic.component.input.filled.valueText` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / filled / placeholder-text**<br>Component-scoped color token. Prefer … | `#98939d` | `semantic.component.input.filled.placeholde…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / background**<br>Component-scoped color token. Prefer … | `#00000000` | `semantic.component.input.outlined.backgrou…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / border**<br>Component-scoped color token. Prefer … | `#57515c` | `semantic.component.input.outlined.border` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / contrast-text**<br>Component-scoped color token. Prefer … | `#98939d` | `semantic.component.input.outlined.contrast…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / value-text**<br>Component-scoped color token. Prefer … | `#f7f6f8` | `semantic.component.input.outlined.valueText` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / placeholder-text**<br>Component-scoped color token. Prefer … | `#89848e` | `semantic.component.input.outlined.placehol…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / adornment**<br>Component-scoped color token. Prefer … | `#8b8293` | `semantic.component.input.outlined.adornment` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / active-…**<br>Component-scoped color token. Prefer … | `#1e1922` | `semantic.component.input.outlined.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / hover-…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.outlined.states.h…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / focus-…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.outlined.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / press-c…**<br>Component-scoped color token. Prefer … | `#e3e0e8` | `semantic.component.input.outlined.states.p…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / active-…**<br>Component-scoped color token. Prefer … | `#d8d5de` | `semantic.component.input.outlined.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / hover-…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.outlined.states.h…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / focus-…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.outlined.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / press-a…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.outlined.states.p…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / active-…**<br>Component-scoped color token. Prefer … | `#bab3c0` | `semantic.component.input.outlined.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / hover-…**<br>Component-scoped color token. Prefer … | `#a7a2ac` | `semantic.component.input.outlined.states.h…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / focus-…**<br>Component-scoped color token. Prefer … | `#a7a2ac` | `semantic.component.input.outlined.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / press-…**<br>Component-scoped color token. Prefer … | `#b8b4bc` | `semantic.component.input.outlined.states.p…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / active-…**<br>Component-scoped color token. Prefer … | `#b8b4bc` | `semantic.component.input.outlined.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / outlined / states / active-…**<br>Component-scoped color token. Prefer … | `#8b8293` | `semantic.component.input.outlined.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / contrast-text**<br>Component-scoped color token. Prefer … | `#98939d` | `semantic.component.input.textOnly.contrast…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / value-text**<br>Component-scoped color token. Prefer … | `#f7f6f8` | `semantic.component.input.textOnly.valueText` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / placeholder-te…**<br>Component-scoped color token. Prefer … | `#89848e` | `semantic.component.input.textOnly.placehol…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / adornment**<br>Component-scoped color token. Prefer … | `#8b8293` | `semantic.component.input.textOnly.adornment` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / focus-…**<br>Component-scoped color token. Prefer … | `#1e1922` | `semantic.component.input.textOnly.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / hover-…**<br>Component-scoped color token. Prefer … | `#cac6ce` | `semantic.component.input.textOnly.states.h…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / focus-…**<br>Component-scoped color token. Prefer … | `#cac6ce` | `semantic.component.input.textOnly.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / press-…**<br>Component-scoped color token. Prefer … | `#e3e1e7` | `semantic.component.input.textOnly.states.p…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / active…**<br>Component-scoped color token. Prefer … | `#d8d6dc` | `semantic.component.input.textOnly.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / hover-…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.textOnly.states.h…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / focus-…**<br>Component-scoped color token. Prefer … | `#aaa1b2` | `semantic.component.input.textOnly.states.f…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / press-…**<br>Component-scoped color token. Prefer … | `#cac5d2` | `semantic.component.input.textOnly.states.p…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **input / text-only / states / active…**<br>Component-scoped color token. Prefer … | `#bab3c0` | `semantic.component.input.textOnly.states.a…` | `theme.palette.tecton.component.input.…` | `--tecton-color-component-in…` |
| **avatar / fill**<br>Component-scoped color token. Prefer … | `#c2867a` | `semantic.component.avatar.fill` | `theme.palette.tecton.component.avatar…` | `--tecton-color-component-av…` |
| **avatar / contrast-text**<br>Component-scoped color token. Prefer … | `#131214` | `semantic.component.avatar.contrastText` | `theme.palette.tecton.component.avatar…` | `--tecton-color-component-av…` |
| **avatar / disabled-fill**<br>Component-scoped color token. Prefer … | `#545356` | `semantic.component.avatar.disabledFill` | `theme.palette.tecton.component.avatar…` | `--tecton-color-component-av…` |
| **badge / contrast-text**<br>Component-scoped color token. Prefer … | `#131214` | `semantic.component.badge.contrastText` | `theme.palette.tecton.component.badge.…` | `--tecton-color-component-ba…` |

_63 rows._
