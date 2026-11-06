import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

// Reconcile the supplied vocabulary with the live dictionary; never replace it
// with the reconstructed historical preview from the bundle.
const root = new URL('../', import.meta.url);
const file = new URL('assets/marain/js/dict.js', root);
const bundle = JSON.parse(fs.readFileSync(new URL('assets/marain/expansion/draft-v1.json', root), 'utf8'));
let source = fs.readFileSync(file, 'utf8');
const scope = {};
vm.runInNewContext(source, scope, {filename: fileURLToPath(file)});
const dictionary = scope.dict;
const additions = [];
const preserved = [];
const grouped = new Map();
for (const item of bundle.entries) {
  if (!grouped.has(item.marain)) grouped.set(item.marain, {...item, synonyms: []});
  grouped.get(item.marain).synonyms.push(item.english);
}
for (const entry of grouped.values()) {
  if (entry.marain === bundle.override.new_form) continue;
  if (Object.hasOwn(dictionary, entry.marain)) {
    const current = dictionary[entry.marain];
    if (!entry.synonyms.includes(current.gloss)) throw new Error(`Conflicting meaning for ${entry.marain}`);
    preserved.push(entry.marain);
    continue;
  }
  additions.push([entry.marain, {
    pos: 'pos', gloss: entry.english,
    def: `${entry.english} [provisional Marain coinage]`,
    en: entry.synonyms, status: entry.status,
    source: 'Marain vocabulary expansion draft-v1 (2026-11-02)',
    domain: entry.domain, segmentation: entry.segmentation, note: entry.notes,
    expansion_version: bundle.version
  }]);
}
const replacement = {
  pos: 'conjunction', gloss: 'or',
  def: 'or (coordinating conjunction; user-selected replacement for HAyep)',
  en: ['or'], status: 'user-prescribed-replacement',
  source: 'Marain vocabulary expansion draft-v1 (2026-11-02)', replaces: 'HAyep'
};
if (dictionary.HAyep) {
  if (dictionary.HAyep.gloss !== 'or' || dictionary.Hay) throw new Error('Conflicting or replacement');
  const old = /^"HAyep":.*$/m;
  if (!old.test(source)) throw new Error('Expected a standalone HAyep entry');
  source = source.replace(old, '"Hay": ' + JSON.stringify(replacement) + ',');
} else if (dictionary.Hay?.gloss !== 'or') throw new Error('Missing or replacement');
if (additions.length) {
  const end = source.lastIndexOf('};');
  if (end < 0) throw new Error('Missing dictionary terminator');
  source = source.slice(0, end).trimEnd() + ',\n' + additions.map(([key, value]) => JSON.stringify(key) + ': ' + JSON.stringify(value)).join(',\n') + '\n};\n';
}
fs.writeFileSync(file, source);
console.log(JSON.stringify({added: additions.length, preserved, replacement: 'Hay'}));
