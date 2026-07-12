import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { useRatings } from "@/lib/ratings-store";
import { useAuth } from "@/lib/auth-store";
import { Link } from "@tanstack/react-router";

export function RatingSection({
  mealId,
  host,
  baseRating,
}: {
  mealId: string;
  host: string;
  baseRating: number;
}) {
  const { list, avg, add, hydrated } = useRatings(mealId);
  const { user } = useAuth();
  const [hover, setHover] = useState(0);
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const displayed = avg ?? baseRating;
  const totalReviews = list.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !user) return;
    add({ mealId, rating: value, comment: comment.trim() || undefined, author: user.name });
    setValue(0);
    setComment("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section className="mb-10 animate-fade-in-up">
      <h2 className="font-display text-3xl uppercase text-primary mb-4 flex items-center gap-2">
        <Star className="w-6 h-6" /> Avis sur {host.split(" ")[0]}
      </h2>

      <div className="rounded-3xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="font-display text-5xl text-primary">{displayed.toFixed(1)}</div>
          <div>
            <StarDisplay value={displayed} />
            <div className="text-xs text-muted-foreground mt-1">
              {totalReviews > 0
                ? `${totalReviews} avis récent${totalReviews > 1 ? "s" : ""} + hôte vérifié`
                : "Hôte vérifié · aucun avis récent"}
            </div>
          </div>
        </div>

        {user ? (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Votre note
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setValue(n)}
                    className="p-1 transition-transform hover:scale-125"
                    aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        n <= (hover || value)
                          ? "fill-highlight text-highlight"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="Un mot sur votre expérience (optionnel)"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {sent ? "Merci pour votre avis !" : `${comment.length}/280`}
              </span>
              <button
                type="submit"
                disabled={!value}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 hover:scale-105 transition-transform"
              >
                <ThumbsUp className="w-4 h-4" /> Publier mon avis
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground text-center">
            <Link to="/auth" className="text-primary font-medium hover:underline">
              Connectez-vous
            </Link>{" "}
            pour noter votre hôte.
          </div>
        )}
      </div>

      {hydrated && list.length > 0 && (
        <ul className="space-y-3">
          {list.slice(0, 5).map((r, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-card p-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{r.author}</span>
                <StarDisplay value={r.rating} size="sm" />
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StarDisplay({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${cls} ${
            n <= Math.round(value) ? "fill-highlight text-highlight" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
