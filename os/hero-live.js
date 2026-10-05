/* The home hero's live scene: one deal moving through Wicflow, about 17 seconds, looping.
   Sales Radar finds a tender and gives the lead to Mikael, Outreach writes the first email and Mikael approves it,
   the customer replies and the meeting lands in the calendar. Each step sends a line of light into Company Brain on
   the right, where the deal's row moves from "New lead" to "Email sent" to "Meeting", Anna ticks off a quote and the
   time back this week counts up. People stay in the loop: the system does the groundwork, they decide.
   Drawn at a design width of 600 px and scaled to fit, so nothing overlaps; on narrow screens the three systems take
   turns in one slot above Company Brain. Decorative (the clickable demo is further down); runs only while visible and
   shows the finished scene, still, when reduced motion is on.
   Also fills in the "send it to your boss" link: a prewritten email with a link to the page.
   Strings are {sv, fi, en}; WF.L picks the page language. Made-up company and people. */
(() => {
  const { L, eur } = window.WF;
  const T = {
    radar: L({ sv: "Säljradar", fi: "Myyntitutka", en: "Sales Radar" }),
    tender: L({ sv: "Ekby skola upphandlar värmepumpar till tre byggnader", fi: "Ekbyn koulu kilpailuttaa lämpöpumput kolmeen rakennukseen", en: "Ekby school is tendering heat pumps for three buildings" }),
    tenderMeta: L({ sv: "Offentlig upphandling · Finns inte i ditt CRM", fi: "Julkinen hankinta · Ei CRM:ssäsi", en: "Public tender · Not in your CRM" }),
    lead: L({ sv: "Lead till Mikael", fi: "Liidi Mikaelille", en: "Lead for Mikael" }),
    reach: L({ sv: "Prospektering", fi: "Prospektointi", en: "Outreach" }),
    writing: L({ sv: "Skriver …", fi: "Kirjoittaa …", en: "Writing …" }),
    ready: L({ sv: "Klart", fi: "Valmis", en: "Draft ready" }),
    to: L({ sv: "Till: Anders Holm, Ekby skola", fi: "Vastaanottaja: Anders Holm, Ekby skola", en: "To: Anders Holm, Ekby skola" }),
    body: L({ sv: "Hej Anders, jag såg att Ekby skola byter värme i tre byggnader. Vi gjorde precis samma sak för två skolor i Sibbo. Ska jag berätta hur det gick?",
              fi: "Hei Anders, huomasin, että Ekbyn koulu uusii kolmen rakennuksen lämmityksen. Teimme juuri saman kahdelle koululle Sipoossa. Kerronko, miten meni?",
              en: "Hi Anders, I saw that Ekby school is replacing the heating in three buildings. We just did the same for two schools in Sipoo. Shall I tell you how it went?" }),
    approve: L({ sv: "Godkänn och skicka", fi: "Hyväksy ja lähetä", en: "Approve and send" }),
    sent: L({ sv: "Skickat av Mikael", fi: "Mikael lähetti", en: "Sent by Mikael" }),
    cal: L({ sv: "Kalender", fi: "Kalenteri", en: "Calendar" }),
    reply: L({ sv: "Låter intressant. Passar torsdag kl. 10?", fi: "Kuulostaa kiinnostavalta. Sopiiko torstai klo 10?", en: "Sounds interesting. Does Thursday at 10 work?" }),
    booked: L({ sv: "Möte bokat", fi: "Tapaaminen varattu", en: "Meeting booked" }),
    bookedSub: L({ sv: "Tors 10:00 · i Mikaels kalender", fi: "To 10.00 · Mikaelin kalenterissa", en: "Thu 10:00 · in Mikael's calendar" }),
    today: L({ sv: "I dag", fi: "Tänään", en: "Today" }),
    hello: L({ sv: "God morgon, Anna.", fi: "Huomenta, Anna.", en: "Good morning, Anna." }),
    helloSub: L({ sv: "Allt som behöver dig i dag, på ett ställe.", fi: "Kaikki, mikä vaatii sinua tänään, yhdessä paikassa.", en: "Everything that needs you today, in one place." }),
    team: L({ sv: "14 personer i teamet", fi: "Tiimissä 14 henkeä", en: "14 people on the team" }),
    dealSub: L({ sv: "Värmepumpar · 3 byggnader · Mikael", fi: "Lämpöpumput · 3 rakennusta · Mikael", en: "Heat pumps · 3 buildings · Mikael" }),
    pill: {
      lead: L({ sv: "Nytt lead", fi: "Uusi liidi", en: "New lead" }),
      sent: L({ sv: "Mejl skickat", fi: "Viesti lähetetty", en: "Email sent" }),
      meet: L({ sv: "Möte tors 10", fi: "Tapaaminen to 10", en: "Meeting Thu 10" }),
    },
    items: [
      L({ sv: `Godkänn Strandgårdens offert · ${eur(18420)}`, fi: `Hyväksy Strandgårdenin tarjous · ${eur(18420)}`, en: `Approve Strandgården's quote · ${eur(18420)}` }),
      L({ sv: "Påminn Sara om Lövdal Lantbruk", fi: "Muistuta Saraa Lövdal Lantbrukista", en: "Remind Sara about Lövdal Lantbruk" }),
      L({ sv: "Uppdatera prislistan för nästa år", fi: "Päivitä ensi vuoden hinnasto", en: "Update next year's price list" }),
      L({ sv: "Boka servicebesöket hos Havsbrisen", fi: "Varaa huoltokäynti Havsbriseniin", en: "Book the service visit at Havsbrisen" }),
      L({ sv: "Kolla veckans arbetstider", fi: "Tarkista viikon työajat", en: "Check this week's hours" }),
    ],
    saved: L({ sv: "Tid tillbaka den här veckan", fi: "Aikaa säästetty tällä viikolla", en: "Time back this week" }),
    savedSub: L({ sv: "för 14 personer", fi: "14 hengelle", en: "across 14 people" }),
    note: L({ sv: "Exempel med påhittade data", fi: "Esimerkki keksityllä datalla", en: "Example with made-up data" }),
    shareSubject: L({ sv: "Värt en titt: Wicflow", fi: "Katsomisen arvoinen: Wicflow", en: "Worth a look: Wicflow" }),
    shareBody: (url) => L({
      sv: `Hej,\n\njag hittade Wicflow. Det hittar företag som är redo att köpa, skriver det första säljmejlet och ger hela teamet en tydlig lista varje morgon. På sidan finns en demo och en kalkyl där man kan räkna på värdet:\n${url}\n\nKunde det här vara något för oss?`,
      fi: `Hei,\n\nlöysin Wicflow'n. Se löytää yritykset, jotka ovat valmiita ostamaan, kirjoittaa ensimmäisen myyntiviestin ja antaa koko tiimille selkeän listan joka aamu. Sivulla on demo ja laskuri, jolla voi laskea hyödyn:\n${url}\n\nVoisiko tämä olla meille?`,
      en: `Hi,\n\nI came across Wicflow. It finds companies that are ready to buy, writes the first sales email and gives the whole team a clear list every morning. The site has a demo and a calculator for working out the value:\n${url}\n\nCould this be something for us?` }),
  };
  const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICON = {
    radar: svg('<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>'),
    send: svg('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'),
    brain: svg('<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>'),
    calendar: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
    sparkles: svg('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
  };
  const tile = (icon, bg, fg, cls = "") => `<span class="hl-tile${cls ? " " + cls : ""}" style="background:${bg};color:${fg}">${icon}</span>`;
  const TICK = '<svg class="hl-tick" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7"/><path d="M4.8 8.4l2.1 2.1 4.4-4.7"/></svg>';
  const AV = { AK: ["#DCE9FF", "#0050B8"], MN: ["#E3F6E8", "#1A7533"], SL: ["#FFF0DA", "#995200"], JB: ["#E7E2FF", "#3438EE"] };
  const av = (k) => `<span class="hl-av" style="background:${AV[k][0]};color:${AV[k][1]}">${k}</span>`;
  const CURSOR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 2.5v17.2l4.6-4.5 2.9 6.6 2.7-1.2-2.9-6.5h6.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DESIGN = 600, NARROW = 500, DEAL_H = 46;
  const SYSTEMS = ["radar", "mail", "meet"];
  let seq = 0;

  function mount(root) {
    const id = "hl" + (++seq);
    root.innerHTML = `
      <div class="hl-aura" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="hl-stage"><div class="hl-board">
        <svg class="hl-links is-hidden" aria-hidden="true">
          <defs>
            <linearGradient id="${id}-g" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3451e6" stop-opacity=".3"/><stop offset=".55" stop-color="#7b5cff"/><stop offset="1" stop-color="#c45cff"/></linearGradient>
            <radialGradient id="${id}-c"><stop offset="0" stop-color="#fff"/><stop offset=".28" stop-color="#e4e8ff"/><stop offset=".6" stop-color="#7b8cff" stop-opacity=".5"/><stop offset="1" stop-color="#3451e6" stop-opacity="0"/></radialGradient>
          </defs>
          ${SYSTEMS.map((k) => `<path id="${id}-${k}" data-link="${k}" stroke="url(#${id}-g)"/>`).join("")}
          ${SYSTEMS.map((k) => `<circle class="hl-comet" data-comet="${k}" r="11" fill="url(#${id}-c)"><animateMotion dur=".85s" begin="indefinite" fill="freeze" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".55 0 .25 1"><mpath href="#${id}-${k}"/></animateMotion></circle>`).join("")}
          <circle class="hl-port-ring" data-x="ring" r="4"/><circle class="hl-port" data-x="port" r="3.5"/>
        </svg>
        <div class="hl-col">
          <div class="hl-card hl-radar" data-card="radar">
            <div class="hl-head">${tile(ICON.radar, "#DDF3E4", "#1E7B43", "scan")}${T.radar}<time>06:02</time></div>
            <div class="hl-title">${T.tender}</div><div class="hl-meta">${T.tenderMeta}</div>
            <span class="hl-chip" data-x="chip">${av("MN")}${T.lead}</span>
          </div>
          <div class="hl-card hl-mail" data-card="mail">
            <div class="hl-head">${tile(ICON.send, "#FFE9D9", "#C2570C")}${T.reach}<span class="hl-ai" data-x="ai">${ICON.sparkles}<span data-x="aitext">${T.writing}</span></span></div>
            <div class="hl-to">${T.to}</div>
            <div class="hl-body"><span class="hl-ghost">${T.body}</span><span><span data-x="typed"></span><i class="hl-caret" data-x="caret"></i></span></div>
            <span class="hl-btn" data-x="btn">${T.approve}</span>
          </div>
          <div class="hl-card hl-meet" data-card="meet">
            <div class="hl-head">${tile(ICON.calendar, "#E5F0FF", "#0055C4")}${T.cal}<time>09:14</time></div>
            <div class="hl-reply"><b>Anders Holm</b>${T.reply}</div>
            <div class="hl-booked" data-x="booked">${TICK}<span>${T.booked}<small>${T.bookedSub}</small></span></div>
          </div>
        </div>
        <div class="hl-card hl-hub" data-card="hub">
          <div class="hl-head">${tile(ICON.brain, "#E7E2FF", "#3438EE")}Company Brain<em>${T.today}</em></div>
          <div class="hl-hello">${T.hello}<small>${T.helloSub}</small></div>
          <div class="hl-team">${Object.keys(AV).map(av).join("")}<span>${T.team}</span></div>
          <ul class="hl-list">
            <li class="hl-deal" data-x="deal">${av("MN")}<span><b>Ekby skola</b><small>${T.dealSub}</small></span><span class="hl-pill lead" data-x="pill">${T.pill.lead}</span></li>
            ${T.items.map((t, i) => `<li class="hl-item" data-x="item${i}">${TICK}<span>${t}</span></li>`).join("")}
          </ul>
          <div class="hl-foot">
            <div><small>${T.saved}</small><b data-x="hours">24 h</b><small>${T.savedSub}</small></div>
            <svg class="hl-spark" viewBox="0 0 140 36" preserveAspectRatio="none" aria-hidden="true"><polyline points="2,32 24,28 46,30 68,20 90,22 112,10 138,4"/></svg>
          </div>
        </div>
        <span class="hl-cursor" data-x="cursor">${CURSOR}<i class="hl-ripple"></i></span>
      </div></div>
      <span class="hl-note">${T.note}</span>`;

    const $ = (k) => root.querySelector(`[data-x="${k}"]`);
    const card = (k) => root.querySelector(`[data-card="${k}"]`);
    const stage = root.querySelector(".hl-stage"), board = root.querySelector(".hl-board");
    const col = root.querySelector(".hl-col"), links = root.querySelector(".hl-links"), spark = root.querySelector(".hl-spark");
    const sats = SYSTEMS.map(card), hub = card("hub"), cursor = $("cursor");
    let narrow = false, timers = [], running = false, raf = 0;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    // Positions in the board's own (unscaled) coordinates.
    const pos = (el) => {
      let x = 0, y = 0, n = el;
      while (n && n !== board) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    function layout() {
      const w = root.clientWidth;
      narrow = w < NARROW;
      root.classList.toggle("is-narrow", narrow);
      if (narrow) {
        board.style.removeProperty("--s"); stage.style.height = "";
        col.style.height = `${Math.max(...sats.map((c) => c.offsetHeight))}px`;
        return;
      }
      col.style.height = "";
      const s = Math.min(1, w / DESIGN);
      board.style.setProperty("--s", s.toFixed(4));
      stage.style.height = `${Math.ceil(board.offsetHeight * s)}px`;
      drawLinks();
    }
    // Every system's line ends at the same point: the deal's row in Company Brain.
    function drawLinks() {
      const W = board.offsetWidth, H = board.offsetHeight;
      links.setAttribute("viewBox", `0 0 ${W} ${H}`); links.setAttribute("width", W); links.setAttribute("height", H);
      const c = pos(col), px = pos(hub).x, py = pos(root.querySelector(".hl-list")).y + DEAL_H / 2;
      const g = root.querySelector(`#${id}-g`);
      g.setAttribute("x1", c.x + c.w); g.setAttribute("x2", px); g.setAttribute("y1", 0); g.setAttribute("y2", 0);
      SYSTEMS.forEach((k) => {
        const s = pos(card(k)), x1 = s.x + s.w, y1 = s.y + s.h / 2, bend = (px - x1) * 0.62;
        const p = root.querySelector(`[data-link="${k}"]`);
        p.setAttribute("d", `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${px - bend} ${py}, ${px} ${py}`);
        p.style.setProperty("--len", Math.ceil(p.getTotalLength()));
      });
      ["port", "ring"].forEach((k) => { $(k).setAttribute("cx", px); $(k).setAttribute("cy", py); });
    }
    const link = (k, on) => root.querySelector(`[data-link="${k}"]`).classList.toggle("is-on", on);
    const glow = (el, ms = 1500) => { el.classList.add("is-active"); at(ms, () => el.classList.remove("is-active")); };
    // A system hands over: its line draws, a point of light travels into Company Brain, and the row updates.
    function fire(k, arrive) {
      glow(card(k));
      if (narrow) { at(500, () => { glow(hub, 900); arrive(); }); return; }
      link(k, true);
      const comet = root.querySelector(`[data-comet="${k}"]`);
      at(420, () => { comet.classList.add("is-on"); comet.querySelector("animateMotion").beginElement(); });
      at(1270, () => {
        comet.classList.remove("is-on");
        $("port").classList.add("is-on");
        const ring = $("ring"); ring.classList.remove("is-pulse"); ring.getBoundingClientRect(); ring.classList.add("is-pulse");
        glow(hub, 900); arrive();
      });
    }
    function pill(k) {
      const el = $("pill"); el.classList.add("is-swap");
      at(170, () => { el.textContent = T.pill[k]; el.className = `hl-pill ${k}`; });
    }
    function count(from, to, ms) {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        $("hours").textContent = `${Math.round(from + (to - from) * e)} h`;
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function type(text, start, ms) {
      const step = Math.max(1, Math.round(text.length / (ms / 30)));
      for (let i = 0, t = 0; i <= text.length; i += step, t += 30) at(start + t, () => { $("typed").textContent = text.slice(0, i); });
      at(start + Math.ceil(text.length / step) * 30 + 30, () => { $("typed").textContent = text; });
    }
    // The cursor moves in a curve (different easing per axis) and sits just above the card it points at.
    function cursorTo(el, onCard, fx = 0.5, fy = 0.58, dx = 0) {
      const p = pos(el);
      cursor.style.left = `${p.x + p.w * fx + dx}px`; cursor.style.top = `${p.y + p.h * fy}px`;
      cursor.style.setProperty("--cz", `${(parseFloat(getComputedStyle(onCard).getPropertyValue("--z")) || 0) + 6}px`);
    }
    const click = () => { cursor.classList.remove("is-click"); void cursor.offsetWidth; cursor.classList.add("is-click"); };

    // The start of the day: Company Brain with today's list; the systems not yet in.
    function setStart() {
      sats.forEach((c) => c.classList.remove("is-in", "is-out", "is-past", "is-active"));
      $("chip").classList.remove("is-in");
      $("typed").textContent = ""; $("caret").hidden = false;
      $("ai").classList.remove("is-done"); $("aitext").textContent = T.writing;
      $("btn").textContent = T.approve; $("btn").classList.remove("is-done");
      $("booked").classList.remove("is-in");
      $("deal").classList.remove("is-in", "is-settled"); $("pill").className = "hl-pill lead"; $("pill").textContent = T.pill.lead;
      $("item0").classList.remove("is-done");
      spark.classList.remove("is-in"); cancelAnimationFrame(raf); $("hours").textContent = "24 h";
      SYSTEMS.forEach((k) => link(k, false)); $("port").classList.remove("is-on");
      root.querySelectorAll(".hl-comet").forEach((c) => c.classList.remove("is-on"));
      cursor.classList.remove("is-in", "is-click");
    }
    function finalState() {
      timers.forEach(clearTimeout); timers = [];
      layout();
      hub.classList.add("is-in");
      sats.forEach((c, i) => { c.classList.remove("is-out", "is-active"); c.classList.add("is-in"); c.classList.toggle("is-past", narrow && i < sats.length - 1); });
      $("chip").classList.add("is-in");
      $("typed").textContent = T.body; $("caret").hidden = true;
      $("ai").classList.add("is-done"); $("aitext").textContent = T.ready;
      $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done");
      $("booked").classList.add("is-in");
      $("deal").classList.add("is-in", "is-settled"); $("pill").className = "hl-pill meet"; $("pill").textContent = T.pill.meet;
      $("item0").classList.add("is-done");
      spark.classList.add("is-in"); cancelAnimationFrame(raf); $("hours").textContent = "31 h";
      links.classList.remove("is-hidden"); SYSTEMS.forEach((k) => link(k, true)); $("port").classList.add("is-on");
      root.querySelectorAll(".hl-comet").forEach((c) => c.classList.remove("is-on"));
      cursor.classList.remove("is-in");
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      setStart();
      cursor.style.left = "38%"; cursor.style.top = "104%"; cursor.style.setProperty("--cz", "90px");
      at(60, () => hub.classList.add("is-in"));
      at(900, () => links.classList.remove("is-hidden"));
      // 1. Sales Radar finds a tender and gives the lead to Mikael; the deal lands in Company Brain.
      at(400, () => card("radar").classList.add("is-in"));
      at(1350, () => $("chip").classList.add("is-in"));
      at(1650, () => fire("radar", () => $("deal").classList.add("is-in")));
      // 2. Outreach writes the first email; Mikael reads it and approves.
      at(3000, () => { card("mail").classList.add("is-in"); if (narrow) card("radar").classList.add("is-past"); });
      type(T.body, 3300, 2000);
      at(5400, () => { $("caret").hidden = true; $("ai").classList.add("is-done"); $("aitext").textContent = T.ready; });
      at(5450, () => { cursor.classList.add("is-in"); cursorTo($("btn"), card("mail")); });
      at(6600, () => { click(); $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done"); });
      at(6800, () => fire("mail", () => pill("sent")));
      // 3. The customer replies and the meeting is booked.
      at(8000, () => { card("meet").classList.add("is-in"); if (narrow) card("mail").classList.add("is-past"); });
      at(8900, () => $("booked").classList.add("is-in"));
      at(9100, () => fire("meet", () => { pill("meet"); $("deal").classList.add("is-settled"); }));
      // 4. Anna approves a quote from her list, and the time back this week counts up.
      at(10500, () => cursorTo($("item0"), hub, 0, 0.5, 16));
      at(11550, () => { click(); $("item0").classList.add("is-done"); });
      at(11900, () => { spark.classList.add("is-in"); count(24, 31, 1100); });
      at(12500, () => cursor.classList.remove("is-in"));
      // Out: the systems step back, Company Brain returns to the start of the day, and it begins again.
      at(16200, () => {
        sats.forEach((c, i) => at(i * 110, () => c.classList.add("is-out")));
        links.classList.add("is-hidden"); $("port").classList.remove("is-on");
      });
      at(16700, () => { $("deal").classList.remove("is-in", "is-settled"); $("item0").classList.remove("is-done"); spark.classList.remove("is-in"); count(31, 24, 600); });
      at(17700, () => { if (running) play(); });
    }

    layout();
    if (document.fonts) document.fonts.ready.then(() => { layout(); });
    window.addEventListener("resize", () => { layout(); if (!running) finalState(); });
    if (reduce) { root.classList.add("is-still"); finalState(); return; }

    function start() { if (running) return; running = true; play(); }
    function stop() { running = false; finalState(); }
    // Only animate while the scene is on screen and the tab is visible.
    let visible = false;
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible && !document.hidden ? start() : stop(); }, { threshold: 0.2 });
    io.observe(root);
    document.addEventListener("visibilitychange", () => (visible && !document.hidden ? start() : stop()));

    // Depth: the scene leans a little toward the mouse.
    const hero = root.closest("section");
    if (hero && window.matchMedia("(pointer: fine)").matches) {
      hero.addEventListener("pointermove", (e) => {
        if (narrow) return;
        const r = hero.getBoundingClientRect();
        stage.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        stage.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      hero.addEventListener("pointerleave", () => { stage.style.setProperty("--px", 0); stage.style.setProperty("--py", 0); });
    }
  }

  function share() {
    document.querySelectorAll("[data-share]").forEach((a) => {
      const url = location.href.split("#")[0];
      a.href = `mailto:?subject=${encodeURIComponent(T.shareSubject)}&body=${encodeURIComponent(T.shareBody(url))}`;
    });
  }
  document.addEventListener("DOMContentLoaded", () => { document.querySelectorAll("[data-hero-live]").forEach(mount); share(); });
})();
