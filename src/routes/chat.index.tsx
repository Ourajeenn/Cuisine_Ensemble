import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Users } from "lucide-react";

import { MEALS } from "@/lib/meals-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Messagerie — CuisineEnsemble" },
      { name: "description", content: "Chats de groupe pour coordonner vos repas partagés." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-display text-5xl sm:text-6xl uppercase text-primary mb-3">
              Vos conversations
            </h1>
            <p className="text-lg text-muted-foreground">
              Un chat de groupe est ouvert pour chaque repas auquel vous participez.
            </p>
          </div>

          <ul className="space-y-3">
            {MEALS.map((m) => (
              <li key={m.id}>
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: m.id }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary hover:shadow-lg transition-all"
                >
                  <img src={m.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-xl uppercase text-foreground truncate">
                        {m.title}
                      </h2>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {m.date} · {m.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {m.host} · {m.seatsTotal - m.seatsLeft} convives
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-4 h-4" />
                    <MessageCircle className="w-5 h-5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
