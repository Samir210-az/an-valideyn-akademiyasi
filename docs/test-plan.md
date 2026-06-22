# Test Planı — AN Valideyn Akademiyası

## 1. Authentication
| Test | Gözlənilən nəticə |
|---|---|
| Düzgün email/şifrə ilə login | Rola uyğun dashboard-a yönləndirilir |
| Səhv şifrə | "Şifrə yanlışdır" mesajı |
| Mövcud email ilə qeydiyyat | "Bu email artıq qeydiyyatdan keçib" |
| Şifrələr uyğun gəlmir (register) | Forma göndərilmir, xəta göstərilir |
| Login olmadan `/admin/dashboard`-a getmək | `/login`-ə yönləndirilir |
| Parent rolu ilə `/admin/dashboard`-a getmək | `/login`-ə yönləndirilir (RoleGuard) |

## 2. Admin Paneli
- 12 default modulun bir kliklə yaradılması → Firestore-da 12 sənəd yaranır
- Modul silindikdə bağlı dərslər "yetim" qalmamalı (manual təmizləmə və ya Cloud Function lazımdır — TODO)
- Dərsə video/PDF/məqalə əlavə etmə → valideyn panelində dərhal görünür
- Bildiriş göndərmə → Firestore `broadcastNotifications`-a yazılır + FCM push cəhdi edilir

## 3. Valideyn Paneli
- Uşaq profili yaratma → Dashboard-da dərhal görünür
- Gündəlik qeyd (eyni gün üçün 2-ci dəfə doldurma) → `merge: true` ilə üzərinə yazılır, dublikat yaranmır
- Tapşırıq göndərmə → status `pending` → `submitted`-ə keçir
- Sertifikat yükləmə (12-ci həftədən əvvəl) → düymə görünmür
- Abunəlik seçimi → Stripe Checkout-a yönləndirilir (test kartı: `4242 4242 4242 4242`)

## 4. Mütəxəssis Paneli
- Tapşırığa rəy+bal vermə → status `reviewed`-ə keçir, valideyn panelində görünür
- AI hesabat generatoru → boş gündəlik/tapşırıq olduqda belə xəta vermədən cavab qaytarmalı

## 5. AI Endpoint-ləri
| Endpoint | Edge case |
|---|---|
| `/api/ai/weekly-summary` | 0 gündəlik qeyd → 400 xətası |
| `/api/ai/risk-check` | 3-dən az qeyd → 400 xətası |
| `/api/ai/specialist-report` | `OPENAI_API_KEY` yoxdursa → 500, aydın mesaj |

**Diaqnoz qoymama testi (kritik):** AI cavablarında "diaqnoz", "xəstəlikdir", "autizmdir" kimi
qəti tibbi ifadələrin olmadığını manual yoxlayın. Sistem promptu bunu qadağan edir, amma
LLM nəticələri 100% deterministik olmadığından məhsuldan əvvəl nümunə cavablar nəzərdən keçirilməlidir.

## 6. Ödəniş (Payriff)
- Test mode-da test kartı (`4000007546012078`) ilə ödəniş tamamlama → callback endpoint
  `paymentStatus: "PAID"` qaytarır → Firestore `subscriptions` sənədi `status: active` ilə yaranır
- Callback body-yə etibar edilmir — `getPayriffOrderInfo` ilə server-to-server status
  yenidən soruşulur (saxta callback sorğularının qarşısını alır)
- Ödəniş ləğv/imtina (`CANCELED`/`DECLINED`) → abunəlik **yaranmır**, valideyn yenidən cəhd edə bilər

## 7. Performans / Yüklənmə
- Lighthouse ilə əsas səhifələrin (login, parent/dashboard) performans skoru ≥ 80
- 100+ dərs/tapşırıq olduqda Firestore query-lərinin səhifələnməsi (pagination) — hazırkı
  versiyada YOXDUR, böyük data həcmində əlavə edilməlidir (TODO)

## 8. Əlçatanlıq (WCAG)
- Bütün formlar klaviatura ilə doldurula bilməlidir (Tab/Enter)
- Kontrast nisbəti: mətn/fon ≥ 4.5:1 (Tailwind slate/indigo palette ilə uyğundur)
- Şəkillərə `alt` mətn (hazırkı versiyada əsasən ikon SVG-lər, `aria-hidden` ilə işarələnib)

## Hazırkı məhdudiyyətlər (production-a qədər həll edilməli)
1. Real-time abunəlik yoxlanışı yoxdur — `subscriptions` statusu UI-da limit qoymaq üçün istifadə olunmur
2. Quiz UI hələ yaradılmayıb (tip strukturu var, səhifə yoxdur)
3. Mütəxəssis-uşaq təyinatı (assignedSpecialistId) UI-dan idarə olunmur, yalnız Firestore-da sahə var
4. Faylların (video/PDF) birbaşa yüklənməsi (Firebase Storage upload widget-i) hələ UI-a qoşulmayıb —
   hazırda yalnız URL daxiletmə var
