import Link from "next/link";
import { CASOS, CIFRAS } from "@/content/sitio";
import { GIROS } from "@/content/giros";
import { meta, breadcrumb } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal } from "@/components/ui";

export const metadata = meta({
  title: "Mediciones en campo del software de reparto Mr Ruta",
  description: "Lo medido en demostrativos con datos reales de distribuidoras: kilómetros ahorrados al ordenar la ruta, negocios cerrados detectados y mercado contado.",
  path: "/casos",
});

export default function Casos() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Mediciones", path: "/casos" }];
  return (
    <>
      <JsonLd data={breadcrumb(migas)} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Cifras con fuente</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Mediciones en campo</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Estas son <b className="ancla">mediciones hechas en demostrativos</b> preparados para distribuidoras reales con los datos de su ciudad y, cuando los compartieron, con sus paradas reales. No son promesas: son <b className="ancla">números que se pueden repetir</b> en tu demo con tu giro.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {CASOS.map((c) => {
            const g = GIROS.find((x) => x.slug === c.giro);
            return (
              <article key={c.titulo} className="card card-acento p-7 flex flex-col gap-4">
                <span className="eyebrow text-carbon">{g?.nombre}</span>
                <h2 className="display text-[28px] text-asfalto">{c.titulo}</h2>
                <span className="display text-[40px] text-naranja-2">{c.resultado}</span>
                <p className="text-[15px] leading-relaxed text-carbon">{c.texto}</p>
                {g && <Link href={`/reparto/${g.slug}`} className="text-[14px] font-bold text-naranja-2 mt-auto">Ver reparto para {g.corto} →</Link>}
              </article>
            );
          })}
        </div>
        <div className="mt-10 card p-7 flex flex-col gap-2 max-w-[900px]">
          <span className="eyebrow text-carbon">Cómo se midió</span>
          <p className="text-[15px] leading-relaxed text-carbon">Kilómetros: misma lista de {CIFRAS.kmOrdenada.paradas} paradas reales, ruta como la hacía el vendedor contra ruta ordenada por Mr Ruta, distancia calculada sobre calles ({CIFRAS.kmOrdenada.cuando}). Negocios cerrados: muestra de {CIFRAS.verificadosMuestra} puntos de nuestros registros verificados uno por uno contra Google Business; {CIFRAS.cerradosPct} % con cierre confirmado. Mercado: conteo de negocios con dirección y coordenada en nuestros registros dentro del radio indicado.</p>
        </div>
      </Seccion>
      <CTAFinal titulo="Repite la medición con tu ruta." sub="Crea tu demo, pega tus paradas y compara tu orden contra el de Mr Ruta, en kilómetros." />
    </>
  );
}
