import Link from "next/link";
import Image from "next/image";
import type { Giro } from "@/content/giros";
import { FAQ_GENERAL, demoLink, waLink, SITIO } from "@/content/sitio";
import { fmt, tier1, negociosGiroEnZona, RADIO_KM, type Zona } from "@/lib/zonas";
import { Seccion, Eyebrow, H2, FAQ, CTAFinal, JsonLd, Flecha, Telefono, Migas, AnswerFirst, Check } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { breadcrumb, faqPage, service } from "@/lib/seo";

const IMG = ["/img/app-inicio.jpg", "/img/app-ruta.jpg", "/img/app-devolucion.jpg", "/img/app-corte.jpg"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Plantilla compartida: silo (/reparto/[giro]) y geo (/reparto/[giro]/[ciudad]).
export function GiroPage({ giro, zona }: { giro: Giro; zona?: Zona }) {
  const path = zona ? `/reparto/${giro.slug}/${zona.slug}` : `/reparto/${giro.slug}`;
  const h1 = zona ? `${cap(giro.keyword)} en ${zona.nombre}` : cap(giro.keyword);
  const migas = [{ name: "Inicio", path: "/" }, { name: "Giros", path: "/reparto" }, { name: giro.nombre, path: `/reparto/${giro.slug}` }, ...(zona ? [{ name: zona.nombre, path }] : [])];
  const faq = [...giro.faq, ...FAQ_GENERAL.slice(1, 4)];
  const ciudades = tier1(giro);
  const answer = zona
    ? giro.answerFirst.replace(/^Mr Ruta es (el|la) (sistema de |)<b>([^<]+)<\/b>/, (_m, art, pre, kw) => `Mr Ruta es ${art} ${pre}<b>${kw} en ${zona.nombre}</b>`)
    : giro.answerFirst;

  return (
    <>
      <JsonLd data={[breadcrumb(migas), faqPage(faq), service(h1, answer.replace(/<[^>]+>/g, ""), path, zona?.nombre)]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>

      {/* HERO */}
      <Seccion className="py-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2 eyebrow text-carbon">
              <span className="card px-2.5 py-1.5">{giro.nombre}</span>
              {zona && <span className="card px-2.5 py-1.5">{zona.nombre}{zona.subzonas.length > 1 ? " y zona metropolitana" : " y área metropolitana"}</span>}
              {!zona && <span className="card px-2.5 py-1.5">México</span>}
            </div>
            <h1 className="display text-[44px] md:text-[76px] text-asfalto">{h1}</h1>
            <AnswerFirst html={answer} className="max-w-[620px] text-tinta" />
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={demoLink(giro.slug, zona?.nombre)} className="btn btn-naranja !min-h-[58px] md:!px-8 text-[17px]">Crear demo de {giro.corto.split(" ")[0] === "distribuidoras" ? giro.nombre.toLowerCase() : giro.corto}{zona ? ` en ${zona.nombre}` : ""} <Flecha /></a>
              <a href={waLink(`Hola, tengo una distribuidora de ${giro.producto}${zona ? ` en ${zona.nombre}` : ""} y quiero ver Mr Ruta.`)} className="btn btn-linea !min-h-[58px]">Hablar por WhatsApp</a>
            </div>
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[14px] font-semibold text-carbon">
              {giro.dia.slice(0, 3).map((d) => <li key={d.titulo}>{d.titulo}: {d.texto.split(".")[0].split(",")[0]}</li>)}
            </ul>
          </div>
          <div className="relative flex justify-center">
            <Telefono src="/img/app-sugerido.jpg" alt={`Pedido sugerido en la app del vendedor para ${giro.corto}`} w={280} prioridad />
            <div className="absolute bottom-6 left-0 bg-asfalto text-white rounded-lg px-4 py-3 shadow-2xl flex flex-col">
              <span className="eyebrow !text-[11px] text-naranja">Sugerido por cliente</span>
              <span className="text-[15px] font-semibold">Dejaste 18, regresaron 2 → sugiere 16</span>
            </div>
          </div>
        </div>
      </Seccion>

      {/* MERCADO */}
      <section className="bg-asfalto">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-14 md:py-[72px] grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-4">
            <Eyebrow oscuro>El mercado, contado uno por uno</Eyebrow>
            <H2 claro>{zona ? `Negocios que compran ${giro.producto.split(",")[0].split(" y ")[0]} en ${zona.nombre}` : `Quién te compra ${giro.producto.split(",")[0].split(" y ")[0]} en cada ciudad`}</H2>
            <p className="text-[17px] leading-relaxed text-plata">
              {zona
                ? <>Negocios con dirección y coordenada en nuestros registros actualizados de la zona de reparto de {zona.nombre} (radio de {RADIO_KM} km{zona.subzonas.length > 1 ? `, incluye ${zona.subzonas.filter((s) => s !== zona.nombre.split("–")[0]).join(", ")}` : ""}). Un negocio cierra cualquier día: el Radar los cruza contra Google Business antes de mandarte y <strong className="text-white">los cerrados nunca se muestran</strong>.</>
                : <>Estas son las zonas de México con más negocios que compran {giro.producto.split(",")[0]}, según nuestros registros actualizados. Cada ciudad tiene su propia página con el conteo por tipo de negocio y su demo.</>}
            </p>
            <Link href={zona ? `/mercado/${zona.slug}` : "/mercado"} className="btn btn-naranja self-start">{zona ? `Ver todo el mercado de ${zona.nombre}` : "Ver el mercado por ciudad"}</Link>
          </div>
          {zona ? (
            <div className="grid grid-cols-2 gap-4">
              {giro.mercado.slice(0, 4).map((m, i) => (
                <div key={m.cat} className={`bg-asfalto-2 rounded-[10px] p-5 md:p-6 flex flex-col gap-1.5 border-t-4 ${["border-naranja", "border-naranja-2", "border-plata", "border-gris"][i]}`}>
                  <span className="display text-[38px] md:text-[46px] text-white">{fmt(zona.categorias[m.cat] || 0)}</span>
                  <span className="text-[14px] text-plata leading-snug">{m.etiqueta}</span>
                </div>
              ))}
            </div>
          ) : (
            <ol className="grid grid-cols-2 gap-x-6 gap-y-2">
              {ciudades.map((z, i) => (
                <li key={z.slug} className="flex justify-between gap-3 border-b border-asfalto-2 py-2.5">
                  <Link href={`/reparto/${giro.slug}/${z.slug}`} className="text-[15px] font-semibold text-white hover:text-naranja">{i + 1}. {z.nombre}</Link>
                  <span className="text-[14px] text-plata tabular-nums">{fmt(negociosGiroEnZona(giro, z))}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {zona && <p className="mx-auto max-w-[1440px] px-5 md:px-[72px] pb-8 text-[13px] text-gris">{SITIO.fuenteRegistros}. Actualizado {SITIO.fechaRegistros}.</p>}
      </section>

      {/* UN DÍA DE RUTA */}
      <Seccion className="py-16 md:py-24">
        <div className="flex flex-col gap-3 max-w-[820px] mb-10">
          <Eyebrow>Cómo se ve un día de ruta</Eyebrow>
          <H2>De la carga de madrugada al corte de la tarde.</H2>
        </div>
        <div className="grid gap-7 md:grid-cols-4">
          {giro.dia.map((d, i) => (
            <div key={d.hora} className="flex flex-col gap-4">
              <Image src={IMG[i]} alt={`${d.titulo} en la app de Mr Ruta`} width={360} height={800} className="w-full h-auto rounded-[18px] border-[5px] border-[#0E0F10]" sizes="(min-width: 768px) 25vw, 90vw" />
              <h3 className="display text-[26px] text-asfalto">{d.hora} · {d.titulo}</h3>
              <p className="text-[15px] leading-relaxed text-carbon">{d.texto}</p>
            </div>
          ))}
        </div>
      </Seccion>

      {/* DOLORES */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-14 md:py-20 grid gap-8 md:grid-cols-3">
          {giro.dolores.map((d, i) => (
            <div key={d.titulo} className="flex flex-col gap-3">
              <span className={`stripe ${["bg-naranja", "bg-naranja-2", "bg-carbon"][i]}`} aria-hidden="true" />
              <h3 className="display text-[26px] md:text-[28px] text-asfalto">{d.titulo}</h3>
              <p className="text-[16px] leading-relaxed text-carbon">{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPOS DE NEGOCIO + QUÉ INCLUYE */}
      <Seccion className="py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Eyebrow>Ya viene cargado</Eyebrow>
            <H2>Qué trae el rutapack de {giro.nombre.toLowerCase()}</H2>
            <ul className="flex flex-col gap-3 text-[16px] text-carbon">
              {["Catálogo con tus productos, presentaciones y fotos", "Tipos de negocio del giro para dar de alta clientes en campo", "Pasos de entrega y evidencia (foto con cámara, ubicación, hora, firma)", "Pedido sugerido, devolución y cobro en una pantalla", "Ruta ordenada con liga continua a Google Maps", "Tablero del día para el despacho y análisis del mes para dirección", "Radar con los negocios de tu giro que no son clientes"].map((t) => (
                <li key={t} className="flex gap-3"><Check /><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <Eyebrow>Tipos de cliente que reconoce</Eyebrow>
            <H2>A quién le entregas</H2>
            <div className="flex flex-wrap gap-2">
              {giro.tiposNegocio.map((t) => <span key={t} className="card px-3.5 py-2 text-[15px] font-semibold text-carbon">{t}</span>)}
            </div>
            {!giro.rutapack && <p className="text-[14px] text-gris">El rutapack de este giro se arma con tu catálogo en el arranque; la demo usa el flujo genérico de distribución.</p>}
          </div>
        </div>
      </Seccion>

      {/* RADAR FORM */}
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col gap-4">
            <Eyebrow>Gratis, en un minuto</Eyebrow>
            <H2>¿Cuántos {giro.mercado[0].etiqueta.toLowerCase()} hay a 10 km de tu bodega{zona ? ` en ${zona.nombre}` : ""}?</H2>
            <p className="text-[17px] leading-relaxed text-carbon">Los contamos con nuestros registros actualizados, uno por uno, y te mandamos el número con el mapa. Es el mismo Radar que después usa tu vendedor.</p>
          </div>
          <LeadForm tipo="radar" giro={giro.slug} ciudad={zona?.slug} titulo="Contar mis negocios" boton="Contar mis negocios" />
        </div>
      </section>

      {/* FAQ */}
      <Seccion className="py-16 md:py-24"><FAQ items={faq} titulo={`Lo que preguntan los distribuidores de ${giro.producto.split(",")[0]}`} eyebrow={`Preguntas de ${giro.corto}`} /></Seccion>

      {/* CIUDADES HERMANAS */}
      <Seccion className="pb-12">
        <div className="flex flex-col gap-3">
          <Eyebrow>{zona ? "Otras ciudades" : "Ciudades"}</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {ciudades.filter((z) => z.slug !== zona?.slug).map((z) => (
              <Link key={z.slug} href={`/reparto/${giro.slug}/${z.slug}`} className="card px-3.5 py-2 text-[15px] font-semibold text-carbon hover:border-naranja hover:text-naranja-2">{giro.nombre} en {z.nombre}</Link>
            ))}
          </div>
        </div>
      </Seccion>

      <CTAFinal titulo={zona ? `Mira una distribuidora de ${giro.producto.split(",")[0]} de ${zona.nombre} repartiendo con Mr Ruta.` : `Mira una distribuidora de ${giro.producto.split(",")[0]} repartiendo con Mr Ruta.`} sub={`Pedidos de ${giro.producto.split(",")[0]}, ${zona ? `colonias de ${zona.nombre}` : "tu ciudad"}, tus unidades y tus vendedores. En 30 segundos.`} giro={giro.slug} ciudad={zona?.nombre} />
    </>
  );
}
