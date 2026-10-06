/* "Ask us" chat. Concept version: preset answers matched on keywords (all three languages pooled),
   no network calls. The real site would answer with AI from the same content. Strings are {sv, fi, en}. */
(() => {
  const { L, route } = window.WF;
  const KB = [
    { id: "pris", label: { sv: "Vad kostar det?", fi: "Mitä se maksaa?", en: "What does it cost?" },
      keys: ["pris", "kost", "betal", "avgift", "budget", "dyr", "€", "euro", "hinta", "maksa", "kustan", "price", "cost", "how much"],
      // Drafted prices only where the build shows them (null
        || { sv: "Varje produkt har ett startpris, och det slutliga priset beror på ditt företag och vad du behöver. Du får det skriftligt i offerten innan du bestämmer dig, och uppstarten ingår. Felix går gärna igenom det med dig i ett samtal på 30 minuter.",
             fi: "Jokaisella tuotteella on aloitushinta, ja lopullinen hinta riippuu yrityksestäsi ja tarpeistasi. Saat sen kirjallisena tarjouksessa ennen päätöstä, ja käyttöönotto sisältyy. Felix käy sen mielellään läpi kanssasi 30 minuutin puhelussa.",
             en: "Every product has a starting price, and the final price depends on your company and what you need. You get it in writing in the quote before you decide, and setup is included. Felix is happy to go through it with you in a 30-minute call." },
      link: [{ sv: "Se alla priser", fi: "Katso kaikki hinnat", en: "See all prices" }, "pricing"], next: ["pengar", "paket", "demo"] },
    { id: "paket", label: { sv: "Vilket paket passar oss?", fi: "Mikä paketti sopii meille?", en: "Which bundle suits us?" },
      keys: ["paket", "passar", "välja", "vilket", "paketti", "sopii", "package", "bundle", "which", "suit"],
      a: { sv: "Vill du ha fler affärer börjar du med Säljpaketet: Säljradarn och Prospekteringen. Vill du att fler kunder hittar dig passar Synlighetspaketet: webbplats, SEO/GEO och sociala medier. Wicflow OS Complete har allt, med Company Brain för hela företaget och systemet i ditt eget varumärke. Du kan också börja med en enda produkt.",
           fi: "Jos haluat lisää kauppoja, aloita Myyntipaketista: Myyntitutka ja Prospektointi. Jos haluat, että useampi asiakas löytää sinut, valitse Näkyvyyspaketti: verkkosivut, SEO/GEO ja some. Wicflow OS Complete sisältää kaiken, Company Brainin koko yritykselle ja järjestelmän yrityksesi omalla ilmeellä. Voit myös aloittaa yhdellä tuotteella.",
           en: "If you want more deals, start with the Sales bundle: Sales Radar and Outreach. If you want more customers to find you, the Visibility bundle covers the website, SEO/GEO and social media. Wicflow OS Complete has everything, with Company Brain for the whole company and the system in your own brand. You can also start with a single product." },
      link: [{ sv: "Jämför paketen", fi: "Vertaa paketteja", en: "Compare the bundles" }, "pricing"], next: ["tillvaxt", "demo"] },
    { id: "brain", label: { sv: "Vad är Company Brain?", fi: "Mikä on Company Brain?", en: "What is Company Brain?" },
      keys: ["brain", "hjärna", "intern", "vardag", "offert", "avtal", "rapport", "aivot", "sisäi", "tarjous", "sopimus", "raport", "internal", "quote", "contract", "report"],
      a: { sv: "Company Brain läser dina mejl, affärer, kalendrar och fakturor och visar varje person vad som behöver göras i dag. Du kan ställa frågor om verksamheten och sköta offerter, avtal och rapporter på samma ställe. Vi sätter upp den för ditt företag med verktyg från vårt bibliotek av tillägg, till exempel uppgifter, arbetstid och offerter, och den körs i EU. Den finns som demo på startsidan.",
           fi: "Company Brain lukee sähköpostisi, kauppasi, kalenterisi ja laskusi ja näyttää jokaiselle, mitä tänään pitää tehdä. Voit kysyä siltä yrityksestäsi ja hoitaa tarjoukset, sopimukset ja raportit samassa paikassa. Otamme sen käyttöön yrityksellesi lisäosakirjastomme työkaluilla, kuten tehtävillä, työajalla ja tarjouksilla, ja se toimii EU:ssa. Demo löytyy etusivulta.",
           en: "Company Brain reads your email, deals, calendars and invoices and shows each person what needs doing today. You can ask it about your business and handle quotes, contracts and reports in one place. We set it up for your business with tools from our plugin library, such as tasks, working time and quotes, and it runs in the EU. There's a demo on the homepage." },
      link: [{ sv: "Läs om Company Brain", fi: "Lue Company Brainista", en: "Read about Company Brain" }, "brain"], next: ["integration", "pris"] },
    { id: "radar", label: { sv: "Hur funkar Säljradarn?", fi: "Miten Myyntitutka toimii?", en: "How does Sales Radar work?" },
      keys: ["radar", "lead", "lista", "signal", "hitta kund", "scraper", "upphandling", "bygglov", "myynti", "tutka", "liidi", "hankinta", "rakennuslupa", "list", "tender", "permit"],
      a: { sv: "Säljradarn bevakar offentliga källor varje natt, till exempel upphandlingar, bygglov, nya företag, sociala medier och vilka som annonserar. På morgonen får säljarna en lista där varje namn har en orsak, är kollat mot ditt CRM och fördelat per region.",
           fi: "Myyntitutka seuraa julkisia lähteitä joka yö, esimerkiksi hankintoja, rakennuslupia, uusia yrityksiä, sosiaalista mediaa ja sitä, kuka mainostaa. Aamulla myyjät saavat listan, jossa jokaisella nimellä on syy, se on tarkistettu CRM:ää vasten ja jaettu alueittain.",
           en: "Sales Radar watches public sources every night, such as tenders, building permits, new companies, social media and who is advertising. In the morning the sales team gets a list where every name has a reason, is checked against your CRM and assigned by region." },
      link: [{ sv: "Läs om Säljradarn", fi: "Lue Myyntitutkasta", en: "Read about Sales Radar" }, "radar"], next: ["prospektering", "gdpr"] },
    { id: "prospektering", label: { sv: "Hur funkar prospekteringen?", fi: "Miten prospektointi toimii?", en: "How does Outreach work?" },
      keys: ["prospekt", "mejl", "e-post", "kampanj", "utskick", "kalla", "outreach", "möten", "sähköposti", "viesti", "kylmä", "email", "campaign", "cold", "meetings"],
      a: null,
      link: [{ sv: "Läs om Prospekteringen", fi: "Lue prospektoinnista", en: "Read about Outreach" }, "reach"], next: ["social", "resultat"] },
    { id: "social", label: { sv: "Kan ni sköta våra sociala medier?", fi: "Voitteko hoitaa somemme?", en: "Can you run our social media?" },
      keys: ["social", "sociala", "some", "linkedin", "instagram", "facebook", "inlägg", "julkaisu", "postaus", "posting", "posts", "youtube"],
      a: { sv: "Ja, med Social Media OS. Inläggen skrivs utifrån dina nyheter och kundcase, du godkänner dem på ett ställe och de publiceras i alla konton: företagets sidor och medarbetarnas profiler. Det ingår i Synlighetspaketet och i Wicflow OS Complete.",
           fi: "Kyllä, Social Media OS:llä. Julkaisut kirjoitetaan uutistesi ja asiakastarinoidesi pohjalta, hyväksyt ne yhdessä paikassa, ja ne julkaistaan kaikilla tileillä: yrityksen sivuilla ja työntekijöiden profiileissa. Se sisältyy Näkyvyyspakettiin ja Wicflow OS Complete -pakettiin.",
           en: "Yes, with Social Media OS. Posts are written from your news and customer stories, you approve them in one place, and they're published to every account: company pages and employees' profiles. It's part of the Visibility bundle and Wicflow OS Complete." },
      link: [{ sv: "Läs mer", fi: "Lue lisää", en: "Read more" }, "website#social"], next: ["website", "pris"] },
    { id: "website", label: { sv: "Kan ni bygga vår webbplats?", fi: "Voitteko tehdä verkkosivumme?", en: "Can you build our website?" },
      keys: ["webbplats", "hemsida", "sajt", "verkkosivu", "kotisivu", "website", "web site", "homepage", "cms", "seo", "geo", "google", "synlighet", "näkyvyys", "visibility", "ai-sök", "tekoälyhau", "ai search"],
      a: { sv: "Ja. Vi bygger en snabb webbplats som säljer, driftar den i EU och du redigerar den själv i vårt CMS. Varje förfrågan går direkt till dina säljare. Med SEO/GEO hittar köparna dig i Google och i AI-sökningar som ChatGPT. Det finns en demo av CMS:et på webbplatssidan.",
           fi: "Kyllä. Rakennamme nopeat, myyvät verkkosivut, ylläpidämme niitä EU:ssa, ja muokkaat niitä itse CMS:ssämme. Jokainen yhteydenotto menee suoraan myyjillesi. SEO/GEO:n avulla ostajat löytävät sinut Googlesta ja tekoälyhauista, kuten ChatGPT:stä. CMS:n demo löytyy verkkosivusivulta.",
           en: "Yes. We build a fast website that sells, host it in the EU, and you edit it yourself in our CMS. Every enquiry goes straight to your sales team. With SEO/GEO, buyers find you in Google and in AI search such as ChatGPT. There's a demo of the CMS on the website page." },
      link: [{ sv: "Se webbtjänsten", fi: "Katso verkkosivupalvelu", en: "See the website service" }, "website"], next: ["social", "pris"] },
    { id: "pengar", label: { sv: "Hur ger det oss mer pengar?", fi: "Miten se tuo meille lisää rahaa?", en: "How does it make us more money?" },
      keys: ["pengar", "tjäna", "intäkt", "omsättning", "lönsam", "raha", "tienata", "tuotto", "liikevaihto", "kannatta", "money", "revenue", "earn", "profit", "roi", "pay off", "worth it"],
      a: { sv: "På fyra sätt. Säljradarn hittar köparna före dina konkurrenter, Prospekteringen bokar fler säljmöten, Company Brain ser till att inget lead och ingen offert glöms bort, och webbplatsen och SEO/GEO ger fler förfrågningar. I kalkylen kan du räkna på vad det betyder för dig.",
           fi: "Neljällä tavalla. Myyntitutka löytää ostajat ennen kilpailijoitasi, Prospektointi varaa enemmän myyntitapaamisia, Company Brain huolehtii, ettei yksikään liidi tai tarjous unohdu, ja verkkosivut sekä SEO/GEO tuovat lisää yhteydenottoja. Laskurilla voit laskea, mitä se tarkoittaa teille.",
           en: "In four ways. Sales Radar finds buyers before your competitors do, Outreach books more sales meetings, Company Brain makes sure no lead or quote is forgotten, and your website and SEO/GEO bring in more enquiries. The calculator shows what it could mean for you." },
      link: [{ sv: "Räkna på det", fi: "Laske se", en: "Work it out" }, "home#kalkyl"], next: ["pris", "demo"] },
    { id: "tillvaxt", label: { sv: "Vad ingår i Wicflow OS Complete?", fi: "Mitä Wicflow OS Completeen kuuluu?", en: "What's in Wicflow OS Complete?" },
      keys: ["tillväxt", "motor", "complete", "allt", "koncern", "kasvu", "moottori", "kaikki tuotteet", "konserni", "growth", "engine", "everything", "group", "wicflow os"],
      a: { sv: "Wicflow OS Complete är hela ekosystemet: Säljradarn, Prospekteringen i full skala, Company Brain för hela företaget, webbplatsen med AI-chatt, SEO/GEO och Social Media OS, plus de mest avancerade tilläggen, systemet i ditt eget varumärke och en egen kontaktperson hos oss med kvartalsgenomgång.",
           fi: "Wicflow OS Complete on koko ekosysteemi: Myyntitutka, Prospektointi täydessä laajuudessa, Company Brain koko yritykselle, verkkosivut tekoälychatilla, SEO/GEO ja Social Media OS sekä edistyneimmät lisäosat, järjestelmä yrityksesi omalla ilmeellä ja oma vastuuhenkilö meiltä neljännesvuosikatsauksineen.",
           en: "Wicflow OS Complete is the whole ecosystem: Sales Radar, Outreach at full scale, Company Brain for the whole company, the website with an AI chat, SEO/GEO and Social Media OS, plus the most advanced plugins, the system in your own brand and a named contact at Wicflow with a quarterly review." },
      link: [{ sv: "Läs om Wicflow OS Complete", fi: "Lue Wicflow OS Completesta", en: "Read about Wicflow OS Complete" }, "growth"], next: ["pris", "demo"] },
    { id: "custom", label: { sv: "Bygger ni egna system?", fi: "Rakennatteko omia järjestelmiä?", en: "Do you build custom systems?" },
      keys: ["egen", "eget", "egna", "skräddarsy", "custom", "automation", "automatiser", "special", "bygga", "oma järjestelmä", "omia", "räätälöi", "automaatio", "rakenna", "bespoke", "build"],
      a: { sv: "Ja. Vi bygger också helt egna system och större automationer, till exempel kopplingar mellan affärssystem eller egna verktyg för säljare. De flesta större behov går att lösa. Eftersom varje sådant projekt är olika går vi igenom behovet tillsammans och ger ett fast pris i offerten.",
           fi: "Kyllä. Rakennamme myös kokonaan omia järjestelmiä ja isompia automaatioita, esimerkiksi integraatioita toiminnanohjausjärjestelmien välille tai omia työkaluja myyjille. Useimmat isommatkin tarpeet ovat ratkaistavissa. Koska jokainen tällainen projekti on erilainen, käymme tarpeen läpi yhdessä ja annamme kiinteän hinnan tarjouksessa.",
           en: "Yes. We also build fully custom systems and larger automations, such as integrations between business systems or custom tools for the sales team. Most bigger needs can be solved. Because every such project is different, we go through the need together and give a fixed price in the quote." },
      link: [{ sv: "Berätta vad du behöver", fi: "Kerro tarpeestasi", en: "Tell us what you need" }, "contact"], next: ["utbildning", "demo"] },
    { id: "utbildning", label: { sv: "Lär ni oss att använda systemen?", fi: "Opetatteko tiimiämme käyttämään järjestelmiä?", en: "Do you train our team?" },
      keys: ["lär", "utbild", "träning", "kurs", "workshop", "använda", "koulut", "opeta", "oppi", "training", "train", "teach"],
      a: { sv: "Ja, utbildning ingår i varje uppstart. Vi går igenom systemet med alla som ska använda det, tränar på dina egna uppgifter och lämnar en kort guide på svenska eller finska. Vi har utbildat över tio team i att använda AI i det dagliga arbetet.",
           fi: "Kyllä, koulutus kuuluu jokaiseen käyttöönottoon. Käymme järjestelmän läpi kaikkien käyttäjien kanssa, harjoittelemme teidän omilla tehtävillänne ja jätämme lyhyen ohjeen suomeksi tai ruotsiksi. Olemme kouluttaneet yli kymmenen tiimiä käyttämään tekoälyä päivittäisessä työssä.",
           en: "Yes, training is part of every setup. We walk everyone who'll use the system through it, practise on your own tasks and leave a short guide in Finnish, Swedish or English. We've trained more than ten teams to use AI in their daily work." },
      next: ["custom", "demo"] },
    { id: "resultat", label: { sv: "Vilka har ni jobbat med?", fi: "Keiden kanssa olette työskennelleet?", en: "Who have you worked with?" },
      keys: ["kund", "referens", "resultat", "maatori", "tsr", "exempel", "jobbat med", "case", "asiakas", "referenssi", "tulos", "customer", "client", "result", "worked with"],
      a: null,
      link: [{ sv: "Se våra kunder", fi: "Katso asiakkaat", en: "See our customers" }, "customers"], next: ["demo"] },
    { id: "integration", label: { sv: "Fungerar det med våra system?", fi: "Toimiiko tämä järjestelmiemme kanssa?", en: "Does it work with our systems?" },
      keys: ["integrat", "pipedrive", "hubspot", "netvisor", "procountor", "outlook", "gmail", "crm", "byta system", "koppl", "yhdist", "connect", "work with"],
      a: { sv: "Ja. Systemen kopplas till det du redan använder, till exempel Pipedrive, HubSpot, Salesforce, Outlook, Gmail, Netvisor och Procountor. Du behöver inte byta något.",
           fi: "Kyllä. Järjestelmät yhdistetään siihen, mitä jo käytät, esimerkiksi Pipedriveen, HubSpotiin, Salesforceen, Outlookiin, Gmailiin, Netvisoriin ja Procountoriin. Mitään ei tarvitse vaihtaa.",
           en: "Yes. The systems connect to what you already use, such as Pipedrive, HubSpot, Salesforce, Outlook, Gmail, Netvisor and Procountor. You don't need to switch anything." },
      next: ["gdpr", "custom"] },
    { id: "gdpr", label: { sv: "Var finns vår data?", fi: "Missä tietomme ovat?", en: "Where is our data?" },
      keys: ["data", "gdpr", "säker", "integritet", "server", "lagring", "tieto", "tietosuoja", "palvelin", "privacy", "secure"],
      a: { sv: "I EU. Company Brain och den AI den använder körs i datacenter inom EU, och din data används aldrig för att träna AI-modeller. Varje koppling visar vad den ser och vad den aldrig gör, och du kan stänga av den själv. Inga svar skickas till kunder utan att någon i ditt team har godkänt dem.",
           fi: "EU:ssa. Company Brain ja sen käyttämä tekoäly toimivat EU:n datakeskuksissa, eikä tietojasi koskaan käytetä tekoälymallien kouluttamiseen. Jokainen yhteys näyttää, mitä se näkee ja mitä se ei koskaan tee, ja voit katkaista sen itse. Asiakkaille ei lähde vastauksia ilman, että joku teiltä on hyväksynyt ne.",
           en: "In the EU. Company Brain and the AI it uses run in EU data centres, and your data is never used to train AI models. Every connection shows what it sees and what it never does, and you can switch it off yourself. No replies go to customers unless someone on your team has approved them." },
      next: ["avtal"] },
    { id: "avtal", label: { sv: "Hur länge binder vi oss?", fi: "Kuinka pitkäksi aikaa sitoudumme?", en: "How long do we commit for?" },
      keys: ["avtal", "binda", "binder", "uppsäg", "säga upp", "sluta", "minimitid", "kontrakt", "sitou", "irtisan", "vähimmäis", "commit", "cancel", "notice", "minimum term"],
      a: null,
      next: ["pris"] },
    { id: "tid", label: { sv: "Hur snabbt kommer vi igång?", fi: "Kuinka nopeasti pääsemme alkuun?", en: "How fast can we get started?" },
      keys: ["snabbt", "igång", "tid tar", "hur länge tar", "veckor", "nopea", "alkuun", "kauanko", "viikko", "how fast", "how long", "get started", "weeks"],
      a: { sv: "Säljradarn kan vara igång inom några dagar. Prospekteringen behöver ungefär två veckor för att värma upp inkorgarna. För Company Brain beror tiden på hur många system som ska kopplas in, och den står i offerten.",
           fi: "Myyntitutka voi olla käytössä muutamassa päivässä. Prospektointi tarvitsee noin kaksi viikkoa postilaatikoiden lämmittämiseen. Company Brainin aikataulu riippuu yhdistettävien järjestelmien määrästä, ja se kerrotaan tarjouksessa.",
           en: "Sales Radar can be running within a few days. Outreach needs about two weeks to warm up the inboxes. For Company Brain it depends on how many systems need connecting, and the timeline is in the quote." },
      link: [{ sv: "Se uppstartsplanen", fi: "Katso käyttöönottosuunnitelma", en: "See the setup plan" }, "setup"], next: ["startavtal", "demo"] },
    { id: "startavtal", label: { sv: "Kan vi börja utan att binda oss ett år?", fi: "Voimmeko aloittaa sitoutumatta vuodeksi?", en: "Can we start without committing for a year?" },
      keys: ["startavtal", "90 dagar", "pilot", "prova", "testa", "risk", "aloitussopimus", "90 päivää", "kokeil", "riski", "starter", "90 days", "trial", "risk"],
      a: null,
      link: [{ sv: "Se hur uppstarten går till", fi: "Katso, miten käyttöönotto etenee", en: "See how setup works" }, "setup"], next: ["tid", "demo"] },
    { id: "sjalv", label: { sv: "Kan vi börja själva, utan möte?", fi: "Voimmeko aloittaa itse ilman palaveria?", en: "Can we start on our own, without a meeting?" },
      keys: ["själv", "utan möte", "online", "köpa direkt", "beställa", "itse", "ilman palaveri", "verkossa", "tilata", "yourself", "self-serve", "without a meeting", "buy online", "order"],
      a: null,
      link: [{ sv: "Kom igång själv", fi: "Aloita itse", en: "Get started yourself" }, "start"], next: ["radar", "paket"] },
    { id: "sprak", label: { sv: "Vilka språk?", fi: "Millä kielillä?", en: "Which languages?" },
      keys: ["svenska", "finska", "suomi", "språk", "engelska", "kieli", "ruotsi", "englanti", "language", "finnish", "swedish", "english"],
      a: { sv: "Allt fungerar på svenska och finska, och på engelska vid behov. Den riktiga chatten svarar på samma språk som du skriver på.",
           fi: "Kaikki toimii suomeksi ja ruotsiksi, ja tarvittaessa englanniksi. Oikea chat vastaa samalla kielellä, jolla kirjoitat.",
           en: "Everything works in Finnish and Swedish, and in English when needed. The real chat answers in the language you write in." },
      next: ["demo"] },
    { id: "team", label: { sv: "Vilka är ni?", fi: "Keitä olette?", en: "Who are you?" },
      keys: ["vem", "ni är", "grund", "felix", "robin", "emil", "rasmus", "företaget", "wicflow", "keitä", "perustaja", "who are", "founder"],
      a: { sv: "Wicflow är ett finländskt företag som bygger och sköter säljsystem. Felix Wickholm är grundare och vd, Robin Wickholm medgrundare och COO och Emil Rehn medgrundare och produkt- och teknikchef.",
           fi: "Wicflow on suomalainen yritys, joka rakentaa ja ylläpitää myyntijärjestelmiä. Felix Wickholm on perustaja ja toimitusjohtaja, Robin Wickholm toinen perustaja ja COO, ja Emil Rehn toinen perustaja sekä tuote- ja teknologiajohtaja.",
           en: "Wicflow is a Finnish company that builds and runs sales systems. Felix Wickholm is founder and CEO, Robin Wickholm co-founder and COO, and Emil Rehn co-founder and Chief Product & Technical Officer." },
      link: [{ sv: "Möt teamet", fi: "Tapaa tiimi", en: "Meet the team" }, "home#team"], next: ["demo"] },
    { id: "app", label: { sv: "Finns det en mobilapp?", fi: "Onko mobiilisovellusta?", en: "Is there a mobile app?" },
      keys: ["app", "mobil", "telefon", "iphone", "ios", "android", "google play", "app store", "puhelin", "sovellus", "kännykkä", "mobile", "phone"],
      a: { sv: "Den officiella Wicflow-appen kommer snart till iOS och Google Play. Där ser du dagens lista, godkänner offerter, stämplar in och ut och frågar om verksamheten, med samma behörigheter som på datorn. Du kan prova den i telefonen på Company Brain-sidan.",
           fi: "Virallinen Wicflow-sovellus on tulossa pian iOS:lle ja Google Playhin. Siinä näet päivän listan, hyväksyt tarjouksia, leimaat sisään ja ulos ja kysyt yrityksestäsi samoilla käyttöoikeuksilla kuin tietokoneella. Voit kokeilla sitä Company Brain -sivun puhelimessa.",
           en: "The official Wicflow app is coming soon to iOS and Google Play. In it you see the day's list, approve quotes, clock in and out and ask about your business, with the same permissions as on the computer. You can try it in the phone on the Company Brain page." },
      link: [{ sv: "Prova appen", fi: "Kokeile sovellusta", en: "Try the app" }, "brain#mobile"], next: ["brain", "demo"] },
    { id: "demo", label: { sv: "Boka en demo", fi: "Varaa demo", en: "Book a demo" },
      keys: ["demo", "boka", "möte", "träffa", "kontakt", "ring", "prata med", "människa", "varaa", "tapaa", "yhteys", "soita", "ihminen", "book", "meet", "contact", "call", "human"],
      a: { sv: "Gärna! En demo tar 30 minuter med Felix. Vi visar systemen med exempel från din bransch och säger direkt vad det skulle kosta hos dig.",
           fi: "Mielellään! Demo kestää 30 minuuttia Felixin kanssa. Näytämme järjestelmät esimerkeillä omalta toimialaltasi ja kerromme heti, mitä se maksaisi teillä.",
           en: "Happy to! A demo takes 30 minutes with Felix. We show the systems with examples from your industry and tell you straight away what it would cost for you." },
      link: [{ sv: "Boka demo", fi: "Varaa demo", en: "Book a demo" }, "contact"] },
  ];
  // While prices, terms and figures are held (window.WF_HOLD, see build.py), the answers leave them out. The held
  // build also removes the drafted answers (between /*held*/ markers) from this file.
  if (window.WF_HOLD) {
    const CALL = [{ sv: "Boka ett samtal", fi: "Varaa aika", en: "Book a call" }, "contact"];
    const HELD = {
      pris: window.WF_PRICES ? {} : { link: CALL },
      paket: window.WF_PRICES ? {} : { link: CALL },
      resultat: {
        a: { sv: "Vi har jobbat med över 30 företag, bland andra Maatori, TSR-Elsite, Kampek och Nordic Breakfast.",
             fi: "Olemme työskennelleet yli 30 yrityksen kanssa, muun muassa Maatorin, TSR-Elsiten, Kampekin ja Nordic Breakfastin.",
             en: "We've worked with more than 30 companies, among them Maatori, TSR-Elsite, Kampek and Nordic Breakfast." } },
      avtal: {
        a: { sv: "Minimitiden står i offerten. Efter den kan du säga upp avtalet, och all din data går att exportera.",
             fi: "Vähimmäiskesto lukee tarjouksessa. Sen jälkeen voit irtisanoa sopimuksen, ja kaikki tietosi voi viedä mukanaan.",
             en: "The minimum term is in the quote. After it you can end the agreement, and all your data can be exported." } },
      prospektering: {
        a: { sv: "Prospekteringen skickar personliga första mejl utifrån verkliga signaler, från egna uppvärmda inkorgar. Svaren sorteras och du får svarsutkast som någon i ditt team godkänner innan de skickas. Möten och affärer hamnar direkt i ditt CRM.",
             fi: "Prospektointi lähettää henkilökohtaisia ensimmäisiä viestejä todellisten signaalien pohjalta omista, lämmitetyistä postilaatikoista. Vastaukset lajitellaan, ja saat vastausluonnokset, jotka joku teiltä hyväksyy ennen lähettämistä. Tapaamiset ja kaupat menevät suoraan CRM:ään.",
             en: "Outreach sends personal first emails based on real signals, from your own warmed-up inboxes. Replies are sorted and you get reply drafts that someone on your team approves before they go out. Meetings and deals go straight into your CRM." } },
      tid: { link: CALL },
    };
    for (let i = KB.length - 1; i >= 0; i--) {
      if (KB[i].id === "startavtal" || KB[i].id === "sjalv") KB.splice(i, 1);
      else Object.assign(KB[i], HELD[KB[i].id]);
    }
    for (const k of KB) if (k.next) k.next = k.next.filter((id) => KB.some((x) => x.id === id));
  }
  const byId = Object.fromEntries(KB.map((k) => [k.id, k]));
  const START = ["pengar", "pris", "brain", "website", "radar", "demo"];
  const UI = {
    title: L({ sv: "Fråga oss", fi: "Kysy meiltä", en: "Ask us" }),
    sub: L({ sv: "Svarar utifrån det som står på vår sida", fi: "Vastaa sivustomme sisällön pohjalta", en: "Answers from what's on our site" }),
    close: L({ sv: "Stäng chatten", fi: "Sulje chat", en: "Close chat" }),
    ph: L({ sv: "Skriv en fråga …", fi: "Kirjoita kysymys …", en: "Type a question …" }),
    send: L({ sv: "Skicka", fi: "Lähetä", en: "Send" }),
    note: L({ sv: "Förinställda svar. Den riktiga chatten svarar med AI och kan ingå i din webbplats.", fi: "Valmiit vastaukset. Oikea chat vastaa tekoälyllä, ja sen voi saada omille verkkosivuillesi.", en: "Preset answers. The real chat answers with AI, and you can have it on your own website." }),
    hello: L({ sv: "Hej! Jag svarar på frågor om Wicflow, våra system och priser. Vad undrar du?", fi: "Hei! Vastaan kysymyksiin Wicflowsta, järjestelmistämme ja hinnoista. Mitä haluaisit tietää?", en: "Hi! I answer questions about Wicflow, our systems and prices. What would you like to know?" }),
    unsure: L({ sv: "Det vet jag inte säkert. Felix svarar gärna, oftast inom en arbetsdag.", fi: "En ole varma. Felix vastaa mielellään, yleensä yhden työpäivän sisällä.", en: "I'm not sure about that. Felix will happily answer, usually within one working day." }),
    book: L({ sv: "Boka demo", fi: "Varaa demo", en: "Book a demo" }),
  };
  const linkHref = (target) => { const [id, hash] = target.split("#"); return route(id) + (hash ? "#" + hash : ""); };

  function match(text) {
    const t = text.toLowerCase();
    let best = null, score = 0;
    for (const k of KB) {
      const s = k.keys.reduce((a, key) => a + (t.includes(key) ? key.length : 0), 0);
      if (s > score) { score = s; best = k; }
    }
    return best;
  }

  function mount() {
    const wrap = document.createElement("div");
    wrap.className = "chat";
    wrap.innerHTML = `
      <div class="chat-panel" role="dialog" aria-label="${UI.title}" hidden>
        <div class="chat-head"><div><b>${UI.title}</b><span>${UI.sub}</span></div><button type="button" class="chat-x" aria-label="${UI.close}">×</button></div>
        <div class="chat-log" aria-live="polite"></div>
        <div class="chat-chips"></div>
        <form class="chat-form"><input aria-label="${UI.ph}" placeholder="${UI.ph}" autocomplete="off"><button type="submit" aria-label="${UI.send}">↑</button></form>
        <p class="chat-note">${UI.note}</p>
      </div>
      <button type="button" class="chat-btn" aria-expanded="false"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg><span>${UI.title}</span></button>`;
    document.body.appendChild(wrap);
    const panel = wrap.querySelector(".chat-panel"), btn = wrap.querySelector(".chat-btn");
    const log = wrap.querySelector(".chat-log"), chips = wrap.querySelector(".chat-chips");
    const form = wrap.querySelector(".chat-form"), input = form.querySelector("input");
    let started = false;

    const add = (who, text, link) => {
      const m = document.createElement("div");
      m.className = "msg " + who;
      const p = document.createElement("p"); p.textContent = text; m.appendChild(p);
      if (link) { const a = document.createElement("a"); a.href = linkHref(link[1]); a.textContent = L(link[0]) + " →"; m.appendChild(a); }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
    };
    const setChips = (ids) => {
      chips.innerHTML = "";
      (ids || []).forEach((id) => { const b = document.createElement("button"); b.type = "button"; b.textContent = L(byId[id].label); b.dataset.id = id; chips.appendChild(b); });
    };
    const answer = (k) => {
      const typing = document.createElement("div"); typing.className = "msg bot typing"; typing.innerHTML = "<p><i></i><i></i><i></i></p>";
      log.appendChild(typing); log.scrollTop = log.scrollHeight; setChips([]);
      setTimeout(() => {
        typing.remove();
        if (k) { add("bot", L(k.a), k.link); setChips(k.next || START.filter((x) => x !== k.id).slice(0, 3)); }
        else { add("bot", UI.unsure, [{ sv: UI.book, fi: UI.book, en: UI.book }, "contact"]); setChips(START.slice(0, 3)); }
      }, 550);
    };
    let closing = null;
    const open = (state) => {
      btn.setAttribute("aria-expanded", String(state)); wrap.classList.toggle("open", state);
      clearTimeout(closing);
      if (state) { panel.hidden = false; void panel.offsetWidth; wrap.classList.add("in"); } // force a layout so the transition starts from the closed state
      else { wrap.classList.remove("in"); closing = setTimeout(() => { panel.hidden = true; }, 260); }
      if (state && !started) { started = true; add("bot", UI.hello); setChips(START); }
      if (state) input.focus();
    };
    btn.addEventListener("click", () => open(panel.hidden));
    wrap.querySelector(".chat-x").addEventListener("click", () => { open(false); btn.focus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
    chips.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; add("user", b.textContent); answer(byId[b.dataset.id]); });
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ""; add("user", v); answer(match(v)); });
  }
  document.addEventListener("DOMContentLoaded", mount);
})();
