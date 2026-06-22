"use client";

import { Reveal } from "./Reveal";

const problems = [
  {
    icon: "😟",
    title: "Hara müraciət edəcəyini bilmirsən",
    text: "Övladında çətinlik gördükdə haradan başlamaq, kimə güvənmək lazım olduğunu bilməmək.",
  },
  {
    icon: "⏳",
    title: "Növbə və vaxt çatışmazlığı",
    text: "Mütəxəssis görüşləri arasındaki boşluqda evdə nə etməli olduğunu bilməmək.",
  },
  {
    icon: "💸",
    title: "Bahalı, fasiləli dəstək",
    text: "Tək-tək seanslar nə davamlı, nə də hər zaman əlçatandır.",
  },
];

const solutions = [
  {
    icon: "🎯",
    title: "Addım-addım 12 həftəlik yol xəritəsi",
    text: "Hər həftə konkret, evdə tətbiq edə biləcəyiniz bacarıqlar — qarışıqlıq yox, aydın istiqamət.",
  },
  {
    icon: "👩‍⚕️",
    title: "Mütəxəssis həmişə yanınızda",
    text: "Tapşırıqlarınızı izləyən, fikir bildirən, sualınıza cavab verən real mütəxəssis dəstəyi.",
  },
  {
    icon: "📈",
    title: "Gördüyünüz irəliləyiş",
    text: "Gündəlik qeydlər və qrafiklərlə övladınızın inkişafını öz gözünüzlə izləyirsiniz.",
  },
];

export function ProblemSolution() {
  return (
    <section className="bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Tək deyilsiniz. Yolunuz var.
          </h2>
          <p className="mt-4 text-slate-600">
            Çoxlu valideyn eyni narahatlıqları yaşayır. Fərq edən — düzgün, davamlı dəstəyə çıxış əldə edə bilməkdir.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-rose-100 bg-rose-50/60 p-6">
                <div className="text-3xl">{p.icon}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-16 flex max-w-fit items-center gap-3 text-indigo-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
          <span className="text-sm font-semibold uppercase tracking-wide">
            AN Valideyn Akademiyası bunu necə dəyişir
          </span>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
