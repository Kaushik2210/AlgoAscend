"use client";

import { useSyncExternalStore } from "react";
import type { Experience, Goal, Language } from "./curriculum";

export type Guest = {
  language: Language;
  goal: Goal;
  experience: Experience;
  minutes: number;
  completed: string[];
  solved: string[];
};

const key = "algoascend-guest-v1";
const defaults: Guest = { language: "python", goal: "fundamentals", experience: "new", minutes: 15, completed: [], solved: [] };
let memory: string | null = null;

function read(): string | null {
  try { return localStorage.getItem(key) ?? memory; } catch { return memory; }
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(key, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(key, listener);
  };
}

function decode(snapshot: string | null): Guest {
  try { return snapshot ? { ...defaults, ...JSON.parse(snapshot) } : defaults; } catch { return defaults; }
}

export function useGuest() {
  return decode(useSyncExternalStore(subscribe, read, () => null));
}

export function updateGuest(update: (profile: Guest) => Guest) {
  memory = JSON.stringify(update(decode(read())));
  try { localStorage.setItem(key, memory); } catch { /* The session can continue in memory. */ }
  window.dispatchEvent(new Event(key));
}
