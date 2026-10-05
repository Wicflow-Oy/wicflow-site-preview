/* Company Brain demo. Fictional company, in-memory only: a reload or the reset button starts over.
   Every visible string is {sv, fi, en}; WF.L picks the page language. */
(() => {
  const { L, dm, weekday, onDay, month, cap, eur, esc, hello, route, toast, lang, icon, frame, page, card, demoBar, guide } = window.WF;
  const STAGES = L({ sv: ["Ny kontakt", "Offert skickad", "Förhandling", "Vunnen"], fi: ["Uusi kontakti", "Tarjous lähetetty", "Neuvottelu", "Voitettu"], en: ["New contact", "Quote sent", "Negotiation", "Won"] });
  const WON_BEFORE = 17800;
  const QUOTE_LINES = [
    [L({ sv: "Luft-vattenvärmepump 12 kW", fi: "Ilma-vesilämpöpumppu 12 kW", en: "Air-to-water heat pump 12 kW" }), L({ sv: "2 st", fi: "2 kpl", en: "2 pcs" }), 9800],
    [L({ sv: "Installation och driftsättning", fi: "Asennus ja käyttöönotto", en: "Installation and commissioning" }), "", 4200],
    [L({ sv: "Demontering av oljepanna", fi: "Öljykattilan purku", en: "Removal of the oil boiler" }), "", 1900],
    [L({ sv: "Elarbeten", fi: "Sähkötyöt", en: "Electrical work" }), "", 1320],
    [L({ sv: "Frakt och lyft", fi: "Rahti ja nosto", en: "Freight and lifting" }), "", 1200],
  ];
  const quoteTotal = QUOTE_LINES.reduce((a, l) => a + l[2], 0);
  const T = {
    sample: L({ sv: "Exempeldata", fi: "Esimerkkidata", en: "Sample data" }),
    showAs: L({ sv: "Visa som", fi: "Näytä roolina", en: "View as" }),
    ceo: L({ sv: "Anna, vd", fi: "Anna, toimitusjohtaja", en: "Anna, CEO" }),
    seller: L({ sv: "Mikael, säljare", fi: "Mikael, myyjä", en: "Mikael, sales" }),
    reset: L({ sv: "Återställ", fi: "Palauta", en: "Reset" }),
    resetDone: L({ sv: "Demon är återställd", fi: "Demo palautettu alkuun", en: "The demo has been reset" }),
    notInDemo: L({ sv: "ej i demon", fi: "ei demossa", en: "not in demo" }),
    nav: L({ sv: ["Idag", "Affärer", "Fråga", "Offerter", "Kopplingar", "Meddelanden", "Värderapport"], fi: ["Tänään", "Kaupat", "Kysy", "Tarjoukset", "Yhteydet", "Viestit", "Arvoraportti"], en: ["Today", "Deals", "Ask", "Quotes", "Connectors", "Messages", "Value report"] }),
    nothingSent: L({ sv: "Demo: inget skickades", fi: "Demo: mitään ei lähetetty", en: "Demo: nothing was sent" }),
    done: L({ sv: "Klart", fi: "Valmis", en: "Done" }),
  };

  const fresh = () => ({
    view: "today", role: "vd", quoteOpen: null, preview: false, askQ: null, free: "",
    quote: "wait", assigned: false, reminded: false, sellerDone: {},
    conns: { mail: "on", crm: "on", cal: "on", netvisor: "off", form: "off" },
    tasks: { quote: false, ask: false, netvisor: false },
    moved: null,
    deals: [
      { id: "d1", n: "Bostads Ab Strandgården", v: 18420, o: "MN", s: 1 },
      { id: "d6", n: "Bostads Ab Solbacken", v: 15300, o: "MN", s: 0 },
      { id: "d5", n: "Lövdal Lantbruk", v: 12600, o: "SL", s: 0 },
      { id: "d8", n: "Nordhamn Logistik Ab", v: 9900, o: "SL", s: 0 },
      { id: "d2", n: "Bostads Ab Havsbrisen", v: 22900, o: "MN", s: 1 },
      { id: "d3", n: "Fastighets Ab Kustbo", v: 8450, o: "SL", s: 1 },
      { id: "d4", n: L({ sv: "Ekby simhall", fi: "Ekbyn uimahalli", en: "Ekby swimming hall" }), v: 41200, o: "MN", s: 2 },
      { id: "d7", n: L({ sv: "Strandvik stad, daghem Lärkan", fi: "Strandvikin kaupunki, päiväkoti Lärkan", en: "City of Strandvik, Lärkan daycare" }), v: 36800, o: "SL", s: 2 },
      { id: "d9", n: "Bostads Ab Tallmon", v: 17100, o: "MN", s: 3 },
      { id: "d10", n: "Vikby Bilservice", v: 6400, o: "SL", s: 3 },
    ],
  });

  function mount(root) {
    let S = fresh();
    const won = () => WON_BEFORE + S.deals.filter((d) => d.s === 3).reduce((a, d) => a + d.v, 0);
    const pipe = () => S.deals.filter((d) => d.s === 1 || d.s === 2).reduce((a, d) => a + d.v, 0);
    const open = () => 15 + S.deals.filter((d) => d.s < 3).length;
    const doneCount = () => Object.values(S.tasks).filter(Boolean).length;
    const VIEWS = ["today", "deals", "ask", "quotes", "conns"];
    const left = () => (S.quote === "wait" ? 1 : 0) + (S.assigned ? 0 : 1) + (S.reminded ? 0 : 1);
    const navCount = (id) => (id === "today" ? left() : id === "quotes" && S.quote === "wait" ? 1 : 0);
    const head = (title, sub, actions) => page(title, sub, actions);
    const NAV_ICONS = ["brain", "handshake", "message-circle-question-mark", "file-text", "plug"];
    const PATHS = { today: "", deals: "/deals", ask: "/ask", quotes: "/quotes", conns: "/connectors" };

    function shell() {
      const nav = [
        ...VIEWS.map((id, i) => ({ id, label: T.nav[i], icon: NAV_ICONS[i], current: S.view === id, count: navCount(id) })),
        { label: T.nav[5], icon: "messages-square", off: true },
        { label: T.nav[6], icon: "chart-column", off: true },
      ];
      const account = S.role === "vd"
        ? { initials: "AK", name: "Anna Kvarnvik", role: L({ sv: "Vd · Admin", fi: "Toimitusjohtaja · Admin", en: "CEO · Admin" }) }
        : { initials: "MN", name: "Mikael Nyström", role: L({ sv: "Säljare · Användare", fi: "Myyjä · Käyttäjä", en: "Sales · User" }) };
      const controls = `
        <div class="seg" role="group" aria-label="${T.showAs}">
          <button type="button" data-a="role" data-v="vd" aria-pressed="${S.role === "vd"}">${T.ceo}</button>
          <button type="button" data-a="role" data-v="seller" aria-pressed="${S.role === "seller"}">${T.seller}</button>
        </div>
        <button type="button" class="ghost" data-a="reset">${icon("rotate-ccw")}${T.reset}</button>`;
      return demoBar(controls)
        + frame({ product: "brain", productName: "Company Brain", path: `/o/kvarnvik/brain${PATHS[S.view] || ""}`, nav, account, body: main() })
        + side();
    }

    function main() {
      if (S.view === "today") return S.role === "vd" ? todayVd() : todaySeller();
      if (S.view === "deals") return deals();
      if (S.view === "ask") return ask();
      if (S.view === "quotes") return S.quoteOpen ? quoteDetail() : quotes();
      return conns();
    }

    const row = (cls, t, m, actions) => `<div class="row ${cls}"><div><div class="t">${t}</div><div class="m">${m}</div></div><div class="row-actions">${actions}</div></div>`;

    function todayVd() {
      const items = [];
      if (S.quote === "wait") items.push(row("act-row",
        L({ sv: "Offerten till Bostads Ab Strandgården väntar på ditt godkännande", fi: "Tarjous: Bostads Ab Strandgården odottaa hyväksyntääsi", en: "The quote for Bostads Ab Strandgården is waiting for your approval" }),
        `${eur(quoteTotal)} · Mikael Nyström · ${L({ sv: "skapad i går", fi: "luotu eilen", en: "created yesterday" })}`,
        `<button type="button" class="act" data-a="openquote">${L({ sv: "Öppna offerten", fi: "Avaa tarjous", en: "Open the quote" })}</button>`));
      else if (S.quote === "sent") items.push(row("act-row",
        L({ sv: "Offerten till Strandgården är skickad för e-signering", fi: "Strandgårdenin tarjous on lähetetty sähköisesti allekirjoitettavaksi", en: "The Strandgården quote has been sent for e-signature" }),
        L({ sv: "Väntar på kundens underskrift", fi: "Odottaa asiakkaan allekirjoitusta", en: "Waiting for the customer's signature" }),
        `<span class="tag accent">${L({ sv: "Skickad", fi: "Lähetetty", en: "Sent" })}</span>`));
      else items.push(row("done-row",
        L({ sv: "Strandgården har signerat offerten", fi: "Strandgården allekirjoitti tarjouksen", en: "Strandgården signed the quote" }),
        L({ sv: `${eur(quoteTotal)} flyttat till Vunnen`, fi: `${eur(quoteTotal)} siirretty voitettuihin`, en: `${eur(quoteTotal)} moved to Won` }),
        `<span class="tag good">${STAGES[3]}</span>`));
      items.push(S.assigned
        ? row("done-row", L({ sv: "Mikael äger anbudet för Ekby skola", fi: "Ekbyn koulun tarjouskilpailu on nyt Mikaelin vastuulla", en: "Mikael owns the Ekby school tender" }),
            L({ sv: "Han ser det överst på sin lista i morgon bitti", fi: "Hän näkee sen listansa kärjessä huomisaamuna", en: "He'll see it at the top of his list tomorrow morning" }), `<span class="tag good">${T.done}</span>`)
        : row("warn-row", L({ sv: `Anbudet för Ekby skola stänger ${onDay(4)} ${dm(4)}`, fi: `Ekbyn koulun tarjouskilpailu päättyy ${onDay(4)} ${dm(4)}`, en: `The Ekby school tender closes ${onDay(4)}, ${dm(4)}` }),
            L({ sv: "Hilma · värmepumpar till tre fastigheter · ingen ansvarig ännu", fi: "Hilma · lämpöpumput kolmeen kiinteistöön · ei vielä vastuuhenkilöä", en: "Hilma · heat pumps for three buildings · no owner yet" }),
            `<button type="button" class="ghost" data-a="assign">${L({ sv: "Ge till Mikael", fi: "Anna Mikaelille", en: "Give to Mikael" })}</button>`));
      items.push(S.reminded
        ? row("done-row", L({ sv: "Sara har fått en påminnelse om Lövdal Lantbruk", fi: "Sara sai muistutuksen Lövdal Lantbrukista", en: "Sara has been reminded about Lövdal Lantbruk" }), T.nothingSent, `<span class="tag good">${T.done}</span>`)
        : row("warn-row", L({ sv: "Lövdal Lantbruk har väntat på svar i 6 dagar", fi: "Lövdal Lantbruk on odottanut vastausta 6 päivää", en: "Lövdal Lantbruk has waited 6 days for a reply" }),
            L({ sv: `Sara Lindholm · deras senaste mejl kom ${dm(-6)}`, fi: `Sara Lindholm · heidän viimeisin viestinsä tuli ${dm(-6)}`, en: `Sara Lindholm · their last email came ${dm(-6)}` }),
            `<button type="button" class="ghost" data-a="remind">${L({ sv: "Påminn Sara", fi: "Muistuta Saraa", en: "Remind Sara" })}</button>`));
      const n = left();
      const count = L({
        sv: ["Allt som behövde dig i dag är klart.", "En sak behöver dig i dag.", "Två saker behöver dig i dag.", "Tre saker behöver dig i dag."],
        fi: ["Kaikki tämän päivän asiat on hoidettu.", "Yksi asia odottaa sinua tänään.", "Kaksi asiaa odottaa sinua tänään.", "Kolme asiaa odottaa sinua tänään."],
        en: ["Everything that needed you today is done.", "One thing needs you today.", "Two things need you today.", "Three things need you today."],
      })[n];
      const wonLabel = L({ sv: `Vunnet i ${month(0)}`, fi: "Voitettu tässä kuussa", en: `Won in ${month(0)}` });
      return `
        ${head(T.nav[0], `${hello()}, Anna. ${count}`)}
        <div class="kpis">
          <div class="kpi"><span>${L({ sv: "Öppna affärer", fi: "Avoimet kaupat", en: "Open deals" })}</span><b>${open()}</b></div>
          <div class="kpi"><span>${L({ sv: "Offertstock", fi: "Tarjouskanta", en: "Quote pipeline" })}</span><b>${eur(pipe())}</b></div>
          <div class="kpi"><span>${wonLabel}</span><b>${eur(won())}</b>${S.quote === "signed" ? `<i>+${eur(quoteTotal)} ${L({ sv: "i dag", fi: "tänään", en: "today" })}</i>` : ""}</div>
          <div class="kpi"><span>${L({ sv: "Svarstid på förfrågningar", fi: "Vastausaika tarjouspyyntöihin", en: "Reply time to enquiries" })}</span><b>3 h 40 min</b></div>
        </div>
        <div class="ax-split">
        ${card(L({ sv: "Behöver dig", fi: "Odottaa sinua", en: "Needs you" }), L({ sv: n === 1 ? "1 sak" : `${n} saker`, fi: n === 1 ? "1 asia" : `${n} asiaa`, en: n === 1 ? "1 item" : `${n} items` }), `<div class="rows">${items.join("")}</div>`)}
        ${card(L({ sv: "Kalender", fi: "Kalenteri", en: "Calendar" }), `${cap(weekday(0))} ${dm(0)}`, `<div class="cal">
            <div><time>09:00</time><span>${L({ sv: "Platsbesök", fi: "Kohdekäynti", en: "Site visit" })}, Bostads Ab Solbacken · Jonas</span></div>
            <div><time>11:30</time><span>${L({ sv: "Telefonmöte, Strandvik stad", fi: "Puhelinpalaveri, Strandvikin kaupunki", en: "Phone meeting, City of Strandvik" })} · Sara</span></div>
            <div><time>14:00</time><span>${L({ sv: "Installation klar", fi: "Asennus valmis", en: "Installation finished" })}, Bostads Ab Tallmon · Jonas</span></div>
          </div>`, "ax-card--side")}
        </div>
        <p class="ax-foot">${L({ sv: "Sammanställt kl. 06:00 från e-post, Pipedrive, kalendern och Hilma", fi: "Koottu klo 6.00 sähköpostista, Pipedrivesta, kalenterista ja Hilmasta", en: "Compiled at 06:00 from email, Pipedrive, the calendar and Hilma" })}</p>`;
    }

    function todaySeller() {
      const calls = [
        ["c1", L({ sv: "Ring Karin Wiik, Bostads Ab Solgläntan", fi: "Soita Karin Wiikille, Bostads Ab Solgläntan", en: "Call Karin Wiik, Bostads Ab Solgläntan" }),
          L({ sv: "Svarade på mejlet: ”Torsdag efter 13 passar bra”", fi: "Vastasi viestiin: ”Torstaina klo 13 jälkeen sopii”", en: "Replied to the email: “Thursday after 1 pm works”" })],
        ["c2", L({ sv: "Ring Ekby kommun om anbudet", fi: "Soita Ekbyn kunnalle tarjouskilpailusta", en: "Call Ekby municipality about the tender" }),
          L({ sv: `Hilma · stänger ${onDay(4)} ${dm(4)}`, fi: `Hilma · päättyy ${onDay(4)} ${dm(4)}`, en: `Hilma · closes ${onDay(4)}, ${dm(4)}` })],
        ["c3", L({ sv: "Följ upp offerten till Havsbrisen", fi: "Seuraa Havsbrisenin tarjousta", en: "Follow up the Havsbrisen quote" }),
          L({ sv: `Skickad för 12 dagar sedan · ${eur(22900)}`, fi: `Lähetetty 12 päivää sitten · ${eur(22900)}`, en: `Sent 12 days ago · ${eur(22900)}` })],
        ["c4", L({ sv: "Ny i Säljradarn: Solkust Bygg Ab", fi: "Uusi Myyntitutkassa: Solkust Bygg Ab", en: "New in Sales Radar: Solkust Bygg Ab" }),
          L({ sv: `Nytt byggföretag i PRH, registrerat ${dm(-2)}`, fi: `Uusi rakennusyritys PRH:ssa, rekisteröity ${dm(-2)}`, en: `New construction company in the trade register, registered ${dm(-2)}` })],
        ["c5", L({ sv: "Boka platsbesök hos Bostads Ab Solbacken", fi: "Varaa kohdekäynti: Bostads Ab Solbacken", en: "Book a site visit at Bostads Ab Solbacken" }),
          L({ sv: "Jonas har tid på fredag förmiddag", fi: "Jonaksella on aikaa perjantaiaamupäivänä", en: "Jonas is free on Friday morning" })],
      ];
      const n = calls.filter(([id]) => !S.sellerDone[id]).length;
      const title = n
        ? L({ sv: `${hello()}, Mikael. ${n} samtal i dag, viktigast först.`, fi: `${hello()}, Mikael. Tänään ${n} soittoa, tärkein ensin.`, en: `${hello()}, Mikael. ${n} calls today, most important first.` })
        : L({ sv: `${hello()}, Mikael. Dagens lista är klar.`, fi: `${hello()}, Mikael. Päivän lista on valmis.`, en: `${hello()}, Mikael. Today's list is done.` });
      const callList = `<div class="rows">${calls.map(([id, t, m]) => row(S.sellerDone[id] ? "done-row dim" : "act-row", t, m,
          `<button type="button" class="ghost" data-a="sdone" data-v="${id}">${S.sellerDone[id] ? L({ sv: "Ångra", fi: "Kumoa", en: "Undo" }) : T.done}</button>`)).join("")}</div>`;
      return `
        ${head(T.nav[0], title)}
        <div class="kpis">
          <div class="kpi"><span>${L({ sv: "Mina öppna affärer", fi: "Omat avoimet kaupat", en: "My open deals" })}</span><b>${S.deals.filter((d) => d.o === "MN" && d.s < 3).length + 3}</b></div>
          <div class="kpi"><span>${L({ sv: "Min offertstock", fi: "Oma tarjouskanta", en: "My quote pipeline" })}</span><b>${eur(S.deals.filter((d) => d.o === "MN" && (d.s === 1 || d.s === 2)).reduce((a, d) => a + d.v, 0))}</b></div>
          <div class="kpi"><span>${L({ sv: "Samtal denna vecka", fi: "Soitot tällä viikolla", en: "Calls this week" })}</span><b>${18 + Object.values(S.sellerDone).filter(Boolean).length}</b></div>
          <div class="kpi"><span>${L({ sv: "Möten bokade", fi: "Varatut tapaamiset", en: "Meetings booked" })}</span><b>4</b></div>
        </div>
        ${card(L({ sv: "Dagens samtal", fi: "Päivän soitot", en: "Today's calls" }), L({ sv: "Säljradar · prospektering · dina affärer", fi: "Myyntitutka · prospektointi · kaupat", en: "Sales Radar · Outreach · your deals" }), callList)}`;
    }

    function deals() {
      return `
        ${head(T.nav[1], L({ sv: "Klicka på pilen för att flytta en affär ett steg. Allt synkas till Pipedrive i den riktiga versionen.", fi: "Siirrä kauppaa askel eteenpäin nuolesta. Oikeassa versiossa kaikki synkronoituu Pipedriveen.", en: "Click the arrow to move a deal one step. In the real version everything syncs to Pipedrive." }))}
        <div class="board">${STAGES.map((st, i) => {
          const list = S.deals.filter((d) => d.s === i);
          return `<div class="col"><header>${st}<span>${eur(list.reduce((a, d) => a + d.v, 0))}</span></header>${list.map((d) => `
            <div class="deal${S.moved === d.id ? " moved" : ""}"><b>${d.n}</b><div class="v"><span>${eur(d.v)} · ${d.o}</span>${i < 3 ? `<button type="button" data-a="move" data-v="${d.id}" aria-label="${L({ sv: "Flytta till", fi: "Siirrä vaiheeseen", en: "Move to" })} ${STAGES[i + 1]}">→</button>` : ""}</div></div>`).join("")}</div>`;
        }).join("")}</div>`;
    }

    const src = (list) => `<div class="sources">${L({ sv: "Källor:", fi: "Lähteet:", en: "Sources:" })} ${list.map((s) => `<span class="tag">${s}</span>`).join("")}</div>`;
    const ANSWERS = {
      q1: {
        q: L({ sv: "Vilka offerter är äldre än en vecka?", fi: "Mitkä tarjoukset ovat yli viikon vanhoja?", en: "Which quotes are older than a week?" }),
        html: () => `<p>${L({ sv: "Tre offerter har väntat på svar i mer än sju dagar. Havsbrisen är den största och har inte öppnat det senaste mejlet.", fi: "Kolme tarjousta on odottanut vastausta yli seitsemän päivää. Havsbrisen on suurin, eikä se ole avannut viimeisintä viestiä.", en: "Three quotes have waited more than seven days for a reply. Havsbrisen is the largest and hasn't opened the latest email." })}</p>
          <div class="table-scroll"><table class="mini-table"><thead><tr>${L({ sv: ["Kund", "Väntat", "Värde", "Ägare"], fi: ["Asiakas", "Odottanut", "Arvo", "Vastuu"], en: ["Customer", "Waiting", "Value", "Owner"] }).map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
          <tr><td>Bostads Ab Havsbrisen</td><td class="n">12 ${L({ sv: "d", fi: "pv", en: "d" })}</td><td class="n">${eur(22900)}</td><td>Mikael</td></tr>
          <tr><td>Fastighets Ab Kustbo</td><td class="n">9 ${L({ sv: "d", fi: "pv", en: "d" })}</td><td class="n">${eur(8450)}</td><td>Sara</td></tr>
          <tr><td>${S.deals.find((d) => d.id === "d4").n}</td><td class="n">8 ${L({ sv: "d", fi: "pv", en: "d" })}</td><td class="n">${eur(41200)}</td><td>Mikael</td></tr></tbody></table></div>`,
        src: L({ sv: ["Offertregistret", "Pipedrive", "E-post"], fi: ["Tarjousrekisteri", "Pipedrive", "Sähköposti"], en: ["Quote register", "Pipedrive", "Email"] }),
      },
      q2: {
        q: L({ sv: `Hur går ${month(0)} jämfört med ${month(-1)}?`, fi: "Miten tämä kuu menee verrattuna edelliseen?", en: `How is ${month(0)} going compared with ${month(-1)}?` }),
        html: () => `<p>${L({
          sv: `Du har vunnit ${eur(won())} hittills i ${month(0)}, mot ${eur(86300)} under hela ${month(-1)}. Med nuvarande offertstock och din vinstandel på 34 % landar ${month(0)} kring ${eur(92000)}.`,
          fi: `Tässä kuussa on voitettu ${eur(won())}, kun koko edellisenä kuuna voitettiin ${eur(86300)}. Nykyisellä tarjouskannalla ja 34 %:n voittoprosentilla koko kuun arvio on noin ${eur(92000)}.`,
          en: `You've won ${eur(won())} so far in ${month(0)}, against ${eur(86300)} in all of ${month(-1)}. With the current pipeline and your 34% win rate, ${month(0)} lands around ${eur(92000)}.` })}</p>`,
        src: L({ sv: ["Netvisor, fakturor", "Pipedrive"], fi: ["Netvisor, laskut", "Pipedrive"], en: ["Netvisor, invoices", "Pipedrive"] }),
      },
      q3: {
        q: L({ sv: "Vem har mest på sitt bord den här veckan?", fi: "Kenellä on eniten töitä tällä viikolla?", en: "Who has the most on their plate this week?" }),
        html: () => `<div class="table-scroll"><table class="mini-table"><thead><tr>${L({ sv: ["Person", "Öppna uppgifter", "Möten"], fi: ["Henkilö", "Avoimet tehtävät", "Tapaamiset"], en: ["Person", "Open tasks", "Meetings"] }).map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
          <tr><td>Mikael Nyström</td><td class="n">14</td><td class="n">5</td></tr><tr><td>Sara Lindholm</td><td class="n">9</td><td class="n">3</td></tr><tr><td>Jonas Back (${L({ sv: "installation", fi: "asennus", en: "installation" })})</td><td class="n">6</td><td class="n">4</td></tr></tbody></table></div>
          <p class="small muted">${L({ sv: `Mikael har dessutom anbudet för Ekby skola som stänger ${onDay(4)}.`, fi: `Mikaelilla on lisäksi Ekbyn koulun tarjouskilpailu, joka päättyy ${onDay(4)}.`, en: `Mikael also has the Ekby school tender, which closes ${onDay(4)}.` })}</p>`,
        src: L({ sv: ["Kalendern", "Pipedrive"], fi: ["Kalenteri", "Pipedrive"], en: ["Calendar", "Pipedrive"] }),
      },
    };

    function ask() {
      const a = S.askQ && ANSWERS[S.askQ];
      return `
        ${head(L({ sv: "Fråga din verksamhet", fi: "Kysy yrityksestäsi", en: "Ask about your business" }), L({ sv: "Svaren bygger på dina egna system och visar alltid källan.", fi: "Vastaukset perustuvat omiin järjestelmiisi ja näyttävät aina lähteen.", en: "Answers come from your own systems and always show the source." }))}
        <div class="chips">${Object.entries(ANSWERS).map(([k, v]) => `<button type="button" class="chip" data-a="ask" data-v="${k}" aria-pressed="${S.askQ === k}">${v.q}</button>`).join("")}</div>
        <form class="ask-box" data-a-form="free"><input id="brain-free" aria-label="${L({ sv: "Egen fråga", fi: "Oma kysymys", en: "Your own question" })}" placeholder="${L({ sv: "Skriv en egen fråga …", fi: "Kirjoita oma kysymys …", en: "Type your own question …" })}" value="${esc(S.free)}"><button class="act" type="submit">${T.nav[2]}</button></form>
        ${a ? `<div class="answer"><div class="q">${a.q}</div>${a.html()}${src(a.src)}</div>` : ""}
        ${!a && S.free ? `<div class="answer"><div class="q">${esc(S.free)}</div><p>${L({ sv: "I demon svarar den bara på de färdiga frågorna ovan. Den riktiga Company Brain svarar utifrån dina egna mejl, affärer, fakturor och dokument.", fi: "Demossa se vastaa vain yllä oleviin valmiisiin kysymyksiin. Oikea Company Brain vastaa yrityksesi omien sähköpostien, kauppojen, laskujen ja asiakirjojen pohjalta.", en: "In the demo it only answers the preset questions above. The real Company Brain answers from your own emails, deals, invoices and documents." })}</p></div>` : ""}`;
    }

    const quoteStatus = () => S.quote === "wait"
      ? `<span class="tag warn">${L({ sv: "Väntar på godkännande", fi: "Odottaa hyväksyntää", en: "Awaiting approval" })}</span>`
      : S.quote === "sent" ? `<span class="tag accent">${L({ sv: "Skickad för signering", fi: "Allekirjoitettavana", en: "Out for signature" })}</span>`
        : `<span class="tag good">${L({ sv: "Signerad", fi: "Allekirjoitettu", en: "Signed" })}</span>`;

    function quotes() {
      const sent = (d) => `<span class="tag">${L({ sv: `Skickad · ${d} d`, fi: `Lähetetty · ${d} pv`, en: `Sent · ${d} d` })}</span>`;
      const q = (n, v, tag, openable) => row("act-row", n, eur(v), `${tag}<button type="button" class="ghost" data-a="${openable ? "openquote" : "nudge"}">${openable ? L({ sv: "Öppna", fi: "Avaa", en: "Open" }) : L({ sv: "Påminn kunden", fi: "Muistuta asiakasta", en: "Remind the customer" })}</button>`);
      return `
        ${head(T.nav[3], L({ sv: "Offerter skapas från affären, godkänns av vd och skickas för e-signering.", fi: "Tarjoukset luodaan kaupasta, toimitusjohtaja hyväksyy ne ja ne lähtevät sähköisesti allekirjoitettaviksi.", en: "Quotes are created from the deal, approved by the CEO and sent for e-signature." }))}
        ${card("", "", `<div class="rows">${q("Bostads Ab Strandgården", quoteTotal, quoteStatus(), true)}
        ${q("Bostads Ab Havsbrisen", 22900, sent(12))}${q("Fastighets Ab Kustbo", 8450, sent(9))}${q(S.deals.find((d) => d.id === "d4").n, 41200, sent(8))}</div>`)}`;
    }

    function quoteDetail() {
      const status = S.quote === "sent" ? `<span class="tag accent">${L({ sv: "Skickad för e-signering", fi: "Lähetetty allekirjoitettavaksi", en: "Sent for e-signature" })} · ${T.nothingSent}</span>`
        : `<span class="tag good">${L({ sv: "Signerad av kunden (simulerat)", fi: "Asiakas allekirjoitti (simuloitu)", en: "Signed by the customer (simulated)" })}</span>`;
      const cols = L({ sv: ["Rad", "Antal", "Pris"], fi: ["Rivi", "Määrä", "Hinta"], en: ["Line", "Qty", "Price"] });
      const total = L({ sv: "Totalt", fi: "Yhteensä", en: "Total" });
      return `
        <button type="button" class="ax-back" data-a="closequote">${icon("chevron-left")}${L({ sv: "Alla offerter", fi: "Kaikki tarjoukset", en: "All quotes" })}</button>
        ${head(L({ sv: "Offert till Bostads Ab Strandgården", fi: "Tarjous: Bostads Ab Strandgården", en: "Quote for Bostads Ab Strandgården" }), L({ sv: "Byte från oljevärme till två luft-vattenvärmepumpar · skapad av Mikael Nyström i går", fi: "Öljylämmityksestä kahteen ilma-vesilämpöpumppuun · luonut Mikael Nyström eilen", en: "Switch from oil heating to two air-to-water heat pumps · created by Mikael Nyström yesterday" }), quoteStatus())}
        <section class="ax-card"><div class="table-scroll"><table class="mini-table"><thead><tr><th>${cols[0]}</th><th>${cols[1]}</th><th style="text-align:right">${cols[2]}</th></tr></thead><tbody>
        ${QUOTE_LINES.map((l) => `<tr><td>${l[0]}</td><td>${l[1]}</td><td class="n">${eur(l[2])}</td></tr>`).join("")}
        <tr><td><b>${total}</b></td><td class="muted">${L({ sv: "+ moms 25,5 %", fi: "+ alv 25,5 %", en: "+ VAT 25.5%" })}</td><td class="n"><b>${eur(quoteTotal)}</b></td></tr></tbody></table></div></section>
        <div class="btn-row">
          <button type="button" class="ghost" data-a="preview">${S.preview ? L({ sv: "Dölj PDF", fi: "Piilota PDF", en: "Hide PDF" }) : L({ sv: "Förhandsgranska PDF", fi: "Esikatsele PDF", en: "Preview PDF" })}</button>
          ${S.quote === "wait" ? `<button type="button" class="act" data-a="approve">${L({ sv: "Godkänn och skicka för e-signering", fi: "Hyväksy ja lähetä allekirjoitettavaksi", en: "Approve and send for e-signature" })}</button>` : status}
        </div>
        ${S.preview ? `<div class="doc"><div class="doc-head"><div><h6>${L({ sv: "Offert", fi: "Tarjous", en: "Quote" })} 2026-114</h6><div>Kvarnvik Värme &amp; Sol Ab</div></div><div style="text-align:right">Bostads Ab Strandgården<br>${L({ sv: "Giltig till", fi: "Voimassa", en: "Valid until" })} ${dm(30)}</div></div>
          <table class="mini-table"><tbody>${QUOTE_LINES.map((l) => `<tr><td>${l[0]} ${l[1]}</td><td class="n">${eur(l[2])}</td></tr>`).join("")}<tr><td><b>${L({ sv: "Totalt, moms 0 %", fi: "Yhteensä, alv 0 %", en: "Total, excl. VAT" })}</b></td><td class="n"><b>${eur(quoteTotal)}</b></td></tr></tbody></table>
          <p style="margin-top:12px;color:#75757f">${L({ sv: "Underskrift via e-signering. Exempeldokument i en demo.", fi: "Allekirjoitus sähköisesti. Esimerkkiasiakirja demossa.", en: "Signed electronically. Sample document in a demo." })}</p></div>` : ""}`;
    }

    const CONNS = [
      ["mail", L({ sv: "E-post", fi: "Sähköposti", en: "Email" }), "i-outlook.svg",
        L({ sv: "Avsändare, ämne och datum för mejl från kunder", fi: "asiakkaiden viestien lähettäjän, aiheen ja päivän", en: "Sender, subject and date of customer emails" }),
        L({ sv: "Läser privata mejl, skickar något själv", fi: "lue yksityisiä viestejä eikä lähetä mitään itse", en: "Reads private email or sends anything itself" })],
      ["crm", "Pipedrive", "i-pipedrive.png",
        L({ sv: "Affärer, kontakter och aktiviteter", fi: "kaupat, kontaktit ja toimenpiteet", en: "Deals, contacts and activities" }),
        L({ sv: "Raderar något", fi: "poista mitään", en: "Deletes anything" })],
      ["cal", L({ sv: "Kalender", fi: "Kalenteri", en: "Calendar" }), "i-google.svg",
        L({ sv: "Bokningar och platsbesök", fi: "varaukset ja kohdekäynnit", en: "Bookings and site visits" }),
        L({ sv: "Bokar om utan att fråga", fi: "siirrä varauksia kysymättä", en: "Reschedules without asking" })],
      ["netvisor", "Netvisor", null,
        L({ sv: "Fakturor, kunder och betalningar", fi: "laskut, asiakkaat ja maksut", en: "Invoices, customers and payments" }),
        L({ sv: "Skapar eller ändrar fakturor", fi: "luo tai muuta laskuja", en: "Creates or changes invoices" })],
      ["form", L({ sv: "Webbplatsens formulär", fi: "Verkkosivun lomake", en: "Website form" }), null,
        L({ sv: "Nya förfrågningar från din webbplats", fi: "uudet yhteydenotot verkkosivuiltasi", en: "New enquiries from your website" }),
        L({ sv: "Svarar automatiskt", fi: "vastaa automaattisesti", en: "Replies automatically" })],
    ];
    function conns() {
      const sees = L({ sv: "Ser", fi: "Näkee", en: "Sees" }), never = L({ sv: "Gör aldrig", fi: "Ei koskaan", en: "Never" });
      return `
        ${head(T.nav[4], L({ sv: "Varje koppling säger vad den ser och vad den aldrig gör. Du slår på och av själv.", fi: "Jokainen yhteys kertoo, mitä se näkee ja mitä se ei koskaan tee. Kytket ne itse päälle ja pois.", en: "Each connection says what it sees and what it never does. You switch them on and off yourself." }))}
        <div class="connectors">${CONNS.map(([id, name, logo, s, nv]) => {
          const st = S.conns[id];
          const label = st === "syncing" ? `<span class="tag accent">${L({ sv: "Kopplar …", fi: "Yhdistetään …", en: "Connecting …" })}</span>`
            : st === "on" ? (id === "netvisor" ? `<span class="tag good">${L({ sv: "1 284 fakturor lästa", fi: "1 284 laskua luettu", en: "1,284 invoices read" })}</span>` : `<span class="tag good">${L({ sv: "Kopplad", fi: "Yhdistetty", en: "Connected" })}</span>`)
              : `<span class="tag">${L({ sv: "Av", fi: "Pois", en: "Off" })}</span>`;
          const icon = logo ? `<img src="${lang === "sv" ? "" : "../"}assets/logos/${logo}" alt="">` : `<span style="width:20px;height:20px;border-radius:5px;background:var(--ink);color:var(--paper);font:700 10px/20px var(--f-mono);text-align:center">${name[0]}</span>`;
          return `<div class="conn"><header><b>${icon}${name}</b>
            <button type="button" class="switch" role="switch" aria-checked="${st === "on" || st === "syncing"}" aria-label="${name}" data-a="conn" data-v="${id}"></button></header>
            <dl><dt>${sees}</dt><dd>${s}</dd><dt>${never}</dt><dd>${nv}</dd></dl>${label}</div>`;
        }).join("")}</div>`;
    }

    function side() {
      const t = S.tasks;
      return guide({
        tasks: [
          { done: t.quote, text: L({ sv: "Godkänn offerten till Strandgården", fi: "Hyväksy Strandgårdenin tarjous", en: "Approve the Strandgården quote" }) },
          { done: t.ask, text: L({ sv: "Fråga vilka offerter som är äldre än en vecka", fi: "Kysy, mitkä tarjoukset ovat yli viikon vanhoja", en: "Ask which quotes are older than a week" }) },
          { done: t.netvisor, text: L({ sv: "Koppla in Netvisor", fi: "Yhdistä Netvisor", en: "Connect Netvisor" }) },
        ],
        done: `<b>${L({ sv: "Så jobbar en Company Brain.", fi: "Näin Company Brain toimii.", en: "That's how a Company Brain works." })}</b> <span>${L({ sv: "Vill du se den med dina egna system?", fi: "Haluatko nähdä sen omilla järjestelmilläsi?", en: "Want to see it with your own systems?" })}</span> <a class="act" href="${route("contact")}">${L({ sv: "Boka en demo", fi: "Varaa demo", en: "Book a demo" })}</a>`,
        note: L({ sv: "Allt här är påhittat: företaget, personerna och siffrorna. Inget sparas, och demon börjar om när sidan laddas om.", fi: "Kaikki tässä on keksittyä: yritys, ihmiset ja luvut. Mitään ei tallenneta, ja demo alkaa alusta, kun sivu ladataan uudelleen.", en: "Everything here is made up: the company, the people and the numbers. Nothing is saved, and the demo starts over when the page reloads." }),
      });
    }

    let lastKey = "";
    function render() {
      const key = S.view + S.role + (S.quoteOpen || "");
      const top = key === lastKey ? window.WF.scrollOf(root) : 0;
      root.innerHTML = shell();
      window.WF.restoreScroll(root, top);
      if (key !== lastKey) { const m = root.querySelector(".app-main"); if (m && lastKey) m.classList.add("swap"); lastKey = key; }
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b || !root.contains(b)) return;
      const a = b.dataset.a, v = b.dataset.v;
      if (a === "view") { S.view = v; S.quoteOpen = null; }
      else if (a === "role") { S.role = v; S.view = "today"; }
      else if (a === "reset") { S = fresh(); render(); toast(root, T.resetDone); return; }
      else if (a === "openquote") { S.view = "quotes"; S.quoteOpen = "d1"; }
      else if (a === "closequote") { S.quoteOpen = null; S.preview = false; }
      else if (a === "preview") { S.preview = !S.preview; }
      else if (a === "approve") {
        S.quote = "sent"; S.tasks.quote = true; render();
        setTimeout(() => {
          S.quote = "signed"; const d = S.deals.find((x) => x.id === "d1"); d.s = 3; S.moved = "d1"; render();
          toast(root, L({ sv: "Strandgården signerade offerten (simulerat)", fi: "Strandgården allekirjoitti tarjouksen (simuloitu)", en: "Strandgården signed the quote (simulated)" }));
        }, 1600);
        return;
      }
      else if (a === "assign") { S.assigned = true; toast(root, L({ sv: "Mikael äger nu anbudet", fi: "Tarjouskilpailu on nyt Mikaelin vastuulla", en: "Mikael now owns the tender" })); }
      else if (a === "remind") { S.reminded = true; toast(root, T.nothingSent); }
      else if (a === "nudge") { toast(root, L({ sv: "Påminnelse skapad. Demo: inget skickades", fi: "Muistutus luotu. Demo: mitään ei lähetetty", en: "Reminder created. Demo: nothing was sent" })); return; }
      else if (a === "sdone") { S.sellerDone[v] = !S.sellerDone[v]; }
      else if (a === "move") {
        const d = S.deals.find((x) => x.id === v);
        if (d && d.s < 3) { d.s++; S.moved = d.id; if (d.s === 3) toast(root, L({ sv: `${d.n} flyttad till Vunnen`, fi: `${d.n} siirretty voitettuihin`, en: `${d.n} moved to Won` })); }
      }
      else if (a === "ask") { S.askQ = v; S.free = ""; if (v === "q1") S.tasks.ask = true; }
      else if (a === "conn") {
        const cur = S.conns[v];
        if (cur === "on") { S.conns[v] = "off"; }
        else if (cur === "off") {
          S.conns[v] = "syncing"; render();
          setTimeout(() => { S.conns[v] = "on"; if (v === "netvisor") S.tasks.netvisor = true; render(); }, 1300);
          return;
        }
      }
      render();
    });
    root.addEventListener("submit", (e) => {
      if (!e.target.matches("[data-a-form='free']")) return;
      e.preventDefault();
      const val = e.target.querySelector("input").value.trim();
      S.free = val; S.askQ = null;
      const k = Object.keys(ANSWERS).find((key) => val.length > 6 && ANSWERS[key].q.toLowerCase().startsWith(val.toLowerCase().slice(0, 12)));
      if (k) { S.askQ = k; S.free = ""; if (k === "q1") S.tasks.ask = true; }
      render();
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-demo='brain']").forEach(mount));
})();
