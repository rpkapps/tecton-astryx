/**
 * The ported example blocks, as a lazily-loaded registry.
 *
 * `apps/docs/examples/components/<Dir>/<Name>.tsx` exports one component named
 * after the file stem. The audit mounts them one at a time, so the glob is
 * lazy: a page load pulls in exactly the module it was asked for.
 */
const modules = import.meta.glob<Record<string, unknown>>(
  '../../../apps/docs/examples/components/*/*.tsx',
);

export interface ExampleEntry {
  /** `<Dir>/<Name>`, the id the audit addresses an example by. */
  readonly id: string;
  /** The exported component's name — usually, but not always, the file stem. */
  readonly name: string;
  readonly load: () => Promise<Record<string, unknown>>;
}

/**
 * The component an example module exports.
 *
 * Nearly every file exports its own stem, but a few do not
 * (`Avatar/AvatarGroup.tsx` exports `AvatarGroupBlock`, so the name does not
 * collide with the component it demonstrates), so the stem is a preference
 * rather than a rule.
 */
export function pickComponent(
  module: Record<string, unknown>,
  name: string,
): unknown {
  if (typeof module[name] === 'function') return module[name];
  for (const [key, value] of Object.entries(module)) {
    if (typeof value === 'function' && /^[A-Z]/.test(key)) return value;
  }
  return undefined;
}

export const examples: readonly ExampleEntry[] = Object.entries(modules)
  .map(([path, load]) => {
    const parts = path.split('/');
    const name = parts[parts.length - 1].replace(/\.tsx$/, '');
    const dir = parts[parts.length - 2];
    return {id: `${dir}/${name}`, name, load};
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const exampleIds: readonly string[] = examples.map(entry => entry.id);
