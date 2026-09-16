import { notFound } from "next/navigation";
import { GIROS, giroPorSlug } from "@/content/giros";
import { meta } from "@/lib/seo";
import { GiroPage } from "@/components/GiroPage";

export const dynamicParams = false;
export function generateStaticParams() { return GIROS.map((g) => ({ giro: g.slug })); }

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: { params: Promise<{ giro: string }> }) {
  const { giro } = await params; const g = giroPorSlug(giro); if (!g) return {};
  return meta({
    title: `${g.tituloSeo} | Mr Ruta`,
    description: `Ruta ordenada, pedido sugerido y devolución contada para ${g.corto}. Reparto de ${g.producto} con evidencia de entrega. Crea tu demo con tu giro en 30 segundos.`.slice(0, 155),
    path: `/reparto/${g.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ giro: string }> }) {
  const { giro } = await params; const g = giroPorSlug(giro); if (!g) notFound();
  return <GiroPage giro={g} />;
}
