-- የዳታቤዝ መፍጠሪያ (Create Database)
CREATE DATABASE IF NOT EXISTS english_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english_school_db;

-- 1. የትምህርት ደረጃዎች ቴብል (Levels Table)
CREATE TABLE IF NOT EXISTS levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    title_am VARCHAR(150) NOT NULL,
    description_am TEXT,
    icon VARCHAR(50) DEFAULT '📚'
);

-- 2. የምዕራፎች ቴብል (Units/Chapters Table)
CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    unit_number INT NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    title_am VARCHAR(150) NOT NULL,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);

-- 3. የትምህርት ርዕሶች ቴብል (Lessons Table - 265 ትምህርቶች)
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    lesson_number INT NOT NULL,
    title_en VARCHAR(150) NOT NULL,
    title_am VARCHAR(150) NOT NULL,
    content_en TEXT NOT NULL,
    explanation_am TEXT NOT NULL,
    speaking_practice_phrase VARCHAR(255) NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 4. የፈተና ጥያቄዎች ቴብል (Quizzes Table)
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    question_am TEXT NOT NULL,
    option_a VARCHAR(200) NOT NULL,
    option_b VARCHAR(200) NOT NULL,
    option_c VARCHAR(200) NOT NULL,
    correct_option CHAR(1) NOT NULL DEFAULT 'A',
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 5. የተማሪዎች መለያ፣ ፓስወርድ እና እድገት መከታተያ (Students & Progress Table)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(30) UNIQUE NOT NULL, -- ለምሳሌ: VLS-1001
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    program VARCHAR(80) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
    full_access BOOLEAN DEFAULT FALSE,
    unlocked_lesson_id INT DEFAULT 1,
    total_score INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- የመጀመሪያ ናሙና ተማሪ
INSERT IGNORE INTO students (student_id, full_name, phone, program, shift, password, status, full_access, unlocked_lesson_id, total_score)
VALUES ('VLS-1001', 'Ahmed Mohammed', '0911000000', 'Spoken English', 'Morning', '123', 'active', FALSE, 1, 0);

-- 6. የመምህር መሀመድ አብዱ ልዩ ማስታወሻዎች እና ፈተናዎች (Teacher Notes & Questions Table)
CREATE TABLE IF NOT EXISTS teacher_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    core_rule VARCHAR(255) NOT NULL,
    detailed_body TEXT NOT NULL,
    quiz_question TEXT NOT NULL,
    option_a VARCHAR(200) NOT NULL,
    option_b VARCHAR(200) NOT NULL,
    option_c VARCHAR(200) NOT NULL,
    correct_index TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ደረጃዎችን ማስገባት (Levels)
INSERT IGNORE INTO levels (id, level_number, title_en, title_am, description_am, icon) VALUES
(1, 1, 'Absolute Beginner', 'ደረጃ 1፡ ፍፁም ጀማሪ (ፊደላት A-Z)', 'ከእንግሊዝኛ ፊደላት (A-Z) እና መሰረታዊ ድምፆች ጀምሮ መማር።', '🔤'),
(2, 2, 'Basic Grammar', 'ደረጃ 2፡ መሰረታዊ ሰዋሰው', 'ስሞች፣ ተውላጠ ስሞች እና ቀላል ዓረፍተ ነገር መስራት።', '🧱'),
(3, 3, 'Tenses & Structure', 'ደረጃ 3፡ የጊዜ አመልካች ሰዋሰው', 'የአሁን፣ ያለፈ እና የወደፊት ጊዜያት አጠቃቀም።', '⏳'),
(4, 4, 'Intermediate Speaking', 'ደረጃ 4፡ የዕለት ተዕለት ንግግር', 'ገበያ፣ ሆቴል እና መንገድ ላይ የሚደረጉ ውይይቶች።', '💬'),
(5, 5, 'Fluent Speaker', 'ደረጃ 5፡ አቀላጥፎ መናገር', 'የመድረክ ንግግር፣ ክርክር እና ፕሮፌሽናል እንግሊዝኛ።', '🎙️');

-- ምዕራፎችን ማስገባት (Units)
INSERT IGNORE INTO units (id, level_id, unit_number, title_en, title_am) VALUES
(1, 1, 1, 'The Alphabet & Phonics', 'ምዕራፍ 1፡ የእንግሊዝኛ ፊደላት እና አነባበብ'),
(2, 1, 2, 'Basic Greetings', 'ምዕራፍ 2፡ መሰረታዊ ሰላምታዎች'),
(3, 2, 1, 'Pronouns & Verb to Be', 'ምዕራፍ 1፡ ተውላጠ ስሞች እና አገናኝ ግሶች');

-- ናሙና ትምህርቶችን ማስገባት (Sample Lessons)
INSERT IGNORE INTO lessons (id, unit_id, lesson_number, title_en, title_am, content_en, explanation_am, speaking_practice_phrase) VALUES
(1, 1, 1, 'Letter A & B', 'ፊደል A እና B', 'A is for Apple. B is for Ball.', 'በእንግሊዝኛ ፊደል A (ኤይ) እና B (ቢ) በመባል ይነበባሉ። ቃላት ውስጥ ሲገቡ የሚኖራቸውን ድምፅ ይስሙ።', 'A is for Apple and B is for Ball'),
(2, 1, 2, 'Vowels (A, E, I, O, U)', 'አናባቢ ፊደላት', 'The five vowels are A, E, I, O, U.', 'በእንግሊዝኛ ቋንቋ 5 አናባቢ (Vowels) ፊደላት አሉ። እነሱም A, E, I, O, U ናቸው።', 'The five vowels are A E I O U'),
(3, 2, 1, 'Hello & How are you?', 'ሰላምታ መስጠት', 'Hello! Good morning. How are you today? I am fine, thank you.', 'ሰዎችን ስናገኝ በትህትና ሰላምታ ለመስጠት Hello ወይም Good morning እንጠቀማለን።', 'Hello good morning how are you today'),
(4, 3, 1, 'I am, You are, He is', 'አገናኝ ግሶች (Verb to be)', 'I am a student. You are my friend. He is a teacher.', 'ስለራሳችን ወይም ስለሌሎች ማንነት ለመናገር am, is, are እንጠቀማለን።', 'I am a student and you are my friend');

-- ናሙና ፈተናዎችን ማስገባት (Sample Quizzes)
INSERT IGNORE INTO quizzes (id, lesson_id, question_am, option_a, option_b, option_c, correct_option) VALUES
(1, 1, '"Apple" በየትኛው ፊደል ይጀምራል?', 'B', 'A', 'C', 'B'),
(2, 2, 'ከሚከተሉት ውስጥ አናባቢ (Vowel) ፊደል የትኛው ነው?', 'B', 'K', 'E', 'C'),
(3, 3, 'ጠዋት ላይ ሰላምታ ለመስጠት የትኛውን እንጠቀማለን?', 'Good night', 'Good morning', 'Goodbye', 'B'),
(4, 4, 'ከ "I" ጋር አብሮ የሚሄደው አገናኝ ግስ የቱ ነው?', 'is', 'are', 'am', 'C');