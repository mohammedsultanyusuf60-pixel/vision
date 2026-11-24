# 📚 Vision Language School of English — Full-Stack System Documentation

**ትምህርት ቤት (Institution):** Vision Language School of English  
**አድራሻ (Location):** ከሚሴ ከተማ፣ ውሃ ልማት ፊት ለፊት (Kemissie, In front of Water Development)  
**ዋና መምህር እና አስተዳዳሪ (Lead Instructor & Admin):** መምህር መሀመድ አብዱ (Teacher Mohammed Abdu)  
**ስልክ (Contact):** `0919466511`

---

## 1. የሲስተሙ አጠቃላይ ገፅታ (System Overview & Architecture)

ይህ ፕሮጀክት ተማሪዎች እንግሊዝኛን ከመሰረቱ (ከፊደል `'A'`) ጀምረው አቀላጥፈው እስኪናገሩ ድረስ በ **265 የተደራጁ ትምህርቶች**፣ በድምፅ አነባበብ (Text-to-Speech)፣ በማይክሮፎን የንግግር መለማመጃ (Speech-to-Text) እና በፈተና የሚማሩበት ሙሉ **Full-Stack Web Application** ነው።

### የቴክኖሎጂ ስብስብ (Tech Stack)
* **Frontend (የተጠቃሚ ገፅ):** HTML5, Tailwind CSS, Vanilla JavaScript (ES6+), Web Speech API (`speechSynthesis` & `SpeechRecognition`)
* **Backend (ሰርቨር):** Node.js & Express.js (`server.js`)
* **Database (ዳታቤዝ):** MySQL (`schema.sql`) + `localStorage` (ለፈጣን Offline/Preview አጠቃቀም)

---

## 2. የፋይሎች አደረጃጀት (Project File Structure)

```text
vision-language-school/
├── index.html                   # ሙሉ Frontend (Landing Page, Student Portal, Admin Dashboard)
├── server.js                    # Node.js & Express REST API Server
├── schema.sql                   # MySQL Database Tables & Seed Data
├── package.json                 # የ Node.js ፓኬጆች ዝርዝር (express, mysql2, cors)
└── FULL_STACK_DOCUMENTATION.md  # የፕሮጀክቱ ሙሉ መመሪያ ሰነድ
```

---

## 3. ዋና ዋና ባህሪያት (Core Features)

### ሀ. ለጎብኚዎች እና ለአዳዲስ ተማሪዎች (Public Landing Page)
1. **ሙሉ የሁለት ቋንቋ መቀየሪያ (`🌐 English ⇄ 🌐 አማርኛ`):** በአንድ ንክኪ ሙሉ ድረ-ገጹን እና 265ቱንም ትምህርቶች ከአማርኛ ወደ እንግሊዝኛ ይቀይራል።
2. **የተመረቁ ተማሪዎች የምረቃ ፎቶዎች (8-Slide Graduation Gallery):** 8 የምረቃ ፎቶዎችን ከመግለጫ ጋር በስላይደር ያሳያል።
3. **አሁን እየተማሩ ያሉ ተማሪዎች ፎቶዎች (Active Students Gallery):** በክፍል ውስጥ የሚደረጉ የንግግር ልምምዶችን ፎቶ ያሳያል።
4. **የኦንላይን መመዝገቢያ ፎርም (Online Registration):** አዲስ ተማሪ ሲመዘገብ መረጃው በ **"Pending Approval"** ሁኔታ ወደ መምህሩ Admin ይላካል።
5. **ቀጥታ መገናኛ (Floating Telegram & WhatsApp):** በአንድ ንክኪ ለመምህር መሀመድ አብዱ (`0919466511`) መልዕክት መላኪያ።

### ለ. የተማሪዎች መማሪያ ፖርታል (Protected 265-Lesson Student Portal)
* **የተቆለፈ መግቢያ (Authenticated Access):** ተማሪው በመምህሩ ተቀባይነት አግኝቶ (`Active`) የተሰጠውን **Student ID** እና **Password** ሲያስገባ ብቻ ይከፈታል።
* **265 ዝርዝር ትምህርቶች:** ከፊደል `A-Z` ጀምሮ እስከ `12 Tenses` እና `Public Speaking` ድረስ እያንዳንዱ ርዕስ፡
  * ዋና ህግ/ፎርሙላ (Core Rule)
  * ሰፊ የአማርኛ እና እንግሊዝኛ ማስታወሻ (In-Depth Notes)
  * **10 ዝርዝር ምሳሌዎች ከድምፅ ጋር (10 Audio Examples)**
  * **የማይክሮፎን ንግግር መለማመጃ (Speaking Practice)**
  * **የማጠቃለያ ፈተና (Quiz)** ያካትታል።
* **የመምህር ልዩ ማስታወሻዎች እና ፈተናዎች:** መምህሩ በ Admin የሚለቋቸውን ልዩ ማስታወሻዎች እና ጥያቄዎች ተማሪዎች እየሰሩ `+10` ነጥብ ያገኛሉ።
* **የምረቃ ሰርተፊኬት ማውረጃ (Certificate Generator):** ተማሪዎች ስማቸው የተጻፈበትን የምስክር ወረቀት በቀጥታ ማተም (Save as PDF) ይችላሉ።

### ሐ. የመምህር መሀመድ አብዱ መቆጣጠሪያ (Teacher Admin Dashboard)
* **ነባሪ መግቢያ (Default Admin Credentials):**
  * **Username:** `mohammed`
  * **Password:** `admin123`
* **የአስተዳዳሪ ተግባራት:**
  1. አዲስ የተመዘገቡ ተማሪዎችን ማፅደቅ (`Accept`) ወይም መሰረዝ (`Reject`)።
  2. ተማሪን በቀጥታ መመዝገብ እና `Student ID` / `Password` መስጠት።
  3. የተማሪን መረጃ እና የረሳውን `Password` ማስተካከል (`Edit / Reset Password`)።
  4. ለተማሪው **ሙሉ 265 ኮርሶችን በአንድ ጊዜ መክፈት (`VIP Full Access`)** ወይም በደረጃ-በደረጃ (`Step-by-Step`) ማድረግ።
  5. ትምህርት ያቋረጠ ተማሪን ማገድ (`Suspend`) እና ሲመለስ መመለስ (`Activate`)።
  6. ለተማሪዎች **ልዩ ማስታወሻ (Note) እና የፈተና ጥያቄ (Quiz)** መልቀቅ።
  7. የምረቃ ጋለሪ ፎቶዎችን እና የአሁን ተማሪዎችን ፎቶዎች ከስልክ/ኮምፒውተር መጫን (`Upload`)።

---

## 4. የዳታቤዝ መዋቅር (MySQL Database Schema)

በ `schema.sql` ውስጥ የተካተቱት ዋና ዋና ቴብሎች፦

| ቴብል ስም (Table) | ተግባሩ (Description) |
| :--- | :--- |
| `levels` | 5ቱን የትምህርት ደረጃዎች (ከ Absolute Beginner እስከ Fluent Speaker) ይይዛል። |
| `units` | በየደረጃው ስር ያሉ ምዕራፎችን (Units) ይይዛል። |
| `lessons` | 265ቱን ትምህርቶች፣ ማብራሪያዎች እና የንግግር መለማመጃ ዓረፍተ ነገሮችን ይይዛል። |
| `quizzes` | ለእያንዳንዱ ትምህርት የተዘጋጁ የፈተና ጥያቄዎችን እና መልሶችን ይይዛል። |
| `students` | የተማሪዎችን `student_id`, `full_name`, `phone`, `program`, `shift`, `password`, `status` (`pending`/`active`/`suspended`), `full_access` እና `total_score` ይይዛል። |
| `teacher_notes` | መምህር መሀመድ አብዱ በ Admin የሚለቋቸውን ልዩ ማስታወሻዎች እና ፈተናዎች ይይዛል። |

---

## 5. የ Backend REST API ዝርዝር (`server.js`)

| Method | Endpoint | ተግባሩ (Purpose) |
| :--- | :--- | :--- |
| `POST` | `/api/register` | አዲስ ተማሪ ከድረ-ገጹ ሲመዘገብ በ `pending` ሁኔታ ያስቀምጣል። |
| `POST` | `/api/student/login` | ተማሪው በ `student_id` እና `password` እንዲገባ ያረጋግጣል። |
| `GET` | `/api/admin/students` | ሁሉንም ተማሪዎች ለ Admin ዳሽቦርድ ያመጣል። |
| `POST` | `/api/admin/students` | መምህሩ አዲስ ተማሪ በቀጥታ እንዲመዘግብ ያደርጋል። |
| `PATCH` | `/api/admin/students/:studentId/control` | የተማሪውን `status`, `full_access` እና `password` ያስተካክላል። |
| `POST` | `/api/admin/notes` | መምህሩ አዲስ ማስታወሻ እና የፈተና ጥያቄ ይለቃል። |
| `GET` | `/api/notes` | የተለቀቁ የመምህር ማስታወሻዎችን ለተማሪዎች ያሳያል። |
| `GET` | `/api/curriculum` | ሙሉ የትምህርት ካሪኩለም እና የተማሪውን እድገት ያመጣል። |
| `POST` | `/api/progress` | ተማሪው ፈተና ሲያልፍ ነጥብ ይጨምራል እና ቀጣዩን ትምህርት ይከፍታል። |

---

## 6. በኮምፒውተር ወይም ሰርቨር ላይ የመጫኛ መመሪያ (Setup & Installation Guide)

1. **MySQL ዳታቤዝ መፍጠር:**
   * MySQL Workbench ወይም phpMyAdmin ከፍተው `schema.sql` ፋይሉን ያስኪዱ (Run)።
2. **Backend ሰርቨር ማስነሳት:**
   ```bash
   npm init -y
   npm install express mysql2 cors
   node server.js
   ```
   *(ሰርቨሩ በ `http://localhost:5000` ላይ ይነሳል።)*
3. **Frontend መክፈት:**
   * `index.html` ፋይሉን በማንኛውም ብራውዘር (Chrome / Edge) በመክፈት መጠቀም ይቻላል።