const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const scope = {};
for (const name of ['dict', 'alpha']) vm.runInNewContext(fs.readFileSync(path.join(root, `assets/marain/js/${name}.js`), 'utf8'), scope);
const bundle = JSON.parse(fs.readFileSync(path.join(root, 'assets/marain/expansion/draft-v1.json'), 'utf8'));

test('every supplied new form resolves with provenance and provisional labels', () => {
  for (const entry of bundle.entries) {
    const actual = scope.dict[entry.marain];
    assert.ok(actual, entry.marain);
    assert.ok(actual.gloss === entry.english || actual.en.includes(entry.english));
    if (entry.marain === 'Hay' || entry.marain === 'EnAG') continue;
    assert.match(actual.def, /provisional/);
    assert.equal(actual.status, entry.status);
    assert.equal(actual.note, entry.notes);
  }
  assert.equal(Object.values(scope.dict).filter(e => e.expansion_version === 'draft-v1').length, 926);
});

test('or replacement and current meaning distinctions survive reconciliation', () => {
  assert.equal(scope.dict.HAyep, undefined);
  assert.equal(scope.dict.Hay.gloss, 'or');
  assert.equal(scope.dict.EnAG.status, 'proposed-extension');
  assert.equal(scope.dict.to.gloss, 'they+sg');
  assert.equal(scope.dict.toh.gloss, 'port');
  assert.equal(scope.dict.rAbin.gloss, 'the-Culture');
  assert.ok(scope.dict.zesOm.en.includes('put'));
  assert.equal(scope.dict.zesO.expansion_version, undefined);
});

test('phrase lookup exposes expansion provenance to the reader', () => {
  const api = require('../assets/marain/js/phrase-translator.js')(scope.dict, scope.alpha);
  const result = api.translate('nebula');
  assert.ok(result.notes.some(note => /provisional coinage/.test(note)));
  assert.ok(result.alignment.some(item => /provisional vocabulary/.test(item.reason)));
});
