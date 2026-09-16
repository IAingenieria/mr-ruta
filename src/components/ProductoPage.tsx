import Link from "next/link";
import Image from "next/image";
import { demoLink, FAQ_GENERAL } from "@/content/sitio";
import { meta, breadcrumb, faqPage } from "@/lib/seo";
import { Seccion, Eyebrow, H2, Migas, JsonLd, CTAFinal, FAQ, Flecha, Telefono, Check, AnswerFirst } from "@/components/ui";

export type Producto = {
  slug: string; nombre: string; titulo: string; descripcion: string; answer: string;
  bloques: { h: string; p: string }[]; incluye: string[]; img: string; faq: { p: string; r: string }[];
};

export const PRODUCTOS: Producto[] = [
  {
    slug: "radar", nombre: "Radar", titulo: "Radar de clientes nuevos para distribuidoras",
    descripcion: "Diez negocios abiertos por día, cerca de tu ruta y que no son clientes, tomados de nuestros registros actualizados y verificados uno por uno. Los cerrados nunca se muestran.",
    answer: "El <b>Radar de clientes nuevos</b> de Mr Ruta sirve cada día una lista corta de negocios de tu giro que están cerca de la ruta y todavía no te compran. Salen de <b>nuestros registros actualizados de la ciudad</b> y cada uno se verifica contra Google Business antes de mostrarse: <b>los cerrados nunca aparecen</b>.",
    bloques: [
      { h: "¿Por qué se verifica cada negocio?", p: "Porque un listado lo tiene cualquiera y un negocio cierra cualquier día. En una muestra de 250 puntos, 14.4 % ya habían cerrado. Un vendedor mandado a puertas cerradas deja de creer en la herramienta la primera semana." },
      { h: "Dos grados de certeza que no se mezclan", p: "Si el nombre coincide, la reseña y la calificación son de ese negocio. Si solo coincide el domicilio, se muestra «hoy en ese domicilio: otro nombre» sin calificación. Nunca se le atribuye a un negocio la reputación del vecino." },
      { h: "Del Radar a la ruta en un toque", p: "El vendedor aprueba el negocio y aparece en su recorrido del día, ya ordenado con las demás paradas. Lo que descarta no vuelve a salir." },
      { h: "Cuánto mercado te falta", p: "Con la dirección de tu bodega contamos los negocios de tu giro a 10 km y te mandamos el número con el mapa. Es el punto de partida para saber cuántas paradas más caben en las rutas que ya tienes." },
    ],
    incluye: ["Diez negocios por día (ajustable)", "Verificación contra Google Business antes de mostrar", "Aprobar o descartar cada negocio en un toque", "Ficha con dirección, distancia a la parada más cercana y teléfono cuando existe", "Conteo del mercado alrededor de tu bodega", "Registros actualizados por ciudad"],
    img: "/img/app-ruta.jpg",
    faq: [
      { p: "¿Cuántos negocios muestra el Radar por día?", r: "Diez por día por defecto, ajustable. Es una lista corta a propósito: se visitan en la misma ruta, sin desviarse, y al día siguiente hay otros diez." },
      { p: "¿De dónde salen los negocios?", r: "De nuestros registros actualizados de cada ciudad, con dirección y coordenada, verificados uno por uno contra Google Business antes de mostrarse." },
      { p: "¿Qué pasa si un negocio ya es mi cliente?", r: "El vendedor lo descarta y no vuelve a aparecer. Al arrancar tu instancia cargamos tu cartera para que el Radar solo muestre los que no están en ella." },
    ],
  },
  {
    slug: "vendedor", nombre: "App del vendedor", titulo: "App del vendedor de ruta: pedido sugerido y devolución",
    descripcion: "Carga del día, pedido sugerido por cliente, devolución y cobro en una pantalla. Alta de clientes en campo con foto de fachada. Funciona sin señal.",
    answer: "La <b>app del vendedor de ruta</b> de Mr Ruta pone en el celular la carga del día, el <b>pedido sugerido por cliente</b>, la devolución y el cobro en una sola pantalla. La venta neta es lo que se despachó menos lo que regresó, y <b>funciona sin señal</b>: se sincroniza sola al recuperarla.",
    bloques: [
      { h: "El sugerido nunca inventa demanda", p: "Lo que dejaste la visita pasada menos lo que regresó. Sin historial sugiere cero. El vendedor lo ajusta en pantalla con cantidades tecleables, no con listas infinitas." },
      { h: "La devolución en la misma pantalla", p: "En productos frescos el rival es el reloj. Lo que regresa se teclea junto al pedido y descuenta la venta neta al momento; la merma sale en pesos por cliente." },
      { h: "Alta de clientes en campo", p: "Nombre, tipo de negocio, foto de la fachada tomada con la cámara y ubicación. Sin foto no hay registro. El cliente nuevo entra a la ruta ese mismo día." },
      { h: "Ruta ordenada a Google Maps", p: "Un toque ordena las paradas y abre la ruta continua en Google Maps, de la bodega a la bodega. En una ruta real de 15 paradas: 13 km en vez de 21.7." },
    ],
    incluye: ["Inicio con nombre, unidad y siguiente cliente", "Carga del día por producto y presentación", "Pedido sugerido, catálogo con fotos, devolución y cobro", "Alta de cliente con foto de fachada y GPS", "Ruta ordenada con liga continua a Google Maps", "Corte del día: despachado, devuelto, cobrado", "Modo sin señal con sincronización automática"],
    img: "/img/app-devolucion.jpg",
    faq: [
      { p: "¿Se instala desde una tienda de aplicaciones?", r: "No. Corre en el navegador del celular (Android o iPhone) y se abre desde una liga o un código QR. No hay que instalar ni actualizar nada." },
      { p: "¿Qué pasa si se va la señal a media ruta?", r: "Nada visible para el vendedor: el pedido, la devolución y la evidencia se guardan en el teléfono y se sincronizan solos al recuperar señal." },
      { p: "¿Cómo se teclean las cantidades?", r: "En un campo numérico que se selecciona al tocar. Están pensadas para manos ocupadas: tres toques por parada." },
    ],
  },
  {
    slug: "despacho", nombre: "Despacho y evidencia", titulo: "Despacho de reparto con evidencia de entrega",
    descripcion: "Los pedidos entran de Excel, Odoo o Microsip, se revisan las direcciones dudosas, se asignan por unidad y se ordena la ruta. Cada entrega deja foto, GPS, hora y firma.",
    answer: "El <b>despacho de reparto</b> de Mr Ruta recibe los pedidos de tu sistema, revisa las direcciones dudosas antes de salir, los asigna por unidad y <b>ordena la ruta de cada chofer</b>. Cada entrega queda con <b>evidencia: foto con cámara real, ubicación, hora y firma</b>; sin foto no se puede cerrar.",
    bloques: [
      { h: "Los pedidos entran de donde ya están", p: "Excel, Odoo o Microsip. Mr Ruta lee remisiones y pedidos, los normaliza y los pone en la bandeja del despacho. Tu facturación no cambia de lugar." },
      { h: "Bandeja de direcciones dudosas", p: "Antes de salir, el sistema marca las direcciones que no ubica bien para corregirlas a mano. La coordenada real de cada entrega se aprende y la siguiente vez ya no hace falta." },
      { h: "Evidencia que no se discute", p: "Foto tomada con la cámara en el momento (no de la galería), ubicación, hora y firma del cliente en pantalla. Rechazos con motivo y foto. Sin evidencia la entrega no cierra." },
      { h: "Tablero del día y análisis del mes", p: "Despacho ve qué unidad va en qué parada y qué falta. Dirección ve venta neta, merma en pesos y comparativo de rutas por mes." },
    ],
    incluye: ["Lectura de pedidos desde Excel, Odoo o Microsip", "Bandeja de direcciones a revisar", "Asignación de pedidos por unidad", "Ruta ordenada por unidad", "Evidencia de entrega: foto, GPS, hora, firma", "Rechazos y devoluciones con motivo", "Tablero del día y análisis del mes"],
    img: "/img/app-corte.jpg",
    faq: [
      { p: "¿Qué formatos de pedido lee?", r: "Excel con tus columnas, Odoo y Microsip. Para otros sistemas se arma un conector en el arranque." },
      { p: "¿Se puede corregir una dirección antes de salir?", r: "Sí. La bandeja muestra las direcciones dudosas y el despacho las corrige en el mapa; la corrección se guarda para las siguientes entregas." },
      { p: "¿Qué evidencia queda de cada entrega?", r: "Foto tomada con la cámara en el momento, ubicación, hora y firma del cliente. Los rechazos llevan motivo y foto." },
    ],
  },
];

export const productoPorSlug = (s: string) => PRODUCTOS.find((p) => p.slug === s);

export function ProductoPage({ p }: { p: Producto }) {
  const path = `/producto/${p.slug}`;
  const migas = [{ name: "Inicio", path: "/" }, { name: "Producto", path: "/producto" }, { name: p.nombre, path }];
  const faq = [...p.faq, FAQ_GENERAL[2], FAQ_GENERAL[11]];
  return (
    <>
      <JsonLd data={[breadcrumb(migas), faqPage(faq)]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="flex flex-col gap-6">
            <Eyebrow>{p.nombre}</Eyebrow>
            <h1 className="display text-[44px] md:text-[72px] text-asfalto">{p.titulo}</h1>
            <AnswerFirst html={p.answer} className="max-w-[620px]" />
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={demoLink()} className="btn btn-naranja !min-h-[58px] md:!px-8 text-[17px]">Verlo en mi demo <Flecha /></a>
              <Link href="/producto" className="btn btn-linea !min-h-[58px]">Las tres apps</Link>
            </div>
          </div>
          <div className="flex justify-center"><Telefono src={p.img} alt={`${p.nombre} de Mr Ruta en el celular`} w={280} prioridad /></div>
        </div>
      </Seccion>
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24 grid gap-10 md:grid-cols-2">
          {p.bloques.map((b, i) => (
            <div key={b.h} className="flex flex-col gap-3">
              <span className={`stripe ${["bg-naranja", "bg-naranja-2", "bg-carbon", "bg-plata"][i]}`} aria-hidden="true" />
              <h2 className="display text-[28px] md:text-[32px] text-asfalto">{b.h}</h2>
              <p className="text-[16px] leading-relaxed text-carbon">{b.p}</p>
            </div>
          ))}
        </div>
      </section>
      <Seccion className="py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-4">
            <Eyebrow>Qué incluye</Eyebrow>
            <H2>Lo que trae {p.nombre.toLowerCase()}</H2>
            <ul className="flex flex-col gap-3 text-[16px] text-carbon">{p.incluye.map((t) => <li key={t} className="flex gap-3"><Check /><span>{t}</span></li>)}</ul>
          </div>
          <Image src="/img/foto-patio.jpg" alt="Patio de carga de una distribuidora" width={960} height={536} className="w-full h-auto rounded-xl" sizes="(min-width: 768px) 50vw, 90vw" />
        </div>
      </Seccion>
      <section className="bg-white border-y border-plata-2"><div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24"><FAQ items={faq} titulo={`Preguntas sobre ${p.nombre.toLowerCase()}`} /></div></section>
      <div className="pt-16 md:pt-24"><CTAFinal titulo="Míralo con tu giro y tu ciudad, en 30 segundos." sub="Cinco preguntas. La liga y el QR te llegan al momento y viven 30 días." /></div>
    </>
  );
}

export const productoMeta = (p: Producto) => meta({ title: `${p.titulo} | Mr Ruta`.slice(0, 60), description: p.descripcion.slice(0, 155), path: `/producto/${p.slug}` });
