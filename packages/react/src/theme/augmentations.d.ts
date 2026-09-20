/**
 * The type-level half of the Tecton theme.
 *
 * The theme adds names to the component vocabulary underneath — two button
 * emphases, a fifth banner status, a lime badge — and eight custom text types
 * for the Tecton variants the base type scale has no slot for. The theme
 * compiler emits the CSS for all of them, and the declarations for the
 * variants, but its augmentation lookup expects a `<Component><Prop>Map`
 * interface and the extension point for text types is a differently shaped one,
 * so the text types are declared here. The variants are declared here too, so
 * that `src/` type-checks before a build has run rather than only after it.
 *
 * This file is internal: it is not emitted into `dist/`, because nothing a
 * consumer writes names these — Tecton's components map their own vocabulary
 * onto them.
 */
export {};

declare module '@astryxdesign/core/theme' {
  interface CustomTextTypes {
    mediumStrong: true;
    smallStrong: true;
    tiny: true;
    largeData: true;
    mediumData: true;
    smallData: true;
    actionMedium: true;
    actionSmall: true;
  }
}

declare module '@astryxdesign/core/Button' {
  interface ButtonVariantMap {
    outlined: true;
    'text-only': true;
  }
}

declare module '@astryxdesign/core/Banner' {
  interface BannerStatusMap {
    neutral: true;
  }
}

declare module '@astryxdesign/core/Badge' {
  interface BadgeVariantMap {
    lime: true;
  }
}
