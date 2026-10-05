/* Shared helpers for the concept site. Nothing here talks to a network or stores anything.
   The page language comes from window.WF_LANG (set by the build); demos pick strings with WF.L({sv, fi, en}). */
window.WF = (() => {
  const lang = window.WF_LANG || "sv";
  const routes = window.WF_ROUTES || {};
  const today = new Date();
  const L = (o) => (o && typeof o === "object" && !Array.isArray(o) ? (o[lang] ?? o.sv) : o);
  const DAYS = L({
    sv: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
    fi: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  });
  // "on Wednesday": Finnish needs the essive case.
  const ON_DAYS = L({
    sv: DAYS.map((d) => "på " + d),
    fi: ["sunnuntaina", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"],
    en: DAYS.map((d) => "on " + d),
  });
  const MONTHS = L({
    sv: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
    fi: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  });
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  const dm = (n = 0) => {
    const d = addDays(n);
    if (lang === "en") return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
    return d.getDate() + "." + (d.getMonth() + 1) + (lang === "fi" ? "." : "");
  };
  const weekday = (n = 0) => DAYS[addDays(n).getDay()];
  const onDay = (n = 0) => ON_DAYS[addDays(n).getDay()];
  const nextWeekday = (wd) => { let o = 1; while (addDays(o).getDay() !== wd) o++; return o; };
  const month = (n = 0) => { const d = new Date(today); d.setMonth(d.getMonth() + n); return MONTHS[d.getMonth()]; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const eur = (n) => lang === "en" ? "€" + n.toLocaleString("en-GB") : n.toLocaleString("fi-FI").replace(/[  \s]/g, " ") + " €";
  const pct = (s) => (lang === "en" ? s.replace(",", ".").replace(" %", "%") : s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hello = () => {
    const h = today.getHours();
    return L(h < 11 ? { sv: "God morgon", fi: "Huomenta", en: "Good morning" } : h < 18 ? { sv: "Hej", fi: "Hei", en: "Hi" } : { sv: "God kväll", fi: "Hyvää iltaa", en: "Good evening" });
  };
  const route = (id) => routes[id] || "#";
  const toast = (app, msg) => {
    const old = app.querySelector(".toast"); if (old) old.remove();
    const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    app.appendChild(t); setTimeout(() => t.remove(), 2600);
  };
  return { lang, L, today, dm, weekday, onDay, nextWeekday, month, cap, eur, pct, esc, hello, route, toast };
})();

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = WF.lang;
  const header = document.querySelector(".site-header");
  const btn = document.querySelector(".menu-btn");
  if (header && btn) btn.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  // Close the mobile menu when a link in it is tapped.
  if (header) header.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => { header.classList.remove("open"); if (btn) btn.setAttribute("aria-expanded", "false"); }));

  // Reveal on scroll. Only blocks below the first screen get the dimmed start state, so nothing
  // visible on load ever moves, and a block is never hidden while it waits.
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && "IntersectionObserver" in window) {
    const sel = ".section-head, .gets > *, .tiers > *, .packages > *, .flow-step, .results > *, .team > *, .how li, .faq, .cta-band, .calc, .custom-strip, .timeline li, .logo-grid";
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(sel).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const sibs = el.parentElement ? [...el.parentElement.children] : [];
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 4) * 70 + "ms";
      el.classList.add("rv");
      io.observe(el);
    });
  }

  // Booking form: small companies are offered the self-serve start, large ones a time with Felix directly.
  document.querySelectorAll("form[data-route-form]").forEach((form) => {
    const size = form.querySelector("[name=size]");
    const small = form.querySelector("[data-route-hint=small]"), big = form.querySelector("[data-route-hint=big]");
    const slots = form.querySelector(".slots"), slotInput = form.querySelector("[name=slot]");
    if (slots) {
      const out = []; let n = 1;
      while (out.length < 3) { const d = new Date(WF.today); d.setDate(d.getDate() + n); if (d.getDay() % 6 !== 0) out.push(n); n++; }
      slots.innerHTML = out.map((o) => ["09:00", "13:30"].map((t) => {
        const label = `${WF.cap(WF.weekday(o))} ${WF.dm(o)} · ${t}`;
        return `<button type="button" class="chip" aria-pressed="false" data-slot="${label}">${label}</button>`;
      }).join("")).join("");
      slots.addEventListener("click", (e) => {
        const b = e.target.closest("[data-slot]"); if (!b) return;
        slots.querySelectorAll("[data-slot]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        if (slotInput) slotInput.value = b.dataset.slot;
      });
    }
    const update = () => {
      const v = size ? size.value : "";
      if (small) small.hidden = v !== "s";
      if (big) big.hidden = !(v === "l" || v === "xl");
    };
    if (size) size.addEventListener("change", update);
    update();
  });

  document.querySelectorAll("form[data-concept-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const done = form.querySelector(".form-done");
      if (done) { done.hidden = false; done.focus(); }
    });
  });
});
