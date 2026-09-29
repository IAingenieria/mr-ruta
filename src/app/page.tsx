import Image from "next/image";
import Link from "next/link";
import { GIROS } from "@/content/giros";
import { FAQ_GENERAL, demoLink } from "@/content/sitio";
import { meta, software, faqPage } from "@/lib/seo";
import { Seccion, Eyebrow, H2, FAQ, CTAFinal, JsonLd, Flecha, Foto } from "@/components/ui";

export const metadata = meta({
  title: "Software de reparto y venta en ruta | Mr Ruta",
  description: "Ruta ordenada, pedido sugerido por cliente y evidencia de entrega con foto y firma para distribuidoras con flota propia. Pide tu demostración.",
  path: "/",
});

const giroDestacado = GIROS.slice(0, 5);

export default function Home() {
  const faq = FAQ_GENERAL.slice(0, 8);
  return (
    <>
      <JsonLd data={[software(), faqPage(faq)]} />

      {/* HERO */}
      <section className="bg-asfalto relative overflow-hidden">
        <div className="absolute -right-[120px] -top-10 hidden md:flex gap-[22px] opacity-[0.12]" aria-hidden="true">
          <div className="w-[90px] h-[560px] bg-naranja skew-x-[-24deg]" /><div className="w-[90px] h-[560px] bg-naranja-2 skew-x-[-24deg]" /><div className="w-[90px] h-[560px] bg-plata skew-x-[-24deg]" />
        </div>
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-12 md:py-24 grid gap-10 md:grid-cols-2 md:items-center relative">
          <div className="flex flex-col gap-6 md:gap-7">
            <div className="flex items-center gap-3 eyebrow text-naranja">
              <span className="flex gap-1.5" aria-hidden="true"><span className="stripe !w-2 !h-[18px] bg-naranja" /><span className="stripe !w-2 !h-[18px] bg-naranja-2" /></span>
              Reparto y venta en ruta · Distribuidoras de México
            </div>
            <h1 className="display text-[50px] md:text-[88px] text-white">Cada ruta ordenada, cada entrega <span className="text-naranja">con prueba.</span></h1>
            <p className="text-[18px] md:text-[21px] leading-relaxed text-plata max-w-[560px]">Mr Ruta <strong className="text-white">ordena la ruta del día</strong>, deja al vendedor con el pedido sugerido en la mano y guarda la prueba de cada entrega. Sin cambiar de camioneta ni de sistema de facturación.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={demoLink()} className="btn btn-naranja !min-h-[58px] md:!px-8 text-[17px]">Agenda tu demostración <Flecha /></a>
              <Link href="/producto" className="btn btn-linea-clara !min-h-[58px]">Ver un día de ruta</Link>
            </div>
            <p className="text-[14px] text-gris">Con pedidos de tu giro, en tu ciudad, con tus choferes. Te la muestra una persona.</p>
          </div>
          <div className="relative flex justify-center items-center min-h-[520px] md:min-h-[640px]">
            <div className="absolute top-2 right-0 md:top-6 md:right-10 bg-white rounded-lg px-4 py-3 shadow-2xl flex flex-col">
              <span className="eyebrow !text-[11px] text-carbon">Ruta ordenada</span>
              <span className="display text-[26px] md:text-[30px] leading-none text-asfalto">Las mismas paradas,<br />menos kilómetros</span>
              <span className="text-[13px] text-carbon">Ordenada en un clic, con regreso a la bodega</span>
            </div>
            <Foto f="hero" w={440} prioridad />
            <div className="absolute bottom-2 left-0 md:bottom-8 md:left-5 bg-naranja rounded-lg px-4 py-3 shadow-2xl flex flex-col max-w-[260px]">
              <span className="eyebrow !text-[11px] text-asfalto">Sugerido</span>
              <span className="text-[15px] font-semibold text-asfalto">Lo que dejaste menos lo que regresó. Sin historial no inventa demanda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRUEBA */}
      <section className="bg-white border-b border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            // Los cuatro dolores del dueño de una distribuidora, en cualquier ciudad del país.
            // Sin cifras: una medición de una planta no es la realidad de todas (Luis, 16-sep).
            ["El cobro del día", "Lo cobrado y lo pendiente de cada cliente, cuadrado al cerrar la ruta. Sin reconstruirlo de memoria en la tarde.", "border-naranja"],
            ["Lo que se regresa", "Lo que regresa a la bodega ya lo pagaste. El pedido sugerido deja en cada tienda lo que se vende, no lo que sobra.", "border-naranja-2"],
            ["La ruta de cada día", "Ordenada en un clic, con menos kilómetros y sin depender de la memoria de un chofer que un día se va.", "border-carbon"],
            ["Lo que pasa en la calle", "Cada entrega con foto, hora, ubicación y firma. Si te dicen que no llegó, tú tienes la prueba.", "border-plata"],
          ].map(([n, t, b]) => (
            <div key={n} className={`flex flex-col gap-1.5 border-l-4 ${b} pl-4 md:pl-5`}>
              <span className="display text-[24px] md:text-[30px] leading-none text-asfalto">{n}</span>
              <span className="text-[13px] md:text-[15px] text-carbon leading-snug">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GIROS */}
      <Seccion className="py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div className="flex flex-col gap-3 max-w-[760px]">
            <Eyebrow>Hecho por giro, no genérico</Eyebrow>
            <H2>Cada giro reparte distinto. La app también.</H2>
            <p className="text-[17px] md:text-[18px] leading-relaxed text-carbon">El pan del día anterior no se cuenta igual que una caja de hielo ni que una refacción urgente. Cada giro trae sus productos, sus pasos de entrega y su vocabulario ya cargados.</p>
          </div>
          <Link href="/reparto" className="font-bold text-naranja-2 hover:text-naranja text-[16px] shrink-0">Ver los 14 giros →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {giroDestacado.map((g) => (
            <Link key={g.slug} href={`/reparto/${g.slug}`} className="card card-acento p-7 flex flex-col gap-3 hover:border-naranja">
              <span className="display text-[28px] md:text-[30px] text-asfalto">{g.nombre}</span>
              <span className="text-[15px] leading-relaxed text-carbon">{g.dolores[0].titulo}.</span>
              <span className="text-[14px] font-bold text-naranja-2 mt-auto">{g.keyword.charAt(0).toUpperCase() + g.keyword.slice(1)} →</span>
            </Link>
          ))}
          <div className="bg-asfalto rounded-[10px] p-7 flex flex-col gap-3 justify-between">
            <span className="display text-[28px] md:text-[30px] text-white">¿Otro giro?</span>
            <span className="text-[15px] leading-relaxed text-plata">Lácteos, congelados, abarrotes, botanas, bebidas, gas LP, refacciones, limpieza, materiales. Si tu producto sale en camioneta, hay ruta.</span>
            <a href={demoLink()} className="btn btn-naranja self-start !min-h-[46px]">Agenda tu demostración</a>
          </div>
        </div>
      </Seccion>

      {/* PRODUCTO */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24 flex flex-col gap-12">
          <div className="flex flex-col gap-3 max-w-[820px]">
            <Eyebrow>El producto</Eyebrow>
            <H2>Vender y entregar. Un solo sistema, dos apps.</H2>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {[
              { n: "01", t: "Vendedor", href: "/producto/vendedor", d: "Carga del día, pedido sugerido, devolución y cobro en la misma pantalla. La venta neta es lo que se despachó menos lo que regresó.", img: "entrega" as const },
              { n: "02", t: "Despacho y ruta", href: "/producto/despacho", d: "La ruta se ordena sola y se abre en Google Maps con regreso a la bodega. Cada entrega deja foto con cámara real, GPS, hora y firma.", img: "flota" as const },
            ].map((p) => (
              <div key={p.n} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="display text-[44px] md:text-[52px] text-naranja leading-none">{p.n}</span>
                  <Link href={p.href} className="display text-[28px] md:text-[30px] text-asfalto hover:text-naranja-2">{p.t}</Link>
                </div>
                <p className="text-[16px] leading-relaxed text-carbon">{p.d}</p>
                <div className="flex justify-center"><Foto f={p.img} w={360} className="aspect-[4/5] object-cover" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOLOR */}
      <section className="bg-asfalto grid md:grid-cols-2">
        <Image src="/img/foto-patio.jpg" alt="Patio de carga de una distribuidora con dos camionetas" width={960} height={536} className="w-full h-[320px] md:h-[560px] object-cover" />
        <div className="px-5 md:px-[72px] py-12 md:py-[72px] flex flex-col gap-7 justify-center">
          <Eyebrow oscuro>Lo que cuesta rutear a mano</Eyebrow>
          <H2 claro>Lo que regresa a la bodega ya se pagó en materia prima y en horas de camioneta.</H2>
          <div className="flex flex-col gap-4">
            {[["bg-naranja", "La ruta la arma una persona de memoria.", "Si se enferma o se va, se va con ella."], ["bg-naranja-2", "Reportar volumen bruto premia cargar de más.", "Nadie mide lo que regresa por parada."], ["bg-plata", "El corte se cuadra en papel.", "Lo cobrado y lo devuelto se reconstruye de memoria al final del día."]].map(([c, a, b]) => (
              <div key={a} className="flex gap-4 items-start"><span className={`stripe !w-2.5 !h-[26px] ${c} shrink-0 mt-0.5`} aria-hidden="true" /><span className="text-[17px] leading-relaxed text-plata"><strong className="text-white">{a}</strong> {b}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24"><FAQ items={faq} titulo="Lo que preguntan antes de la demo" /></div>
      </section>

      <div className="pt-16 md:pt-24">
        <CTAFinal titulo="Tu demostración, con tu giro y tu ciudad." sub="Escríbenos y te la preparamos con tus productos, tus unidades y tus choferes." />
      </div>
    </>
  );
}
