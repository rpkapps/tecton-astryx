/**
 * Put the compiled StyleX classes into the site's StyleX stylesheet.
 *
 * `@stylexjs/unplugin` compiles StyleX as modules are transformed and collects
 * the classes it extracted; writing them into a CSS asset is the job of the
 * extra hooks its Vite adapter adds on top of the universal plugin. Those hooks
 * do not survive the trip through `unplugin`'s Vite adapter, which forwards the
 * hooks it knows about and drops the rest — so the transform runs, the classes
 * are collected, and the stylesheet comes out empty.
 *
 * This is that last step, taken from the same collector. At the end of the
 * client build `src/styles/stylex.css` is replaced with the classes the build
 * compiled, and re-emitted rather than edited in place so that its file name is
 * a hash of what is in it: a reader whose browser cached yesterday's stylesheet
 * has to be handed a new URL, not the same one with new contents. The server
 * build is built afterwards and has the old name baked into the `<link>` it
 * renders, so it is pointed at the new one as it is bundled.
 */

/** The CSS asset the classes belong in: the site's own `stylex.css`. */
function findStylexAsset(bundle) {
  for (const [fileName, asset] of Object.entries(bundle)) {
    if (asset?.type !== 'asset') continue;
    if (/(^|\/)stylex-[^/]*\.css$/.test(fileName)) return [fileName, asset];
  }
  return [];
}

/** Point every chunk and asset in a bundle at the stylesheet's new name. */
function repoint(bundle, from, to) {
  for (const item of Object.values(bundle)) {
    if (item?.type === 'chunk' && typeof item.code === 'string') {
      item.code = item.code.split(from).join(to);
    } else if (item?.type === 'asset' && typeof item.source === 'string') {
      item.source = item.source.split(from).join(to);
    }
  }
}

/**
 * @param {{__stylexCollectCss?: () => string}} stylexPlugin the compiler plugin
 * @returns {import('vite').Plugin}
 */
export function stylexCssPlugin(stylexPlugin) {
  /** What the client build renamed the stylesheet to, for the server build. */
  let renamed;

  return {
    name: 'tecton:stylex-css',
    enforce: 'post',
    generateBundle(_options, bundle) {
      if (this.environment?.name !== 'client') {
        if (renamed) repoint(bundle, renamed.from, renamed.to);
        return;
      }

      const css = stylexPlugin.__stylexCollectCss?.();
      if (!css) return;
      const [fileName, asset] = findStylexAsset(bundle);
      if (!asset) {
        this.warn(
          'The build has no stylex.css asset, so the compiled StyleX classes were not written anywhere.',
        );
        return;
      }

      const source = `${asset.source}\n${css}`;
      const reference = this.emitFile({
        type: 'asset',
        name: 'stylex.css',
        source,
      });
      const next = this.getFileName(reference);
      if (!next || next === fileName) {
        asset.source = source;
        return;
      }
      repoint(bundle, fileName, next);
      delete bundle[fileName];
      renamed = {from: fileName, to: next};
    },
  };
}
