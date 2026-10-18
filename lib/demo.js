'use strict';

const DEMO_EL = `> **ΛΕΙΤΟΥΡΓΙΑ ΕΠΙΔΕΙΞΗΣ** — Δεν έχει οριστεί \`LLM_API_KEY\`. Η παρακάτω απάντηση είναι προκαθορισμένη και **δεν** αποτελεί νομική ανάλυση της δικής σας υπόθεσης.

## 1. Σύντομη εκτίμηση
Με βάση όσα περιγράψατε, πρόκειται για ζήτημα που φαίνεται να εμπίπτει στο αστικό δίκαιο. Η θέση σας μπορεί να είναι ισχυρή αν υπάρχει γραπτό αποδεικτικό υλικό, αλλά χρειάζονται περισσότερα στοιχεία.

## 2. Εφαρμοστέο δίκαιο
- **Άρθρο 914 ΑΚ** — γενική ευθύνη από αδικοπραξία (παράνομη και υπαίτια πρόκληση ζημίας).
- **Άρθρο 361 ΑΚ** — ελευθερία των συμβάσεων.
- **Άρθρο 281 ΑΚ** — απαγόρευση κατάχρησης δικαιώματος.

## 3. Παρόμοια νομολογία / υποθέσεις
Στη λειτουργία επίδειξης δεν παραπέμπω σε συγκεκριμένες αποφάσεις. Με ενεργό μοντέλο, θα αναφέρονται μόνο αποφάσεις για τις οποίες υπάρχει βεβαιότητα. Χρησιμοποιήστε τους συνδέσμους «Αναζήτηση νομολογίας» κάτω από την απάντηση.

## 4. Βήματα που πρέπει να κάνετε
1. Συγκεντρώστε συμβάσεις, μηνύματα, αποδείξεις και φωτογραφίες.
2. Καταγράψτε χρονολογικά τα γεγονότα.
3. Στείλτε εξώδικη δήλωση/πρόσκληση (προαιρετικά, αλλά συχνά χρήσιμη).
4. Εξετάστε διαμεσολάβηση ή αγωγή στο αρμόδιο δικαστήριο.

## 5. Προθεσμίες και παραγραφές
- Αξιώσεις από αδικοπραξία: παραγραφή **5 ετών** από τότε που ο παθών έμαθε τη ζημία και τον υπόχρεο (άρθρο 937 ΑΚ), και σε κάθε περίπτωση 20 έτη.
- Οι προθεσμίες ενδίκων μέσων εξαρτώνται από το είδος της απόφασης.

## 6. Πότε να απευθυνθείτε σε δικηγόρο
Άμεσα αν τρέχει προθεσμία, αν έχετε λάβει δικόγραφο, αν το ποσό είναι σημαντικό ή αν εμπλέκεται ποινική δίωξη.

## Τι χρειάζομαι να μάθω
- Πότε ακριβώς συνέβη το γεγονός;
- Υπάρχει γραπτή σύμβαση ή άλλη απόδειξη;
- Ποιο είναι το περίπου ποσό της διαφοράς;

_Ενημερωτική καθοδήγηση — δεν υποκαθιστά τη συμβουλή αδειούχου δικηγόρου._`;

const DEMO_EN = `> **DEMO MODE** — \`LLM_API_KEY\` is not set. The answer below is canned and is **not** legal analysis of your actual case.

## 1. Brief assessment
Based on what you describe, this appears to fall under Greek civil law. Your position may be strong if you have written evidence, but more facts are needed.

## 2. Applicable law
- **Article 914 ΑΚ (Αστικός Κώδικας — Civil Code)** — general tort liability: whoever unlawfully and culpably causes damage must compensate.
- **Article 361 ΑΚ** — freedom of contract.
- **Article 281 ΑΚ** — prohibition of abuse of rights.

## 3. Similar case law
In demo mode I do not cite specific decisions. With a live model, only decisions the model is confident exist will be cited. Use the "Case-law search" links below the answer.

## 4. Steps to take
1. Gather contracts, messages, receipts and photos.
2. Write a dated timeline of events.
3. Send an extrajudicial notice (optional, but often useful).
4. Consider mediation or a lawsuit before the competent court.

## 5. Deadlines and limitation periods
- Tort claims: **5-year** limitation from when the injured party learned of the damage and the liable person (**Article 937 ΑΚ**), and 20 years at most.
- Appeal deadlines depend on the type of judgment.

## 6. When to see a lawyer
Right away if a deadline is running, if you received court papers, if the amount is significant or if criminal proceedings are involved.

## What I need to know
- When exactly did it happen?
- Is there a written contract or other evidence?
- What is the approximate amount in dispute?

_Informational guidance — not a substitute for advice from a licensed lawyer._`;

function hasGreek(s) { return /[\u0370-\u03ff\u1f00-\u1fff]/.test(s || ''); }
function hasLatin(s) { return /[A-Za-z]/.test(s || ''); }

// Same rule as the system prompt: reply in the language the user wrote in.
function pickLang(lastUserText, uiLang) {
  if (hasGreek(lastUserText)) return 'el';
  if (hasLatin(lastUserText)) return 'en';
  return uiLang === 'en' ? 'en' : 'el';
}

function demoAnswer(lastUserText, uiLang) {
  return pickLang(lastUserText, uiLang) === 'en' ? DEMO_EN : DEMO_EL;
}

module.exports = { demoAnswer, pickLang };
