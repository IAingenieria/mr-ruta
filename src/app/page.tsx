import Image from "next/image";
import Link from "next/link";
import { GIROS } from "@/content/giros";
import { CIFRAS, FAQ_GENERAL, demoLink } from "@/content/sitio";
import { meta, software, faqPage } from "@/lib/seo";
import { fmt } from "@/lib/zonas";
import { Seccion, Eyebrow, H2, FAQ, CTAFinal, JsonLd, Flecha, Telefono } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export const metadata = meta({
  title: "Software de reparto y venta en ruta | Mr Ruta",
  description: "Ruta ordenada, pedido sugerido por cliente, evidencia de entrega con foto y firma, y un Radar que encuentra los negocios que faltan. Demo en 30 segundos.",
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
            <h1 className="display text-[50px] md:text-[88px] text-white">Tus camionetas ya pasan frente a los clientes <span className="text-naranja">que no tienes.</span></h1>
            <p className="text-[18px] md:text-[21px] leading-relaxed text-plata max-w-[560px]">Mr Ruta le dice a tu distribuidora <strong className="text-white">dónde están los negocios que faltan</strong>, ordena la ruta del día y deja al vendedor con el pedido sugerido en la mano. Sin cambiar de camioneta ni de sistema de facturación.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={demoLink()} className="btn btn-naranja !min-h-[58px] md:!px-8 text-[17px]">Crea tu demo en {CIFRAS.demoSegundos} segundos <Flecha /></a>
              <Link href="/producto" className="btn btn-linea-clara !min-h-[58px]">Ver un día de ruta</Link>
            </div>
            <p className="text-[14px] text-gris">Con pedidos de tu giro, en tu ciudad, con tus choferes. Sin tarjeta, sin llamada.</p>
          </div>
          <div className="relative flex justify-center items-center min-h-[520px] md:min-h-[640px]">
            <div className="absolute top-2 right-0 md:top-6 md:right-10 bg-white rounded-lg px-4 py-3 shadow-2xl flex flex-col">
              <span className="eyebrow !text-[11px] text-carbon">Ruta ordenada</span>
              <span className="display text-[34px] md:text-[40px] text-asfalto">{CIFRAS.kmOrdenada.despues} km <span className="text-gris text-[20px] normal-case tracking-normal">en vez de {CIFRAS.kmOrdenada.antes}</span></span>
              <span className="text-[13px] text-carbon">Mismas {CIFRAS.kmOrdenada.paradas} paradas · medido en campo, {CIFRAS.kmOrdenada.cuando}</span>
            </div>
            <Telefono src="/img/app-sugerido.jpg" alt="App del vendedor de Mr Ruta: pedido sugerido por cliente" w={280} prioridad />
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
            [`${CIFRAS.cerradosPct} %`, "de los negocios registrados ya cerraron. Verificamos cada uno antes de mandarte.", "border-naranja"],
            [fmt(CIFRAS.tienditas5km), "tienditas encontradas a 5 km de la planta de una panificadora del Estado de México.", "border-naranja-2"],
            ["-40 %", `de kilómetros en la misma ruta al ordenarla (${CIFRAS.kmOrdenada.despues} km contra ${CIFRAS.kmOrdenada.antes}).`, "border-carbon"],
            [`${CIFRAS.demoSegundos} s`, "para tener tu propia demo corriendo, con tu giro, tu ciudad y tus unidades.", "border-plata"],
          ].map(([n, t, b]) => (
            <div key={n} className={`flex flex-col gap-1.5 border-l-4 ${b} pl-4 md:pl-5`}>
              <span className="display text-[36px] md:text-[48px] text-asfalto">{n}</span>
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
            <a href={demoLink()} className="btn btn-naranja self-start !min-h-[46px]">Crear demo con mi giro</a>
          </div>
        </div>
      </Seccion>

      {/* PRODUCTO */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24 flex flex-col gap-12">
          <div className="flex flex-col gap-3 max-w-[820px]">
            <Eyebrow>El producto, en pantalla</Eyebrow>
            <H2>Encontrar, vender, entregar. Un solo sistema, tres apps.</H2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { n: "01", t: "Radar", href: "/producto/radar", d: "Cruza nuestros registros actualizados de tu giro con Google Business y te sirve 10 negocios abiertos por día, a la mano del vendedor. Los cerrados nunca se muestran.", img: null },
              { n: "02", t: "Vendedor", href: "/producto/vendedor", d: "Carga del día, pedido sugerido, devolución y cobro en la misma pantalla. La venta neta es lo que se despachó menos lo que regresó.", img: "/img/app-devolucion.jpg" },
              { n: "03", t: "Despacho y ruta", href: "/producto/despacho", d: "La ruta se ordena sola y se abre en Google Maps con regreso a la bodega. Cada entrega deja foto con cámara real, GPS, hora y firma.", img: "/img/app-ruta.jpg" },
            ].map((p) => (
              <div key={p.n} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="display text-[44px] md:text-[52px] text-naranja leading-none">{p.n}</span>
                  <Link href={p.href} className="display text-[28px] md:text-[30px] text-asfalto hover:text-naranja-2">{p.t}</Link>
                </div>
                <p className="text-[16px] leading-relaxed text-carbon">{p.d}</p>
                {p.img ? (
                  <div className="flex justify-center"><Telefono src={p.img} alt={`Pantalla de ${p.t} en Mr Ruta`} w={220} /></div>
                ) : (
                  <div className="bg-humo rounded-xl p-6 flex flex-col gap-3 min-h-[420px]">
                    <div className="flex justify-between items-center"><span className="eyebrow text-carbon">Radar del día</span><span className="text-[12px] font-bold text-asfalto bg-naranja rounded px-2 py-0.5">10 de 106</span></div>
                    {[["Abarrotes La Espiga", "Abierto · confirmado por nombre · 4.3 ★ (27)", "A 640 m de la parada 6", false], ["Miscelánea Doña Chuy", "Abierto · en ese domicilio hoy: otro nombre", "A 210 m de la parada 9", false], ["Tienda El Paso", "Cerrado permanentemente · no se sirve", "", true]].map(([a, b, c, x]) => (
                      <div key={String(a)} className={`card p-3.5 flex flex-col gap-1 ${x ? "opacity-55" : ""}`}>
                        <span className={`text-[15px] font-bold text-asfalto ${x ? "line-through" : ""}`}>{a}</span>
                        <span className={`text-[13px] ${x ? "text-naranja-2 font-semibold" : "text-carbon"}`}>{b}</span>
                        {c && <span className="text-[13px] text-carbon">{c}</span>}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-auto"><span className="flex-1 text-center text-[14px] font-bold text-white bg-carbon rounded-md py-2.5">Ya es cliente</span><span className="flex-1 text-center text-[14px] font-bold text-asfalto bg-naranja rounded-md py-2.5">A la ruta</span></div>
                  </div>
                )}
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
            {[["bg-naranja", "La ruta la arma una persona de memoria.", "Si se enferma o se va, se va con ella."], ["bg-naranja-2", "Reportar volumen bruto premia cargar de más.", "Nadie mide lo que regresa por parada."], ["bg-plata", "Los clientes nuevos llegan por casualidad.", "Las camionetas pasan frente a ellos todos los días."]].map(([c, a, b]) => (
              <div key={a} className="flex gap-4 items-start"><span className={`stripe !w-2.5 !h-[26px] ${c} shrink-0 mt-0.5`} aria-hidden="true" /><span className="text-[17px] leading-relaxed text-plata"><strong className="text-white">{a}</strong> {b}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* RADAR GRATIS */}
      <Seccion className="py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col gap-4">
            <Eyebrow>Gratis, en un minuto</Eyebrow>
            <H2>¿Cuántos negocios de tu giro hay a 10 km de tu bodega?</H2>
            <p className="text-[17px] md:text-[18px] leading-relaxed text-carbon">Los contamos con nuestros registros actualizados de la ciudad, uno por uno, y te mandamos el número con el mapa. Es el mismo Radar que después usa tu vendedor.</p>
            <Link href="/mercado" className="font-bold text-naranja-2 hover:text-naranja">Ver el mercado por ciudad →</Link>
          </div>
          <LeadForm tipo="radar" titulo="Contar mis negocios" boton="Contar mis negocios" />
        </div>
      </Seccion>

      {/* FAQ */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24"><FAQ items={faq} titulo="Lo que preguntan antes de la demo" /></div>
      </section>

      <div className="pt-16 md:pt-24">
        <CTAFinal titulo={<>Tu demo, con tu giro y tu ciudad, en {CIFRAS.demoSegundos} segundos.</>} sub="Cinco preguntas. La liga y el QR te llegan al momento y viven 30 días." />
      </div>
    </>
  );
}
