import { useEffect, useState, useCallback } from "react";

const KEY = "cuisineensemble.cart.v1";
const EVENT = "cuisineensemble:cart";

export type CartItem = { mealId: string; seats: number };

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const handler = () => setItems(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((mealId: string, seats = 1) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.mealId === mealId);
    if (idx >= 0) cur[idx].seats += seats;
    else cur.push({ mealId, seats });
    write(cur);
  }, []);

  const remove = useCallback((mealId: string) => {
    write(read().filter((i) => i.mealId !== mealId));
  }, []);

  const update = useCallback((mealId: string, seats: number) => {
    write(read().map((i) => (i.mealId === mealId ? { ...i, seats: Math.max(1, seats) } : i)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const totalSeats = items.reduce((s, i) => s + i.seats, 0);

  return { items, add, remove, update, clear, totalSeats, hydrated };
}
