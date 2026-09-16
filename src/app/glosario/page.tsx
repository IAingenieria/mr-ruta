import { DEFINICIONES, SITIO } from "@/content/sitio";
import { meta, breadcrumb } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal } from "@/components/ui";

export const metadata = meta({
  title: "Glosario de reparto y venta en ruta: 12 términos | Mr Ruta",
  description: "Venta neta en ruta, pedido sugerido, preventa y autoventa, evidencia de entrega, ruta continua, Radar, devolución, carga del día y liquidación.",
  path: "/glosario",
});

export default function Glosario() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Glosario", path: "/glosario" }];
  const defs = {
    "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Glosario de reparto y venta en ruta",
    hasDefinedTerm: DEFINICIONES.map((d) => ({ "@type": "DefinedTerm", name: d.termino, description: d.def, url: `${SITIO.dominio}/glosario#${d.slug}` })),
  };
  return (
    <>
      <JsonLd data={[breadcrumb(migas), defs]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Vocabulario del oficio</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Glosario de reparto y venta en ruta</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Doce términos que usamos en Mr Ruta y en las distribuidoras con las que trabajamos, definidos en dos o tres frases. Cada definición es <b className="ancla">autocontenida</b>: se puede citar sola.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <dl className="grid gap-5 md:grid-cols-2">
          {DEFINICIONES.map((d) => (
            <div key={d.slug} id={d.slug} className="card p-6 md:p-7 flex flex-col gap-2 scroll-mt-24">
              <dt className="display text-[26px] text-asfalto">{d.termino}</dt>
              <dd className="text-[15px] leading-relaxed text-carbon">{d.def}</dd>
            </div>
          ))}
        </dl>
      </Seccion>
      <CTAFinal titulo="Míralo funcionando con tu giro." sub="Cinco preguntas y tu demo está corriendo en 30 segundos." />
    </>
  );
}
