# Step 02 — Build your pricing (your choice of two paths)

Every price in this kit is **zero** on purpose — your numbers should be yours. The app's full catalog (90+ restoration line items: demo, fixtures, cleaning, equipment, fire line, subs) is already built; this step puts your rates on it.

---

**Paste this to Claude:**

> Help me price the DRYscope estimator in this folder. The rates live in two places in `index.html`: the `MODEL` catalog (the line items and options) and the `P` table (the form-field rates) — they must stay consistent (the app bills `P` at the catalog rate × the market factor).
>
> First, ask me to choose a path:
>
> **(A) Manual — I have my own rates.** Walk me through the catalog group by group (setup, demo, fixtures, cleaning, equipment, services). For each item show the description and unit and ask for my number. Never guess a price; leave anything I don't have at 0 and keep a running list.
>
> **(B) ODAPM — derive my rates from open data.** Direct me to download the Open Data AI Pricing Model from **https://getodapm.github.io** (green Code button → Download ZIP), then use its methodology and prompts to derive my rates: my local labor cost from public wage data, materials, equipment day-rates, my markup — anchored to any accepted invoices I can share, reconciled through ODAPM's tolerance bands. Then write the resulting rates into this app's `MODEL` and `P`.
>
> Either way, finish by validating: no broken JavaScript, `MODEL` and `P` consistent, and give me the list of anything still at 0.

---

**Which path?** If you have a rate sheet you already trust, manual is fastest. If you're starting fresh — or want every number to carry a defensible, documented basis you can show an adjuster — use ODAPM. You can mix: derive with ODAPM, then overwrite any line manually.
