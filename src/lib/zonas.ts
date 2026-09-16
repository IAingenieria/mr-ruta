import data from "@/content/zonas.json";
import { GIROS, RANKING_KEY, type Giro } from "@/content/giros";

export type Zona = {
  slug: string; nombre: string; cve_ent: string; centro: number[]; total: number;
  categorias: Record<string, number>; giros: Record<string, number>; subzonas: string[];
};

export const ZONAS: Zona[] = data.zonas as Zona[];
export const RANKING: Record<string, string[]> = data.ranking as Record<string, string[]>;
export const RADIO_KM = data.radio_km as number;
export const zonaPorSlug = (slug: string) => ZONAS.find((z) => z.slug === slug);

// Tier 1 por giro = 10 primeras del ranking propio. Son las páginas geo del primer lote.
export const tier1 = (giro: Giro): Zona[] =>
  (RANKING[RANKING_KEY[giro.slug]] || []).slice(0, 10).map((s) => zonaPorSlug(s)!).filter(Boolean);

export const zonasDeGiro = tier1;

// Todas las combinaciones giro × ciudad que se publican (primer lote).
export const combinaciones = () =>
  GIROS.flatMap((g) => tier1(g).map((z) => ({ giro: g.slug, ciudad: z.slug })));

// Zonas que aparecen en al menos un Tier 1 → páginas /mercado/[ciudad]
export const zonasMercado = (): Zona[] => {
  const set = new Set<string>();
  GIROS.forEach((g) => tier1(g).forEach((z) => set.add(z.slug)));
  return ZONAS.filter((z) => set.has(z.slug)).sort((a, b) => b.total - a.total);
};

export const negociosGiroEnZona = (giro: Giro, zona: Zona) => zona.giros[RANKING_KEY[giro.slug]] || 0;

export const fmt = (n: number) => n.toLocaleString("es-MX");
