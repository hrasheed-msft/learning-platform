# Content Creation Guide

This guide explains how to create and manage educational content for the Islamic Studies Learning Platform.

---

## 📋 Table of Contents

1. [Content Structure Overview](#content-structure-overview)
2. [Creating Courses](#creating-courses)
3. [Creating Units](#creating-units)
4. [Adding Rich Content](#adding-rich-content)
5. [Creating Quiz Questions](#creating-quiz-questions)
6. [Adding Arabic Terms](#adding-arabic-terms)
7. [Adding Media Resources](#adding-media-resources)
8. [Using Prisma Studio](#using-prisma-studio)
9. [Seeding Content Programmatically](#seeding-content-programmatically)
10. [Content Best Practices](#content-best-practices)

---

## 📚 Content Structure Overview

The platform uses a hierarchical content structure:

```
Course
├── Unit 1
│   ├── Content (HTML/Text)
│   ├── Video Resources
│   ├── Audio Resources
│   ├── Arabic Terms
│   └── Quiz Questions
├── Unit 2
│   └── ...
└── Unit 3
    └── ...
```

### Key Concepts

| Entity | Description |
|--------|-------------|
| **Course** | A complete learning module on a topic (e.g., "Introduction to Tawheed") |
| **Unit** | A lesson within a course, containing content and assessments |
| **VideoResource** | YouTube or hosted video content for a unit |
| **AudioResource** | Audio files (Quran recitation, lectures, etc.) |
| **ArabicTerm** | Arabic vocabulary with transliteration and translation |
| **Question** | Quiz questions with multiple formats |

---

## 🎓 Creating Courses

### Course Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Course title (e.g., "Introduction to Tawheed") |
| `description` | String | ✅ | Brief course description |
| `category` | String | ✅ | One of: `QURAN`, `HADITH`, `FIQH`, `SEERAH`, `ARABIC`, `TAFSIR`, `AQEEDAH` |
| `ageLevels` | String[] | ✅ | Array of: `EARLY_CHILD`, `CHILD`, `PRE_TEEN`, `TEEN`, `ADULT` |
| `thumbnailUrl` | String | ❌ | URL to course thumbnail image |
| `isPublished` | Boolean | ❌ | Whether course is visible to users (default: false) |

### Example Course Creation (SQL)

```sql
INSERT INTO courses (id, title, description, category, "ageLevels", "isPublished", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Introduction to Salah',
  'Learn how to perform the five daily prayers correctly with step-by-step guidance.',
  'FIQH',
  ARRAY['CHILD', 'PRE_TEEN', 'TEEN'],
  true,
  NOW(),
  NOW()
);
```

### Example Course Creation (Prisma)

```typescript
const course = await prisma.course.create({
  data: {
    title: 'Introduction to Salah',
    description: 'Learn how to perform the five daily prayers correctly.',
    category: 'FIQH',
    ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'],
    isPublished: true,
  },
});
```

---

## 📖 Creating Units

Units are the building blocks of a course. Each unit should focus on one specific topic or lesson.

### Unit Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Unit title |
| `description` | String | ❌ | Brief unit description |
| `content` | String | ❌ | Rich HTML content for reading |
| `orderIndex` | Int | ✅ | Order within the course (0, 1, 2...) |
| `courseId` | String | ✅ | Reference to parent course |

### Example Unit Creation (Prisma)

```typescript
const units = await Promise.all([
  prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'The Importance of Salah',
      description: 'Why prayer is the second pillar of Islam',
      orderIndex: 0,
      content: '<h2>The Importance of Salah</h2><p>Salah is the second pillar of Islam...</p>',
    },
  }),
  prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Wudu (Ablution)',
      description: 'How to prepare for prayer',
      orderIndex: 1,
      content: '<h2>Wudu</h2><p>Before praying, we must perform wudu...</p>',
    },
  }),
]);
```

---

## ✍️ Adding Rich Content

Unit content supports HTML for rich formatting. Here are recommended elements:

### Supported HTML Elements

```html
<!-- Headings -->
<h2>Main Section Title</h2>
<h3>Subsection Title</h3>
<h4>Minor Heading</h4>

<!-- Paragraphs -->
<p>Regular paragraph text with <strong>bold</strong> and <em>italic</em> text.</p>

<!-- Lists -->
<ul>
  <li>Unordered list item</li>
</ul>
<ol>
  <li>Ordered list item</li>
</ol>

<!-- Quran Verses -->
<div class="quran-verse">
  <p class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
  <p>In the name of Allah, the Most Gracious, the Most Merciful.</p>
</div>

<!-- Hadith -->
<div class="hadith">
  <p>"The best of you are those who learn the Quran and teach it."</p>
  <cite>— Sahih Bukhari</cite>
</div>

<!-- Did You Know Box -->
<div class="example-box">
  <h4>🌟 Did You Know?</h4>
  <p>Interesting fact or additional information here.</p>
</div>

<!-- Activity Box -->
<div class="activity-box">
  <h4>📝 Activity</h4>
  <p>Instructions for a learning activity.</p>
</div>

<!-- Warning/Important -->
<div class="warning-box">
  <h4>⚠️ Important</h4>
  <p>Important note or warning.</p>
</div>
```

### Content Template

```html
<h2>Unit Title</h2>
<p>Introduction paragraph explaining what learners will learn.</p>

<h3>Main Concept 1</h3>
<p>Explanation of the first concept...</p>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>

<h3>Main Concept 2</h3>
<p>Explanation of the second concept...</p>

<div class="quran-verse">
  <p class="arabic">Arabic text here</p>
  <p>Translation here [Surah Name, Verse Number]</p>
</div>

<div class="example-box">
  <h4>🌟 Did You Know?</h4>
  <p>An interesting fact related to the topic.</p>
</div>

<h3>Summary</h3>
<p>Recap of key points learned in this unit.</p>

<div class="activity-box">
  <h4>📝 Reflection Activity</h4>
  <p>Think about how you can apply this in your daily life...</p>
</div>
```

---

## ❓ Creating Quiz Questions

Each unit should have quiz questions to assess understanding.

### Question Types

| Type | Description |
|------|-------------|
| `MULTIPLE_CHOICE` | Select one correct answer from options |
| `TRUE_FALSE` | True or False questions |
| `MATCHING` | Match items from two columns |
| `FILL_BLANK` | Fill in the blank |

### Question Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | String | ✅ | Question type (see above) |
| `questionText` | String | ✅ | The question |
| `options` | JSON | ❌ | Array of answer options |
| `correctAnswer` | String | ✅ | The correct answer |
| `explanation` | String | ❌ | Explanation shown after answering |
| `difficulty` | String | ❌ | `EASY`, `MEDIUM`, or `HARD` |
| `unitId` | String | ✅ | Reference to parent unit |

### Example: Multiple Choice Question

```typescript
await prisma.question.create({
  data: {
    unitId: unit.id,
    type: 'MULTIPLE_CHOICE',
    questionText: 'How many times a day do Muslims pray?',
    options: JSON.stringify([
      'Three times',
      'Five times',
      'Seven times',
      'Ten times',
    ]),
    correctAnswer: 'Five times',
    explanation: 'Muslims pray five obligatory prayers each day: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    difficulty: 'EASY',
  },
});
```

### Example: True/False Question

```typescript
await prisma.question.create({
  data: {
    unitId: unit.id,
    type: 'TRUE_FALSE',
    questionText: 'Wudu must be performed before every prayer.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: 'False',
    explanation: 'Wudu only needs to be repeated if it has been broken. If wudu is still valid, you can pray multiple prayers with the same wudu.',
    difficulty: 'MEDIUM',
  },
});
```

### Example: Batch Question Creation

```typescript
await prisma.question.createMany({
  data: [
    {
      unitId: unit.id,
      type: 'MULTIPLE_CHOICE',
      questionText: 'Question 1?',
      options: JSON.stringify(['A', 'B', 'C', 'D']),
      correctAnswer: 'B',
      explanation: 'Explanation for Q1',
      difficulty: 'EASY',
    },
    {
      unitId: unit.id,
      type: 'MULTIPLE_CHOICE',
      questionText: 'Question 2?',
      options: JSON.stringify(['A', 'B', 'C', 'D']),
      correctAnswer: 'A',
      explanation: 'Explanation for Q2',
      difficulty: 'MEDIUM',
    },
  ],
});
```

---

## 🔤 Adding Arabic Terms

Arabic terms help learners build Islamic vocabulary.

### Arabic Term Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `arabicText` | String | ✅ | The Arabic word/phrase |
| `transliteration` | String | ✅ | Romanized pronunciation |
| `translation` | String | ✅ | English meaning |
| `audioUrl` | String | ❌ | URL to pronunciation audio |
| `unitId` | String | ✅ | Reference to parent unit |

### Example: Adding Arabic Terms

```typescript
await prisma.arabicTerm.createMany({
  data: [
    {
      unitId: unit.id,
      arabicText: 'صلاة',
      transliteration: 'Salah',
      translation: 'Prayer',
    },
    {
      unitId: unit.id,
      arabicText: 'وضوء',
      transliteration: 'Wudu',
      translation: 'Ablution (ritual washing before prayer)',
    },
    {
      unitId: unit.id,
      arabicText: 'ركعة',
      transliteration: 'Rakah',
      translation: 'A unit of prayer consisting of standing, bowing, and prostrating',
    },
    {
      unitId: unit.id,
      arabicText: 'السلام عليكم',
      transliteration: 'Assalamu Alaikum',
      translation: 'Peace be upon you (Islamic greeting)',
    },
  ],
});
```

---

## 🎬 Adding Media Resources

### Video Resources

```typescript
await prisma.videoResource.create({
  data: {
    unitId: unit.id,
    title: 'How to Perform Wudu',
    url: 'https://www.youtube.com/watch?v=exampleId',
    duration: 300, // 5 minutes in seconds
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    orderIndex: 0,
  },
});
```

### Audio Resources

```typescript
await prisma.audioResource.create({
  data: {
    unitId: unit.id,
    title: 'Surah Al-Fatiha Recitation',
    url: 'https://example.com/audio/fatiha.mp3',
    duration: 45, // 45 seconds
    orderIndex: 0,
  },
});
```

---

## 🔧 Using Prisma Studio

Prisma Studio provides a visual interface for managing content.

### Starting Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all courses, units, and questions
- Create new content directly
- Edit existing content
- Delete content
- View relationships between entities

### Tips for Using Prisma Studio

1. **Creating a Course**: Navigate to "courses" → Click "Add record"
2. **Creating Units**: Navigate to "units" → Add records with the `courseId` from your course
3. **Adding Questions**: Navigate to "questions" → Add records with the `unitId`
4. **JSON Fields**: For `options` in questions, use valid JSON: `["Option A", "Option B", "Option C"]`

---

## 🌱 Seeding Content Programmatically

For bulk content creation, use the seed file.

### Location

```
backend/prisma/seed.ts
```

### Running the Seed

```bash
cd backend
npm run db:seed
```

### Creating a New Course in Seed File

Add your course to `seed.ts`:

```typescript
// Create your new course
const myCourse = await prisma.course.create({
  data: {
    title: 'Your Course Title',
    description: 'Course description here',
    category: 'FIQH', // or QURAN, HADITH, SEERAH, ARABIC, TAFSIR, AQEEDAH
    ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'],
    isPublished: true,
  },
});

// Create units
const units = await Promise.all([
  prisma.unit.create({
    data: {
      courseId: myCourse.id,
      title: 'Unit 1 Title',
      description: 'Unit 1 description',
      content: `<h2>Unit 1</h2><p>Content here...</p>`,
      orderIndex: 0,
    },
  }),
  prisma.unit.create({
    data: {
      courseId: myCourse.id,
      title: 'Unit 2 Title',
      description: 'Unit 2 description',
      content: `<h2>Unit 2</h2><p>Content here...</p>`,
      orderIndex: 1,
    },
  }),
]);

// Add questions
await prisma.question.createMany({
  data: [
    {
      unitId: units[0].id,
      type: 'MULTIPLE_CHOICE',
      questionText: 'Your question here?',
      options: JSON.stringify(['A', 'B', 'C', 'D']),
      correctAnswer: 'A',
      explanation: 'Explanation here',
      difficulty: 'EASY',
    },
  ],
});

// Add Arabic terms
await prisma.arabicTerm.createMany({
  data: [
    {
      unitId: units[0].id,
      arabicText: 'عربي',
      transliteration: 'Arabi',
      translation: 'Arabic',
    },
  ],
});

console.log('✅ Created course:', myCourse.title);
```

---

## ✨ Content Best Practices

### General Guidelines

1. **Age-Appropriate Language**: Adjust vocabulary and complexity based on age levels
2. **Engaging Content**: Use stories, examples, and activities to keep learners interested
3. **Islamic Authenticity**: Cite sources (Quran verses, Hadith references) when applicable
4. **Progressive Difficulty**: Start units with simpler concepts and build up
5. **Review and Reinforce**: Include summaries and reflection activities

### For Different Age Groups

#### Early Child (4-6 years)
- Simple sentences
- Lots of pictures and colors
- Basic concepts only
- Fun activities and games

#### Child (7-10 years)
- Short paragraphs
- Stories and examples
- Basic Arabic vocabulary
- Simple quiz questions

#### Pre-Teen (11-13 years)
- More detailed explanations
- Quran verses with translation
- Hadith references
- Critical thinking questions

#### Teen (14-17 years)
- In-depth content
- Historical context
- Scholarly references
- Discussion questions

#### Adult (18+)
- Comprehensive coverage
- Academic references
- Fiqh discussions
- Advanced Arabic terms

### Quiz Question Guidelines

1. **3-5 questions per unit** is ideal
2. **Mix difficulty levels**: 40% Easy, 40% Medium, 20% Hard
3. **Include explanations** for all answers
4. **Avoid trick questions** - focus on understanding
5. **Test key concepts** from the unit content

### Arabic Terms Guidelines

1. **Include common terms** that appear in the content
2. **Provide clear transliteration** for pronunciation
3. **Give contextual translations** not just literal meanings
4. **Add audio pronunciation** when possible

---

## 📁 Content Categories Reference

| Category | Code | Topics |
|----------|------|--------|
| Quran | `QURAN` | Quran memorization, Tajweed, Tafsir |
| Hadith | `HADITH` | Prophetic traditions, Hadith sciences |
| Fiqh | `FIQH` | Islamic jurisprudence, worship, daily life |
| Seerah | `SEERAH` | Life of Prophet Muhammad (SAW), prophets' stories |
| Arabic | `ARABIC` | Arabic language, Quranic Arabic |
| Tafsir | `TAFSIR` | Quran explanation and commentary |
| Aqeedah | `AQEEDAH` | Islamic beliefs, Tawheed |

---

## 🆘 Need Help?

- Check existing courses in `seed.ts` for examples
- Use Prisma Studio to explore the database structure
- Refer to `schema.prisma` for field definitions
- Contact the development team for questions

Happy content creating! 📚✨
