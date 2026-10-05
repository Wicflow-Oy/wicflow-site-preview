/* The home hero's live scene: about 16 seconds of the product at work, looping, drawn in the apps' look.
   Sales Radar finds a tender, the AI writes the first email (typed live), the cursor approves it, the customer
   replies and a meeting is booked, Company Brain gets the meeting and a task is ticked off, and the time saved this
   week counts up. Glowing lines draw between the systems with light flowing along them; cards sit at different depths,
   float a little and the whole scene leans toward the mouse. Decorative (the clickable demo is just below); runs only
   while visible and shows the finished scene, still, when reduced motion is on.
   Also fills in the "send it to your boss" link: a prewritten email with a link to the page.
   Strings are {sv, fi, en}; WF.L picks the page language. Made-up company and people. */
(() => {
  const { L, eur } = window.WF;
  const T = {
    radar: L({ sv: "Säljradar", fi: "Myyntitutka", en: "Sales Radar" }),
    tender: L({ sv: "Ekby skola upphandlar värmepumpar till tre byggnader", fi: "Ekbyn koulu kilpailuttaa lämpöpumput kolmeen rakennukseen", en: "Ekby school is tendering heat pumps for three buildings" }),
    tenderMeta: L({ sv: "Offentlig upphandling · Finns inte i ditt CRM", fi: "Julkinen hankinta · Ei CRM:ssäsi", en: "Public tender · Not in your CRM" }),
    add: L({ sv: "Lägg till i listan", fi: "Lisää listalle", en: "Add to the list" }),
    added: L({ sv: "Tillagd i listan", fi: "Lisätty listalle", en: "Added to the list" }),
    reach: L({ sv: "Prospektering", fi: "Prospektointi", en: "Outreach" }),
    writing: L({ sv: "Skriver det första mejlet …", fi: "Kirjoittaa ensimmäistä viestiä …", en: "Writing the first email …" }),
    ready: L({ sv: "Utkastet är klart", fi: "Luonnos valmis", en: "Draft ready" }),
    to: L({ sv: "Till: Anders Holm, Ekby skola", fi: "Vastaanottaja: Anders Holm, Ekby skola", en: "To: Anders Holm, Ekby skola" }),
    body: L({ sv: "Hej Anders, jag såg att Ekby skola byter värmesystem i tre byggnader. Vi installerade nyligen värmepumpar i två skolor i Sibbo, ska jag berätta hur det gick?",
              fi: "Hei Anders, huomasin, että Ekbyn koulu uusii kolmen rakennuksen lämmityksen. Asensimme hiljattain lämpöpumput kahteen kouluun Sipoossa. Kerronko, miten se meni?",
              en: "Hi Anders, I saw that Ekby school is replacing the heating in three buildings. We recently installed heat pumps in two schools in Sipoo. Shall I tell you how it went?" }),
    approve: L({ sv: "Godkänn och skicka", fi: "Hyväksy ja lähetä", en: "Approve and send" }),
    sent: L({ sv: "Skickat", fi: "Lähetetty", en: "Sent" }),
    replyLbl: L({ sv: "Svar", fi: "Vastaus", en: "Reply" }),
    reply: L({ sv: "Låter intressant. Passar torsdag kl. 10?", fi: "Kuulostaa kiinnostavalta. Sopiiko torstai klo 10?", en: "Sounds interesting. Does Thursday at 10 work?" }),
    meet: L({ sv: "Möte bokat", fi: "Tapaaminen varattu", en: "Meeting booked" }),
    meetSub: L({ sv: "Tors 10:00 · Ekby skola · i din kalender", fi: "To 10.00 · Ekby skola · lisätty kalenteriin", en: "Thu 10:00 · Ekby skola · in your calendar" }),
    today: L({ sv: "I dag", fi: "Tänään", en: "Today" }),
    hello: L({ sv: "God morgon, Anna. 3 saker behöver dig.", fi: "Huomenta, Anna. 3 asiaa odottaa sinua.", en: "Good morning, Anna. 3 things need you." }),
    newItem: L({ sv: "Nytt: möte med Ekby skola, tors 10:00", fi: "Uusi: tapaaminen Ekby skolan kanssa, to 10.00", en: "New: meeting with Ekby skola, Thu 10:00" }),
    items: [
      L({ sv: `Godkänn offerten till Strandgården · ${eur(18420)}`, fi: `Hyväksy Strandgårdenin tarjous · ${eur(18420)}`, en: `Approve the Strandgården quote · ${eur(18420)}` }),
      L({ sv: "Ge anbudet för Ekby skola till Mikael", fi: "Anna Ekbyn koulun tarjous Mikaelille", en: "Give the Ekby tender to Mikael" }),
      L({ sv: "Påminn Sara om Lövdal Lantbruk", fi: "Muistuta Saraa Lövdal Lantbrukista", en: "Remind Sara about Lövdal Lantbruk" }),
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
  const svg = (paths, cls = "") => `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICON = {
    radar: svg('<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>'),
    send: svg('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'),
    brain: svg('<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    calendar: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>'),
    sparkles: svg('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
  };
  const tile = (icon, bg, fg, cls = "") => `<span class="hl-tile${cls ? " " + cls : ""}" style="background:${bg};color:${fg}">${icon}</span>`;
  const CURSOR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 2.5v17.2l4.6-4.5 2.9 6.6 2.7-1.2-2.9-6.5h6.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seq = 0;

  function mount(root) {
    const id = "hl" + (++seq);
    const dots = (p) => [0, 0.55, 1.1].map((b) => `<circle r="3.2" class="hl-dot"><animateMotion dur="1.65s" begin="${b}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .25 1"><mpath href="#${id}-${p}"/></animateMotion></circle>`).join("");
    root.innerHTML = `
      <div class="hl-aura" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="hl-floor" aria-hidden="true"></div>
      <div class="hl-stage">
        <svg class="hl-links" aria-hidden="true">
          <defs><linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3451e6"/><stop offset=".55" stop-color="#7b5cff"/><stop offset="1" stop-color="#c45cff"/></linearGradient></defs>
          ${["p1", "p2", "p3"].map((p) => `<path id="${id}-${p}" data-link="${p}" stroke="url(#${id}-g)"/><g class="hl-flow" data-flow="${p}">${dots(p)}</g>`).join("")}
        </svg>
        <div class="hl-card hl-radar">
          <div class="hl-head">${tile(ICON.radar, "#DDF3E4", "#1E7B43", "scan")}${T.radar}<time>06:02</time></div>
          <div class="hl-title">${T.tender}</div><div class="hl-meta">${T.tenderMeta}</div>
          <span class="hl-chip" data-x="chip">${T.add}</span>
        </div>
        <div class="hl-card hl-stat">
          <div class="hl-head">${tile(ICON.clock, "#E5F0FF", "#0055C4")}<small>${T.saved}</small></div>
          <b data-x="hours">0 h</b>
          <svg class="hl-spark" viewBox="0 0 140 36" preserveAspectRatio="none" aria-hidden="true"><polyline points="2,32 24,28 46,30 68,20 90,22 112,10 138,4"/></svg>
          <small>${T.savedSub}</small>
        </div>
        <div class="hl-card hl-mail">
          <div class="hl-head">${tile(ICON.send, "#FFE9D9", "#C2570C")}${T.reach}<span class="hl-ai" data-x="ai">${ICON.sparkles}<span data-x="aitext">${T.writing}</span></span></div>
          <div class="hl-to">${T.to}</div>
          <div class="hl-body"><span data-x="typed"></span><i class="hl-caret" data-x="caret"></i></div>
          <span class="hl-btn" data-x="btn">${T.approve}</span>
          <div class="hl-reply" data-x="reply"><b>${T.replyLbl} · Anders Holm</b><span>${T.reply}</span></div>
        </div>
        <div class="hl-card hl-meet">
          ${tile(ICON.calendar, "#E3F6E8", "#1A7533")}<div><b>${T.meet}</b><small>${T.meetSub}</small></div>
        </div>
        <div class="hl-card hl-brain">
          <div class="hl-head">${tile(ICON.brain, "#E7E2FF", "#3438EE")}Company Brain<em>${T.today}</em></div>
          <div class="hl-title">${T.hello}</div>
          <ul class="hl-list"><li class="hl-new" data-x="new"><i></i><span>${T.newItem}</span></li>${T.items.map((t, i) => `<li data-x="item${i}"><i></i><span>${t}</span></li>`).join("")}</ul>
        </div>
        <span class="hl-cursor" data-x="cursor">${CURSOR}<i class="hl-ripple"></i></span>
      </div>
      <span class="hl-note">${T.note}</span>`;

    const $ = (k) => root.querySelector(`[data-x="${k}"]`);
    const stage = root.querySelector(".hl-stage");
    const links = root.querySelector(".hl-links");
    const cards = [...root.querySelectorAll(".hl-card")];
    const card = (cls) => root.querySelector(`.hl-${cls}`);

    // Lines between the systems, from the edge of one card to the edge of the next, so they run through the gaps.
    const EDGE = { b: [0.5, 1, 0, 1], t: [0.5, 0, 0, -1], l: [0, 0.5, -1, 0], r: [1, 0.5, 1, 0] };
    const anchor = (el, side) => {
      const [fx, fy, nx, ny] = EDGE[side];
      return { x: el.offsetLeft + el.offsetWidth * fx, y: el.offsetTop + el.offsetHeight * fy, nx, ny };
    };
    const LINKS = [["p1", "radar", "b", "mail", "l"], ["p2", "mail", "b", "meet", "t"], ["p3", "meet", "l", "brain", "r"]];
    function layoutLinks() {
      const w = stage.offsetWidth, h = stage.offsetHeight;
      links.setAttribute("viewBox", `0 0 ${w} ${h}`);
      links.setAttribute("width", w); links.setAttribute("height", h);
      LINKS.forEach(([p, a, as, b, bs]) => {
        const A = anchor(card(a), as), B = anchor(card(b), bs), k = 70;
        const path = root.querySelector(`[data-link="${p}"]`);
        path.setAttribute("d", `M ${A.x} ${A.y} C ${A.x + A.nx * k} ${A.y + A.ny * k}, ${B.x + B.nx * k} ${B.y + B.ny * k}, ${B.x} ${B.y}`);
        path.style.setProperty("--len", Math.ceil(path.getTotalLength()));
      });
    }
    const link = (p, on) => {
      root.querySelector(`[data-link="${p}"]`).classList.toggle("is-on", on);
      root.querySelector(`[data-flow="${p}"]`).classList.toggle("is-on", on);
    };

    const setHours = (n) => { $("hours").textContent = `${n} h`; };
    function finalState() {
      layoutLinks();
      cards.forEach((c) => c.classList.add("is-in"));
      $("chip").textContent = T.added; $("chip").classList.add("is-done");
      $("typed").textContent = T.body; $("caret").hidden = true;
      $("ai").classList.add("is-done"); $("aitext").textContent = T.ready;
      $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done");
      $("reply").classList.add("is-in"); $("new").classList.add("is-in"); $("item0").classList.add("is-done");
      root.querySelector(".hl-spark").classList.add("is-in");
      ["p1", "p2", "p3"].forEach((p) => link(p, true));
      setHours(31);
    }
    if (reduce) { root.classList.add("is-still"); setTimeout(finalState, 0); return; }

    let timers = [], running = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const cursor = $("cursor");
    // The cursor moves in a curve (different easing per axis) and sits just above the card it points at, so the 3D
    // tilt doesn't pull it off the target.
    function cursorTo(el, onCard) {
      let x = el.offsetWidth * 0.5, y = el.offsetHeight * 0.55, node = el;
      while (node && node !== stage) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
      const z = parseFloat(getComputedStyle(onCard).getPropertyValue("--z")) || 0;
      cursor.style.left = `${x}px`; cursor.style.top = `${y}px`;
      cursor.style.setProperty("--cz", `${z + 4}px`);
    }
    const click = () => { cursor.classList.remove("is-click"); void cursor.offsetWidth; cursor.classList.add("is-click"); };
    function type(text, start, ms) {
      const step = Math.max(1, Math.round(text.length / (ms / 30)));
      for (let i = 0, t = 0; i <= text.length; i += step, t += 30) at(start + t, () => { $("typed").textContent = text.slice(0, i); });
      at(start + Math.ceil(text.length / step) * 30 + 30, () => { $("typed").textContent = text; });
    }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      cards.forEach((c) => c.classList.remove("is-in"));
      $("chip").textContent = T.add; $("chip").classList.remove("is-done");
      $("typed").textContent = ""; $("caret").hidden = false;
      $("ai").classList.remove("is-done"); $("aitext").textContent = T.writing;
      $("btn").textContent = T.approve; $("btn").classList.remove("is-done");
      $("reply").classList.remove("is-in"); $("new").classList.remove("is-in");
      root.querySelectorAll(".hl-list li").forEach((li) => li.classList.remove("is-done"));
      root.querySelector(".hl-spark").classList.remove("is-in");
      ["p1", "p2", "p3"].forEach((p) => link(p, false));
      cursor.classList.remove("is-in", "is-click");
      setHours(0);
      // Hide the lines while they undraw, so they never hang in the air without their cards.
      links.classList.add("is-hidden"); setTimeout(() => links.classList.remove("is-hidden"), 1150);
    }
    function play() {
      reset();
      layoutLinks();
      cursor.style.left = "62%"; cursor.style.top = "96%"; cursor.style.setProperty("--cz", "120px");
      at(200, () => card("radar").classList.add("is-in"));
      at(700, () => { cursor.classList.add("is-in"); cursorTo($("chip"), card("radar")); });
      at(1650, () => { click(); $("chip").textContent = T.added; $("chip").classList.add("is-done"); link("p1", true); });
      at(2100, () => card("mail").classList.add("is-in"));
      type(T.body, 2300, 2100);
      at(4500, () => { $("caret").hidden = true; $("ai").classList.add("is-done"); $("aitext").textContent = T.ready; });
      at(4650, () => cursorTo($("btn"), card("mail")));
      at(5600, () => { click(); $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done"); });
      at(6400, () => $("reply").classList.add("is-in"));
      at(7200, () => { card("meet").classList.add("is-in"); link("p2", true); });
      at(7900, () => { card("brain").classList.add("is-in"); link("p3", true); });
      at(8500, () => $("new").classList.add("is-in"));
      at(9000, () => cursorTo(root.querySelector('[data-x="item0"] i'), card("brain")));
      at(9950, () => { click(); $("item0").classList.add("is-done"); });
      at(10400, () => { card("stat").classList.add("is-in"); root.querySelector(".hl-spark").classList.add("is-in"); });
      for (let i = 1; i <= 31; i++) at(10500 + i * 42, () => setHours(i));
      at(11200, () => cursor.classList.remove("is-in"));
      at(15600, () => cards.forEach((c, i) => setTimeout(() => c.classList.remove("is-in"), i * 90)));
      at(15700, () => ["p1", "p2", "p3"].forEach((p) => link(p, false)));
      at(16600, () => { if (running) play(); });
    }
    function start() { if (running) return; running = true; play(); }
    function stop() { running = false; reset(); finalState(); }

    // Only animate while the scene is on screen and the tab is visible; keep the lines right when the size changes.
    let visible = false;
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible && !document.hidden ? start() : stop(); }, { threshold: 0.2 });
    io.observe(root);
    document.addEventListener("visibilitychange", () => (visible && !document.hidden ? start() : stop()));
    window.addEventListener("resize", () => layoutLinks());

    // Depth: the scene leans toward the mouse.
    const hero = root.closest("section");
    if (hero && window.matchMedia("(pointer: fine)").matches) {
      hero.addEventListener("pointermove", (e) => {
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
