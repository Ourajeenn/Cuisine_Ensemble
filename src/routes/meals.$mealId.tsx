import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Star,
  Users,
  Utensils,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import { getMeal } from "@/lib/meals-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DietBadge } from "@/components/diet-badge";
import { useCart } from "@/lib/cart-store";
import { RatingSection } from "@/components/rating-section";

export const Route = createFileRoute("/meals/$mealId")({
  loader: ({ params }) => {
    const meal = getMeal(params.mealId);
    if (!meal) throw notFound();
    return { meal };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.meal.title} — CuisineEnsemble` },
          {
            name: "description",
            content: `${loaderData.meal.cuisine} chez ${loaderData.meal.host}. ${loaderData.meal.seatsLeft} places restantes · ${loaderData.meal.pricePerPerson} €/pers.`,
          },
        ]
      : [{ title: "Repas introuvable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-display text-6xl text-primary mb-4">Repas introuvable</h1>
        <Link to="/" className="text-primary underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  ),
  component: MealDetail,
});

function MealDetail() {
  const { meal } = Route.useLoaderData();
  const { add } = useCart();
  const [seats, setSeats] = useState(1);
  const max = meal.seatsLeft;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Tous les repas
          </Link>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
            {/* Left: image + description */}
            <div>
              <div className="rounded-[2rem] overflow-hidden border-8 border-card shadow-xl mb-8 aspect-[4/3]">
                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {meal.diets.map((d: import("@/lib/meals-data").Diet) => (
                  <DietBadge key={d} diet={d} />
                ))}
              </div>

              <h1 className="font-display text-5xl sm:text-6xl uppercase text-foreground leading-[0.95] mb-3">
                {meal.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {meal.cuisine} · Chez {meal.host}
              </p>

              <p className="text-base leading-relaxed text-foreground/90 mb-10">
                {meal.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <InfoTile icon={Calendar} label="Date" value={meal.date} />
                <InfoTile icon={Clock} label="Heure" value={meal.time} />
                <InfoTile icon={MapPin} label="Adresse" value={meal.address ?? meal.neighborhood} />
                <InfoTile
                  icon={Users}
                  label="Convives"
                  value={`${meal.seatsTotal - meal.seatsLeft}/${meal.seatsTotal} inscrits`}
                />
              </div>

              {meal.menu && meal.menu.length > 0 && (
                <section className="mb-10">
                  <h2 className="font-display text-3xl uppercase text-primary mb-4 flex items-center gap-2">
                    <Utensils className="w-6 h-6" /> Au menu
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {meal.menu.map((m: string) => (
                      <li
                        key={m}
                        className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {meal.allergens && meal.allergens.length > 0 && (
                <section className="mb-10">
                  <h2 className="font-display text-3xl uppercase text-primary mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6" /> Allergènes présents
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {meal.allergens.map((a: string) => (
                      <span
                        key={a}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              <RatingSection mealId={meal.id} host={meal.host} baseRating={meal.hostRating} />
            </div>

            {/* Right: sticky booking panel */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-display text-4xl text-primary">
                    {meal.pricePerPerson} €
                  </span>
                  <span className="text-sm text-muted-foreground">/ personne</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
                  <Star className="w-4 h-4 fill-highlight text-highlight" />
                  <strong className="text-foreground">{meal.hostRating}</strong>
                  <span>· hôte vérifié</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Places réservées</span>
                    <span>
                      {meal.seatsTotal - meal.seatsLeft}/{meal.seatsTotal}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${((meal.seatsTotal - meal.seatsLeft) / meal.seatsTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Nombre de places</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      className="w-10 h-10 rounded-xl border border-border bg-background hover:border-primary flex items-center justify-center"
                      aria-label="Retirer une place"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-display text-3xl w-12 text-center">{seats}</span>
                    <button
                      onClick={() => setSeats((s) => Math.min(max, s + 1))}
                      className="w-10 h-10 rounded-xl border border-border bg-background hover:border-primary flex items-center justify-center"
                      aria-label="Ajouter une place"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground ml-auto">{max} restantes</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-muted/50 p-4 mb-6">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {seats} × {meal.pricePerPerson} €
                    </span>
                    <span className="text-foreground font-medium">
                      {seats * meal.pricePerPerson} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="w-4 h-4" /> Total à régler
                    </span>
                    <span className="font-display text-2xl text-primary">
                      {seats * meal.pricePerPerson} €
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => add(meal.id, seats)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 mb-3"
                >
                  <Plus className="w-4 h-4" /> Ajouter au panier
                </button>
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: meal.id }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background py-3 font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  <MessageCircle className="w-4 h-4" /> Chat du repas
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
