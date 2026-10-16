/* Wicflow concept site: navigation, the hero's lead flow, the systems tabs, counters and reveals.
   Everything works without this script (all content is in the HTML); it only adds motion and the tabs' behaviour.
   Under prefers-reduced-motion nothing moves on its own. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lang = root.lang || "en";
  const locale = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" }[lang] || "en-GB";
  const euro = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const ease = (k) => 1 - Math.pow(1 - k, 3);

  function countTo(el, from, to, ms, fmt) {
    if (still) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      el.textContent = fmt(Math.round(from + (to - from) * ease(k)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Navigation: a solid bar once the page scrolls, and the menu on small screens.
  const nav = document.querySelector("[data-nav]");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  const menuBtn = document.querySelector(".nav-menu");
  const links = document.getElementById("navlinks");
  const setMenu = (open) => {
    if (!menuBtn || !links) return;
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    const label = menuBtn.querySelector(".nav-menu-l");
    if (label) label.textContent = open ? menuBtn.dataset.close : menuBtn.dataset.open;
  };
  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", () => { if (window.innerWidth > 1080) setMenu(false); });
  }

  // Hero: a lead travels from a buying signal to the pipeline, one card at a time.
  const flow = document.querySelector("[data-flow]");
  if (flow) {
    const cards = [...flow.querySelectorAll(".fc")];
    const pipe = flow.querySelector("[data-pipe]");
    const from = Number(pipe.dataset.from), to = Number(pipe.dataset.to);
    const show = (i) => cards.forEach((c, n) => { c.classList.toggle("on", n <= i); c.classList.toggle("now", n === i); });
    if (still) {
      show(cards.length - 1);
      cards[cards.length - 1].classList.remove("now");
      pipe.textContent = euro.format(to);
    } else {
      let i = -1, timer = 0, visible = true;
      const tick = () => {
        i = (i + 1) % (cards.length + 1);
        if (i === cards.length) { show(-1); pipe.textContent = euro.format(from); timer = setTimeout(tick, 900); return; }
        show(i);
        if (i === cards.length - 1) countTo(pipe, from, to, 1400, (v) => euro.format(v));
        timer = setTimeout(tick, i === cards.length - 1 ? 4200 : 2300);
      };
      pipe.textContent = euro.format(from);
      const start = () => { if (!timer) tick(); };
      const stop = () => { clearTimeout(timer); timer = 0; };
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !document.hidden) start(); else stop(); }).observe(flow);
      document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else if (visible) start(); });
    }
  }

  // Systems: tabs that also advance on their own until the visitor picks one.
  const grid = document.querySelector("[data-tabs]");
  if (grid) {
    const tabs = [...grid.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    let current = 0;
    const select = (i, focus) => {
      current = (i + tabs.length) % tabs.length;
      tabs.forEach((t, n) => {
        const on = n === current;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[current].focus();
      if (grid.classList.contains("playing")) { grid.classList.remove("playing"); void grid.offsetWidth; grid.classList.add("playing"); }
      if (window.innerWidth <= 900) tabs[current].scrollIntoView({ block: "nearest", inline: "nearest", behavior: still ? "auto" : "smooth" });
    };
    const stopAuto = () => { grid.classList.remove("playing", "paused"); grid.classList.add("stopped"); };
    tabs.forEach((t, n) => {
      t.addEventListener("click", () => { stopAuto(); select(n, false); });
      t.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); stopAuto(); select(current + keys[e.key], true); }
        else if (e.key === "Home") { e.preventDefault(); stopAuto(); select(0, true); }
        else if (e.key === "End") { e.preventDefault(); stopAuto(); select(tabs.length - 1, true); }
      });
      t.querySelector(".sys-bar i").addEventListener("animationend", () => { if (grid.classList.contains("playing")) select(current + 1, false); });
    });
    if (still) {
      grid.classList.add("stopped");
    } else {
      grid.classList.add("playing", "paused");
      let inView = false, hover = false;
      const sync = () => grid.classList.toggle("paused", !inView || hover || document.hidden);
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .35 }).observe(grid);
      grid.addEventListener("pointerenter", () => { hover = true; sync(); });
      grid.addEventListener("pointerleave", () => { hover = false; sync(); });
      grid.addEventListener("focusin", () => { hover = true; sync(); });
      grid.addEventListener("focusout", () => { hover = false; sync(); });
      document.addEventListener("visibilitychange", sync);
    }
  }

  // Numbers count up the first time they are seen.
  const counters = [...document.querySelectorAll("[data-count]")];
  if (counters.length) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, n = Number(el.dataset.count);
      countTo(el, 0, n, 1500, (v) => String(v));
      io.unobserve(el);
    }), { threshold: .6 });
    counters.forEach((el) => { if (!still) el.textContent = "0"; io.observe(el); });
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .sys-grid, .steps li, .ideas, .pilot-foot, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(sel).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [];
      el.style.setProperty("--d", Math.min(Math.max(sibs.indexOf(el), 0), 4) * 0.08 + "s");
      el.classList.add("rv");
      io.observe(el);
    });
  }
})();
