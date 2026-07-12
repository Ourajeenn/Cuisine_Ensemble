import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Heart,
  ChefHat,
  ArrowRight,
  Plus,
  Search,
  Calendar,
  Wallet,
  Sparkles,
  Leaf,
} from "lucide-react";

import heroImg from "@/assets/hero-shared-meal.jpg";
import { MEALS, DIET_FILTERS, type Diet, type Meal } from "@/lib/meals-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DietBadge } from "@/components/diet-badge";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [filter, setFilter] = useState<(typeof DIET_FILTERS)[number]>("Tous");
  const [query, setQuery] = useState("");

  const meals = useMemo(() => {
    return MEALS.filter((m) => {
      const okDiet = filter === "Tous" || m.diets.includes(filter as Diet);
      const q = query.trim().toLowerCase();
      const okQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.cuisine.toLowerCase().includes(q) ||
        m.neighborhood.toLowerCase().includes(q);
      return okDiet && okQuery;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-24 lg:pt-16 lg:pb-32">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-highlight/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium text-primary shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Nouveau à Lyon
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-secondary">
                  <Heart className="w-3.5 h-3.5" /> 100% convivial
                </span>
              </div>

              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] uppercase text-foreground mb-6">
                Une table.
                <br />
                <span className="text-primary">Un quartier.</span>
                <br />
                Zéro isolement.
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Proposez un repas ou rejoignez celui d'un voisin. On partage la cuisine, le prix, et
                un vrai moment ensemble.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#meals"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:bg-primary/90 transition-all"
                >
                  Trouver un repas
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground/20 bg-card px-6 py-4 text-lg font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ChefHat className="w-5 h-5" />
                  Proposer un repas
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {["#ce3f23", "#1c7755", "#ffc446", "#8b5cf6"].map((c) => (
                    <span
                      key={c}
                      className="w-9 h-9 rounded-full border-2 border-background"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground">+320 voisins</strong> ont déjà partagé un
                  repas ce mois-ci
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2.5rem] border-8 border-card shadow-2xl shadow-primary/20 aspect-[4/5]">
                <img
                  src={heroImg}
                  alt="Table conviviale avec plats du monde partagés"
                  width={1600}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 sm:-left-10 bg-card/95 backdrop-blur-md rounded-2xl border border-border p-4 shadow-xl w-64">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-highlight/30 text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ce soir, 19h30</p>
                    <p className="text-xs text-muted-foreground">2 places restantes · 12 €</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">4,9 / 5</span>
                </div>
                <p className="text-xs opacity-90">note moyenne des hôtes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="w-full overflow-hidden bg-primary py-4 border-y border-primary-foreground/10">
        <div className="flex whitespace-nowrap">
          <Marquee />
          <Marquee />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <h2 className="font-display text-5xl md:text-6xl uppercase text-primary mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-muted-foreground">
              Trois étapes pour transformer un dîner en rencontre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Trouve un repas",
                text: "Filtre par quartier, cuisine, régime ou budget. Consulte les avis des hôtes.",
                color: "text-primary bg-primary/10",
              },
              {
                icon: Wallet,
                title: "Partage le coût",
                text: "Le prix par personne couvre les ingrédients. La plateforme répartit tout, automatiquement.",
                color: "text-secondary bg-secondary/10",
              },
              {
                icon: MessageCircle,
                title: "Coordonne & mange",
                text: "Chat de groupe pour les détails, allergies, contributions. Puis à table !",
                color: "text-foreground bg-highlight/30",
              },
            ].map((s, i) => (
              <div
                key={s.title}
                className="rounded-3xl border border-border bg-background p-8 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className={`inline-flex p-3 rounded-2xl ${s.color} mb-6`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="font-display text-4xl uppercase text-muted-foreground mb-2">
                  0{i + 1}
                </div>
                <h3 className="font-display text-3xl uppercase text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meals grid */}
      <section id="meals" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-5xl md:text-6xl uppercase text-primary mb-4">
                Repas près de chez vous
              </h2>
              <p className="text-xl text-muted-foreground">
                Sélection fraîche des tables ouvertes cette semaine dans votre quartier.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm min-w-[280px]">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cuisine, quartier, plat…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {DIET_FILTERS.map((d) => {
              const active = filter === d;
              return (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`font-display uppercase text-xl px-6 py-2 rounded-full border-2 transition-all ${
                    active
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {meals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
              Aucun repas ne correspond. Élargissez vos critères ou{" "}
              <Link to="/create" className="text-primary underline">
                proposez le vôtre
              </Link>
              .
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((m) => (
                <MealCard key={m.id} meal={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive map */}
      <MapSection />

      {/* Host CTA */}
      <section id="host" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-[oklch(0.5_0.18_25)] p-10 sm:p-14 text-primary-foreground shadow-2xl shadow-primary/30">
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-highlight/30 blur-3xl" />
            <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
              <div>
                <h2 className="font-display text-5xl md:text-6xl uppercase leading-[0.95] mb-4">
                  Vous cuisinez ce week-end ?<br />
                  <span className="text-highlight">Ouvrez votre table.</span>
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Indiquez le nombre de convives, le prix par personne, les allergies gérées. Nous
                  répartissons les contributions automatiquement.
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 rounded-2xl bg-background text-primary px-6 py-4 text-lg font-medium hover:-translate-y-0.5 transition-transform shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Créer mon repas
                </Link>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Users, text: "Choisissez 2 à 12 convives" },
                  { icon: Wallet, text: "Prix par personne, répartition auto" },
                  { icon: Leaf, text: "Précisez régimes & allergies" },
                  { icon: MessageCircle, text: "Chat de groupe intégré" },
                ].map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-4 py-3"
                  >
                    <f.icon className="w-5 h-5 shrink-0" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Marquee() {
  const items = [
    "PARTAGEZ VOTRE TABLE",
    "RENCONTREZ VOS VOISINS",
    "DÉCOUVREZ LE MONDE À TABLE",
    "COÛTS PARTAGÉS ÉQUITABLEMENT",
    "COMMUNAUTÉ · CONVIVIALITÉ · CUISINE",
  ];
  return (
    <div className="flex items-center shrink-0 animate-marquee">
      {items.map((t, i) => (
        <span
          key={i}
          className="font-display uppercase tracking-widest text-3xl text-primary-foreground mx-6 flex items-center gap-6"
        >
          {t}
          <span className="w-2 h-2 rounded-full bg-highlight" />
        </span>
      ))}
    </div>
  );
}

function MapSection() {
  const [selected, setSelected] = useState<string | null>(MEALS[0].id);
  const points = MEALS.map((m, i) => ({
    meal: m,
    top: [22, 55, 72, 35][i % 4] + "%",
    left: [28, 62, 35, 70][i % 4] + "%",
  }));
  const active = MEALS.find((m) => m.id === selected) ?? MEALS[0];
  const mapBounds = [
    active.longitude - 0.025,
    active.latitude - 0.025,
    active.longitude + 0.025,
    active.latitude + 0.025,
  ].join("%2C");
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=${active.latitude}%2C${active.longitude}`;

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div className="animate-fade-in-up">
            <h2 className="font-display text-5xl md:text-6xl uppercase text-primary mb-4">
              La carte du quartier
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Cliquez sur un point pour découvrir le repas. Les pastilles pulsent quand il reste des
              places.
            </p>
            <ul className="space-y-3 text-foreground mb-8">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-primary animate-soft-pulse" /> Repas
                ouverts
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-highlight" /> À venir cette semaine
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-secondary" /> Vos hôtes favoris
              </li>
            </ul>

            <article
              key={active.id}
              className="rounded-2xl border border-border bg-background p-4 flex gap-3 animate-scale-in shadow-md"
            >
              <img src={active.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-xl uppercase text-foreground truncate">
                  {active.title}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {active.host} · {active.date}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">
                    {active.pricePerPerson} € / pers.
                  </span>
                  <Link
                    to="/meals/$mealId"
                    params={{ mealId: active.id }}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Détails <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-8 border-background shadow-xl animate-fade-in">
            <iframe
              title="Carte de Lyon – repas CuisineEnsemble"
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {points.map((p) => {
              const isActive = p.meal.id === selected;
              return (
                <button
                  key={p.meal.id}
                  type="button"
                  onClick={() => setSelected(p.meal.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ top: p.top, left: p.left }}
                  aria-label={p.meal.title}
                  aria-pressed={isActive}
                  title={p.meal.title}
                >
                  <span className="relative flex items-center justify-center">
                    {isActive && (
                      <span className="absolute inset-0 w-10 h-10 -m-3 rounded-full bg-primary/40 animate-ping-slow" />
                    )}
                    <span
                      className={`relative block rounded-full ring-4 ring-background shadow-lg transition-all ${
                        isActive
                          ? "w-6 h-6 bg-primary scale-110"
                          : "w-4 h-4 bg-primary/80 group-hover:scale-125 animate-soft-pulse"
                      }`}
                    />
                  </span>
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 top-8 whitespace-nowrap bg-foreground text-background text-xs px-3 py-1.5 rounded-full shadow-lg animate-fade-in-up">
                      {p.meal.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const { add } = useCart();
  const share = (meal.pricePerPerson * meal.seatsTotal).toFixed(0);
  return (
    <article className="group flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all">
      <Link
        to="/meals/$mealId"
        params={{ mealId: meal.id }}
        className="relative h-56 overflow-hidden block"
      >
        <img
          src={meal.image}
          alt={meal.title}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {meal.popular && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-highlight px-3 py-1 text-xs font-medium text-highlight-foreground shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Populaire
          </span>
        )}
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-3 py-1 text-xs font-medium text-foreground shadow-md">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {meal.distanceKm.toFixed(1)} km
        </span>
      </Link>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            to="/meals/$mealId"
            params={{ mealId: meal.id }}
            className="font-display text-2xl uppercase text-foreground leading-tight hover:text-primary transition-colors"
          >
            {meal.title}
          </Link>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-sm font-medium whitespace-nowrap">
            {meal.pricePerPerson} €<span className="text-xs opacity-70">/pers.</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {meal.cuisine} · Chez {meal.host}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {meal.diets.map((d) => (
            <DietBadge key={d} diet={d} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" /> {meal.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" /> {meal.time}
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-highlight text-highlight" /> {meal.hostRating}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {meal.seatsTotal - meal.seatsLeft}/{meal.seatsTotal} convives
            </span>
            <span>Cagnotte : {share} €</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((meal.seatsTotal - meal.seatsLeft) / meal.seatsTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => add(meal.id, 1)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Réserver
          </button>
          <Link
            to="/meals/$mealId"
            params={{ mealId: meal.id }}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border-2 border-border bg-card px-4 py-3 font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Détails
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
