import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 text-center">
      <span className="mb-4 rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium text-indigo-700">
        AN Psixoloji Dəstək və Reabilitasiya Mərkəzi
      </span>
      <h1 className="max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
        AN Valideyn Akademiyası
      </h1>
      <p className="mt-4 max-w-xl text-slate-600">
        Autizm, DEHB, nitq gecikməsi, sensor problemlər və davranış çətinlikləri olan
        uşaqların valideynlərinə evdə düzgün müdaxiləni öyrədən 12 həftəlik sistemli
        onlayn təlim proqramı.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/register">
          <Button>Qeydiyyatdan keç</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Daxil ol</Button>
        </Link>
      </div>
    </main>
  );
}
