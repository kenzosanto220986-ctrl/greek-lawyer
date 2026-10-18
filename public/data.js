/* Bilingual content: UI strings, categories, intake questions. Greek is the default language. */
(function () {
  const L = (el, en) => ({ el, en });

  const UI = {
    appName: L('Προσωπικός Δικηγόρος', 'Personal Lawyer'),
    tagline: L('Φιλική νομική καθοδήγηση, με απλά λόγια', "Friendly legal guidance, in plain words"),
    heroTitle: L('Πες μου τι συμβαίνει.<br><em>Θα το δούμε μαζί, με απλά λόγια.</em>', "Tell me what’s going on.<br><em>We’ll figure it out together, in plain words.</em>"),
    heroSub: L('Μην ανησυχείς — δεν χρειάζεσαι νομικές γνώσεις. Διάλεξε το θέμα σου, απάντησε σε λίγες απλές ερωτήσεις και μετά τα λέμε σαν σε κουβέντα. Θα σου εξηγώ τα πάντα απλά, θα σου προτείνω επιλογές και θα σου λέω κι ένα-δυο πράγματα που ίσως δεν ήξερες.', "No worries — you don’t need to know any law. Pick your topic, answer a few simple questions, then we just chat. I’ll explain everything simply, suggest options, and share a thing or two you might not know."),
    chooseArea: L('Με τι θέμα θέλεις βοήθεια;', "What do you need help with?"),
    newCase: L('Νέα υπόθεση', 'New case'),
    history: L('Ιστορικό', 'History'),
    historyTitle: L('Ιστορικό υποθέσεων', 'Case history'),
    historyEmpty: L('Δεν έχεις αποθηκευμένες υποθέσεις ακόμη — όταν ξεκινήσεις μία, θα τη βρεις εδώ. Όλα μένουν μόνο σε αυτή τη συσκευή.', "Nothing saved yet — once you start a case, you’ll find it here. Everything stays on this device only."),
    delete: L('Διαγραφή', 'Delete'),
    deleteConfirm: L('Να διαγραφεί αυτή η υπόθεση;', 'Delete this case?'),
    clearAll: L('Διαγραφή όλων', 'Delete all'),
    clearAllConfirm: L('Να διαγραφούν όλες οι υποθέσεις από αυτή τη συσκευή;', 'Delete all cases from this device?'),
    untitled: L('Υπόθεση χωρίς τίτλο', 'Untitled case'),
    close: L('Κλείσιμο', 'Close'),
    demoBanner: L('Λειτουργία επίδειξης: δεν έχει οριστεί LLM_API_KEY — οι απαντήσεις είναι προκαθορισμένες.', "Demo mode: LLM_API_KEY is not set — answers are canned."),
    privacy: L('Οι συζητήσεις σου αποθηκεύονται μόνο στον browser σου. Γράψε ό,τι χρειάζεται, αλλά απόφυγε προσωπικά στοιχεία που δεν είναι απαραίτητα.', "Your conversations are saved in your browser only. Share what’s needed, but skip personal details that aren’t necessary."),
    footer: L('Ενημερωτική καθοδήγηση — δεν υποκαθιστά τη συμβουλή αδειούχου δικηγόρου.', 'Informational guidance — not a substitute for a licensed lawyer.'),
    introBubble: L('Γεια σου! Μην αγχώνεσαι, είμαι εδώ να βοηθήσω. Θα σε ρωτήσω λίγα απλά πράγματα για να καταλάβω τι συμβαίνει. Διάλεξε μια έτοιμη απάντηση ή γράψε τη δική σου — δεν υπάρχει λάθος απάντηση.', "Hi there! Don’t worry, I’m here to help. I’ll ask a few simple things to understand what’s going on. Pick a quick answer or write your own — there are no wrong answers."),
    stepOf: L('Ερώτηση {n} από {total} — σχεδόν εκεί!', "Question {n} of {total} — almost there!"),
    skip: L('Δεν ξέρω / Παράλειψη', "Not sure / Skip"),
    skipped: L('(παραλείφθηκε)', '(skipped)'),
    back: L('Πίσω', 'Back'),
    freeTextPh: L('Ή γράψε με δικά σου λόγια…', "Or write it in your own words…"),
    descPh: L('Πες μου με δικά σου λόγια τι έγινε, ποιοι εμπλέκονται και τι θα ήθελες να γίνει. Όσο μπορείς — δεν χρειάζονται νομικές λέξεις.', "Tell me in your own words what happened, who’s involved and what you’d like to happen. Whatever you can — no legal words needed."),
    send: L('Αποστολή', 'Send'),
    stop: L('Διακοπή', 'Stop'),
    chatPh: L('Ρώτα με ό,τι θέλεις ή διάλεξε μια επιλογή από πάνω…', "Ask me anything, or pick an option above…"),
    context: L('Πλαίσιο υπόθεσης', 'Case context'),
    copy: L('Αντιγραφή', 'Copy'),
    copied: L('Αντιγράφηκε', 'Copied'),
    retry: L('Δοκιμάστε ξανά', 'Try again'),
    errGeneric: L('Ωχ, κάτι δεν πήγε καλά και δεν κατάφερα να απαντήσω. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.', "Oops, something went wrong and I couldn’t answer. Check your connection and try again."),
    errRate: L('Ουφ, στείλαμε πολλά μηνύματα μαζί! Περίμενε λίγο και δοκίμασε ξανά.', "Whoa, that was a lot of messages at once! Give it a moment and try again."),
    thinking: L('Σκέφτομαι την απάντηση…', "Thinking it through…"),
    you: L('Εσύ', "You"),
    lawyer: L('Δικηγόρος', "Lawyer"),
    sourcesTitle: L('Αναζήτηση νομολογίας', 'Case-law search'),
    sourcesTerms: L('Όροι αναζήτησης', 'Search terms'),
    sourcesNote: L('Ανοίγουν επίσημες πηγές σε νέα καρτέλα. Έλεγξε πάντα κάθε παραπομπή πριν βασιστείς σε αυτήν.', "Opens official sources in a new tab. Always double-check any citation before relying on it."),
    langLabel: L('Γλώσσα', 'Language'),
    answerLangNote: L('Απαντώ στη γλώσσα που γράφεις.', "I reply in the language you write in."),
    descQuestion: L('Τέλεια, σχεδόν τελειώσαμε! Πες μου με δικά σου λόγια τι συνέβη.', "Great, almost done! Tell me in your own words what happened."),
    optionsLabel: L('Πάμε παρακάτω; Διάλεξε μία επιλογή:', 'Where to next? Pick an option:'),
    finalReady: L('Ευχαριστώ που τα μοιράστηκες. Το κοιτάζω αμέσως…', "Thanks for sharing that. Let me take a look right away…")
  };

  // Source search links (labels/descriptions are bilingual; URLs built in app.js)
  const SOURCES = [
    { id: 'hudoc', name: L('HUDOC — ΕΔΔΑ', 'HUDOC — ECtHR'), desc: L('Νομολογία Ευρωπαϊκού Δικαστηρίου Δικαιωμάτων του Ανθρώπου', 'European Court of Human Rights case law') },
    { id: 'eurlex', name: L('EUR-Lex', 'EUR-Lex'), desc: L('Νομοθεσία και νομολογία ΕΕ', 'EU legislation and case law') },
    { id: 'curia', name: L('CURIA — ΔΕΕ', 'CURIA — CJEU'), desc: L('Δικαστήριο της Ευρωπαϊκής Ένωσης', 'Court of Justice of the European Union') },
    { id: 'ap', name: L('Άρειος Πάγος', 'Areios Pagos'), desc: L('areiospagos.gr — Ακυρωτικό αστικής/ποινικής δικαιοσύνης', 'areiospagos.gr — Supreme Civil & Criminal Court') },
    { id: 'ste', name: L('Συμβούλιο της Επικρατείας', 'Council of State'), desc: L('ste.gr — ανώτατο διοικητικό δικαστήριο', 'ste.gr — supreme administrative court') },
    { id: 'fek', name: L('ΕΤ — ΦΕΚ', 'Gov. Gazette (ΦΕΚ)'), desc: L('et.gr — Εθνικό Τυπογραφείο, ισχύουσα νομοθεσία', 'et.gr — National Printing Office, legislation') },
    { id: 'aade', name: L('ΑΑΔΕ', 'AADE'), desc: L('aade.gr — Ανεξάρτητη Αρχή Δημοσίων Εσόδων, εγκύκλιοι/ΠΟΛ', 'aade.gr — tax authority, circulars & guidance') }
  ];

  const icons = {
    penal: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    civil: 'M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zM19 7l-3 7a4 4 0 0 0 6 0l-3-7zM8 21h8',
    commercial: 'M4 21V7l8-4 8 4v14M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01',
    tax: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6',
    labor: 'M3 8h18v12H3zM8 8V5h8v3M3 13h18',
    family: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5',
    property: 'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6',
    admin: 'M3 9l9-6 9 6M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18',
    eu: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
    other: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01'
  };

  const WHEN = {
    q: L('Πότε συνέβη ή ξεκίνησε το θέμα;', 'When did the matter happen or start?'),
    chips: [L('Αυτή την εβδομάδα', 'This week'), L('Τους τελευταίους μήνες', 'In recent months'), L('Πάνω από έναν χρόνο πριν', 'Over a year ago'), L('Συνεχίζεται ακόμη', 'It is ongoing')]
  };

  const CATEGORIES = [
    {
      id: 'penal', icon: icons.penal,
      name: L('Ποινικό', 'Criminal'),
      blurb: L('Μήνυση, δίωξη, απολογία, ποινές', 'Complaints, charges, defence, penalties'),
      topicEl: 'ποινικό δίκαιο', topicEn: 'criminal proceedings',
      questions: [
        { q: L('Ποια είναι η θέση σου στην υπόθεση;', 'What is your role in this?'), chips: [L('Θύμα / παθών', 'Victim'), L('Ύποπτος / κατηγορούμενος', 'Suspect / accused'), L('Μάρτυρας', 'Witness'), L('Συγγενής', 'Relative')] },
        { q: L('Σε ποιο στάδιο βρίσκεται;', 'What stage is it at?'), chips: [L('Δεν έχει γίνει καταγγελία', 'No complaint filed yet'), L('Έχω κληθεί για εξηγήσεις / απολογία', 'Called for explanations / defence'), L('Εκκρεμεί δίκη', 'Trial pending'), L('Έχει εκδοθεί απόφαση', 'A judgment was issued')] },
        WHEN
      ]
    },
    {
      id: 'civil', icon: icons.civil,
      name: L('Αστικό', 'Civil'),
      blurb: L('Συμβάσεις, αποζημιώσεις, οφειλές', 'Contracts, damages, debts'),
      topicEl: 'αστική ευθύνη αποζημίωση', topicEn: 'civil liability damages',
      questions: [
        { q: L('Τι αφορά κυρίως η διαφορά;', 'What is the dispute mainly about?'), chips: [L('Αποζημίωση / ζημιά', 'Compensation / damage'), L('Παραβίαση σύμβασης', 'Breach of contract'), L('Απλήρωτη οφειλή', 'Unpaid debt'), L('Γειτονική / προσωπική διαφορά', 'Neighbour / personal dispute')] },
        { q: L('Έχεις κάτι γραπτό που να το αποδεικνύει;', 'Do you have anything in writing that shows it?'), chips: [L('Ναι, σύμβαση / έγγραφο', 'Yes, contract / document'), L('Μόνο μηνύματα / email', 'Only messages / emails'), L('Όχι', 'No'), L('Δεν ξέρω', 'Not sure')] },
        { q: L('Περίπου ποιο είναι το ποσό;', 'What is the approximate amount?'), chips: [L('Κάτω από 1.000 €', 'Under €1,000'), L('1.000 – 5.000 €', '€1,000 – 5,000'), L('5.000 – 50.000 €', '€5,000 – 50,000'), L('Πάνω από 50.000 €', 'Over €50,000')] },
        WHEN
      ]
    },
    {
      id: 'commercial', icon: icons.commercial,
      name: L('Εμπορικό / Εταιρικό', 'Commercial / Corporate'),
      blurb: L('Εταιρείες, εταίροι, αφερεγγυότητα', 'Companies, partners, insolvency'),
      topicEl: 'εταιρικό δίκαιο εμπορικό', topicEn: 'company law commercial',
      questions: [
        { q: L('Τι είδους επιχείρηση είναι (νομική μορφή);', 'What kind of business is it (legal form)?'), chips: [L('Ατομική επιχείρηση', 'Sole proprietorship'), L('ΙΚΕ / ΕΠΕ', 'ΙΚΕ / ΕΠΕ (private company)'), L('ΑΕ', 'ΑΕ (S.A.)'), L('ΟΕ / ΕΕ', 'ΟΕ / ΕΕ (partnership)')] },
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Σύσταση / μετατροπή', 'Formation / conversion'), L('Διαφορά εταίρων / μετόχων', 'Partner / shareholder dispute'), L('Σύμβαση με πελάτη / προμηθευτή', 'Customer / supplier contract'), L('Χρέη / αφερεγγυότητα', 'Debts / insolvency')] },
        WHEN
      ]
    },
    {
      id: 'tax', icon: icons.tax,
      name: L('Φορολογικό / Λογιστικό', 'Tax / Accounting'),
      blurb: L('ΑΑΔΕ, έλεγχοι, ΦΠΑ, ρυθμίσεις', 'Tax authority, audits, VAT, settlements'),
      topicEl: 'φορολογικός έλεγχος ΚΦΔ', topicEn: 'tax procedure audit',
      questions: [
        { q: L('Ποια είναι η ιδιότητά σου;', 'What is your capacity?'), chips: [L('Ιδιώτης / μισθωτός', 'Individual / employee'), L('Ελεύθερος επαγγελματίας', 'Freelancer'), L('Εταιρεία', 'Company')] },
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Πρόστιμο / εκκαθαριστικό ΑΑΔΕ', 'AADE fine / assessment'), L('Φορολογικός έλεγχος', 'Tax audit'), L('Ρύθμιση οφειλών / κατασχέσεις', 'Debt settlement / seizures'), L('ΦΠΑ / βιβλία / δηλώσεις', 'VAT / books / returns')] },
        { q: L('Έχεις λάβει επίσημη πράξη ή ειδοποίηση;', 'Have you received an official notice?'), chips: [L('Ναι, με προθεσμία', 'Yes, with a deadline'), L('Ναι, χωρίς προθεσμία', 'Yes, no deadline'), L('Όχι ακόμη', 'Not yet')] },
        WHEN
      ]
    },
    {
      id: 'labor', icon: icons.labor,
      name: L('Εργατικό', 'Employment'),
      blurb: L('Απόλυση, δεδουλευμένα, συμβάσεις', 'Dismissal, unpaid wages, contracts'),
      topicEl: 'εργατικό δίκαιο απόλυση', topicEn: 'employment law dismissal',
      questions: [
        { q: L('Ποια είναι η ιδιότητά σου;', 'What is your capacity?'), chips: [L('Εργαζόμενος', 'Employee'), L('Εργοδότης', 'Employer')] },
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Απόλυση', 'Dismissal'), L('Απλήρωτα / δεδουλευμένα', 'Unpaid wages'), L('Παραίτηση', 'Resignation'), L('Ωράριο / άδειες', 'Hours / leave'), L('Παρενόχληση / εργατικό ατύχημα', 'Harassment / workplace accident')] },
        { q: L('Τι είδους σύμβαση υπάρχει;', 'What type of contract is there?'), chips: [L('Αορίστου χρόνου', 'Indefinite term'), L('Ορισμένου χρόνου', 'Fixed term'), L('Μπλοκάκι / παροχή υπηρεσιών', 'Freelance / service contract'), L('Αδήλωτη εργασία', 'Undeclared work')] },
        WHEN
      ]
    },
    {
      id: 'family', icon: icons.family,
      name: L('Οικογενειακό / Κληρονομικό', 'Family / Inheritance'),
      blurb: L('Διαζύγιο, επιμέλεια, διαθήκες', 'Divorce, custody, wills'),
      topicEl: 'οικογενειακό δίκαιο κληρονομικό', topicEn: 'family law inheritance',
      questions: [
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Διαζύγιο', 'Divorce'), L('Επιμέλεια / διατροφή τέκνων', 'Child custody / maintenance'), L('Διαθήκη / κληρονομιά', 'Will / inheritance'), L('Αποδοχή / αποποίηση κληρονομιάς', 'Accepting / renouncing inheritance'), L('Γονική παροχή / δωρεά', 'Parental gift / donation')] },
        { q: L('Υπάρχουν ανήλικα τέκνα;', 'Are there minor children?'), chips: [L('Ναι', 'Yes'), L('Όχι', 'No')] },
        { q: L('Υπάρχει συμφωνία μεταξύ των εμπλεκομένων;', 'Is there agreement between the parties?'), chips: [L('Ναι, ειρηνικά', 'Yes, amicable'), L('Εν μέρει', 'Partly'), L('Όχι, υπάρχει σύγκρουση', 'No, there is conflict')] },
        WHEN
      ]
    },
    {
      id: 'property', icon: icons.property,
      name: L('Ακίνητα', 'Real estate'),
      blurb: L('Αγορά, μίσθωση, αυθαίρετα, κτηματολόγιο', 'Sale, lease, illegal builds, land registry'),
      topicEl: 'ακίνητα μίσθωση κυριότητα', topicEn: 'real estate property lease',
      questions: [
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Αγορά / πώληση', 'Purchase / sale'), L('Μίσθωση', 'Lease'), L('Αυθαίρετα / πολεοδομία', 'Illegal construction / planning'), L('Πολυκατοικία / συνιδιοκτησία', 'Co-ownership / building'), L('Κτηματολόγιο / χρησικτησία', 'Land registry / adverse possession')] },
        { q: L('Τι έγγραφα υπάρχουν;', 'What documents exist?'), chips: [L('Συμβολαιογραφικό', 'Notarial deed'), L('Ιδιωτικό συμφωνητικό', 'Private agreement'), L('Τίποτα γραπτό', 'Nothing in writing')] },
        WHEN
      ]
    },
    {
      id: 'admin', icon: icons.admin,
      name: L('Διοικητικό', 'Administrative'),
      blurb: L('Δημόσιο, πολεοδομία, ΕΦΚΑ, προσφυγές', 'Public bodies, planning, social security, appeals'),
      topicEl: 'διοικητικό δίκαιο ακύρωση πράξης', topicEn: 'administrative law annulment',
      questions: [
        { q: L('Απέναντι σε ποιον φορέα;', 'Against which body?'), chips: [L('Δήμος / Περιφέρεια', 'Municipality / Region'), L('Δημόσια υπηρεσία / ΕΦΚΑ', 'Public service / social security'), L('Πολεοδομία', 'Planning authority'), L('Δημόσιος υπάλληλος / πειθαρχικό', 'Civil servant / disciplinary')] },
        { q: L('Έχει εκδοθεί πράξη ή απόφαση;', 'Has an act or decision been issued?'), chips: [L('Ναι, έχω την πράξη', 'Yes, I have the act'), L('Σιωπή της Διοίκησης', 'Administration is silent'), L('Δεν ξέρω', 'Not sure')] },
        WHEN
      ]
    },
    {
      id: 'eu', icon: icons.eu,
      name: L('Ευρωπαϊκό / Διεθνές δίκαιο', 'EU / International law'),
      blurb: L('ΕΔΔΑ, δίκαιο ΕΕ, διασυνοριακές διαφορές', 'ECHR, EU law, cross-border disputes'),
      topicEl: 'ευρωπαϊκό δίκαιο ΕΣΔΑ', topicEn: 'European Convention human rights EU law',
      questions: [
        { q: L('Τι αφορά το θέμα;', 'What does the matter concern?'), chips: [L('Ανθρώπινα δικαιώματα (ΕΣΔΑ / ΕΔΔΑ)', 'Human rights (ECHR / ECtHR)'), L('Δίκαιο ΕΕ (καταναλωτής, GDPR, μετακίνηση)', 'EU law (consumer, GDPR, free movement)'), L('Διασυνοριακή διαφορά', 'Cross-border dispute'), L('Άσυλο / μετανάστευση / ιθαγένεια', 'Asylum / migration / citizenship')] },
        { q: L('Έχεις ήδη δοκιμάσει όλες τις δυνατότητες στα ελληνικά δικαστήρια;', 'Have you already tried every option in the Greek courts?'), chips: [L('Ναι', 'Yes'), L('Όχι', 'No'), L('Δεν ξέρω', 'Not sure')] },
        WHEN
      ]
    },
    {
      id: 'other', icon: icons.other,
      name: L('Άλλο', 'Other'),
      blurb: L('Κάτι που δεν εντάσσεται στα παραπάνω', 'Something that doesn’t fit above'),
      topicEl: 'ελληνικό δίκαιο', topicEn: 'Greek law',
      questions: [
        { q: L('Πόσο επείγον είναι;', 'How urgent is it?'), chips: [L('Πολύ επείγον — τρέχει προθεσμία', 'Very urgent — a deadline is running'), L('Μέσα στους επόμενους μήνες', 'Within the next months'), L('Απλή ενημέρωση', 'Just information')] },
        { q: L('Τι τύπου είναι το πρόβλημα;', 'What type of problem is it?'), chips: [L('Διαφορά με άλλο πρόσωπο', 'Dispute with another person'), L('Διαφορά με επιχείρηση', 'Dispute with a business'), L('Διαφορά με το Δημόσιο', 'Dispute with the State'), L('Θέλω να προλάβω ένα πρόβλημα', 'I want to prevent a problem')] },
        WHEN
      ]
    }
  ];

  const STOPWORDS = new Set(('μετά πριν μέσα κατά λόγω σχετικά επειδή λοιπόν όμως ούτε μόνο πολύ πιο καθώς ακόμα ακόμη χωρίς μέχρι παρά κάθε όλα όλοι έχουν έχουμε είχα ήταν ηταν και η ο το οι τα των του της την τον τους τις στο στη στην στον στους στις για με από σε να θα δεν που ότι αν ή είναι ειναι έχω εχω έχει εχει μου σου μας σας μια ένα ενα μία μιας ενός πως πώς τι ποιο ποια πρέπει μπορώ μπορεί ήθελα θέλω θελω αλλά αλλα όταν οταν επίσης ήδη απο the a an and or of to in on at for with from is are was were be been have has had my your our i you we they it this that these those can could should would will do does did not no yes what how when where why who which about as by if but so than then there their them me us').split(/\s+/));

  window.GL_DATA = { UI, CATEGORIES, SOURCES, STOPWORDS };
})();
