import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBasket,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

import { SiteNav, SiteFooter } from "@/components/site-nav";
import { useCart } from "@/lib/cart-store";
import { getMeal } from "@/lib/meals-data";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Panier — CuisineEnsemble" },
      { name: "description", content: "Vos réservations de repas partagés." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, update, clear, hydrated, totalSeats } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payOpen, setPayOpen] = useState(false);

  const enriched = items.map((i) => ({ item: i, meal: getMeal(i.mealId) })).filter((x) => x.meal);

  const total = enriched.reduce((s, x) => s + x.meal!.pricePerPerson * x.item.seats, 0);
  const fees = Math.round(total * 0.05);
  const grand = total + fees;

  const checkout = () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setPayOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/"
            hash="meals"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Continuer à explorer
          </Link>

          <div className="mb-10 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <ShoppingBasket className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-primary leading-[0.95] mb-2">
                Votre panier
              </h1>
              <p className="text-lg text-muted-foreground">
                {hydrated
                  ? totalSeats > 0
                    ? `${totalSeats} place${totalSeats > 1 ? "s" : ""} réservée${totalSeats > 1 ? "s" : ""}`
                    : "Votre panier est encore vide."
                  : "Chargement…"}
              </p>
            </div>
          </div>

          {hydrated && enriched.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center">
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore réservé de repas.</p>
              <Link
                to="/"
                hash="meals"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 font-medium hover:bg-primary/90"
              >
                Voir les repas près de chez moi
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
              <div className="space-y-4">
                {enriched.map(({ item, meal }) => {
                  if (!meal) return null;
                  const lineTotal = meal.pricePerPerson * item.seats;
                  return (
                    <article
                      key={item.mealId}
                      className="rounded-3xl border border-border bg-card p-4 flex gap-4"
                    >
                      <Link to="/meals/$mealId" params={{ mealId: meal.id }} className="shrink-0">
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              to="/meals/$mealId"
                              params={{ mealId: meal.id }}
                              className="font-display text-xl uppercase text-foreground hover:text-primary truncate block"
                            >
                              {meal.title}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {meal.host} · {meal.date} · {meal.time}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(item.mealId)}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary"
                            aria-label="Retirer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background">
                            <button
                              onClick={() => update(item.mealId, item.seats - 1)}
                              disabled={item.seats <= 1}
                              className="w-9 h-9 flex items-center justify-center disabled:opacity-40 hover:text-primary"
                              aria-label="Retirer une place"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-medium">{item.seats}</span>
                            <button
                              onClick={() => update(item.mealId, item.seats + 1)}
                              disabled={item.seats >= meal.seatsLeft}
                              className="w-9 h-9 flex items-center justify-center disabled:opacity-40 hover:text-primary"
                              aria-label="Ajouter une place"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {item.seats} × {meal.pricePerPerson} €
                            </div>
                            <div className="font-display text-2xl text-primary">{lineTotal} €</div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <button
                  onClick={clear}
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Vider le panier
                </button>
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-28 self-start">
                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl space-y-4">
                  <h2 className="font-display text-3xl uppercase text-primary">Récapitulatif</h2>

                  <div className="space-y-2 text-sm">
                    <Row label="Sous-total" value={`${total} €`} />
                    <Row label="Frais de service (5 %)" value={`${fees} €`} />
                  </div>

                  <div className="rounded-2xl bg-muted/60 p-4 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="w-4 h-4" /> Total
                    </span>
                    <span className="font-display text-3xl text-primary">{grand} €</span>
                  </div>

                  <button
                    onClick={checkout}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                  >
                    <CreditCard className="w-4 h-4" />
                    {user ? "Confirmer & payer" : "Se connecter pour payer"}
                  </button>
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Paiement sécurisé simulé — aucune vraie carte débitée.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {payOpen && (
        <PaymentModal
          amount={grand}
          onClose={() => setPayOpen(false)}
          onSuccess={() => {
            clear();
            setPayOpen(false);
            navigate({ to: "/" });
          }}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function PaymentModal({
  amount,
  onClose,
  onSuccess,
}: {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (card.replace(/\s/g, "").length < 12) return setError("Numéro de carte invalide");
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return setError("Date d'expiration invalide (MM/AA)");
    if (cvc.length < 3) return setError("Cryptogramme invalide");
    if (name.trim().length < 2) return setError("Nom du porteur requis");
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(onSuccess, 1400);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        {step === "success" ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4 animate-scale-in">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="font-display text-3xl uppercase text-primary mb-2">Paiement validé</h3>
            <p className="text-muted-foreground">
              Vos hôtes viennent d'être notifiés. Bon appétit !
            </p>
          </div>
        ) : step === "processing" ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Traitement du paiement…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-[oklch(0.5_0.18_25)] text-primary-foreground p-5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Paiement sécurisé</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-full p-1 hover:bg-primary-foreground/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="text-center mb-2">
                <div className="text-xs text-muted-foreground">Montant à régler</div>
                <div className="font-display text-5xl text-primary">{amount} €</div>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Numéro de carte
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <input
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    value={card}
                    onChange={(e) => setCard(formatCard(e.target.value))}
                    className="w-full bg-transparent outline-none font-mono tracking-wider"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Expiration
                  </span>
                  <input
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary font-mono"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    CVC
                  </span>
                  <input
                    inputMode="numeric"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary font-mono"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Nom du porteur
                </span>
                <input
                  autoComplete="cc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Camille Voisin"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>

              {error && (
                <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-medium hover:bg-primary/90"
              >
                <Lock className="w-4 h-4" />
                Payer {amount} €
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                Démo — utilisez n'importe quel numéro (ex. 4242 4242 4242 4242).
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
