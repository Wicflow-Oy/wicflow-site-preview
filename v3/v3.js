/* Wicflow v3 concept: the shared page script. The haze, the two video loops, the menu, the reveals and the helpers
   each section's own script uses (window.WF; the sections' scripts are src/parts/*.js, appended after this file).
   Everything works without scripts (all content is in the HTML); they only add motion. Nothing pins or steers the
   scroll: each piece plays on its own while it is on screen and pauses when it is not. Under prefers-reduced-motion
   nothing moves and each piece is shown as it finishes. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WF = window.WF = window.WF || {};

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
      const loop = (now) => { raf = requestAnimationFrame(loop); if (now - last < 41) return; last = now; draw(now); };  // about 24 frames a second
      size();
      haze.classList.add("on");
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const soft = dbg && /SwiftShader|llvmpipe|Software|Basic Render/i.test(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
      if (still || soft) { draw(t0 + 4000); addEventListener("resize", () => { size(); draw(t0 + 4000); }); }
      else {
        addEventListener("resize", size);
        addEventListener("pointermove", (ev) => { target.x = ev.clientX / innerWidth; target.y = 1 - ev.clientY / innerHeight; want = 1; }, { passive: true });
        document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop); });
        raf = requestAnimationFrame(loop);
      }
    }
  }

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
    root.classList.toggle("menu-lock", open);  // the page behind the open menu does not scroll
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


  // Shared helpers for the sections' own scripts (src/parts/*.js), on window.WF:
  //  WF.still            true under prefers-reduced-motion
  //  WF.countUp(els, ms) counts [data-to] numbers up once (data-kind="eur" for euros, data-suf for a suffix)
  //  WF.demo(root, run, {still}) plays a looping demo only while at least 35 % of it is on screen and the visitor has
  //     not paused it. run(api) is an async script that waits with `await api.wait(ms)`: that time only passes while
  //     the demo is playing, so the script simply stops where it is when it is paused or scrolled away. A pause button
  //     is added in the corner (WCAG 2.2.2), CSS animations inside pause with it (.is-paused), and under reduced motion
  //     run() never starts and still() shows the finished state instead.
  WF.still = still;
  WF.countUp = countUp;
  WF.fmt = fmt;
  const LBL = {
    en: { demo: "Pause the example", video: "Pause the background video" },
    fi: { demo: "Pysäytä esimerkki", video: "Pysäytä taustavideo" },
    sv: { demo: "Pausa exemplet", video: "Pausa bakgrundsvideon" },
  }[root.lang] || { demo: "Pause", video: "Pause video" };
  const I_PAUSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor"/></svg>';
  const I_PLAY = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8 10 6l-7 4.2z" fill="currentColor"/></svg>';
  // a pause toggle with one constant name; the pressed state says whether it is paused
  WF.pauseButton = (label, onToggle, cls = "") => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "demo-pause" + (cls ? " " + cls : "");
    btn.setAttribute("aria-label", label);
    let paused = false;
    const show = () => { btn.innerHTML = paused ? I_PLAY : I_PAUSE; btn.setAttribute("aria-pressed", String(paused)); };
    btn.addEventListener("click", () => { paused = !paused; show(); onToggle(paused); });
    show();
    btn.setPaused = (v) => { paused = v; show(); };
    return btn;
  };
  // Only the demo that fills most of the screen plays; the others wait (without touching the visitor's own pause).
  const demos = new Set();
  const pickDemo = () => {
    let best = null;
    demos.forEach((d) => { if (d.ratio >= d.threshold && (!best || d.ratio > best.ratio)) best = d; });
    demos.forEach((d) => d.setTurn(d === best));
  };
  WF.demo = (el, run, opts = {}) => {
    if (!el) return null;
    if (still) { if (opts.still) opts.still(); return null; }
    let turn = false, user = true, started = false, last = 0, raf = 0;
    const timers = [];
    const active = () => turn && user && !document.hidden;
    const api = {
      el,
      get playing() { return active(); },
      wait: (ms) => new Promise((res) => timers.push({ left: ms, res })),
    };
    const frame = (now) => {
      raf = 0;
      if (!active()) { last = 0; return; }
      const dt = last ? Math.min(100, now - last) : 16;
      last = now;
      for (let i = timers.length - 1; i >= 0; i--) { timers[i].left -= dt; if (timers[i].left <= 0) { const t = timers.splice(i, 1)[0]; t.res(); } }
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      el.classList.toggle("is-paused", !active());
      if (active()) { if (!started) { started = true; Promise.resolve().then(() => run(api)).catch(() => {}); } if (!raf) raf = requestAnimationFrame(frame); }
    };
    const me = { ratio: 0, threshold: opts.threshold ?? .35, setTurn: (v) => { if (turn !== v) { turn = v; sync(); } } };
    demos.add(me);
    if (opts.pause !== false) {
      const btn = WF.pauseButton(opts.label || LBL.demo, (p) => { user = !p; sync(); });
      const slot = opts.pauseIn || el;
      if (slot !== el) btn.classList.add("in-cap");
      slot.appendChild(btn);
    }
    new IntersectionObserver(([en]) => { me.ratio = en.isIntersecting ? en.intersectionRatio : 0; pickDemo(); },
      { threshold: [0, .1, .2, .35, .5, .65, .8, 1] }).observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return api;
  };

  // The loop of everyday work, in the hero and again behind the close: the smaller file on phones and slow
  // connections, loaded as it nears the screen and playing only while it is on it (the close starts at its own
  // point in the loop). Under reduced motion only the still frame shows.
  const conn = navigator.connection || {};
  const big = innerWidth >= 1000 && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || "");
  let vidOff = false;
  try { vidOff = localStorage.getItem("wf-video") === "off"; } catch (err) { /* private mode */ }
  const vids = [];
  if (!still) document.querySelectorAll("video[data-lg]").forEach((v) => {
    let near = false, seen = false;
    const sync = () => {
      if (near && !v.getAttribute("src")) {
        v.muted = true;
        if (v.dataset.t0) v.addEventListener("loadedmetadata", () => { v.currentTime = Number(v.dataset.t0); }, { once: true });
        v.src = big ? v.dataset.lg : v.dataset.sm;
      }
      if (seen && !vidOff && !document.hidden && v.getAttribute("src")) v.play().catch(() => {});
      else v.pause();
    };
    vids.push(sync);
    new IntersectionObserver(([en]) => { near = en.isIntersecting; sync(); }, { rootMargin: "200px 0px" }).observe(v);
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; sync(); }, { threshold: .5 }).observe(v.parentElement);
    document.addEventListener("visibilitychange", sync);
    const btn = WF.pauseButton(LBL.video, (p) => {
      vidOff = p;
      try { localStorage.setItem("wf-video", p ? "off" : "on"); } catch (err) { /* private mode */ }
      document.querySelectorAll(".vid-pause").forEach((b) => b.setPaused(p));
      vids.forEach((f) => f());
    }, "vid-pause");
    btn.setPaused(vidOff);
    v.parentElement.appendChild(btn);
  });

  // Between no limits and a blanket cap: the marker swings to both ends and settles in the middle, once.
  const xt = document.querySelector("[data-xt]");
  if (xt && !still) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { xt.classList.add("go"); io.disconnect(); } }, { threshold: .5 });
    io.observe(xt);
  }

  // Sections rise in as they enter the screen. Blocks already on screen at load are left alone, and so is the logo
  // wall: its logos are blended into their cards, which a fade would undo until it ends.
  if (!still && "IntersectionObserver" in window) {
    const sel = ".sec-head, .pch-head, .tr-head, .pr, .sp-p, .cs-xl, .cs-card, .cs-stats, .cr-stage, .eg, .xt, .ro-stats > li, .ro-gets > li, .pa, .rt, .bl-card, [data-rv], .step, .idea, .pilot-terms, .case, .result, .num-list li, .price-card, .person, .faq-list, .final-in, .band-note";
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

/* Company Brain at work, the work engine (part_brain.py, brain.css). Three jobs from one morning in a 36 s loop through
   WF.demo (it plays only while the panel is on screen and not paused; under reduced motion the HTML's finished first
   job stays as it is). Each job: its source row lights, a comet runs up the wire to the core, the core's light swells
   once, the job rides down the axis from lid to lid while the working plate is lit like the white brick in #blocks
   and types its line, the result leaves through the right port and lands at the top of the finished work. The first
   job waits for Mikko, who approves it. Never more than two things move at once; the loop ends with a 600 ms
   cross-fade back to the start. The drawing (lids, hidden edges, axis, rails, bus, wires) is redrawn from the
   measured boxes, so it stays exact at every width. */
(() => {
  const WF = window.WF;
  const root = document.querySelector("[data-cb]");
  if (!WF || !root) return;
  const dec = root.dataset.lang === "en" ? "." : ",";
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const stage = $(".cb-stage"), wireSvg = $(".cb-wires"), outs = $(".cb-outs"), foot = $(".cb-foot");
  const ins = $$(".cb-in");
  const core = $(".cb-core"), busSvg = $(".cb-bus-svg"), portL = $(".cb-port-l"), portR = $(".cb-port-r");
  const stack = $(".cb-stack"), tower = $(".cb-tower"), plates = $$(".cb-plate");
  const lidBox = $(".cb-lids-in", tower), xBox = $(".cb-x", tower);
  const chip = $(".cb-job"), chipText = $("[data-chip]", chip), learn = $("[data-learn]");
  const wires = Object.fromEntries($$(".cb-wire").map((g) => [g.dataset.w, g]));
  const stubL = $(".cb-stub-l"), stubR = $(".cb-stub-r");
  const vwIn = $(".cb-vw-in"), vwOut = $(".cb-vw-out");
  const tpl = $(".cb-tpl").content;
  const jobs = [...tpl.querySelectorAll(".cb-tpl-jobs > li")].map((li) => ({
    src: Number(li.dataset.from), chip: li.dataset.chip, learn: li.dataset.learn,
    ok: li.dataset.ok, av: li.dataset.av, who: li.dataset.who, at: li.dataset.at,
    done: Number(li.dataset.done), hours: Number(li.dataset.hours),
    lines: [...li.querySelectorAll(":scope > i")].map((i) => ({ l: i.dataset.l, t: i.dataset.t })),
    out: li.querySelector(".cb-out"),
  }));
  const earlier = [...tpl.querySelectorAll(".cb-tpl-earlier > li")];
  const [D0, H0, W0] = root.dataset.start.split("|").map(Number);
  const nums = Object.fromEntries($$("[data-c]").map((el) => [el.dataset.c, el]));
  const val = { done: D0, hours: H0, wait: W0 };
  const narrow = window.matchMedia("(max-width: 999px)");
  const STUB = 14, FAN = .26;   // the shared stub; how far each wire's first control point leans towards its row

  // What is lit, so a redraw keeps it: the plate, the plate the left bus feeds, the right bus, the lid the chip is on.
  // The HTML is the finished first job: the check plate is lit and both buses lead through it.
  const st = { lit: 3, busL: 3, busR: true, chip: 3 };
  const G = { w: 0, py: 0, mids: [], gut: 0, tops: [], lids: [] };

  // ---- the drawing (the same as part_brain.py's) --------------------------------------------------------------------
  const f = (n) => String(Math.round(n * 10) / 10);
  const num = (name) => parseFloat(getComputedStyle(root).getPropertyValue(name));
  const lidG = (x0, x1, y, lid, inset, studs, on) => {
    const w = x1 - x0;
    let g = `<path class="cb-lid" d="M${f(x0)} ${f(y)}H${f(x1)}L${f(x1 - inset)} ${f(y - lid)}H${f(x0 + inset)}Z"/>`;
    const cy = y - lid * .5, rx = Math.min(7, (w - inset) / studs * .19), ry = lid * .16, h = lid * .17;
    for (let i = 0; i < studs; i++) {
      const cx = x0 + inset / 2 + (w - inset) * (i + .5) / studs;
      g += `<path class="cb-stud" d="M${f(cx - rx)} ${f(cy - h)}V${f(cy)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)}V${f(cy - h)}Z"/>` +
        `<ellipse class="cb-stud" cx="${f(cx)}" cy="${f(cy - h)}" rx="${f(rx)}" ry="${f(ry)}"/>`;
    }
    return `<g class="cb-lid-g${on ? " on" : ""}">${g}</g>`;
  };
  // the tower: every lid sits on its face (its front edge on the face's top line, its back edge on the bottom line of
  // the face above); the hidden back edges join the lids' back corners; the axis runs down the middle
  const drawTower = () => {
    const s = stack.getBoundingClientRect();
    if (!s.width) return;
    const lids = [1, 2, 3, 4].map((k) => num(`--cb-l${k}`)), inset = num("--cb-lin"), studs = num("--cb-studs");
    const tops = plates.map((pl) => pl.getBoundingClientRect().top - s.top);
    G.tops = tops; G.lids = lids;
    const w = s.width;
    tower.setAttribute("viewBox", `0 0 ${f(w)} ${f(s.height)}`);
    lidBox.innerHTML = tops.map((t, k) => lidG(.5, w - .5, t + .5, lids[k] + 1, inset, studs, k === st.lit)).join("");
    const top = tops[0] - lids[0] - .5, back = tops[3] - lids[3] - .5, ax = Math.floor(w / 2) + .5;
    xBox.innerHTML = `<path class="cb-hid" d="M${f(.5 + inset)} ${f(top)}V${f(back)}M${f(w - .5 - inset)} ${f(top)}V${f(back)}"/>` +
      `<path class="cb-axis" d="M${ax} ${f(top)}V${f(s.height)}"/>`;
  };
  const busLD = (k) => `M.5 ${f(G.py)}V${f(G.mids[k])}H${f(G.gut)}`;
  const busRD = () => `M${f(G.w - G.gut)} ${f(G.mids[3])}H${f(G.w - .5)}V${f(G.py)}`;
  // the core's edges: dashed rails between the corner marks, a tap into every plate, the lit bus
  const drawBus = () => {
    const c = core.getBoundingClientRect();
    if (!c.width) return;
    const p = portL.getBoundingClientRect(), s = stack.getBoundingClientRect();
    G.w = c.width; G.py = p.top + p.height / 2 - c.top; G.gut = s.left - c.left;
    G.mids = plates.map((pl) => { const b = pl.getBoundingClientRect(); return b.top + b.height / 2 - c.top; });
    busSvg.setAttribute("viewBox", `0 0 ${f(c.width)} ${f(c.height)}`);
    const w = c.width, h = c.height;
    busSvg.innerHTML = `<path class="cb-rail" d="M.5 12V${f(h - 12)}M${f(w - .5)} 12V${f(h - 12)}"/>` +
      G.mids.map((m) => `<path class="cb-tap" d="M0 ${f(m)}H${f(G.gut)}M${f(w - G.gut)} ${f(m)}H${f(w)}"/>`).join("") +
      `<path class="cb-bus cb-bus-l${st.busL >= 0 ? " on" : ""}" d="${busLD(Math.max(0, st.busL))}"/>` +
      `<path class="cb-bus cb-bus-r${st.busR ? " on" : ""}" d="${busRD()}"/>`;
  };
  // the wires: each starts at its core port, runs the shared stub, then curves to its row with mirrored control points
  const drawWires = () => {
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    wireSvg.setAttribute("viewBox", `0 0 ${f(r.width)} ${f(r.height)}`);
    const c = (el) => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top }; };
    const L = c(portL), R = c(portR), o = outs.getBoundingClientRect();
    const curve = (x0, y0, x1, y1) => { const k = (x1 - x0) * .55; return `C${f(x0 + k)} ${f(y0 + (y1 - y0) * FAN)} ${f(x1 - k)} ${f(y1)} ${f(x1)} ${f(y1)}`; };
    const set = (g, d0, d1) => g.querySelectorAll("path").forEach((p, i) => p.setAttribute("d", i ? d1 : d0));
    ins.forEach((el, i) => {
      const b = el.getBoundingClientRect(), y = b.top + b.height / 2 - r.top;
      const tail = curve(L.x - STUB, L.y, b.right - r.left, y);
      set(wires["in" + i], `M${f(L.x - STUB)} ${f(L.y)}${tail}`, `M${f(L.x)} ${f(L.y)}H${f(L.x - STUB)}${tail}`);
      const tailR = curve(R.x + STUB, R.y, o.left - r.left, y);
      set(wires["out" + i], `M${f(R.x + STUB)} ${f(R.y)}${tailR}`, `M${f(R.x)} ${f(R.y)}H${f(R.x + STUB)}${tailR}`);
    });
    stubL.setAttribute("d", `M${f(L.x)} ${f(L.y)}H${f(L.x - STUB)}`);
    stubR.setAttribute("d", `M${f(R.x)} ${f(R.y)}H${f(R.x + STUB)}`);
  };
  const chipTo = (k) => {
    st.chip = k;
    if (G.tops.length) chip.style.setProperty("--y", `${f(G.tops[k] - G.lids[k] / 2)}px`);
  };
  const layout = () => {
    drawTower(); drawBus();
    if (!narrow.matches) drawWires();
    chipTo(st.chip);
  };
  layout();
  new ResizeObserver(layout).observe(root);
  if (document.fonts) document.fonts.ready.then(layout);
  if (WF.still) return;

  // ---- state changes, each one small --------------------------------------------------------------------------------
  const show = (key, v) => { nums[key].textContent = key === "hours" ? v.toFixed(1).replace(".", dec) : String(v); };
  const bump = (key, d) => {
    val[key] = Math.round((val[key] + d) * 10) / 10;
    show(key, val[key]);
    // green for done work and saved hours; more work waiting for a person ticks in the waiting colour
    const cls = key === "wait" ? (d > 0 ? "tick-wait" : "") : "tick";
    if (!cls) return;
    const el = nums[key];
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 800);
  };
  const setLit = (k) => {
    st.lit = k;
    plates.forEach((pl, i) => pl.classList.toggle("on", i === k));
    [...lidBox.children].forEach((g, i) => g.classList.toggle("on", i === k));
  };
  const setBusL = (k) => {
    st.busL = k;
    const b = $(".cb-bus-l", busSvg);
    if (k >= 0 && G.mids.length) b.setAttribute("d", busLD(k));
    b.classList.toggle("on", k >= 0);
  };
  const setBusR = (on) => { st.busR = on; $(".cb-bus-r", busSvg).classList.toggle("on", on); };
  const comet = (side, i) => {
    const el = narrow.matches ? (side === "in" ? vwIn : vwOut) : wires[side + i];
    el.classList.remove("run");
    void root.offsetWidth;
    el.classList.add("run");
  };
  const light = (side, i, on) => {
    wires[side + i].classList.toggle("on", on);
    (side === "in" ? stubL : stubR).classList.toggle("on", on);
    (side === "in" ? vwIn : vwOut).classList.toggle("on", on && narrow.matches);
  };
  const swell = (w) => { root.classList.add("swell"); w(900).then(() => root.classList.remove("swell")); };
  const clearPlates = () => {
    setLit(-1);
    plates.forEach((pl) => { pl.classList.remove("done"); $("[data-l]", pl).textContent = ""; $("[data-t]", pl).textContent = ""; });
  };
  const setChip = (job) => {
    chipText.textContent = job.chip;
    $(".cb-tile", chip).replaceWith($(".cb-tile", ins[job.src]).cloneNode(true));
  };
  const reset = () => {
    clearPlates();
    setBusL(-1); setBusR(false);
    chip.classList.add("out");
    chipTo(0);
    setChip(jobs[0]);
    learn.textContent = jobs[0].learn;
    ins.forEach((el) => { el.classList.remove("on"); $(".cb-n", el).textContent = el.dataset.n; });
    Object.values(wires).forEach((g) => g.classList.remove("on", "run"));
    [stubL, stubR].forEach((s) => s.classList.remove("on"));
    [vwIn, vwOut].forEach((v) => v.classList.remove("on", "run"));
    portL.classList.remove("on"); portR.classList.remove("on");
    outs.replaceChildren(...earlier.slice(0, 6).map((li) => li.cloneNode(true)));
    val.done = D0; val.hours = H0; val.wait = W0;
    ["done", "hours", "wait"].forEach((k) => show(k, val[k]));
  };
  reset();
  root.classList.add("cb-run");

  // the result lands at the top of the finished work: the last visible row fades, the others move down one place
  // (FLIP, transform only) and the new one slides in 12 px from the left
  const land = async (job, w) => {
    const rows = [...outs.children];
    const seen = rows.filter((r) => r.offsetParent);
    const leaving = seen[seen.length - 1];
    leaving.classList.add("leave");
    await w(240);
    const keep = rows.slice(0, -1);
    const before = keep.map((r) => r.getBoundingClientRect().top);
    rows[rows.length - 1].remove();
    leaving.style.transition = "none";
    leaving.classList.remove("leave");
    const row = job.out.cloneNode(true);
    row.classList.add("enter", "on");
    outs.prepend(row);
    keep.forEach((r, i) => { r.style.transition = "none"; r.style.transform = `translateY(${before[i] - r.getBoundingClientRect().top}px)`; });
    void outs.offsetWidth;
    keep.forEach((r) => { r.style.transition = "transform .42s cubic-bezier(.2, .8, .2, 1)"; r.style.transform = ""; });
    await w(440);
    keep.forEach((r) => { r.style.transition = ""; });
    return row;
  };
  const type = async (el, text, w) => {
    el.classList.add("typing");
    for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await w(21); }
    el.classList.remove("typing");
  };
  const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls; n.textContent = text; return n; };
  // the approval, a person's act: Mikko's initials and the time appear, then the chip turns from waiting to approved
  const approve = async (job, out, w) => {
    const s = $("[data-s]", out), r = $("[data-r]", out);
    s.classList.add("fade"); r.classList.add("fade");
    await w(200);
    s.replaceChildren(el("span", "cb-by", job.who));
    r.replaceChildren(el("i", "cb-av", job.av), el("span", "cb-time", job.at));
    s.classList.remove("fade"); r.classList.remove("fade");
    bump("wait", -1);
    await w(1300);
    s.classList.add("fade");
    await w(200);
    s.replaceChildren(el("span", "chip chip-ok", job.ok));
    s.classList.remove("fade");
    await w(240);
  };

  const STEP = 1300;   // each plate, from the moment it lights to the next one
  const runJob = async (job, j, w, last) => {
    // 0.0 s: the source lights and hands the job over: one item fewer waiting there
    const row = ins[job.src], n = $(".cb-n", row);
    row.classList.add("on");
    n.textContent = String(Number(n.textContent) - 1);
    await w(300);
    // 0.3 s: a comet runs up its wire to the core
    comet("in", job.src);
    await w(900);
    // 1.2 s: the job enters: wire and port light, the core's light swells, the job rests on the top lid, plate 1 lights
    light("in", job.src, true); portL.classList.add("on");
    swell(w);
    chipTo(0); chip.classList.remove("out");
    setLit(0); setBusL(0);
    await w(200);
    for (let k = 0; k < 4; k++) {
      const pl = plates[k];
      if (k) {
        // the plate before is done; the chip slides down the axis to the next lid, dimmed while it crosses a face
        const prev = plates[k - 1];
        $("[data-t]", prev).textContent = job.lines[k - 1].t;
        prev.classList.add("done");
        setLit(-1);
        chip.classList.add("moving"); chipTo(k);
        await w(380);
        chip.classList.remove("moving");
        setLit(k); setBusL(k);
        await w(160);
      }
      const text = job.lines[k].l;
      await type($("[data-l]", pl), text, w);
      await w(Math.max(140, STEP - (k ? 540 : 200) - text.length * 21));
    }
    // ~6.6 s: the check plate is done and stays lit; the result leaves through the right bus and port
    $("[data-t]", plates[3]).textContent = job.lines[3].t;
    plates[3].classList.add("done");
    setBusL(-1); setBusR(true); portR.classList.add("on");
    chip.classList.add("out");
    await w(160);
    comet("out", 0);
    await w(900);
    light("out", 0, true);
    const out = await land(job, w);
    if (job.ok) {
      // it waits for Mikko (one more item waiting for a person) until he approves it
      bump("wait", 1);
      await w(2400);
      await approve(job, out, w);
      bump("done", job.done);
      await w(200);
      bump("hours", job.hours);
      await w(400);
    } else {
      await w(300);
      bump("done", job.done);
      await w(200);
      bump("hours", job.hours);
      await w(600);
    }
    // the wires go quiet
    light("in", job.src, false); light("out", 0, false); setBusR(false);
    row.classList.remove("on"); out.classList.remove("on");
    portL.classList.remove("on"); portR.classList.remove("on");
    await w(500);
    if (last) return;
    // the plates clear for the next job
    clearPlates();
    const next = jobs[(j + 1) % jobs.length];
    learn.style.opacity = "0";
    await w(280);
    learn.textContent = next.learn;
    setChip(next);
    learn.style.opacity = "";
    await w(320);
  };

  WF.demo(root, async (api) => {
    const w = api.wait;
    await w(400);
    for (;;) {
      for (let j = 0; j < jobs.length; j++) await runJob(jobs[j], j, w, j === jobs.length - 1);
      // cross-fade back to the start
      stage.classList.add("fade");
      Object.values(nums).forEach((n) => { n.style.opacity = "0"; });
      await w(300);
      reset();
      stage.classList.remove("fade");
      Object.values(nums).forEach((n) => { n.style.opacity = ""; });
      await w(300);
    }
  }, { pauseIn: foot });
})();

/* The example control room (part_ctrl.py): a 24 s loop through WF.demo, event by event, never more than two things
   moving at once. On first view the window settles from a slight tilt, the KPIs count once and the chart draws once
   (its end point and callout appear only when the line reaches today). Then a cursor approves the first request (the
   row confirms and collapses; the sidebar and subline counts go down), a log line arrives, a quote's stage changes
   with a soft sweep, a new approval slides in and the cursor approves it (the invoices count clears and "Invoiced"
   ticks up), and the loop resets with a true 600 ms cross-fade: a still copy of the panel fades out over the restored
   one. On phones a tap ring replaces the arrow cursor.
   Nothing here changes a card's height: rows collapse and arrive inside frozen boxes (.cc-fz, see ctrl.css).
   The HTML is the full first state; under reduced motion still() shows the first approval done instead. */
(() => {
  const WF = window.WF;
  const win = document.querySelector("[data-cc]");
  if (!WF || !win) return;
  const lang = document.documentElement.lang || "en";
  const $ = (s, r = win) => r.querySelector(s);
  const $$ = (s, r = win) => [...r.querySelectorAll(s)];
  const fmt = (v, dec = 0) => {
    const [i, d] = Number(v).toFixed(dec).split(".");
    const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : " ");
    return d ? int + (lang === "en" ? "." : ",") + d : int;
  };
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);

  const main = $(".cc-main"), inner = $(".cc-in"), list = $("[data-cc-aps]"), log = $("[data-cc-log]");
  const cursor = $(".cc-cursor"), tap = $(".cc-tap");
  const k3 = $("[data-cc-k3]"), row = $('[data-cc-row="2042"]');
  const after = $("[data-cc-after]").content.children;
  const count = (k) => $(`[data-cc-n="${k}"]`);
  const dot = (i) => $(`[data-cc-b="${i}"]`);
  const phone = () => win.offsetWidth < 760;
  // the first state, to come back to at the end of each loop
  const init = { aps: list.innerHTML, log: log.innerHTML, row: row.innerHTML, k3: k3.innerHTML };

  const setN = (el, v) => {
    if (!el) return;
    el.textContent = v;
    el.classList.remove("is-roll"); void el.offsetWidth; el.classList.add("is-roll");
  };
  const ping = (i) => { const d = dot(i); if (!d) return; d.classList.remove("is-ping"); void d.offsetWidth; d.classList.add("is-ping"); };
  const shown = (el) => !!(el && el.offsetParent);

  const approveDone = (li) => li.classList.add("is-ok");
  const addLogLine = () => log.prepend($("[data-cc-logtpl]").content.firstElementChild.cloneNode(true));
  const changeRowNow = () => {
    const st = row.querySelector(".cc-stw"), nx = row.querySelector(".cc-nx");
    st.replaceChildren(after[0].cloneNode(true));
    nx.textContent = after[1].textContent;
  };

  // reduced motion: the first approval done, its effects shown, nothing moving
  const still = () => {
    approveDone(list.firstElementChild);
    count("inbox").textContent = "13";
    count("wait").textContent = count("wait2").textContent = "2";
    addLogLine();
    changeRowNow();
  };

  if (WF.still) { WF.demo(win, null, { still }); return; }

  // before it is seen: tilted and faded, KPIs at zero, the chart not yet drawn and its marker hidden
  win.classList.add("cc-pre", "cc-pre-draw", "cc-pre-mark", "cc-pre-call");
  const nums = $$(".cc-kpis .cc-num").map((el) => ({ el, to: Number(el.dataset.ccTo), dec: Number(el.dataset.ccDec || 0) }));
  nums.forEach((n) => { n.el.textContent = fmt(0, n.dec); });
  let A = null;
  // a tween that only advances while the demo plays (api.wait resolves on the next playing frame)
  const tween = async (ms, fn) => {
    let t = 0, last = performance.now();
    fn(0);
    while (t < ms) {
      await A.wait(1);
      const now = performance.now();
      t += Math.min(50, now - last); last = now;
      fn(Math.min(1, t / ms));
    }
  };

  // the cursor: a quadratic Bézier from where it is to the target, then hover and press
  let cx = 0, cy = 0;
  const place = (x, y) => { cx = x; cy = y; cursor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; };
  const spot = (el, fx = .5, fy = .55) => {
    const w = win.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - w.left + r.width * fx, y: r.top - w.top + r.height * fy };
  };
  const moveTo = async (p, ms = 900) => {
    const x0 = cx, y0 = cy;
    const mx = (x0 + p.x) / 2 + (p.y - y0) * .22, my = (y0 + p.y) / 2 - Math.abs(p.x - x0) * .12;
    await tween(ms, (t) => {
      const k = ease(t), u = 1 - k;
      place(u * u * x0 + 2 * u * k * mx + k * k * p.x, u * u * y0 + 2 * u * k * my + k * k * p.y);
    });
  };
  const enter = async () => {
    if (phone()) { await A.wait(320); return; }
    const r = $(".cc-wait").getBoundingClientRect(), w = win.getBoundingClientRect();
    place(r.left - w.left + r.width * .58, r.bottom - w.top - 18);
    cursor.classList.add("is-on");
    await A.wait(320);
  };
  const leave = async () => {
    if (phone()) { await A.wait(1000); return; }
    const r = $(".cc-wait").getBoundingClientRect(), w = win.getBoundingClientRect();
    await moveTo({ x: r.left - w.left + r.width * .66, y: r.bottom - w.top - 14 }, 700);
    cursor.classList.remove("is-on");
    await A.wait(300);
  };
  // press: the arrow on a desktop-sized window, a 28 px tap ring on a phone-sized one
  const press = async (btn) => {
    if (phone()) {
      await A.wait(900);
      const p = spot(btn, .5, .5);
      tap.style.setProperty("--x", `${p.x.toFixed(1)}px`); tap.style.setProperty("--y", `${p.y.toFixed(1)}px`);
      tap.classList.remove("is-tap"); void tap.offsetWidth; tap.classList.add("is-tap");
      btn.classList.add("is-hover", "is-press");
      await A.wait(150);
      btn.classList.remove("is-press");
      await A.wait(120);
      return;
    }
    await moveTo(spot(btn, .42, .62));
    btn.classList.add("is-hover");
    await A.wait(150);
    btn.classList.add("is-press"); cursor.classList.add("is-press");
    await A.wait(120);
    btn.classList.remove("is-press"); cursor.classList.remove("is-press");
  };
  // the row confirms, then collapses inside the frozen list (the card keeps its height; the rows below move up)
  const approve = async (li) => {
    const btn = li.querySelector(".cc-go");
    await press(btn);
    approveDone(li);
    await A.wait(1100);
    btn.classList.remove("is-hover");
    const h = li.offsetHeight;
    li.style.overflow = "hidden";
    await tween(320, (t) => { const k = out(t); li.style.height = `${h * (1 - k)}px`; li.style.opacity = String(1 - k); });
    li.remove();
  };

  // a new approval slides in at the top of the list, into the slot the first one left
  const arrive = async () => {
    const li = $("[data-cc-tpl]").content.firstElementChild.cloneNode(true);
    li.style.height = "0px"; li.style.overflow = "hidden"; li.style.opacity = "0";
    list.prepend(li);
    const h = li.scrollHeight;
    await tween(380, (t) => { const k = out(t); li.style.height = `${h * k}px`; li.style.opacity = String(k); });
    li.style.height = li.style.overflow = li.style.opacity = "";
    return li;
  };

  // a log line arrives at the top (FLIP: the entries glide to their new places). In a list the oldest visible one
  // slides down under the bottom fade; in the three-column layout it fades where it stands.
  const logLine = async () => {
    const kids = [...log.children];
    const before = kids.map((el) => el.getBoundingClientRect());
    addLogLine();
    const li = log.firstElementChild;
    if (!shown(li)) return;
    const grid = getComputedStyle(log).display === "grid";
    const sz = log.parentElement.querySelector(".cc-sz");
    const k = [...sz.children].filter((el) => getComputedStyle(el).display !== "none").length;
    const moves = kids.map((el, i) => {
      const a = el.getBoundingClientRect();
      return { el, dx: before[i].left - a.left, dy: before[i].top - a.top, pin: grid && i + 1 >= k };
    });
    li.style.transition = "none"; li.style.opacity = "0";
    await tween(380, (t) => {
      const q = out(t);
      moves.forEach((m) => { const f = m.pin ? 1 : 1 - q; m.el.style.transform = `translate(${(m.dx * f).toFixed(1)}px, ${(m.dy * f).toFixed(1)}px)`; });
      li.style.opacity = String(q);
      li.style.transform = `translateY(${(-6 * (1 - q)).toFixed(1)}px)`;
    });
    moves.forEach((m) => { m.el.style.transform = ""; });
    li.style.opacity = li.style.transform = li.style.transition = "";
  };

  // quote 2042: the stage chip and the next step cross-fade while a soft band sweeps the row
  const changeRow = async () => {
    if (!shown(row)) { await A.wait(1400); return; }
    const st = row.querySelector(".cc-stw"), nx = row.querySelector(".cc-nx");
    row.classList.add("is-sweep");
    await A.wait(280);
    st.style.opacity = nx.style.opacity = "0";
    await A.wait(220);
    changeRowNow();
    st.style.opacity = nx.style.opacity = "";
    await A.wait(900);
    row.classList.remove("is-sweep");
  };

  // the invoices went out: "Invoiced in October" ticks up and its delta changes
  const invoiced = async () => {
    const n = k3.querySelector(".cc-num"), d = k3.querySelector(".cc-kd");
    const from = Number(n.dataset.ccTo), to = Number(k3.dataset.ccK3);
    d.style.opacity = "0";
    await tween(700, (t) => { n.textContent = fmt(from + (to - from) * out(t)); });
    d.innerHTML = "";
    d.append(after[2].cloneNode(true), " ", after[3].cloneNode(true));
    d.style.opacity = "";
  };

  // the reset: a still copy of the panel covers it, the real one goes back to the first state underneath, and the
  // copy fades out over 600 ms, so only what changed visibly cross-fades
  const reset = async () => {
    const ghost = inner.cloneNode(true);
    ghost.classList.add("cc-ghost");
    $$("[id]", ghost).forEach((el) => el.removeAttribute("id"));
    $$("*", ghost).forEach((el) => [...el.attributes].forEach((a) => { if (a.name.startsWith("data-cc")) el.removeAttribute(a.name); }));
    main.append(ghost);
    list.innerHTML = init.aps; log.innerHTML = init.log; row.innerHTML = init.row; k3.innerHTML = init.k3;
    count("wait").textContent = count("wait2").textContent = String(list.children.length);
    await tween(600, (t) => { ghost.style.opacity = String(1 - t); });
    ghost.remove();
    setN(count("inbox"), "14"); setN(count("invoice"), "4");
  };

  WF.demo(win, async (api) => {
    A = api;
    let first = true;
    for (;;) {
      if (first) {
        first = false;
        // the window settles from a slight tilt (a transition, so it finishes even if paused mid-way)
        win.classList.add("cc-settle");
        await A.wait(16);
        win.classList.remove("cc-pre");
        // 0.6 s: the KPIs count once; 1.2 s: the chart draws once (1.5 s wipe)
        await A.wait(600);
        tween(900, (t) => nums.forEach((n) => { n.el.textContent = fmt(n.to * out(t), n.dec); }));
        await A.wait(600);
        win.classList.remove("cc-settle");
        win.classList.add("cc-drawing");
        win.classList.remove("cc-pre-draw");
        // the line reaches today: first the point and its leader, then the callout
        await A.wait(1450);
        win.classList.remove("cc-pre-mark");
        await A.wait(120);
        win.classList.remove("cc-pre-call");
        await A.wait(230);
        win.classList.remove("cc-drawing");
      } else {
        await A.wait(3000);
      }
      // 3 s: the cursor approves the first request; the counts go down
      await enter();
      await approve(list.firstElementChild);
      setN(count("inbox"), "13"); setN(count("wait"), "2");
      count("wait2").textContent = "2";
      await A.wait(300);
      ping(2);
      await leave();
      // 7 s: what just happened lands in the log
      await A.wait(500);
      await logLine();
      // 9 s: quote 2042's reminder goes out
      await A.wait(1000);
      ping(1);
      await A.wait(400);
      await changeRow();
      // 15 s: a new approval arrives
      await A.wait(4400);
      ping(3);
      await A.wait(500);
      const li = await arrive();
      setN(count("wait"), "3");
      count("wait2").textContent = "3";
      // 17.5 s: the cursor approves it; the invoices count clears and "Invoiced" ticks up
      await A.wait(1200);
      await enter();
      await approve(li);
      setN(count("invoice"), ""); setN(count("wait"), "2");
      count("wait2").textContent = "2";
      await A.wait(200);
      await invoiced();
      await leave();
      // 23.4 s: cross-fade back to the start
      await A.wait(1300);
      await reset();
    }
  }, { still, threshold: .3, pauseIn: win.closest(".cc").querySelector(".cc-under") || win });
})();

/* Our approach (#blocks): the stack follows the method, then plays an example company's blocks when one is picked.
   Desktop and tablet: as each step crosses the middle of the screen (IntersectionObserver, rootMargin -50% 0 -50% 0)
   the sticky stack moves on: 0 ghost outline, 1 the free pilot, 2 the next blocks, 3 all of it running. The 1px rail
   fills with the reading position (a passive scroll listener, only while the section is on screen). Nothing here
   pins or steers the scroll. Reaching the list keeps the full stack as it is; picking a company in "See the blocks
   for" plays that company's six blocks into the stack one by one, in its own order (data-mt-order), while the matching
   row is marked. Phone: the stack sits once above the steps and builds once when it is seen. Reduced motion:
   everything is shown at once. */
(() => {
  const run = document.querySelector("[data-mt]");
  if (!run) return;
  const WF = window.WF || {};
  const still = WF.still ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = window.matchMedia("(max-width: 767px)");
  const stage = run.querySelector("[data-mt-stage]");
  const lits = [...stage.querySelectorAll("[data-mt-slot]")].sort((a, b) => a.dataset.mtSlot - b.dataset.mtSlot);
  const stepsBox = run.querySelector(".mt-steps");
  const steps = [...run.querySelectorAll("[data-mt-step]")];
  const zone = run.querySelector("[data-mt-pick]");
  const tabs = [...run.querySelectorAll("[data-mt-tab]")];
  const panels = [...run.querySelectorAll("[data-mt-co]")];
  const thumb = run.querySelector(".mt-thumb");
  const BASE = lits.map((_, i) => i);
  const STATES = [0, 1, 5, 6];  // blocks lit at each step of the method
  const DROP = 420;              // stagger between blocks dropping together: over half the 820 ms drop, so at most two move at once
  let ci = 0, token = 0, cur = -1;
  const inMid = new Set();
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const orderOf = (k) => {
    const o = (panels[k] && panels[k].dataset.mtOrder || "").split(",").map(Number);
    return o.length === lits.length && o.every((n) => lits[n]) ? o : BASE;
  };

  // Light the first n blocks of an order; the ones newly lit drop in one after another.
  const light = (n, order = BASE, stagger = DROP) => {
    const want = new Set(order.slice(0, n));
    let q = 0;
    order.forEach((slot) => {
      const l = lits[slot], on = want.has(slot);
      l.style.transitionDelay = on && !l.classList.contains("on") ? `${q++ * stagger}ms` : "";
      l.classList.toggle("on", on);
    });
  };
  const rowsOf = (k) => [...panels[k].querySelectorAll("[data-mt-row]")];
  const settle = () => panels.forEach((p) => {
    p.classList.remove("is-playing");
    p.querySelectorAll(".is-now").forEach((r) => r.classList.remove("is-now"));
  });

  // A step of the method (0–3) on the stack, and on the step list.
  const toStep = (s) => {
    if (cur === s) return;
    token++; settle();
    cur = s;
    stage.dataset.s = String(s);
    light(STATES[s]);
    steps.forEach((st, i) => { st.classList.toggle("is-on", i === s); st.classList.toggle("is-past", i < s); });
  };

  // An example company, picked from its tab: the stack clears, then its blocks drop in one by one in its own order,
  // and the row of each block is marked while it lands. The rows themselves stay fully readable.
  const play = async (k) => {
    const my = ++token;
    cur = "co"; stage.dataset.s = "co";
    settle();
    const rows = rowsOf(k), order = orderOf(k);
    if (still) { light(lits.length, order, 0); return; }
    panels[k].classList.add("is-playing");
    light(0, order);  // the stack fades out where it is
    await wait(380);
    if (my !== token) return;
    for (let i = 0; i < rows.length; i++) {
      light(i + 1, order);
      rows.forEach((r, j) => r.classList.toggle("is-now", j === i));
      await wait(560);
      if (my !== token) return;
    }
    await wait(500);
    if (my !== token) return;
    settle();
    // played from a tab while the steps were in the middle of the screen: give the stack back to the step there
    const st = steps.find((x) => inMid.has(x));
    if (!inMid.has(zone) && st && !phone.matches) toStep(Number(st.dataset.mtStep));
  };

  // Arriving at the list: the stack stays (or becomes) whole; nothing replays until a company is picked.
  const toCompanies = () => {
    if (cur === "co") return;
    token++; settle();
    cur = "co"; stage.dataset.s = "co";
    light(lits.length, orderOf(ci));
    steps.forEach((st) => { st.classList.remove("is-on"); st.classList.add("is-past"); });
  };

  // The segmented control: tabs with arrow keys; a thumb slides under the chosen one.
  const place = () => {
    const b = tabs[ci];
    if (!b || !thumb) return;
    thumb.style.width = b.offsetWidth + "px";
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  const pick = (k, focus) => {
    ci = k;
    tabs.forEach((b, i) => { b.setAttribute("aria-selected", String(i === k)); b.tabIndex = i === k ? 0 : -1; });
    panels.forEach((p, i) => p.classList.toggle("on", i === k));
    if (focus) tabs[k].focus();
    place();
    play(k);
  };
  tabs.forEach((b, k) => {
    b.addEventListener("click", () => pick(k, false));
    b.addEventListener("keydown", (ev) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
      if (d) { ev.preventDefault(); pick((k + d + tabs.length) % tabs.length, true); }
      else if (ev.key === "Home" || ev.key === "End") { ev.preventDefault(); pick(ev.key === "Home" ? 0 : tabs.length - 1, true); }
    });
  });
  if (tabs[0]) new ResizeObserver(place).observe(tabs[0].parentElement);
  if (document.fonts) document.fonts.ready.then(place);
  place();

  // A row hovered in the list picks out its block in the stack.
  panels.forEach((p) => {
    const k = Number(p.dataset.mtCo);
    rowsOf(k).forEach((r, i) => {
      const l = () => lits[orderOf(k)[i]];
      r.addEventListener("pointerenter", () => { if (cur !== "co" || p.classList.contains("is-playing")) return; stage.classList.add("is-focus"); l().classList.add("is-focus"); });
      r.addEventListener("pointerleave", () => { stage.classList.remove("is-focus"); l().classList.remove("is-focus"); });
    });
  });

  // The rail runs from the first step's dot to the last one's.
  const rail = () => stepsBox.style.setProperty("--rail-h", `${steps[steps.length - 1].offsetTop}px`);
  new ResizeObserver(rail).observe(stepsBox);
  rail();

  if (still) {
    stage.dataset.s = "3"; cur = 3; light(lits.length, BASE, 0);
    steps.forEach((st) => st.classList.add("is-on"));
    return;
  }
  stage.dataset.s = "0"; light(0, BASE, 0);

  // Desktop and tablet: the step crossing the middle of the screen sets the stack; the list's zone switches to the
  // companies. Phone: none of this (the stack is not beside the steps there).
  const mid = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) inMid.add(en.target); else inMid.delete(en.target);
    if (!en.isIntersecting || phone.matches) return;
    if (en.target === zone) toCompanies();
    else toStep(Number(en.target.dataset.mtStep));
  }), { rootMargin: "-50% 0px -50% 0px" });
  steps.forEach((s) => mid.observe(s));
  mid.observe(zone);

  // Phone: the stack builds once, step by step, when it is seen.
  let built = false;
  new IntersectionObserver(async ([en]) => {
    if (!en.isIntersecting || !phone.matches || built) return;
    built = true;
    for (const [s, ms] of [[0, 500], [1, 1100], [2, 3 * DROP + 900], [3, 0]]) {
      if (cur === "co") return;
      stage.dataset.s = String(s); cur = s; light(STATES[s]);
      await wait(ms);
    }
  }, { threshold: .5 }).observe(stage);

  // The rail fills with the reading position: how far the middle of the screen is through the steps.
  let raf = 0;
  const fill = () => {
    raf = 0;
    const r = stepsBox.getBoundingClientRect(), h = steps[steps.length - 1].offsetTop || 1;
    const p = Math.min(1, Math.max(0, (innerHeight / 2 - r.top - 6) / h));
    stepsBox.style.setProperty("--p", p.toFixed(4));
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(fill); };
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
    else window.removeEventListener("scroll", onScroll);
  }).observe(stepsBox);
  new ResizeObserver(onScroll).observe(stepsBox);
})();

/* The offer (part_offer.py): the AI rollout band widens from inset to the full page as its centre travels from the
   bottom of the screen to the middle. It reads the scroll position (a passive listener plus one requestAnimationFrame
   per frame) and only sets --rb-p, which the CSS turns into the clip-path and the glow. It never pins or steers the
   scroll. Under reduced motion the band is shown open. */
(() => {
  const band = document.querySelector("[data-rb]");
  if (!band) return;
  const WF = window.WF || {};
  const still = WF.still ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) { band.style.setProperty("--rb-p", "1"); return; }
  let raf = 0, last = -1;
  const update = () => {
    raf = 0;
    const r = band.getBoundingClientRect(), vh = window.innerHeight || 1;
    const centre = r.top + r.height / 2;
    let p = (vh - centre) / (vh * 0.5);             // 0 with the centre at the bottom edge, 1 at the middle
    p = Math.min(1, Math.max(0, p));
    p = p * p * (3 - 2 * p);                        // ease in and out
    const v = Math.round(p * 1000) / 1000;
    if (v !== last) { last = v; band.style.setProperty("--rb-p", String(v)); }
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask, { passive: true });
  update();
})();

/* How we start (part_pilot.py, src/parts/pilot.css). Everything is in the HTML and readable without this script.
   1 The steps: on wide screens the three stills share one sticky place. The step whose copy has passed a line (set so
     both changes happen while the still is pinned) is the current one: its still cross-fades in and its copy lights
     up. Nothing steers the scroll: an IntersectionObserver turns a passive scroll listener on only near the story.
   2 What a pilot can be: an accordion (real buttons with aria-expanded and aria-controls, arrow keys between them).
     It moves on by itself about every 6 s through WF.demo (so it has a pause button, waits while it is off screen,
     hovered or focused, and stays put under reduced motion) until the visitor picks one. */
(() => {
  const WF = window.WF || {};
  const wide = window.matchMedia("(min-width: 861px)");

  const story = document.querySelector("[data-pl-story]");
  if (story && "IntersectionObserver" in window) {
    const figs = [...story.querySelectorAll(".pl-fig")];
    const copies = [...story.querySelectorAll(".pl-copy")];
    // Each copy has its own line to pass, placed so the changes fall evenly inside the stretch where the still is
    // pinned, with a margin at both ends: the first a little after the still pins, the last well before it leaves.
    let lines = copies.map(() => window.innerHeight * 0.36);
    const measure = () => {
      if (!wide.matches || copies.length < 2) return;
      const pinned = story.offsetHeight - figs[0].offsetHeight;
      const top = parseFloat(getComputedStyle(figs[0]).top) || 96;
      const n = copies.length - 1;
      const m = Math.min(40, pinned / 4);
      lines = copies.map((c, k) => {
        if (k === 0) return Infinity;
        const at = n === 1 ? pinned / 2 : m + (k - 1) * (pinned - 2 * m) / (n - 1);
        return top + (c.offsetTop - copies[0].offsetTop) - at;
      });
    };
    let cur = 0;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      figs.forEach((f, k) => f.classList.toggle("is-on", k === i));
      copies.forEach((c, k) => c.classList.toggle("is-on", k === i));
    };
    const pick = () => {
      if (!wide.matches) return;
      let i = 0;
      copies.forEach((c, k) => { if (c.getBoundingClientRect().top < lines[k]) i = k; });
      set(i);
    };
    // while the story is near the screen, a passive scroll listener reads the copies' positions once per frame
    let ask = 0;
    const later = () => { if (!ask) ask = requestAnimationFrame(() => { ask = 0; pick(); }); };
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) window.addEventListener("scroll", later, { passive: true });
      else window.removeEventListener("scroll", later);
      pick();
    }, { rootMargin: "50% 0px 50% 0px" }).observe(story);
    const mode = () => { story.classList.toggle("pl-live", wide.matches); measure(); pick(); };
    wide.addEventListener("change", mode);
    window.addEventListener("resize", () => { measure(); later(); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mode);
    mode();
  }

  const box = document.querySelector("[data-pl-ideas]");
  if (box) {
    box.classList.add("pl-js");
    const items = [...box.querySelectorAll(".pl-it")];
    const btns = items.map((li) => li.querySelector(".pl-ib"));
    const views = [...box.querySelectorAll(".pl-v")];
    const crumbs = [...box.querySelectorAll(".pl-cb")];
    const win = box.querySelector(".pl-win");
    const bar = box.querySelector(".pl-win .win-bar");
    let cur = 0, manual = false, hold = false;

    // the open text keeps the height of the longest one, so nothing below moves as the items change
    const fit = () => {
      box.style.setProperty("--pl-ipl", "0");
      let most = 1;
      items.forEach((li) => {
        const p = li.querySelector(".pl-ip p");
        const lh = parseFloat(getComputedStyle(p).lineHeight) || 26;
        most = Math.max(most, Math.round((p.getBoundingClientRect().height - 20) / lh));
      });
      box.style.setProperty("--pl-ipl", String(most));
    };
    let fitting = 0;
    window.addEventListener("resize", () => { if (!fitting) fitting = requestAnimationFrame(() => { fitting = 0; fit(); }); }, { passive: true });
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    const open = (i) => {
      if (i === cur) return;
      cur = i;
      items.forEach((li, k) => li.classList.toggle("is-on", k === i));
      btns.forEach((b, k) => b.setAttribute("aria-expanded", String(k === i)));
      views.forEach((v, k) => v.classList.toggle("is-on", k === i));
      crumbs.forEach((c, k) => c.classList.toggle("is-on", k === i));
    };
    const stop = () => {
      if (manual) return;
      manual = true;
      box.classList.remove("pl-auto");
      items.forEach((li) => li.style.removeProperty("--t"));
      const pause = win && win.querySelector(".demo-pause");
      if (pause) pause.remove();
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => { stop(); open(i); });
      b.addEventListener("keydown", (ev) => {
        const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 }[ev.key];
        if (to === undefined) return;
        ev.preventDefault();
        btns[(to + btns.length) % btns.length].focus();
      });
    });
    box.addEventListener("pointerenter", () => { hold = true; });
    box.addEventListener("pointerleave", () => { hold = false; });
    box.addEventListener("focusin", () => { hold = true; });
    box.addEventListener("focusout", (ev) => { if (!box.contains(ev.relatedTarget)) hold = false; });

    const EVERY = 6000;
    const demo = WF.demo && WF.demo(box, async (api) => {
      let t = 0;
      while (!manual) {
        const t0 = performance.now();
        await api.wait(100);
        if (manual) break;
        if (hold) continue;
        t += Math.min(160, performance.now() - t0);
        items[cur].style.setProperty("--t", Math.min(1, t / EVERY).toFixed(3));
        if (t >= EVERY) {
          t = 0;
          const was = items[cur];
          open((cur + 1) % items.length);
          was.style.setProperty("--t", "0");
        }
      }
    }, { pauseIn: bar || win, still() {} });
    if (demo) box.classList.add("pl-auto");
  }
})();

/* The proof (#work, part_work.py): the one big figure rises into place the first time it comes on screen, with its
   line fading in just before and the hairline under it drawing after (never more than two of them moving at once).
   It is only armed while it is still below the screen, so it is never hidden from someone already looking at it;
   under reduced motion, or without IntersectionObserver, it is simply there. */
(() => {
  const big = document.querySelector("[data-pf-big]");
  const WF = window.WF || {};
  if (!big || WF.still || !("IntersectionObserver" in window)) return;
  if (big.getBoundingClientRect().top < window.innerHeight) return;
  big.classList.add("pf-arm");
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    big.classList.add("pf-on");
    io.disconnect();
  }), { rootMargin: "0px 0px -30% 0px" });
  io.observe(big);
})();

/* The AI rollout demo (part_ra.py, parts/ra.css): the admin view and the team's workspace react to the same events in
   one 20 s loop, run by WF.demo (it plays only while the demo is on screen, adds the pause button, and under reduced
   motion leaves the finished state that the HTML already shows).
   1. Jari attaches the week's hours, types his question and sends it.
   2. The assistant's turn opens with the rules check, step by step; the admin's checks today go up by one.
   3. The answer streams in, then the result card, then what it cost and how long it took.
   4. The admin: spend +0,04 €, adoption 7 → 8 of 12 (Jari's ring closes after the figure), time saved +12 min.
   5. A pasted line with a personal ID number is flagged and masked before sending; "2 blocked" becomes 3.
   6. A 600 ms cross-fade back to the start.
   Each admin reaction moves two things only: the value ticks once and the change shows for a moment in the card's
   title row (its edge takes the accent meanwhile, without moving). */
(() => {
  const WF = window.WF;
  const root = document.querySelector("[data-rw]");
  if (!WF || !root) return;
  root.classList.add("rw-live");
  const lang = document.documentElement.lang || "en";
  const NB = " ";
  const q = (s) => root.querySelector(s);
  const qa = (s) => [...root.querySelectorAll(s)];

  // The stage is drawn at 1200 px and scales as one picture down to 1000 px (below that, ra.css stacks it).
  const size = () => {
    const w = root.clientWidth;
    root.style.setProperty("--k", w >= 1000 ? Math.min(1, w / 1200).toFixed(4) : "1");
  };
  size();

  // The thread keeps its newest line in view, like a real chat: it slides up once it is taller than the window.
  const thread = q("[data-rw-thread]"), tin = q("[data-rw-tin]");
  // An earlier message that would be cut through at the top edge is scrolled out whole instead (up to 64 px more),
  // and fades out, so no half line is left under the title bar.
  const fit = () => {
    const room = thread.clientHeight - parseFloat(getComputedStyle(thread).paddingTop) - 6;
    let over = Math.round(tin.offsetHeight - room);
    const t0 = tin.getBoundingClientRect().top;
    const early = qa(".rw-tin > .rw-early").filter((b) => b.offsetHeight).map((b) => { const r = b.getBoundingClientRect(); return [b, r.top - t0, r.bottom - t0]; });
    if (over > 0) early.forEach(([, top, bot]) => { if (top < over && bot > over && bot - over <= 64) over = Math.ceil(bot); });
    early.forEach(([b, top]) => b.classList.toggle("is-gone", over > 0 && top < over));  // what has scrolled past fades out
    thread.classList.toggle("is-over", over > 0);
    tin.style.transform = over > 0 ? `translateY(${-over}px)` : "";
  };
  if ("ResizeObserver" in window) {
    new ResizeObserver(size).observe(root);
    const ro = new ResizeObserver(() => fit());
    ro.observe(thread); ro.observe(tin);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit());

  const eur = (v) => {
    const [w, c] = v.toFixed(2).split(".");
    return lang === "en" ? `€${w}<span class="rw-ct">.${c}</span>` : `${w}<span class="rw-ct">,${c}</span>${NB}€`;
  };
  const pct = (n) => (lang === "en" ? `${n}%` : `${n}${NB}%`);
  const hm = (m) => `${Math.floor(m / 60)}<span class="rw-u">h</span> ${m % 60}<span class="rw-u">min</span>`;

  const V = {
    users: q("[data-rw-users]"), pct: q("[data-rw-pct]"), spend: q("[data-rw-spend]"), checks: qa("[data-rw-checks]"),
    blocked: q("[data-rw-blocked]"), saved: q("[data-rw-saved]"), jmin: q("[data-rw-jmin]"),
  };
  const jr = q("[data-rw-jr]");
  const part = (k) => q(`[data-rw-part="${k}"]`);
  const P = { msg: part("msg"), turn: part("turn"), ans: part("ans"), res: part("res"), cost: part("cost") };
  const steps = qa(".rw-st:not(.rw-st-sum)"), sum = q(".rw-st-sum");
  const words = P.ans.textContent.trim().split(/\s+/);
  const ask = q("[data-rw-ask]").textContent;
  const box = q("[data-rw-box]"), fchip = q("[data-rw-fchip]"), ph = q("[data-rw-ph]"), typed = q("[data-rw-typed]");
  const paste = q("[data-rw-paste]"), pii = q("[data-rw-pii]"), send = q("[data-rw-send]"), guard = q("[data-rw-guard]");
  const stage = q(".rw-stage");
  const dls = qa(".rw-dl");
  // the change label leaves the row once it has faded (it is laid over the meta, so it never takes room anyway)
  dls.forEach((dl) => dl.addEventListener("animationend", () => { dl.textContent = ""; }));

  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const set = (el, html, tick = true) => { el.innerHTML = html; if (tick) restart(el, "rw-tick"); };
  // a card reacts: the change shows for a moment in its title row ("+0,04 €") while its edge takes the accent
  const hit = (k, d, risk) => {
    const c = q(`[data-rw-card="${k}"]`);
    const txt = root.dataset[`d${d[0].toUpperCase()}${d.slice(1)}`] || "";
    c.querySelectorAll(".rw-dl").forEach((dl) => { dl.textContent = txt; });
    c.classList.toggle("is-dr", !!risk);
    restart(c, "is-d");
  };
  const show = (el) => { el.hidden = false; restart(el, "rw-enter"); };

  // back to the start of the story: an empty thread and composer, and the admin before Jari's question. It is set
  // with every transition off (.rw-snap), so nothing slides or cross-fades into place during the loop's fade.
  const rewind = () => {
    root.classList.add("rw-snap");
    Object.values(P).forEach((el) => { el.hidden = true; el.classList.remove("rw-enter"); });
    steps.forEach((li) => li.classList.add("is-wait")); sum.classList.add("is-wait");
    P.ans.textContent = "";
    box.classList.remove("is-focus");
    fchip.hidden = true; paste.hidden = true; ph.hidden = false; typed.textContent = "";
    pii.classList.remove("is-flag", "is-masked");
    guard.classList.remove("is-hit");
    V.users.textContent = "7"; V.pct.textContent = pct(58); V.spend.innerHTML = eur(612);
    V.checks.forEach((c) => { c.textContent = "41"; });
    V.blocked.textContent = "2"; V.saved.innerHTML = hm(130); V.jmin.textContent = "31";
    jr.classList.remove("on", "rw-tn");
    dls.forEach((dl) => { dl.textContent = ""; });
    qa(".rw-tick, .is-d").forEach((el) => el.classList.remove("rw-tick", "is-d", "is-dr"));
    fit();
    void root.offsetWidth;
    root.classList.remove("rw-snap");
  };

  const run = async (api) => {
    let T = 0;
    const sleep = async (ms) => { await api.wait(ms); T += ms; };
    const at = (s) => sleep(Math.max(0, s * 1000 - T));
    for (;;) {
      T = 0;
      // 1. the hours are attached, the question typed (40 ms a letter) and sent
      await at(0.4);
      box.classList.add("is-focus"); ph.hidden = true; show(fchip);
      await at(0.7);
      for (let i = 1; i <= ask.length; i++) { typed.textContent = ask.slice(0, i); await sleep(40); }
      await at(Math.max(2.2, T / 1000 + 0.2));
      send.classList.add("is-push"); await sleep(150); send.classList.remove("is-push");
      typed.textContent = ""; fchip.hidden = true; box.classList.remove("is-focus"); ph.hidden = false;
      show(P.msg); fit();
      // 2. the assistant's turn opens with the rules, one step at a time; the admin counts the check
      await at(2.7);
      show(P.turn); fit();
      for (const li of steps) { await sleep(350); li.classList.remove("is-wait"); }
      sum.classList.remove("is-wait");
      await sleep(180);
      hit("rules", "check"); V.checks.forEach((c) => set(c, "42"));
      // 3. the answer, word by word, then the result card, then what it cost and how long it took
      await at(4.2);
      P.ans.hidden = false;
      const per = Math.min(140, Math.max(60, 3500 / words.length));
      for (let i = 0; i < words.length; i++) {
        const w = document.createElement("i");
        w.textContent = (i ? " " : "") + words[i];
        P.ans.appendChild(w);
        if (i % 2 === 0 || i === words.length - 1) fit();
        await sleep(per);
      }
      await at(8.4);
      show(P.res); fit();
      await at(8.9);
      show(P.cost);
      // 4. the admin follows, one card at a time: the spend, then adoption, then the time saved
      await at(9.4);
      hit("spend", "spend"); set(V.spend, eur(612.04));
      await at(11.2);
      hit("adopt", "adopt"); set(V.users, "8"); V.pct.textContent = pct(67);
      await at(11.7);
      jr.classList.add("on", "rw-tn");  // Jari's ring draws once the figure has settled
      await at(13.2);
      hit("saved", "saved"); set(V.saved, hm(142));
      await at(13.8);
      set(V.jmin, "43");
      // 5. a pasted line carries a personal ID number: flagged, masked before sending, counted as blocked
      await at(15.0);
      box.classList.add("is-focus"); ph.hidden = true; show(paste);
      await at(15.7);
      pii.classList.add("is-flag");
      await at(16.7);
      pii.classList.remove("is-flag"); pii.classList.add("is-masked"); guard.classList.add("is-hit");
      await at(17.3);
      hit("rules", "block", true); set(V.blocked, "3");
      // 6. hold, then cross-fade back to the start
      await at(19.4);
      stage.classList.add("rw-fading");
      await at(19.7);
      rewind();
      stage.classList.remove("rw-fading");
      await at(20.0);
    }
  };

  const api = WF.demo(root, run, { still: fit, pauseIn: q(".rw-foot") });
  if (api) rewind(); else fit();
})();

/* The AI rollout page (page_rollout.py, src/parts/rollout.css). Everything is in the HTML and readable without this
   script; it only adds motion that follows the reader. Nothing pins or steers the scroll: each piece listens to a
   passive scroll only while it is near the screen. Under reduced motion every piece shows its finished state.
   1 The statement: its words light up from grey to white in reading order as it moves up the screen (the same pace
     as the home page's statement), and the payoff last.
   2 The steps: on wide screens the four stills share one sticky place. The step whose copy has passed its line is
     the current one: its still cross-fades in, then its card rises and its part of the rule fills, and its copy
     lights up. The lines are spread evenly over the stretch where the still is pinned.
   3 Cost control: once the rail is above the lowest fifth of the screen, the Wicflow marker appears at the open end,
     swings across to the cap, swings back past the middle and settles in the green zone (one event, 2.8 s); then the
     zone lights. */
(() => {
  if (!document.body.classList.contains("ro")) return;
  const WF = window.WF || {};
  const still = WF.still ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1 The statement. It starts when its top passes 86 % of the screen's height and is fully lit when its last line
  // is about 62 % of the way down.
  const st = document.querySelector("[data-rp-st]");
  if (st) {
    const words = [...st.querySelectorAll(".sm-w, .sm-acc")];
    if (still) words.forEach((w) => w.classList.add("on"));
    else {
      let lit = -1, raf = 0;
      const paint = () => {
        raf = 0;
        const r = st.getBoundingClientRect(), vh = window.innerHeight;
        const n = Math.round(Math.min(1, Math.max(0, (vh * .86 - r.top) / (r.height + vh * .24))) * words.length);
        if (n !== lit) { lit = n; words.forEach((w, i) => w.classList.toggle("on", i < n)); }
      };
      const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) window.addEventListener("scroll", ask, { passive: true });
        else window.removeEventListener("scroll", ask);
        ask();
      }).observe(st);
      window.addEventListener("resize", ask, { passive: true });
    }
  }

  // 2 The steps (the home pilot's story, with four steps).
  const story = document.querySelector("[data-rp-story]");
  const wide = window.matchMedia("(min-width: 861px)");
  if (story && "IntersectionObserver" in window) {
    const figs = [...story.querySelectorAll(".rp-fig")];
    const copies = [...story.querySelectorAll(".rp-copy")];
    let lines = copies.map(() => window.innerHeight * .36);
    // each copy has its own line to pass, placed so the changes fall evenly inside the stretch where the still is
    // pinned, with a margin at both ends: the first a little after the still pins, the last well before it leaves
    const measure = () => {
      if (!wide.matches || copies.length < 2) return;
      const pinned = story.offsetHeight - figs[0].offsetHeight;
      const top = parseFloat(getComputedStyle(figs[0]).top) || 96;
      const n = copies.length - 1;
      const m = Math.min(48, pinned / 5);
      lines = copies.map((c, k) => {
        if (k === 0) return Infinity;
        const at = m + (k - 1) * (pinned - 2 * m) / Math.max(1, n - 1);
        return top + (c.offsetTop - copies[0].offsetTop) - at;
      });
    };
    let cur = 0;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      figs.forEach((f, k) => f.classList.toggle("is-on", k === i));
      copies.forEach((c, k) => c.classList.toggle("is-on", k === i));
    };
    const pick = () => {
      if (!wide.matches) return;
      let i = 0;
      copies.forEach((c, k) => { if (c.getBoundingClientRect().top < lines[k]) i = k; });
      set(i);
    };
    let ask = 0;
    const later = () => { if (!ask) ask = requestAnimationFrame(() => { ask = 0; pick(); }); };
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) window.addEventListener("scroll", later, { passive: true });
      else window.removeEventListener("scroll", later);
      pick();
    }, { rootMargin: "50% 0px 50% 0px" }).observe(story);
    const mode = () => {
      story.classList.toggle("rp-live", wide.matches && !still);
      if (!wide.matches) { figs.forEach((f) => f.classList.add("is-on")); copies.forEach((c) => c.classList.add("is-on")); cur = -1; return; }
      if (cur === -1) { cur = 0; figs.forEach((f, k) => f.classList.toggle("is-on", k === 0)); copies.forEach((c, k) => c.classList.toggle("is-on", k === 0)); }
      measure(); pick();
    };
    wide.addEventListener("change", mode);
    window.addEventListener("resize", () => { measure(); later(); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mode);
    mode();
  }

  // 3 Cost control: the marker swings once, when the rail is above the lowest fifth of the screen.
  const xt = document.querySelector("[data-rp-xt]");
  if (xt) {
    const track = xt.querySelector(".rp-track"), run = xt.querySelector(".rp-run");
    if (still || !track || !run || !("IntersectionObserver" in window)) xt.classList.add("rp-done");
    else {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        // the marker's own fade-in also ends an animation (and bubbles up here): wait for the swing itself
        const end = (ev) => { if (ev.animationName !== "rp-swing") return; run.removeEventListener("animationend", end); xt.classList.add("rp-done"); };
        run.addEventListener("animationend", end);
        xt.classList.add("rp-go");
      }, { rootMargin: "0px 0px -20% 0px" });
      io.observe(track);
    }
  }
})();

/* Who we work with and what we believe: the logo row drifts only while it is on screen and can be paused, and the
   statement's words light up as it is read. Both follow the visitor; nothing here pins or steers the scroll. */
(() => {
  const WF = window.WF || {};
  const still = WF.still ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The logo row: CSS moves it; this sets its pace, stops it while it is off screen and adds a pause button (WCAG 2.2.2).
  const mq = document.querySelector("[data-tw-mq]");
  if (mq && !still) {
    // The pace is in pixels per second, not seconds per loop: what the eye reads as "drifting" is the speed, so a longer
    // row (or a wider screen) gets a longer loop. On a resize it keeps its place in the loop.
    const PX_S = 28;
    const track = mq.querySelector(".tw-track"), list = mq.querySelector(".tw-list");
    let dur = 0;
    const pace = () => {
      const d = list.offsetWidth / PX_S;
      if (!d || Math.abs(d - dur) < .5) return;
      const a = track.getAnimations?.()[0];
      const at = a && dur ? (Number(a.currentTime) % (dur * 1000)) / (dur * 1000) : 0;
      dur = d;
      track.style.animationDuration = d.toFixed(2) + "s";
      const b = track.getAnimations?.()[0];
      if (b && at) b.currentTime = at * d * 1000;
    };
    pace();
    if ("ResizeObserver" in window) new ResizeObserver(pace).observe(list);

    new IntersectionObserver(([en]) => mq.classList.toggle("tw-off", !en.isIntersecting)).observe(mq);
    // a toggle button: its name stays "Pause the logo row" and aria-pressed says whether the row is paused
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "tw-btn";
    btn.setAttribute("aria-label", mq.dataset.twPause);
    const draw = () => {
      const held = mq.classList.contains("tw-held");
      btn.innerHTML = held ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8 10 6l-7 4.2z" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor"/></svg>';
      btn.setAttribute("aria-pressed", String(held));
    };
    btn.addEventListener("click", () => { mq.classList.toggle("tw-held"); draw(); });
    draw();
    mq.after(btn);
  }

  // The statement (data-sm-st, after "The statement" in v3.js): its words light up from grey to white in reading order
  // as it moves up the screen. It starts when its top passes 86 % of the screen's height and is fully lit when its last
  // line is 62 % of the way down.
  const st = document.querySelector("[data-sm-st]");
  if (st) {
    const words = [...st.querySelectorAll(".sm-w, .sm-acc")];
    if (still) words.forEach((w) => w.classList.add("on"));
    else {
      let lit = -1, raf = 0;
      const paint = () => {
        raf = 0;
        const r = st.getBoundingClientRect(), vh = window.innerHeight;
        const n = Math.round(Math.min(1, Math.max(0, (vh * .86 - r.top) / (r.height + vh * .24))) * words.length);
        if (n !== lit) { lit = n; words.forEach((w, i) => w.classList.toggle("on", i < n)); }
      };
      const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) window.addEventListener("scroll", ask, { passive: true });
        else window.removeEventListener("scroll", ask);
        ask();
      }).observe(st);
      window.addEventListener("resize", ask);
    }
  }
})();
