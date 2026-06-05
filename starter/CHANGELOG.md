## v0.21.0 — 2026-06-04
- Synced to DRYscope v0.21.0 (config-driven sections, model-derived pricing, P-Trap fields).
- Template model rebuilt: full 97-item catalog, all prices null until set by your pricing pass.

# Starter Kit — Changelog

## v0.17.2 — 2026-06-03
- Kit regenerated from DRYscope v0.17.2: full 94-item catalog (rooms with Safety/Stabilization/Fixtures/Demo/Cleaning/Equipment sections, typed flooring & drywall rows, supply lines, fire line, subs, tooltips) — **all prices zeroed**.
- New prompt flow: 01 company + tax (state-aware, official sources, ZIP candidates) → 02 pricing **choice: manual or ODAPM** (getodapm.github.io) → 03 free deploy via drag-and-drop GitHub Pages.
- Tax is a required, pricing-independent step; `taxLookup` is repointed to your state's official locator during setup.
