import type { MetadataRoute } from "next";
import { SITIO } from "@/content/sitio";
import { GIROS } from "@/content/giros";
import { combinaciones, zonasMercado } from "@/lib/zonas";

// Un sitemap por sección (índice automático de Next): así se ve en GSC qué lote no indexa.
export async function generateSitemaps() {
  return [{ id: "nucleo" }, { id: "giros" }, { id: "geo" }, { id: "mercado" }];
}

const lastModified = new Date("2026-09-16");
const u = (p: string) => `${SITIO.dominio}${p}`;

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  if (id === "nucleo") {
    return ["/", "/demo", "/reparto", "/producto", "/producto/radar", "/producto/vendedor", "/producto/despacho", "/mercado", "/planes", "/comparativas", "/casos", "/glosario", "/contacto"]
      .map((p) => ({ url: u(p), lastModified, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 }));
  }
  if (id === "giros") return GIROS.map((g) => ({ url: u(`/reparto/${g.slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.9 }));
  if (id === "geo") return combinaciones().map((c) => ({ url: u(`/reparto/${c.giro}/${c.ciudad}`), lastModified, changeFrequency: "monthly" as const, priority: 0.7 }));
  if (id === "mercado") return zonasMercado().map((z) => ({ url: u(`/mercado/${z.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [];
}
