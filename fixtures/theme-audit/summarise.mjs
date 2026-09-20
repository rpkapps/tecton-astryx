/*
 * Group an audit run's findings by kind and by the element they landed on.
 *
 *   node summarise.mjs <out>/results.json [--ids]
 *
 * `--ids` lists every example behind each row instead of one example.
 */
import fs from 'node:fs';

const file = process.argv[2];
const showIds = process.argv.includes('--ids');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const add = (map, key, value) => {
  const list = map.get(key) ?? [];
  list.push(value);
  map.set(key, list);
};

const byKind = new Map();
for (const result of data.results) {
  for (const f of result.structural ?? []) {
    add(byKind, f.kind, {...f, id: result.id});
  }
  for (const f of result.focus ?? []) {
    add(byKind, `focus:${f.kind}`, {...f, id: result.id});
  }
  for (const e of result.errors ?? []) {
    // Normalise so the same failure does not read as many.
    const key = e
      .replace(/named \S+/, 'named <name>')
      .split('\n')[0]
      .slice(0, 90);
    add(byKind, 'error', {id: result.id, label: key});
  }
}

const byKindCount = [...byKind].sort((a, b) => b[1].length - a[1].length);

console.log(`examples: ${data.examples}`);
console.log(
  `with findings: ${
    data.results.filter(
      r => (r.structural?.length ?? 0) + (r.focus?.length ?? 0) > 0,
    ).length
  }`,
);
console.log(
  `type-scale differences (not findings): ${data.results.reduce(
    (n, r) => n + (r.typography?.length ?? 0),
    0,
  )}`,
);

for (const [kind, list] of byKindCount) {
  const labels = new Map();
  for (const f of list) add(labels, f.label ?? f.tag ?? '-', f);
  console.log(
    `\n### ${kind} — ${list.length} across ${new Set(list.map(f => f.id)).size} examples`,
  );
  for (const [label, items] of [...labels].sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    const sample = items[0];
    const detail =
      sample.tecton !== undefined
        ? ` (T ${sample.tecton} vs N ${sample.neutral}${sample.variants ? ` [${sample.variants}]` : ''})`
        : sample.contrast !== undefined
          ? ` (contrast ${sample.contrast} on ${sample.colour ?? ''})`
          : sample.clipBy
            ? ` (clipped by ${sample.clipBy})`
            : '';
    const ids = [...new Set(items.map(f => f.id))];
    console.log(
      `  ${String(items.length).padStart(4)}  ${label}${detail}  ${
        showIds ? ids.join(', ') : `e.g. ${ids[0]}`
      }`,
    );
  }
}
