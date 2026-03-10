// Client-side localStorage store for admin dashboard
import { defaultProducts, defaultCategories, defaultBio, defaultSettings } from "./defaults";
import type { Product, Category, BioSection, SiteSettings } from "./data";

export type { Product, Category, BioSection, SiteSettings };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(`ser_${key}`);
  return raw ? JSON.parse(raw) : fallback;
}

function write<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`ser_${key}`, JSON.stringify(data));
}

export function getProducts(): Product[] { return read("products", defaultProducts); }
export function setProducts(v: Product[]) { write("products", v); }

export function getCategories(): Category[] { return read("categories", defaultCategories); }
export function setCategories(v: Category[]) { write("categories", v); }

export function getBio(): BioSection[] { return read("bio", defaultBio); }
export function setBio(v: BioSection[]) { write("bio", v); }

export function getSettings(): SiteSettings { return read("settings", defaultSettings); }
export function setSettings(v: SiteSettings) { write("settings", v); }
