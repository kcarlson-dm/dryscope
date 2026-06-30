## v0.26.2 — 2026-06-23
- Shower bench labels: Tread (LF) + Riser (SF).

## v0.26.1 — 2026-06-23
- Shower bench prints as one combined estimate line (run + rise in the note).

## v0.26.0 — 2026-06-23
- Shower bench: single row with Run (LF) + Rise (SF) inputs.

## v0.25.0 — 2026-06-23
- Shower bench moved to bathing fixtures as a demo-only type: solid-surface top (LF) + tile face (SF). Old Demo bench field retired/auto-migrated.

## v0.24.0 — 2026-06-23
- Shower wall panels (per panel) added to bathing fixtures; shower door folded into the bathing control. Save/load round-trip fix.

## v0.23.2 — 2026-06-23
- PDF page numbers stamped as 'Page X of N' on every physical sheet (fixes overflow/mislabel).

## v0.23.1 — 2026-06-23
- Bathing fixtures default row in bathrooms; click-to-add notes on every line (placeholder never prints).

## v0.23.0 — 2026-06-23
- Consolidated repeatable Bathing Fixtures control (tub / jacuzzi / shower pan, material + action). Jacuzzi adds EA + SF-deck tiers. Template prices null.

## v0.22.1 — 2026-06-23
- Notes are always click-to-edit on the estimate (toggle removed).

## v0.22.0 — 2026-06-23
- Shower Pan / Base fixture added (fiberglass & cast iron, 3-tier); template prices null until you set them.
- Editable line notes on the estimate preview.

## v0.21.0 — 2026-06-04
- Synced to DRYscope v0.21.0 (config-driven sections, model-derived pricing, P-Trap fields).
- Template model rebuilt: full 97-item catalog, all prices null until set by your pricing pass.

# Starter Kit — Changelog

## v0.17.2 — 2026-06-03
- Kit regenerated from DRYscope v0.17.2: full 94-item catalog (rooms with Safety/Stabilization/Fixtures/Demo/Cleaning/Equipment sections, typed flooring & drywall rows, supply lines, fire line, subs, tooltips) — **all prices zeroed**.
- New prompt flow: 01 company + tax (state-aware, official sources, ZIP candidates) → 02 pricing **choice: manual or ODAPM** (getodapm.github.io) → 03 free deploy via drag-and-drop GitHub Pages.
- Tax is a required, pricing-independent step; `taxLookup` is repointed to your state's official locator during setup.
