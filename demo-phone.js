/* The phone demo: a virtual phone with a home screen of everyday apps and the Wicflow app, which opens Company Brain
   as it will look in the mobile app (Today, Tasks, Ask, Time). Only the Wicflow app opens; the others just show it's
   a demo. Fictional company, in-memory only. Every visible string is {sv, fi, en}; WF.L picks the page language. */
(() => {
  const { L, lang, eur, hello, weekday, today, cap, icon, brandMark } = window.WF;

  // Glyphs for the everyday apps (lucide-style, 24px grid), added to the shared icon set.
  Object.assign(window.WF_ICONS || (window.WF_ICONS = {}), {
    "ph-phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "ph-message": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "ph-camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    "ph-image": '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    "ph-map": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "ph-sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    "ph-clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "ph-music": '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    "ph-compass": '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>',
  });

  const pad = (n) => String(n).padStart(2, "0");
  const hm = (d) => (lang === "fi" ? `${d.getHours()}.${pad(d.getMinutes())}` : `${pad(d.getHours())}:${pad(d.getMinutes())}`);
  const T = {
    region: L({ sv: "Telefondemo", fi: "Puhelindemo", en: "Phone demo" }),
    apps: {
      phone: L({ sv: "Telefon", fi: "Puhelin", en: "Phone" }), messages: L({ sv: "Meddelanden", fi: "Viestit", en: "Messages" }),
      mail: L({ sv: "Mejl", fi: "Sähköposti", en: "Mail" }), browser: L({ sv: "Webbläsare", fi: "Selain", en: "Browser" }),
      calendar: L({ sv: "Kalender", fi: "Kalenteri", en: "Calendar" }), photos: L({ sv: "Bilder", fi: "Kuvat", en: "Photos" }),
      camera: L({ sv: "Kamera", fi: "Kamera", en: "Camera" }), maps: L({ sv: "Kartor", fi: "Kartat", en: "Maps" }),
      weather: L({ sv: "Väder", fi: "Sää", en: "Weather" }), clock: L({ sv: "Klocka", fi: "Kello", en: "Clock" }),
      notes: L({ sv: "Anteckningar", fi: "Muistiinpanot", en: "Notes" }), music: L({ sv: "Musik", fi: "Musiikki", en: "Music" }),
    },
    notInDemo: L({ sv: "Bara Wicflow öppnas i den här demon", fi: "Tässä demossa avautuu vain Wicflow", en: "Only Wicflow opens in this demo" }),
    hint: L({ sv: "Öppna appen", fi: "Avaa sovellus", en: "Open the app" }),
    home: L({ sv: "Till hemskärmen", fi: "Kotinäyttöön", en: "Back to the home screen" }),
    now: L({ sv: "nu", fi: "nyt", en: "now" }),
    notif: L({ sv: "Offerten till Strandgården väntar på ditt godkännande.", fi: "Strandgårdenin tarjous odottaa hyväksyntääsi.", en: "The Strandgården quote is waiting for your approval." }),
    widget: L({ sv: "I dag", fi: "Tänään", en: "Today" }),
    widgetMore: (n) => L({ sv: `${n} saker behöver dig`, fi: `${n} asiaa odottaa sinua`, en: `${n} things need you` }),
    widgetDone: L({ sv: "Inget väntar på dig", fi: "Mikään ei odota sinua", en: "Nothing is waiting for you" }),
    tabs: { today: L({ sv: "I dag", fi: "Tänään", en: "Today" }), tasks: L({ sv: "Uppgifter", fi: "Tehtävät", en: "Tasks" }), ask: L({ sv: "Fråga", fi: "Kysy", en: "Ask" }), time: L({ sv: "Tid", fi: "Aika", en: "Time" }) },
    company: "Kvarnvik Värme",
    clockOff: L({ sv: "Du har inte stämplat in", fi: "Et ole leimannut sisään", en: "You haven't clocked in" }),
    clockIn: L({ sv: "Stämpla in", fi: "Leimaa sisään", en: "Clock in" }),
    clockOut: L({ sv: "Stämpla ut", fi: "Leimaa ulos", en: "Clock out" }),
    atWork: (t) => L({ sv: `På jobbet sedan ${t}`, fi: `Töissä klo ${t} alkaen`, en: `At work since ${t}` }),
    worked: (a, b) => L({ sv: `Stämplade in ${a} och ut ${b}`, fi: `Sisään ${a}, ulos ${b}`, en: `Clocked in at ${a}, out at ${b}` }),
    needs: L({ sv: "Behöver dig", fi: "Odottaa sinua", en: "Needs you" }),
    calendar: L({ sv: "Kalender", fi: "Kalenteri", en: "Calendar" }),
    demoSent: L({ sv: "Demo: inget skickades", fi: "Demo: mitään ei lähetetty", en: "Demo: nothing was sent" }),
    tasksTitle: L({ sv: "Mina uppgifter", fi: "Omat tehtävät", en: "My tasks" }),
    tasksDone: (a, b) => L({ sv: `${a} av ${b} klara`, fi: `${a}/${b} tehty`, en: `${a} of ${b} done` }),
    todayDue: L({ sv: "I dag", fi: "Tänään", en: "Today" }), tomorrow: L({ sv: "I morgon", fi: "Huomenna", en: "Tomorrow" }),
    askTitle: L({ sv: "Fråga", fi: "Kysy", en: "Ask" }),
    askIntro: L({ sv: "Fråga om verksamheten. Svaren visar varifrån de kommer.", fi: "Kysy yrityksestä. Vastaukset kertovat lähteensä.", en: "Ask about the business. Answers show where they come from." }),
    source: L({ sv: "Källa", fi: "Lähde", en: "Source" }),
    timeTitle: L({ sv: "Arbetstid", fi: "Työaika", en: "Working time" }),
    weeks: L({ sv: "De senaste veckorna", fi: "Viime viikot", en: "The last few weeks" }),
    wd: L({ sv: ["må", "ti", "on", "to", "fr", "lö", "sö"], fi: ["ma", "ti", "ke", "to", "pe", "la", "su"], en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] }),
    legend: L({ sv: ["Jobbat", "Semester", "Borta", "Ledigt"], fi: ["Töissä", "Loma", "Poissa", "Vapaa"], en: ["Worked", "Holiday", "Away", "Day off"] }),
    lastWeek: L({ sv: "Förra veckan", fi: "Viime viikko", en: "Last week" }),
    holidayLeft: L({ sv: "Semester kvar", fi: "Lomaa jäljellä", en: "Holiday left" }),
    days: (n) => L({ sv: `${n} dagar`, fi: `${n} päivää`, en: `${n} days` }),
    timeOff: L({ sv: "Ansök om ledigt", fi: "Hae vapaata", en: "Ask for time off" }),
    timeOffSent: L({ sv: "Ansökan skickad till din chef", fi: "Pyyntö lähetetty esihenkilöllesi", en: "Request sent to your manager" }),
  };

  const NEEDS = [
    { id: "quote", t: T.notif, m: `${eur(18420)} · Mikael Nyström`, a: L({ sv: "Godkänn", fi: "Hyväksy", en: "Approve" }), done: L({ sv: "Godkänd och skickad till kunden", fi: "Hyväksytty ja lähetetty asiakkaalle", en: "Approved and sent to the customer" }) },
    { id: "give", t: L({ sv: "Anbudet för Ekby skola stänger på fredag", fi: "Ekbyn koulun tarjouskilpailu päättyy perjantaina", en: "The Ekby school tender closes on Friday" }), m: L({ sv: "Ingen ansvarig än", fi: "Ei vielä vastuuhenkilöä", en: "No owner yet" }), a: L({ sv: "Ge till Mikael", fi: "Anna Mikaelille", en: "Give to Mikael" }), done: L({ sv: "Mikael har den nu", fi: "Mikaelilla nyt", en: "Mikael has it now" }) },
    { id: "remind", t: L({ sv: "Lövdal Lantbruk har väntat 6 dagar på svar", fi: "Lövdal Lantbruk on odottanut vastausta 6 päivää", en: "Lövdal Lantbruk has waited 6 days for a reply" }), m: "Sara Lindholm", a: L({ sv: "Påminn Sara", fi: "Muistuta Saraa", en: "Remind Sara" }), done: L({ sv: "Sara är påmind", fi: "Saraa muistutettu", en: "Sara has been reminded" }) },
  ];
  const AGENDA = [
    ["09:00", L({ sv: "Platsbesök, Bostads Ab Solbacken · Jonas", fi: "Työmaakäynti, Bostads Ab Solbacken · Jonas", en: "Site visit, Bostads Ab Solbacken · Jonas" })],
    ["11:30", L({ sv: "Telefonmöte, Strandviks stad · Sara", fi: "Puhelinpalaveri, Strandvikin kaupunki · Sara", en: "Phone meeting, City of Strandvik · Sara" })],
    ["14:00", L({ sv: "Installation klar, Bostads Ab Tallmon · Jonas", fi: "Asennus valmis, Bostads Ab Tallmon · Jonas", en: "Installation finished, Bostads Ab Tallmon · Jonas" })],
  ];
  const TASKS = [
    { id: "t1", t: L({ sv: "Godkänn Jonas semesteransökan", fi: "Hyväksy Jonasin lomapyyntö", en: "Approve Jonas's holiday request" }), due: T.todayDue },
    { id: "t2", t: L({ sv: "Läs veckorapporten", fi: "Lue viikkoraportti", en: "Read the weekly report" }), due: T.todayDue },
    { id: "t3", t: L({ sv: "Ring styrelseordföranden på Solbacken", fi: "Soita Solbackenin hallituksen puheenjohtajalle", en: "Call the chair at Solbacken" }), due: T.tomorrow },
    { id: "t4", t: L({ sv: "Gå igenom anbudet för Ekby skola", fi: "Käy läpi Ekbyn koulun tarjous", en: "Go through the Ekby school tender" }), due: cap(weekday(3)) },
  ];
  const QUESTIONS = [
    { id: "q1", q: L({ sv: "Vilka offerter är äldre än en vecka?", fi: "Mitkä tarjoukset ovat yli viikon vanhoja?", en: "Which quotes are older than a week?" }),
      a: L({ sv: `Två: Bostads Ab Havsbrisen, ${eur(22900)}, skickad för 12 dagar sedan, och Fastighets Ab Kustbo, ${eur(8450)}, skickad för 9 dagar sedan. Båda är Mikaels.`, fi: `Kaksi: Bostads Ab Havsbrisen, ${eur(22900)}, lähetetty 12 päivää sitten, ja Fastighets Ab Kustbo, ${eur(8450)}, lähetetty 9 päivää sitten. Molemmat ovat Mikaelin.`, en: `Two: Bostads Ab Havsbrisen, ${eur(22900)}, sent 12 days ago, and Fastighets Ab Kustbo, ${eur(8450)}, sent 9 days ago. Both are Mikael's.` }),
      s: L({ sv: "Offerter i Pipedrive", fi: "Tarjoukset Pipedrivessa", en: "Quotes in Pipedrive" }) },
    { id: "q2", q: L({ sv: "Vem är borta nästa vecka?", fi: "Kuka on poissa ensi viikolla?", en: "Who is away next week?" }),
      a: L({ sv: "Jonas har semester måndag till onsdag, och Sara är borta på fredag.", fi: "Jonas on lomalla maanantaista keskiviikkoon, ja Sara on poissa perjantaina.", en: "Jonas is on holiday Monday to Wednesday, and Sara is away on Friday." }),
      s: L({ sv: "Arbetstid", fi: "Työaika", en: "Working time" }) },
    { id: "q3", q: L({ sv: "Hur mycket har vi vunnit den här månaden?", fi: "Paljonko olemme voittaneet tässä kuussa?", en: "How much have we won this month?" }),
      a: L({ sv: `${eur(41300)} i tre affärer. Den största är Bostads Ab Tallmon.`, fi: `${eur(41300)} kolmessa kaupassa. Suurin on Bostads Ab Tallmon.`, en: `${eur(41300)} across three deals. The biggest is Bostads Ab Tallmon.` }),
      s: L({ sv: "Affärer i Pipedrive", fi: "Kaupat Pipedrivessa", en: "Deals in Pipedrive" }) },
  ];

  // Everyday apps: [key, glyph, tile background]. The calendar tile shows today's date instead of a glyph.
  const GRID = [["calendar", null, "#fff"], ["photos", "ph-image", "linear-gradient(160deg,#ffd36e,#ff8a5c)"], ["camera", "ph-camera", "linear-gradient(160deg,#9aa0ab,#5b616d)"], ["maps", "ph-map", "linear-gradient(160deg,#7fd99a,#2fae63)"],
    ["weather", "ph-sun", "linear-gradient(160deg,#6ec3ff,#2f80ed)"], ["clock", "ph-clock", "linear-gradient(160deg,#3a3a40,#111114)"], ["notes", null, "linear-gradient(160deg,#fff3b0,#ffd84d)"], ["music", "ph-music", "linear-gradient(160deg,#ff7a9a,#e8335d)"]];
  const DOCK = [["phone", "ph-phone", "linear-gradient(160deg,#6ee08a,#25b14a)"], ["messages", "ph-message", "linear-gradient(160deg,#6ee08a,#25b14a)"], ["mail", "mail", "linear-gradient(160deg,#5fb2ff,#1f6fe5)"], ["browser", "ph-compass", "linear-gradient(160deg,#7cc8ff,#2b7de9)"]];

  const tile = (key, glyph, bg) => {
    let inner = glyph ? icon(glyph, "ph-glyph") : "";
    if (key === "calendar") inner = `<span class="ph-cal"><small>${cap(weekday(0)).slice(0, 3)}</small><b>${today.getDate()}</b></span>`;
    if (key === "notes") inner = '<span class="ph-notes"><i></i><i></i><i></i></span>';
    return `<button type="button" class="ph-icon" data-app="${key}"><span class="ph-tile" style="background:${bg}">${inner}</span><span class="ph-label">${T.apps[key]}</span></button>`;
  };
  const wicflowTile = () => `<span class="ph-tile ph-tile-wf">${brandMark("ph-wf-mark")}</span>`;

  const statusIcons = `<span class="ph-sys" aria-hidden="true">
      <svg viewBox="0 0 18 12" width="17" height="11"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg viewBox="0 0 16 12" width="15" height="11"><path d="M8 11.6 5.7 9.2a3.3 3.3 0 0 1 4.6 0z"/><path d="M3.6 7.1a6.2 6.2 0 0 1 8.8 0l-1.4 1.4a4.2 4.2 0 0 0-6 0z"/><path d="M1.2 4.7a9.6 9.6 0 0 1 13.6 0l-1.4 1.4a7.6 7.6 0 0 0-10.8 0z"/></svg>
      <svg viewBox="0 0 27 13" width="25" height="12"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2"/><path d="M25 4.5v4a2 2 0 0 0 0-4z" opacity=".4"/></svg>
    </span>`;

  function mount(root) {
    const S = { open: false, tab: "today", clock: null, needs: {}, tasks: {}, asked: [], typing: null, timeOff: false, seenHint: false, notified: false };
    root.innerHTML = `
      <div class="ph" role="region" aria-label="${T.region}">
        <div class="ph-screen">
          <div class="ph-status"><span class="ph-clock"></span><span class="ph-island" aria-hidden="true"></span>${statusIcons}</div>
          <div class="ph-home">
            <button type="button" class="ph-widget" data-app="wicflow"><span class="ph-widget-h">${brandMark("ph-wf-mini")}Company Brain</span><b>${T.widget}</b><span data-w="count"></span><span class="ph-widget-item" data-w="item"></span></button>
            <div class="ph-grid">${GRID.map((g) => tile(...g)).join("")}
              <button type="button" class="ph-icon ph-icon-wf" data-app="wicflow">${wicflowTile()}<span class="ph-label">Wicflow</span><span class="ph-hint">${T.hint}</span></button>
            </div>
            <div class="ph-dots" aria-hidden="true"><i></i><i></i></div>
            <div class="ph-dock">${DOCK.map((d) => tile(...d)).join("")}</div>
          </div>
          <div class="ph-app" aria-hidden="true">
            <header class="ph-app-top"><span class="ph-org">${brandMark("ph-wf-mini")}${T.company}</span><span class="ph-avatar">AK</span></header>
            <div class="ph-app-body"></div>
            <nav class="ph-tabs"></nav>
          </div>
          <button type="button" class="ph-banner" data-app="wicflow" tabindex="-1"><span class="ph-banner-ic">${brandMark("ph-wf-mini")}</span><span class="ph-banner-t"><b>Company Brain</b><em>${T.now}</em><span>${T.notif}</span></span></button>
          <div class="ph-toast" role="status"></div>
          <button type="button" class="ph-bar" aria-label="${T.home}"><i></i></button>
        </div>
      </div>`;
    const $ = (q) => root.querySelector(q);
    const screen = $(".ph-screen"), app = $(".ph-app"), body = $(".ph-app-body");

    const tick = () => { $(".ph-clock").textContent = hm(new Date()); };
    tick(); setInterval(tick, 15000);

    let toastTimer;
    const toast = (msg) => { const t = $(".ph-toast"); t.textContent = msg; t.classList.add("in"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("in"), 2200); };

    const openCount = () => NEEDS.filter((n) => !S.needs[n.id]).length;
    function renderWidget() {
      const n = openCount();
      $("[data-w=count]").textContent = n ? T.widgetMore(n) : T.widgetDone;
      const first = NEEDS.find((x) => !S.needs[x.id]);
      $("[data-w=item]").textContent = first ? first.t : "";
    }

    const TAB_ICONS = { today: "sparkles", tasks: "circle-check", ask: "message-circle-question-mark", time: "ph-clock" };
    function renderTabs() {
      $(".ph-tabs").innerHTML = Object.keys(TAB_ICONS).map((k) => `<button type="button" data-tab="${k}" aria-current="${S.tab === k ? "page" : "false"}">${icon(TAB_ICONS[k])}<span>${T.tabs[k]}</span>${k === "today" && openCount() ? `<i class="ph-badge">${openCount()}</i>` : ""}</button>`).join("");
    }

    const views = {
      today() {
        const c = S.clock;
        const clock = !c ? `<div class="pa-card pa-clock"><span>${T.clockOff}</span><button type="button" class="pa-btn" data-do="clock">${icon("ph-clock")}${T.clockIn}</button></div>`
          : !c.out ? `<div class="pa-card pa-clock is-in"><span><i class="pa-dot"></i>${T.atWork(hm(c.in))}</span><button type="button" class="pa-btn pa-btn-2" data-do="clock">${T.clockOut}</button></div>`
            : `<div class="pa-card pa-clock"><span>${T.worked(hm(c.in), hm(c.out))}</span></div>`;
        const needs = NEEDS.map((n) => S.needs[n.id]
          ? `<li class="pa-item is-done">${icon("circle-check")}<span><b>${n.done}</b></span></li>`
          : `<li class="pa-item" data-need="${n.id}"><i class="pa-dot ${n.id === "quote" ? "blue" : "orange"}"></i><span><b>${n.t}</b><small>${n.m}</small><button type="button" class="pa-btn pa-btn-sm" data-do="${n.id}">${n.a}</button></span></li>`).join("");
        return `<h3 class="pa-title">${T.tabs.today}</h3><p class="pa-sub">${hello()}, Anna.</p>${clock}
          <div class="pa-card"><div class="pa-card-h">${T.needs}<span>${openCount()}</span></div><ul class="pa-list">${needs}</ul></div>
          <div class="pa-card"><div class="pa-card-h">${T.calendar}<span>${cap(weekday(0))}</span></div><ul class="pa-list">${AGENDA.map(([t, s]) => `<li class="pa-row"><b class="pa-mono">${t}</b><span>${s}</span></li>`).join("")}</ul></div>`;
      },
      tasks() {
        const done = TASKS.filter((t) => S.tasks[t.id]).length;
        return `<h3 class="pa-title">${T.tasksTitle}</h3><p class="pa-sub">${T.tasksDone(done, TASKS.length)}</p>
          <div class="pa-card"><ul class="pa-list">${TASKS.map((t) => `<li><button type="button" class="pa-task${S.tasks[t.id] ? " is-done" : ""}" data-task="${t.id}" aria-pressed="${!!S.tasks[t.id]}"><i class="pa-check">${S.tasks[t.id] ? icon("check") : ""}</i><span><b>${t.t}</b><small>${t.due}</small></span></button></li>`).join("")}</ul></div>`;
      },
      ask() {
        const thread = S.asked.map((id) => { const q = QUESTIONS.find((x) => x.id === id); return `<div class="pa-msg me">${q.q}</div>${S.typing === id ? '<div class="pa-msg bot pa-typing"><i></i><i></i><i></i></div>' : `<div class="pa-msg bot">${q.a}<small>${T.source}: ${q.s}</small></div>`}`; }).join("");
        const left = QUESTIONS.filter((q) => !S.asked.includes(q.id));
        return `<h3 class="pa-title">${T.askTitle}</h3><div class="pa-msg bot">${T.askIntro}</div>${thread}
          <div class="pa-chips">${left.map((q) => `<button type="button" data-ask="${q.id}">${q.q}</button>`).join("")}</div>`;
      },
      time() {
        // The last five weeks, Monday first: weekends off, a holiday three weeks ago, a day away last week.
        const start = new Date(today); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 28);
        let cells = "";
        for (let i = 0; i < 35; i++) {
          const d = new Date(start); d.setDate(start.getDate() + i);
          const wd = i % 7, week = Math.floor(i / 7), isToday = d.toDateString() === today.toDateString(), past = d < today && !isToday;
          let k = "plan";
          if (wd >= 5) k = "off";
          else if (past) k = week === 1 && wd >= 2 ? "hol" : week === 3 && wd === 1 ? "away" : "work";
          else if (isToday && S.clock) k = "work";
          cells += `<span class="pa-day ${k}${isToday ? " today" : ""}">${d.getDate()}<i></i></span>`;
        }
        return `<h3 class="pa-title">${T.timeTitle}</h3><p class="pa-sub">${T.weeks}</p>
          <div class="pa-card"><div class="pa-cal">${T.wd.map((w) => `<b>${w}</b>`).join("")}${cells}</div>
            <div class="pa-legend">${["work", "hol", "away", "off"].map((k, i) => `<span><i class="${k}"></i>${T.legend[i]}</span>`).join("")}</div></div>
          <div class="pa-card pa-two"><div><small>${T.lastWeek}</small><b class="pa-mono">38 h 30 min</b></div><div><small>${T.holidayLeft}</small><b class="pa-mono">${T.days(18)}</b></div></div>
          ${S.timeOff ? `<div class="pa-card pa-clock"><span>${icon("circle-check")} ${T.timeOffSent}</span></div>` : `<button type="button" class="pa-btn pa-wide" data-do="timeoff">${T.timeOff}</button>`}`;
      },
    };

    function render(keepScroll = true) {
      const top = keepScroll ? body.scrollTop : 0;
      body.innerHTML = `<div class="pa-view">${views[S.tab]()}</div>`;
      body.scrollTop = top;
      renderTabs(); renderWidget();
    }

    // Opening and closing zoom from and back to the app icon, like a phone does.
    function origin() {
      const icon = $(".ph-icon-wf .ph-tile").getBoundingClientRect(), s = screen.getBoundingClientRect();
      app.style.transformOrigin = `${icon.left + icon.width / 2 - s.left}px ${icon.top + icon.height / 2 - s.top}px`;
    }
    function openApp(tab) {
      hideBanner();
      if (tab) S.tab = tab;
      S.seenHint = true; root.querySelector(".ph").classList.add("seen-hint");
      render(false); origin();
      S.open = true; screen.classList.add("is-open"); app.setAttribute("aria-hidden", "false");
    }
    function closeApp() {
      if (!S.open) return;
      origin(); S.open = false; screen.classList.remove("is-open"); app.setAttribute("aria-hidden", "true");
    }

    let bannerTimer;
    function showBanner() {
      if (S.notified || S.open) return;
      S.notified = true; $(".ph-banner").classList.add("in"); $(".ph-banner").tabIndex = 0;
      bannerTimer = setTimeout(hideBanner, 7000);
    }
    function hideBanner() { clearTimeout(bannerTimer); const b = $(".ph-banner"); b.classList.remove("in"); b.tabIndex = -1; }

    root.addEventListener("click", (e) => {
      const appBtn = e.target.closest("[data-app]");
      if (appBtn && !S.open) {
        const key = appBtn.dataset.app;
        if (key === "wicflow") { openApp(appBtn.classList.contains("ph-banner") ? "today" : null); return; }
        appBtn.classList.remove("wiggle"); void appBtn.offsetWidth; appBtn.classList.add("wiggle");
        toast(T.notInDemo); return;
      }
      if (e.target.closest(".ph-bar")) { closeApp(); return; }
      const tab = e.target.closest("[data-tab]");
      if (tab) { S.tab = tab.dataset.tab; render(false); return; }
      const act = e.target.closest("[data-do]");
      if (act) {
        const d = act.dataset.do;
        if (d === "clock") S.clock = !S.clock ? { in: new Date() } : { ...S.clock, out: new Date() };
        else if (d === "timeoff") { S.timeOff = true; toast(T.demoSent); }
        else { S.needs[d] = true; if (d === "quote") toast(T.demoSent); }
        render(); return;
      }
      const task = e.target.closest("[data-task]");
      if (task) { S.tasks[task.dataset.task] = !S.tasks[task.dataset.task]; render(); return; }
      const ask = e.target.closest("[data-ask]");
      if (ask) {
        const id = ask.dataset.ask; S.asked.push(id); S.typing = id; render();
        body.scrollTop = body.scrollHeight;
        setTimeout(() => { S.typing = null; render(); body.scrollTop = body.scrollHeight; }, 700);
      }
    });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape" && S.open) closeApp(); });

    render(false);
    // The notification arrives a moment after the phone comes into view.
    const io = new IntersectionObserver((entries) => {
      if (entries.some((x) => x.isIntersecting)) { io.disconnect(); setTimeout(showBanner, 1800); }
    }, { threshold: 0.6 });
    io.observe(root);
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-demo='phone']").forEach(mount));
})();
