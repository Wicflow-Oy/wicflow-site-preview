/* Chat answers for the Wicflow OS variant (build.py --os): one product in three tiers. Loaded before chat.js, which
   applies these over its own answers. Draft prices. */
window.WF_CHAT_OVERRIDES = {
  pris: {
    a: { sv: "Wicflow OS har tre nivåer. Lite kostar 490 € i månaden plus 49 € per fullanvändare, Standard 990 € plus 89 € och Max 2 990 € plus 129 €. Lättanvändare, som främst använder mobilappen, kostar 9–15 €. Uppstarten är en engångsavgift från 2 900 € beroende på företagets storlek. Alla priser är exklusive moms.",
         fi: "Wicflow OS:ssä on kolme tasoa. Lite maksaa 490 € kuukaudessa ja 49 € / täysi käyttäjä, Standard 990 € ja 89 € ja Max 2 990 € ja 129 €. Kevytkäyttäjät, jotka käyttävät lähinnä mobiilisovellusta, maksavat 9–15 €. Käyttöönotto on kertamaksu alkaen 2 900 € yrityksen koon mukaan. Hinnat alv 0 %.",
         en: "Wicflow OS has three tiers. Lite is €490 a month plus €49 per full user, Standard €990 plus €89 and Max €2,990 plus €129. Light users, who mainly use the mobile app, cost €9 to €15. Setup is a one-time fee from €2,900, depending on company size. All prices exclude VAT." },
    link: [{ sv: "Se priserna", fi: "Katso hinnat", en: "See pricing" }, "pricing"], next: ["paket", "custom", "demo"] },
  paket: {
    addKeys: ["nivå", "nivåer", "taso", "tasot", "tier", "lite", "standard"],
    label: { sv: "Vilken nivå passar oss?", fi: "Mikä taso sopii meille?", en: "Which tier suits us?" },
    a: { sv: "Lite samlar hela teamet i ett system: Company Brain, uppgifter, arbetstid och appen. Standard lägger till Säljradarn och Prospekteringen för fler affärer. Max är för större företag och koncerner, med alla system, de mest avancerade tilläggen och en egen ansvarig hos oss.",
         fi: "Lite kokoaa koko tiimin yhteen järjestelmään: Company Brain, tehtävät, työaika ja sovellus. Standard lisää Myyntitutkan ja Prospektoinnin lisäkauppoja varten. Max on suuremmille yrityksille ja konserneille: kaikki järjestelmät, edistyneimmät lisäosat ja oma vastuuhenkilö meiltä.",
         en: "Lite gets the whole team into one system: Company Brain, tasks, working time and the app. Standard adds Sales Radar and Outreach for more deals. Max is for larger companies and groups, with every system, the most advanced plugins and a named contact at Wicflow." },
    link: [{ sv: "Jämför nivåerna", fi: "Vertaa tasoja", en: "Compare the tiers" }, "pricing"], next: ["tillvaxt", "demo"] },
  tillvaxt: {
    addKeys: ["max"],
    label: { sv: "Vad ingår i Max?", fi: "Mitä Maxiin kuuluu?", en: "What's in Max?" },
    a: { sv: "Max är Wicflow OS i full skala: prospektering och sociala medier på flera marknader, Company Brain för hela organisationen, de mest avancerade tilläggen, en ny webbplats med AI-chatt och en ansvarig hos oss med kvartalsgenomgång. AI-användning upp till 5 000 € i månaden ingår.",
         fi: "Max on Wicflow OS täydessä laajuudessa: prospektointi ja some useilla markkinoilla, Company Brain koko organisaatiolle, edistyneimmät lisäosat, uudet verkkosivut tekoälychatilla ja oma vastuuhenkilö neljännesvuosikatsauksineen. Tekoälyn käyttöä sisältyy jopa 5 000 € kuukaudessa.",
         en: "Max is Wicflow OS at full scale: Outreach and social media across several markets, Company Brain for the whole organisation, the most advanced plugins, a new website with an AI chat and a named contact with a quarterly review. AI use up to €5,000 a month is included." },
    link: [{ sv: "Läs om Max", fi: "Lue Maxista", en: "Read about Max" }, "growth"] },
  brain: {
    a: { sv: "Company Brain är kärnan i Wicflow OS och ingår i alla nivåer. Den läser dina mejl, affärer, kalendrar och fakturor, visar varje person vad som behöver göras i dag och svarar på frågor om verksamheten. Vi sätter upp den med tillägg från vårt bibliotek, och den körs i EU.",
         fi: "Company Brain on Wicflow OS:n ydin ja sisältyy kaikkiin tasoihin. Se lukee sähköpostisi, kauppasi, kalenterisi ja laskusi, näyttää jokaiselle, mitä tänään pitää tehdä, ja vastaa kysymyksiin yrityksestäsi. Otamme sen käyttöön lisäosakirjastomme työkaluilla, ja se toimii EU:ssa.",
         en: "Company Brain is the core of Wicflow OS and is in every tier. It reads your email, deals, calendars and invoices, shows each person what needs doing today and answers questions about your business. We set it up with plugins from our library, and it runs in the EU." } },
  social: {
    a: { sv: "Ja, sociala medier är en del av Prospekteringen i Max. Inläggen skrivs utifrån dina nyheter och kundcase, du godkänner dem på ett ställe och de publiceras i alla konton. Kommentarer och meddelanden svarar du på själv.",
         fi: "Kyllä, some on osa Prospektointia Maxissa. Julkaisut kirjoitetaan uutistesi ja asiakastarinoidesi pohjalta, hyväksyt ne yhdessä paikassa, ja ne julkaistaan kaikilla tileillä. Kommentteihin ja viesteihin vastaat itse.",
         en: "Yes, social media is part of Outreach in Max. Posts are written from your news and customer stories, you approve them in one place, and they're published to every account. You reply to comments and messages yourselves." } },
  custom: {
    a: { sv: "Ja. Det du behöver bygger vi som ett tillägg till Wicflow OS, så det uppdateras tillsammans med allt annat. Vi går igenom behovet tillsammans och ger ett fast pris i offerten.",
         fi: "Kyllä. Rakennamme tarvitsemasi lisäosana Wicflow OS:ään, joten se päivittyy kaiken muun mukana. Käymme tarpeen läpi yhdessä ja annamme kiinteän hinnan tarjouksessa.",
         en: "Yes. We build what you need as a plugin for Wicflow OS, so it's updated together with everything else. We go through the need together and give you a fixed price in the quote." } },
};
