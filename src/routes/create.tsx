import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, ChefHat, Check, Clock, MapPin, Users, Wallet } from "lucide-react";

import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DIET_FILTERS, type Diet } from "@/lib/meals-data";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Proposer un repas — CuisineEnsemble" },
      {
        name: "description",
        content:
          "Ouvrez votre table : choisissez le nombre de convives, le prix par personne, les allergies gérées.",
      },
    ],
  }),
  component: CreateMeal,
});

const DIETS: Diet[] = DIET_FILTERS.filter((d) => d !== "Tous") as Diet[];

function CreateMeal() {
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:30");
  const [seats, setSeats] = useState(6);
  const [price, setPrice] = useState(12);
  const [description, setDescription] = useState("");
  const [menu, setMenu] = useState("");
  const [allergens, setAllergens] = useState("");
  const [diets, setDiets] = useState<Diet[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleDiet = (d: Diet) =>
    setDiets((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const cagnotte = seats * price;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/15 text-secondary mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="font-display text-5xl uppercase text-primary mb-3">
              Votre repas est en ligne !
            </h1>
            <p className="text-muted-foreground mb-8">
              Les voisins du quartier peuvent désormais réserver. Vous recevrez une notification à
              chaque nouvelle inscription et un chat de groupe sera créé automatiquement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 font-medium hover:bg-primary/90"
              >
                Voir tous les repas
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-3.5 font-medium hover:border-primary hover:text-primary"
              >
                Créer un autre repas
              </button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>

          <div className="mb-10 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-primary leading-[0.95] mb-2">
                Ouvrez votre table
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Renseignez les infos ci-dessous. Nous nous occupons de la répartition des coûts et
                du chat de groupe.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
            <div className="space-y-6">
              <Section title="Le repas">
                <Field label="Titre">
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex. Ratatouille du sud & tarte aux figues"
                    className="input"
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Type de cuisine">
                    <input
                      required
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      placeholder="Italienne, Marocaine…"
                      className="input"
                    />
                  </Field>
                  <Field label="Adresse ou quartier" icon={MapPin}>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Croix-Rousse, Lyon"
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Racontez l'ambiance, la recette, ce que vous préparez…"
                    className="input resize-none"
                  />
                </Field>
              </Section>

              <Section title="Quand & combien">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Date" icon={Calendar}>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input"
                    />
                  </Field>
                  <Field label="Heure" icon={Clock}>
                    <input
                      required
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={`Convives : ${seats}`} icon={Users}>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </Field>
                  <Field label="Prix par personne (€)" icon={Wallet}>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="input"
                    />
                  </Field>
                </div>
              </Section>

              <Section title="Régimes & allergies">
                <div className="flex flex-wrap gap-2">
                  {DIETS.map((d) => {
                    const on = diets.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDiet(d)}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition ${
                          on
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <Field label="Menu prévu (une entrée par ligne)">
                  <textarea
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                    rows={3}
                    placeholder={"Entrée\nPlat principal\nDessert"}
                    className="input resize-none"
                  />
                </Field>
                <Field label="Allergènes présents (séparés par virgules)">
                  <input
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    placeholder="Gluten, œufs, fruits à coque"
                    className="input"
                  />
                </Field>
              </Section>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl space-y-5">
                <h3 className="font-display text-3xl uppercase text-primary">Récapitulatif</h3>

                <div className="text-sm space-y-2">
                  <Row label="Titre" value={title || "—"} />
                  <Row label="Cuisine" value={cuisine || "—"} />
                  <Row label="Lieu" value={address || "—"} />
                  <Row label="Date" value={date || "—"} />
                  <Row label="Heure" value={time || "—"} />
                  <Row label="Convives" value={`${seats} pers.`} />
                  <Row label="Prix / pers." value={`${price} €`} />
                </div>

                <div className="rounded-2xl bg-muted/60 p-4">
                  <div className="text-xs text-muted-foreground">Cagnotte estimée</div>
                  <div className="font-display text-4xl text-primary">{cagnotte} €</div>
                  <div className="text-xs text-muted-foreground">
                    Répartie automatiquement entre les {seats} convives
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-medium hover:bg-primary/90 shadow-lg shadow-primary/30"
                >
                  Publier mon repas
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Vous pourrez modifier ces informations jusqu'à 24 h avant.
                </p>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <SiteFooter />

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
      <h2 className="font-display text-2xl uppercase text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium mb-2 text-foreground">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}
