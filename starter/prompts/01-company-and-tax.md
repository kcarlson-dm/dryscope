# Step 01 — Company identity & sales tax

Sets your business identity and your tax areas. **Everyone completes this step** — the app can't calculate an estimate without a tax rate, and tax is independent of how you choose to price in step 02.

---

**Paste this to Claude:**

> I'm setting up the DRYscope starter kit in this folder. Open `index.html` and do two things with me.
>
> **First — identity.** Replace the placeholders (`[Your Company]`, `[Your Address]`, `[your-website]`, `[office phone]`, `[Your Name]`, `[your phone]`) with my real details. Ask me for each one.
>
> **Second — sales tax.** Ask me what state I work in and my service territory (my main cities/areas, or a radius around my base). Then:
> - Find my state's official sales-tax rate source and by-address lookup tool, and point the app's "Verify exact rate" button (`taxLookup`) at my state's official locator instead of Colorado's.
> - Build my jurisdiction presets in the `RATES` list — each area I work in with its combined rate from the official source. Don't invent a rate; if you can't verify one, leave it 0 and flag it for me.
> - Build the `ZIP_AREAS` map so typing a job ZIP auto-suggests the area — and where one ZIP spans multiple tax districts, list every candidate so the app warns me instead of guessing.
>
> Remember: in this app, tax applies to the **material portion only** — labor is never taxed. When done, summarize exactly what you changed and list anything still unverified.

---

**Why ZIP candidates matter:** taxing-district lines follow legal boundaries, not ZIP codes — one ZIP can hold two or three different combined rates. The app suggests, warns, and links you to the official lookup for certainty.
