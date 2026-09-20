# Icon

## Sources
- `059_components-icon__icon-gallery.png` (tall page, 3200×4160)

## Anatomy
A single glyph. The gallery renders each icon in a bordered tile with the icon centred above its PascalCase component name.

## Variants
The gallery's own control reads **Variant: `Outlined` | `Filled`** (a two-segment toggle; `Outlined` is selected in the capture, so only outlined glyphs are visible).

## Sizes
The gallery's control reads **Size: `Small (16px)` | `Medium (20px)` | `Large (24px)`** (Medium selected in the capture). So the icon size scale is literally 16 / 20 / 24 px.

## States
No state axis — Icon is a pure display primitive and inherits its colour from context (it renders near-white `#f7f6f8` in the gallery).

## Shape and spacing
Icons are drawn on a square box at the nominal size with roughly 1.5px stroke weight in the outlined variant; corners and joins are rounded. Stroke-based, not filled shapes (in the Outlined variant).

## Typography
Not applicable. Gallery tile captions are ~13px regular.

## Colour notes
- Icons render monochrome near-white by default.
- **Exception:** `StrataIcon` is rendered in **red** (a layered-stack glyph in ~#c0392b/red) in the gallery — the only multi/non-inherit-coloured icon visible.

## Notable details
### Prose on the page, quoted verbatim
> "Use Tecton icons for compact visual cues in controls, navigation, status, and domain objects. This gallery contains 131 custom icons mapped from the Tecton Figma design system, with outlined and filled variants plus small, medium, and large sizes."

> **Variants** — "Outlined and filled icon variants support different emphasis levels and surface treatments."

> **Sizes** — "Small, medium, and large sizes align icons with compact controls, standard buttons, and larger display contexts."

> **Search** — "Use the gallery controls to find available domain, navigation, and status icons."

The page heading is "Tecton Icons".

### The gallery UI itself
Above the grid: a "Search icons" TextField (outlined, empty), a "Variant" two-segment toggle and a "Size" three-segment toggle — i.e. the gallery is itself a demonstration of ToggleButtonGroup and TextField.

### Full icon list (131 names, in gallery order)
AddCircleIcon, AddIcon, AddPinIcon, AnnotateIcon, AppsIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon,
CancelCircleIcon, CaretCollapseIcon, CaretUpDownIcon, CheckCircleIcon, CheckCircleOpenIcon, CheckIcon, CheckboxIcon, CheckboxOutlineBlankIcon, ChevronDownIcon,
ChevronDownSmallIcon, ChevronLeftIcon, ChevronLeftSmallIcon, ChevronRightIcon, ChevronRightSmallIcon, ChevronUpIcon, ChevronUpSmallIcon, ChristmasTreeIcon, CloseIcon,
CloseSmallIcon, Co2LeafIcon, CodeIcon, CollapseContentIcon, ControlsIcon, CopyIcon, CrownIcon, CubeIcon, DatabaseIcon,
DeleteIcon, DesignIcon, DiamondMarkIcon, DiscoveryIcon, DragIndicatorIcon, DrillBitIcon, EditSquareIcon, ElectricityIcon, EngineeringIcon,
ErrorIcon, ExpandContentIcon, ExportUploadIcon, FacilityIcon, FaultIcon, FilterIcon, FolderIcon, FolderNewIcon, FolderOpenIcon,
FrameworksIcon, GeobodiesIcon, GeostructureIcon, GridViewIcon, HistoryIcon, HomeIcon, HorizonIcon, ImageIcon, IndeterminateCheckboxIcon,
InfoIcon, InspectIcon, KanbanIcon, LayersIcon, LineWeightIcon, LinkIcon, LinkOffIcon, ListIcon, LockIcon,
LockOpenIcon, LogCurveIcon, MapIcon, MenuIcon, MicrophoneIcon, MoneyIcon, MoreVertIcon, NodeIcon, NotificationsIcon,
NumericIcon, OilRigOffshoreIcon, OpenInNewIcon, PanToolIcon, PanelIcon, PersonIcon, PlayIcon, PreviewIcon, ProjectIcon,
PulseIcon, RadioButtonIcon, RedoIcon, RemoveCircleIcon, RemoveIcon, ReportsAnalyticsIcon, RiskSkullIcon, Robot2Icon, RockFormationsIcon,
RotateIcon, RulerIcon, SearchIcon, SeismicIcon, SelectCursorIcon, SelectIcon, SettingsIcon, SliceIcon, SortEnabledIcon,
SplitscreenIcon, StrataIcon, SurfaceIcon, SwapIcon, TargetIcon, ThreeDIcon, TrajectoryIcon, TrendIcon, UndoIcon,
ValveIcon, VelocityModelIcon, ViewColumnIcon, ViewModuleIcon, VisibilityIcon, VisibilityOffIcon, WarningIcon, WaterIcon, WellIcon,
WellPickIcon, WellPlanIcon, WindowIcon, ZoomInIcon, ZoomOutIcon

### Domain observation
A large share of the set is **subsurface / energy domain specific** — DrillBitIcon, FaultIcon, GeobodiesIcon, GeostructureIcon, HorizonIcon, LogCurveIcon, OilRigOffshoreIcon, RiskSkullIcon, RockFormationsIcon, SeismicIcon, StrataIcon, SurfaceIcon, TrajectoryIcon, ValveIcon, VelocityModelIcon, WellIcon, WellPickIcon, WellPlanIcon, Co2LeafIcon, DiamondMarkIcon, FacilityIcon, ElectricityIcon, WaterIcon. These have **no equivalent in a generic icon library** and must be carried over as custom SVGs.
