/* The home hero's live scene: a short loop of the product at work, drawn in the apps' look. Sales Radar finds a
   tender, Outreach drafts the first email and it gets approved, Company Brain ticks off the morning list, and the time
   saved this week counts up. Decorative (the clickable demo is just below); runs only while visible, follows the
   mouse a little, and shows the finished scene without motion when reduced motion is on.
   Also fills in the "send it to your boss" link: a prewritten email with a link to the page.
   Strings are {sv, fi, en}; WF.L picks the page language. Made-up company and people. */
(() => {
  const { L, eur } = window.WF;
  const T = {
    now: "06:02",
    radar: { sv: "Säljradar", fi: "Myyntitutka", en: "Sales Radar" },
    tender: L({ sv: "Ekby skola upphandlar värmepumpar till tre byggnader", fi: "Ekbyn koulu kilpailuttaa lämpöpumput kolmeen rakennukseen", en: "Ekby school is tendering heat pumps for three buildings" }),
    tenderMeta: L({ sv: "Offentlig upphandling · Finns inte i ditt CRM", fi: "Julkinen hankinta · Ei CRM:ssäsi", en: "Public tender · Not in your CRM" }),
    add: L({ sv: "Lägg till i listan", fi: "Lisää listalle", en: "Add to the list" }),
    added: L({ sv: "Tillagd i listan", fi: "Lisätty listalle", en: "Added to the list" }),
    reach: { sv: "Prospektering", fi: "Prospektointi", en: "Outreach" },
    draft: L({ sv: "Utkast", fi: "Luonnos", en: "Draft" }),
    to: L({ sv: "Till: Anders Holm, Ekby skola", fi: "Vastaanottaja: Anders Holm, Ekby skola", en: "To: Anders Holm, Ekby skola" }),
    body: L({ sv: "Hej Anders, jag såg att Ekby skola byter värmesystem i tre byggnader. Vi installerade nyligen värmepumpar i två skolor i Sibbo …",
              fi: "Hei Anders, huomasin, että Ekbyn koulu uusii kolmen rakennuksen lämmityksen. Asensimme hiljattain lämpöpumput kahteen kouluun Sipoossa …",
              en: "Hi Anders, I saw that Ekby school is replacing the heating in three buildings. We recently installed heat pumps in two schools in Sipoo …" }),
    approve: L({ sv: "Godkänn och skicka", fi: "Hyväksy ja lähetä", en: "Approve and send" }),
    sent: L({ sv: "Skickat", fi: "Lähetetty", en: "Sent" }),
    today: L({ sv: "I dag", fi: "Tänään", en: "Today" }),
    hello: L({ sv: "God morgon, Anna. 3 saker behöver dig.", fi: "Huomenta, Anna. 3 asiaa odottaa sinua.", en: "Good morning, Anna. 3 things need you." }),
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
  const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICON = {
    radar: svg('<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>'),
    send: svg('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'),
    brain: svg('<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
  };
  const tile = (icon, bg, fg) => `<span class="hl-tile" style="background:${bg};color:${fg}">${icon}</span>`;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mount(root) {
    root.innerHTML = `
      <div class="hl-stage">
        <div class="hl-card hl-radar">
          <div class="hl-head">${tile(ICON.radar, "#DDF3E4", "#1E7B43")}${L(T.radar)}<time>${T.now}</time></div>
          <div class="hl-title">${T.tender}</div><div class="hl-meta">${T.tenderMeta}</div>
          <span class="hl-chip" data-x="chip">${T.add}</span>
        </div>
        <div class="hl-card hl-stat">
          <div class="hl-head">${tile(ICON.clock, "#E5F0FF", "#0055C4")}</div>
          <small>${T.saved}</small><b data-x="hours">0 h</b><small>${T.savedSub}</small>
        </div>
        <div class="hl-card hl-mail">
          <div class="hl-head">${tile(ICON.send, "#FFE9D9", "#C2570C")}${L(T.reach)}<em>${T.draft}</em></div>
          <div class="hl-to">${T.to}</div><div class="hl-body">${T.body}</div>
          <span class="hl-btn" data-x="btn">${T.approve}</span>
        </div>
        <div class="hl-card hl-brain">
          <div class="hl-head">${tile(ICON.brain, "#E7E2FF", "#3438EE")}Company Brain<em>${T.today}</em></div>
          <div class="hl-title">${T.hello}</div>
          <ul class="hl-list">${T.items.map((t, i) => `<li data-x="item${i}"><i></i><span>${t}</span></li>`).join("")}</ul>
        </div>
        <span class="hl-cursor" data-x="cursor"></span>
      </div>
      <span class="hl-note">${T.note}</span>`;
    const $ = (k) => root.querySelector(`[data-x="${k}"]`);
    const stage = root.querySelector(".hl-stage");
    const cards = [...root.querySelectorAll(".hl-card")];
    const card = (cls) => root.querySelector(`.hl-${cls}`);

    const setHours = (n) => { $("hours").textContent = `${n} h`; };
    const finalState = () => {
      cards.forEach((c) => c.classList.add("is-in"));
      $("chip").textContent = T.added; $("chip").classList.add("is-done");
      $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done");
      $("item0").classList.add("is-done");
      setHours(31);
    };
    if (reduce) { finalState(); return; }

    let timers = [], running = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    // The cursor lives in the stage; measure each target through its offset parents up to the stage.
    const cursorTo = (el) => {
      let x = el.offsetWidth * 0.55, y = el.offsetHeight * 0.55, node = el;
      while (node && node !== stage) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
      $("cursor").style.left = `${x}px`; $("cursor").style.top = `${y}px`;
    };
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      cards.forEach((c) => c.classList.remove("is-in"));
      $("chip").textContent = T.add; $("chip").classList.remove("is-done");
      $("btn").textContent = T.approve; $("btn").classList.remove("is-done", "is-pressed");
      root.querySelectorAll(".hl-list li").forEach((li) => li.classList.remove("is-done"));
      $("cursor").classList.remove("is-in");
      setHours(0);
    }
    function play() {
      reset();
      const c = $("cursor");
      c.style.left = "70%"; c.style.top = "92%";
      at(300, () => card("radar").classList.add("is-in"));
      at(900, () => { c.classList.add("is-in"); cursorTo($("chip")); });
      at(1900, () => { $("chip").textContent = T.added; $("chip").classList.add("is-done"); });
      at(2400, () => card("mail").classList.add("is-in"));
      at(3100, () => cursorTo($("btn")));
      at(4100, () => $("btn").classList.add("is-pressed"));
      at(4300, () => { $("btn").classList.remove("is-pressed"); $("btn").innerHTML = `${ICON.check} ${T.sent}`; $("btn").classList.add("is-done"); });
      at(4900, () => card("brain").classList.add("is-in"));
      at(5600, () => cursorTo(root.querySelector('[data-x="item0"] i')));
      at(6500, () => $("item0").classList.add("is-done"));
      at(7000, () => card("stat").classList.add("is-in"));
      for (let i = 1; i <= 31; i++) at(7000 + i * 38, () => setHours(i));
      at(8200, () => c.classList.remove("is-in"));
      at(12500, () => cards.forEach((x) => x.classList.remove("is-in")));
      at(13300, () => { if (running) play(); });
    }
    function start() { if (running) return; running = true; play(); }
    function stop() { running = false; reset(); finalState(); }

    // Only animate while the scene is on screen and the tab is visible.
    let visible = false;
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible && !document.hidden ? start() : stop(); }, { threshold: 0.25 });
    io.observe(root);
    document.addEventListener("visibilitychange", () => (visible && !document.hidden ? start() : stop()));

    // A little depth: the scene leans toward the mouse.
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
