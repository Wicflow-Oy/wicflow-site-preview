/* Value calculator for the Wicflow OS variant (build.py --os): one product in three tiers.
   Price = the tier's platform fee for the company's revenue band + full users + light users; setup grows with the
   number of users. The revenue choice is shared with the pricing page's switch (the "wf:band" event). Value is built
   like calc.js (hourly wage + employer costs, a month = 4.33 weeks of 5 working days) with conservative starting
   values. Extra deals come from Sales Radar and Outreach, so Lite counts none. Draft prices. Nothing is sent or stored. */
(() => {
  const { L, eur, route, lang } = window.WF;
  const DAYS_PER_MONTH = 4.33 * 5;
  // t = time saved factor, d = extra deals factor (Max: advanced automations and Outreach at full scale).
  const TIERS = [
    { id: "lite", name: "Lite", base: [490, 990, 1490], full: 49, light: 9, t: 1, d: 0 },
    { id: "standard", name: "Standard", base: [1990, 3900, 5900], full: 129, light: 15, t: 1, d: 1 },
    { id: "max", name: "Max", base: [3900, 6900, 9900], full: 179, light: 19, t: 1.15, d: 1.5 },
  ];
  const BANDS = L({ sv: ["Under 5 milj. €", "5–20 milj. €", "Över 20 milj. €"], fi: ["Alle 5 milj. €", "5–20 milj. €", "Yli 20 milj. €"], en: ["Under €5M", "€5M–20M", "Over €20M"] });
  const SETUP = [[20, 2900], [100, 7900], [300, 14900], [Infinity, 24900]];
  const PRESETS = [
    { id: "very", hours: 0.5, mins: 5, deals: 1, name: L({ sv: "Mycket försiktig", fi: "Hyvin varovainen", en: "Very cautious" }) },
    { id: "cautious", hours: 1, mins: 15, deals: 2, name: L({ sv: "Försiktig", fi: "Varovainen", en: "Cautious" }) },
    { id: "typical", hours: 1.5, mins: 30, deals: 4, name: L({ sv: "Typisk", fi: "Tyypillinen", en: "Typical" }) },
    { id: "strong", hours: 2.5, mins: 45, deals: 6, name: L({ sv: "Stark", fi: "Vahva", en: "Strong" }) },
  ];
  const START = "cautious";
  const MAIN = [
    { k: "full", min: 1, max: 1000, step: 1, def: 10, unit: "", label: L({ sv: "Fullanvändare", fi: "Täydet käyttäjät", en: "Full users" }) },
    { k: "light", min: 0, max: 2000, step: 1, def: 5, unit: "", label: L({ sv: "Lättanvändare", fi: "Kevytkäyttäjät", en: "Light users" }) },
    { k: "deals", min: 0, max: 50, step: 1, def: 2, unit: "", label: L({ sv: "Extra affärer per månad", fi: "Lisäkauppoja kuukaudessa", en: "Extra deals per month" }) },
    { k: "profit", min: 0, max: 50000, step: 100, def: 2500, unit: "€", label: L({ sv: "Bruttovinst per affär", fi: "Myyntikate per kauppa", en: "Gross profit per deal" }) },
  ];
  const MORE = [
    { k: "hours", min: 0, max: 5, step: 0.25, def: 1, unit: "h", label: L({ sv: "Sparad tid per fullanvändare och dag", fi: "Säästetty aika täyttä käyttäjää kohden päivässä", en: "Hours saved per full user a day" }) },
    { k: "mins", min: 0, max: 120, step: 5, def: 15, unit: "min", label: L({ sv: "Sparade minuter per lättanvändare och dag", fi: "Säästetyt minuutit kevytkäyttäjää kohden päivässä", en: "Minutes saved per light user a day" }) },
    { k: "wage", min: 15, max: 120, step: 1, def: 18, unit: "€/h", label: L({ sv: "Timlön", fi: "Tuntipalkka", en: "Hourly wage" }) },
    { k: "employer", min: 0, max: 60, step: 1, def: 30, unit: "%", label: L({ sv: "Arbetsgivarkostnader", fi: "Työnantajakulut", en: "Employer costs" }) },
  ];
  const FIELDS = [...MAIN, ...MORE];
  const T = {
    tier: L({ sv: "Nivå", fi: "Taso", en: "Tier" }),
    revenue: L({ sv: "Företagets omsättning", fi: "Yrityksen liikevaihto", en: "Company revenue" }),
    preset: L({ sv: "Uppskattning", fi: "Arvio", en: "Estimate" }),
    note: L({ sv: "Vi börjar försiktigt: 1 timme sparad per fullanvändare och 15 minuter per lättanvändare och dag, en timlön på 18 € och 2 extra affärer i månaden. Ändra timmar och lön under Antaganden så att de passar ditt företag. Om ditt team gör mycket manuellt arbete är den sparade tiden oftast större.",
              fi: "Aloitamme varovaisesti: 1 tunti säästöä täyttä käyttäjää ja 15 minuuttia kevytkäyttäjää kohden päivässä, 18 euron tuntipalkka ja 2 lisäkauppaa kuukaudessa. Muuta tunnit ja palkka Oletukset-kohdassa vastaamaan yritystäsi. Jos tiimissäsi on paljon manuaalista työtä, säästö on yleensä suurempi.",
              en: "We start cautiously: 1 hour saved per full user and 15 minutes per light user a day, €18 an hour and 2 extra deals a month. Change the hours and wage under Assumptions to match your company. If your team does a lot of manual work, the time saved is usually more." }),
    more: L({ sv: "Antaganden", fi: "Oletukset", en: "Assumptions" }),
    moreSub: (S) => L({ sv: `${fmtNum(S.hours, 2)} h per fullanvändare och ${S.mins} min per lättanvändare och dag · ${S.wage} €/h + ${S.employer} %`,
                        fi: `${fmtNum(S.hours, 2)} h täyttä käyttäjää ja ${S.mins} min kevytkäyttäjää kohden päivässä · ${S.wage} €/h + ${S.employer} %`,
                        en: `${fmtNum(S.hours, 2)} h per full user and ${S.mins} min per light user a day · €${S.wage}/h + ${S.employer}%` }),
    value: L({ sv: "Värde per månad", fi: "Arvo kuukaudessa", en: "Value per month" }),
    perMonth: L({ sv: "/mån", fi: "/kk", en: "/mo" }),
    users: (t, f, l) => L({ sv: `${t} med ${f} full- och ${l} lättanvändare`, fi: `${t}, ${f} täyttä ja ${l} kevytkäyttäjää`, en: `${t} with ${f} full and ${l} light users` }),
    timeFull: L({ sv: "Fullanvändarnas tid", fi: "Täysien käyttäjien aika", en: "Full users' time" }),
    timeLight: L({ sv: "Lättanvändarnas tid", fi: "Kevytkäyttäjien aika", en: "Light users' time" }),
    deals: L({ sv: "Extra affärer", fi: "Lisäkaupat", en: "Extra deals" }),
    noDeals: L({ sv: "Extra affärer kommer från Säljradarn och Prospekteringen, som ingår i Standard och Max.", fi: "Lisäkaupat tulevat Myyntitutkasta ja Prospektoinnista, jotka sisältyvät Standardiin ja Maxiin.", en: "Extra deals come from Sales Radar and Outreach, which are in Standard and Max." }),
    hours: (h, fte) => L({ sv: `≈ ${h} timmar tillbaka i månaden, ungefär ${fte} heltidstjänster.`, fi: `≈ ${h} tuntia takaisin kuukaudessa, noin ${fte} kokoaikaista työntekijää.`, en: `≈ ${h} hours back a month, about ${fte} full-time people.` }),
    net: L({ sv: "Kvar efter priset", fi: "Jää hinnan jälkeen", en: "Left after the price" }),
    pay: L({ sv: "Uppstarten betald", fi: "Käyttöönotto maksettu takaisin", en: "Setup paid back" }),
    under1: L({ sv: "på under en månad", fi: "alle kuukaudessa", en: "in under a month" }),
    months: (n) => L({ sv: `på ${n} ${n === 1 ? "månad" : "månader"}`, fi: `${n} kuukaudessa`, en: `in ${n} ${n === 1 ? "month" : "months"}` }),
    never: L({ sv: "Inte med de här siffrorna", fi: "Ei näillä luvuilla", en: "Not with these numbers" }),
    price: (t, base, f, l, total, setup) => L({
      sv: `${t.name}: ${eur(base)} + ${f} × ${eur(t.full)} + ${l} × ${eur(t.light)} = ${eur(total)} i månaden med årsavtal. Uppstart från ${eur(setup)}. Exklusive moms.`,
      fi: `${t.name}: ${eur(base)} + ${f} × ${eur(t.full)} + ${l} × ${eur(t.light)} = ${eur(total)} kuukaudessa vuosisopimuksella. Käyttöönotto alkaen ${eur(setup)}. Alv 0 %.`,
      en: `${t.name}: ${eur(base)} + ${f} × ${eur(t.full)} + ${l} × ${eur(t.light)} = ${eur(total)} a month with a yearly agreement. Setup from ${eur(setup)}. Excluding VAT.` }),
    copy: L({ sv: "Kopiera", fi: "Kopioi", en: "Copy" }),
    copied: L({ sv: "Kopierad. Klistra in i ett mejl till ekonomichefen.", fi: "Kopioitu. Liitä sähköpostiin talousjohtajalle.", en: "Copied. Paste it into an email to your CFO." }),
    copyFail: L({ sv: "Kunde inte kopiera. Markera texten nedan.", fi: "Kopiointi ei onnistunut. Valitse teksti alta.", en: "Couldn't copy. Select the text below." }),
    book: L({ sv: "Gå igenom kalkylen med Felix", fi: "Käy laskelma läpi Felixin kanssa", en: "Go through it with Felix" }),
    title: L({ sv: "Värdekalkyl, Wicflow OS", fi: "Arvolaskelma, Wicflow OS", en: "Value calculation, Wicflow OS" }),
    fine: L({ sv: "Exempelkalkyl med dina egna siffror, inget löfte om resultat. Max räknas med 15 % mer sparad tid och 50 % fler extra affärer än Standard. En månad är 4,33 veckor à 5 arbetsdagar. Priserna är utkast.",
              fi: "Esimerkkilaskelma omilla luvuillasi, ei lupaus tuloksista. Maxissa lasketaan 15 % enemmän säästettyä aikaa ja 50 % enemmän lisäkauppoja kuin Standardissa. Kuukausi on 4,33 viikkoa à 5 työpäivää. Hinnat ovat luonnoksia.",
              en: "An example calculation with your own numbers, not a promise of results. Max counts 15% more time saved and 50% more extra deals than Standard. A month is 4.33 weeks of 5 working days. Prices are drafts." }),
  };
  function fmtNum(n, d = 0) { return n.toLocaleString(lang === "en" ? "en-GB" : "fi-FI", { maximumFractionDigits: d, minimumFractionDigits: 0 }).replace(/[  \s]/g, " "); }
  const signedEur = (n) => (n < 0 ? "−" : "") + eur(Math.abs(Math.round(n)));
  for (const k of ["hours", "mins", "deals"]) FIELDS.find((f) => f.k === k).def = PRESETS.find((p) => p.id === START)[k];
  let seq = 0;

  function mount(root) {
    const uid = "calcos" + (++seq);
    const S = Object.fromEntries(FIELDS.map((f) => [f.k, f.def]));
    let tier = "standard", band = 0;
    let preset = START; // null once the visitor changes hours or deals themselves

    const field = (f) => `
      <div class="calc-field" data-f="${f.k}">
        <div class="calc-top"><label for="${uid}-${f.k}">${f.label}</label>
          <span class="calc-num"><input type="number" id="${uid}-${f.k}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.def}" data-k="${f.k}" inputmode="decimal">${f.unit ? `<i>${f.unit}</i>` : ""}</span></div>
        <input type="range" id="${uid}-${f.k}-r" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.def}" data-k="${f.k}" aria-label="${f.label}">
      </div>`;
    root.innerHTML = `
      <div class="calc-in">
        <div class="calc-presets"><span class="calc-lbl" id="${uid}-pre">${T.preset}</span><div class="seg calc-pre" role="group" aria-labelledby="${uid}-pre">${PRESETS.map((p) => `<button type="button" data-preset="${p.id}">${p.name}</button>`).join("")}</div></div>
        <div class="calc-presets"><span class="calc-lbl" id="${uid}-rev">${T.revenue}</span><div class="seg calc-band" role="group" aria-labelledby="${uid}-rev">${BANDS.map((b, i) => `<button type="button" data-cband="${i}">${b}</button>`).join("")}</div></div>
        ${MAIN.map(field).join("")}
        <p class="calc-assume">${T.note}</p>
        <details class="calc-more"><summary><span>${T.more}<small data-n="more"></small></span></summary><div class="calc-fields">${MORE.map(field).join("")}</div><p class="calc-fine">${T.fine}</p></details>
      </div>
      <div class="calc-out" aria-live="polite">
        <div class="seg calc-seg calc-tiers" role="group" aria-label="${T.tier}">${TIERS.map((t) => `<button type="button" data-tier="${t.id}">${t.name}</button>`).join("")}</div>
        <div class="calc-big"><span class="calc-lbl">${T.value}</span><b data-n="value"></b><span class="calc-lbl" data-n="pkg"></span></div>
        <div class="calc-bar"><i class="v1"></i><i class="v3"></i><i class="v2"></i></div>
        <div class="calc-legend"><span><em><i class="v1"></i>${T.timeFull}</em><b data-l="t"></b></span><span><em><i class="v3"></i>${T.timeLight}</em><b data-l="s"></b></span><span><em><i class="v2"></i>${T.deals}</em><b data-l="d"></b></span></div>
        <p class="calc-note" data-n="nodeals" hidden>${T.noDeals}</p>
        <p class="calc-note" data-n="hours"></p>
        <div class="calc-pay">
          <div><span class="calc-lbl">${T.net}</span><b data-n="net"></b></div>
          <div><span class="calc-lbl">${T.pay}</span><b data-n="pay"></b></div>
        </div>
        <p class="calc-note" data-n="price"></p>
        <div class="calc-actions"><a class="btn btn-ink btn-sm" href="${route("contact")}">${T.book}</a><button type="button" class="btn btn-line btn-sm" data-copy>${T.copy}</button></div>
        <p class="calc-copied small muted" hidden></p>
        <textarea class="calc-text" readonly hidden rows="7"></textarea>
      </div>`;

    const $ = (q) => root.querySelector(q);
    const setupFor = (users) => SETUP.find(([max]) => users <= max)[1];
    function compute() {
      const t = TIERS.find((x) => x.id === tier);
      const k = 1 + S.employer / 100;
      const fullHours = S.full * S.hours * t.t * DAYS_PER_MONTH;
      const lightHours = S.light * (S.mins / 60) * t.t * DAYS_PER_MONTH;
      const fullValue = fullHours * S.wage * k, lightValue = lightHours * S.wage * k;
      const dealValue = S.deals * t.d * S.profit;
      const value = fullValue + lightValue + dealValue;
      const base = t.base[band];
      const price = base + S.full * t.full + S.light * t.light;
      const setup = setupFor(S.full + S.light);
      const net = value - price;
      const hours = fullHours + lightHours;
      return { t, base, fullValue, lightValue, dealValue, value, price, setup, net, hours, payback: net > 0 ? setup / net : null, fte: hours / (40 * 4.33) };
    }

    const shown = {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tween(key, el, to, fmt) {
      const from = shown[key] ?? to; shown[key] = to;
      if (reduce || from === to) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 360;
      const step = (now) => {
        if (shown[key] !== to) return;
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(() => { if (shown[key] === to) el.textContent = fmt(to); }, dur + 80);
    }

    function render() {
      const r = compute();
      root.querySelectorAll("[data-tier]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tier === tier)));
      root.querySelectorAll("[data-preset]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === preset)));
      root.querySelectorAll("[data-cband]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.cband) === band)));
      tween("value", $("[data-n=value]"), r.value, (v) => eur(Math.round(v)));
      $("[data-n=pkg]").textContent = T.users(r.t.name, fmtNum(S.full), fmtNum(S.light));
      const w = (n) => Math.max(0, (n / Math.max(r.value, 1)) * 100).toFixed(2) + "%";
      $(".calc-bar .v1").style.width = w(r.fullValue);
      $(".calc-bar .v3").style.width = w(r.lightValue);
      $(".calc-bar .v2").style.width = w(r.dealValue);
      $("[data-l=t]").textContent = eur(Math.round(r.fullValue));
      $("[data-l=s]").textContent = eur(Math.round(r.lightValue));
      $("[data-l=d]").textContent = eur(Math.round(r.dealValue));
      $("[data-n=nodeals]").hidden = r.t.d > 0;
      root.querySelectorAll('[data-f="deals"], [data-f="profit"]').forEach((el) => el.classList.toggle("is-off", r.t.d === 0));
      $("[data-n=hours]").textContent = T.hours(fmtNum(Math.round(r.hours)), fmtNum(r.fte, 1));
      $("[data-n=more]").textContent = T.moreSub(S);
      const netEl = $("[data-n=net]"), payEl = $("[data-n=pay]");
      netEl.classList.toggle("neg", r.net < 0);
      tween("net", netEl, r.net, (v) => signedEur(v) + T.perMonth);
      payEl.classList.toggle("neg", r.payback === null);
      payEl.textContent = r.payback === null ? T.never : r.payback < 1 ? T.under1 : T.months(Math.ceil(r.payback));
      $("[data-n=price]").textContent = T.price(r.t, r.base, fmtNum(S.full), fmtNum(S.light), r.price, r.setup);
      return r;
    }

    const setField = (k, v) => { S[k] = v; root.querySelector(`#${uid}-${k}`).value = v; root.querySelector(`#${uid}-${k}-r`).value = v; };
    function summary() {
      const r = render();
      const lines = [T.title, $("[data-n=pkg]").textContent, `${T.value}: ${eur(Math.round(r.value))} (${T.timeFull} ${eur(Math.round(r.fullValue))}, ${T.timeLight} ${eur(Math.round(r.lightValue))}, ${T.deals} ${eur(Math.round(r.dealValue))})`,
        $("[data-n=price]").textContent, `${T.net}: ${$("[data-n=net]").textContent} · ${T.pay}: ${$("[data-n=pay]").textContent}`, T.moreSub(S)];
      return lines.join("\n") + "\n\n" + T.fine;
    }

    root.addEventListener("input", (e) => {
      const k = e.target.dataset.k; if (!k) return;
      const f = FIELDS.find((x) => x.k === k);
      let v = parseFloat(String(e.target.value).replace(",", "."));
      if (Number.isNaN(v)) return;
      v = Math.min(f.max, Math.max(f.min, v));
      S[k] = v;
      if (["hours", "mins", "deals"].includes(k)) preset = null;
      const other = e.target.type === "range" ? root.querySelector(`#${uid}-${k}`) : root.querySelector(`#${uid}-${k}-r`);
      if (other) other.value = v;
      render();
    });
    root.addEventListener("click", async (e) => {
      const tb = e.target.closest("[data-tier]");
      if (tb) { tier = tb.dataset.tier; render(); return; }
      const cb = e.target.closest("[data-cband]");
      if (cb) { document.dispatchEvent(new CustomEvent("wf:band", { detail: Number(cb.dataset.cband) })); return; }
      const pre = e.target.closest("[data-preset]");
      if (pre) { const p = PRESETS.find((x) => x.id === pre.dataset.preset); preset = p.id; ["hours", "mins", "deals"].forEach((k) => setField(k, p[k])); render(); return; }
      if (e.target.closest("[data-copy]")) {
        const text = summary();
        const msg = root.querySelector(".calc-copied"), ta = root.querySelector(".calc-text");
        try { await navigator.clipboard.writeText(text); msg.textContent = T.copied; ta.hidden = true; }
        catch { msg.textContent = T.copyFail; ta.value = text; ta.hidden = false; ta.select(); }
        msg.hidden = false;
      }
    });
    document.addEventListener("wf:band", (e) => { band = e.detail; render(); });
    render();
  }
  // The pricing page's revenue switch: the platform fee in each tier card follows it, and so do the calculators.
  document.addEventListener("wf:band", (e) => {
    document.querySelectorAll("[data-band-pick] [data-band]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.band) === e.detail)));
    document.querySelectorAll("[data-bands]").forEach((el) => { el.textContent = eur(Number(el.dataset.bands.split(",")[e.detail])); });
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-band-pick] [data-band]");
    if (b) document.dispatchEvent(new CustomEvent("wf:band", { detail: Number(b.dataset.band) }));
  });
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-calc-os]").forEach(mount));
})();
