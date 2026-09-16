import Link from "next/link";
import { SITIO, demoLink, waLink, FAQ_GENERAL } from "@/content/sitio";
import { meta, breadcrumb, faqPage } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal, Check, FAQ, Flecha } from "@/components/ui";

export const metadata = meta({
  title: "Planes y precios del software de reparto Mr Ruta",
  description: "Tres planes según el tamaño de tu operación: arranque sin instalación, plan con Radar de clientes nuevos y plan a la medida. Instancia propia por empresa.",
  path: "/planes",
});

// Los importes solo se muestran si NEXT_PUBLIC_MOSTRAR_PRECIOS=1 (decisión de Luis).
const PLANES = [
  { n: "Arranque", precio: "$1,990", unidad: "por sucursal al mes", para: "Distribuidoras que quieren ordenar la ruta y registrar la venta hoy, sin proyecto de implementación.", inc: ["App del vendedor y del chofer", "Despacho con ruta ordenada", "Evidencia de entrega", "Pedidos desde Excel", "Soporte por WhatsApp y guías en video", "Sin costo de instalación"] },
  { n: "Radar", precio: "$5,990", unidad: "por sucursal al mes", para: "Distribuidoras que además quieren crecer la cartera con las mismas camionetas.", inc: ["Todo lo del plan Arranque", "Radar de clientes nuevos, verificados", "Conteo del mercado alrededor de cada bodega", "Pedidos desde Odoo o Microsip", "Tablero de dirección", "Acompañamiento en el arranque"], destacado: true },
  { n: "A la medida", precio: "Cotización", unidad: "según alcance", para: "Operaciones con varias sucursales, integraciones propias o procesos que no caben en un rutapack.", inc: ["Todo lo del plan Radar", "Integraciones a tu ERP y facturación", "Rutapack propio de tu giro", "Cerebro de rutas con historial", "Horas de consultoría por fases", "Acuerdo de servicio"] },
];

export default function Planes() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Planes", path: "/planes" }];
  const faq = [FAQ_GENERAL[10], FAQ_GENERAL[2], FAQ_GENERAL[11], FAQ_GENERAL[8], { p: "¿Puedo empezar con una sucursal y crecer?", r: "Sí. Cada sucursal es una instancia; se agregan conforme las necesitas y cada una tiene su propio tablero." }];
  return (
    <>
      <JsonLd data={[breadcrumb(migas), faqPage(faq)]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[860px]">
          <Eyebrow>Planes</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Planes y precios de Mr Ruta</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Tres planes según el tamaño de la operación y el acompañamiento que necesitas. En todos, <b className="ancla">cada empresa tiene su propia instancia</b>: tus datos no se comparten con nadie. Empiezas por la demo; <b className="ancla">no hay costo de instalación</b> en el plan de arranque.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANES.map((p) => (
            <div key={p.n} className={`card p-7 md:p-8 flex flex-col gap-5 ${p.destacado ? "border-naranja border-2" : ""}`}>
              <div className="flex flex-col gap-1">
                <span className="display text-[34px] text-asfalto">{p.n}</span>
                {SITIO.mostrarPrecios || p.precio === "Cotización" ? (
                  <><span className="display text-[40px] text-naranja-2">{p.precio}</span><span className="text-[13px] text-gris">{p.unidad}{p.precio !== "Cotización" ? " · MXN + IVA" : ""}</span></>
                ) : (
                  <span className="text-[15px] text-carbon">Precio por sucursal al mes. Te lo decimos en la primera llamada.</span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-carbon">{p.para}</p>
              <ul className="flex flex-col gap-2.5 text-[15px] text-carbon">{p.inc.map((t) => <li key={t} className="flex gap-2.5"><Check /><span>{t}</span></li>)}</ul>
              {p.precio === "Cotización"
                ? <a href={waLink("Hola, quiero una cotización a la medida de Mr Ruta.")} className="btn btn-linea mt-auto">Pedir cotización</a>
                : <a href={demoLink()} className={`btn mt-auto ${p.destacado ? "btn-naranja" : "btn-oscuro"}`}>Empezar con la demo <Flecha color={p.destacado ? "#1F2224" : "#fff"} /></a>}
            </div>
          ))}
        </div>
        <p className="text-[14px] text-gris mt-6">Los planes se cobran por sucursal. <Link href="/contacto" className="text-naranja-2 font-semibold">Escríbenos</Link> si tienes más de tres.</p>
      </Seccion>
      <section className="bg-white border-y border-plata-2"><div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24"><FAQ items={faq} titulo="Preguntas sobre planes" eyebrow="Antes de decidir" /></div></section>
      <div className="pt-16 md:pt-24"><CTAFinal titulo="Primero la demo. Después hablamos de planes." sub="Con tu giro, tu ciudad y tus unidades, en 30 segundos." /></div>
    </>
  );
}
