/* Wicflow v3 concept: navigation, the hero's product window, the systems tabs and reveals.
   Everything works without this script (all content is in the HTML and every message is shown); it only adds motion.
   On wide screens the window is pinned while the visitor scrolls: it grows into place, zooms in on the conversation
   while the messages arrive one by one, and zooms back out. On smaller screens the messages play once the window is
   in view. Under prefers-reduced-motion nothing moves and every message is shown. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (k) => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

  // Navigation: frosted white once the page scrolls, and the menu on small screens.
  const nav = document.querySelector("[data-nav]");
  const onNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 24);
  onNav();
  window.addEventListener("scroll", onNav, { passive: true });
  const menuBtn = document.querySelector(".nav-menu");
  const links = document.getElementById("navlinks");
  const setMenu = (open) => {
    if (!menuBtn || !links) return;
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("menu-open", open);
    const label = menuBtn.querySelector(".nav-menu-l");
    if (label) label.textContent = open ? menuBtn.dataset.close : menuBtn.dataset.open;
  };
  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", () => { if (window.innerWidth > 1080) setMenu(false); });
  }

  // Hero: the Company Brain window and the conversation inside it.
  const show = document.querySelector("[data-show]");
  const frame = document.querySelector("[data-frame]");
  const msgs = [...document.querySelectorAll(".a-msgs .m")];
  const setStep = (n) => msgs.forEach((m, i) => m.classList.toggle("on", i < n));
  if (still || !show || !frame) {
    setStep(msgs.length);
  } else {
    const wide = window.matchMedia("(min-width: 1024px) and (min-height: 620px)");
    const at = [.1, .22, .34, .5, .62, .72];  // how far through the pinned stretch each message arrives
    let mode = "", ticking = false, timer = 0, played = false, io = null;
    const update = () => {
      ticking = false;
      const r = show.getBoundingClientRect(), vh = window.innerHeight;
      const enter = ease(clamp(1 - r.top / vh));
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      const zoom = 1 + .28 * (ease(clamp((p - .03) / .17)) - ease(clamp((p - .82) / .15)));
      frame.style.transform = `scale(${((.86 + .14 * enter) * zoom).toFixed(4)})`;
      setStep(at.filter((x) => p >= x).length);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const play = () => {
      played = true;
      let n = 0;
      const next = () => { setStep(++n); if (n < msgs.length) timer = setTimeout(next, 1200); };
      timer = setTimeout(next, 400);
    };
    const apply = () => {
      const next = wide.matches ? "scroll" : "timed";
      if (next === mode) return;
      mode = next;
      clearTimeout(timer);
      if (io) { io.disconnect(); io = null; }
      if (mode === "scroll") {
        root.classList.add("scrolly");
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        update();
      } else {
        root.classList.remove("scrolly");
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        frame.style.transform = "";
        if (played) { setStep(msgs.length); return; }
        setStep(0);
        io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); io = null; play(); } }, { threshold: .3 });
        io.observe(frame);
      }
    };
    apply();
    wide.addEventListener("change", apply);
  }

  // Systems: tabs, chosen by click or arrow keys.
  const box = document.querySelector("[data-tabs]");
  if (box) {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
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
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: Math.max(0, tabs[current].offsetLeft - 8), behavior: still ? "auto" : "smooth" });
    };
    tabs.forEach((t, n) => {
      t.addEventListener("click", () => select(n, false));
      t.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); select(current + keys[e.key], true); }
        else if (e.key === "Home") { e.preventDefault(); select(0, true); }
        else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .sys-box, .step, .ideas, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
    const rio = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(sel).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [];
      el.style.setProperty("--d", Math.min(Math.max(sibs.indexOf(el), 0), 4) * 0.08 + "s");
      el.classList.add("rv");
      rio.observe(el);
    });
  }
})();
