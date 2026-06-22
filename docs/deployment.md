# Deployment Təlimatı — AN Valideyn Akademiyası

## 1. Firebase layihəsini yaratmaq
1. https://console.firebase.google.com → **Add project** → ad: `an-valideyn-akademiyasi`
2. **Authentication** → Sign-in method → **Email/Password**-i aktivləşdirin
3. **Firestore Database** → Create database → Production mode → region: `eur3` (Avropa, Azərbaycana yaxın)
4. **Storage** → Get started (video/PDF/şəkil üçün)
5. **Cloud Messaging** → Web Push sertifikatları yaradın (VAPID key) — bu, `NEXT_PUBLIC_FIREBASE_VAPID_KEY` üçündür
6. **Project Settings → General → Your apps** → Web app (`</>`) əlavə edin → konfiqurasiya obyektini kopyalayın
7. **Project Settings → Service accounts** → **Generate new private key** → JSON faylını yükləyin
   - Bu JSON-u bir sətirə salıb `FIREBASE_SERVICE_ACCOUNT_KEY` env dəyişəninə yazacaqsınız

### Firestore qaydalarını yükləmək
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # mövcud layihəni seçin, firestore.rules-u override etməyin
firebase deploy --only firestore:rules
```

## 2. Payriff (Azərbaycan ödəniş sistemi)
1. https://dashboard.payriff.com/auth?formType=signup → hesab yaradın → telefon nömrəsi ilə aktivləşdirin
2. **Connect** səhifəsindən Merchant hesabı yaradın (Personal və ya Business — Business üçün
   bank hesabı və VÖEN lazımdır)
3. **Developers / Applications** bölməsindən **Merchant Secret Key**-i kopyalayın
4. `.env.local`-a yazın: `PAYRIFF_SECRET_KEY=...`
5. Test kartı ilə sınaqdan keçirin: Kart № `4000007546012078`, Tarix `04/29`, CVV `893`
6. Production-a keçmək üçün müqaviləni imzalayıb tətbiqin statusunu "Online"-a çevirin

## 3. Groq (AI funksiyaları)
1. https://console.groq.com/keys → yeni API açar yaradın → `GROQ_API_KEY`
   (pulsuz tier mövcuddur, Llama 3.3 70B modeli işlədilir)

## 4. Vercel-də deploy
1. https://vercel.com → **Add New Project** → GitHub repo-nu seçin:
   `Samir210-az/an-valideyn-akademiyasi`
2. Framework: Next.js (avtomatik aşkarlanır)
3. **Environment Variables** bölməsində `.env.example`-dəki BÜTÜN dəyişənləri əlavə edin
   (xüsusilə `FIREBASE_SERVICE_ACCOUNT_KEY`-i JSON-u bir sətrə salıb yapıştırın)
4. **Deploy** düyməsinə basın
5. Deploy bitdikdə domeni `NEXT_PUBLIC_APP_URL` env dəyişəninə yazıb yenidən deploy edin
   (Payriff `callbackUrl` üçün lazımdır)

## 5. Domain qoşmaq (opsional)
Vercel → Project → Settings → Domains → öz domeninizi (`an-akademiya.az` kimi) əlavə edin,
DNS provayderinizdə göstərilən CNAME/A qeydlərini əlavə edin.

## 6. İlk admin hesabını yaratmaq
Qeydiyyat səhifəsi yalnız "valideyn" rolu yaradır (təhlükəsizlik üçün). İlk admin hesabını
əl ilə yaratmaq lazımdır:
1. `/register`-dən normal qeydiyyatdan keçin
2. Firebase Console → Firestore → `users` kolleksiyası → öz sənədinizi tapın
3. `role` sahəsini `"parent"`-dan `"admin"`-ə dəyişin
4. Yenidən daxil olun — admin panelinə yönləndiriləcəksiniz

## 7. Buraxılışdan sonra
- `firestore.rules`-u **mütləq** production-da yoxlayın (test mode-da hər kəs hər şeyi oxuyub yaza bilər)
- Firebase Storage üçün də oxşar security rules yazılmalıdır (hazırda default)
- Payriff-i əvvəlcə **test mode**-da yoxlayın (yuxarıdakı test kartı ilə), sonra müqaviləni
  imzalayıb **production**-a keçin
