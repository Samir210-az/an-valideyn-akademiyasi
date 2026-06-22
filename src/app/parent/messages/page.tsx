"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpModal } from "@/components/shared/HelpModal";
import { useAuth } from "@/context/AuthContext";
import { getUsersByRole } from "@/lib/firestore/users";
import { getConversation, sendMessage } from "@/lib/firestore/messages";
import type { AppUser, Message } from "@/types";

export default function ParentMessagesPage() {
  const { appUser } = useAuth();
  const [specialists, setSpecialists] = useState<AppUser[]>([]);
  const [activeSpecialist, setActiveSpecialist] = useState<AppUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUsersByRole("specialist").then((list) => {
      setSpecialists(list);
      setActiveSpecialist(list[0] ?? null);
    });
  }, []);

  useEffect(() => {
    if (!appUser || !activeSpecialist) return;
    getConversation(appUser.uid, activeSpecialist.uid).then(setMessages);
  }, [appUser, activeSpecialist]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!appUser || !activeSpecialist || !text.trim()) return;
    await sendMessage(appUser.uid, activeSpecialist.uid, text);
    setText("");
    getConversation(appUser.uid, activeSpecialist.uid).then(setMessages);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mesajlar</h1>
          <p className="mt-1 text-sm text-slate-500">Mütəxəssislə birbaşa ünsiyyət</p>
        </div>
        <HelpModal title="Mesajlar necə işləyir?">
          <p>
            Soldaki siyahıdan mütəxəssisi seçin, sağda yazışma tarixçəsi açılacaq. Aşağıdaki sahəyə
            yazıb göndərin — bildiriş mütəxəssisə də çatacaq.
          </p>
          <p>
            Bunu sual vermək, gündəlik qeyddə yazmadığınız bir vəziyyəti izah etmək, və ya
            tapşırıqla bağlı aydınlıq almaq üçün istifadə edə bilərsiniz.
          </p>
          <p className="text-xs text-slate-500">
            Təcili tibbi vəziyyətlərdə bu mesajlaşmaya etibar etməyin — birbaşa müvafiq tibbi
            müəssisəyə müraciət edin.
          </p>
        </HelpModal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="mb-3 text-sm font-medium text-slate-700">Mütəxəssislər</p>
          <div className="space-y-1">
            {specialists.length === 0 && (
              <p className="text-sm text-slate-400">Hələ mütəxəssis təyin olunmayıb.</p>
            )}
            {specialists.map((s) => (
              <button
                key={s.uid}
                onClick={() => setActiveSpecialist(s)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeSpecialist?.uid === s.uid
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {s.fullName}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col lg:col-span-2" style={{ height: 480 }}>
          {!activeSpecialist ? (
            <p className="text-sm text-slate-400">Söhbət başlamaq üçün mütəxəssis seçin.</p>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.senderId === appUser?.uid
                        ? "ml-auto bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1"
                />
                <Button type="submit">Göndər</Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
