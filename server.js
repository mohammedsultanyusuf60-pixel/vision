const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 👉 1. የ HTML እና CSS ፋይሎች የሚገኙበትን አቃፊ (Current Directory) በስታቲክነት ማሳየት
app.use(express.static(__dirname));

// የ MySQL ዳታቤዝ ግንኙነት (MySQL Connection Pool) — ከትክክለኛው ዳታቤዝ ስም ጋር
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kemissie_gebiwoch',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 0. ተማሪ ከድረ-ገጹ ሲመዘገብ (Pending Approval)
app.post('/api/register', async (req, res) => {
    try {
        const { student_id, full_name, phone, program, shift, password } = req.body;
        await pool.query(
            'INSERT INTO students (student_id, full_name, phone, program, shift, password, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
            [student_id, full_name, phone, program, shift, password]
        );
        res.json({ success: true, message: 'ምዝገባዎ ለ Admin ተልኳል።' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'ምዝገባውን ማስቀመጥ አልተቻለም።' });
    }
});

// 1. Admin ተማሪ መመዝገቢያ እና ID/Password መስጫ API
app.post('/api/admin/students', async (req, res) => {
    try {
        const { student_id, full_name, phone, program, shift, password, full_access } = req.body;
        const unlocked = full_access ? 265 : 1;
        await pool.query(
            'INSERT INTO students (student_id, full_name, phone, program, shift, password, status, full_access, unlocked_lesson_id) VALUES (?, ?, ?, ?, ?, ?, "active", ?, ?)',
            [student_id, full_name, phone, program, shift, password, Boolean(full_access), unlocked]
        );
        res.json({ success: true, message: 'ተማሪው በተሳካ ሁኔታ ተመዝግቧል።' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'ይህ Student ID ቀድሞ ተመዝግቧል ወይም የዳታቤዝ ስህተት አለ።' });
    }
});

// 1.5. Admin ተማሪን ማፅደቅ (Accept)፣ ማገድ ወይም ሙሉ ኮርስ መክፈቻ API
app.patch('/api/admin/students/:studentId/control', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, full_access, full_name, phone, password } = req.body;
        const unlocked = full_access ? 265 : 1;
        await pool.query(
            `UPDATE students 
             SET status = COALESCE(?, status), 
                 full_access = COALESCE(?, full_access), 
                 unlocked_lesson_id = GREATEST(unlocked_lesson_id, ?),
                 full_name = COALESCE(?, full_name),
                 phone = COALESCE(?, phone),
                 password = COALESCE(?, password)
             WHERE student_id = ?`,
            [status, full_access !== undefined ? Boolean(full_access) : null, unlocked, full_name, phone, password, studentId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ማሻሻያውን ማስቀመጥ አልተቻለም።' });
    }
});

// 2. ሁሉንም የተመዘገቡ ተማሪዎች ለ Admin ማሳያ API
app.get('/api/admin/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
        res.json({ students: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'የተማሪዎችን ዝርዝር ማምጣት አልተቻለም።' });
    }
});

// 3. ተማሪ በተሰጠው Student ID እና Password መግቢያ API
app.post('/api/student/login', async (req, res) => {
    try {
        const { student_id, password } = req.body;
        const [rows] = await pool.query(
            'SELECT * FROM students WHERE student_id = ? AND password = ?',
            [student_id, password]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'የተሳሳተ Student ID ወይም Password!' });
        }
        if (rows[0].status === 'pending') {
            return res.status(403).json({ error: 'ምዝገባዎ በመምህሩ እስኪፀድቅ (Accept) በመጠባበቅ ላይ ነው!' });
        }
        if (rows[0].status === 'suspended') {
            return res.status(403).json({ error: 'አካውንትዎ በትምህርት ቤቱ ታግዷል።' });
        }
        res.json({ success: true, student: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'የሰርቨር ስህተት ተፈጥሯል።' });
    }
});

// 3.5. መምህር በ Admin ማስታወሻ እና ጥያቄ መልቀቂያ API
app.post('/api/admin/notes', async (req, res) => {
    try {
        const { title, core_rule, detailed_body, quiz_question, option_a, option_b, option_c, correct_index } = req.body;
        await pool.query(
            'INSERT INTO teacher_notes (title, core_rule, detailed_body, quiz_question, option_a, option_b, option_c, correct_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, core_rule, detailed_body, quiz_question, option_a, option_b, option_c, correct_index]
        );
        res.json({ success: true, message: 'ማስታወሻው እና ጥያቄው ተለቋል።' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ማስታወሻውን መልቀቅ አልተቻለም።' });
    }
});

app.get('/api/notes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM teacher_notes ORDER BY id DESC');
        res.json({ notes: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ማስታወሻዎችን ማምጣት አልተቻለም።' });
    }
});

// 4. ሙሉ የትምህርት ካሪኩለም እና የተማሪውን እድገት ማምጫ API
app.get('/api/curriculum', async (req, res) => {
    try {
        const studentId = req.query.student_id || 'VLS-1001';
        const [stuRows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
        const progress = stuRows[0] || { unlocked_lesson_id: 1, total_score: 0, streak_days: 1, full_access: false };
        const maxUnlocked = progress.full_access ? 265 : progress.unlocked_lesson_id;

        const [levels] = await pool.query('SELECT * FROM levels ORDER BY level_number ASC');
        const [units] = await pool.query('SELECT * FROM units ORDER BY unit_number ASC');
        const [lessons] = await pool.query('SELECT id, unit_id, lesson_number, title_en, title_am FROM lessons ORDER BY lesson_number ASC');

        const structuredCurriculum = levels.map(level => {
            const levelUnits = units.filter(u => u.level_id === level.id).map(unit => {
                const unitLessons = lessons.filter(l => l.unit_id === unit.id).map(lesson => ({
                    ...lesson,
                    is_locked: lesson.id > maxUnlocked,
                    is_completed: lesson.id < maxUnlocked
                }));
                return { ...unit, lessons: unitLessons };
            });
            return { ...level, units: levelUnits };
        });

        res.json({
            progress,
            totalLessonsCount: lessons.length,
            curriculum: structuredCurriculum
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'የዳታቤዝ ስህተት ተፈጥሯል' });
    }
});

// 5. የአንድን ትምህርት ሙሉ ይዘት እና ፈተና ማምጫ API
app.get('/api/lessons/:id', async (req, res) => {
    try {
        const lessonId = req.params.id;
        const [lessonRows] = await pool.query('SELECT * FROM lessons WHERE id = ?', [lessonId]);
        if (lessonRows.length === 0) {
            return res.status(404).json({ error: 'ትምህርቱ አልተገኘም' });
        }
        const [quizRows] = await pool.query('SELECT * FROM quizzes WHERE lesson_id = ?', [lessonId]);
        res.json({
            lesson: lessonRows[0],
            quiz: quizRows[0] || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ትምህርቱን ማምጣት አልተቻለም' });
    }
});

// 6. ፈተና ሲያልፍ ውጤት መመዝገቢያ እና ቀጣዩን ትምህርት መክፈቻ API
app.post('/api/progress', async (req, res) => {
    try {
        const { student_id, lessonId, scorePercentage } = req.body;
        if (scorePercentage >= 70) {
            const nextLessonId = parseInt(lessonId, 10) + 1;
            if (student_id) {
                await pool.query(
                    `UPDATE students 
                     SET unlocked_lesson_id = GREATEST(unlocked_lesson_id, ?), 
                         total_score = total_score + 10
                     WHERE student_id = ?`,
                    [nextLessonId, student_id]
                );
            }
            res.json({
                success: true,
                message: 'እንኳን ደስ ያለህ! ቀጣዩ ትምህርት ተከፍቶልሃል።',
                nextLessonId
            });
        } else {
            res.json({
                success: false,
                message: 'ቀጣዩን ትምህርት ለመክፈት ቢያንስ 70% ማምጣት አለብህ። እንደገና ሞክር!'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ውጤቱን መመዝገብ አልተቻለም' });
    }
});

// 7. 265 ትምህርቶችን በአንድ ጊዜ ወደ MySQL መጫኛ (Bulk Seed Endpoint)
app.post('/api/seed-lessons', async (req, res) => {
    try {
        const { lessons } = req.body;
        if (!Array.isArray(lessons)) return res.status(400).json({ error: 'Invalid data' });
        for (const l of lessons) {
            await pool.query(
                'INSERT IGNORE INTO lessons (id, unit_id, lesson_number, title_en, title_am, content_en, explanation_am, speaking_practice_phrase) VALUES (?, 1, ?, ?, ?, ?, ?, ?)',
                [l.id, l.id, l.titleEn, l.titleAm, l.contentEn, l.explanationAm, l.speakPhrase]
            );
        }
        res.json({ success: true, count: lessons.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bulk insert failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Vision Language School Server running on http://localhost:${PORT}`);
});