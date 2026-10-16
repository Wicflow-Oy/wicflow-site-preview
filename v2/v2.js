/* Wicflow concept site: navigation, the hero's pilot window, the systems tabs and reveals.
   Everything works without this script (all content is in the HTML); it only adds motion and the tabs' behaviour.
   Under prefers-reduced-motion nothing moves on its own. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Hero: the pilot in three stages (agreed in writing, built, your decision), with the line below the stages
  // filling as each one plays. It pauses off screen, in a hidden tab and while the pointer rests on it.
  const pw = document.querySelector("[data-pw]");
  if (pw && !still) {
    const line = pw.querySelector(".pw-line i");
    const times = [5600, 7600, 6800];
    let stage = 1, left = times[0], since = 0, timer = 0, running = false;
    const scale = (n) => `scaleX(${n / 3})`;
    const enter = (n) => {
      stage = n;
      pw.dataset.stage = String(n);
      line.style.transition = "none";
      line.style.transform = scale(n - 1);
      void line.offsetWidth;
      left = times[n - 1];
    };
    const run = () => {
      if (running) return;
      running = true;
      since = performance.now();
      line.style.transition = `transform ${left}ms linear`;
      line.style.transform = scale(stage);
      timer = setTimeout(() => { running = false; enter(stage % 3 + 1); run(); }, left);
    };
    const hold = () => {
      if (!running) return;
      running = false;
      clearTimeout(timer);
      left = Math.max(0, left - (performance.now() - since));
      const now = getComputedStyle(line).transform;
      line.style.transition = "none";
      line.style.transform = now && now !== "none" ? now : scale(stage - 1);
    };
    enter(1);
    let inView = false, resting = false;
    const sync = () => (inView && !resting && !document.hidden ? run() : hold());
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .3 }).observe(pw);
    pw.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { resting = true; sync(); } });
    pw.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { resting = false; sync(); } });
    document.addEventListener("visibilitychange", sync);
  }

  // Systems: tabs that also advance on their own until the visitor picks one (on wide screens only; on a phone the
  // panel would change under the reader's thumb).
  const grid = document.querySelector("[data-tabs]");
  if (grid) {
    const tabs = [...grid.querySelectorAll('[role="tab"]')];
    const list = tabs[0].parentElement;
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
      if (focus) tabs[current].focus({ preventScroll: true });
      if (grid.classList.contains("playing")) { grid.classList.remove("playing"); void grid.offsetWidth; grid.classList.add("playing"); }
      // On small screens the tabs scroll sideways; bring the chosen one into view without moving the page.
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: Math.max(0, tabs[current].offsetLeft - 8), behavior: still ? "auto" : "smooth" });
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
    if (still || !window.matchMedia("(min-width: 901px)").matches) {
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

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .sys-grid, .pilot-intro, .timeline li, .ideas, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(sel).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [];
      el.style.setProperty("--d", Math.min(Math.max(sibs.indexOf(el), 0), 4) * 0.07 + "s");
      el.classList.add("rv");
      io.observe(el);
    });
  }
})();
