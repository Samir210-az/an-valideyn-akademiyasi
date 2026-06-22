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

export default function SpecialistMessagesPage() {
  const { appUser } = useAuth();
  const [parents, setParents] = useState<AppUser[]>([]);
  const [activeParent, setActiveParent] = useState<AppUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUsersByRole("parent").then((list) => {
      setParents(list);
      setActiveParent(list[0] ?? null);
    });
  }, []);

  useEffect(() => {
    if (!appUser || !activeParent) return;
    getConversation(appUser.uid, activeParent.uid).then(setMessages);
  }, [appUser, activeParent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!appUser || !activeParent || !text.trim()) return;
    await sendMessage(appUser.uid, activeParent.uid, text);
    setText("");
    getConversation(appUser.uid, activeParent.uid).then(setMessages);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mesajlar</h1>
          <p className="mt-1 text-sm text-slate-500">Valideynlərlə birbaşa ünsiyyət</p>
        </div>
        <HelpModal title="Mesajlardan necə istifadə etməli?">
          <p>
            Soldan valideyni seçin, yazışma tarixçəsini görün, aşağıdan cavab yazın. Bunu tapşırıq
            izahı, gündəlik qeydlə bağlı sual, ya da ümumi məsləhət üçün işlədin.
          </p>
          <p className="text-xs text-slate-500">
            Tövsiyə: cavabları konkret və əməli saxlayın — valideyn bunu evdə dərhal tətbiq edə
            bilməlidir.
          </p>
        </HelpModal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="mb-3 text-sm font-medium text-slate-700">Valideynlər</p>
          <div className="space-y-1">
            {parents.length === 0 && (
              <p className="text-sm text-slate-400">Hələ valideyn qeydiyyatdan keçməyib.</p>
            )}
            {parents.map((p) => (
              <button
                key={p.uid}
                onClick={() => setActiveParent(p)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeParent?.uid === p.uid
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p.fullName}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col lg:col-span-2" style={{ height: 480 }}>
          {!activeParent ? (
            <p className="text-sm text-slate-400">Söhbət başlamaq üçün valideyn seçin.</p>
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
