"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";

interface Broadcast {
  id: string;
  title: string;
  body: string;
  target: "all" | "parent" | "specialist";
  createdAt?: { seconds: number };
}

const SEEN_KEY = "an_academy_last_seen_notification";

export function NotificationBell() {
  const { appUser } = useAuth();
  const [items, setItems] = useState<Broadcast[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(0);

  useEffect(() => {
    if (!db || !appUser) return;
    setLastSeen(Number(localStorage.getItem(SEEN_KEY) ?? 0));

    getDocs(query(collection(db, "broadcastNotifications"), orderBy("createdAt", "desc"), limit(30)))
      .then((snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Broadcast));
        const relevant = all.filter((n) => n.target === "all" || n.target === appUser.role);
        setItems(relevant);
      })
      .catch(() => setItems([]));
  }, [appUser]);

  function handleOpen() {
    setOpen((v) => !v);
    const now = Date.now();
    localStorage.setItem(SEEN_KEY, String(now));
    setLastSeen(now);
  }

  const unreadCount = items.filter((n) => (n.createdAt?.seconds ?? 0) * 1000 > lastSeen).length;

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        aria-label="Bildirişlər"
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            <p className="px-2 py-1.5 text-xs font-semibold text-slate-500">Bildirişlər</p>
            {items.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-slate-400">Hələ bildiriş yoxdur.</p>
            ) : (
              items.map((n) => (
                <div key={n.id} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{n.body}</p>
                  {n.createdAt?.seconds && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(n.createdAt.seconds * 1000).toLocaleString("az-AZ")}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
