/* Outreach (Prospektering) demo: one lead from signal to booked meeting. In-memory only. Strings are {sv, fi, en}. */
(() => {
  const { L, dm, weekday, onDay, nextWeekday, cap, pct, toast, icon, frame, page, card, demoBar, guide } = window.WF;
  const NAV = L({ sv: ["Kampanjer", "Svarskö", "Avsändarkonton", "Inställningar"], fi: ["Kampanjat", "Vastausjono", "Lähettäjätilit", "Asetukset"], en: ["Campaigns", "Reply queue", "Sending accounts", "Outreach settings"] });
  const STEPS = L({ sv: ["Signal", "Första mejlet", "Skickat", "Svar", "Ditt godkännande", "Möte bokat"], fi: ["Signaali", "Ensimmäinen viesti", "Lähetetty", "Vastaus", "Hyväksyntäsi", "Tapaaminen varattu"], en: ["Signal", "First email", "Sent", "Reply", "Your approval", "Meeting booked"] });
  const fresh = () => ({ step: 0, approved: false, playing: false });
  const head = (h, p) => `<div class="ax-step-h"><b>${h}</b><p>${p}</p></div>`;
  const FROM = L({ sv: "Från", fi: "Lähettäjä", en: "From" }), TO = L({ sv: "Till", fi: "Vastaanottaja", en: "To" }), SUBJ = L({ sv: "Ämne", fi: "Aihe", en: "Subject" });
  const subject = L({ sv: "Bergvärmen på Solgläntan", fi: "Solgläntanin maalämpö", en: "Ground-source heating at Solgläntan" });
  const re = L({ sv: "Sv:", fi: "Vs:", en: "Re:" });

  function mount(root) {
    let S = fresh();
    let timer = null, lastStep = -1, renders = 0;
    const thu = nextWeekday(4);

    function pane() {
      if (S.step === 0) return `
        ${head(L({ sv: "Allt börjar med en signal", fi: "Kaikki alkaa signaalista", en: "It starts with a signal" }), L({ sv: "Säljradarn hittade det här i morse. Prospekteringen tar över därifrån.", fi: "Myyntitutka löysi tämän aamulla. Prospektointi jatkaa siitä.", en: "Sales Radar found this this morning. Outreach takes it from there." }))}
        <div class="lead"><div class="who"><b>Bostads Ab Solgläntan</b><span class="tag">${L({ sv: "Bygglov", fi: "Rakennuslupa", en: "Building permit" })}</span><span class="tag">${L({ sv: "Österbotten", fi: "Pohjanmaa", en: "Ostrobothnia" })}</span><span class="tag good">${L({ sv: "Ny", fi: "Uusi", en: "New" })}</span></div><div></div>
          <div class="sig"><q>${L({ sv: "Bygglov för bergvärme beviljat för ett hus från 1974", fi: "Maalämmölle myönnetty rakennuslupa, talo vuodelta 1974", en: "Permit granted for ground-source heating in a 1974 building" })}</q><small>${L({ sv: "Kommunens bygglovsbeslut", fi: "Kunnan rakennuslupapäätös", en: "Municipal permit decision" })} · ${dm(-2)} · ${L({ sv: "ägare", fi: "vastuu", en: "owner" })} Mikael</small></div></div>
        <div class="row act-row"><div><div class="t">${L({ sv: "Kontaktperson: Karin Wiik, disponent", fi: "Yhteyshenkilö: Karin Wiik, isännöitsijä", en: "Contact: Karin Wiik, property manager" })}</div><div class="m">${L({ sv: "Från bolagets webbplats", fi: "Yhtiön verkkosivuilta", en: "From the company's website" })} · karin.wiik@solglantan.example</div></div></div>`;
      if (S.step === 1) return `
        ${head(L({ sv: "Ett personligt första mejl", fi: "Henkilökohtainen ensimmäinen viesti", en: "A personal first email" }), L({ sv: "Den blå meningen kommer från signalen. Resten är din egen mall, som du godkänt en gång för hela kampanjen.", fi: "Sininen lause tulee signaalista. Loput on oma pohjasi, jonka hyväksyt kerran koko kampanjalle.", en: "The blue sentence comes from the signal. The rest is your own template, approved once for the whole campaign." }))}
        <div class="mail"><div class="mail-head"><div><span>${FROM}</span> Mikael Nyström &lt;mikael@kvarnvik-varme.example&gt;</div><div><span>${TO}</span> karin.wiik@solglantan.example</div><div><span>${SUBJ}</span> <b>${subject}</b></div></div>
        <div class="mail-body">${L({
          sv: `<p>Hej Karin,</p><p><mark>Jag såg att Solgläntan fick bygglov för bergvärme i förra veckan.</mark> Grattis, det brukar löna sig snabbt i ett hus från 70-talet.</p><p>Vi har installerat bergvärme i elva bostadsbolag i Vasaregionen de senaste två åren och sköter borrning, installation och tillstånden.</p><p>Passar det att jag ringer en kvart på ${weekday(thu)}?</p><p>Hälsningar<br>Mikael Nyström<br>Kvarnvik Värme &amp; Sol Ab</p>`,
          fi: `<p>Hei Karin,</p><p><mark>Huomasin, että Solgläntan sai viime viikolla rakennusluvan maalämmölle.</mark> Onnittelut, 1970-luvun talossa se maksaa itsensä yleensä nopeasti takaisin.</p><p>Olemme asentaneet maalämmön yhteentoista taloyhtiöön Vaasan seudulla kahden viime vuoden aikana ja hoidamme porauksen, asennuksen ja luvat.</p><p>Sopiiko, että soitan vartin ${onDay(thu)}?</p><p>Terveisin<br>Mikael Nyström<br>Kvarnvik Värme &amp; Sol Ab</p>`,
          en: `<p>Hi Karin,</p><p><mark>I saw that Solgläntan was granted a permit for ground-source heating last week.</mark> Congratulations, in a 1970s building it usually pays for itself quickly.</p><p>We've installed ground-source heating in eleven housing companies in the Vaasa region over the past two years, and we handle the drilling, installation and permits.</p><p>Would it suit you if I called for fifteen minutes on ${weekday(thu)}?</p><p>Best regards<br>Mikael Nyström<br>Kvarnvik Värme &amp; Sol Ab</p>` })}</div></div>`;
      if (S.step === 2) return `
        ${head(L({ sv: "Skickat från en uppvärmd inkorg", fi: "Lähetetty lämmitetystä postilaatikosta", en: "Sent from a warmed-up inbox" }), L({ sv: "Mejlen går från dina egna, separata domäner. Din vanliga e-post påverkas aldrig.", fi: "Viestit lähtevät omista, erillisistä verkkotunnuksistasi. Tavallinen sähköpostisi ei kärsi koskaan.", en: "The emails go from your own separate domains. Your normal email is never affected." }))}
        <div class="table-scroll"><table class="mini-table"><tbody>
          <tr><td>${L({ sv: "Skickat", fi: "Lähetetty", en: "Sent" })}</td><td>${L({ sv: `${weekday(-1)} ${dm(-1)} kl. 08:12`, fi: `${weekday(-1)} ${dm(-1)} klo 8.12`, en: `${weekday(-1)} ${dm(-1)} at 08:12` })}</td></tr>
          <tr><td>${L({ sv: "Inkorg", fi: "Postilaatikko", en: "Inbox" })}</td><td>mikael@kvarnvik-varme.example · ${L({ sv: "3 av 6 · uppvärmd i 40 dagar", fi: "3/6 · lämmitetty 40 päivää", en: "3 of 6 · warmed up for 40 days" })}</td></tr>
          <tr><td>${L({ sv: "Uppföljning", fi: "Jatkoviesti", en: "Follow-up" })}</td><td>${L({ sv: "Planerad om 4 dagar om inget svar kommer", fi: "Ajastettu 4 päivän päähän, jos vastausta ei tule", en: "Scheduled in 4 days if no reply comes" })}</td></tr>
          <tr><td>${L({ sv: "Avregistrering", fi: "Peruutukset", en: "Unsubscribes" })}</td><td>${L({ sv: "Respekteras automatiskt i alla kampanjer", fi: "Huomioidaan automaattisesti kaikissa kampanjoissa", en: "Honoured automatically in every campaign" })}</td></tr></tbody></table></div>`;
      if (S.step === 3) return `
        ${head(L({ sv: "Svaret kommer och sorteras", fi: "Vastaus tulee ja lajitellaan", en: "The reply arrives and is sorted" }), L({ sv: "Varje svar sorteras innan någon behöver läsa det. Bara intresserade svar hamnar hos säljaren.", fi: "Jokainen vastaus lajitellaan ennen kuin kenenkään tarvitsee lukea sitä. Vain kiinnostuneet vastaukset päätyvät myyjälle.", en: "Every reply is sorted before anyone has to read it. Only interested replies reach the salesperson." }))}
        <div class="mail"><div class="mail-head"><div><span>${FROM}</span> Karin Wiik</div><div><span>${SUBJ}</span> ${re} ${subject}</div></div>
        <div class="mail-body">${L({
          sv: `<p>Hej Mikael!</p><p>Vi har faktiskt inte valt leverantör än. ${cap(weekday(thu))} efter kl. 13 passar bra.</p><p>Hälsningar<br>Karin</p>`,
          fi: `<p>Hei Mikael!</p><p>Emme ole vielä valinneet toimittajaa. ${cap(onDay(thu))} kello 13 jälkeen sopii hyvin.</p><p>Terveisin<br>Karin</p>`,
          en: `<p>Hi Mikael,</p><p>We haven't chosen a supplier yet, actually. ${weekday(thu)} after 1 pm works well.</p><p>Best<br>Karin</p>` })}</div></div>
        <div class="classes">${L({ sv: ["Intresserad", "Inte nu", "Fel person", "Avregistrera"], fi: ["Kiinnostunut", "Ei nyt", "Väärä henkilö", "Peruuta"], en: ["Interested", "Not now", "Wrong person", "Unsubscribe"] }).map((c, i) => `<span class="tag${i ? "" : " good"}">${c}</span>`).join("")}</div>`;
      if (S.step === 4) return `
        ${head(L({ sv: "Ett svarsutkast väntar på dig", fi: "Vastausluonnos odottaa sinua", en: "A reply draft is waiting for you" }), L({ sv: "Inget svar går iväg förrän någon i ditt team har godkänt det.", fi: "Mikään vastaus ei lähde ennen kuin joku teiltä on hyväksynyt sen.", en: "No reply goes out until someone on your team has approved it." }))}
        <div class="mail"><div class="mail-head"><div><span>${TO}</span> Karin Wiik</div><div><span>${SUBJ}</span> ${re} ${subject}</div></div>
        <div class="mail-body">${L({
          sv: `<p>Tack Karin!</p><p>Jag ringer på ${weekday(thu)} ${dm(thu)} kl. 13.30. Om en annan tid passar bättre kan du välja den här: <u>boka.kvarnvik.example</u></p><p>Hälsningar<br>Mikael</p>`,
          fi: `<p>Kiitos Karin!</p><p>Soitan ${onDay(thu)} ${dm(thu)} klo 13.30. Jos jokin muu aika sopii paremmin, voit valita sen täältä: <u>varaa.kvarnvik.example</u></p><p>Terveisin<br>Mikael</p>`,
          en: `<p>Thanks Karin!</p><p>I'll call on ${weekday(thu)} ${dm(thu)} at 1:30 pm. If another time suits you better, you can pick one here: <u>book.kvarnvik.example</u></p><p>Best<br>Mikael</p>` })}</div></div>
        <div class="btn-row">${S.approved ? `<span class="tag good">${L({ sv: "Godkänt och skickat · Demo: inget skickades", fi: "Hyväksytty ja lähetetty · Demo: mitään ei lähetetty", en: "Approved and sent · Demo: nothing was sent" })}</span>` : `<button type="button" class="act" data-a="approve">${L({ sv: "Godkänn och skicka", fi: "Hyväksy ja lähetä", en: "Approve and send" })}</button><button type="button" class="ghost" data-a="edit">${L({ sv: "Redigera", fi: "Muokkaa", en: "Edit" })}</button>`}</div>`;
      return S.approved ? `
        ${head(L({ sv: "Mötet är bokat", fi: "Tapaaminen on varattu", en: "The meeting is booked" }), L({ sv: "Affären skapades i CRM med hela tråden och en sammanfattning. Mikael ser samtalet överst i sin Company Brain.", fi: "Kauppa luotiin CRM:ään koko viestiketjun ja tiivistelmän kanssa. Mikael näkee soiton Company Brainissa listansa kärjessä.", en: "The deal was created in the CRM with the full thread and a summary. Mikael sees the call at the top of his Company Brain." }))}
        <div class="event"><div class="day">${weekday(thu).slice(0, 3)}<b>${String(dm(thu)).match(/\d+/)[0]}</b></div><div><b>${L({ sv: "13:30 Samtal med Karin Wiik", fi: "13.30 Puhelu: Karin Wiik", en: "1:30 pm Call with Karin Wiik" })}</b><div class="muted small">Bostads Ab Solgläntan · ${L({ sv: "bergvärme", fi: "maalämpö", en: "ground-source heating" })} · 15 min</div></div></div>
        <div class="row done-row"><div><div class="t">${L({ sv: "Ny affär i Pipedrive: Bostads Ab Solgläntan", fi: "Uusi kauppa Pipedrivessa: Bostads Ab Solgläntan", en: "New deal in Pipedrive: Bostads Ab Solgläntan" })}</div><div class="m">${L({ sv: "Ny kontakt · källa: Säljradar + Prospektering · ägare Mikael Nyström", fi: "Uusi kontakti · lähde: Myyntitutka + Prospektointi · vastuu Mikael Nyström", en: "New contact · source: Sales Radar + Outreach · owner Mikael Nyström" })}</div></div><div class="row-actions"><span class="tag good">${L({ sv: "Skapad", fi: "Luotu", en: "Created" })}</span></div></div>`
        : `<div class="placeholder">${L({ sv: "Mötet bokas först när svaret är godkänt.", fi: "Tapaaminen varataan vasta, kun vastaus on hyväksytty.", en: "The meeting is booked only once the reply is approved." })} <button type="button" class="ghost" data-a="go" data-v="4">${L({ sv: "Gå till utkastet", fi: "Siirry luonnokseen", en: "Go to the draft" })}</button></div>`;
    }

    function render() {
      const meetings = 3 + (S.approved ? 1 : 0);
      const swap = S.step !== lastStep; lastStep = S.step;
      const nav = [
        { id: "campaigns", label: NAV[0], icon: "send", current: true },
        { label: NAV[1], icon: "inbox", off: true },
        { label: NAV[2], icon: "mail", off: true },
        { label: NAV[3], icon: "sliders-horizontal", off: true },
      ];
      const body = `
          ${page(L({ sv: "Bergvärme, Österbotten", fi: "Maalämpö, Pohjanmaa", en: "Ground-source heating, Ostrobothnia" }), L({ sv: "Kampanj från Säljradarns signaler · 6 inkorgar · cirka 120 mejl om dagen", fi: "Kampanja Myyntitutkan signaaleista · 6 postilaatikkoa · noin 120 viestiä päivässä", en: "Campaign from Sales Radar signals · 6 inboxes · about 120 emails a day" }), `<span class="tag good">${L({ sv: "Aktiv", fi: "Käynnissä", en: "Active" })}</span>`)}
          <div class="ax-split">
            <div class="ax-col">
              <div class="steps" role="tablist">${STEPS.map((s, i) => `<button type="button" role="tab" data-a="go" data-v="${i}" aria-current="${S.step === i}" class="${i < S.step ? "past" : ""}"><i></i><span class="lbl">${i + 1}. ${s}</span></button>`).join("")}</div>
              <section class="ax-card ax-pane">${pane()}</section>
              <div class="btn-row"><button type="button" class="ghost" data-a="prev" ${S.step === 0 ? "disabled" : ""}>${icon("arrow-left")}${L({ sv: "Föregående", fi: "Edellinen", en: "Previous" })}</button><button type="button" class="act" data-a="next" ${S.step === 5 || (S.step === 4 && !S.approved) ? "disabled" : ""}>${L({ sv: "Nästa steg", fi: "Seuraava vaihe", en: "Next step" })}${icon("arrow-right")}</button></div>
            </div>
            <div class="ax-col">
              ${card(L({ sv: "Kampanjen den här veckan", fi: "Kampanja tällä viikolla", en: "Campaign this week" }), "", `<div class="stat-list">
                <div><span>${L({ sv: "Skickade mejl", fi: "Lähetetyt viestit", en: "Emails sent" })}</span><b>584</b></div>
                <div><span>${L({ sv: "Svar", fi: "Vastaukset", en: "Replies" })}</span><b>27 (${pct("4,6 %")})</b></div>
                <div><span>${L({ sv: "Intresserade", fi: "Kiinnostuneet", en: "Interested" })}</span><b>6</b></div>
                <div><span>${L({ sv: "Möten bokade", fi: "Varatut tapaamiset", en: "Meetings booked" })}</span><b>${meetings}</b></div>
              </div>`, "ax-card--side")}
              ${card(L({ sv: "Inkorgar", fi: "Postilaatikot", en: "Inboxes" }), "", `<div class="stat-list"><div><span>${L({ sv: "Friska", fi: "Kunnossa", en: "Healthy" })}</span><b>${L({ sv: "6 av 6", fi: "6/6", en: "6 of 6" })}</b></div><div><span>${L({ sv: "Studsar", fi: "Palautuneet", en: "Bounces" })}</span><b>${pct("0,4 %")}</b></div></div>`, "ax-card--side")}
            </div>
          </div>`;
      const top = swap ? 0 : window.WF.scrollOf(root);
      root.innerHTML = demoBar(`<button type="button" class="ghost" data-a="play">${icon(S.playing ? "pause" : "play")}${S.playing ? L({ sv: "Pausa", fi: "Tauko", en: "Pause" }) : L({ sv: "Spela upp", fi: "Toista", en: "Play" })}</button><button type="button" class="ghost" data-a="reset">${icon("rotate-ccw")}${L({ sv: "Återställ", fi: "Palauta", en: "Reset" })}</button>`)
        + frame({ product: "reach", productName: L({ sv: "Prospektering", fi: "Prospektointi", en: "Outreach" }), path: "/o/kvarnvik/reach", nav, account: { initials: "MN", name: "Mikael Nyström", role: L({ sv: "Säljare · Användare", fi: "Myyjä · Käyttäjä", en: "Sales · User" }) }, body })
        + guide({ note: window.WF_HOLD
          ? L({ sv: "Siffrorna är exempel. Vi lovar ingen mängd möten.", fi: "Luvut ovat esimerkkejä. Emme lupaa tiettyä määrää tapaamisia.", en: "The numbers are examples. We don't promise a number of meetings." })
          : L(null) });
      window.WF.restoreScroll(root, top);
      if (swap && renders++) root.querySelector(".app-main")?.classList.add("swap");
    }

    function stop() { S.playing = false; clearInterval(timer); timer = null; }
    function play() {
      S.playing = true;
      timer = setInterval(() => {
        if (S.step === 4 && !S.approved) { stop(); render(); toast(root, L({ sv: "Nu är det din tur: godkänn svaret", fi: "Nyt on sinun vuorosi: hyväksy vastaus", en: "Your turn: approve the reply" })); return; }
        if (S.step >= 5) { stop(); render(); return; }
        S.step++; render();
      }, 3200);
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b || !root.contains(b)) return;
      const a = b.dataset.a;
      if (a === "reset") { stop(); S = fresh(); render(); toast(root, L({ sv: "Demon är återställd", fi: "Demo palautettu alkuun", en: "The demo has been reset" })); return; }
      if (a === "play") { S.playing ? stop() : play(); }
      else if (a === "go") { stop(); S.step = Number(b.dataset.v); }
      else if (a === "prev") { stop(); S.step = Math.max(0, S.step - 1); }
      else if (a === "next") { stop(); S.step = Math.min(5, S.step + 1); }
      else if (a === "approve") { S.approved = true; render(); setTimeout(() => { S.step = 5; render(); }, 900); return; }
      else if (a === "edit") { toast(root, L({ sv: "I den riktiga versionen redigerar du texten här", fi: "Oikeassa versiossa muokkaat tekstiä tässä", en: "In the real version you edit the text here" })); return; }
      render();
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-demo='reach']").forEach(mount));
})();
