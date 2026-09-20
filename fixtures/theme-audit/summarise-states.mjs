/*
 * Group a state-audit run's findings by kind, control and state.
 *
 *   node summarise-states.mjs <out>/results.json [--ids]
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
const errors = new Map();
let controls = 0;
for (const result of data.results) {
  controls += result.controls ?? 0;
  for (const finding of result.findings ?? []) {
    add(byKind, finding.kind, finding);
  }
  for (const error of result.errors ?? []) {
    add(errors, error.split('\n')[0].slice(0, 90), result.id);
  }
}

console.log(`examples: ${data.examples}`);
console.log(`stateful controls found: ${controls}`);
console.log(
  `examples with findings: ${
    data.results.filter(r => (r.findings?.length ?? 0) > 0).length
  }`,
);

for (const [kind, list] of [...byKind].sort(
  (a, b) => b[1].length - a[1].length,
)) {
  console.log(
    `\n### ${kind} — ${list.length} across ${new Set(list.map(f => f.id)).size} examples`,
  );
  const rows = new Map();
  for (const finding of list) {
    add(rows, `${finding.control}/${finding.state}/${finding.label}`, finding);
  }
  for (const [key, items] of [...rows].sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    const sample = items[0];
    const detail =
      sample.ratio !== undefined
        ? ` (${sample.ink} ${sample.ratio}:1 need ${sample.need}, ${sample.colour} on ${sample.on})`
        : '';
    const ids = [...new Set(items.map(f => f.id))];
    console.log(
      `  ${String(items.length).padStart(4)}  ${key}${detail}  ${
        showIds ? ids.join(', ') : `e.g. ${ids[0]}`
      }`,
    );
  }
}

if (errors.size > 0) {
  console.log(`\n### errors`);
  for (const [message, ids] of errors) {
    console.log(
      `  ${String(ids.length).padStart(4)}  ${message}  e.g. ${ids[0]}`,
    );
  }
}
