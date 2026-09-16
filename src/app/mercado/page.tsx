import Link from "next/link";
import { meta, breadcrumb } from "@/lib/seo";
import { zonasMercado, fmt, RADIO_KM } from "@/lib/zonas";
import { SITIO } from "@/content/sitio";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal } from "@/components/ui";

export const metadata = meta({
  title: "Cuántos negocios hay en cada ciudad de México | Mr Ruta",
  description: "Abarrotes, fondas, carnicerías, paleterías, talleres y ferreterías contados por zona de reparto en las principales ciudades, con registros propios.",
  path: "/mercado",
});

export default function Mercado() {
  const zonas = zonasMercado();
  const migas = [{ name: "Inicio", path: "/" }, { name: "Mercado por ciudad", path: "/mercado" }];
  return (
    <>
      <JsonLd data={breadcrumb(migas)} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Registros propios, verificados</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Cuántos negocios hay en cada ciudad, por tipo</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Contamos, uno por uno, los <b className="ancla">negocios que compran a una distribuidora</b> en la zona de reparto de cada ciudad (radio de {RADIO_KM} km): abarrotes, fondas, carnicerías, paleterías, talleres, ferreterías y {"30"} tipos más. Son <b className="ancla">nuestros registros actualizados</b>, los mismos que usa el Radar, y cada negocio cuenta en una sola zona.</p>
          <p className="text-[14px] text-gris">{SITIO.fuenteRegistros}. Actualizado {SITIO.fechaRegistros}.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <div className="overflow-x-auto card">
          <table className="w-full text-[15px]">
            <thead className="bg-humo text-carbon eyebrow !text-[12px]">
              <tr><th className="text-left p-4">Zona de reparto</th><th className="text-right p-4">Negocios</th><th className="text-right p-4">Abarrotes</th><th className="text-right p-4">Fondas y restaurantes</th><th className="text-right p-4">Carnicerías</th><th className="text-right p-4">Talleres</th></tr>
            </thead>
            <tbody>
              {zonas.map((z) => (
                <tr key={z.slug} className="border-t border-plata-2">
                  <td className="p-4"><Link href={`/mercado/${z.slug}`} className="font-bold text-asfalto hover:text-naranja-2">{z.nombre}</Link></td>
                  <td className="p-4 text-right tabular-nums">{fmt(z.total)}</td>
                  <td className="p-4 text-right tabular-nums">{fmt(z.categorias.abarrotes)}</td>
                  <td className="p-4 text-right tabular-nums">{fmt(z.categorias.restaurantes)}</td>
                  <td className="p-4 text-right tabular-nums">{fmt(z.categorias.carnicerias)}</td>
                  <td className="p-4 text-right tabular-nums">{fmt(z.categorias.talleres)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
      <CTAFinal titulo="¿Y a 10 km de tu bodega?" sub="Te lo contamos gratis con tu dirección exacta y te mandamos el mapa." />
    </>
  );
}
