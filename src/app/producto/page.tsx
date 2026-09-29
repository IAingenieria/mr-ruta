import Link from "next/link";
import { PRODUCTOS } from "@/components/ProductoPage";
import { meta, breadcrumb } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal, Foto } from "@/components/ui";

export const metadata = meta({
  title: "Radar, app del vendedor y despacho | Mr Ruta",
  description: "Tres apps en un sistema: Radar para encontrar clientes nuevos, app del vendedor con pedido sugerido y devolución, y despacho con ruta y evidencia.",
  path: "/producto",
});

export default function Producto() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Producto", path: "/producto" }];
  return (
    <>
      <JsonLd data={breadcrumb(migas)} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Un solo sistema, tres apps</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Encontrar, vender, entregar</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Mr Ruta es una <b className="ancla">plataforma de reparto y venta en ruta</b> con tres apps que comparten la misma base: el <b className="ancla">Radar</b> encuentra los negocios que faltan, la <b className="ancla">app del vendedor</b> levanta el pedido en la tienda y el <b className="ancla">despacho</b> arma la ruta y entrega con evidencia. Cada empresa tiene su propia instancia.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {PRODUCTOS.map((p, i) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} className="card p-7 flex flex-col gap-4 hover:border-naranja">
              <div className="flex items-center gap-3"><span className="display text-[44px] text-naranja leading-none">0{i + 1}</span><span className="display text-[28px] text-asfalto">{p.nombre}</span></div>
              <p className="text-[15px] leading-relaxed text-carbon">{p.descripcion}</p>
              <div className="flex justify-center mt-auto"><Foto f={p.img} w={360} className="aspect-[4/5] object-cover" /></div>
            </Link>
          ))}
        </div>
      </Seccion>
      <CTAFinal titulo="Las tres apps, con tu giro y tu ciudad." sub="Escríbenos y te preparamos la demostración con tus productos y tus unidades." />
    </>
  );
}
