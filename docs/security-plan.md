# Təhlükəsizlik Planı — AN Valideyn Akademiyası

## 1. Autentifikasiya və Avtorizasiya
- Bütün şifrələr Firebase Auth tərəfindən idarə olunur (heç vaxt öz DB-mizdə saxlanılmır)
- Rol əsaslı giriş: client tərəfdə `RoleGuard`, server tərəfdə **mütləq** `firestore.rules`
  (UI qoruması tək başına kifayət deyil — Firestore qaydaları əsas müdafiə xəttidir)
- Admin/mütəxəssis hesabları qeydiyyat formundan yaradıla bilmir — yalnız mövcud admin
  Firestore-dan rolu dəyişərək yarada bilər (sosial mühəndislik riskini azaldır)

## 2. Firestore Security Rules
- `firestore.rules` faylı hər kolleksiya üçün rol əsaslı `read`/`write` qaydaları təyin edir
- Valideyn yalnız öz `parentId`-si olan `children` sənədlərinə yaza bilər
- Mesajlar yalnız göndərən/qəbul edən tərəfindən oxuna bilər
- **Deploy etməzdən əvvəl mütləq** `firebase deploy --only firestore:rules` icra edilməlidir —
  default Firestore test mode-u HƏR KƏSƏ oxuma/yazma icazəsi verir

## 3. Storage Security
- `storage.rules` faylı fayl ölçüsü limiti (50MB) və sahiblik yoxlaması tətbiq edir
- Tövsiyə: production-da fayl tipi (MIME) yoxlaması da əlavə edilsin
  (`request.resource.contentType.matches('video/.*')` kimi)

## 4. API Routes (server-side)
- `GROQ_API_KEY`, `PAYRIFF_SECRET_KEY`, `FIREBASE_SERVICE_ACCOUNT_KEY` yalnız server-side
  env dəyişənləridir (`NEXT_PUBLIC_` prefiksi YOXDUR) — brauzerə heç vaxt göndərilmir
- Payriff callback-i: gələn body-yə birbaşa etibar edilmir — `orderId` ilə Payriff-dən
  rəsmi sifariş statusu server-to-server yenidən soruşulur (`getPayriffOrderInfo`).
  Bu, saxta/manipulyasiya olunmuş callback sorğularının abunəlik aktivləşdirməsinin qarşısını alır

## 5. Məlumat Məxfiliyi (Uşaq Məlumatları — Həssas Kateqoriya)
- Uşaqların diaqnoz, gündəlik davranış qeydləri kimi məlumatları **xüsusi həssas** sayılır:
  - Yalnız valideyn, təyin olunmuş mütəxəssis və admin bu məlumatlara çıxış əldə etməlidir
  - Firestore qaydalarında bu artıq tətbiq olunub, lakin **mütəxəssis-uşaq təyinatı**
    (assignedSpecialistId yoxlaması) hələ qaydalara əlavə edilməyib — TODO production üçün:
    ```
    allow read: if isSpecialist() &&
      get(/databases/$(database)/documents/children/$(childId)).data.assignedSpecialistId == request.auth.uid;
    ```
- Tövsiyə: Azərbaycanın "Fərdi məlumatlar haqqında" qanunvericiliyinə uyğunluq üçün hüquqşünasla
  məlumatların saxlanma müddəti və silinmə siyasəti müzakirə edilsin

## 6. AI Təhlükəsizliyi
- Sistem promptu (`AI_SAFETY_PREAMBLE`) AI-ın diaqnoz qoymasını qadağan edir
- Tövsiyə: production-a keçmədən əvvəl real nümunə qeydlərlə 20-30 test sorğusu aparılıb
  cavabların qaydalara uyğunluğu yoxlanılmalıdır
- AI cavabları birbaşa "rəsmi tövsiyə" kimi göstərilmir — UI-da aydın şəkildə "AI tərəfindən
  hazırlanmış xülasə, mütəxəssis rəyini əvəz etmir" qeydi var

## 7. Ümumi Tövsiyələr
- HTTPS məcburi (Vercel default olaraq təmin edir)
- Rate limiting: `/api/ai/*` endpoint-ləri üçün tövsiyə olunur (məs. Vercel Edge Config və ya
  Upstash Redis ilə IP/user əsaslı limit) — sui-istifadə və yüksək OpenAI xərclərinin qarşısını alır
- Asılılıqlar mütəmadi yenilənməlidir (`npm audit`, Dependabot aktivləşdirilsin)
- Backup: Firestore-un mütəmadi (gündəlik) export-u Cloud Storage-a (Firebase-in built-in
  scheduled export funksiyası ilə) qurulması tövsiyə olunur
