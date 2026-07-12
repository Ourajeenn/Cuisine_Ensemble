import { useCallback, useEffect, useState } from "react";

const KEY = "cuisineensemble.ratings.v1";
const EVENT = "cuisineensemble:ratings";

export type Rating = {
  mealId: string;
  rating: number; // 1-5
  comment?: string;
  author: string;
  date: string;
};

function read(): Rating[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Rating[]) : [];
  } catch {
    return [];
  }
}

function write(items: Rating[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function useRatings(mealId?: string) {
  const [all, setAll] = useState<Rating[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAll(read());
    setHydrated(true);
    const h = () => setAll(read());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const list = mealId ? all.filter((r) => r.mealId === mealId) : all;
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : null;

  const add = useCallback((rating: Omit<Rating, "date">) => {
    const cur = read();
    cur.unshift({ ...rating, date: new Date().toISOString() });
    write(cur);
  }, []);

  return { list, avg, add, hydrated };
}
