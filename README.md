# AN Valideyn Akademiyası

Autizm, DEHB, nitq gecikməsi, sensor problemlər və davranış çətinlikləri olan
uşaqların valideynlərinə sistemli onlayn təlim verən SaaS platforması.

> Platforma terapevti əvəz etmir — valideynə evdə düzgün müdaxiləni öyrədir.

## Texnologiyalar
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend / DB:** Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Charts:** Recharts
- **PDF:** pdf-lib
- **AI:** OpenAI API

## Rollar
- **Admin** — kurs/modul/dərs idarəetməsi, istifadəçilər, ödənişlər, hesabatlar
- **Mütəxəssis** — dərs yaratma, tapşırıq yoxlama, mesajlaşma, qiymətləndirmə
- **Valideyn** — dashboard, kurslar, tapşırıqlar, gündəlik, inkişaf izləmə, sertifikat

## Folder strukturu
```
src/
  app/
    (auth)/login, register
    admin/...
    specialist/...
    parent/...
    api/...
  components/
    layout/, ui/, admin/, specialist/, parent/, shared/
  lib/
    firebase/ (client.ts, admin.ts)
    ai/
    utils/
  context/   AuthContext.tsx
  hooks/
  types/     index.ts
docs/        arxitektura sənədləri
```

## Quraşdırma
```bash
npm install
cp .env.example .env.local   # Firebase/OpenAI açarlarını doldurun
npm run dev
```

## Firebase qurulumu
1. https://console.firebase.google.com — yeni layihə yaradın
2. Authentication → Email/Password aktivləşdirin
3. Firestore Database yaradın, `firestore.rules` faylını deploy edin
4. Storage aktivləşdirin (video/PDF/şəkil üçün)
5. Project Settings → Web app yaradın → `.env.local`-a açarları köçürün
6. Service Account (Admin SDK) JSON-u `.env.local`-da `FIREBASE_SERVICE_ACCOUNT_KEY` kimi saxlayın

## Sənədlər
- [Database arxitekturası](docs/database-architecture.md)
- [Deployment təlimatı](docs/deployment.md)
