import { Link, useNavigate } from "@tanstack/react-router";
import {
  MapPin,
  Plus,
  ShoppingBasket,
  MessageCircle,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/cuisine-logo.png";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";

export function SiteNav() {
  const { totalSeats, hydrated } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-primary/10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={logo}
              alt="CuisineEnsemble logo"
              width={44}
              height={44}
              className="w-11 h-11 object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
            />
            <span className="font-display text-3xl uppercase tracking-tight text-foreground">
              Cuisine<span className="text-primary">Ensemble</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              hash="meals"
              className="text-base font-medium text-foreground/80 hover:text-primary transition-colors story-link"
            >
              Repas
            </Link>
            <Link
              to="/create"
              className="text-base font-medium text-foreground/80 hover:text-primary transition-colors story-link"
              activeProps={{ className: "text-primary" }}
            >
              Proposer
            </Link>
            <Link
              to="/chat"
              className="text-base font-medium text-foreground/80 hover:text-primary transition-colors story-link"
              activeProps={{ className: "text-primary" }}
            >
              Chat
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-secondary">
              <MapPin className="w-3.5 h-3.5" /> Lyon
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary transition"
              aria-label="Messages"
            >
              <MessageCircle className="w-4 h-4" />
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary transition hover:scale-105"
              aria-label="Panier"
            >
              <ShoppingBasket className="w-4 h-4" />
              {hydrated && totalSeats > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-medium flex items-center justify-center shadow animate-scale-in">
                  {totalSeats}
                </span>
              )}
            </Link>

            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 hover:border-primary transition"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.name[0]?.toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium pr-1">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-xl p-2 animate-scale-in origin-top-right">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/chat"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted"
                    >
                      <MessageCircle className="w-4 h-4" /> Mes conversations
                    </Link>
                    <Link
                      to="/create"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted"
                    >
                      <Plus className="w-4 h-4" /> Proposer un repas
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                        navigate({ to: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-primary hover:bg-primary/10"
                    >
                      <LogOut className="w-4 h-4" /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition"
              >
                <UserIcon className="w-4 h-4" /> Connexion
              </Link>
            )}

            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/30 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Proposer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground text-background/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="CuisineEnsemble" width={40} height={40} className="w-10 h-10" />
            <span className="font-display text-3xl uppercase text-background">CuisineEnsemble</span>
          </div>
          <p className="text-sm">
            Repas partagés dans votre quartier. Contre l'isolement, pour la découverte.
          </p>
        </div>
        <div>
          <h4 className="font-display uppercase text-xl text-background mb-3">Plateforme</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" hash="meals" className="hover:text-highlight">
                Repas disponibles
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-highlight">
                Proposer un repas
              </Link>
            </li>
            <li>
              <Link to="/chat" className="hover:text-highlight">
                Messagerie
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-highlight">
                Connexion
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display uppercase text-xl text-background mb-3">Impact</h4>
          <ul className="space-y-2 text-sm">
            <li>Réduire l'isolement alimentaire</li>
            <li>Découvrir les cuisines du monde</li>
            <li>Partager équitablement les coûts</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-background/10 text-xs flex flex-col sm:flex-row justify-between gap-2">
        <span>© 2026 CuisineEnsemble</span>
        <span> Pour les voisins qui aiment cuisiner.</span>
      </div>
    </footer>
  );
}
