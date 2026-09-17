import Link from "next/link";
import { notFound } from "next/navigation";
import { GIROS } from "@/content/giros";
import { SITIO } from "@/content/sitio";
import { meta, breadcrumb, dataset, faqPage } from "@/lib/seo";
import { zonasMercado, zonaPorSlug, fmt, RADIO_KM, tier1, negociosGiroEnZona } from "@/lib/zonas";
import { Seccion, Eyebrow, H2, Migas, JsonLd, CTAFinal, FAQ } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export const dynamicParams = false;
export function generateStaticParams() { return zonasMercado().map((z) => ({ ciudad: z.slug })); }

const ETIQUETAS: Record<string, string> = {
  abarrotes: "Tiendas de abarrotes y misceláneas", minisuper: "Minisúpers", supermercados: "Supermercados",
  carnicerias: "Carnicerías, pollerías y pescaderías", fruterias: "Fruterías y recauderías", cremerias: "Cremerías",
  dulcerias: "Dulcerías y materias primas para repostería", paleterias: "Paleterías y neverías", otros_alimentos: "Otras tiendas de alimentos",
  depositos_cerveza: "Depósitos de cerveza", bebidas_hielo: "Tiendas de bebidas y hielo", vinos_licores: "Vinaterías",
  restaurantes: "Restaurantes, fondas, taquerías y cafeterías", cafeterias: "Cafeterías, neverías y refresquerías", comedores_ind: "Comedores industriales",
  bares: "Bares y centros nocturnos", hoteles: "Hoteles y moteles", escuelas: "Escuelas", hospitales: "Hospitales", gimnasios: "Gimnasios",
  panaderias: "Panaderías", tortillerias: "Tortillerías", lavanderias: "Lavanderías y tintorerías", farmacias: "Farmacias", papelerias: "Papelerías",
  ferreterias: "Ferreterías y tlapalerías", pisos: "Tiendas de pisos y recubrimientos", pinturas: "Tiendas de pintura", mat_construccion: "Materialeras y mayoristas de construcción",
  constructoras: "Constructoras y contratistas", talleres: "Talleres mecánicos", refaccionarias: "Refaccionarias", llanteras: "Llanteras y vulcanizadoras",
  transportistas: "Transportistas de carga", agencias_autos: "Agencias y lotes de autos", tiendas_limpieza: "Tiendas de artículos de limpieza",
};

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params; const z = zonaPorSlug(ciudad); if (!z) return {};
  return meta({
    title: `Cuántos negocios hay en ${z.nombre}: abarrotes, fondas y más | Mr Ruta`.slice(0, 60),
    description: `${fmt(z.total)} negocios en la zona de reparto de ${z.nombre}: ${fmt(z.categorias.abarrotes)} abarrotes, ${fmt(z.categorias.restaurantes)} fondas y restaurantes, ${fmt(z.categorias.carnicerias)} carnicerías. Registros propios, verificados.`.slice(0, 155),
    path: `/mercado/${z.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params; const z = zonaPorSlug(ciudad);
  if (!z || !zonasMercado().some((m) => m.slug === z.slug)) notFound();
  const path = `/mercado/${z.slug}`;
  const migas = [{ name: "Inicio", path: "/" }, { name: "Mercado por ciudad", path: "/mercado" }, { name: z.nombre, path }];
  const cats = Object.entries(z.categorias).filter(([k]) => ETIQUETAS[k]).sort((a, b) => b[1] - a[1]);
  const girosAqui = GIROS.filter((g) => tier1(g).some((t) => t.slug === z.slug));
  const faq = [
    { p: `¿Cuántas tiendas de abarrotes hay en ${z.nombre}?`, r: `En la zona de reparto de ${z.nombre} (radio de ${RADIO_KM} km) contamos ${fmt(z.categorias.abarrotes)} tiendas de abarrotes y misceláneas, más ${fmt(z.categorias.minisuper)} minisúpers, según nuestros registros actualizados a ${SITIO.fechaRegistros}.` },
    { p: `¿Cuántos restaurantes y fondas hay en ${z.nombre}?`, r: `${fmt(z.categorias.restaurantes)} establecimientos de preparación de alimentos (restaurantes, fondas, taquerías, cafeterías y neverías) en la zona de reparto de ${z.nombre}.` },
    { p: "¿De dónde salen estos números?", r: `De nuestros registros propios de negocios de cada ciudad, con dirección y coordenada, actualizados a ${SITIO.fechaRegistros}. Cada negocio cuenta en una sola zona, la de centro más cercano dentro de ${RADIO_KM} km. Para una bodega concreta lo recalculamos a 10 km de su dirección.` },
    { p: "¿Todos estos negocios están abiertos?", r: "No necesariamente: un negocio cierra cualquier día. Por eso el Radar verifica cada uno contra Google Business antes de mostrarlo, y los que ya cerraron no aparecen." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumb(migas), dataset(z.nombre, path, cats.map(([k]) => ETIQUETAS[k])), faqPage(faq)]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Zona de reparto · radio de {RADIO_KM} km{z.subzonas.length > 1 ? ` · incluye ${z.subzonas.join(" y ")}` : ""}</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Cuántos negocios hay en {z.nombre}</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">En la zona de reparto de {z.nombre} hay <b className="ancla">{fmt(z.total)} negocios</b> con dirección y coordenada en nuestros registros actualizados: {fmt(z.categorias.abarrotes)} tiendas de abarrotes, {fmt(z.categorias.restaurantes)} restaurantes y fondas, {fmt(z.categorias.carnicerias)} carnicerías y {fmt(z.categorias.talleres)} talleres mecánicos, entre otros. Son <b className="ancla">los clientes potenciales de una distribuidora</b> que reparte en esta ciudad.</p>
          <p className="text-[14px] text-gris">{SITIO.fuenteRegistros}. Actualizado {SITIO.fechaRegistros}.</p>
        </div>
      </Seccion>

      <Seccion className="pb-16">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
          <div className="overflow-x-auto card">
            <table className="w-full text-[15px]">
              <thead className="bg-humo text-carbon eyebrow !text-[12px]"><tr><th className="text-left p-4">Tipo de negocio</th><th className="text-right p-4">Cuántos hay</th></tr></thead>
              <tbody>
                {cats.map(([k, n]) => (
                  <tr key={k} className="border-t border-plata-2"><td className="p-3.5 md:p-4">{ETIQUETAS[k]}</td><td className="p-3.5 md:p-4 text-right tabular-nums font-semibold">{fmt(n)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Eyebrow>Giros con ruta en {z.nombre}</Eyebrow>
              <H2 className="!text-[32px] md:!text-[40px]">Reparto por giro en {z.nombre}</H2>
              <ul className="flex flex-col divide-y divide-plata-2 card">
                {girosAqui.map((g) => (
                  <li key={g.slug}><Link href={`/reparto/${g.slug}/${z.slug}`} className="flex justify-between gap-3 p-3.5 hover:bg-humo"><span className="font-semibold text-asfalto">{g.nombre}</span><span className="tabular-nums text-carbon">{fmt(negociosGiroEnZona(g, z))} negocios</span></Link></li>
                ))}
              </ul>
            </div>
            <LeadForm tipo="radar" ciudad={z.slug} titulo={`Contar los de mi bodega en ${z.nombre}`} sub="A 10 km de tu dirección exacta, con mapa." boton="Contar mis negocios" />
          </div>
        </div>
      </Seccion>

      <section className="bg-white border-y border-plata-2"><div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24"><FAQ items={faq} titulo={`Preguntas sobre el mercado de ${z.nombre}`} eyebrow="Datos" /></div></section>
      <div className="pt-16 md:pt-24"><CTAFinal titulo={`Tu demo con pedidos en colonias de ${z.nombre}, en 30 segundos.`} sub="Con tu giro, tus unidades y tus choferes. La liga vive 30 días." ciudad={z.nombre} /></div>
    </>
  );
}
