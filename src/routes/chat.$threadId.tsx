import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Info, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

import { SiteNav } from "@/components/site-nav";
import { getMeal } from "@/lib/meals-data";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type Msg = {
  id: string;
  author: string;
  text: string;
  mine?: boolean;
  time: string;
  system?: boolean;
};

type ChatChannelMessage = {
  type: "message";
  threadId: string;
  message: Msg;
};

function readThreadMessages(storageKey: string, fallback: Msg[]): Msg[] {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as Msg[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeThreadMessages(storageKey: string, messages: Msg[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(messages));
  } catch {
    // Ignore localStorage serialization failures in private browsing or locked storage.
  }
}

function playIncomingMessageTone() {
  if (typeof window === "undefined") return;

  const AudioCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtor) return;

  const audioContext = new AudioCtor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.24);
  oscillator.onended = () => {
    void audioContext.close().catch(() => undefined);
  };
}

export const Route = createFileRoute("/chat/$threadId")({
  loader: ({ params }) => {
    const meal = getMeal(params.threadId);
    if (!meal) throw notFound();
    return { meal };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Chat · ${loaderData.meal.title} — CuisineEnsemble` },
          { name: "robots", content: "noindex" },
        ]
      : [{ title: "Chat introuvable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-display text-4xl text-primary mb-4">Conversation introuvable</h1>
        <Link to="/chat" className="text-primary underline">
          Toutes les conversations
        </Link>
      </div>
    </div>
  ),
  component: ChatThread,
});

function ChatThread() {
  const { meal } = Route.useLoaderData();
  const channelName = `cuisineensemble-chat-${meal.id}`;
  const storageKey = `cuisineensemble.chat.${meal.id}.v1`;

  const initial = useMemo<Msg[]>(
    () => [
      {
        id: "s1",
        author: "system",
        text: `Bienvenue dans le chat du repas “${meal.title}” — ${meal.date} à ${meal.time}.`,
        system: true,
        time: "09:00",
      },
      {
        id: "1",
        author: meal.host.split(" ")[0],
        text: `Coucou tout le monde ! Rendez-vous ${meal.time} à ${meal.address ?? meal.neighborhood}. Si vous avez des allergies pensez à me le signaler 🙏`,
        time: "09:12",
      },
      {
        id: "2",
        author: "Marie",
        text: "Merci ! Je peux amener une bouteille de vin blanc ?",
        time: "09:20",
      },
      {
        id: "3",
        author: meal.host.split(" ")[0],
        text: "Avec plaisir 🍷 Ça ira très bien avec le plat.",
        time: "09:22",
      },
      {
        id: "4",
        author: "Tom",
        text: "Je suis intolérant au lactose, c'est ok ?",
        time: "10:03",
      },
    ],
    [meal],
  );

  const [messages, setMessages] = useState<Msg[]>(() => readThreadMessages(storageKey, initial));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncFromStorage = () => {
      setMessages(readThreadMessages(storageKey, initial));
    };

    if (hasSupabaseConfig && supabase) {
      const subscription = supabase
        .channel(`chat:${meal.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `thread_id=eq.${meal.id}`,
          },
          (payload) => {
            const incoming = payload.new as { id: string; author_name: string; body: string };
            const nextMessage: Msg = {
              id: incoming.id,
              author: incoming.author_name,
              text: incoming.body,
              time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((current) => {
              if (current.some((message) => message.id === nextMessage.id)) return current;
              const next = [...current, nextMessage];
              writeThreadMessages(storageKey, next);
              toast.success(`Nouveau message · ${nextMessage.author}`, {
                description: nextMessage.text,
              });
              playIncomingMessageTone();
              return next;
            });
          },
        )
        .subscribe();

      window.addEventListener("storage", syncFromStorage);

      return () => {
        subscription.unsubscribe();
        window.removeEventListener("storage", syncFromStorage);
      };
    }

    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(channelName);
    const onMessage = (event: MessageEvent<ChatChannelMessage>) => {
      const incoming = event.data;
      if (!incoming || incoming.type !== "message" || incoming.threadId !== meal.id) return;

      setMessages((current) => {
        if (current.some((m) => m.id === incoming.message.id)) return current;
        const next = [...current, incoming.message];
        writeThreadMessages(storageKey, next);
        toast.success(`Nouveau message · ${incoming.message.author}`, {
          description: incoming.message.text,
        });
        playIncomingMessageTone();
        return next;
      });
    };

    channel.addEventListener("message", onMessage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [channelName, initial, meal.id, storageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    writeThreadMessages(storageKey, messages);
  }, [messages, storageKey]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;

    const nextMessage: Msg = {
      id: crypto.randomUUID(),
      author: "Vous",
      text: t,
      mine: true,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((current) => {
      const next = [...current, nextMessage];
      writeThreadMessages(storageKey, next);
      return next;
    });

    if (hasSupabaseConfig && supabase) {
      supabase.from("messages").insert({
        thread_id: meal.id,
        author_name: "Vous",
        body: t,
      });
    } else if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage({ type: "message", threadId: meal.id, message: nextMessage });
      channel.close();
    }

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1 flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Toutes les conversations
          </Link>

          {/* Thread header */}
          <div className="rounded-2xl border border-border bg-card p-4 mb-4 flex items-center gap-4">
            <img src={meal.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <Link
                to="/meals/$mealId"
                params={{ mealId: meal.id }}
                className="font-display text-2xl uppercase text-foreground hover:text-primary block truncate"
              >
                {meal.title}
              </Link>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {meal.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {meal.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {meal.seatsTotal - meal.seatsLeft}/{meal.seatsTotal} convives
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-[400px] rounded-3xl border border-border bg-card p-4 sm:p-6 overflow-y-auto space-y-4"
          >
            {messages.map((m) =>
              m.system ? (
                <div key={m.id} className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5" /> {m.text}
                  </span>
                </div>
              ) : (
                <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${m.mine ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm shrink-0 ${
                        m.mine
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {m.author[0]}
                    </div>
                    <div>
                      <div
                        className={`text-xs text-muted-foreground mb-1 ${m.mine ? "text-right" : ""}`}
                      >
                        {m.author} · {m.time}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.mine
                            ? "bg-primary text-primary-foreground rounded-tr-md"
                            : "bg-background border border-border text-foreground rounded-tl-md"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Composer */}
          <form onSubmit={send} className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrire un message…"
              className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3.5 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> Envoyer
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
