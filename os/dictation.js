/* Voice control and dictation, shown at work (the Company Brain plugin library). Two short spoken commands loop:
   1. "Write a message to Anders and have it ready for me to review" becomes a written email waiting for review;
   2. "Approve the Strandgården quote and remind Sara about Lövdal" becomes two actions that tick off.
   The microphone pulses, a waveform moves and the words appear as they are said. Silent by default; when the
   recordings exist (assets/audio/dictation-a-<lang>.mp3 and -b-<lang>.mp3, listed by the build in window.WF_AUDIO)
   a "Play with sound" button appears and the words follow the audio. Runs only while visible; still with reduced
   motion. Strings are {sv, fi, en}; WF.L picks the page language. Made-up company and people. */
(() => {
  const { L, lang, asset } = window.WF;
  const T = {
    listening: L({ sv: "Lyssnar …", fi: "Kuuntelee …", en: "Listening …" }),
    writing: L({ sv: "Skriver meddelandet …", fi: "Kirjoittaa viestiä …", en: "Writing the message …" }),
    review: L({ sv: "Klart för granskning", fi: "Valmis tarkistettavaksi", en: "Ready for your review" }),
    done: L({ sv: "Klart. Det här gjorde jag:", fi: "Valmis. Tein nämä:", en: "Done. Here's what I did:" }),
    send: L({ sv: "Skicka", fi: "Lähetä", en: "Send" }),
    sound: L({ sv: "Spela med ljud", fi: "Toista äänen kanssa", en: "Play with sound" }),
    stop: L({ sv: "Stoppa ljudet", fi: "Lopeta ääni", en: "Stop the sound" }),
    note: L({ sv: "Exempel med påhittade data", fi: "Esimerkki keksityllä datalla", en: "Example with made-up data" }),
    // Command 1: dictation.
    a: L({ sv: "Skriv ett meddelande till Anders och ha det klart för granskning.",
           fi: "Kirjoita viesti Andersille ja jätä se minulle tarkistettavaksi.",
           en: "Write a message to Anders and have it ready for me to review." }),
    to: L({ sv: "Till: Anders Holm, Ekby skola", fi: "Vastaanottaja: Anders Holm, Ekby skola", en: "To: Anders Holm, Ekby skola" }),
    subject: L({ sv: "Tack för mötet", fi: "Kiitos tapaamisesta", en: "Thanks for the meeting" }),
    mail: L({ sv: "Hej Anders,\ntack för mötet i dag. Som utlovat skickar jag offerten på värmepumparna på fredag.\n\nVänliga hälsningar,\nAnna",
              fi: "Hei Anders,\nkiitos tämänpäiväisestä tapaamisesta. Kuten lupasin, lähetän lämpöpumppujen tarjouksen perjantaina.\n\nYstävällisin terveisin,\nAnna",
              en: "Hi Anders,\nthanks for the meeting today. As promised, I'll send the quote for the heat pumps on Friday.\n\nBest regards,\nAnna" }),
    // Command 2: control.
    b: L({ sv: "Godkänn offerten till Strandgården och påminn Sara om Lövdal.",
           fi: "Hyväksy Strandgårdenin tarjous ja muistuta Saraa Lövdalista.",
           en: "Approve the Strandgården quote and remind Sara about Lövdal." }),
    actions: L({ sv: ["Offerten godkänd och skickad till Strandgården", "Sara påmind om Lövdal Lantbruk"],
                 fi: ["Tarjous hyväksytty ja lähetetty Strandgårdenille", "Saraa muistutettu Lövdal Lantbrukista"],
                 en: ["Quote approved and sent to Strandgården", "Sara reminded about Lövdal Lantbruk"] }),
  };
  const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const MIC = svg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>');
  const CHECK = svg('<path d="M20 6 9 17l-5-5"/>');
  const PLAY = svg('<polygon points="6 3 20 12 6 21 6 3"/>');
  const ACTION_ICONS = [svg('<path d="M20 6 9 17l-5-5"/>'), svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>')];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const recordings = ["a", "b"].map((s) => `dictation-${s}-${lang}`);
  const hasAudio = recordings.every((r) => (window.WF_AUDIO || []).includes(r));

  function mount(root) {
    root.innerHTML = `
      <div class="dc-card">
        <div class="dc-top">
          <span class="dc-mic">${MIC}<i></i><i></i></span>
          <div class="dc-who"><b data-x="state">${T.listening}</b><small>Company Brain</small></div>
          <button type="button" class="dc-sound" data-x="sound"${hasAudio ? "" : " hidden"}>${PLAY}<span>${T.sound}</span></button>
        </div>
        <div class="dc-wave" aria-hidden="true">${Array.from({ length: 36 }, (_, i) => `<i style="--d:${(0.35 + ((i * 7) % 11) / 20).toFixed(2)}s;--h:${(0.3 + ((i * 13) % 10) / 14).toFixed(2)}"></i>`).join("")}</div>
        <p class="dc-text" data-x="text" aria-live="off"></p>
        <div class="dc-out" data-x="out"></div>
      </div>
      <span class="dc-note">${T.note}</span>`;
    const $ = (k) => root.querySelector(`[data-x="${k}"]`);
    const card = root.querySelector(".dc-card");
    let timers = [], running = false, audio = null, withSound = false, visible = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };

    function listen(start) {
      at(start, () => { card.classList.add("is-listening"); card.classList.remove("is-done"); $("state").textContent = T.listening; $("text").textContent = ""; $("out").innerHTML = ""; });
    }
    function words(text, start, perWord) {
      const list = text.split(" ");
      list.forEach((w, i) => at(start + i * perWord, () => {
        $("text").innerHTML = list.slice(0, i).map(esc).join(" ") + (i ? " " : "") + `<span class="is-new">${esc(w)}</span>`;
      }));
      at(start + list.length * perWord, () => { $("text").textContent = text; });
      return start + list.length * perWord;
    }
    const mailHtml = () => `<div class="dc-mail"><div class="dc-mail-h"><span>${T.to}</span><b>${T.subject}</b></div><div class="dc-mail-b" data-x="mailbody"></div><div class="dc-mail-f"><span class="dc-ready" data-x="ready">${T.writing}</span><span class="dc-send">${T.send}</span></div></div>`;
    const actionsHtml = (done) => `<ul class="dc-actions">${T.actions.map((t, i) => `<li data-a="${i}" class="${done ? "is-in is-done" : ""}"><span class="dc-ic">${ACTION_ICONS[i]}</span><span>${t}</span><span class="dc-ok">${CHECK}</span></li>`).join("")}</ul>`;

    // 1. Dictation: the message is written and left for review.
    function sceneA(start, perWord) {
      listen(start);
      const end = words(T.a, start + 250, perWord);
      at(end + 250, () => { card.classList.remove("is-listening"); card.classList.add("is-done"); $("state").textContent = T.writing; $("out").innerHTML = mailHtml(); });
      const steps = 28;
      for (let i = 1; i <= steps; i++) at(end + 450 + i * 45, () => { const el = $("mailbody"); if (el) el.textContent = T.mail.slice(0, Math.round((T.mail.length * i) / steps)); });
      at(end + 450 + steps * 45 + 150, () => { $("state").textContent = T.review; const r = $("ready"); if (r) { r.textContent = T.review; r.classList.add("is-ok"); } });
      return end + 450 + steps * 45 + 2800;
    }
    // 2. Control: two actions done and ticked off.
    function sceneB(start, perWord) {
      listen(start);
      const end = words(T.b, start + 250, perWord);
      at(end + 250, () => { card.classList.remove("is-listening"); card.classList.add("is-done"); $("state").textContent = T.done; $("out").innerHTML = actionsHtml(false); });
      T.actions.forEach((_, i) => {
        at(end + 500 + i * 650, () => root.querySelector(`[data-a="${i}"]`)?.classList.add("is-in"));
        at(end + 950 + i * 650, () => root.querySelector(`[data-a="${i}"]`)?.classList.add("is-done"));
      });
      return end + 950 + (T.actions.length - 1) * 650 + 2600;
    }
    function loop() {
      clear();
      const afterA = sceneA(0, 320);
      const afterB = sceneB(afterA, 320);
      at(afterB, () => { if (running) loop(); });
    }
    function still() {
      clear(); card.classList.remove("is-listening"); card.classList.add("is-done");
      $("state").textContent = T.review; $("text").textContent = T.a; $("out").innerHTML = mailHtml();
      $("mailbody").textContent = T.mail; const r = $("ready"); r.textContent = T.review; r.classList.add("is-ok");
    }
    function start() { if (running || withSound) return; running = true; loop(); }
    function stop() { if (withSound) return; running = false; still(); }

    // With sound: play recording A, then B, with the words spread over each recording's length.
    function playWithSound() {
      if (withSound) { stopSound(); return; }
      running = false; clear(); withSound = true;
      $("sound").querySelector("span").textContent = T.stop;
      const [a, b] = recordings.map((r) => new Audio(asset(`assets/audio/${r}.mp3`)));
      const run = (el, scene, text, next) => {
        audio = el;
        const go = () => {
          const per = Math.max(180, ((el.duration || 5) * 1000 - 400) / text.split(" ").length);
          clear(); scene(0, per); el.currentTime = 0; el.play().catch(() => stopSound());
          el.onended = () => { if (!withSound) return; if (next) at(1800, next); else at(2600, stopSound); };
        };
        el.readyState >= 1 ? go() : (el.onloadedmetadata = go);
      };
      run(a, sceneA, T.a, () => run(b, sceneB, T.b, null));
    }
    function stopSound() {
      withSound = false; if (audio) { audio.pause(); audio = null; }
      $("sound").querySelector("span").textContent = T.sound;
      clear(); running = false; if (visible && !reduce) start(); else still();
    }
    $("sound").addEventListener("click", playWithSound);

    if (reduce) { still(); return; }
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible && !document.hidden ? start() : stop(); }, { threshold: 0.3 });
    io.observe(root);
    document.addEventListener("visibilitychange", () => (visible && !document.hidden ? start() : stop()));
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-dictation]").forEach(mount));
})();
