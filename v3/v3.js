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

  // Made for your company: the chosen company's six blocks drop into the stack one by one, the list and the caption
  // follow, then the stack clears and builds again. Picking another company starts its build; picking a block in the
  // list stops the loop and shows the stack up to that block.
  const bc = document.querySelector("[data-blocks]");
  if (bc) {
    const lits = [...bc.querySelectorAll(".lit")].sort((a, b) => a.dataset.i - b.dataset.i);
    const cos = [...bc.querySelectorAll(".bl-co")];
    const picks = [...bc.querySelectorAll(".bl-pick-b")];
    const cap = bc.querySelector(".bl-cap"), count = bc.querySelector("[data-count]");
    const nameEl = bc.querySelector("[data-name]"), textEl = bc.querySelector("[data-text]");
    let items = [...cos[0].querySelectorAll(".bl-item")];
    let n = 0, timer = 0, running = false, manual = false, inView = false;
    const show = (k) => {
      n = k;
      lits.forEach((l, i) => l.classList.toggle("on", i < k));
      items.forEach((it, i) => { it.classList.toggle("on", i < k); it.classList.toggle("now", i === k - 1); });
      const cur = items[Math.max(0, k - 1)];
      count.textContent = String(k).padStart(2, "0");
      nameEl.textContent = cur.querySelector("b").textContent;
      textEl.textContent = cur.querySelector(".bl-main span").textContent;
      cap.classList.toggle("idle", k === 0);
    };
    const tick = () => {
      if (n < items.length) { show(n + 1); timer = setTimeout(tick, n === items.length ? 3400 : 1300); return; }
      bc.classList.add("fading");
      timer = setTimeout(() => { show(0); bc.classList.remove("fading"); timer = setTimeout(tick, 700); }, 600);
    };
    const sync = () => {
      const go = inView && !document.hidden && !manual && !still;
      if (go && !running) { running = true; timer = setTimeout(tick, n === 0 ? 300 : 900); }
      else if (!go && running) { running = false; clearTimeout(timer); }
    };
    const pick = (ci, focus) => {
      picks.forEach((b, i) => { b.setAttribute("aria-selected", String(i === ci)); b.tabIndex = i === ci ? 0 : -1; });
      cos.forEach((c, i) => c.classList.toggle("on", i === ci));
      if (focus) picks[ci].focus();
      items.forEach((it) => it.classList.remove("on", "now"));
      items = [...cos[ci].querySelectorAll(".bl-item")];
      clearTimeout(timer); running = false; manual = false; bc.classList.remove("fading");
      show(still ? items.length : 0);
      sync();
    };
    picks.forEach((b, ci) => {
      b.addEventListener("click", () => pick(ci, false));
      b.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); pick((ci + d + picks.length) % picks.length, true); }
      });
    });
    cos.forEach((c) => c.querySelectorAll(".bl-item").forEach((it, i) => it.querySelector("button").addEventListener("click", () => {
      manual = true; sync(); clearTimeout(timer); bc.classList.remove("fading"); show(i + 1);
    })));
    if (still) show(items.length);
    else {
      show(0);
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .35 }).observe(bc);
      document.addEventListener("visibilitychange", sync);
    }
  }

  // Example control room: the counters count up the first time it is seen, and the live feed fills in line by line,
  // pauses, and plays again. The flow's dots are SVG animations, paused under reduced motion.
  const cr = document.querySelector("[data-ctrl]");
  if (cr) {
    const locale = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" }[root.lang] || "en-GB";
    const euro = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    const fmt = (el, v) => el.dataset.kind === "eur" ? euro.format(v) : v + el.dataset.suf;
    const nums = [...cr.querySelectorAll("[data-to]")];
    const feed = [...cr.querySelectorAll(".fe")];
    const flow = cr.querySelector(".cr-flow");
    if (still) {
      if (flow && flow.pauseAnimations) flow.pauseAnimations();
    } else {
      let counted = false, ftimer = 0, fn = 0, inView = false;
      const count = () => {
        counted = true;
        const t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / 1600), q = 1 - Math.pow(1 - k, 3);
          nums.forEach((el) => { el.textContent = fmt(el, Math.round(Number(el.dataset.to) * q)); });
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const play = () => {
        if (fn < feed.length) { feed[fn].classList.add("on"); fn += 1; ftimer = setTimeout(play, fn === feed.length ? 4200 : 1100); return; }
        feed.forEach((f) => f.classList.remove("on"));
        fn = 0;
        ftimer = setTimeout(play, 700);
      };
      nums.forEach((el) => { el.textContent = fmt(el, 0); });
      const sync = () => {
        const go = inView && !document.hidden;
        if (go && !counted) count();
        clearTimeout(ftimer);
        if (go) ftimer = setTimeout(play, 400);
      };
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .3 }).observe(cr);
      document.addEventListener("visibilitychange", sync);
    }
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .cr-stage, .bl-card, .step, .ideas, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
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
