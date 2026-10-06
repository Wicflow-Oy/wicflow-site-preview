/* Website CMS demo: a made-up installation company edits its own website in Wicflow's CMS. Pages, an editor with a
   live preview (type and the page changes, AI can rewrite the intro, publish), visibility in Google and AI search
   (a search preview and an AI-readiness checklist to fix), and the enquiries the site brought in, each passed on to
   Company Brain. In-memory only; nothing is published or sent. Strings are {sv, fi, en}. */
(() => {
  const { L, eur, toast, icon, frame, page, card, demoBar, guide } = window.WF;
  Object.assign(window.WF_ICONS || (window.WF_ICONS = {}), {
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/>',
  });
  const NAME = L({ sv: "Webbplats", fi: "Verkkosivut", en: "Website" });
  const NAV = L({ sv: ["Sidor", "Synlighet", "Förfrågningar", "Media", "Inställningar"], fi: ["Sivut", "Näkyvyys", "Yhteydenotot", "Media", "Asetukset"], en: ["Pages", "Visibility", "Enquiries", "Media", "Settings"] });
  const SITE = "kvarnvik.example";
  const COPY = {
    headline: L({ sv: "Värmepumpar som sänker uppvärmningskostnaden", fi: "Lämpöpumput, jotka laskevat lämmityskuluja", en: "Heat pumps that cut your heating bill" }),
    intro: L({ sv: "Vi installerar luft- och bergvärme i Österbotten, för egnahemshus, bostadsbolag och skolor.", fi: "Asennamme ilma- ja maalämpöä Pohjanmaalla omakotitaloihin, taloyhtiöihin ja kouluihin.", en: "We install air-source and ground-source heating in Ostrobothnia, for homes, housing companies and schools." }),
    button: L({ sv: "Begär en offert", fi: "Pyydä tarjous", en: "Ask for a quote" }),
    ai: L({ sv: ["Vi installerar värmepumpar i Österbotten som betalar sig själva. Få en fast offert inom två arbetsdagar.", "Sänk uppvärmningskostnaden med upp till hälften. Vi sköter allt från besök till driftsättning."],
            fi: ["Asennamme Pohjanmaalla lämpöpumppuja, jotka maksavat itsensä takaisin. Saat kiinteän tarjouksen kahdessa arkipäivässä.", "Laske lämmityskuluja jopa puoleen. Hoidamme kaiken käynnistä käyttöönottoon."],
            en: ["We install heat pumps in Ostrobothnia that pay for themselves. Get a fixed quote within two working days.", "Cut your heating bill by up to half. We handle everything from the first visit to commissioning."] }),
    services: L({ sv: ["Luftvärmepumpar", "Bergvärme", "Service och underhåll"], fi: ["Ilmalämpöpumput", "Maalämpö", "Huolto ja kunnossapito"], en: ["Air-source heat pumps", "Ground-source heating", "Service and maintenance"] }),
    menu: L({ sv: ["Tjänster", "Referenser", "Om oss", "Kontakt"], fi: ["Palvelut", "Referenssit", "Meistä", "Yhteystiedot"], en: ["Services", "References", "About us", "Contact"] }),
  };
  const PAGES = L({ sv: ["Startsida", "Värmepumpar", "Bergvärme", "Referenser", "Om oss", "Kontakt"], fi: ["Etusivu", "Lämpöpumput", "Maalämpö", "Referenssit", "Meistä", "Yhteystiedot"], en: ["Home", "Heat pumps", "Ground-source heating", "References", "About us", "Contact"] });
  const GEO = () => [
    { id: "schema", done: true, t: L({ sv: "Strukturerad data för tjänster och priser", fi: "Rakenteinen data palveluille ja hinnoille", en: "Structured data for services and prices" }) },
    { id: "llms", done: true, t: L({ sv: "llms.txt med en sammanfattning för AI-tjänster", fi: "llms.txt ja tiivistelmä tekoälypalveluille", en: "llms.txt with a summary for AI services" }) },
    { id: "faq", done: false, t: L({ sv: "Vanliga frågor saknas på sidan Värmepumpar", fi: "Usein kysytyt kysymykset puuttuvat Lämpöpumput-sivulta", en: "The Heat pumps page has no common questions" }) },
    { id: "area", done: false, t: L({ sv: "Ortnamnen för ditt område saknas", fi: "Toiminta-alueesi paikkakunnat puuttuvat", en: "The towns you cover aren't named" }) },
  ];
  const LEADS = () => [
    { id: 1, who: "Ab Strandvillan", what: L({ sv: "Luft-vattenvärmepump till ett hus från 1968", fi: "Ilma-vesilämpöpumppu vuoden 1968 taloon", en: "Air-to-water heat pump for a 1968 house" }), via: "form", at: "09:12", value: 14800, owner: "Mikael" },
    { id: 2, who: "Bostads Ab Solgläntan", what: L({ sv: "Frågade AI-chatten om bergvärme för 24 lägenheter", fi: "Kysyi tekoälychatilta maalämmöstä 24 asuntoon", en: "Asked the AI chat about ground-source heating for 24 flats" }), via: "chat", at: "08:40", value: 26400, owner: "Mikael" },
    { id: 3, who: "Karin Wiik", what: L({ sv: "Begär offert på service av två pumpar", fi: "Pyytää tarjousta kahden pumpun huollosta", en: "Wants a quote for servicing two pumps" }), via: "form", at: L({ sv: "i går", fi: "eilen", en: "yesterday" }), value: 1900, owner: "Sara" },
  ];
  const fresh = () => ({ view: "edit", headline: COPY.headline, intro: COPY.intro, button: COPY.button, aiIdx: 0, published: true,
    seoTitle: L({ sv: "Värmepumpar i Österbotten | Kvarnvik VVS", fi: "Lämpöpumput Pohjanmaalla | Kvarnvik VVS", en: "Heat pumps in Ostrobothnia | Kvarnvik VVS" }),
    geo: GEO(), opened: new Set(), tasks: { edit: false, publish: false, geo: false, lead: false } });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function mount(root) {
    let S = fresh(), renders = 0, lastView = "";
    const T = {
      edited: L({ sv: "Ändringar som inte är publicerade", fi: "Julkaisemattomia muutoksia", en: "Unpublished changes" }),
      live: L({ sv: "Publicerad", fi: "Julkaistu", en: "Published" }),
      publish: L({ sv: "Publicera", fi: "Julkaise", en: "Publish" }),
      published: L({ sv: "Publicerad. Sidan är live (demo: inget publicerades)", fi: "Julkaistu. Sivu on nyt näkyvissä (demo: mitään ei julkaistu)", en: "Published. The page is live (demo: nothing was published)" }),
      content: L({ sv: "Innehåll", fi: "Sisältö", en: "Content" }),
      preview: L({ sv: "Förhandsvisning", fi: "Esikatselu", en: "Preview" }),
      fHead: L({ sv: "Rubrik", fi: "Otsikko", en: "Headline" }), fIntro: L({ sv: "Ingress", fi: "Johdanto", en: "Intro" }), fBtn: L({ sv: "Knapp", fi: "Painike", en: "Button" }),
      ai: L({ sv: "Skriv om med AI", fi: "Kirjoita uudelleen tekoälyllä", en: "Rewrite with AI" }),
      aiDone: L({ sv: "AI skrev ett förslag. Ändra det om du vill.", fi: "Tekoäly kirjoitti ehdotuksen. Muokkaa sitä halutessasi.", en: "AI wrote a suggestion. Change it if you like." }),
      edit: L({ sv: "Redigera", fi: "Muokkaa", en: "Edit" }),
      onlyHome: L({ sv: "I demon kan du redigera startsidan", fi: "Demossa voit muokata etusivua", en: "In the demo you can edit the home page" }),
      pagesSub: L({ sv: `${SITE} · 6 sidor på svenska och finska`, fi: `${SITE} · 6 sivua suomeksi ja ruotsiksi`, en: `${SITE} · 6 pages in Finnish and Swedish` }),
      updated: L({ sv: "Uppdaterad", fi: "Päivitetty", en: "Updated" }),
      now: L({ sv: "nu", fi: "nyt", en: "now" }),
      days: (n) => L({ sv: `för ${n} dagar sedan`, fi: `${n} päivää sitten`, en: `${n} days ago` }),
      visSub: L({ sv: "Hur du syns i Google och i AI-sökningar som ChatGPT och Gemini.", fi: "Miten näyt Googlessa ja tekoälyhauissa, kuten ChatGPT:ssä ja Geminissä.", en: "How you show up in Google and in AI search such as ChatGPT and Gemini." }),
      kpis: L({ sv: ["Besökare den här månaden", "Förfrågningar från sidan", "Omnämnd i AI-svar"], fi: ["Kävijöitä tässä kuussa", "Yhteydenottoja sivuilta", "Mainittu tekoälyn vastauksissa"], en: ["Visitors this month", "Enquiries from the site", "Mentioned in AI answers"] }),
      serp: L({ sv: "Så ser du ut i Google", fi: "Näin näyt Googlessa", en: "How you look in Google" }),
      serpTitle: L({ sv: "Titel i sökresultatet", fi: "Otsikko hakutuloksessa", en: "Title in the search result" }),
      ready: L({ sv: "Redo för AI-sökningar", fi: "Valmius tekoälyhakuihin", en: "Ready for AI search" }),
      fix: L({ sv: "Åtgärda", fi: "Korjaa", en: "Fix" }),
      fixed: L({ sv: "Åtgärdat. AI-assistenter läser nu sidan bättre.", fi: "Korjattu. Tekoälyavustajat lukevat sivun nyt paremmin.", en: "Fixed. AI assistants now read the page better." }),
      says: L({ sv: "Vad AI-assistenter säger om dig", fi: "Mitä tekoälyavustajat sanovat sinusta", en: "What AI assistants say about you" }),
      quote: L({ sv: "”Kvarnvik VVS installerar luft- och bergvärme i Österbotten och tar uppdrag för egnahemshus, bostadsbolag och skolor. De ger fasta offerter.”", fi: "”Kvarnvik VVS asentaa ilma- ja maalämpöä Pohjanmaalla omakotitaloihin, taloyhtiöihin ja kouluihin. He antavat kiinteät tarjoukset.”", en: "“Kvarnvik VVS installs air-source and ground-source heating in Ostrobothnia for homes, housing companies and schools. They give fixed quotes.”" }),
      quoteSrc: L({ sv: "Exempel på ett svar i ChatGPT på frågan ”vem installerar värmepumpar i Vasa?”", fi: "Esimerkki ChatGPT:n vastauksesta kysymykseen ”kuka asentaa lämpöpumppuja Vaasassa?”", en: "An example ChatGPT answer to “who installs heat pumps in Vaasa?”" }),
      leadsSub: L({ sv: "Det webbplatsen har gett den här veckan. Varje förfrågan hamnar hos rätt säljare i Company Brain.", fi: "Mitä verkkosivut ovat tuoneet tällä viikolla. Jokainen yhteydenotto päätyy oikealle myyjälle Company Brainiin.", en: "What the website brought in this week. Every enquiry goes to the right salesperson in Company Brain." }),
      pipeline: L({ sv: "Möjliga affärer den här veckan", fi: "Mahdolliset kaupat tällä viikolla", en: "Possible deals this week" }),
      via: { form: L({ sv: "Kontaktformulär", fi: "Yhteydenottolomake", en: "Contact form" }), chat: L({ sv: "AI-chatten", fi: "Tekoälychat", en: "AI chat" }) },
      sent: (o) => L({ sv: `I Company Brain · ${o}`, fi: `Company Brainissa · ${o}`, en: `In Company Brain · ${o}` }),
      open: L({ sv: "Öppna", fi: "Avaa", en: "Open" }),
      openToast: (o) => L({ sv: `I den riktiga versionen finns förfrågan redan på ${o}s lista i Company Brain`, fi: `Oikeassa versiossa yhteydenotto on jo ${o === "Sara" ? "Saran" : "Mikaelin"} listalla Company Brainissa`, en: `In the real version the enquiry is already on ${o}'s list in Company Brain` }),
      reset: L({ sv: "Återställ", fi: "Palauta", en: "Reset" }),
      resetDone: L({ sv: "Demon är återställd", fi: "Demo palautettu alkuun", en: "The demo has been reset" }),
    };

    function preview() {
      return `<div class="cms-prev" data-x="prev">
        <div class="cms-site-top"><b>Kvarnvik VVS</b><span>${COPY.menu.map((m) => `<i>${m}</i>`).join("")}</span></div>
        <div class="cms-site-hero"><h3 data-x="p-head">${esc(S.headline)}</h3><p data-x="p-intro">${esc(S.intro)}</p><span class="cms-site-btn" data-x="p-btn">${esc(S.button)}</span></div>
        <div class="cms-site-tiles">${COPY.services.map((x, i) => `<div><i class="t${i}"></i><b>${x}</b></div>`).join("")}</div>
      </div>`;
    }
    function editView() {
      const status = S.published ? `<span class="tag good">${T.live}</span>` : `<span class="tag warn">${T.edited}</span>`;
      const head = page(PAGES[0], `${SITE} · ${T.updated} ${S.published && !S.tasks.publish ? T.days(3) : T.now}`, `${status}<button type="button" class="act" data-a="publish"${S.published ? " disabled" : ""}>${T.publish}</button>`);
      const fields = `<div class="cms-fields">
          <label>${T.fHead}<input data-f="headline" value="${esc(S.headline)}"></label>
          <label>${T.fIntro}<textarea data-f="intro" rows="4">${esc(S.intro)}</textarea></label>
          <button type="button" class="ghost cms-ai" data-a="ai">${icon("sparkles")}${T.ai}</button>
          <label>${T.fBtn}<input data-f="button" value="${esc(S.button)}"></label>
        </div>`;
      return `${head}<div class="cms-edit">${card(T.content, "", fields)}${card(T.preview, SITE, preview(), "cms-prev-card")}</div>`;
    }
    function pagesView() {
      const rows = PAGES.map((p, i) => `<div class="row${i === 0 ? " act-row" : ""}"><div><div class="t">${p}</div><div class="m">/${i ? p.toLowerCase().replace(/[^a-zåäö0-9]+/g, "-") : ""} · ${T.updated} ${i === 0 && !S.published ? T.now : T.days(i + 2)}</div></div>
        <div class="row-actions"><span class="tag ${i === 0 && !S.published ? "warn" : "good"}">${i === 0 && !S.published ? T.edited : T.live}</span><button type="button" class="ghost" data-a="${i === 0 ? "view" : "only"}" data-v="edit">${icon("pencil")}${T.edit}</button></div></div>`).join("");
      return `${page(NAV[0], T.pagesSub)}<section class="ax-card"><div class="rows">${rows}</div></section>`;
    }
    function visView() {
      const done = S.geo.filter((g) => g.done).length, score = Math.round((done / S.geo.length) * 100);
      const kpis = `<div class="kpis three"><div class="kpi"><span>${T.kpis[0]}</span><b>1 284</b><i>+18 %</i></div><div class="kpi"><span>${T.kpis[1]}</span><b>23</b><i>+6</i></div><div class="kpi"><span>${T.kpis[2]}</span><b>${14 + S.geo.filter((g, i) => g.done && i > 1).length * 3}</b><i>+5</i></div></div>`;
      const serp = `<div class="cms-serp"><span>${SITE} › ${PAGES[1].toLowerCase()}</span><b data-x="serp-t">${esc(S.seoTitle)}</b><p>${esc(S.intro)}</p></div>
        <label class="cms-serp-edit">${T.serpTitle}<input data-f="seoTitle" value="${esc(S.seoTitle)}"></label>`;
      const checks = S.geo.map((g) => `<div class="row ${g.done ? "done-row" : "warn-row"}"><div><div class="t">${g.t}</div></div><div class="row-actions">${g.done ? `<span class="tag good">${icon("check")}OK</span>` : `<button type="button" class="act" data-a="fix" data-v="${g.id}">${T.fix}</button>`}</div></div>`).join("");
      return `${page(NAV[1], T.visSub)}${kpis}
        <div class="ax-split">${card(T.serp, "Google", serp)}${card(T.ready, `${score} %`, `<div class="cms-score"><i style="width:${score}%"></i></div><div class="rows">${checks}</div>`, "ax-card--side")}</div>
        ${card(T.says, "ChatGPT", `<blockquote class="cms-says">${T.quote}<small>${T.quoteSrc}</small></blockquote>`)}`;
    }
    function leadsView() {
      const leads = LEADS();
      const total = leads.reduce((n, l) => n + l.value, 0);
      const rows = leads.map((l) => `<div class="row ${S.opened.has(l.id) ? "done-row" : "act-row"}"><div><div class="t">${l.who}</div><div class="m">${l.what} · ${T.via[l.via]} · ${l.at}</div></div>
        <div class="row-actions"><span class="tag accent">${T.sent(l.owner)}</span><span class="tag">${eur(l.value)}</span><button type="button" class="ghost" data-a="lead" data-v="${l.id}">${T.open}</button></div></div>`).join("");
      return `${page(NAV[2], T.leadsSub)}<div class="kpis three"><div class="kpi"><span>${T.pipeline}</span><b>${eur(total)}</b></div><div class="kpi"><span>${T.kpis[1]}</span><b>3</b></div><div class="kpi"><span>${T.via.chat}</span><b>1</b></div></div>
        <section class="ax-card"><div class="rows">${rows}</div></section>`;
    }

    function render() {
      const nav = [
        { id: "pages", label: NAV[0], icon: "file-text", current: S.view === "pages" || S.view === "edit" },
        { id: "vis", label: NAV[1], icon: "search", current: S.view === "vis", count: S.geo.filter((g) => !g.done).length },
        { id: "leads", label: NAV[2], icon: "inbox", current: S.view === "leads", count: 3 - S.opened.size },
        { label: NAV[3], icon: "image", off: true },
        { label: NAV[4], icon: "settings", off: true },
      ];
      const body = S.view === "edit" ? editView() : S.view === "pages" ? pagesView() : S.view === "vis" ? visView() : leadsView();
      const top = window.WF.scrollOf(root);
      root.innerHTML = demoBar(`<button type="button" class="ghost" data-a="reset">${icon("rotate-ccw")}${T.reset}</button>`)
        + frame({ product: "cms", productName: NAME, path: `/o/kvarnvik/site/${S.view}`, nav, account: { initials: "AK", name: "Anna Kvarnvik", role: L({ sv: "Vd · Admin", fi: "Toimitusjohtaja · Ylläpitäjä", en: "CEO · Admin" }) }, body })
        + guide({
          tasks: [
            { done: S.tasks.edit, text: L({ sv: "Ändra rubriken och se sidan uppdateras", fi: "Muuta otsikkoa ja katso sivun päivittyvän", en: "Change the headline and watch the page update" }) },
            { done: S.tasks.publish, text: L({ sv: "Publicera sidan", fi: "Julkaise sivu", en: "Publish the page" }) },
            { done: S.tasks.geo, text: L({ sv: "Åtgärda en punkt under Synlighet", fi: "Korjaa yksi kohta Näkyvyys-osiossa", en: "Fix one item under Visibility" }) },
            { done: S.tasks.lead, text: L({ sv: "Öppna en förfrågan från webbplatsen", fi: "Avaa yhteydenotto verkkosivuilta", en: "Open an enquiry from the website" }) },
          ],
          done: `<b>${L({ sv: "Så fungerar en webbplats som säljer.", fi: "Näin toimivat myyvät verkkosivut.", en: "That's a website that sells." })}</b> <span>${L({ sv: "Vill du se vad den kunde göra för dig?", fi: "Haluatko nähdä, mitä ne voisivat tehdä sinulle?", en: "Want to see what it could do for you?" })}</span> <a class="act" href="${window.WF.route("contact")}">${L({ sv: "Boka en demo", fi: "Varaa demo", en: "Book a demo" })}</a>`,
          note: L({ sv: "Företaget, sidan och siffrorna är påhittade. Inget publiceras eller skickas.", fi: "Yritys, sivut ja luvut ovat keksittyjä. Mitään ei julkaista eikä lähetetä.", en: "The company, the site and the numbers are made up. Nothing is published or sent." }),
        });
      window.WF.restoreScroll(root, top);
      if (renders++ && S.view !== lastView) root.querySelector(".app-main")?.classList.add("swap");
      lastView = S.view;
    }

    // Typing updates the preview in place, so the field keeps focus.
    root.addEventListener("input", (e) => {
      const f = e.target.dataset.f; if (!f) return;
      S[f] = e.target.value;
      if (f === "seoTitle") { const t = root.querySelector('[data-x="serp-t"]'); if (t) t.textContent = S.seoTitle; return; }
      const el = root.querySelector(`[data-x="p-${f === "headline" ? "head" : f === "intro" ? "intro" : "btn"}"]`);
      if (el) el.textContent = S[f];
      // The first change redraws once (status, publish button, the "try this" list), then the field gets its focus back.
      const redraw = S.published || (f === "headline" && !S.tasks.edit);
      S.published = false;
      if (f === "headline") S.tasks.edit = true;
      if (redraw) {
        const pos = e.target.selectionStart;
        render();
        const again = root.querySelector(`[data-f="${f}"]`);
        if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch { /* not a text field */ } }
      }
    });
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b || !root.contains(b)) return;
      const a = b.dataset.a, v = b.dataset.v;
      if (a === "reset") { S = fresh(); render(); toast(root, T.resetDone); return; }
      if (a === "view") S.view = v;
      else if (a === "only") { toast(root, T.onlyHome); return; }
      else if (a === "publish") { S.published = true; S.tasks.publish = true; toast(root, T.published); }
      else if (a === "ai") { S.intro = COPY.ai[S.aiIdx % COPY.ai.length]; S.aiIdx++; S.published = false; toast(root, T.aiDone); }
      else if (a === "fix") { const g = S.geo.find((x) => x.id === v); if (g) g.done = true; S.tasks.geo = true; toast(root, T.fixed); }
      else if (a === "lead") { const l = LEADS().find((x) => x.id === Number(v)); S.opened.add(Number(v)); S.tasks.lead = true; toast(root, T.openToast(l.owner)); }
      render();
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-demo='cms']").forEach(mount));
})();
