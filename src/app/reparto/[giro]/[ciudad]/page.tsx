import { notFound } from "next/navigation";
import { giroPorSlug } from "@/content/giros";
import { combinaciones, zonaPorSlug, tier1, negociosGiroEnZona, fmt } from "@/lib/zonas";
import { meta } from "@/lib/seo";
import { GiroPage } from "@/components/GiroPage";

export const dynamicParams = false;
export function generateStaticParams() { return combinaciones(); }

export async function generateMetadata({ params }: { params: Promise<{ giro: string; ciudad: string }> }) {
  const { giro, ciudad } = await params; const g = giroPorSlug(giro); const z = zonaPorSlug(ciudad); if (!g || !z) return {};
  const n = fmt(negociosGiroEnZona(g, z));
  return meta({
    title: (() => { const t = `${g.tituloSeo} en ${z.nombre}`; return t.length + 10 <= 60 ? `${t} | Mr Ruta` : t; })(),
    description: `${n} negocios que compran ${g.producto.split(",")[0]} en la zona de ${z.nombre}, según nuestros registros actualizados. Ruta ordenada y pedido sugerido en el celular del vendedor. Crea tu demo en 30 s.`.slice(0, 155),
    path: `/reparto/${g.slug}/${z.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ giro: string; ciudad: string }> }) {
  const { giro, ciudad } = await params; const g = giroPorSlug(giro); const z = zonaPorSlug(ciudad);
  if (!g || !z || !tier1(g).some((t) => t.slug === z.slug)) notFound();
  return <GiroPage giro={g} zona={z} />;
}
