# Database Arxitekturası — AN Valideyn Akademiyası (Firestore)

## Kolleksiyalar

### users
| Sahə | Tip | Təsvir |
|---|---|---|
| uid | string | Firebase Auth UID |
| email | string | |
| fullName | string | |
| role | "admin" \| "specialist" \| "parent" | |
| phone | string? | |
| avatarUrl | string? | |
| createdAt | timestamp | |

### children
| Sahə | Tip |
|---|---|
| parentId | string (users.uid) |
| name | string |
| age | number |
| diagnosis | string[] |
| currentWeek | number (1-12) |
| assignedSpecialistId | string? |

### modules (12 ədəd, sabit)
order, title, description

### lessons
moduleId, title, videoUrl, articleContent, pdfUrl, quizId, order

### quizzes / questions (subcollection)
lessonId, questions: [{question, options[], correctOptionIndex}]

### assignments
lessonId, childId, parentVideoUrl, parentImageUrl, parentNote,
specialistFeedback, score, status, submittedAt, reviewedAt

### diaryEntries
childId, date, sleepQuality, nutrition, aggressionLevel,
meltdownCount, communicationLevel, taskCompletion, notes

### progressGoals
childId, category (speech/social/sensory/behavior/independence),
title, targetValue, currentValue, unit

### messages
senderId, receiverId, content, attachmentUrl, createdAt, read

### notifications
userId, title, body, type, read, createdAt

### subscriptions
parentId, tier (basic/standard/premium), status, startedAt, expiresAt

### certificates
childId, parentId, certificateNumber, qrCodeUrl, issuedAt, pdfUrl

## ER Diaqramı (mətn formatında)

```
users (1) ──< children (N, parentId)
children (1) ──< assignments (N, childId)
children (1) ──< diaryEntries (N, childId)
children (1) ──< progressGoals (N, childId)
children (1) ──< certificates (N, childId)
modules (1) ──< lessons (N, moduleId)
lessons (1) ──< assignments (N, lessonId)
lessons (1) ──  quizzes (1, quizId)
users (1) ──< messages (N, senderId/receiverId)
users (1) ──< notifications (N, userId)
users (1) ──< subscriptions (N, parentId)
```

## Qeyd
Firestore NoSQL olduğu üçün yuxarıdakı "əlaqələr" sənəd daxilində
referans sahələri (foreign-key-bənzər string ID-lər) ilə təmsil olunur,
real JOIN yoxdur — query-lər client/server tərəfdə filtərlənir.
