/**
 * `@tecton/react` — the Tecton design system for React.
 *
 * Applications import components from this entry point (or its subpaths) and
 * the single stylesheet `@tecton/react/styles.css`. Nothing else is required.
 *
 * Every component is also published as its own subpath —
 * `@tecton/react/Button`, `@tecton/react/Table` — for applications that would
 * rather not pull the whole surface through one module. The icon set lives at
 * `@tecton/react/icons` and the theme and tokens at `@tecton/react/theme`.
 */
export {TectonProvider} from './provider/TectonProvider.js';
export type {
  TectonProviderProps,
  TectonColorMode,
} from './provider/TectonProvider.js';
export {
  configureTectonRoot,
  type TectonScope,
  type ConfigureTectonRootOptions,
} from './provider/TectonProvider.js';

/* Actions --------------------------------------------------------------- */

export {Button} from './components/Button/index.js';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from './components/Button/index.js';
export {ButtonGroup} from './components/ButtonGroup/index.js';
export type {
  ButtonGroupProps,
  ButtonGroupOrientation,
} from './components/ButtonGroup/index.js';
export {Fab} from './components/Fab/index.js';
export type {
  FabProps,
  FabShape,
  FabVariant,
  FabElevation,
} from './components/Fab/index.js';
export {IconButton} from './components/IconButton/index.js';
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
} from './components/IconButton/index.js';
export {Link} from './components/Link/index.js';
export type {LinkProps, LinkUnderline} from './components/Link/index.js';
export {Menu} from './components/Menu/index.js';
export type {
  MenuProps,
  MenuEntry,
  MenuItem,
  MenuSection,
  MenuDivider,
  MenuVariant,
  MenuPlacement,
} from './components/Menu/index.js';
export {ToggleButton} from './components/ToggleButton/index.js';
export type {
  ToggleButtonProps,
  ToggleButtonSize,
} from './components/ToggleButton/index.js';
export {ToggleButtonGroup} from './components/ToggleButtonGroup/index.js';
export type {
  ToggleButtonGroupProps,
  ToggleButtonGroupItem,
  ToggleButtonGroupLayout,
} from './components/ToggleButtonGroup/index.js';

/* Forms ----------------------------------------------------------------- */

export {Autocomplete} from './components/Autocomplete/index.js';
export type {
  AutocompleteProps,
  AutocompleteOption,
} from './components/Autocomplete/index.js';
export {Checkbox} from './components/Checkbox/index.js';
export type {
  CheckboxProps,
  CheckboxValue,
} from './components/Checkbox/index.js';
export {CheckboxGroup} from './components/CheckboxGroup/index.js';
export type {
  CheckboxGroupProps,
  CheckboxGroupItem,
  CheckboxGroupDensity,
} from './components/CheckboxGroup/index.js';
export {Radio} from './components/Radio/index.js';
export type {RadioProps} from './components/Radio/index.js';
export {RadioGroup} from './components/RadioGroup/index.js';
export type {
  RadioGroupProps,
  RadioGroupOrientation,
} from './components/RadioGroup/index.js';
export {Select} from './components/Select/index.js';
export type {
  SelectProps,
  SelectAppearance,
  SelectItem,
  SelectOption,
  SelectSection,
  SelectDivider,
} from './components/Select/index.js';
export {Slider} from './components/Slider/index.js';
export type {
  SliderProps,
  SliderValue,
  SliderMark,
  SliderValueDisplay,
} from './components/Slider/index.js';
export {Switch} from './components/Switch/index.js';
export type {
  SwitchProps,
  SwitchLabelPosition,
} from './components/Switch/index.js';
export {TextArea} from './components/TextArea/index.js';
export type {TextAreaProps} from './components/TextArea/index.js';
export {TextField} from './components/TextField/index.js';
export type {
  TextFieldProps,
  TextFieldSize,
  TextFieldType,
} from './components/TextField/index.js';

/* Content and status ---------------------------------------------------- */

export {Alert} from './components/Alert/index.js';
export type {
  AlertProps,
  AlertStatus,
  AlertPlacement,
} from './components/Alert/index.js';
export {Avatar} from './components/Avatar/index.js';
export type {
  AvatarProps,
  AvatarShape,
  AvatarSize,
} from './components/Avatar/index.js';
export {AvatarGroup} from './components/AvatarGroup/index.js';
export type {AvatarGroupProps} from './components/AvatarGroup/index.js';
export {Badge} from './components/Badge/index.js';
export type {BadgeProps, BadgeVariant} from './components/Badge/index.js';
export {Chip} from './components/Chip/index.js';
export type {ChipProps, ChipSize, ChipColor} from './components/Chip/index.js';
export {ColorSwatch} from './components/ColorSwatch/index.js';
export type {ColorSwatchProps} from './components/ColorSwatch/index.js';
export {Icon} from './components/Icon/index.js';
export type {IconProps} from './components/Icon/index.js';
export {Progress} from './components/Progress/index.js';
export type {
  ProgressProps,
  ProgressVariant,
  ProgressTone,
  ProgressSize,
} from './components/Progress/index.js';
export {Tooltip} from './components/Tooltip/index.js';
export type {
  TooltipProps,
  TooltipPlacement,
  TooltipAlignment,
} from './components/Tooltip/index.js';

/* Data ------------------------------------------------------------------ */

export {List} from './components/List/index.js';
export type {
  ListProps,
  ListDensity,
  ListMarker,
} from './components/List/index.js';
export {ListItem} from './components/ListItem/index.js';
export type {ListItemProps} from './components/ListItem/index.js';
export {Table} from './components/Table/index.js';
export type {
  TableProps,
  TableColumn,
  TableColumnAlign,
  TableColumnWidth,
  TableDividers,
} from './components/Table/index.js';
export {TreeView} from './components/TreeView/index.js';
export type {
  TreeViewProps,
  TreeItem,
  TreeViewDensity,
} from './components/TreeView/index.js';

/* Navigation ------------------------------------------------------------ */

export {BreadcrumbItem} from './components/BreadcrumbItem/index.js';
export type {BreadcrumbItemProps} from './components/BreadcrumbItem/index.js';
export {Breadcrumbs} from './components/Breadcrumbs/index.js';
export type {
  BreadcrumbsProps,
  BreadcrumbsVariant,
} from './components/Breadcrumbs/index.js';
export {Tab} from './components/Tab/index.js';
export type {TabProps} from './components/Tab/index.js';
export {Tabs} from './components/Tabs/index.js';
export type {
  TabsProps,
  TabsLayout,
  TabsPattern,
} from './components/Tabs/index.js';

/* Surfaces and overlays ------------------------------------------------- */

export {Accordion} from './components/Accordion/index.js';
export type {AccordionProps} from './components/Accordion/index.js';
export {AccordionGroup} from './components/AccordionGroup/index.js';
export type {
  AccordionGroupProps,
  AccordionGroupType,
  AccordionGroupDensity,
} from './components/AccordionGroup/index.js';
export {Card} from './components/Card/index.js';
export type {
  CardProps,
  CardVariant,
  CardPadding,
} from './components/Card/index.js';
export {Dialog} from './components/Dialog/index.js';
export type {
  DialogProps,
  DialogConfirmation,
  DialogSize,
  DialogDismissal,
} from './components/Dialog/index.js';
export {Panel} from './components/Panel/index.js';
export type {PanelProps} from './components/Panel/index.js';
export {useToast} from './components/Toast/index.js';
export type {
  ToastPayload,
  ToastAction,
  ToastType,
  ShowToast,
  DismissToast,
} from './components/Toast/index.js';

/* Layout ---------------------------------------------------------------- */

export {Divider} from './components/Divider/index.js';
export type {DividerProps, DividerVariant} from './components/Divider/index.js';
export {Grid} from './components/Grid/index.js';
export type {GridProps, GridColumns} from './components/Grid/index.js';
export {HStack} from './components/HStack/index.js';
export type {HStackProps} from './components/HStack/index.js';
export {Stack} from './components/Stack/index.js';
export type {
  StackProps,
  SpaceStep,
  StackAlign,
  StackJustify,
} from './components/Stack/index.js';
export {VStack} from './components/VStack/index.js';
export type {VStackProps} from './components/VStack/index.js';

/* Type ------------------------------------------------------------------ */

export {Heading} from './components/Heading/index.js';
export type {
  HeadingProps,
  HeadingLevel,
  HeadingVariant,
} from './components/Heading/index.js';
export {Text} from './components/Text/index.js';
export type {
  TextProps,
  TextVariant,
  TextWeight,
  TextColor,
  TextElement,
} from './components/Text/index.js';

/* The generated pass-through components ---------------------------------- */

/**
 * Everything in `wrappers.manifest.json` that Tecton publishes unchanged —
 * generated by `scripts/generate-wrappers.mjs`, one export per component.
 */
export * from './generated/componentExports.js';

/* Shared types, icons and theme ------------------------------------------ */

export type {FieldStatus, ControlSize} from './types/field.js';

export {tectonIconNames} from './icons/names.js';
export type {TectonIconName} from './icons/names.js';
export type {
  TectonIconGlyph,
  TectonIconGlyphProps,
  TectonIconSize,
  TectonIconVariant,
} from './icons/glyph.js';
export type {TectonIconRef} from './icons/renderIcon.js';

export {tectonTheme, tectonIcons, tectonToken, tecton} from './theme/public.js';
export type {
  TectonTheme,
  TectonIconRegistry,
  TectonSemanticIconName,
  TectonTokenName,
  TectonTokens,
} from './theme/public.js';
