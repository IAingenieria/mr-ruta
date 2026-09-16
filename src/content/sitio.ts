// Datos fijos del sitio. Lo que está en corchetes lo define Luis antes de publicar.
export const SITIO = {
  nombre: "Mr Ruta",
  dominio: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mr-ruta.com",
  empresa: "Goodman Tech",
  ciudad: "México",                       // [Ciudad] — pendiente de Luis
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "528126350902",   // Luis, 16-sep-2026
  demoUrl: "https://demo.mr-ruta.com",
  leadsEndpoint: process.env.NEXT_PUBLIC_LEADS_ENDPOINT || "https://demo.mr-ruta.com/api/sitio/lead",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",         // pendiente de Luis
  mostrarPrecios: process.env.NEXT_PUBLIC_MOSTRAR_PRECIOS !== "0",   // Luis, 16-sep-2026: se publican; "0" los oculta
  fuenteRegistros: "Registros propios de Mr Ruta, verificados antes de mostrarse",
  fechaRegistros: "septiembre 2026",
};

export const waLink = (texto: string) =>
  SITIO.whatsapp ? `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(texto)}` : "/contacto";

// La demo guiada vive en el sitio (/demo) y al final crea la demo real en el worker.
export const demoLink = (giro?: string, ciudad?: string) => {
  const p = new URLSearchParams();
  if (giro) p.set("giro", giro);
  if (ciudad) p.set("ciudad", ciudad);
  const q = p.toString();
  return `/demo${q ? "?" + q : ""}`;
};

// Cifras verificadas en campo (no cambiar sin fuente): ver docs internos de la plataforma.
export const CIFRAS = {
  kmOrdenada: { antes: 21.7, despues: 13, paradas: 15, cuando: "agosto 2026" },
  cerradosPct: 14.4,          // de 250 puntos verificados uno por uno contra Google Business
  tienditas5km: 3109,         // a 5 km de la planta de una panificadora del Estado de México
  demoSegundos: 30,
  verificadosMuestra: 250,
};

export const FAQ_GENERAL: { p: string; r: string }[] = [
  { p: "¿Qué es Mr Ruta?", r: "Una plataforma de reparto y venta en ruta para distribuidoras con flota propia. Tiene tres apps: Radar (encontrar clientes nuevos), Vendedor (levantar el pedido en la tienda) y Despacho (armar la ruta y entregar con evidencia). Cada empresa tiene su propia instancia; nada se comparte entre clientes." },
  { p: "¿Funciona sin señal en la ruta?", r: "Sí. El pedido, la devolución y la evidencia se guardan en el teléfono y se sincronizan solos al recuperar señal. La carga de la mañana se hace con WiFi en la bodega." },
  { p: "¿Tengo que cambiar mi sistema de facturación?", r: "No. Mr Ruta lee tus pedidos y remisiones desde Excel, Odoo o Microsip y te regresa lo vendido, lo devuelto y lo entregado por cliente. Tu facturación sigue donde está." },
  { p: "¿Qué necesita el vendedor para usarlo?", r: "Un celular Android o iPhone con cámara. La app corre en el navegador, sin instalar nada de una tienda de aplicaciones, y se abre desde una liga o un código QR." },
  { p: "¿Cómo se comprueba una entrega?", r: "Con foto tomada con la cámara en el momento (no de la galería), ubicación, hora y firma del cliente en pantalla. Sin foto no se puede cerrar la entrega." },
  { p: "¿Cómo se ordena la ruta?", r: "El sistema calcula el orden de las paradas y la abre en Google Maps como una ruta continua, de la bodega a la bodega. En una ruta real de 15 paradas bajó de 21.7 a 13 kilómetros." },
  { p: "¿Qué es el pedido sugerido?", r: "Lo que dejaste en la visita anterior menos lo que regresó. Si no hay historial sugiere cero: el sistema nunca inventa demanda." },
  { p: "¿De dónde salen los negocios del Radar?", r: "De nuestros registros actualizados de cada ciudad, verificados uno por uno contra Google Business antes de mostrarse. En una muestra de 250 puntos, 14.4 % ya habían cerrado: esos nunca se sirven." },
  { p: "¿Cuánto tarda la demo?", r: "Treinta segundos. Contestas cinco preguntas (empresa, giro, ciudad, unidades y choferes) y recibes tu propia demo con pedidos de tu giro en tu ciudad. La liga vive 30 días." },
  { p: "¿Cuánto tarda en estar corriendo mi instancia?", r: "Una semana a partir de que nos mandas tu lista de productos y tus unidades. La demo sale el mismo día." },
  { p: "¿Cuánto cuesta?", r: "Hay tres planes según el tamaño de la operación y el nivel de acompañamiento. Los detalles están en la página de planes." },
  { p: "¿Quién ve mis datos?", r: "Solo tu empresa. Cada cliente tiene su propia instancia con su base de datos; no hay una base compartida entre distribuidoras." },
];

export const DEFINICIONES: { termino: string; slug: string; def: string }[] = [
  { termino: "Venta neta en ruta", slug: "venta-neta-en-ruta", def: "Lo que el vendedor despachó en una parada menos lo que el cliente regresó. Es el indicador de cabecera en productos frescos: reportar volumen bruto premia cargar de más, y lo que regresa ya se pagó en materia prima y en horas de camioneta." },
  { termino: "Pedido sugerido", slug: "pedido-sugerido", def: "La cantidad que el sistema propone para cada producto en cada cliente: lo que se dejó en la visita anterior menos lo que regresó. Sin historial sugiere cero. El vendedor lo ajusta en pantalla; nunca se impone." },
  { termino: "Preventa y autoventa", slug: "preventa-y-autoventa", def: "En preventa el vendedor visita hoy, levanta el pedido y el chofer entrega mañana. En autoventa la misma unidad vende y entrega en la parada. Mr Ruta atiende las dos: la app del vendedor y la del chofer pueden usarse por separado o en la misma visita." },
  { termino: "Evidencia de entrega", slug: "evidencia-de-entrega", def: "El registro que prueba que un pedido se entregó: foto tomada con la cámara en el momento, ubicación GPS, hora y firma del cliente en pantalla. Sin evidencia la entrega no se puede cerrar." },
  { termino: "Ruta continua", slug: "ruta-continua", def: "Una sola liga de Google Maps con todas las paradas en orden, de la bodega a la bodega, en lugar de una liga por tramo. Se usa porque las ligas por tramos se cortan en el teléfono y limitan el número de escalas." },
  { termino: "Radar", slug: "radar", def: "El módulo de Mr Ruta que sirve cada día una lista corta de negocios cercanos a la ruta que no son clientes, tomados de nuestros registros actualizados de la ciudad y verificados uno por uno antes de mostrarse. Los cerrados nunca aparecen." },
  { termino: "Devolución", slug: "devolucion", def: "El producto que el cliente regresa en la visita. Se registra por producto en la misma pantalla del pedido; descuenta la venta neta y ajusta el sugerido de la siguiente visita." },
  { termino: "Carga del día", slug: "carga-del-dia", def: "Lo que sube a la unidad antes de salir, por producto y presentación. Es el techo de lo que la ruta puede vender ese día y el punto de partida para calcular la venta neta al corte." },
  { termino: "Liquidación o corte", slug: "liquidacion", def: "El cierre del día de una ruta: lo despachado, lo vendido, lo devuelto y lo cobrado, con la diferencia por vendedor. Mr Ruta lo cuadra al momento; en papel toma horas." },
  { termino: "Envase retornable", slug: "envase-retornable", def: "Charolas, garrafones, cajas o cilindros que se entregan con el producto y deben regresar. Mr Ruta registra los entregados y recogidos por cliente en cada visita." },
  { termino: "Cadena de frío en reparto", slug: "cadena-de-frio", def: "Mantener el producto a la temperatura correcta desde la bodega hasta la entrega. En reparto se protege con la ruta ordenada (menos tiempo en la unidad) y con la evidencia de entrega con hora." },
  { termino: "Cobertura de ruta", slug: "cobertura-de-ruta", def: "Qué proporción de los negocios de tu giro en tu zona ya son clientes. Se calcula cruzando tu cartera contra nuestros registros de la ciudad; la diferencia es el territorio que la camioneta ya recorre sin vender." },
];

// Mediciones reales hechas en demostrativos para prospectos (no son clientes en operación): se dice así en el sitio.
export const CASOS = [
  { titulo: "Panificadora, Estado de México", giro: "panaderia", resultado: "13 km en vez de 21.7", texto: "Demostrativo con las paradas reales de una ruta de 15 tiendas: al ordenarla, la camioneta recorre 8.7 kilómetros menos. A 5 km de su planta hay 3,109 tienditas; de una muestra de 250, 14.4 % ya habían cerrado y el Radar las descartó." },
  { titulo: "Distribuidora de hielo y base para helado, Chihuahua", giro: "helados-y-hielo", resultado: "Su demo, en 30 segundos", texto: "Demostrativo con paleterías y neverías de su ciudad como cartera potencial, sus unidades y sus choferes, y el flujo completo de entrega con evidencia, en una liga que vive 30 días." },
  { titulo: "Tortillería, área metropolitana de Monterrey", giro: "tortilleria", resultado: "7,072 abarrotes a 10 km", texto: "Demostrativo con una cartera simulada de 15 rutas y 30 tiendas por unidad: a 10 km de la planta hay 7,072 abarrotes y 8,460 fondas y taquerías, y el cálculo de capacidad mostró espacio para 171 paradas más al día sin comprar una unidad." },
];

export const NAV = [
  { href: "/reparto", label: "Giros" },
  { href: "/producto", label: "Producto" },
  { href: "/producto/radar", label: "Radar" },
  { href: "/casos", label: "Casos" },
  { href: "/planes", label: "Planes" },
];
