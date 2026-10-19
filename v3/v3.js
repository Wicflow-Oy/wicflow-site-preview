/* Wicflow v3 concept: navigation, Company Brain at work under the hero, the blocks, the example control room and
   reveals. Everything works without this script (all content is in the HTML); it only adds motion. Nothing here pins
   or steers the scroll: each piece plays on its own while it is on screen and pauses when it is not. Under
   prefers-reduced-motion nothing moves and each piece is shown as it finishes. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Counting a number up once, in the page's language (euros or plain numbers with a suffix).
  const locale = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" }[root.lang] || "en-GB";
  const euro = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const fmt = (el, v) => (el.dataset.kind === "eur" ? euro.format(v) : v + (el.dataset.suf || ""));
  const countUp = (els, ms = 1500) => {
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms), q = 1 - Math.pow(1 - k, 3);
      els.forEach((el) => { el.textContent = fmt(el, Math.round(Number(el.dataset.to) * q)); });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Company Brain at work: work streams from the tools into the core as particles along curves, finished work leaves
  // the core as a burst and lands as a card, and the counters tick. It runs only while it is on screen.
  const eg = document.querySelector("[data-engine]");
  if (eg) {
    const canvas = eg.querySelector(".eg-canvas"), ctx = canvas.getContext("2d");
    const ins = [...eg.querySelectorAll(".eg-in")];
    const orb = eg.querySelector(".eg-orb");
    const list = eg.querySelector(".eg-cards");
    const cards = [...list.children];
    const statusBox = eg.querySelector(".eg-status"), statusEl = statusBox.querySelector("span");
    const statuses = statusBox.dataset.status.split("|");
    const nums = [...eg.querySelectorAll(".eg-count b")];
    const RGB = { sales: "122,162,255", service: "255,170,120", office: "111,227,166" };
    const kinds = ins.map((el) => Object.keys(RGB).find((k) => el.classList.contains("eg-" + k)) || "sales");
    const sprite = (rgb) => {
      const c = document.createElement("canvas"); c.width = c.height = 32;
      const g = c.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.28, `rgba(${rgb},.9)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
      return c;
    };
    const sprites = Object.fromEntries(Object.entries(RGB).map(([k, v]) => [k, sprite(v)]));
    const glow = sprite("200,220,255");
    let W = 0, H = 0, paths = [], outPath = null;
    const curve = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      return Math.abs(dx) > Math.abs(dy)
        ? [a, { x: a.x + dx * .55, y: a.y }, { x: b.x - dx * .45, y: b.y }, b]
        : [a, { x: a.x, y: a.y + dy * .55 }, { x: b.x, y: b.y - dy * .45 }, b];
    };
    const at = (c, t) => {
      const u = 1 - t, a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, f = t * t * t;
      return { x: a * c[0].x + b * c[1].x + d * c[2].x + f * c[3].x, y: a * c[0].y + b * c[1].y + d * c[2].y + f * c[3].y };
    };
    const layout = () => {
      const r = eg.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rel = (el, fx, fy) => { const b = el.getBoundingClientRect(); return { x: b.left - r.left + b.width * fx, y: b.top - r.top + b.height * fy }; };
      const core = rel(orb, .5, .5);
      const stacked = getComputedStyle(eg).gridTemplateColumns.trim().split(/\s+/).length < 3;
      paths = ins.map((el) => curve(stacked ? rel(el, .5, 1) : rel(el, 1, .5), core));
      outPath = curve(core, stacked ? rel(list, .5, 0) : rel(list, 0, .14));
    };
    const lines = () => {
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(160,190,255,.16)";
      [...paths, outPath].forEach((c) => { ctx.beginPath(); ctx.moveTo(c[0].x, c[0].y); ctx.bezierCurveTo(c[1].x, c[1].y, c[2].x, c[2].y, c[3].x, c[3].y); ctx.stroke(); });
    };
    const parts = [];
    let raf = 0, last = 0, acc = 0, running = false, ctimer = 0, stimer = 0, ci = 0, si = 0, counted = false, inView = false;
    const spawn = (i) => {
      parts.push({ c: paths[i], t: 0, v: .3 + Math.random() * .22, k: kinds[i], out: false, s: 9 + Math.random() * 9 });
      const el = ins[i]; el.classList.add("hit"); clearTimeout(el._hit); el._hit = setTimeout(() => el.classList.remove("hit"), 380);
    };
    const burst = () => { for (let n = 0; n < 10; n++) parts.push({ c: outPath, t: -n * .05, v: .95, k: null, out: true, s: 12 }); };
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      acc += dt * 8.5;
      while (acc > 1) { acc -= 1; spawn(Math.floor(Math.random() * paths.length)); }
      ctx.clearRect(0, 0, W, H);
      lines();
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i];
        q.t += q.v * dt;
        if (q.t >= 1) { parts.splice(i, 1); continue; }
        if (q.t < 0) continue;
        const pt = at(q.c, q.t), sz = q.out ? q.s : q.s * (.65 + .35 * Math.sin(q.t * Math.PI));
        ctx.globalAlpha = q.out ? 1 - q.t * .4 : Math.min(1, q.t * 6, (1 - q.t) * 5);
        ctx.drawImage(q.out ? glow : sprites[q.k], pt.x - sz / 2, pt.y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };
    const showCard = () => {
      const card = cards[ci % cards.length]; ci += 1;
      list.prepend(card);
      card.classList.remove("enter"); void card.offsetWidth; card.classList.add("vis", "enter");
      [...list.querySelectorAll(".eg-card.vis")].slice(4).forEach((c) => c.classList.remove("vis"));
      const done = nums[0];
      if (done && counted) {
        done.dataset.to = String(Number(done.dataset.to) + 1); done.textContent = fmt(done, Number(done.dataset.to));
        done.classList.remove("bump"); void done.offsetWidth; done.classList.add("bump");
      }
    };
    const cycle = () => {
      burst();
      orb.classList.remove("gulp"); void orb.offsetWidth; orb.classList.add("gulp");
      setTimeout(showCard, 650);
      ctimer = setTimeout(cycle, 2700);
    };
    const status = () => {
      statusEl.classList.add("swap");
      setTimeout(() => { si = (si + 1) % statuses.length; statusEl.textContent = statuses[si]; statusEl.classList.remove("swap"); }, 300);
      stimer = setTimeout(status, 2700);
    };
    // the first cards are already done when the stage appears
    cards.slice(0, 3).reverse().forEach((c) => { list.prepend(c); c.classList.add("vis"); });
    ci = 3;
    if (still) {
      layout(); lines();
      new ResizeObserver(() => { layout(); lines(); }).observe(eg);
    } else {
      nums.forEach((el) => { el.textContent = fmt(el, 0); });
      const start = () => {
        if (running) return;
        running = true; layout(); last = 0;
        if (!counted) { counted = true; countUp(nums, 1400); }
        raf = requestAnimationFrame(frame);
        ctimer = setTimeout(cycle, 1000); stimer = setTimeout(status, 1900);
      };
      const stop = () => { running = false; cancelAnimationFrame(raf); clearTimeout(ctimer); clearTimeout(stimer); };
      const sync = () => (inView && !document.hidden ? start() : stop());
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .15 }).observe(eg);
      document.addEventListener("visibilitychange", sync);
      new ResizeObserver(() => { if (running) layout(); }).observe(eg);
    }
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

  // Example control room: once it is seen the chart draws in, the numbers count up, the ring fills and the week
  // fills with meetings; then, while it stays on screen, the agents change tasks and the queue gets approved.
  // A soft light follows the pointer over each panel.
  const bento = document.querySelector("[data-ctrl]");
  if (bento) {
    const nums = [...bento.querySelectorAll("b[data-to]")];
    const ring = bento.querySelector(".ring-fg");
    const meets = [...bento.querySelectorAll(".wk-m")];
    const aps = [...bento.querySelectorAll(".ap")];
    const tasks = [...bento.querySelectorAll("[data-tasks]")].map((el) => ({ el, list: el.dataset.tasks.split("|"), i: 0 }));
    bento.querySelectorAll(".bx").forEach((bx) => {
      bx.addEventListener("pointermove", (ev) => { const r = bx.getBoundingClientRect(); bx.style.setProperty("--mx", ev.clientX - r.left + "px"); bx.style.setProperty("--my", ev.clientY - r.top + "px"); });
      bx.addEventListener("pointerleave", () => { bx.style.setProperty("--mx", "-500px"); bx.style.setProperty("--my", "-500px"); });
    });
    if (still) {
      bento.classList.add("go");
      meets.forEach((m) => m.classList.add("on"));
      if (aps[0]) aps[0].classList.add("ok");
    } else {
      ring.style.strokeDashoffset = ring.dataset.len;
      nums.forEach((el) => { el.textContent = fmt(el, 0); });
      let begun = false, inView = false, atimer = 0, ttimer = 0, ai = 0;
      const approve = () => {
        if (ai < aps.length) { aps[ai].classList.add("ok"); ai += 1; atimer = setTimeout(approve, 2300); return; }
        atimer = setTimeout(() => { aps.forEach((a) => a.classList.remove("ok")); ai = 0; atimer = setTimeout(approve, 1400); }, 2600);
      };
      const work = () => {
        tasks.forEach((t, n) => setTimeout(() => {
          t.el.classList.add("swap");
          setTimeout(() => { t.i = (t.i + 1) % t.list.length; t.el.textContent = t.list[t.i]; t.el.classList.remove("swap"); }, 300);
        }, n * 380));
        ttimer = setTimeout(work, 3200);
      };
      const begin = () => {
        begun = true;
        bento.classList.add("go");
        countUp(nums, 1800);
        ring.style.strokeDashoffset = ring.dataset.to;
        meets.forEach((m, i) => setTimeout(() => m.classList.add("on"), 700 + i * 170));
      };
      const sync = () => {
        clearTimeout(atimer); clearTimeout(ttimer);
        if (!inView || document.hidden) return;
        if (!begun) begin();
        atimer = setTimeout(approve, 1600); ttimer = setTimeout(work, 2000);
      };
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .25 }).observe(bento);
      document.addEventListener("visibilitychange", sync);
    }
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .cr-stage, .eg, .bl-card, .step, .idea, .pilot-terms, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
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
