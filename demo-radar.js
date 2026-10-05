/* Sales Radar demo. Fictional companies and signals, in-memory only. Strings are {sv, fi, en}. */
(() => {
  const { L, dm, weekday, hello, toast, icon, frame, page, card, demoBar, guide } = window.WF;
  const NAV = L({ sv: ["Morgonlistan", "Profiler", "Källor", "Körningar"], fi: ["Aamun lista", "Profiilit", "Lähteet", "Ajot"], en: ["Morning list", "Profiles", "Sources", "Runs"] });
  const TYPES = {
    hilma: L({ sv: "Offentlig upphandling", fi: "Julkinen hankinta", en: "Public tender" }),
    bygglov: L({ sv: "Bygglov", fi: "Rakennuslupa", en: "Building permit" }),
    nytt: L({ sv: "Nytt företag", fi: "Uusi yritys", en: "New company" }),
    annons: L({ sv: "Annonserar nu", fi: "Mainostaa nyt", en: "Advertising now" }),
    social: L({ sv: "Sociala medier", fi: "Sosiaalinen media", en: "Social media" }),
  };
  const REGIONS = {
    osb: L({ sv: "Österbotten", fi: "Pohjanmaa", en: "Ostrobothnia" }),
    mob: L({ sv: "Mellersta Österbotten", fi: "Keski-Pohjanmaa", en: "Central Ostrobothnia" }),
    nyl: L({ sv: "Nyland", fi: "Uusimaa", en: "Uusimaa" }),
    abo: L({ sv: "Åboland", fi: "Turunmaa", en: "Åboland" }),
    ala: L({ sv: "Åland", fi: "Ahvenanmaa", en: "Åland" }),
  };
  const OUTCOMES = L({ sv: ["Ringd", "Svarade", "Möte bokat", "Affär öppnad"], fi: ["Soitettu", "Vastasi", "Tapaaminen varattu", "Kauppa avattu"], en: ["Called", "Answered", "Meeting booked", "Deal opened"] });
  const hilmaPub = (a, b) => L({ sv: `Hilma · publicerad ${dm(a)} · sista dag ${dm(b)}`, fi: `Hilma · julkaistu ${dm(a)} · viimeinen päivä ${dm(b)}`, en: `Hilma · published ${dm(a)} · deadline ${dm(b)}` });
  const hilma = (b) => L({ sv: `Hilma · sista dag ${dm(b)}`, fi: `Hilma · viimeinen päivä ${dm(b)}`, en: `Hilma · deadline ${dm(b)}` });
  const permit = (a) => L({ sv: `Kommunens bygglovsbeslut · ${dm(a)}`, fi: `Kunnan rakennuslupapäätös · ${dm(a)}`, en: `Municipal permit decision · ${dm(a)}` });
  const prh = (a) => L({ sv: `PRH · registrerat ${dm(a)}`, fi: `PRH · rekisteröity ${dm(a)}`, en: `Trade register · registered ${dm(a)}` });
  const LEADS = () => [
    { id: 1, t: "hilma", co: L({ sv: "Ekby kommun", fi: "Ekbyn kunta", en: "Ekby municipality" }), reg: "osb", own: "Mikael", ev: hilmaPub(-3, 4),
      sig: L({ sv: "Upphandling: luft-vattenvärmepumpar till Ekby skola och två daghem", fi: "Hankinta: ilma-vesilämpöpumput Ekbyn kouluun ja kahteen päiväkotiin", en: "Tender: air-to-water heat pumps for Ekby school and two daycare centres" }) },
    { id: 2, t: "bygglov", co: "Bostads Ab Solgläntan", reg: "osb", own: "Mikael", ev: permit(-2),
      sig: L({ sv: "Bygglov för bergvärme beviljat för ett hus från 1974", fi: "Maalämmölle myönnetty rakennuslupa, talo vuodelta 1974", en: "Permit granted for ground-source heating in a 1974 building" }) },
    { id: 3, t: "nytt", co: "Solkust Bygg Ab", reg: "osb", own: "Mikael", ev: prh(-2),
      sig: L({ sv: "Nytt byggföretag, sex anställda enligt registret", fi: "Uusi rakennusyritys, rekisterin mukaan kuusi työntekijää", en: "New construction company, six employees per the register" }) },
    { id: 4, t: "annons", co: "Nordhamn Logistik Ab", reg: "osb", own: "Mikael", crm: L({ sv: "Finns i CRM · ny kontakt", fi: "CRM:ssä · uusi kontakti", en: "In CRM · new contact" }),
      ev: L({ sv: `Meta-pixel hittad på webbplatsen · ${dm(-1)}`, fi: `Meta-pikseli löytyi verkkosivuilta · ${dm(-1)}`, en: `Meta pixel found on the website · ${dm(-1)}` }),
      sig: L({ sv: "Annonserar på Meta just nu: ”Nytt lager i Vasa”", fi: "Mainostaa nyt Metassa: ”Uusi varasto Vaasaan”", en: "Advertising on Meta right now: “New warehouse in Vaasa”" }) },
    { id: 5, t: "bygglov", co: "Bostads Ab Tallbacken", reg: "mob", own: "Mikael", ev: permit(-5),
      sig: L({ sv: "Bygglov för solpaneler på två hus", fi: "Rakennuslupa aurinkopaneeleille kahteen taloon", en: "Permit for solar panels on two buildings" }) },
    { id: 6, t: "hilma", co: L({ sv: "Norrby församling", fi: "Norrbyn seurakunta", en: "Norrby parish" }), reg: "mob", own: "Mikael", ev: hilma(16),
      sig: L({ sv: "Upphandling: nytt värmesystem till församlingshemmet", fi: "Hankinta: uusi lämmitysjärjestelmä seurakuntataloon", en: "Tender: new heating system for the parish hall" }) },
    { id: 7, t: "nytt", co: "Fastighets Ab Kustbo", reg: "nyl", own: "Sara", ev: prh(-4), crm: L({ sv: "Finns i CRM · offert skickad", fi: "CRM:ssä · tarjous lähetetty", en: "In CRM · quote sent" }),
      sig: L({ sv: "Nytt fastighetsbolag, uthyrning av bostäder", fi: "Uusi kiinteistöyhtiö, asuntojen vuokraus", en: "New property company, residential rentals" }) },
    { id: 8, t: "annons", co: "Västervik Takservice Ab", reg: "nyl", own: "Sara",
      ev: L({ sv: `Google Ads-tagg hittad på webbplatsen · ${dm(-1)}`, fi: `Google Ads -tagi löytyi verkkosivuilta · ${dm(-1)}`, en: `Google Ads tag found on the website · ${dm(-1)}` }),
      sig: L({ sv: "Annonserar på Google just nu: ”solpaneler på taket”", fi: "Mainostaa nyt Googlessa: ”aurinkopaneelit katolle”", en: "Advertising on Google right now: “solar panels on the roof”" }) },
    { id: 9, t: "bygglov", co: "Fastighets Ab Kvarnbacken", reg: "nyl", own: "Sara", ev: permit(-3),
      sig: L({ sv: "Bygglov för jordvärme och ny teknikcentral", fi: "Rakennuslupa maalämmölle ja uudelle lämmönjakohuoneelle", en: "Permit for ground-source heating and a new plant room" }) },
    { id: 10, t: "hilma", co: L({ sv: "Strandvik stad", fi: "Strandvikin kaupunki", en: "City of Strandvik" }), reg: "abo", own: "Sara", ev: hilma(11), crm: L({ sv: "Finns i CRM · förhandling", fi: "CRM:ssä · neuvottelu", en: "In CRM · negotiation" }),
      sig: L({ sv: "Upphandling: energirenovering av daghemmet Lärkan", fi: "Hankinta: päiväkoti Lärkanin energiaremontti", en: "Tender: energy renovation of Lärkan daycare" }) },
    { id: 11, t: "bygglov", co: "Bostads Ab Fyrbåken", reg: "abo", own: "Sara", ev: permit(-6),
      sig: L({ sv: "Bygglov för luft-vattenvärmepump och nya radiatorer", fi: "Rakennuslupa ilma-vesilämpöpumpulle ja uusille pattereille", en: "Permit for an air-to-water heat pump and new radiators" }) },
    { id: 13, t: "social", co: "Fastighets Ab Havsudden", reg: "osb", own: "Mikael",
      ev: L({ sv: `X · publicerat ${dm(-1)}`, fi: `X · julkaistu ${dm(-1)}`, en: `X · posted ${dm(-1)}` }),
      sig: L({ sv: "Skrev på X: ”Nästa år byter vi bort oljevärmen i alla våra fastigheter”", fi: "Kirjoitti X:ssä: ”Ensi vuonna luovumme öljylämmityksestä kaikissa kiinteistöissämme”", en: "Posted on X: “Next year we're replacing oil heating in all our buildings”" }) },
    { id: 14, t: "social", co: "Kronvik Hotell Ab", reg: "ala", own: "Sara",
      ev: L({ sv: `YouTube · publicerat ${dm(-3)}`, fi: `YouTube · julkaistu ${dm(-3)}`, en: `YouTube · published ${dm(-3)}` }),
      sig: L({ sv: "Ny video på YouTube: tillbyggnad med 40 nya rum planerad till våren", fi: "Uusi video YouTubessa: 40 huoneen laajennus suunnitteilla keväälle", en: "New YouTube video: a 40-room extension planned for spring" }) },
    { id: 12, t: "nytt", co: "Skärgårdens Fastighetsförvaltning Ab", reg: "ala", own: "Sara", ev: prh(-6),
      sig: L({ sv: "Nytt förvaltningsbolag, 14 fastigheter enligt webbplatsen", fi: "Uusi isännöintiyhtiö, verkkosivujen mukaan 14 kiinteistöä", en: "New property management company, 14 buildings per its website" }) },
  ];
  const fresh = () => ({ regions: new Set(["osb", "nyl"]), types: new Set(Object.keys(TYPES)), hideCrm: false, dec: {}, out: {}, mail: false, tasks: { regions: false, approve: false, mail: false } });

  function mount(root) {
    let S = fresh(), lastMail = false, renders = 0;
    const leads = LEADS();
    const visible = () => leads.filter((l) => S.regions.has(l.reg) && S.types.has(l.t) && !(S.hideCrm && l.crm));

    function render() {
      const list = visible();
      const newCount = list.filter((l) => !l.crm).length;
      const reviewed = list.filter((l) => S.dec[l.id]).length;
      const approved = Object.values(S.dec).filter((d) => d === "ok").length;
      const meetings = Object.values(S.out).filter((o) => o === OUTCOMES[2] || o === OUTCOMES[3]).length;
      const mailNow = S.mail;
      const name = L({ sv: "Säljradar", fi: "Myyntitutka", en: "Sales Radar" });
      const nav = [
        { id: "list", label: NAV[0], icon: "radar", current: true },
        { label: NAV[1], icon: "sliders-horizontal", off: true },
        { label: NAV[2], icon: "plug", off: true },
        { label: NAV[3], icon: "history", off: true },
      ];
      const mailButton = `<button type="button" class="ghost" data-a="mail">${icon(S.mail ? "list" : "mail")}${S.mail ? L({ sv: "Tillbaka till listan", fi: "Takaisin listaan", en: "Back to the list" }) : L({ sv: "Visa morgonmejlet", fi: "Näytä aamun sähköposti", en: "Show the morning email" })}</button>`;
      const filters = `
          <div class="filters">
            <span class="lbl">${L({ sv: "Regioner", fi: "Alueet", en: "Regions" })}</span>
            <div class="chips">${Object.entries(REGIONS).map(([k, r]) => `<button type="button" class="chip" data-a="reg" data-v="${k}" aria-pressed="${S.regions.has(k)}">${r}</button>`).join("")}</div>
            <span class="lbl">${L({ sv: "Signaler", fi: "Signaalit", en: "Signals" })}</span>
            <div class="chips">${Object.entries(TYPES).map(([k, v]) => `<button type="button" class="chip" data-a="type" data-v="${k}" aria-pressed="${S.types.has(k)}">${v}</button>`).join("")}
              <button type="button" class="chip" data-a="hidecrm" aria-pressed="${S.hideCrm}">${L({ sv: "Dölj de som finns i CRM", fi: "Piilota CRM:ssä olevat", en: "Hide those already in CRM" })}</button></div>
          </div>`;
      const listHtml = `<div class="radar-list">${list.length ? list.map(lead).join("") : `<div class="placeholder">${L({ sv: "Inga signaler med de här filtren. Välj fler regioner eller signaltyper.", fi: "Näillä suodattimilla ei löytynyt signaaleja. Valitse lisää alueita tai signaalityyppejä.", en: "No signals with these filters. Pick more regions or signal types." })}</div>`}</div>`;
      const week = card(L({ sv: "Den här veckan", fi: "Tällä viikolla", en: "This week" }), "", `<div class="stat-list">
            <div><span>${L({ sv: "Granskade i listan", fi: "Käyty läpi", en: "Reviewed" })}</span><b>${reviewed} / ${list.length}</b></div>
            <div><span>${L({ sv: "Godkända för samtal", fi: "Hyväksytty soittoon", en: "Approved for a call" })}</span><b>${approved}</b></div>
            <div><span>${L({ sv: "Möten och affärer", fi: "Tapaamiset ja kaupat", en: "Meetings and deals" })}</span><b>${meetings}</b></div>
          </div>`, "ax-card--side");
      const body = `
          ${page(`${NAV[0]}`, L({ sv: `${weekday(0).charAt(0).toUpperCase() + weekday(0).slice(1)} ${dm(0)}. ${list.length} signaler, ${newCount} nya, ${list.length - newCount} finns redan i ditt CRM. Uppdaterad kl. 05:30.`, fi: `${weekday(0).charAt(0).toUpperCase() + weekday(0).slice(1)} ${dm(0)}. ${list.length} signaalia, ${newCount} uutta, ${list.length - newCount} on jo CRM:ssäsi. Päivitetty klo 5.30.`, en: `${weekday(0)} ${dm(0)}. ${list.length} signals, ${newCount} new, ${list.length - newCount} already in your CRM. Updated at 05:30.` }), mailButton)}
          <div class="ax-split">
            <div class="ax-col">${S.mail ? mail() : filters + listHtml}</div>
            ${week}
          </div>`;
      const top = window.WF.scrollOf(root);
      root.innerHTML = demoBar(`<button type="button" class="ghost" data-a="reset">${icon("rotate-ccw")}${L({ sv: "Återställ", fi: "Palauta", en: "Reset" })}</button>`)
        + frame({ product: "radar", productName: name, path: "/o/kvarnvik/radar", nav, account: { initials: "MN", name: "Mikael Nyström", role: L({ sv: "Säljare · Användare", fi: "Myyjä · Käyttäjä", en: "Sales · User" }) }, body })
        + guide({
          tasks: [
            { done: S.tasks.regions, text: L({ sv: "Lägg till en region, till exempel Åland", fi: "Lisää alue, esimerkiksi Ahvenanmaa", en: "Add a region, for example Åland" }) },
            { done: S.tasks.approve, text: L({ sv: "Godkänn en rad för samtal och välj ett utfall", fi: "Hyväksy rivi soittoon ja valitse tulos", en: "Approve a row for a call and pick an outcome" }) },
            { done: S.tasks.mail, text: L({ sv: "Öppna morgonmejlet", fi: "Avaa aamun sähköposti", en: "Open the morning email" }) },
          ],
          note: L({ sv: "Varje rad har en källa du kan klicka dig till i den riktiga versionen. Företagen här är påhittade.", fi: "Oikeassa versiossa jokaisen rivin lähteen voi avata. Yritykset ovat keksittyjä.", en: "In the real version every row links to its source. The companies here are made up." }),
        });
      window.WF.restoreScroll(root, top);
      if (renders++ && S.mail !== lastMail) root.querySelector(".app-main")?.classList.add("swap");
      lastMail = mailNow;
    }

    function lead(l) {
      const d = S.dec[l.id];
      const undo = `<button type="button" class="ghost" data-a="undo" data-v="${l.id}">${L({ sv: "Ångra", fi: "Kumoa", en: "Undo" })}</button>`;
      const actions = !d
        ? `<button type="button" class="act" data-a="ok" data-v="${l.id}">${L({ sv: "Godkänn för samtal", fi: "Hyväksy soittoon", en: "Approve for a call" })}</button><button type="button" class="ghost" data-a="skip" data-v="${l.id}">${L({ sv: "Hoppa över", fi: "Ohita", en: "Skip" })}</button>`
        : d === "ok"
          ? `<label class="small muted" for="out-${l.id}">${L({ sv: "Utfall", fi: "Tulos", en: "Outcome" })}</label><select id="out-${l.id}" data-a-sel="${l.id}"><option value="">${L({ sv: "Välj …", fi: "Valitse …", en: "Choose …" })}</option>${OUTCOMES.map((o) => `<option${S.out[l.id] === o ? " selected" : ""}>${o}</option>`).join("")}</select>${undo}`
          : undo;
      return `<div class="lead ${d === "ok" ? "approved" : d === "skip" ? "skipped" : ""}">
        <div class="who"><b>${l.co}</b><span class="tag">${TYPES[l.t]}</span><span class="tag">${REGIONS[l.reg]}</span>${l.crm ? `<span class="tag warn">${l.crm}</span>` : `<span class="tag good">${L({ sv: "Ny", fi: "Uusi", en: "New" })}</span>`}</div>
        <div class="row-actions" style="align-items:center">${actions}</div>
        <div class="sig"><q>${l.sig}</q><small>${l.ev} · ${L({ sv: "ägare", fi: "vastuu", en: "owner" })} ${l.own}</small></div>
      </div>`;
    }

    function mail() {
      const mine = leads.filter((l) => l.own === "Mikael" && !l.crm);
      return `<div class="mail">
        <div class="mail-head"><div><span>${L({ sv: "Från", fi: "Lähettäjä", en: "From" })}</span> ${L({ sv: "Säljradar", fi: "Myyntitutka", en: "Sales Radar" })} &lt;radar@kvarnvik.example&gt;</div><div><span>${L({ sv: "Till", fi: "Vastaanottaja", en: "To" })}</span> Mikael Nyström</div>
        <div><span>${L({ sv: "Ämne", fi: "Aihe", en: "Subject" })}</span> <b>${L({ sv: `${mine.length} nya signaler i dina regioner`, fi: `${mine.length} uutta signaalia alueillasi`, en: `${mine.length} new signals in your regions` })}</b></div></div>
        <div class="mail-body"><p>${L({ sv: `${hello()} Mikael. Här är dagens nya signaler i dina regioner, viktigast först.`, fi: `${hello()} Mikael. Tässä päivän uudet signaalit alueiltasi, tärkein ensin.`, en: `${hello()} Mikael. Here are today's new signals in your regions, most important first.` })}</p>
        ${mine.map((l, i) => `<p><b>${i + 1}. ${l.co}</b>. ${l.sig}.<br><span class="muted small">${l.ev}</span></p>`).join("")}
        <p class="muted small">${L({ sv: "Öppna listan för att godkänna eller hoppa över. Demo: inget mejl skickades.", fi: "Avaa lista hyväksyäksesi tai ohittaaksesi rivejä. Demo: viestiä ei lähetetty.", en: "Open the list to approve or skip. Demo: no email was sent." })}</p></div></div>`;
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b || !root.contains(b)) return;
      const a = b.dataset.a, v = b.dataset.v;
      if (a === "reset") { S = fresh(); render(); toast(root, L({ sv: "Demon är återställd", fi: "Demo palautettu alkuun", en: "The demo has been reset" })); return; }
      if (a === "mail") { S.mail = !S.mail; if (S.mail) S.tasks.mail = true; }
      else if (a === "view") { S.mail = false; }
      else if (a === "reg") { S.regions.has(v) ? S.regions.delete(v) : S.regions.add(v); if (!["osb", "nyl"].includes(v) && S.regions.has(v)) S.tasks.regions = true; }
      else if (a === "type") { S.types.has(v) ? S.types.delete(v) : S.types.add(v); }
      else if (a === "hidecrm") { S.hideCrm = !S.hideCrm; }
      else if (a === "ok") { S.dec[v] = "ok"; }
      else if (a === "skip") { S.dec[v] = "skip"; }
      else if (a === "undo") { delete S.dec[v]; delete S.out[v]; }
      render();
    });
    root.addEventListener("change", (e) => {
      const id = e.target.dataset.aSel; if (!id) return;
      S.out[id] = e.target.value;
      if (e.target.value) { S.tasks.approve = true; toast(root, L({ sv: "Utfallet sparas i Pipedrive i den riktiga versionen", fi: "Oikeassa versiossa tulos tallentuu Pipedriveen", en: "In the real version the outcome is saved to Pipedrive" })); }
      render();
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-demo='radar']").forEach(mount));
})();
