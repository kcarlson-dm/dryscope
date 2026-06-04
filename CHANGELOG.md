# Changelog — DRYscope

Version scheme: SemVer (MAJOR.MINOR.PATCH) with build date. MAJOR breaks saved quotes or the estimate format; MINOR adds features; PATCH is fixes/wording/pricing.

## v0.19.0 — 🚀 RELEASE (2026-06-04)
- **Equipment bug fixed (the $956 one):** a checked equipment box with blank Units/Days now bills at the placeholder default (1 × 1) instead of silently dropping off the estimate.
- **Baseboard** gets Detach Only ($1.95, default — matches accepted estimates) / Remove & Reinstall ($2.93) / Dispose ($0.55).
- **Stud walls & joists join the HEPA sandwich:** their SF feeds HEPA Light and antimicrobial, and when present they *replace* the Detailed pass quantity (detailed vacuum targets exposed framing).
- Backlog applied: duplicate-flag now checks the field exists in *this* room; film labeled per-SF; quote **MIGRATIONS scaffold** (versioned upgrades for saved quotes); model schema tagged `odapm/v1`; starter kit regenerated; "Requires Claude Pro" note in kit + ODAPM prompts.

## v0.18.0 — 🚀 RELEASE (2026-06-04) — Munie reconciliation
- **Fixture tiers re-anchored to an accepted estimate** (MUNIE-WTR): the flat **detach** price is now the Only/Dispose tier (tub $176.20, vanity $28.39/LF, appliances $85, toilet $77, sink $49.50, cabinets, countertops…); **Reinstall = detach × 1.5** (detach + reset labor). The old dispose seeds had under-billed detach work by 60–70%.
- **Water-category cleaning rates fixed:** Cat 1/2 HEPA Light 0.52/0.56, Detailed 1.02/1.09, wall clean 1.20/1.28 (Cat 3 keeps mold rates). Drywall flood-cut 2' corrected to 5.46/LF (the 10.75 was the 4' rate); insulation 1.10/SF.
- **Antimicrobial no longer doubles:** auto-quantity = actual affected area (floor + joists), not the walls+floor sum, per QC rule and accepted practice.


## v0.16.0 — 🚀 RELEASE (2026-06-03)
- Lead testing row aligned (hint moved below the boxes, like asbestos). Lay-flat ducting inputs width-capped.
- **~30 room-field tooltips added** via a data-driven pass that runs on every room build — Safety, Stabilization, Demo, Cleaning, and Equipment fields all carry ? bubbles now.
- ⚠ highlight fixed for real: the yellow is painted on the cells (row-level paint was being covered by the table striping), so the full line including its note is highlighted.

## v0.15.0 — 2026-06-03
- **Tooltips rebuilt as instant styled bubbles** (pure CSS, no flaky native delay) — dark callout with arrow on hover. Removed from ZIP and Date of Loss.
- **Basement** now carries the utility set (washer/dryer + water-heater/furnace disconnect flags).
- Stabilization disinfect hint moved into its tooltip (spacing fixed). ⚠ separate-estimate highlight now covers the full line including its note row.
- **Estimate columns renamed: REMOVE → REMOVAL, REPLACE → SERVICE** — display only; the math still maps 1:1 to the pricing model's rem/rep/mat shape.

## v0.14.0 — 2026-06-03
- **? bubbles everywhere:** tax & classification, testing, every Base Charges field, every equipment/filter checkbox, plus search results (hover any result to preview) — 35+ field tooltips and 44 catalog option descriptions added.
- **Dynamic tooltips on search-added items:** the bubble shows the item's description *and* the currently selected option's specifics, updating as you change the selection.
- **Collapse removed** (clean grid made it unnecessary); bold section/subsection titles kept.
- **⚠ separate-estimate sub lines** (water heater / furnace disconnects) now render **soft-yellow highlighted** on the estimate output.

## v0.13.0 — 2026-06-03
- **Fixtures laid out on a clean grid** (no more cramped wrapping); every fixture and key field has a **? bubble** with a plain-language mouseover description.
- **Supply lines:** bathtub added (2 lines); "leave connected" removed — capping is the floor, options are **Cap (default)** or **Cut & Cap**. Kitchen audited: sink/dishwasher/fridge covered; disposal & hoods are electrical, gas lines are licensed-plumber subs.
- **Stabilization grows:** Disinfect Extracted Areas (auto-fills from extraction SF), Block & Pad, and per-room Contents Manipulation; Base Charges now notes contents can be added per room.
- **Utility room professional disconnects:** water heater / furnace checkboxes add flagged ⚠ $0 lines — "licensed sub — SEPARATE ESTIMATE REQUIRED."

## v0.12.0 — 2026-06-03
- **Fixtures now have three actions:** Disconnect/Remove **Only**, Disconnect/Remove **& Reinstall**, **Dispose**.
- **Supply lines tied to their fixtures** (own pricing, not Xactimate's): toilet (1 line), sink (2), pedestal sink (2), dishwasher (1), fridge (1), washer (2) each show a dropdown — **Cap** ($16: disconnect, tape + fitting) or **Cut & Cap** ($53: shut off + drain house, cut and permanently cap). Quantities auto-multiply per fixture. Old generic water-line item retired.
- **Pedestal Sink** added as its own line item ($66 reinstall / $30 dispose, cost-model derived). **Countertops restored to Bathroom & Kitchen fixtures** (solid/granite + laminate with actions, tile dispose) — still search-only in other rooms.
- **Collapsible UI:** click any section title, subsection label, or Base Charges card header to collapse/expand; section titles bolder and larger. Page 1 stays linear by design (fill-once intake).

## v0.11.0 — 2026-06-03
- **"Detach & Reset" retired** (it's Xactimate's phrase) → plain **Remove & Reinstall / Disconnect & Reinstall**, with **Remove Only / Disconnect Only** where nothing gets put back, and **Dispose**.
- **Fixtures get action choices** with the right verb per trade: Disconnect (toilet, sink, disposal, dishwasher, ranges, fridge, hood, washer/dryer, exhaust fan) vs Remove (tub, shower door, vanity, cabinets).
- **Flooring "Under It" is now type-aware:** carpet → pad; laminate/vinyl/hardwood → plywood/foam/luan underlayment; tile → cement backer (Hardie) or uncoupling membrane. The dropdown only appears when the flooring type has a layer beneath it.
- **Mirrors** consolidated to one line (type dropdown + qty). **Demo** is one section with Flooring / Walls / Ceiling / Doors-Lighting-Trim subsections. Safety: register mask sits beside tension posts.
- **Catalog floor protection** now offers 24"/30" cloth widths per LF (and self-adhesive film). New model items priced via the cost model and wired into the rate table (×0.97 market factor): fixture dispose/reinstall variants, uncoupling membrane, remove-only options.

## v0.10.0 — 2026-06-03
- **Rooms restructured** into distinct sections: Safety (containment, zippers, posts, register masks) → Stabilization — Extraction → Fixtures (room-appropriate; mirrors live under Bathroom fixtures; Utility Room now gets washer/dryer) → Demo (Flooring / Walls / Ceiling / Doors, Lighting & Trim) → Cleaning → Equipment → Other Items.
- **Flooring & drywall demo work like the catalog:** pick a type from a dropdown, enter the area, "+ Add Additional" for more — and each flooring row has an "Under It" dropdown (carpet pad / underlayment) that bills the layer beneath at the same SF automatically.
- **Three-way actions** on door slab, recessed light (new), ceiling fan, light fixture: Detach / Detach & Reset / Dispose. "Remove & Dispose" shortened to **Dispose** everywhere.
- Countertops removed from room forms — catalog-search only. Room-type dropdown alphabetized. Remaining "Main Level" wording scrubbed.

## v0.9.0 — 2026-06-03
- **Tax Jurisdiction v4:** dropdown restored (area names only); entering a ZIP auto-suggests the jurisdiction — and warns when the ZIP spans multiple districts. "Verify exact rate" now opens the **official Colorado DOR locator** (rooftop-accurate, not a Google search) with the job address auto-copied to the clipboard.
- **Room-by-room overhaul:** new plain-language terminology everywhere (Remove & Dispose / Detach & Reset — no more "tear out & bag"); door slab, ceiling fan, light fixture get action choices; **Recessed Light** added; **Subfloor — Remove & Dispose** added; **Clean Stud Walls** and **Clean Joists** added to Clean-Up; mirrors now appear only in Bathroom rooms.
- **Filters moved out of room equipment** into their own card under the renamed **Base Charges** page (was "Main / Job-Level Charges").
- **Catalog search is now page-aware:** picking an item that already exists as a form field on that room page flags it and asks before adding a duplicate.
- Condition 1 removed from Loss Classification (normal fungal ecology isn't billable). Date of Loss now visibly defaults to today on every platform, including mobile. Testing card text boxes vertically aligned.

## v0.8.0 — 2026-06-03
- **All form-field pricing rewired to the reconciled model.** The legacy `P` price table (104 entries driving the regular form fields) is now derived from the calibrated catalog × the 0.97 market factor — 55 stale values corrected, including supervisor, truck-mount, contents, mold stain, hydroxyl, and the appliance/fixture rates. Form entries and smart-search entries now bill identically.
- **Tax Jurisdiction:** dropdown replaced with one-tap radio buttons (area names only, no % clutter) that auto-fill the rate box; manual entry and "Look up by address" unchanged.
- **No version numbers on customer output** — estimate pages and PDFs show only the estimate ID and date. (Internal versioning unchanged.)
- **Best-effort quote loading:** saved `.json` quotes from older app versions now load whatever still matches and report what was skipped, instead of breaking when line items change.

## v0.7.0 — 2026-06-03
- **Pricing fully reconciled to the DRYmedic Parker rate schedule** (`drymedicparker_pricing.json`, rev3). Corrected 8 drifted prices (mold stain, contents, supervisor, truck-mount, decon, respirator, zipper, canister filter) and aligned Cat 3 cleaning rates (HEPA light/detailed, surface-clean floor, antimicrobial) to the real mold/Cat 3 numbers.
- **Catalog expanded 64 → 92 items.** Added the full **fire line** (soot pre/wet-clean, mechanical cleaning, HMR labor, fire demo, room fire-cleans, hydroxyl/gas/thermal-fog deodorization, fire air scrubber, nicotine, trauma), **subcontractor/testing bids** (asbestos test, mold pre/post assessment, soot testing), and **job-level/general** items (regulated-waste container, lock box, temp power, power box, exit chamber, photo doc, final clean, invoice fee, heat-drying system) — all priced from the real schedule.
- Model meta note updated: catalog is now calibrated to the rate schedule, not seeded.
- Verified: app JS parses; 92 items, no duplicates, none unpriced; estimate math checks out; zero third-party/proprietary pricing data.

## v0.6.0 — ✅ LIVE (committed 2026-06-02)
- **Repository expanded into the full DRYscope monorepo.** Added the live pricing model (`model.json`), tax model (`tax.json`), the standalone **ODAPM** open project (`odapm/`), and the **starter kit** (`starter/`).
- Estimator: model-driven smart search; consolidated plain-language line items with per-item action wording; fixed-rate tax jurisdiction picker (Colorado) with by-address lookup and **Unincorporated Douglas 5%** distinguished from **Parker 8%**; PDF export; Save/Load Quote.
- Verified: app JavaScript parses cleanly; all 64 model line items priced. Repository confirmed free of any third-party/proprietary pricing data.

## v0.5.0 and earlier
- Prior development snapshots (estimator build-out, ODAPM model seeding, starter-kit scaffolding). See project history.
