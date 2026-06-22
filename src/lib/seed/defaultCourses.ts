// Bu fayl AN Valideyn Akademiyasının 12 modulluq proqramı üçün
// default (ilkin) modul və dərs məzmununu saxlayır.
// Admin paneldəki "Default məzmunu yarat" düyməsi bu məlumatı Firestore-a yazır.
// Hər dəfə basıldıqda artıq mövcud olan modullar YENİDƏN yaradılmır (başlığa görə yoxlanılır).

export interface SeedLesson {
  title: string;
  imageUrl: string;
  articleContent: string;
}

export interface SeedModule {
  order: number;
  title: string;
  description: string;
  lessons: SeedLesson[];
}

export const DEFAULT_COURSES: SeedModule[] = [
  {
    order: 1,
    title: "Autizmi anlamaq",
    description:
      "Autizmin nə olduğunu, nə olmadığını və övladınızın dünyanı necə qəbul etdiyini sadə dildə izah edən giriş modulu.",
    lessons: [
      {
        title: "Autizm nədir, nə deyil?",
        imageUrl: "/images/lessons/autizm.svg",
        articleContent:
`Əziz valideyn, "autizm" sözünü eşidəndə ürəyiniz sıxılmış ola bilər. Bu tamam normaldır. Amma əvvəlcə bilməlisiniz: autizm xəstəlik deyil. Onu "müalicə etmək" və ya "keçirtmək" lazım deyil. Autizm — beynin dünyanı qəbul etmə, emal etmə və ona reaksiya vermə tərzinin fərqli olmasıdır.

Autizmli uşaq sizi sevmir demək deyil ki, sizi sevmir — sadəcə bunu göstərmə tərzi başqa ola bilər. Bəlkə gözünüzə uzun baxmır, amma sizin səsinizi eşidəndə sakitləşir. Bəlkə qucaqlaşmaq istəmir, amma əlinizi tutmaqdan zövq alır. Hər uşaq fərqlidir.

Nə autizm DEYİL:
— Tərbiyəsizlik nəticəsi deyil. Siz heç nə "səhv etməmisiniz".
— Əqli zəiflik demək deyil. Autizmli uşaqların intellekt səviyyəsi tamamilə fərqli ola bilər — bəzisi çox yüksək, bəzisi dəstəyə ehtiyaclı.
— Daimi və dəyişməz "etiket" deyil. Düzgün dəstəklə uşaq inkişaf edir, bacarıqlar qazanır, həyat keyfiyyəti yüksəlir.

Nə autizm-dir:
— Ünsiyyətdə fərqli yanaşma (sözlə, jestlə, vizual vasitələrlə).
— Bəzi səs, işıq, toxunuşlara həssaslıq (artıq və ya əksinə, az hiss etmə).
— Müəyyən rutinlərə, təkrarlara üstünlük vermə — bu, uşaq üçün təhlükəsizlik hissi yaradır.
— Maraqların dar, amma çox dərin olması (məsələn, bir mövzuya saatlarla fokuslanma).

Bu akademiyada məqsədimiz övladınızı "normal"a çevirmək deyil — onu olduğu kimi qəbul edərək, həm onun, həm sizin həyatınızı asanlaşdıracaq bacarıqlar qazandırmaqdır. Unutmayın: siz artıq doğru addımı atmısınız — öyrənməyə açıqsınız. Bu, övladınız üçün ən böyük hədiyyədir.

Növbəti dərslərdə davranışın arxasındaki mesajı necə oxumağı, ünsiyyəti necə asanlaşdırmağı addım-addım öyrənəcəyik.`,
      },
    ],
  },
  {
    order: 2,
    title: "Davranış idarəetməsi",
    description:
      "Çətin davranışların arxasında duran səbəbləri tanımaq və sakit, effektiv reaksiya vermə yollarını öyrədən modul.",
    lessons: [
      {
        title: "Davranışın arxasındakı mesajı oxumaq",
        imageUrl: "/images/lessons/davranis.svg",
        articleContent:
`Uşağınız qışqırır, yerə yıxılır, əşyaları atır — və siz çarəsiz qalırsınız. Bilməlisiniz ki, bu davranış "pisliyə görə" deyil. Hər çətin davranışın arxasında bir MESAJ var. Uşaq sözlə deyə bilmədiyini, bədəni və hərəkəti ilə deyir.

Ən çox rast gəlinən mesajlar bunlardır:
— "Mən bunu istəmirəm" (etiraz)
— "Çox səs var, baş çıxara bilmirəm" (sensor yüklənmə)
— "Diqqətini istəyirəm" (əlaqə axtarışı)
— "Yorğunam, acam, ağrım var" (fiziki ehtiyac)
— "Nə baş verəcəyini bilmirəm, qorxuram" (gözlənilməzlik)

Praktiki addım: "ABC" üsulu
Davranışı izləmək üçün üç sual verin:
A — Antecedent (Nə baş verdi davranışdan ƏVV�desinə?) Məsələn, mağazaya girdik, çox səs-küy var idi.
B — Behavior (Davranışın özü nə idi?) Məsələn, uşaq qışqırdı, yerə oturdu.
C — Consequence (Davranışdan SONRA nə oldu?) Məsələn, mağazadan çıxdıq, sakitləşdi.

Bunu bir neçə gün gündəlikdə qeyd etsəniz, davranışın hansı şəraitdə təkrarlandığını görəcəksiniz — bu, ən güclü vasitədir.

Reaksiya verərkən unutmayın:
1. Əvvəlcə özünüzü sakitləşdirin. Sizin tonunuz uşağa keçir.
2. Qışqırmayın, uzun izahat verməyin — qısa, sakit, konkret danışın: "Mən görürəm sən əsəbisən. Mən yanındayam."
3. Davranışı dayandırmaq əvəzinə, ehtiyacı ödəməyə çalışın (sakit yerə keçmək, qulaqlıq vermək və s.)
4. Davranış bitdikdən sonra danışın, davranış zamanı yox — o anda uşaq sizi eşitməyə hazır deyil.

Xatırlayın: məqsəd uşağı "düzəltmək" deyil, onun nə demək istədiyini anlamaq və ona daha sağlam bir yol göstərməkdir. Bu, vaxt aparır — özünüzə də mərhəmətli olun.`,
      },
    ],
  },
  {
    order: 3,
    title: "Ünsiyyət bacarıqları",
    description:
      "Sözdən əvvəlki ünsiyyət vasitələrindən (göz təması, jest, vizual kartlar) istifadə edərək övladınızla əlaqəni gücləndirmək.",
    lessons: [
      {
        title: "Sözdən əvvəlki ünsiyyət: göz təması və işarələr",
        imageUrl: "/images/lessons/unsiyyet.svg",
        articleContent:
`Ünsiyyət təkcə danışmaq demək deyil. Söz heç deməsə belə, uşağınız artıq sizinlə "danışır" — sadəcə başqa dildə. Bu dərsdə bu dili necə tanıyıb cavab verməyi öyrənəcəyik.

Sözdən əvvəlki ünsiyyət formaları:
— Göz təması (qısa da olsa)
— Əl ilə göstərmə, çəkmə, itələmə
— Səs çıxarma (ağlama, gülmə, mızıldama)
— Bədən duruşu (kənara dönmə = "istəmirəm", yaxınlaşma = "istəyirəm")
— Predmeti gətirib göstərmə

Valideyn olaraq sizin işiniz: bu işarələri "söz" kimi qəbul edib CAVAB vermək. Hər dəfə uşaq nəyəsə işarə edəndə, deyin: "Sən topu istəyirsən, hə?" — beləliklə ona göstərirsiniz ki, onun mesajı eşidilib.

Praktiki üsul: "Gözləmə və izləmə"
1. Uşağınızla oynayarkən bir oyuncağı əlinizdə tutub gözləyin (tələsməyin).
2. Onun nə edəcəyinə baxın — sizə baxacaq, əlini uzadacaq, səs çıxaracaq.
3. Elə bu reaksiyanı gördükdə dərhal müsbət cavab verin: oyuncağı verin, gülümsəyin, sözlə təsdiqləyin.

Bu, uşağa öyrədir ki, ünsiyyət qurmaq nəticə verir — bu, ən vacib dərsdir.

Vizual dəstək vasitələri
Sözlə yanaşı, şəkil kartlarından (PECS sistemi kimi) istifadə çox effektivdir. Məsələn, "su", "tualet", "kömək" kartları hazırlayıb uşağın əlinə verə bilərsiniz ki, sözü olmasa da, kartı göstərərək ehtiyacını bildirsin.

Unutmayın: hər kiçik cavab — bir gülüş, bir əl hərəkəti — artıq ünsiyyətdir. Onu gözardı etməyin, hər zaman tanıyın və mükafatlandırın (gülüşlə, sözlə, diqqətlə). Vaxtla bu kiçik addımlar daha böyük ünsiyyət bacarıqlarına çevriləcək.`,
      },
    ],
  },
  {
    order: 4,
    title: "Nitqin inkişafı",
    description:
      "Evdə gündəlik fəaliyyətlər zamanı nitqi necə təşviq etmək barədə praktiki üsullar.",
    lessons: [
      {
        title: "Evdə nitqi necə təşviq etməli?",
        imageUrl: "/images/lessons/nitq.svg",
        articleContent:
`Nitq gecikməsi olan uşaqlar üçün ən böyük dəstək — terapevtin otağı deyil, sizin EVİNİZDİR. Gündə neçə dəfə "ye", "gəl", "otur" deyirsinizsə, bunlar artıq dil dərsidir. Bu dərsdə həmin anları necə daha effektiv etməyi öyrənəcəyik.

1. Az danışın, amma DOĞRU danışın
Uzun cümlələr əvəzinə qısa, aydın sözlər işlədin: "Top!" yox "Bax bu sənin sevimli topundur, gəl onunla oynayaq" demək olmaz — uşaq üçün çoxdur. Sadəcə: "Top. Topu ver."

2. "Özünüz haqqında danışma" üsulu (self-talk)
Nə etdiyinizi səsli deyin: "Mən qapını açıram." "Mən suyu tökürəm." Bu, uşağın beynində söz-hərəkət əlaqəsini gücləndirir, hətta o cavab verməsə belə.

3. Seçim verin, sual yox
"Nə istəyirsən?" sualı çox açıqdır, uşaq çətinlik çəkə bilər. Əvəzinə: "Alma, yoxsa banan?" — bu, ona söz istifadə etmək üçün konkret şərait yaradır.

4. Gözləyin — tələsməyin
Uşaq sözü tapmaq üçün vaxta ehtiyac duyur. Onun əvəzinə cavab verməyin. 5-10 saniyə gözləyin, üzünüzü ona tərəf çevirib, gözləyən mimika göstərin. Bu, ona "danış" siqnalı verir, sözsüz.

5. Təkrarlayın, genişləndirin
Uşaq "ma" desə, siz "Su ver" yox, "Su, hə? Su istəyirsən" deyin — onun dediyini təsdiqləyib bir az da genişləndirin.

Gündəlik anlarda tətbiq edin: yemək zamanı, hamam vaxtı, oyun zamanı, maşında — bunların hamısı dil öyrənmək üçün təbii fürsətlərdir. Məcburi "dərs" şəklində deyil, təbii ünsiyyət şəklində aparın.

Əgər 2 yaşdan sonra heç söz yoxdursa, yaxud nitq geriləyirsə, mütəxəssisə müraciət etməyi gecikdirməyin — erkən müdaxilə ən böyük fərqi yaradır.`,
      },
    ],
  },
  {
    order: 5,
    title: "Sensor inteqrasiya",
    description:
      "Uşağınızın səs, işıq, toxunuş kimi hisslərə necə reaksiya verdiyini başa düşmək və evdə rahat mühit yaratmaq.",
    lessons: [
      {
        title: "Uşağınızın hissləri: niyə bəzi səslər və toxunuşlar onu narahat edir?",
        imageUrl: "/images/lessons/sensor.svg",
        articleContent:
`Sizin üçün adi olan bir səs (toz sorucusu, restoran səs-küyü) övladınız üçün ağrılı ola bilər. Yaxud əksinə — siz adicə müşahidə etdiyiniz bir şeyi o saatlarla hiss etmək istəyə bilər (fırlanma, sıxılma). Bu, "şıltaqlıq" deyil — sensor sistemin fərqli işləməsidir.

İki növ reaksiya var:
1. Hipersensitivlik (çox həssaslıq) — səs, işıq, toxunuş, qoxu onun üçün GÜCLƏNDİRİLMİŞ gəlir. Nəticə: qulaqlarını tutur, geyimin etiketindən narahat olur, izdihamdan qaçır.
2. Hiposensitivlik (az həssaslıq) — hissləri AZ alır, ona görə güclü stimul axtarır. Nəticə: fırlanır, özünü çırpır, möhkəm qucaqlanmaq istəyir, hər şeyi iyləyir.

Eyni uşaqda bəzi hisslər hiper, bəziləri hipo ola bilər — məsələn, səsə həssas, amma ağrıya az həssas.

Evdə nə edə bilərsiniz:
— Səs: izdihamlı yerlərə getməzdən əvvəl xəbərdar edin ("Mağazada səs çox olacaq"). Qulaqlıq (noise-cancelling) faydalı ola bilər.
— İşıq: çox işıqlı otaqlarda pərdə, daha yumşaq lampalar işlədin.
— Toxunuş: geyim seçimində ona icazə verin — etiketsiz, yumşaq parçalar.
— Hərəkət ehtiyacı: trambolin, fırlanan oturacaq, "sıxma" yastığı kimi "sensor fasilə" alətləri evdə olsun.

"Sensor səbət" yaradın
Evdə kiçik bir qutuda: stress topu, sıxma oyuncağı, qulaqlıq, yumşaq parça, xoş qoxulu əşya saxlayın. Uşağınız həddən artıq yükləndiyini hiss edəndə, bu qutuya müraciət etsin — bu, onun özünü sakitləşdirmə vasitəsi olacaq.

Yadda saxlayın: sensor həssaslıq "düzəldiləcək" problem deyil, fərdi xüsusiyyətdir. Sizin işiniz mühiti ona uyğunlaşdırmaqdır, onu mühitə məcburi uyğunlaşdırmaq deyil.`,
      },
    ],
  },
  {
    order: 6,
    title: "Emosional tənzimləmə",
    description:
      "Uşağınızın emosiyalarını tanıması və sakitləşmə bacarıqları qazanması üçün sadə alətlər.",
    lessons: [
      {
        title: "Sakitləşmə qutusu: emosiyaları tanımaq və idarə etmək",
        imageUrl: "/images/lessons/emosional.svg",
        articleContent:
`Böyüklər üçün belə emosiyaları idarə etmək çətindir — uşaq üçün isə bu, hələ öyrənilməli bir bacarıqdır. Sizin işiniz onu "sakit olmağa" məcbur etmək deyil, ona sakitləşmə ALƏTLƏRİ verməkdir.

Addım 1: Emosiyaya ad qoyun
Uşaq əsəbiləşəndə deyin: "Sən qəzəblisən" və ya "Bu sənin üçün çox idi, kədərlisən". Bu, sadə görünsə də, çox güclüdür — uşaq öz daxili vəziyyətini "tanımaq" öyrənir. Vaxtla o özü də bu sözləri işlədəcək.

Addım 2: Emosional vəziyyət şkalası yaradın
Sadə bir kartda 3 üz çəkin: yaşıl (sakit), sarı (narahat), qırmızı (çox əsəbi). Uşağınızla birlikdə həftədə bir neçə dəfə "indi hansı rəngdəsən?" sualını verin. Bu, özünü-tanıma bacarığını inkişaf etdirir.

Addım 3: "Sakitləşmə qutusu" hazırlayın
Birlikdə kiçik bir qutu düzəldin, içinə:
— Nəfəs alma kartı (uşaq görəndə dərin nəfəs alsın)
— Sıxma topu və ya yumşaq parça
— Sevimli kiçik oyuncaq
— Sakit musiqi siyahısı
Qırmızı zonaya keçəndə bu qutuya birlikdə müraciət edin.

Addım 4: Özünüz nümunə olun
Uşaqlar valideynin reaksiyasını güzgü kimi əks etdirir. Siz əsəbiləşəndə uca səslə deyin: "Mən indi əsəbiyəm, bir az nəfəs alacağam" — beləliklə ona göstərirsiniz ki, böyüklər də emosiya yaşayır və onu necə idarə etmək olar.

Vacib qeyd: "krizis" anında (uşaq artıq qəzəb partlayışındadır) öyrətmə vaxtı deyil — bu, sakitləşmə vaxtıdır. Söhbət, izah, "niyə belə etdin" sualları YALNIZ sakitləşdikdən sonra verilməlidir.

Kiçik addımlarla, zamanla uşağınız öz emosiyalarını tanıyıb idarə etmə bacarığı qazanacaq — bu, bütün həyatı üçün ən dəyərli bacarıqlardan biridir.`,
      },
    ],
  },
  {
    order: 7,
    title: "Oyun terapiyası elementləri",
    description:
      "Oyun vasitəsilə inkişafı dəstəkləmək — uşağınızla əlaqəni gücləndirən sadə oyun üsulları.",
    lessons: [
      {
        title: "Oyun vasitəsilə inkişaf: necə oynamalı?",
        imageUrl: "/images/lessons/oyun.svg",
        articleContent:
`Oyun — uşaq üçün "vaxt keçirmək" deyil, onun DİLİDİR. Uşaqlar dünyanı, münasibətləri, hissləri oyun vasitəsilə öyrənir. Bu modulda terapevtlərin işlətdiyi sadə oyun üsullarını evdə necə tətbiq etməyi öyrənəcəksiniz.

Əsas prinsip: "İzlə, qoşul, genişləndir"
1. İZLƏ — Uşağın nə ilə, necə oynadığını müşahidə edin. Müdaxilə etməyin, sadəcə baxın.
2. QOŞUL — Onun oyununa öz təşəbbüsünüzlə deyil, ONUN qaydaları ilə qoşulun. Maşın sürürsə, siz də bir maşın götürüb yanında "sürün".
3. GENİŞLƏNDİR — Kiçik bir element əlavə edin: "Mənim maşınım sənin maşınınla görüşə gəldi, bip-bip!" Onun reaksiyasına baxın, məcbur etməyin.

Niyə bu vacibdir?
Bu üsul uşağa göstərir ki, siz onun dünyasına dəyər verirsiniz — bu, etibar və əlaqə yaradır. Əlaqə olmadan heç bir öyrətmə effektiv olmur.

Praktiki oyun nümunələri:
— Növbə oyunları: top ötürmə, qüllə qurub yıxma — növbəni gözləməyi öyrədir.
— Təqlid oyunları: "Mən əllərimi çalıram, sən də çal" — diqqəti və əlaqəni gücləndirir.
— Rol oyunları: "həkim-pasiyent", "mağaza" — sosial ssenariləri təcrübə etmək imkanı verir.
— Sensor oyunlar: qum, su, plastilin — sakitləşdirici və inkişafedici.

Vaxt və məkan
Gündə 10-15 dəqiqə, televiziyasız, telefonsuz, YALNIZ siz və uşaq. Bu vaxtı "öyrətmə" kimi deyil, "birlikdə olma" kimi yaşayın — təzyiq olmadan.

Əgər uşaq oyuna qoşulmaq istəmirsə, məcbur etməyin — yanında oturub öz oyununuzu oynayın, o, vaxtla maraqlanacaq. Səbir burada açardır.`,
      },
    ],
  },
  {
    order: 8,
    title: "Məktəbə hazırlıq",
    description:
      "Övladınızı məktəb mühitinə uyğunlaşdırmaq üçün lazımi bacarıqlar və praktiki tövsiyələr.",
    lessons: [
      {
        title: "Məktəb üçün hazırlıq addımları",
        imageUrl: "/images/lessons/mektebe.svg",
        articleContent:
`Məktəb — yeni mühit, yeni qaydalar, yeni insanlar deməkdir. Bu, hər uşaq üçün çətin keçiddir, xüsusən rutinə öyrəşmiş və ya sosial baxımdan dəstəyə ehtiyac duyan uşaqlar üçün. Yaxşı xəbər: hazırlıq əvvəlcədən başlasa, keçid daha asan olur.

1. Akademik bacarıqlardan əvvəl — "məktəb davranışı"
Oturmaq, növbə gözləmək, əl qaldırmaq, sual eşitdikdə cavab vermək — bunlar oxumaq-yazmaqdan əvvəl öyrədilməli bacarıqlardır. Evdə "məktəb oyunu" oynayın: kiçik masa arxasında 5-10 dəqiqə oturma, sonra tədricən artırın.

2. Rutini əvvəlcədən tanış edin
Məktəb otağının şəklini göstərin, gündəlik cədvəli sadə şəkillərlə izah edin ("əvvəl dərs, sonra fasilə, sonra yenə dərs"). Naməlumluq qorxu yaradır — nə qədər çox tanışsa, bir o qədər sakit olacaq.

3. Sosial ssenariləri məşq edin
"Necəsən?" deyildikdə nə cavab vermək, kiməsə "salam" demək, kömək istəmək — bu sadə cümlələri evdə rol-oyun şəklində təkrarlayın.

4. Müəllimlə əməkdaşlıq qurun
Müəllimə övladınız haqqında qısa, konkret məlumat verin: nəyi sevir, nə narahat edir, hansı işarə onun "yorulduğunu" göstərir. Bu, müəllimin daha effektiv dəstək verməsinə kömək edir.

5. Sensor ehtiyacları unutmayın
Sinif otağında səs-küy, işıq çox ola bilər. Lazım olarsa, fasilə kartı (uşağın "mənə fasilə lazımdır" deyə göstərə biləcəyi kart) hazırlayın və müəllimlə razılaşın.

6. Kiçik qələbələri qeyd edin
Birinci gün, birinci həftə — hər addımı tərifləyin, hətta kiçik görünsə belə. Məktəb təcrübəsi müsbət assosiasiya ilə başlamalıdır.

Unutmayın: hər uşağın öz tempi var. Məqsəd "digərləri kimi" olmaq deyil, övladınızın öz bacarıqları ilə rahat, inamlı hiss etməsidir.`,
      },
    ],
  },
  {
    order: 9,
    title: "Sosial bacarıqlar",
    description:
      "Növbə gözləmək, paylaşmaq, dostluq qurmaq kimi əsas sosial bacarıqları addım-addım inkişaf etdirmək.",
    lessons: [
      {
        title: "Növbə gözləmək və paylaşmaq",
        imageUrl: "/images/lessons/sosial.svg",
        articleContent:
`Sosial bacarıqlar anadangəlmə deyil — öyrənilir. Çox uşaq üçün "gözləmək" və "paylaşmaq" çox çətin görünür, çünki onlar hələ "indi" anında yaşayır. Bu dərsdə bu bacarıqları kiçik, idarə edilə bilən addımlarla öyrədəcəyik.

Niyə çətindir?
Uşaq beyni hələ tam inkişaf etməmiş "gecikdirilmiş razılaşma" mərkəzinə malikdir — yəni "indi istəyirəm" hissi "sonra alacağam" məntiqindən daha güclüdür. Bu, tərbiyəsizlik deyil, inkişaf mərhələsidir.

Addım-addım öyrətmə üsulu:

1. Qısa gözləmədən başlayın
Əvvəlcə cəmi 5-10 saniyəlik gözləmə tələb edən oyunlar seçin (məsələn, "Mənim növbəm, sonra sənin" topu ötürmə oyunu). Tədricən vaxtı artırın.

2. Vizual "növbə kartı" işlədin
Kiçik kart üzərində "Mənim növbəm" / "Sənin növbən" yazıb əldən-ələ keçirin — bu, abstrakt anlayışı konkretləşdirir.

3. Paylaşmağı təcrübə edin, məcbur etməyin
"Ver ona" əmri əvəzinə: "Bir dəqiqədən sonra növbə onundur, sonra yenə sənin olacaq" deyin. Uşağa "əşya əbədi getmir" hissini verin — bu, paylaşma qorxusunu azaldır.

4. Kiçik qrup oyunlarından istifadə edin
Əvvəlcə 2 nəfər (siz və uşaq), sonra 3-cü şəxs (bacı-qardaş, dost) əlavə edin. Tədricən böyüyən qrup uşağa adaptasiya imkanı verir.

5. Müsbət davranışı dərhal tanıyın
Uşaq növbəsini gözlədikdə və ya paylaşdıqda, dərhal və konkret tərif edin: "Sən çox gözəl gözlədin, təşəkkür edirəm!" — bu davranışın təkrarlanma ehtimalını artırır.

Praktiki tövsiyə: gündə cəmi 10 dəqiqəlik strukturlaşdırılmış oyun bu bacarıqları inkişaf etdirmək üçün kifayətdir. Davamlılıq sürətdən daha vacibdir — hər gün kiçik addım, böyük dəyişikliyə aparır.`,
      },
    ],
  },
  {
    order: 10,
    title: "DEHB strategiyaları",
    description:
      "Diqqət çatışmazlığı və hiperaktivliyi olan uşaqlar üçün evdə tətbiq edilə bilən praktiki strategiyalar.",
    lessons: [
      {
        title: "Diqqəti və enerjini necə istiqamətləndirməli?",
        imageUrl: "/images/lessons/dehb.svg",
        articleContent:
`DEHB (Diqqət Çatışmazlığı və Hiperaktivlik Bozukluğu) olan uşaq "tərbiyəsiz" yox, beyninin diqqət və hərəkəti idarə edən hissəsi başqa cür işləyən uşaqdır. O, siz dediyiniz üçün eşitmir demək deyil — beyni eyni anda çox şeyə fokuslanmağa çalışır.

Əsas prinsip: Struktur + Hərəkət imkanı

1. Mühiti sadələşdirin
Çoxlu vizual stimul (oyuncaq dağınıqlığı, açıq televiziya) diqqəti dağıdır. Dərs/tapşırıq vaxtı üçün sakit, az əşyalı bir guşə ayırın.

2. Tapşırıqları "bölün"
Uzun tapşırıq ("otağını yığ") çox böyük görünür. Əvəzinə: "əvvəlcə oyuncaqları yığ", sonra "kitabları rəfə qoy" — addım-addım, hər addımdan sonra tərif.

3. Hərəkət ehtiyacını yox etməyin, istiqamətləndirin
Oturub sakit qalmağı tələb etmək əvəzinə, "hərəkət fasilələri" planlaşdırın: 15 dəqiqə tapşırıqdan sonra 5 dəqiqə tullanma, qaçma. Bu, "mükafat" deyil, beyninin ehtiyacıdır.

4. Vaxt görünən olsun
DEHB olan uşaqlar üçün "vaxt" abstrakt anlayışdır. Qum saatı, taymer, vizual cədvəl işlədin ki, nə qədər qaldığını GÖRSÜN.

5. Dərhal, konkret rəy verin
"Yaxşı oğlansan" əvəzinə: "Sən indi 5 dəqiqə oturub rəsm çəkdin, bu çox böyük addımdır!" — konkret davranışı tanımaq daha effektivdir.

6. Rutini sabit saxlayın
Eyni vaxtda yemək, eyni vaxtda yatmaq — proqnozlaşdırıla bilən gün DEHB olan beyin üçün təhlükəsizlik və sabitlik yaradır.

Özünüzə qeyd: bu uşaqlar çox vaxt yüksək enerjili, yaradıcı, maraqlı şəxsiyyətlərdir. Məqsəd onun "enerjisini söndürmək" deyil, ona düzgün kanal göstərməkdir. Səbirli struktur — onun ən böyük dostudur.`,
      },
    ],
  },
  {
    order: 11,
    title: "Müstəqillik bacarıqları",
    description:
      "Gündəlik həyatda (geyinmə, yemək, gigiyena) müstəqilliyi addım-addım inkişaf etdirmək üçün üsullar.",
    lessons: [
      {
        title: "Gündəlik rutinlərdə müstəqilliyi artırmaq",
        imageUrl: "/images/lessons/musteqillik.svg",
        articleContent:
`Hər valideynin ən böyük arzularından biri — övladının özü ilə bacarması, çətin günlərdə özünə kömək edə bilməsidir. Müstəqillik bir gündə öyrənilmir, amma hər kiçik addım onu bir az daha yaxınlaşdırır.

Əsas üsul: "Tapşırığı parçalayın" (task analysis)
Böyük bir tapşırığı kiçik addımlara bölün. Məsələn, "əlləri yumaq":
1. Kranı aç
2. Əlləri suya tut
3. Sabunu götür
4. Əlləri ovuştur
5. Suyla yu
6. Kranı bağla
7. Dəsmal ilə qurut

Əvvəlcə hər addımı birlikdə edin, sonra son addımı ona verin ("sən kranı bağla, qalanını mən edərəm"), tədricən geri çəkilin (bu, "geriyə zəncirvari öyrətmə" adlanır).

Vizual cədvəllər işlədin
Sabah rutini üçün şəkilli kart düzəldin: "Oyan → Geyin → Dişləri fırçala → Səhər yeməyi". Uşaq hər addımı görəndə nə gözlədiyini bilir, narahatlığı azalır.

Vaxt verin, tələsdirməyin
Müstəqillik yaratmaq üçün ƏN VACİB şərt — VAXT. Səhər tələsik olanda biz çox vaxt "mən edərəm, daha tez olar" deyirik. Amma hər dəfə bunu etdikdə, uşağa müstəqil olmaq fürsəti vermirik. 10 dəqiqə əlavə vaxt ayırın ki, o özü cəhd etsin.

Kiçik nailiyyətləri qeyd edin
"Özün köynəyini geydin!" — bu, kiçik görünsə də, böyük addımdır. Hər müstəqil hərəkəti tanıyıb tərifləyin.

Səhv etməyə icazə verin
Köynək tərsinə geyilibsə, dərhal düzəltməyin — qoy özü hiss etsin, sonra birlikdə düzəldin. Səhvlər öyrənmənin bir hissəsidir.

Unutmayın: məqsəd "indi mükəmməl etmək" deyil, "get-gedə daha az köməyə ehtiyac duymaqdır". Hər addım — hətta ən kiçiyi də — onun gələcək müstəqilliyinə bir töhfədir.`,
      },
    ],
  },
  {
    order: 12,
    title: "Uzunmüddətli inkişaf planı",
    description:
      "Realist məqsədlər qoymaq, proqresi izləmək və gələcəyə inamla baxmaq üçün son modul.",
    lessons: [
      {
        title: "Gələcəyə baxış: realist məqsədlər qoymaq",
        imageUrl: "/images/lessons/uzunmuddetli.svg",
        articleContent:
`Təbriklər — siz 12 həftəlik yolu keçdiniz! Bu modul, qazandığınız bilik və bacarıqları necə davam etdirəcəyinizi, uzunmüddətli baxışla necə planlaşdıracağınızı izah edir.

1. "SMART" məqsəd qoyma
Hər məqsəd konkret, ölçülə bilən, real, vaxta bağlı olmalıdır:
— Pis nümunə: "Daha yaxşı danışsın"
— Yaxşı nümunə: "3 ay ərzində 2 sözlük cümlələrdə danışmağa başlasın"

Bu, irəliləyişi görməyə və real gözləntilər qurmağa kömək edir.

2. Kiçik addımları qeyd edin
Böyük dəyişiklik bir gündə gəlmir. Gündəlikdə qeyd etdiyiniz kiçik irəliləyişlərə geri baxın — bir ay əvvəl mümkün olmayan nə indi mümkündür? Bu, həm sizə, həm uşağınıza güvən verir.

3. Komanda yanaşması qurun
Tək başına hər şeyi həll etməyə çalışmayın. Mütəxəssis, müəllim, ailə üzvləri — hamısı bir komandanın hissəsidir. Müntəzəm məlumat mübadiləsi (hər kəs nə müşahidə edir) ən yaxşı nəticəni verir.

4. Özünüzə qulluq edin
Valideyn olaraq sizin enerjiniz, sakitliyiniz övladınızın inkişafı üçün ƏSAS resurslardan biridir. Yorulduğunuzu, kömək lazım olduğunu hiss etdikdə, bunu söyləməkdən çəkinməyin. "Mükəmməl valideyn" yoxdur — "səbirli, davamlı dəstəkçi" var.

5. Gələcəyə inamla baxın
Hər uşağın inkişaf yolu fərqlidir, müqayisə etməyin — nə başqa uşaqla, nə də "norma" cədvəli ilə. Övladınızın öz tərəqqisinə fokuslanın.

Bu akademiyanı bitirməklə siz nəinki bilik qazandınız — övladınızla daha dərin, anlayışlı bir əlaqə qurdunuz. Bu, ömürlük davam edəcək bir səyahətdir, və siz onu artıq doğru istiqamətdə başlamısınız.

Sertifikatınızı təbrik edirik — bu, sizin sevginizin və zəhmətinizin sübutudur. 🎉`,
      },
    ],
  },
];
