# Foundation Javadoc sync to CarolimoneHome

## Scope

Copied the complete Plugin DevLib Javadoc from `D:/NewIDEAProjects/PluginDevLib/devlib_v6/javadoc/` into `docs/javadocs/foundation/` in the CarolimoneHome website repository.

- Synchronized all 463 files and verified the destination is an exact mirror of the source Javadoc.
- The package pages now live under `top/brmc/devlib/`; no `org.mineacademy.fo` names or `org/mineacademy/fo` paths remain.
- The document title/branding reads `Plugin DevLib`; the website's Foundation section entry and route remain unchanged at `pages/javadoc-content.html` -> `docs/javadocs/foundation/index.html`.

## Validation

- Verified the new namespace appears in 414 generated files and all 463 files match the source.
- Checked 18,659 local links containing `top/brmc/devlib`: 0 broken targets.
- Confirmed no standalone `Foundation` branding remains inside the generated Javadoc.

## Git status

The Javadoc sync and this report are local working-tree changes only. They have not been committed or pushed. Existing untracked documentation files in the website repository were left untouched.
