/* Value calculator. Built like Felix's roi-calculator (hourly wage + 30 % employer costs, a month = 4.33 weeks of
   5 working days), but with deliberately conservative starting values so the site never overpromises: 1 hour saved
   per person a day at €18 an hour, said plainly in a note next to the inputs. Four estimates (very cautious to strong)
   set only the hours saved and the extra deals; team size, wages and profit per deal stay the visitor's own.
   Kept small on purpose: four inputs (salespeople, other staff, extra deals, profit per deal), the time assumptions
   folded away under "Assumptions", and one result for one package. The hours saved and extra deals are entered for
   the Sales System; the other packages scale them by their own factors (t = sales time, s = staff time, d = deals).
   The package follows the number of users (salespeople + other staff) until the visitor picks one. Nothing is sent
   or stored. The package prices are shown here even while the rest of the site holds them (Emil, 2026-10-05):
   what is left each month after the price, and how fast the setup is paid back. */
(() => {
  const { L, eur, route, lang } = window.WF;
  const DAYS_PER_MONTH = 4.33 * 5;
  // Monthly price and setup, excluding VAT (drafts, shown before Felix's approval at Emil's request).
  const PRICES = { sys: [5490, 6900], pro: [6900, 11900], gro: [11900, 24900] };
  const OPTIONS = [
    { id: "sys", price: PRICES.sys?.[0], setup: PRICES.sys?.[1], t: 1, s: 1, d: 1, name: L({ sv: "Säljsystemet", fi: "Myyntijärjestelmä", en: "Sales System" }) },
    { id: "pro", price: PRICES.pro?.[0], setup: PRICES.pro?.[1], t: 1.15, s: 1.4, d: 1.05, short: "+ Brain Pro", name: L({ sv: "Säljsystemet + Brain Pro", fi: "Myyntijärjestelmä + Brain Pro", en: "Sales System + Brain Pro" }) },
    { id: "gro", price: PRICES.gro?.[0], setup: PRICES.gro?.[1], t: 1.25, s: 1.6, d: 2.5, name: L({ sv: "Tillväxtmotorn", fi: "Kasvumoottori", en: "Growth Engine" }) },
  ];
  // Users decide the package: Brain Start covers 10, Pro 30, larger goes to the Growth Engine.
  const suggestedFor = (users) => (users <= 10 ? "sys" : users <= 30 ? "pro" : "gro");

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
  // System). Cautious is the starting point; even Strong stays below what Maatori saves (3 h per salesperson a day).
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
    note: L({ sv: "Vi börjar försiktigt: 1 timme sparad per person och dag, en timlön på 18 € och 2 extra affärer i månaden. Ändra löner och timmar under Antaganden så att de passar ditt företag. Om ditt team gör mycket manuellt arbete är den sparade tiden oftast mer än en timme om dagen.",
              fi: "Aloitamme varovaisesti: 1 tunnin säästö henkilöä kohden päivässä, 18 euron tuntipalkka ja 2 lisäkauppaa kuukaudessa. Muuta palkat ja tunnit Oletukset-kohdassa vastaamaan yritystäsi. Jos tiimissäsi on paljon manuaalista työtä, säästö on yleensä yli tunnin päivässä.",
              en: "We start cautiously: 1 hour saved per person a day, €18 an hour and 2 extra deals a month. Change the wages and hours under Assumptions to match your company. If your team does a lot of manual work, the time saved is usually more than an hour a day." }),
    moreSub: (S) => {
      const same = S.wage === S.swage;
      return L({
        sv: `${fmtNum(S.hours, 2)} h per säljare och ${fmtNum(S.shours, 2)} h per övrig anställd och dag · ${same ? S.wage : `${S.wage} och ${S.swage}`} €/h + ${S.employer} %`,
        fi: `${fmtNum(S.hours, 2)} h myyjää ja ${fmtNum(S.shours, 2)} h muuta työntekijää kohden päivässä · ${same ? S.wage : `${S.wage} ja ${S.swage}`} €/h + ${S.employer} %`,
        en: `${fmtNum(S.hours, 2)} h per salesperson and ${fmtNum(S.shours, 2)} h per other employee a day · ${same ? `€${S.wage}` : `€${S.wage} and €${S.swage}`}/h + ${S.employer}%` });
    },
    auto: L({ sv: "föreslaget", fi: "ehdotettu", en: "suggested" }),
    pkg: (name, n, sug) => sug ? L({ sv: `${name}, föreslaget för ${n} användare`, fi: `${name}, ehdotettu ${n} käyttäjälle`, en: `${name}, suggested for ${n} users` }) : name,
    value: L({ sv: "Värde per månad", fi: "Arvo kuukaudessa", en: "Value per month" }),
    perMonth: L({ sv: "/mån", fi: "/kk", en: "/mo" }),
    time: L({ sv: "Säljarnas tid", fi: "Myyjien aika", en: "Sales team time" }),
    staff: L({ sv: "Övrig personals tid", fi: "Muun henkilöstön aika", en: "Other staff's time" }),
    deals: L({ sv: "Extra affärer", fi: "Lisäkaupat", en: "Extra deals" }),
    hours: (h, fte) => L({ sv: `≈ ${h} timmar tillbaka i månaden, ungefär ${fte} heltidstjänster.`, fi: `≈ ${h} tuntia takaisin kuukaudessa, noin ${fte} kokoaikaista työntekijää.`, en: `≈ ${h} hours back a month, about ${fte} full-time people.` }),
    net: L({ sv: "Kvar efter priset", fi: "Jää hinnan jälkeen", en: "Left after the price" }),
    pay: L({ sv: "Uppstarten betald", fi: "Käyttöönotto maksettu takaisin", en: "Setup paid back" }),
    under1: L({ sv: "på under en månad", fi: "alle kuukaudessa", en: "in under a month" }),
    months: (n) => L({ sv: `på ${n} ${n === 1 ? "månad" : "månader"}`, fi: `${n} kuukaudessa`, en: `in ${n} ${n === 1 ? "month" : "months"}` }),
    never: L({ sv: "Inte med de här siffrorna", fi: "Ei näillä luvuilla", en: "Not with these numbers" }),
    price: (name, p, setup) => L({ sv: `${name}: ${p} i månaden och ${setup} för uppstarten, exklusive moms.`, fi: `${name}: ${p} kuukaudessa ja käyttöönotto ${setup}, alv 0 %.`, en: `${name}: ${p} a month and ${setup} for the setup, excluding VAT.` }),
    copy: L({ sv: "Kopiera", fi: "Kopioi", en: "Copy" }),
    copied: L({ sv: "Kopierad. Klistra in i ett mejl till ekonomichefen.", fi: "Kopioitu. Liitä sähköpostiin talousjohtajalle.", en: "Copied. Paste it into an email to your CFO." }),
    copyFail: L({ sv: "Kunde inte kopiera. Markera texten nedan.", fi: "Kopiointi ei onnistunut. Valitse teksti alta.", en: "Couldn't copy. Select the text below." }),
    book: L({ sv: "Gå igenom kalkylen med Felix", fi: "Käy laskelma läpi Felixin kanssa", en: "Go through it with Felix" }),
    fine: L({ sv: "Exempelkalkyl med dina egna siffror, inget löfte om resultat. Sparad tid och extra affärer gäller Säljsystemet; de andra paketen räknas med vår uppskattning av deras effekt. En månad är 4,33 veckor à 5 arbetsdagar.",
              fi: "Esimerkkilaskelma omilla luvuillasi, ei lupaus tuloksista. Säästetty aika ja lisäkaupat koskevat Myyntijärjestelmää; muut paketit lasketaan arviollamme niiden vaikutuksesta. Kuukausi on 4,33 viikkoa à 5 työpäivää.",
              en: "An example calculation with your own numbers, not a promise of results. Hours saved and extra deals are for the Sales System; the other packages use our estimate of their effect. A month is 4.33 weeks of 5 working days." }),
  };
  function fmtNum(n, d = 0) { return n.toLocaleString(lang === "en" ? "en-GB" : "fi-FI", { maximumFractionDigits: d, minimumFractionDigits: 0 }).replace(/[  \s]/g, " "); }
  const signedEur = (n) => (n < 0 ? "−" : "") + eur(Math.abs(Math.round(n)));
  let seq = 0;

  function mount(root) {
    const uid = "calc" + (++seq);
    const S = Object.fromEntries(FIELDS.map((f) => [f.k, f.def]));
    let pick = null; // null = follow the suggestion
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
        <div class="seg calc-seg">${OPTIONS.map((o) => `<button type="button" data-p="${o.id}"></button>`).join("")}</div>
        <div class="calc-big"><span class="calc-lbl">${T.value}</span><b data-n="value"></b><span class="calc-lbl" data-n="pkg"></span></div>
        <div class="calc-bar"><i class="v1"></i><i class="v3"></i><i class="v2"></i></div>
        <div class="calc-legend"><span><em><i class="v1"></i>${T.time}</em><b data-l="t"></b></span><span><em><i class="v3"></i>${T.staff}</em><b data-l="s"></b></span><span><em><i class="v2"></i>${T.deals}</em><b data-l="d"></b></span></div>
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

    const suggested = () => suggestedFor(S.sellers + S.staff);
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
      const net = value - o.price;
      return { o, hpd, shpd, deals, hours, timeValue, staffValue, dealValue, value, net, payback: net > 0 ? o.setup / net : null, fte: hours / (40 * 4.33) };
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
      const sel = OPTIONS.find((x) => x.id === (pick || suggested()));
      const r = compute(sel);
      root.querySelectorAll("[data-preset]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === preset)));
      root.querySelectorAll(".calc-seg [data-p]").forEach((b) => {
        const o = OPTIONS.find((x) => x.id === b.dataset.p);
        b.setAttribute("aria-pressed", String(o.id === sel.id));
        b.classList.toggle("is-sug", o.id === suggested());
        b.textContent = o.short || o.name;
        b.title = o.name + (o.id === suggested() ? ` (${T.auto})` : "");
      });
      $("[data-n=pkg]").textContent = T.pkg(sel.name, S.sellers + S.staff, sel.id === suggested());
      tween("value", $("[data-n=value]"), r.value, (v) => eur(Math.round(v)));
      const w = (n) => Math.max(0, (n / Math.max(r.value, 1)) * 100).toFixed(2) + "%";
      $(".calc-bar .v1").style.width = w(r.timeValue);
      $(".calc-bar .v3").style.width = w(r.staffValue);
      $(".calc-bar .v2").style.width = w(r.dealValue);
      $("[data-l=t]").textContent = eur(Math.round(r.timeValue));
      $("[data-l=s]").textContent = eur(Math.round(r.staffValue));
      $("[data-l=d]").textContent = eur(Math.round(r.dealValue));
      $("[data-n=hours]").textContent = T.hours(fmtNum(Math.round(r.hours)), fmtNum(r.fte, 1));
      $("[data-n=more]").textContent = T.moreSub(S);
      const netEl = $("[data-n=net]"), payEl = $("[data-n=pay]");
      netEl.classList.toggle("neg", r.net < 0);
      tween("net", netEl, r.net, (v) => signedEur(v) + T.perMonth);
      payEl.classList.toggle("neg", r.payback === null);
      payEl.textContent = r.payback === null ? T.never : r.payback < 1 ? T.under1 : T.months(Math.ceil(r.payback));
      $("[data-n=price]").textContent = T.price(sel.name, eur(sel.price), eur(sel.setup));
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
        sv: [`Värdekalkyl, ${o.name}${presetName()}`, `${S.sellers} säljare à ${S.wage} €/h och ${S.staff} övriga anställda à ${S.swage} €/h, + ${S.employer} % arbetsgivarkostnader`, `Räknat med ${fmtNum(r.hpd, 2)} h sparad per säljare och ${fmtNum(r.shpd, 2)} h per övrig anställd och dag, och ${fmtNum(r.deals, 2)} extra affärer per månad à ${eur(S.profit)} bruttovinst`, `Värde per månad: ${eur(Math.round(r.value))} (säljarnas tid ${eur(Math.round(r.timeValue))}, övrig personals tid ${eur(Math.round(r.staffValue))}, affärer ${eur(Math.round(r.dealValue))})`],
        fi: [`Arvolaskelma, ${o.name}${presetName()}`, `${S.sellers} myyjää à ${S.wage} €/h ja ${S.staff} muuta työntekijää à ${S.swage} €/h, + ${S.employer} % työnantajakulut`, `Laskettu ${fmtNum(r.hpd, 2)} h säästöllä myyjää ja ${fmtNum(r.shpd, 2)} h muuta työntekijää kohden päivässä sekä ${fmtNum(r.deals, 2)} lisäkaupalla kuukaudessa à ${eur(S.profit)} kate`, `Arvo kuukaudessa: ${eur(Math.round(r.value))} (myyjien aika ${eur(Math.round(r.timeValue))}, muun henkilöstön aika ${eur(Math.round(r.staffValue))}, kaupat ${eur(Math.round(r.dealValue))})`],
        en: [`Value calculation, ${o.name}${presetName()}`, `${S.sellers} salespeople at €${S.wage}/h and ${S.staff} other employees at €${S.swage}/h, + ${S.employer}% employer costs`, `Calculated with ${fmtNum(r.hpd, 2)} h saved per salesperson and ${fmtNum(r.shpd, 2)} h per other employee a day, and ${fmtNum(r.deals, 2)} extra deals a month at ${eur(S.profit)} gross profit`, `Value per month: ${eur(Math.round(r.value))} (sales team time ${eur(Math.round(r.timeValue))}, other staff's time ${eur(Math.round(r.staffValue))}, deals ${eur(Math.round(r.dealValue))})`],
      });
      lines.push($("[data-n=price]").textContent, `${T.net}: ${$("[data-n=net]").textContent} · ${T.pay}: ${$("[data-n=pay]").textContent}`);
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
      if (pb) { pick = pb.dataset.p === suggested() ? null : pb.dataset.p; render(); return; }
      if (e.target.closest("[data-copy]")) {
        const text = summary(render());
        const msg = root.querySelector(".calc-copied"), ta = root.querySelector(".calc-text");
        try { await navigator.clipboard.writeText(text); msg.textContent = T.copied; ta.hidden = true; }
        catch { msg.textContent = T.copyFail; ta.value = text; ta.hidden = false; ta.select(); }
        msg.hidden = false;
      }
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-calc]").forEach(mount));
})();
