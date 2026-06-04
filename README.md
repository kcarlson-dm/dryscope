# DRYscope

**Open, market-derived restoration estimating — and the open pricing model behind it.**

Restoration work is priced against a single proprietary list. Insurers use that same list, then discount the contractor's submission below it — and the contractor has no independent reference to argue from. That isn't a market; it's an administered price set by a party with an interest in keeping it low. DRYscope exists to restore real price discovery: a transparent benchmark neither side controls, where every number traces back to its open-data source.

## Get your own estimator — 15 minutes, no code

1. Click the green **Code** button above → **Download ZIP** → unzip.
2. Open **Claude** (claude.ai desktop) → start a **Cowork** session → point it at the unzipped **`starter/`** folder.
3. Open `starter/prompts/00-START-HERE.md` and follow it. Claude will set your company identity, build your sales-tax areas from your state's official source, and then ask how you want to price: **enter your own rates**, or **derive them from open data with [ODAPM](https://getodapm.github.io)**.
4. (Optional) Step 03 puts your estimator on a free web link for your crew — drag-and-drop, no terminal.

Tax setup is required for everyone (estimates can't compute without it) and is independent of the pricing path you choose.

## What's here

- **DRYscope Estimator** — [`index.html`](index.html): a free, self-contained estimating app (no server, works offline). Live at **https://kcarlson-dm.github.io/dryscope/**
- **[`model.json`](model.json)** — the live pricing model (an ODAPM instance).
- **[`tax.json`](tax.json)** — jurisdiction tax rates.
- **[ODAPM](https://getodapm.github.io)** — the **Open Data AI Pricing Model**: an open standard + methodology + prompt-driven workflow that lets *anyone* build their own market-derived model with an AI assistant, no coding. Lives at [getodapm.github.io](https://getodapm.github.io) · [repo](https://github.com/getodapm/getodapm.github.io).
- **[`starter/`](starter/)** — a kit another restoration owner can download to stand up their own DRYscope estimator.

## Principles

1. **Market-derived, not hand-set** — every price comes from citable open inputs; the method is public and auditable.
2. **Capture all defensible work** — each line tied to a justification.
3. **One honest price, coverage-agnostic** — same numbers whether insurance pays in full, partially, or the homeowner self-pays.
4. **Treat homeowners as people, not claims.**

See the [ODAPM Manifesto](https://github.com/getodapm/getodapm.github.io/blob/main/MANIFESTO.md) for the full thesis.

## License

App and tools: **MIT** ([LICENSE](LICENSE)). The ODAPM spec, methodology, and data: **CC-BY-4.0** ([license](https://github.com/getodapm/getodapm.github.io/blob/main/LICENSE-DATA)). **This project contains zero proprietary or third-party pricing data** — all pricing is independently derived from cited open public sources.

## Status

DRYscope Estimator **v0.17.2** — 94-item catalog, fully reconciled pricing, unified across all entry paths. ODAPM spec `odapm/v1` — canonical home [getodapm.github.io](https://getodapm.github.io).
