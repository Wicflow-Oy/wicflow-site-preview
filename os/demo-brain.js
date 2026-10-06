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


  // ---------- Tasks (Linear-style), team chat and working time ----------
  Object.assign(window.WF_ICONS || (window.WF_ICONS = {}), {
    "list-todo": '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  });
  const TK_STATUS = L({ sv: ["Att göra", "Pågår", "Klart"], fi: ["Tehtävänä", "Työn alla", "Valmis"], en: ["To do", "In progress", "Done"] });
  const TK_PRIO = L({ sv: ["Brådskande", "Hög", "Medel", "Låg"], fi: ["Kiireellinen", "Korkea", "Keskitaso", "Matala"], en: ["Urgent", "High", "Medium", "Low"] });
  const PEOPLE = { AK: "Anna Kvarnvik", MN: "Mikael Nyström", SL: "Sara Lindholm", JB: "Jonas Back", LH: "Lina Holm", PV: "Peter Vik" };
  const AV = { AK: ["#DCE9FF", "#0050B8"], MN: ["#E3F6E8", "#1A7533"], SL: ["#FFF0DA", "#995200"], JB: ["#E7E2FF", "#3438EE"], LH: ["#FFE7E5", "#C41D16"], PV: ["#EBEBF0", "#3C3C43"] };
  const W = {
    tasks: L({ sv: "Uppgifter", fi: "Tehtävät", en: "Tasks" }),
    time: L({ sv: "Arbetstid", fi: "Työaika", en: "Working time" }),
    tasksSub: L({ sv: "Allas arbete på ett ställe: fördelat, prioriterat och uppföljt. Klicka på cirkeln för att byta status.", fi: "Kaikkien työt yhdessä paikassa: jaettu, priorisoitu ja seurattu. Vaihda tilaa klikkaamalla ympyrää.", en: "Everyone's work in one place: assigned, prioritised and followed up. Click the circle to change the status." }),
    list: L({ sv: "Lista", fi: "Lista", en: "List" }), board: L({ sv: "Tavla", fi: "Taulu", en: "Board" }),
    newTask: L({ sv: "Ny uppgift", fi: "Uusi tehtävä", en: "New task" }),
    today: L({ sv: "I dag", fi: "Tänään", en: "Today" }), tomorrow: L({ sv: "I morgon", fi: "Huomenna", en: "Tomorrow" }),
    created: (id) => L({ sv: `KVA-${id} skapad och given till Mikael`, fi: `KVA-${id} luotu ja annettu Mikaelille`, en: `KVA-${id} created and given to Mikael` }),
    fromMsg: L({ sv: "KVA-24 skapad från meddelandet och given till Mikael", fi: "KVA-24 luotu viestistä ja annettu Mikaelille", en: "KVA-24 created from the message and given to Mikael" }),
    isDone: (id) => L({ sv: `KVA-${id} är klar`, fi: `KVA-${id} on valmis`, en: `KVA-${id} is done` }),
    msgSub: L({ sv: "Teamets chatt bredvid arbetet. Gör vilket meddelande som helst till en uppgift.", fi: "Tiimin chat työn vieressä. Tee mistä tahansa viestistä tehtävä.", en: "The team's chat next to the work. Turn any message into a task." }),
    channels: L({ sv: "Kanaler", fi: "Kanavat", en: "Channels" }), dms: L({ sv: "Direktmeddelanden", fi: "Yksityisviestit", en: "Direct messages" }),
    mkTask: L({ sv: "Gör till uppgift", fi: "Tee tehtäväksi", en: "Turn into a task" }),
    send: L({ sv: "Skicka", fi: "Lähetä", en: "Send" }), write: L({ sv: "Skriv ett meddelande …", fi: "Kirjoita viesti …", en: "Write a message …" }),
    timeSub: L({ sv: "Stämpla in och ut, dina skift och din ledighet. Syns bara för dig, din teamledare och admin.", fi: "Leimaa sisään ja ulos, vuorosi ja vapaasi. Näkyy vain sinulle, tiiminvetäjällesi ja ylläpitäjille.", en: "Clock in and out, your shifts and your time off. Seen only by you, your team lead and admins." }),
    teamSub: L({ sv: "Vem som är på jobbet, borta eller på semester. Syns bara för teamledare och admin.", fi: "Kuka on töissä, poissa tai lomalla. Näkyy vain tiiminvetäjille ja ylläpitäjille.", en: "Who is at work, away or on holiday. Seen only by team leads and admins." }),
    myTime: L({ sv: "Min tid", fi: "Oma aika", en: "My time" }), team: L({ sv: "Teamet", fi: "Tiimi", en: "Team" }),
    teamOnly: L({ sv: "Teamvyn är för teamledare och admin.", fi: "Tiiminäkymä on tiiminvetäjille ja ylläpitäjille.", en: "The team view is for team leads and admins." }),
    notIn: L({ sv: "Du har inte stämplat in", fi: "Et ole leimannut sisään", en: "You haven't clocked in" }),
    shiftToday: L({ sv: "Dagens skift 08:00–16:00", fi: "Tämän päivän vuoro 8.00–16.00", en: "Today's shift 08:00–16:00" }),
    clockIn: L({ sv: "Stämpla in", fi: "Leimaa sisään", en: "Clock in" }), clockOut: L({ sv: "Stämpla ut", fi: "Leimaa ulos", en: "Clock out" }),
    atWork: (t) => L({ sv: `På jobbet sedan ${t}`, fi: `Töissä klo ${t} alkaen`, en: `At work since ${t}` }),
    worked: (a, b) => L({ sv: `Stämplade in ${a} och ut ${b}`, fi: `Sisään ${a}, ulos ${b}`, en: `Clocked in at ${a}, out at ${b}` }),
    thisWeek: L({ sv: "Den här veckan", fi: "Tällä viikolla", en: "This week" }), holidayLeft: L({ sv: "Semester kvar", fi: "Lomaa jäljellä", en: "Holiday left" }),
    days18: L({ sv: "18 dagar", fi: "18 päivää", en: "18 days" }), flex: L({ sv: "Flexsaldo", fi: "Liukumasaldo", en: "Flexitime" }),
    shifts: L({ sv: "Mina skift den här veckan", fi: "Omat vuoroni tällä viikolla", en: "My shifts this week" }),
    dayOff: L({ sv: "Ledig", fi: "Vapaa", en: "Day off" }), planned: L({ sv: "Planerat", fi: "Suunniteltu", en: "Planned" }),
    workedTag: (h) => L({ sv: `Jobbat ${h}`, fi: `Töissä ${h}`, en: `Worked ${h}` }),
    weeks: L({ sv: "De senaste veckorna", fi: "Viime viikot", en: "The last few weeks" }),
    legend: L({ sv: ["Jobbat", "Semester", "Borta", "Oförklarat", "Ledigt"], fi: ["Töissä", "Loma", "Poissa", "Selvittämätön", "Vapaa"], en: ["Worked", "Holiday", "Away", "Unexplained", "Day off"] }),
    wd: L({ sv: ["må", "ti", "on", "to", "fr", "lö", "sö"], fi: ["ma", "ti", "ke", "to", "pe", "la", "su"], en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] }),
    timeOff: L({ sv: "Ansök om ledigt", fi: "Hae vapaata", en: "Ask for time off" }), timeOffSent: L({ sv: "Ansökan skickad till Robin", fi: "Pyyntö lähetetty Robinille", en: "Request sent to Robin" }),
    person: L({ sv: "Person", fi: "Henkilö", en: "Person" }), hours: L({ sv: "Timmar", fi: "Tunnit", en: "Hours" }),
    holiday: L({ sv: "Semester", fi: "Loma", en: "Holiday" }), away: L({ sv: "Borta", fi: "Poissa", en: "Away" }), unexplained: L({ sv: "Oförklarat", fi: "Selvittämätön", en: "Unexplained" }),
    inAt: (t) => L({ sv: `In ${t}`, fi: `Sisään ${t}`, en: `In ${t}` }), notYet: L({ sv: "Inte in än", fi: "Ei vielä sisällä", en: "Not in yet" }),
    waiting: L({ sv: "Väntar på dig", fi: "Odottaa sinua", en: "Waiting for you" }),
    jonasReq: L({ sv: "Jonas Back: semester mån–ons nästa vecka · 3 dagar", fi: "Jonas Back: loma ma–ke ensi viikolla · 3 päivää", en: "Jonas Back: holiday Mon–Wed next week · 3 days" }),
    approve: L({ sv: "Godkänn", fi: "Hyväksy", en: "Approve" }), decline: L({ sv: "Avslå", fi: "Hylkää", en: "Decline" }),
    approved: L({ sv: "Godkänd", fi: "Hyväksytty", en: "Approved" }), declined: L({ sv: "Avslagen", fi: "Hylätty", en: "Declined" }),
    check: L({ sv: "Behöver kollas", fi: "Tarkistettava", en: "Check needed" }),
    checkText: L({ sv: "Planerad arbetsdag utan instämpling. Kolla med personen först, sedan:", fi: "Suunniteltu työpäivä ilman leimausta. Kysy ensin häneltä, sitten:", en: "A planned workday with no clock-in. Check with them first, then:" }),
    awayPaid: L({ sv: "Borta, betalt", fi: "Poissa, palkallinen", en: "Away, paid" }),
  };
  const pad2 = (n) => String(n).padStart(2, "0");
  const hm = (d) => (lang === "fi" ? `${d.getHours()}.${pad2(d.getMinutes())}` : `${pad2(d.getHours())}:${pad2(d.getMinutes())}`);
  const dayOffset = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
  const workTime = (fallback) => { const d = new Date(); if (d.getHours() < 6 || d.getHours() > 19) d.setHours(...fallback, 0); return d; };
  const dayLabel = (n) => `${cap(weekday(n)).slice(0, lang === "fi" ? 2 : 3)} ${dm(n)}`;
  const WORK = () => [
    { id: 22, t: L({ sv: "Svara Lövdal Lantbruk om värmepumpsofferten", fi: "Vastaa Lövdal Lantbrukille lämpöpumpputarjouksesta", en: "Reply to Lövdal Lantbruk about the heat pump offer" }), who: "SL", p: 0, s: 1, due: 0, label: "Lövdal" },
    { id: 14, t: L({ sv: "Förbered anbudshandlingarna för Ekby skola", fi: "Valmistele Ekbyn koulun tarjousasiakirjat", en: "Prepare the tender documents for Ekby school" }), who: "MN", p: 1, s: 1, due: 4, label: L({ sv: "Anbud", fi: "Tarjouskilpailu", en: "Tender" }) },
    { id: 17, t: L({ sv: "Beställ 2 × 12 kW värmepumpar till Strandgården", fi: "Tilaa 2 × 12 kW lämpöpumput Strandgårdeniin", en: "Order 2 × 12 kW heat pumps for Strandgården" }), who: "JB", p: 1, s: 0, due: 1, label: "Strandgården" },
    { id: 19, t: L({ sv: "Boka platsbesöket hos Bostads Ab Solbacken", fi: "Varaa kohdekäynti: Bostads Ab Solbacken", en: "Book the site visit at Bostads Ab Solbacken" }), who: "SL", p: 2, s: 0, due: 3, label: "Solbacken" },
    { id: 21, t: L({ sv: "Uppdatera prislistan för nästa år", fi: "Päivitä ensi vuoden hinnasto", en: "Update the price list for next year" }), who: "AK", p: 3, s: 0, due: 7, label: L({ sv: "Internt", fi: "Sisäinen", en: "Internal" }) },
    { id: 12, t: L({ sv: "Skicka driftsättningsrapporten till Tallmon", fi: "Lähetä käyttöönottoraportti Tallmonille", en: "Send the commissioning report to Tallmon" }), who: "JB", p: 2, s: 2, due: -1, label: "Tallmon" },
  ];
  const NEW_TASK = () => ({ id: 25, t: L({ sv: "Kontrollera elarbetet hos Havsbrisen", fi: "Tarkista Havsbrisenin sähkötyöt", en: "Check the electrical work at Havsbrisen" }), who: "MN", p: 2, s: 0, due: 7, label: "Havsbrisen" });
  const MSG_TASK = () => ({ id: 24, t: L({ sv: "Revidera offerten till Kustbo: en pump i stället för två", fi: "Päivitä Kustbon tarjous: yksi pumppu kahden sijaan", en: "Revise the Kustbo quote: one pump instead of two" }), who: "MN", p: 1, s: 0, due: 1, label: "Kustbo" });
  const CHANNELS = [
    { id: "inst", name: L({ sv: "installationer", fi: "asennukset", en: "installations" }), say: L({ sv: "Bra jobbat med Tallmon, Jonas!", fi: "Hyvää työtä Tallmonin kanssa, Jonas!", en: "Great work on Tallmon, Jonas!" }),
      msgs: [
        { who: "JB", at: "07:42", t: L({ sv: "Tallmon är klart. Driftsättningsrapporten ligger i mappen.", fi: "Tallmon on valmis. Käyttöönottoraportti on kansiossa.", en: "Tallmon is done. The commissioning report is in the folder." }) },
        { who: "SL", at: "08:15", task: true, t: L({ sv: "Kustbo vill ha offerten reviderad: en pump i stället för två. Kan någon ta det?", fi: "Kustbo haluaa tarjouksen päivitettynä: yksi pumppu kahden sijaan. Voiko joku ottaa sen?", en: "Kustbo wants the quote revised: one pump instead of two. Can someone take it?" }) },
        { who: "MN", at: "08:21", t: L({ sv: "Jag tar Kustbo efter lunch.", fi: "Otan Kustbon lounaan jälkeen.", en: "I'll take Kustbo after lunch." }) },
      ] },
    { id: "sales", name: L({ sv: "försäljning", fi: "myynti", en: "sales" }), say: L({ sv: "Lycka till på torsdag, Mikael!", fi: "Onnea torstaille, Mikael!", en: "Good luck on Thursday, Mikael!" }),
      msgs: [
        { who: "MN", at: "09:05", t: L({ sv: "Karin Wiik på Solgläntan svarade. Möte på torsdag kl. 13.", fi: "Karin Wiik Solgläntanista vastasi. Tapaaminen torstaina klo 13.", en: "Karin Wiik at Solgläntan replied. Meeting on Thursday at 1 pm." }) },
        { who: "AK", at: "09:07", t: L({ sv: "Snyggt! Ta med referensen från Tallmon.", fi: "Hienoa! Ota Tallmonin referenssi mukaan.", en: "Nice! Bring the reference from Tallmon." }) },
        { who: "SL", at: "09:30", t: L({ sv: "Lövdal väntar fortfarande på svar, jag ringer dem i dag.", fi: "Lövdal odottaa yhä vastausta, soitan heille tänään.", en: "Lövdal is still waiting for an answer, I'll call them today." }) },
      ] },
    { id: "sara", dm: true, name: "Sara Lindholm", say: L({ sv: "Godkänt, njut av ledigheten!", fi: "Hyväksytty, nauti lomasta!", en: "Approved, enjoy your time off!" }),
      msgs: [{ who: "SL", at: "10:02", t: L({ sv: "Kan du godkänna min semesteransökan för veckan efter nästa?", fi: "Voitko hyväksyä lomapyyntöni ensi viikon jälkeiselle viikolle?", en: "Could you approve my holiday request for the week after next?" }) }] },
  ];

  const fresh = () => ({
    view: "today", role: "vd", quoteOpen: null, preview: false, askQ: null, free: "",
    quote: "wait", assigned: false, reminded: false, sellerDone: {},
    conns: { mail: "on", crm: "on", cal: "on", netvisor: "off", form: "off", claude: "off", chatgpt: "off" },
    tasks: { quote: false, ask: false, clock: false, msg: false },
    work: WORK(), workMode: "list", workMoved: null,
    channel: "inst", sent: [], converted: false, draft: null, seenMsgs: false,
    clock: null, timeTab: "me", timeOff: false, req: null, check: null,
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
    const NAV = [["today", "brain", T.nav[0]], ["tasks", "list-todo", W.tasks], ["msgs", "messages-square", T.nav[5]], ["deals", "handshake", T.nav[1]],
      ["ask", "message-circle-question-mark", T.nav[2]], ["quotes", "file-text", T.nav[3]], ["time", "clock", W.time], ["conns", "plug", T.nav[4]]];
    const left = () => (S.quote === "wait" ? 1 : 0) + (S.assigned ? 0 : 1) + (S.reminded ? 0 : 1);
    const navCount = (id) => (id === "today" ? left() : id === "quotes" && S.quote === "wait" ? 1
      : id === "tasks" ? S.work.filter((t) => t.who === (S.role === "vd" ? "AK" : "MN") && t.s < 2).length : id === "msgs" && !S.seenMsgs ? 2 : 0);
    const head = (title, sub, actions) => page(title, sub, actions);
    const PATHS = { today: "", tasks: "/tasks", msgs: "/messages", deals: "/deals", ask: "/ask", quotes: "/quotes", time: "/time", conns: "/connectors" };

    function shell() {
      const nav = [
        ...NAV.map(([id, ic, label]) => ({ id, label, icon: ic, current: S.view === id, count: navCount(id) })),
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
      if (S.view === "tasks") return work();
      if (S.view === "msgs") return msgs();
      if (S.view === "time") return time();
      return conns();
    }

    // ---------- Tasks ----------
    const me = () => (S.role === "vd" ? "AK" : "MN");
    const av = (who) => `<span class="tk-av" style="background:${AV[who][0]};color:${AV[who][1]}" title="${PEOPLE[who]}">${who}</span>`;
    const prio = (p) => p === 0 ? `<span class="tk-prio urgent" title="${TK_PRIO[0]}">!</span>` : `<span class="tk-prio p${p}" title="${TK_PRIO[p]}"><i></i><i></i><i></i></span>`;
    const stIc = (s, id) => `<button type="button" class="tk-st s${s}" data-a="tstat" data-v="${id}" aria-label="${TK_STATUS[s]} · KVA-${id}">${s === 2 ? icon("check") : ""}</button>`;
    const due = (d) => (d === 0 ? W.today : d === 1 ? W.tomorrow : d < 0 ? dm(d) : dayLabel(d));
    function work() {
      const modes = `<div class="seg" role="group"><button type="button" data-a="tmode" data-v="list" aria-pressed="${S.workMode === "list"}">${W.list}</button><button type="button" data-a="tmode" data-v="board" aria-pressed="${S.workMode === "board"}">${W.board}</button></div>
        <button type="button" class="act" data-a="tnew"${S.work.some((t) => t.id === 25) ? " disabled" : ""}>${icon("plus")}${W.newTask}</button>`;
      const cls = (t) => `${t.who === me() ? " mine" : ""}${S.workMoved === t.id ? " moved" : ""}`;
      const body = S.workMode === "board"
        ? `<div class="board three">${[0, 1, 2].map((s) => { const list = S.work.filter((t) => t.s === s); return `<div class="col"><header>${TK_STATUS[s]}<span>${list.length}</span></header>${list.map((t) => `
            <div class="deal tk-card${cls(t)}"><b>${t.t}</b><div class="v"><span>KVA-${t.id} · ${due(t.due)}</span><span class="tk-meta">${prio(t.p)}${av(t.who)}${s < 2 ? `<button type="button" data-a="tnext" data-v="${t.id}" aria-label="${TK_STATUS[s + 1]}">→</button>` : ""}</span></div></div>`).join("")}</div>`; }).join("")}</div>`
        : [1, 0, 2].map((s) => { const list = S.work.filter((t) => t.s === s); return list.length ? `<section class="ax-card tk-group"><header class="tk-gh"><span class="tk-st s${s} static">${s === 2 ? icon("check") : ""}</span>${TK_STATUS[s]}<span>${list.length}</span></header>${list.map((t) => `
            <div class="tk-row${cls(t)}">${stIc(t.s, t.id)}<span class="tk-id">KVA-${t.id}</span><span class="tk-t"><span class="tk-tt">${t.t}</span><span class="tag">${t.label}</span></span>${prio(t.p)}<span class="tk-due${t.due <= 0 && t.s < 2 ? " late" : ""}">${due(t.due)}</span>${av(t.who)}</div>`).join("")}</section>` : ""; }).join("");
      return `${head(W.tasks, W.tasksSub, modes)}${body}`;
    }

    // ---------- Messages ----------
    function msgs() {
      const ch = CHANNELS.find((c) => c.id === S.channel);
      const list = [...ch.msgs, ...S.sent.filter((m) => m.ch === ch.id)];
      const side = `<nav class="msg-side"><span class="msg-h">${W.channels}</span>${CHANNELS.filter((c) => !c.dm).map((c) => `<button type="button" data-a="chan" data-v="${c.id}" aria-current="${S.channel === c.id}">${icon("hash")}${c.name}</button>`).join("")}
        <span class="msg-h">${W.dms}</span>${CHANNELS.filter((c) => c.dm).map((c) => `<button type="button" data-a="chan" data-v="${c.id}" aria-current="${S.channel === c.id}">${av("SL")}${c.name}</button>`).join("")}</nav>`;
      const thread = list.map((m) => `<div class="msg${m.mine ? " mine" : ""}">${av(m.who)}<div><div class="msg-meta"><b>${PEOPLE[m.who]}</b><time>${m.at}</time></div><p>${esc(m.t)}</p>
        ${m.task ? (S.converted ? `<span class="tag accent">${icon("list-todo")}KVA-24 · Mikael Nyström</span>` : `<button type="button" class="ghost msg-task" data-a="mktask">${icon("list-todo")}${W.mkTask}</button>`) : ""}</div></div>`).join("");
      return `${head(L({ sv: "Meddelanden", fi: "Viestit", en: "Messages" }), W.msgSub)}
        <section class="ax-card msg-wrap">${side}<div class="msg-main"><header class="msg-top">${ch.dm ? av("SL") : icon("hash")}<b>${ch.name}</b></header><div class="msg-list">${thread}</div>
          <form class="msg-form" data-a-form="msg"><input aria-label="${W.write}" placeholder="${W.write}" value="${esc(S.draft ?? ch.say)}"><button class="act" type="submit">${W.send}</button></form></div></section>`;
    }

    // ---------- Working time ----------
    function time() {
      const admin = S.role === "vd";
      const tabs = admin ? `<div class="seg" role="group"><button type="button" data-a="ttab" data-v="me" aria-pressed="${S.timeTab === "me"}">${W.myTime}</button><button type="button" data-a="ttab" data-v="team" aria-pressed="${S.timeTab === "team"}">${W.team}</button></div>` : `<span class="tag">${W.teamOnly}</span>`;
      if (admin && S.timeTab === "team") return timeTeam(tabs);
      const c = S.clock;
      const clock = !c ? `<div class="tm-clock"><div><b>${W.notIn}</b><span>${W.shiftToday}</span></div><button type="button" class="act" data-a="clock">${icon("clock")}${W.clockIn}</button></div>`
        : !c.out ? `<div class="tm-clock is-in"><div><b><i class="tm-dot"></i>${W.atWork(hm(c.in))}</b><span>${W.shiftToday}</span></div><button type="button" class="ghost" data-a="clock">${W.clockOut}</button></div>`
          : `<div class="tm-clock"><div><b>${W.worked(hm(c.in), hm(c.out))}</b><span>${W.shiftToday}</span></div><span class="tag good">${T.done}</span></div>`;
      const mon = -((new Date().getDay() + 6) % 7);
      const shiftRows = [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const n = mon + i, weekend = i >= 5;
        const shift = weekend ? W.dayOff : i === 4 ? (lang === "fi" ? "8.00–14.00" : "08:00–14:00") : (lang === "fi" ? "8.00–16.00" : "08:00–16:00");
        const tag = weekend ? "" : n < 0 ? `<span class="tag good">${W.workedTag(["8 h 05", "7 h 55", "8 h 10", "8 h 00"][i % 4])}</span>`
          : n === 0 ? (c ? `<span class="tag ${c.out ? "good" : "accent"}">${c.out ? W.worked(hm(c.in), hm(c.out)) : W.atWork(hm(c.in))}</span>` : `<span class="tag warn">${W.notIn}</span>`)
            : `<span class="tag">${W.planned}</span>`;
        return `<div class="tm-shift${n === 0 ? " today" : ""}${weekend ? " off" : ""}"><b>${dayLabel(n)}</b><span>${shift}</span>${tag}</div>`;
      }).join("");
      let cells = "";
      for (let i = 0; i < 35; i++) {
        const n = mon - 28 + i, wd = i % 7, week = Math.floor(i / 7);
        let k = n > 0 ? "plan" : wd >= 5 ? "off" : week === 1 && wd >= 2 ? "hol" : week === 3 && wd === 1 ? "away" : "work";
        if (n === 0) k = c ? "work" : "plan";
        cells += `<span class="tm-day ${k}${n === 0 ? " today" : ""}">${dayOffset(n).getDate()}<i></i></span>`;
      }
      return `${head(W.time, W.timeSub, tabs)}${clock}
        <div class="kpis three"><div class="kpi"><span>${W.thisWeek}</span><b>31 h 20 min</b><i>/ 37 h 30 min</i></div><div class="kpi"><span>${W.holidayLeft}</span><b>${W.days18}</b></div><div class="kpi"><span>${W.flex}</span><b>+2 h 15 min</b></div></div>
        <div class="ax-split">${card(W.shifts, "", `<div class="tm-shifts">${shiftRows}</div>`)}
          ${card(W.weeks, "", `<div class="tm-cal">${W.wd.map((w) => `<b>${w}</b>`).join("")}${cells}</div><div class="tm-legend">${["work", "hol", "away", "bad", "off"].map((k, i) => `<span><i class="${k}"></i>${W.legend[i]}</span>`).join("")}</div>
            <div class="tm-off">${S.timeOff ? `<span class="tag good">${W.timeOffSent}</span>` : `<button type="button" class="ghost" data-a="timeoff">${W.timeOff}</button>`}</div>`, "ax-card--side")}</div>`;
    }
    function timeTeam(tabs) {
      // The last five working days, ending today.
      const cols = []; for (let n = 0; cols.length < 5 && n > -14; n--) { const d = dayOffset(n).getDay(); if (d !== 0 && d !== 6) cols.unshift(n); }
      const chip = (k, txt) => `<span class="tm-chip ${k}">${txt}</span>`;
      const cell = (who, i, n) => {
        if (who === "LH") return chip("hol", W.holiday);
        if (who === "SL" && i === 0) return chip("away", W.away);
        if (who === "PV" && i === 2) return S.check === "away" ? chip("away", W.away) : chip("bad", "?");
        if (n === 0) return who === "PV" ? chip("plan", W.notYet) : chip("work", W.inAt({ MN: "07:58", SL: "08:12", JB: "07:30" }[who] || "08:00"));
        return chip("work", ["8 h", "7 h 55", "8 h 10", "8 h 05", "7 h 45"][(i + who.charCodeAt(0)) % 5]);
      };
      const rows = ["MN", "SL", "JB", "LH", "PV"].map((who) => `<tr><td><span class="tm-person">${av(who)}${PEOPLE[who]}</span></td>${cols.map((n, i) => `<td>${cell(who, i, n)}</td>`).join("")}<td class="n">${{ MN: "31 h 20", SL: "23 h 50", JB: "32 h 10", LH: "0 h", PV: "24 h 10" }[who]}</td></tr>`).join("");
      const pvDay = cols[2] < 0 ? dayLabel(cols[2]) : "";
      const req = S.req ? `<span class="tag ${S.req === "ok" ? "good" : "bad"}">${S.req === "ok" ? W.approved : W.declined}</span>`
        : `<button type="button" class="act" data-a="treq" data-v="ok">${W.approve}</button><button type="button" class="ghost" data-a="treq" data-v="no">${W.decline}</button>`;
      const chk = S.check ? `<span class="tag ${S.check === "away" ? "warn" : "bad"}">${S.check === "away" ? W.awayPaid : W.unexplained}</span>`
        : `<button type="button" class="ghost" data-a="tcheck" data-v="away">${W.awayPaid}</button><button type="button" class="ghost tm-bad" data-a="tcheck" data-v="bad">${W.unexplained}</button>`;
      return `${head(W.time, W.teamSub, tabs)}
        <section class="ax-card"><div class="table-scroll"><table class="mini-table tm-team"><thead><tr><th>${W.person}</th>${cols.map((n) => `<th${n === 0 ? ' class="today"' : ""}>${dayLabel(n)}</th>`).join("")}<th style="text-align:right">${W.hours}</th></tr></thead><tbody>${rows}</tbody></table></div></section>
        ${card(W.waiting, String(pvDay ? 2 : 1), `<div class="rows">${row("act-row", W.jonasReq, L({ sv: "Semesterdagar kvar efter: 12", fi: "Lomapäiviä jää jäljelle: 12", en: "Holiday days left after: 12" }), req)}
          ${pvDay ? row("warn-row", `${W.check}: Peter Vik · ${pvDay}`, W.checkText, chk) : ""}</div>`)}`;
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
      ["claude", "Claude", "i-claude.png",
        L({ sv: "Dina frågor till Company Brain från Claude, med samma behörigheter som du har", fi: "kysymyksesi Company Brainille Claudesta, samoilla oikeuksilla kuin sinulla", en: "Your questions to Company Brain from Claude, with the same permissions you have" }),
        L({ sv: "Visar något du inte får se", fi: "näytä mitään, mitä et saa nähdä", en: "Shows anything you're not allowed to see" })],
      ["chatgpt", "ChatGPT", "i-chatgpt.svg",
        L({ sv: "Dina frågor till Company Brain från ChatGPT, med samma behörigheter som du har", fi: "kysymyksesi Company Brainille ChatGPT:stä, samoilla oikeuksilla kuin sinulla", en: "Your questions to Company Brain from ChatGPT, with the same permissions you have" }),
        L({ sv: "Visar något du inte får se", fi: "näytä mitään, mitä et saa nähdä", en: "Shows anything you're not allowed to see" })],
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
          const icon = logo ? `<img src="${window.WF.asset(`assets/logos/${logo}`)}" alt="">` : `<span style="width:20px;height:20px;border-radius:5px;background:var(--ink);color:var(--paper);font:700 10px/20px var(--f-mono);text-align:center">${name[0]}</span>`;
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
          { done: t.clock, text: L({ sv: "Stämpla in under Arbetstid", fi: "Leimaa sisään Työaika-sivulla", en: "Clock in on Working time" }) },
          { done: t.msg, text: L({ sv: "Gör ett meddelande till en uppgift", fi: "Tee viestistä tehtävä", en: "Turn a message into a task" }) },
        ],
        done: `<b>${L({ sv: "Så jobbar en Company Brain.", fi: "Näin Company Brain toimii.", en: "That's how a Company Brain works." })}</b> <span>${L({ sv: "Vill du se den med dina egna system?", fi: "Haluatko nähdä sen omilla järjestelmilläsi?", en: "Want to see it with your own systems?" })}</span> <a class="act" href="${route("contact")}">${L({ sv: "Boka en demo", fi: "Varaa demo", en: "Book a demo" })}</a>`,
        note: L({ sv: "Allt här är påhittat: företaget, personerna och siffrorna. Inget sparas, och demon börjar om när sidan laddas om.", fi: "Kaikki tässä on keksittyä: yritys, ihmiset ja luvut. Mitään ei tallenneta, ja demo alkaa alusta, kun sivu ladataan uudelleen.", en: "Everything here is made up: the company, the people and the numbers. Nothing is saved, and the demo starts over when the page reloads." }),
      });
    }

    let lastKey = "";
    function render() {
      const key = S.view + S.role + (S.quoteOpen || "") + (S.view === "time" ? S.timeTab : "") + (S.view === "msgs" ? S.channel : "");
      const top = key === lastKey ? window.WF.scrollOf(root) : 0;
      root.innerHTML = shell();
      window.WF.restoreScroll(root, top);
      if (key !== lastKey) { const m = root.querySelector(".app-main"); if (m && lastKey) m.classList.add("swap"); lastKey = key; }
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b || !root.contains(b)) return;
      const a = b.dataset.a, v = b.dataset.v;
      if (a === "view") { S.view = v; S.quoteOpen = null; if (v === "msgs") S.seenMsgs = true; }
      else if (a === "tmode") { S.workMode = v; }
      else if (a === "tnew") { S.work.unshift(NEW_TASK()); S.workMoved = 25; toast(root, W.created(25)); }
      else if (a === "tstat" || a === "tnext") {
        const t = S.work.find((x) => x.id === Number(v));
        if (t) { t.s = a === "tnext" ? Math.min(2, t.s + 1) : (t.s + 1) % 3; S.workMoved = t.id; if (t.s === 2) toast(root, W.isDone(t.id)); }
      }
      else if (a === "chan") { S.channel = v; S.draft = null; }
      else if (a === "mktask") { S.converted = true; S.tasks.msg = true; S.work.unshift(MSG_TASK()); S.workMoved = 24; toast(root, W.fromMsg); }
      else if (a === "ttab") { S.timeTab = v; }
      else if (a === "clock") { S.clock = !S.clock ? { in: workTime([7, 58]) } : { ...S.clock, out: workTime([16, 4]) }; S.tasks.clock = true; }
      else if (a === "timeoff") { S.timeOff = true; toast(root, T.nothingSent); }
      else if (a === "treq") { S.req = v; toast(root, T.nothingSent); }
      else if (a === "tcheck") { S.check = v; }
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
          setTimeout(() => { S.conns[v] = "on"; render(); }, 1300);
          return;
        }
      }
      render();
    });
    root.addEventListener("submit", (e) => {
      if (e.target.matches("[data-a-form='msg']")) {
        e.preventDefault();
        const input = e.target.querySelector("input"), text = input.value.trim();
        if (text) { const now = new Date(); S.sent.push({ ch: S.channel, who: S.role === "vd" ? "AK" : "MN", at: hm(now), t: text, mine: true }); }
        S.draft = ""; render();
        const list = root.querySelector(".msg-list"); if (list) list.scrollTop = list.scrollHeight;
        return;
      }
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
