import Link from "next/link";
import { GIROS } from "@/content/giros";
import { meta, breadcrumb } from "@/lib/seo";
import { Seccion, Eyebrow, H2, Migas, JsonLd, CTAFinal } from "@/components/ui";

export const metadata = meta({
  title: "Software de reparto por giro: 14 distribuidoras | Mr Ruta",
  description: "Panadería, tortillería, helados, cárnicos, frutas y verduras, lácteos, congelados, abarrotes, botanas, bebidas, gas LP, refacciones y construcción.",
  path: "/reparto",
});

export default function Reparto() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Inicio", path: "/" }, { name: "Giros", path: "/reparto" }])} />
      <Seccion className="pt-6 md:pt-8"><Migas items={[{ name: "Inicio", path: "/" }, { name: "Giros", path: "/reparto" }]} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[860px]">
          <Eyebrow>Un giro, un rutapack</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Software de reparto por giro</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Mr Ruta trae <b className="ancla">14 giros de distribución</b> con sus productos, sus tipos de cliente y sus pasos de entrega ya cargados. Elige el tuyo: cada página explica cómo se ve un día de ruta, qué negocios te compran en tu ciudad y qué preguntan los distribuidores de ese giro antes de la demo.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GIROS.map((g) => (
            <Link key={g.slug} href={`/reparto/${g.slug}`} className="card card-acento p-7 flex flex-col gap-3 hover:border-naranja">
              <span className="display text-[28px] text-asfalto">{g.nombre}</span>
              <span className="text-[15px] leading-relaxed text-carbon">{g.producto.charAt(0).toUpperCase() + g.producto.slice(1)}. {g.dolores[0].titulo}.</span>
              <span className="text-[14px] font-bold text-naranja-2 mt-auto">{g.keyword.charAt(0).toUpperCase() + g.keyword.slice(1)} →</span>
            </Link>
          ))}
        </div>
      </Seccion>
      <CTAFinal titulo="¿Tu giro no está? Crea la demo con «otra distribución»." sub="Cinco preguntas y ves tu operación corriendo. Después ajustamos el catálogo y los pasos a tu producto." />
    </>
  );
}
