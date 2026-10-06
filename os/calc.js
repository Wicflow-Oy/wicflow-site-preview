/* Revenue calculator. Leads with money: the extra gross profit a month from new deals, then the time back and what it
   is worth, then what is left after the price and how many times the price it returns. Built like Felix's
   roi-calculator (hourly wage + 30 % employer costs, a month = 4.33 weeks of 5 working days), with deliberately
   cautious starting values so the site never overpromises: 1 hour saved per person a day at €18 an hour and 2 extra
   deals a month, said plainly in a note next to the inputs. Four estimates (very cautious to strong) set only the hours
   saved and the extra deals; team size, wages and profit per deal stay the visitor's own.
   The estimates are for the Sales bundle with Company Brain; the other options scale them (t = sales time, s = staff
   time, d = deals). Prices are the starting prices with a yearly agreement, or month to month when the pricing page's
   billing switch says so; they're shown here even where the rest of the site holds prices (Emil, 2026-10-05). Nothing
   is sent or stored. Also runs the pricing page's yearly/monthly switch. */
(() => {
  const { L, eur, route, lang } = window.WF;
  const DAYS_PER_MONTH = 4.33 * 5;
  // Starting prices a month, excluding VAT: [yearly, month to month] (drafts, shown before Felix's approval).
  const OPTIONS = [
    { id: "sales", price: [2000, 2500], t: 0.6, s: 0, d: 1, name: L({ sv: "Säljpaketet", fi: "Myyntipaketti", en: "Sales bundle" }) },
    { id: "brain", price: [3200, 4000], t: 1, s: 1, d: 1, short: L({ sv: "+ Company Brain", fi: "+ Company Brain", en: "+ Company Brain" }),
      name: L({ sv: "Säljpaketet + Company Brain", fi: "Myyntipaketti + Company Brain", en: "Sales bundle + Company Brain" }) },
    { id: "complete", price: [3600, 4500], t: 1.15, s: 1.3, d: 1.5, short: "Complete", name: "Wicflow OS Complete" },
  ];
  const START_OPTION = "brain";

  const MAIN = [
    { k: "sellers", min: 1, max: 100, step: 1, def: 8, unit: "", label: L({ sv: "Säljare", fi: "Myyjiä", en: "Salespeople" }) },
    { k: "staff", min: 0, max: 300, step: 1, def: 6, unit: "", label: L({ sv: "Övrig personal", fi: "Muuta henkilöstöä", en: "Other staff" }) },
    { k: "deals", min: 0, max: 50, step: 1, def: 2, unit: "", label: L({ sv: "Extra affärer per månad", fi: "Lisäkauppoja kuukaudessa", en: "Extra deals per month" }) },
    { k: "profit", min: 0, max: 50000, step: 100, def: 2500, unit: "€", label: L({ sv: "Bruttovinst per affär", fi: "Myyntikate per kauppa", en: "Gross profit per deal" }) },
  ];
  const MORE = [
    { k: "hours", min: 0, max: 5, step: 0.5, def: 1, unit: "h", label: L({ sv: "Sparad tid per säljare och dag", fi: "Säästetty aika myyjää kohden päivässä", en: "Hours saved per salesperson a day" }) },
    { k: "shours", min: 0, max: 4, step: 0.25, def: 1, unit: "h", label: L({ sv: "Sparad tid per övrig anställd och dag", fi: "Säästetty aika muuta työntekijää kohden päivässä", en: "Hours saved per other employee a day" }) },
    { k: "wage", min: 15, max: 120, step: 1, def: 18, unit: "€/h", label: L({ sv: "Säljarnas timlön", fi: "Myyjien tuntipalkka", en: "Salespeople's hourly wage" }) },
    { k: "swage", min: 15, max: 120, step: 1, def: 18, unit: "€/h", label: L({ sv: "Övrig personals timlön", fi: "Muun henkilöstön tuntipalkka", en: "Other staff's hourly wage" }) },
    { k: "employer", min: 0, max: 60, step: 1, def: 30, unit: "%", label: L({ sv: "Arbetsgivarkostnader", fi: "Työnantajakulut", en: "Employer costs" }) },
  ];
  const FIELDS = [...MAIN, ...MORE];
  // Estimates: hours saved per salesperson and per other employee a day, and extra deals a month (with the Sales
  // bundle + Company Brain). Cautious is the starting point; even Strong stays below what Maatori saves (3 h a day).
  const PRESETS = [
    { id: "very", hours: 0.5, shours: 0.5, deals: 1, name: L({ sv: "Mycket försiktig", fi: "Hyvin varovainen", en: "Very cautious" }) },
    { id: "cautious", hours: 1, shours: 1, deals: 2, name: L({ sv: "Försiktig", fi: "Varovainen", en: "Cautious" }) },
    { id: "typical", hours: 1.5, shours: 1.25, deals: 4, name: L({ sv: "Typisk", fi: "Tyypillinen", en: "Typical" }) },
    { id: "strong", hours: 2.5, shours: 1.5, deals: 6, name: L({ sv: "Stark", fi: "Vahva", en: "Strong" }) },
  ];
  const START = "cautious";
  for (const k of ["hours", "shours", "deals"]) FIELDS.find((f) => f.k === k).def = PRESETS.find((p) => p.id === START)[k];
  const T = {
    more: L({ sv: "Antaganden", fi: "Oletukset", en: "Assumptions" }),
    preset: L({ sv: "Uppskattning", fi: "Arvio", en: "Estimate" }),
    note: L({ sv: "Vi börjar försiktigt: 2 extra affärer i månaden och 1 timme sparad per person och dag, med en timlön på 18 €. Ändra siffrorna så att de passar ditt företag. Om ditt team gör mycket manuellt arbete är den sparade tiden oftast mer än en timme om dagen.",
              fi: "Aloitamme varovaisesti: 2 lisäkauppaa kuukaudessa ja 1 tunnin säästö henkilöä kohden päivässä 18 euron tuntipalkalla. Muuta luvut vastaamaan yritystäsi. Jos tiimissäsi on paljon manuaalista työtä, säästö on yleensä yli tunnin päivässä.",
              en: "We start cautiously: 2 extra deals a month and 1 hour saved per person a day, at €18 an hour. Change the numbers to match your company. If your team does a lot of manual work, the time saved is usually more than an hour a day." }),
    moreSub: (S) => {
      const same = S.wage === S.swage;
      return L({
        sv: `${fmtNum(S.hours, 2)} h per säljare och ${fmtNum(S.shours, 2)} h per övrig anställd och dag · ${same ? S.wage : `${S.wage} och ${S.swage}`} €/h + ${S.employer} %`,
        fi: `${fmtNum(S.hours, 2)} h myyjää ja ${fmtNum(S.shours, 2)} h muuta työntekijää kohden päivässä · ${same ? S.wage : `${S.wage} ja ${S.swage}`} €/h + ${S.employer} %`,
        en: `${fmtNum(S.hours, 2)} h per salesperson and ${fmtNum(S.shours, 2)} h per other employee a day · ${same ? `€${S.wage}` : `€${S.wage} and €${S.swage}`}/h + ${S.employer}%` });
    },
    profitLbl: L({ sv: "Mer bruttovinst i månaden", fi: "Lisää myyntikatetta kuukaudessa", en: "More gross profit a month" }),
    fromDeals: (n, p) => L({ sv: `från ${n} extra affärer à ${p}`, fi: `${n} lisäkaupasta à ${p}`, en: `from ${n} extra deals at ${p} each` }),
    perMonth: L({ sv: "/mån", fi: "/kk", en: "/mo" }),
    time: L({ sv: "Säljarnas tid", fi: "Myyjien aika", en: "Sales team time" }),
    staff: L({ sv: "Övrig personals tid", fi: "Muun henkilöstön aika", en: "Other staff's time" }),
    deals: L({ sv: "Nya affärer", fi: "Uudet kaupat", en: "New deals" }),
    hours: (h, fte, v) => L({ sv: `Plus ≈ ${h} timmar tillbaka i månaden, ungefär ${fte} heltidstjänster, värda ${v}.`, fi: `Lisäksi ≈ ${h} tuntia takaisin kuukaudessa, noin ${fte} kokoaikaista työntekijää, arvoltaan ${v}.`, en: `Plus ≈ ${h} hours back a month, about ${fte} full-time people, worth ${v}.` }),
    total: L({ sv: "Värde totalt i månaden", fi: "Arvo yhteensä kuukaudessa", en: "Total value a month" }),
    net: L({ sv: "Kvar efter priset", fi: "Jää hinnan jälkeen", en: "Left after the price" }),
    roi: L({ sv: "Avkastning på priset", fi: "Tuotto hintaan nähden", en: "Return on the price" }),
    times: (x) => L({ sv: `${x} × priset`, fi: `${x} × hinta`, en: `${x} × the price` }),
    price: (name, p, other, monthly) => L({
      sv: monthly ? `${name}: från ${p} i månaden månad för månad (${other} med årsavtal). Uppstarten ingår. Exklusive moms.` : `${name}: från ${p} i månaden med årsavtal (${other} månad för månad). Uppstarten ingår. Exklusive moms.`,
      fi: monthly ? `${name}: alkaen ${p} kuukaudessa kuukausittain (${other} vuosisopimuksella). Käyttöönotto sisältyy. Alv 0 %.` : `${name}: alkaen ${p} kuukaudessa vuosisopimuksella (${other} kuukausittain). Käyttöönotto sisältyy. Alv 0 %.`,
      en: monthly ? `${name}: from ${p} a month, month to month (${other} with a yearly agreement). Setup included. Excluding VAT.` : `${name}: from ${p} a month with a yearly agreement (${other} month to month). Setup included. Excluding VAT.` }),
    copy: L({ sv: "Kopiera", fi: "Kopioi", en: "Copy" }),
    copied: L({ sv: "Kopierad. Klistra in i ett mejl till ekonomichefen.", fi: "Kopioitu. Liitä sähköpostiin talousjohtajalle.", en: "Copied. Paste it into an email to your CFO." }),
    copyFail: L({ sv: "Kunde inte kopiera. Markera texten nedan.", fi: "Kopiointi ei onnistunut. Valitse teksti alta.", en: "Couldn't copy. Select the text below." }),
    book: L({ sv: "Gå igenom kalkylen med Felix", fi: "Käy laskelma läpi Felixin kanssa", en: "Go through it with Felix" }),
    fine: L({ sv: "Exempelkalkyl med dina egna siffror, inget löfte om resultat. Uppskattningarna gäller Säljpaketet med Company Brain; de andra alternativen räknas med vår uppskattning av deras effekt. Priserna är startpriser, och ditt pris beror på ditt företag. En månad är 4,33 veckor à 5 arbetsdagar.",
              fi: "Esimerkkilaskelma omilla luvuillasi, ei lupaus tuloksista. Arviot koskevat Myyntipakettia ja Company Brainia; muut vaihtoehdot lasketaan arviollamme niiden vaikutuksesta. Hinnat ovat aloitushintoja, ja oma hintasi riippuu yrityksestäsi. Kuukausi on 4,33 viikkoa à 5 työpäivää.",
              en: "An example calculation with your own numbers, not a promise of results. The estimates are for the Sales bundle with Company Brain; the other options use our estimate of their effect. Prices are starting prices, and yours depends on your company. A month is 4.33 weeks of 5 working days." }),
  };
  function fmtNum(n, d = 0) { return n.toLocaleString(lang === "en" ? "en-GB" : "fi-FI", { maximumFractionDigits: d, minimumFractionDigits: 0 }).replace(/[  \s]/g, " "); }
  const signedEur = (n) => (n < 0 ? "−" : "") + eur(Math.abs(Math.round(n)));
  let seq = 0, monthly = false;

  function mount(root) {
    const uid = "calc" + (++seq);
    const S = Object.fromEntries(FIELDS.map((f) => [f.k, f.def]));
    let pick = START_OPTION;
    let preset = START; // null once the visitor changes hours or deals themselves

    const field = (f) => `
      <div class="calc-field">
        <div class="calc-top"><label for="${uid}-${f.k}">${f.label}</label>
          <span class="calc-num"><input type="number" id="${uid}-${f.k}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.def}" data-k="${f.k}" inputmode="decimal">${f.unit ? `<i>${f.unit}</i>` : ""}</span></div>
        <input type="range" id="${uid}-${f.k}-r" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.def}" data-k="${f.k}" aria-label="${f.label}">
      </div>`;
    root.innerHTML = `
      <div class="calc-in">
        <div class="calc-presets"><span class="calc-lbl" id="${uid}-pre">${T.preset}</span><div class="seg calc-pre" role="group" aria-labelledby="${uid}-pre">${PRESETS.map((p) => `<button type="button" data-preset="${p.id}">${p.name}</button>`).join("")}</div></div>
        ${MAIN.map(field).join("")}
        <p class="calc-assume">${T.note}</p>
        <details class="calc-more"><summary><span>${T.more}<small data-n="more"></small></span></summary><div class="calc-fields">${MORE.map(field).join("")}</div><p class="calc-fine">${T.fine}</p></details>
      </div>
      <div class="calc-out" aria-live="polite">
        <div class="seg calc-seg">${OPTIONS.map((o) => `<button type="button" data-p="${o.id}" title="${o.name}">${o.short || o.name}</button>`).join("")}</div>
        <div class="calc-big calc-money"><span class="calc-lbl">${T.profitLbl}</span><b data-n="profit"></b><span class="calc-lbl" data-n="deals"></span></div>
        <div class="calc-bar"><i class="v2"></i><i class="v1"></i><i class="v3"></i></div>
        <div class="calc-legend"><span><em><i class="v2"></i>${T.deals}</em><b data-l="d"></b></span><span><em><i class="v1"></i>${T.time}</em><b data-l="t"></b></span><span><em><i class="v3"></i>${T.staff}</em><b data-l="s"></b></span></div>
        <p class="calc-note" data-n="hours"></p>
        <div class="calc-pay calc-pay3">
          <div><span class="calc-lbl">${T.total}</span><b data-n="value"></b></div>
          <div><span class="calc-lbl">${T.net}</span><b data-n="net"></b></div>
          <div><span class="calc-lbl">${T.roi}</span><b data-n="roi"></b></div>
        </div>
        <p class="calc-note" data-n="price"></p>
        <div class="calc-actions"><a class="btn btn-ink btn-sm" href="${route("contact")}">${T.book}</a><button type="button" class="btn btn-line btn-sm" data-copy>${T.copy}</button></div>
        <p class="calc-copied small muted" hidden></p>
        <textarea class="calc-text" readonly hidden rows="8"></textarea>
      </div>`;

    function compute(o) {
      const k = 1 + S.employer / 100;
      const hpd = S.hours * o.t, shpd = S.shours * o.s, deals = S.deals * o.d;
      const sellerHours = S.sellers * hpd * DAYS_PER_MONTH;
      const staffHours = S.staff * shpd * DAYS_PER_MONTH;
      const timeValue = sellerHours * S.wage * k;
      const staffValue = staffHours * S.swage * k;
      const dealValue = deals * S.profit;
      const value = timeValue + staffValue + dealValue;
      const hours = sellerHours + staffHours;
      const price = o.price[monthly ? 1 : 0];
      return { o, hpd, shpd, deals, hours, timeValue, staffValue, dealValue, value, price, net: value - price, roi: value / price, fte: hours / (40 * 4.33) };
    }

    const $ = (q) => root.querySelector(q);
    const shown = {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Count a number smoothly from what is on screen to its new value.
    function tween(key, el, to, fmt) {
      const from = shown[key] ?? to; shown[key] = to;
      if (reduce || from === to) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 360;
      const step = (now) => {
        if (shown[key] !== to) return; // a newer value took over
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      // If the browser isn't drawing frames (background tab), still land on the final value.
      setTimeout(() => { if (shown[key] === to) el.textContent = fmt(to); }, dur + 80);
    }

    function render() {
      const sel = OPTIONS.find((x) => x.id === pick);
      const r = compute(sel);
      root.querySelectorAll("[data-preset]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === preset)));
      root.querySelectorAll(".calc-seg [data-p]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === sel.id)));
      tween("profit", $("[data-n=profit]"), r.dealValue, (v) => eur(Math.round(v)) + T.perMonth);
      $("[data-n=deals]").textContent = T.fromDeals(fmtNum(r.deals, 1), eur(S.profit));
      const w = (n) => Math.max(0, (n / Math.max(r.value, 1)) * 100).toFixed(2) + "%";
      $(".calc-bar .v2").style.width = w(r.dealValue);
      $(".calc-bar .v1").style.width = w(r.timeValue);
      $(".calc-bar .v3").style.width = w(r.staffValue);
      $("[data-l=d]").textContent = eur(Math.round(r.dealValue));
      $("[data-l=t]").textContent = eur(Math.round(r.timeValue));
      $("[data-l=s]").textContent = eur(Math.round(r.staffValue));
      $("[data-n=hours]").textContent = T.hours(fmtNum(Math.round(r.hours)), fmtNum(r.fte, 1), eur(Math.round(r.timeValue + r.staffValue)));
      $("[data-n=more]").textContent = T.moreSub(S);
      tween("value", $("[data-n=value]"), r.value, (v) => eur(Math.round(v)) + T.perMonth);
      const netEl = $("[data-n=net]"), roiEl = $("[data-n=roi]");
      netEl.classList.toggle("neg", r.net < 0);
      tween("net", netEl, r.net, (v) => signedEur(v) + T.perMonth);
      roiEl.classList.toggle("neg", r.roi < 1);
      roiEl.textContent = T.times(fmtNum(r.roi, 1));
      $("[data-n=price]").textContent = T.price(sel.name, eur(r.price), eur(sel.price[monthly ? 0 : 1]), monthly);
      return r;
    }

    const presetName = () => { const p = PRESETS.find((x) => x.id === preset); return p ? ` (${p.name.toLowerCase()})` : ""; };
    const setField = (k, v) => {
      S[k] = v;
      root.querySelector(`#${uid}-${k}`).value = v;
      root.querySelector(`#${uid}-${k}-r`).value = v;
    };

    function summary(r) {
      const o = r.o;
      const lines = L({
        sv: [`Försäljningskalkyl, ${o.name}${presetName()}`, `Mer bruttovinst i månaden: ${eur(Math.round(r.dealValue))} (${fmtNum(r.deals, 1)} extra affärer à ${eur(S.profit)})`, `Tid tillbaka: ≈ ${fmtNum(Math.round(r.hours))} h i månaden, värd ${eur(Math.round(r.timeValue + r.staffValue))} (${S.sellers} säljare à ${S.wage} €/h, ${S.staff} övriga à ${S.swage} €/h, + ${S.employer} %)`, `Värde totalt: ${eur(Math.round(r.value))} i månaden`],
        fi: [`Myyntilaskelma, ${o.name}${presetName()}`, `Lisää myyntikatetta kuukaudessa: ${eur(Math.round(r.dealValue))} (${fmtNum(r.deals, 1)} lisäkauppaa à ${eur(S.profit)})`, `Aikaa takaisin: ≈ ${fmtNum(Math.round(r.hours))} h kuukaudessa, arvoltaan ${eur(Math.round(r.timeValue + r.staffValue))} (${S.sellers} myyjää à ${S.wage} €/h, ${S.staff} muuta à ${S.swage} €/h, + ${S.employer} %)`, `Arvo yhteensä: ${eur(Math.round(r.value))} kuukaudessa`],
        en: [`Revenue calculation, ${o.name}${presetName()}`, `More gross profit a month: ${eur(Math.round(r.dealValue))} (${fmtNum(r.deals, 1)} extra deals at ${eur(S.profit)})`, `Time back: ≈ ${fmtNum(Math.round(r.hours))} h a month, worth ${eur(Math.round(r.timeValue + r.staffValue))} (${S.sellers} salespeople at €${S.wage}/h, ${S.staff} other staff at €${S.swage}/h, + ${S.employer}%)`, `Total value: ${eur(Math.round(r.value))} a month`],
      });
      lines.push($("[data-n=price]").textContent, `${T.net}: ${$("[data-n=net]").textContent} · ${T.roi}: ${$("[data-n=roi]").textContent}`);
      return lines.join("\n") + "\n\n" + T.fine;
    }

    root.addEventListener("input", (e) => {
      const k = e.target.dataset.k; if (!k) return;
      const f = FIELDS.find((x) => x.k === k);
      let v = parseFloat(String(e.target.value).replace(",", "."));
      if (Number.isNaN(v)) return;
      v = Math.min(f.max, Math.max(f.min, v));
      S[k] = v;
      if (["hours", "shours", "deals"].includes(k)) preset = null;
      const other = e.target.type === "range" ? root.querySelector(`#${uid}-${k}`) : root.querySelector(`#${uid}-${k}-r`);
      if (other) other.value = v;
      render();
    });
    root.addEventListener("click", async (e) => {
      const pre = e.target.closest("[data-preset]");
      if (pre) {
        const p = PRESETS.find((x) => x.id === pre.dataset.preset);
        preset = p.id; ["hours", "shours", "deals"].forEach((k) => setField(k, p[k]));
        render(); return;
      }
      const pb = e.target.closest("[data-p]");
      if (pb) { pick = pb.dataset.p; render(); return; }
      if (e.target.closest("[data-copy]")) {
        const text = summary(render());
        const msg = root.querySelector(".calc-copied"), ta = root.querySelector(".calc-text");
        try { await navigator.clipboard.writeText(text); msg.textContent = T.copied; ta.hidden = true; }
        catch { msg.textContent = T.copyFail; ta.value = text; ta.hidden = false; ta.select(); }
        msg.hidden = false;
      }
    });
    document.addEventListener("wf:billing", render);
    render();
  }

  // The pricing page's yearly/monthly switch: prices and their notes swap, and the calculators follow.
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-billing-pick] [data-billing]");
    if (!b) return;
    monthly = b.dataset.billing === "m";
    document.querySelectorAll("[data-billing-pick] [data-billing]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll("[data-y][data-m]").forEach((el) => { el.textContent = monthly ? el.dataset.m : el.dataset.y; });
    document.dispatchEvent(new Event("wf:billing"));
  });
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-calc]").forEach(mount));
})();
