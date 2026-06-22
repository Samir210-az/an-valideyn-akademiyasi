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

## 2. Stripe hesabı
1. https://dashboard.stripe.com → hesab yaradın (Azərbaycan üçün Stripe birbaşa dəstəklənmirsə,
   alternativ kimi yerli ödəniş provayderi — məs. Payriff, AzeriCard — inteqrasiya oluna bilər;
   kod strukturu `src/lib/payments/` altında provayder-agnostikdir)
2. **Products** → 3 məhsul yaradın: Basic (29 AZN/ay), Standard (49 AZN/ay), Premium (79 AZN/ay)
   — hər biri üçün **recurring price** seçin
3. Yaranan Price ID-ləri (`price_...`) `.env.local`-a yazın:
   `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PREMIUM`
4. **Developers → API keys** → Secret key → `STRIPE_SECRET_KEY`
5. **Developers → Webhooks** → Add endpoint:
   `https://SİZİN-DOMENİNİZ.com/api/payments/webhook`
   Events: `checkout.session.completed`, `customer.subscription.deleted`
   → Signing secret → `STRIPE_WEBHOOK_SECRET`

## 3. OpenAI
1. https://platform.openai.com/api-keys → yeni key yaradın → `OPENAI_API_KEY`

## 4. Vercel-də deploy
1. https://vercel.com → **Add New Project** → GitHub repo-nu seçin:
   `Samir210-az/an-valideyn-akademiyasi`
2. Framework: Next.js (avtomatik aşkarlanır)
3. **Environment Variables** bölməsində `.env.example`-dəki BÜTÜN dəyişənləri əlavə edin
   (xüsusilə `FIREBASE_SERVICE_ACCOUNT_KEY`-i JSON-u bir sətrə salıb yapıştırın)
4. **Deploy** düyməsinə basın
5. Deploy bitdikdə domeni `NEXT_PUBLIC_APP_URL` env dəyişəninə yazıb yenidən deploy edin
   (Stripe success/cancel url-ləri üçün lazımdır)

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
- Stripe-ı əvvəlcə **test mode**-da yoxlayın, sonra **live mode**-a keçin
