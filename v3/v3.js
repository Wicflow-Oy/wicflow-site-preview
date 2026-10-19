/* Wicflow v3 concept: navigation, Company Brain at work under the hero, the blocks, the example control room and
   reveals. Everything works without this script (all content is in the HTML); it only adds motion. Nothing here pins
   or steers the scroll: each piece plays on its own while it is on screen and pauses when it is not. Under
   prefers-reduced-motion nothing moves and each piece is shown as it finishes. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The page's background: a faint, slowly flowing haze in the site's colours (domain-warped noise in a small WebGL
  // shader, drawn at low resolution so it stays soft), pale on the light pages and night blue on the dark home page,
  // with a gentle swirl and glow that follows the pointer.
  // It pauses in a hidden tab; under reduced motion it draws one still frame. Without WebGL the plain colour shows.
  const haze = document.querySelector(".haze");
  const gl = haze && haze.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
  if (gl) {
    const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    const FS = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float mi;uniform float dk;
vec3 p3(vec3 x){return x-floor(x*(1./289.))*289.;}vec2 p2(vec2 x){return x-floor(x*(1./289.))*289.;}vec3 pm(vec3 x){return p3(((x*34.)+1.)*x);}
float sn(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
i=p2(i);vec3 p=pm(pm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 mm=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
mm=mm*mm;mm=mm*mm;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;mm*=1.79284291400159-.85373472095314*(a0*a0+h*h);
vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(mm,g);}
float fb(vec2 q){float v=0.,a=.55;for(int k=0;k<3;k++){v+=a*sn(q);q=q*1.85+vec2(1.7,9.2);a*=.45;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;float ar=r.x/r.y;vec2 p=uv*vec2(ar,1.)*.62;vec2 mp=m*vec2(ar,1.)*.62;
vec2 dd=p-mp;float d=length(dd);float sw=exp(-d*d*14.)*mi;p+=vec2(-dd.y,dd.x)*sw*.32+dd*sw*.06;
float tt=t*.028;vec2 q=vec2(fb(p+tt),fb(p+vec2(5.2,1.3)-tt*.8));
vec2 w=vec2(fb(p+1.05*q+vec2(1.7,9.2)+tt*1.2),fb(p+1.05*q+vec2(8.3,2.8)-tt));float f=fb(p+1.2*w);
vec3 c;
if(dk>.5){vec3 b=vec3(.02,.028,.055);c=b;
c=mix(c,vec3(.05,.1,.25),smoothstep(-.45,.75,w.x)*.62);
c=mix(c,vec3(.1,.06,.2),smoothstep(-.3,.8,w.y)*.5);
c=mix(c,vec3(.2,.08,.07),smoothstep(-.05,.85,f)*.28);
c=mix(c,vec3(.03,.12,.13),smoothstep(0.,.9,q.y)*.3);
c=mix(c,vec3(.14,.24,.52),exp(-d*d*16.)*.32*mi);
c=mix(c,b,.18);}
else{c=vec3(.952,.964,.985);
c=mix(c,vec3(.78,.87,.99),smoothstep(-.45,.75,w.x)*.66);
c=mix(c,vec3(.88,.85,.99),smoothstep(-.3,.8,w.y)*.52);
c=mix(c,vec3(.995,.9,.85),smoothstep(-.05,.85,f)*.45);
c=mix(c,vec3(.85,.95,.91),smoothstep(0.,.9,q.y)*.34);
c=mix(c,vec3(.76,.85,1.),exp(-d*d*16.)*.42*mi);
c=mix(c,vec3(.952,.964,.985),.22);}
gl_FragColor=vec4(c,1.);}`;
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a");
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (n) => gl.getUniformLocation(prog, n);
      const uR = U("r"), uT = U("t"), uM = U("m"), uMi = U("mi");
      gl.uniform1f(U("dk"), root.classList.contains("dk") ? 1 : 0);
      const SCALE = .32;
      const size = () => {
        const w = Math.max(1, Math.round(innerWidth * SCALE)), h = Math.max(1, Math.round(innerHeight * SCALE));
        if (haze.width !== w || haze.height !== h) { haze.width = w; haze.height = h; gl.viewport(0, 0, w, h); }
        gl.uniform2f(uR, w, h);
      };
      const target = { x: .72, y: .62 }, cur = { x: .72, y: .62 };
      let energy = .35, want = .35, last = 0, t0 = performance.now(), raf = 0;
      const draw = (now) => {
        cur.x += (target.x - cur.x) * .045; cur.y += (target.y - cur.y) * .045;
        energy += (want - energy) * .03; want += (.35 - want) * .01;
        gl.uniform1f(uT, (now - t0) / 1000); gl.uniform2f(uM, cur.x, cur.y); gl.uniform1f(uMi, energy);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const loop = (now) => { raf = requestAnimationFrame(loop); if (now - last < 33) return; last = now; draw(now); };
      size();
      haze.classList.add("on");
      if (still) { draw(t0 + 4000); addEventListener("resize", () => { size(); draw(t0 + 4000); }); }
      else {
        addEventListener("resize", size);
        addEventListener("pointermove", (ev) => { target.x = ev.clientX / innerWidth; target.y = 1 - ev.clientY / innerHeight; want = 1; }, { passive: true });
        document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop); });
        raf = requestAnimationFrame(loop);
      }
    }
  }

  // The loop of everyday work, in the hero and again behind the close: the smaller file on phones and slow
  // connections, loaded as it nears the screen and playing only while it is on it (the close starts at its own
  // point in the loop). Under reduced motion only the still frame shows.
  const conn = navigator.connection || {};
  const big = innerWidth >= 1000 && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || "");
  if (!still) document.querySelectorAll("video[data-lg]").forEach((v) => {
    let near = false;
    const sync = () => {
      if (!near || document.hidden) { v.pause(); return; }
      if (!v.getAttribute("src")) {
        v.muted = true;
        if (v.dataset.t0) v.addEventListener("loadedmetadata", () => { v.currentTime = Number(v.dataset.t0); }, { once: true });
        v.src = big ? v.dataset.lg : v.dataset.sm;
      }
      v.play().catch(() => {});
    };
    new IntersectionObserver(([en]) => { near = en.isIntersecting; sync(); }, { rootMargin: "200px 0px" }).observe(v);
    document.addEventListener("visibilitychange", sync);
  });

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

  // The AI rollout workspace: the team lights up as people start using it, then each question is typed, checked
  // against the company's rules and answered word by word, and the time saved and the month's cost add up.
  // It plays only while it is on screen.
  const ra = document.querySelector("[data-ra]");
  if (ra) {
    const people = [...ra.querySelectorAll(".ra-p")];
    const ON = [0, 2, 3, 5, 7, 9];  // six of the ten: 60 %
    const adopt = ra.querySelector("[data-adopt]");
    const q = ra.querySelector(".ra-q"), qText = ra.querySelector("[data-q]"), who = ra.querySelector(".ra-who");
    const file = ra.querySelector("[data-file]"), fileName = file.querySelector("span");
    const okLine = ra.querySelector("[data-okline]"), okText = ra.querySelector("[data-ok]");
    const ans = ra.querySelector(".ra-a"), ansText = ra.querySelector("[data-a]");
    const typed = ra.querySelector("[data-typed]"), send = ra.querySelector(".ra-send");
    const script = [...ra.querySelectorAll(".ra-script li")].map((li) => ({ ...li.dataset, a: li.textContent }));
    const savedEl = ra.querySelector("[data-saved]"), savedBox = ra.querySelector(".ra-saved");
    const costEl = ra.querySelector("[data-cost]"), meter = ra.querySelector("[data-meter]");
    let mins = 130, cost = 612, k = 1, timers = [], running = false, primed = false, inView = false;
    const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
    const showSaved = () => { savedEl.textContent = `${Math.floor(mins / 60)} ${savedBox.dataset.savedH} ${mins % 60} ${savedBox.dataset.savedM}`; };
    const pct = (n) => (root.lang === "en" ? `${n} %` : `${n} %`);
    const prime = () => {
      primed = true;
      ON.forEach((idx, n) => later(() => { people[idx].classList.add("on"); adopt.textContent = pct(Math.round((n + 1) / ON.length * 60)); }, 300 + n * 280));
    };
    const play = () => {
      const c = script[k % script.length]; k += 1;
      let i = 0;
      const type = () => { typed.textContent = c.ask.slice(0, ++i); if (i < c.ask.length) later(type, 26); else later(sendIt, 420); };
      const sendIt = () => {
        send.classList.add("push"); later(() => send.classList.remove("push"), 180);
        typed.textContent = "";
        [q, okLine, ans].forEach((el) => el.classList.add("fade"));
        later(() => {
          who.textContent = `${c.who} · ${c.team}`; qText.textContent = c.ask;
          file.hidden = !c.file; fileName.textContent = c.file;
          q.classList.remove("fade");
        }, 320);
        later(() => { okText.textContent = c.ok; okLine.classList.remove("fade"); }, 700);
        later(stream, 1400);
      };
      const stream = () => {
        const words = c.a.split(" ");
        ansText.textContent = ""; ans.classList.remove("fade");
        let w = 0;
        const next = () => {
          const span = document.createElement("i"); span.textContent = (w ? " " : "") + words[w]; ansText.appendChild(span);
          w += 1;
          if (w < words.length) later(next, 42); else later(done, 500);
        };
        later(next, 120);
      };
      const done = () => {
        mins += Number(c.saved); showSaved();
        savedEl.classList.remove("bump"); void savedEl.offsetWidth; savedEl.classList.add("bump");
        cost += 2 + (k % 3); costEl.textContent = euro.format(cost); meter.style.width = Math.min(100, cost / 10) + "%";
        later(play, 3400);
      };
      later(type, 700);
    };
    const start = () => { if (running) return; running = true; if (!primed) { prime(); later(play, 2600); } else later(play, 500); };
    const stop = () => { running = false; timers.forEach(clearTimeout); timers = []; [q, okLine, ans].forEach((el) => el.classList.remove("fade")); };
    if (still) {
      ON.forEach((idx) => people[idx].classList.add("on"));
    } else {
      adopt.textContent = pct(0);
      const sync = () => (inView && !document.hidden ? start() : stop());
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }, { threshold: .25 }).observe(ra);
      document.addEventListener("visibilitychange", sync);
    }
  }

  // Between no limits and a blanket cap: the marker swings to both ends and settles in the middle, once.
  const xt = document.querySelector("[data-xt]");
  if (xt && !still) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { xt.classList.add("go"); io.disconnect(); } }, { threshold: .5 });
    io.observe(xt);
  }

  // The statement: its words light up from grey to white as it is read, following the scroll (never steering it).
  // It is fully lit once its last line reaches the middle of the screen.
  const mf = document.querySelector("[data-mf]");
  if (mf) {
    const words = [...mf.querySelectorAll(".mf-w")];
    if (still) words.forEach((w) => w.classList.add("on"));
    else {
      let lit = -1, raf = 0;
      const paint = () => {
        raf = 0;
        const r = mf.getBoundingClientRect(), vh = innerHeight;
        const n = Math.round(Math.min(1, Math.max(0, (vh * .82 - r.top) / (r.height + vh * .3))) * words.length);
        if (n !== lit) { lit = n; words.forEach((w, i) => w.classList.toggle("on", i < n)); }
      };
      const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) addEventListener("scroll", ask, { passive: true });
        else removeEventListener("scroll", ask);
        ask();
      }).observe(mf);
      addEventListener("resize", ask);
    }
  }

  // How we start: the index beside the steps marks the one being read, and its line fills to match.
  const sp = document.querySelector("[data-start]");
  if (sp) {
    const items = [...sp.querySelectorAll(".sx li")];
    const line = sp.querySelector(".sx-line");
    const panels = [...sp.querySelectorAll(".sp-p")];
    const mark = (i) => {
      items.forEach((li, n) => li.classList.toggle("on", n === i));
      if (line) line.style.setProperty("--p", ((i + 1) / items.length * 100).toFixed(1) + "%");
    };
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) mark(Number(en.target.dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" });
    panels.forEach((pn) => io.observe(pn));
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone, and so is the logo
  // wall: its logos are blended into their cards, which a fade would undo until it ends.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .pch-head, .tr-head, .pr, .sp-p, .cs-xl, .cs-card, .cs-stats, .cr-stage, .eg, .xt, .ro-stats > li, .ro-gets > li, .pa, .rt, .bl-card, .step, .idea, .pilot-terms, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
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
