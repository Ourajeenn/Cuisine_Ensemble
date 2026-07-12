import { useCallback, useEffect, useState } from "react";

import { hasSupabaseConfig, supabase } from "@/lib/supabase";

const KEY = "cuisineensemble.user.v1";
const EVENT = "cuisineensemble:user";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

function read(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function write(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(KEY, JSON.stringify(user));
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

function buildDisplayName(name?: string, email?: string) {
  if (name?.trim()) return name.trim();

  const fallback = email?.split("@")[0] ?? "User";
  return fallback.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildAvatarColor(seed: string) {
  const colors = ["#ce3f23", "#1c7755", "#ffc446", "#8b5cf6", "#f97316", "#0ea5e9"];
  let index = 0;
  for (let i = 0; i < seed.length; i += 1) index += seed.charCodeAt(i);
  return colors[index % colors.length];
}

function buildLocalUser(email: string, name?: string): User {
  return {
    id: crypto.randomUUID(),
    name: buildDisplayName(name, email),
    email,
    avatarColor: buildAvatarColor(email),
  };
}

function hydrateFromSupabaseUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string | null };
}) {
  return {
    id: user.id,
    name: buildDisplayName(user.user_metadata?.full_name ?? undefined, user.email ?? undefined),
    email: user.email ?? "",
    avatarColor: buildAvatarColor(user.email ?? user.id),
  } satisfies User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | undefined;

    const sync = async () => {
      if (hasSupabaseConfig && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const sessionUser = session?.user ? hydrateFromSupabaseUser(session.user) : read();
        if (active) {
          setUser(sessionUser);
          if (sessionUser) write(sessionUser);
        }

        authSubscription = supabase.auth.onAuthStateChange((_event, nextSession) => {
          const nextUser = nextSession?.user ? hydrateFromSupabaseUser(nextSession.user) : null;
          if (active) {
            setUser(nextUser);
            write(nextUser);
          }
        });
      } else {
        if (active) {
          setUser(read());
        }
      }

      if (active) setHydrated(true);
    };

    sync();

    const h = () => setUser(read());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);

    return () => {
      active = false;
      authSubscription?.data.subscription.unsubscribe();
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, name?: string) => {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const nextUser = data.user ? hydrateFromSupabaseUser(data.user) : buildLocalUser(email, name);
      write(nextUser);
      setUser(nextUser);
      return nextUser;
    }

    const nextUser = buildLocalUser(email, name);
    write(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name?.trim() ?? buildDisplayName(undefined, email),
          },
        },
      });
      if (error) throw error;
      const nextUser = data.user ? hydrateFromSupabaseUser(data.user) : buildLocalUser(email, name);
      write(nextUser);
      setUser(nextUser);
      return nextUser;
    }

    const nextUser = buildLocalUser(email, name);
    write(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(async () => {
    if (hasSupabaseConfig && supabase) {
      await supabase.auth.signOut();
    }
    write(null);
    setUser(null);
  }, []);

  return { user, hydrated, signIn, signUp, signOut };
}
