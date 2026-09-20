/**
 * The type-level half of the Tecton theme.
 *
 * A theme may add values to a component's own vocabulary — two more button
 * emphases, a fifth banner status, a lime badge, eight text types the base
 * scale has no slot for. Those are extensions of the component's API, declared
 * through `defineTheme`, and the CSS for all of them comes out of the theme
 * build. What does not come out of the theme build is a declaration a consumer
 * can type-check against for every one of them: the compiler's augmentation
 * lookup expects a `<Component><Prop>Map` interface, and the extension point
 * for text types is a differently shaped one.
 *
 * So they are declared here, in one module, and this module is **published**:
 * `variant="text-only"` and `type="mediumData"` are things a Tecton
 * application writes, so its editor has to know about them. `src/theme/public.ts`
 * imports it for the side effect, which is what puts it in the type graph of
 * `@tecton/react` and `@tecton/react/theme`.
 *
 * The module specifiers below are rewritten to the vendored copy when the
 * package is built, exactly like every other import of the component system.
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
