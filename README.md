# marain-dictionary
A marain dictionary extension to the Marain dictionary 2.0. Based heavily on fan work.

Includes word and phrase translation, glyph display, base conversion, Culture
name generation, Orbital references, grammar notes, and browser speech support.
These are community tools and extensions, not a claim of complete Banks canon.
Existing provenance and attribution remain in the source and grammar documents;
the extraction does not change the licensing of included third-party material.

## Test and preview

Use Node 22 or later for `npm test` (no npm dependencies). With Ruby and Bundler:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000/marain/`. The minimal preview layout is independent
of the blog theme. Speech prefers an available local Welsh voice and retains
the existing ResponsiveVoice fallback; availability depends on the operating
system and network.

## Site integration

KO0I/KO0I.github.io pins this repository at `tools/marain-dictionary`. Its build
overlays `_pages/marain.markdown`, `_pages/lesson-rules.markdown`,
`_includes/marain-tts.html`, and `assets/marain/` into a temporary source tree.
The site supplies its own layouts and retains its shared fonts and lesson
images. Existing `/marain/`, `/lesson-rules/`, and asset URLs stay unchanged.
Publish tool commits before updating the site's submodule pointer.

## Extraction provenance

Extracted from `KO0I/KO0I.github.io` at
`49a5ef1b4ba835bbb5be60432f844fe01cde210c`. In a separate full clone,
`git-filter-repo` retained these paths, without renaming them:

```text
assets/marain/
assets/fonts/marain.woff
assets/fonts/Marain.ttf
images/marain-lessons/
_pages/marain.markdown
_pages/lesson-rules.markdown
_includes/marain-tts.html
tests/marain-phrases.test.cjs
tests/marain-orbitals.test.mjs
tests/culture-name-generator.test.mjs
.github/workflows/marain-tests.yml
```

Pass each path as `--path PATH` to `git-filter-repo` on a fresh clone of that
source commit, then rename the extracted branch to `main`. Relevant authorship
and commit messages survive; filtered commit hashes necessarily differ.
The pre-existing repository's initial README commit is retained through a
merge with `--allow-unrelated-histories`. The site repository history is intact.
