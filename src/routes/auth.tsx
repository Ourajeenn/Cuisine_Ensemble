import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, ChefHat, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { SiteNav } from "@/components/site-nav";
import logo from "@/assets/cuisine-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — CuisineEnsemble" },
      { name: "description", content: "Rejoignez la communauté CuisineEnsemble." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(60, "60 caractères max"),
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "6 caractères minimum").max(72, "72 caractères max"),
});
const loginSchema = signupSchema.pick({ email: true, password: true });

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed =
      mode === "signup"
        ? signupSchema.safeParse({ name, email, password })
        : loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate({ to: "/" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de finaliser la connexion pour le moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left visual */}
        <aside className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.5_0.18_25)] p-12 text-primary-foreground">
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-highlight/30 blur-3xl animate-float" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary/30 blur-3xl animate-float delay-300" />
          <div className="relative flex flex-col justify-between w-full">
            <div className="flex items-center gap-3 animate-fade-in">
              <img src={logo} alt="" className="w-12 h-12" />
              <span className="font-display text-3xl uppercase">CuisineEnsemble</span>
            </div>
            <div className="animate-fade-in-up">
              <h1 className="font-display text-6xl uppercase leading-[0.95] mb-4">
                À table
                <br />
                avec le quartier.
              </h1>
              <p className="text-lg opacity-90 max-w-md">
                Rejoignez 320+ voisins qui partagent chaque semaine un repas fait maison.
              </p>
            </div>
            <ul className="space-y-3 text-sm animate-fade-in delay-200">
              <li className="flex items-center gap-3">
                <ChefHat className="w-5 h-5" /> Repas près de chez vous
              </li>
              <li className="flex items-center gap-3">
                <UserIcon className="w-5 h-5" /> Notez et notez-vous entre voisins
              </li>
            </ul>
          </div>
        </aside>

        {/* Right form */}
        <section className="flex items-center justify-center p-6 sm:p-12 animate-fade-in-up">
          <div className="w-full max-w-md">
            <div className="flex mb-8 p-1 rounded-2xl bg-muted">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-card text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Connexion" : "Inscription"}
                </button>
              ))}
            </div>

            <h2 className="font-display text-4xl uppercase text-primary mb-2">
              {mode === "login" ? "Bon retour !" : "Bienvenue"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {mode === "login"
                ? "Retrouvez vos repas et conversations."
                : "Créez votre profil en quelques secondes."}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <Field icon={UserIcon} label="Prénom">
                  <input
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Camille"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
              )}
              <Field icon={Mail} label="Email">
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voisin@quartier.fr"
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <Field icon={Lock} label="Mot de passe">
                <input
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none"
                />
              </Field>

              {error && (
                <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 disabled:opacity-50 hover:scale-[1.02] transition-transform"
              >
                {loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Si Supabase n’est pas configuré, la session reste locale dans votre navigateur.
              </p>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 focus-within:border-primary transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        {children}
      </div>
    </label>
  );
}
