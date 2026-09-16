// Catálogo de giros (silos SEO). Un giro = un rutapack de la plataforma.
// Las claves de `mercado` apuntan a categorías de src/content/zonas.json.
export type Giro = {
  slug: string;
  nombre: string;          // "Panadería y pastelería"
  corto: string;           // "panaderías" — para frases: "software de reparto para panaderías"
  producto: string;        // qué reparten
  keyword: string;         // keyword exacta del silo
  tituloSeo: string;       // versión corta para <title> (≤ 40)
  answerFirst: string;     // 40–60 palabras; <b> marca las anclas
  dolores: { titulo: string; texto: string }[];
  dia: { hora: string; titulo: string; texto: string }[];
  mercado: { cat: string; etiqueta: string }[];   // qué negocios le compran (para /reparto/[giro]/[ciudad])
  tiposNegocio: string[];
  faq: { p: string; r: string }[];
  rutapack: boolean;       // true si ya existe en la plataforma
};

const DIA_BASE = (carga: string, parada: string, corte: string) => [
  { hora: "05:30", titulo: "Carga", texto: carga },
  { hora: "06:10", titulo: "Ruta", texto: "La ruta del día se ordena en un toque y se abre en Google Maps como ruta continua, de la bodega a la bodega. Mismas paradas, menos kilómetros." },
  { hora: "08:40", titulo: "Parada", texto: parada },
  { hora: "15:00", titulo: "Corte", texto: corte },
];

export const GIROS: Giro[] = [
  {
    slug: "panaderia", nombre: "Panadería y pastelería", corto: "panaderías", producto: "pan, repostería y pasteles",
    keyword: "software de reparto para panaderías",
    tituloSeo: "Software de reparto para panaderías",
    answerFirst: "Mr Ruta es el <b>software de reparto para panaderías</b> que ordena la ruta del día, deja al vendedor con el <b>pedido sugerido por cliente</b> y mide lo que regresa a la planta. Corre en el celular del vendedor, <b>sin cambiar de camioneta</b> ni de sistema de facturación.",
    dolores: [
      { titulo: "Lo que regresa ya se pagó en harina y en horas de camioneta", texto: "Reportar volumen bruto premia cargar de más. Nadie mide lo que regresa por parada, y la merma se descubre en la contabilidad del mes." },
      { titulo: "La ruta la arma una persona de memoria", texto: "Ventanas de recepción, quién abre a las seis, quién recibe por atrás: todo en la cabeza del encargado. Si se enferma, la ruta se enferma." },
      { titulo: "Los expendios nuevos llegan por casualidad", texto: "Las camionetas pasan todos los días frente a abarrotes, cafeterías y comedores que nunca han recibido tu pan." },
    ],
    dia: DIA_BASE(
      "El vendedor abre con su nombre, su unidad y el techo de carga por charola. Sabe cuál es la siguiente parada antes de arrancar.",
      "Pedido sugerido, devolución del pan de ayer y cobro en la misma pantalla. Cantidades tecleables; nada de listas infinitas con las manos ocupadas.",
      "Venta neta = despachado − devuelto. La merma sale en pesos, por ruta y por cliente, y el dueño la ve en su tablero antes de que llegue la camioneta."),
    mercado: [
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "minisuper", etiqueta: "Minisúpers" },
      { cat: "restaurantes", etiqueta: "Fondas, cafeterías y restaurantes" }, { cat: "hoteles", etiqueta: "Hoteles" },
      { cat: "comedores_ind", etiqueta: "Comedores industriales" }, { cat: "escuelas", etiqueta: "Escuelas" },
    ],
    tiposNegocio: ["Tiendita tradicional", "Abarrotes / miscelánea", "Minisúper", "Expendio de pan", "Cafetería", "Fonda / restaurante", "Hotel", "Comedor industrial", "Escuela", "Cremería"],
    faq: [
      { p: "¿Cómo se cuenta el pan del día anterior?", r: "En la misma pantalla del pedido. El vendedor teclea lo que regresa por producto y el sistema calcula la venta neta de esa parada al momento. El sugerido de la siguiente visita es lo que dejó menos lo que regresó." },
      { p: "¿Sirve para ruta de expendios y para HORECA a la vez?", r: "Sí. Cada cliente lleva su canal (expendio, cafetería, hotel, comedor) y el catálogo, las presentaciones y el sugerido se ajustan por cliente, no por ruta." },
      { p: "¿Qué pasa con las charolas y el envase?", r: "En cada visita se registran las charolas entregadas y las recogidas por cliente, junto con el pedido. Queda en el historial de esa tienda para la siguiente visita." },
    ],
    rutapack: true,
  },
  {
    slug: "tortilleria", nombre: "Tortillería y masa", corto: "tortillerías", producto: "tortilla de maíz y harina, masa y tostadas",
    keyword: "sistema de reparto para tortillerías",
    tituloSeo: "Sistema de reparto para tortillerías",
    answerFirst: "Mr Ruta es el <b>sistema de reparto para tortillerías</b> que reparte a abarrotes, fondas y carnicerías con la ruta ordenada, el <b>pedido sugerido por tienda</b> y la devolución contada en cada parada. Funciona en el celular del repartidor, <b>con o sin señal</b>.",
    dolores: [
      { titulo: "Treinta paradas de dos minutos y ninguna registrada", texto: "La ruta de la mañana es rápida y a mano. Al mediodía nadie sabe cuántos kilos se dejaron en cada tienda ni cuántos regresaron." },
      { titulo: "La tienda de al lado compra tortilla de otro", texto: "Las camionetas pasan frente a abarrotes, fondas y taquerías que compran a la competencia o van por su tortilla a pie." },
      { titulo: "El repartidor se va y se lleva la ruta", texto: "Quién recibe, a qué hora, cuánto suele llevar: nada está escrito." },
    ],
    dia: DIA_BASE(
      "Carga por kilos y por tipo (maíz, harina, tostada). El repartidor ve su ruta con la tienda que abre primero al frente.",
      "Dejó 20 kilos, regresó 2, cobró. Tres toques por tienda. Si no hay señal, se guarda y se sincroniza solo.",
      "Kilos despachados, kilos devueltos, efectivo cobrado y diferencia por ruta. El corte lo cuadra el sistema, no el cuaderno."),
    mercado: [
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "minisuper", etiqueta: "Minisúpers" },
      { cat: "restaurantes", etiqueta: "Fondas, taquerías y restaurantes" }, { cat: "carnicerias", etiqueta: "Carnicerías y pollerías" },
      { cat: "cremerias", etiqueta: "Cremerías" }, { cat: "comedores_ind", etiqueta: "Comedores industriales" },
    ],
    tiposNegocio: ["Abarrotes / miscelánea", "Minisúper", "Cremería", "Carnicería / pollería", "Fonda / cocina económica", "Taquería", "Restaurante", "Puesto de mercado", "Tortillería (reventa)", "Comedor industrial"],
    faq: [
      { p: "¿Se puede vender por kilo y por paquete a la vez?", r: "Sí. Cada producto entra al catálogo con su unidad (kilo, paquete, docena) y su precio. El repartidor teclea la cantidad en la unidad que usa esa tienda." },
      { p: "¿Cómo se maneja el efectivo de la ruta?", r: "Cada parada registra lo cobrado y lo que quedó a crédito. Al corte, el sistema muestra cuánto efectivo debe entregar cada repartidor y la diferencia contra lo despachado." },
      { p: "¿Puedo saber a qué abarrotes no les vendo todavía?", r: "Sí. El Radar te muestra, a partir de nuestros registros actualizados de la ciudad, los abarrotes, fondas y carnicerías que están a unas cuadras de tu ruta y aún no son clientes." },
    ],
    rutapack: true,
  },
  {
    slug: "helados-y-hielo", nombre: "Helados y hielo", corto: "heladerías y hieleras", producto: "base para helado, mezclas, paletas y hielo",
    keyword: "app de ruta para helados y hielo",
    tituloSeo: "App de ruta para helados y hielo",
    answerFirst: "Mr Ruta es la <b>app de ruta para helados y hielo</b> que lleva la cadena de frío, el <b>envase retornable</b> y el pedido sugerido de cada paletería, nevería y tienda en el celular del repartidor. La ruta se ordena sola y <b>la evidencia de entrega</b> queda con foto, GPS y firma.",
    dolores: [
      { titulo: "El hielo que llega tarde ya no es hielo", texto: "Sin ruta ordenada, la camioneta zigzaguea y las últimas paradas reciben producto a medias." },
      { titulo: "Los envases y las charolas desaparecen", texto: "Nadie lleva el saldo de envases por cliente; al final del mes faltan y no hay a quién cobrarle." },
      { titulo: "Las paleterías nuevas se abren sin que te enteres", texto: "Cada temporada abren neverías y puestos que compran a quien llega primero." },
    ],
    dia: DIA_BASE(
      "Carga por producto y por unidad refrigerada; el repartidor ve su ruta ordenada antes de salir.",
      "Entrega con foto tomada con la cámara, hora y ubicación. Envases entregados y recogidos en la misma pantalla.",
      "Venta neta por ruta, envases registrados por cliente y kilómetros de la ruta contra el plan."),
    mercado: [
      { cat: "paleterias", etiqueta: "Paleterías y neverías" }, { cat: "cafeterias", etiqueta: "Cafeterías y refresquerías" },
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "restaurantes", etiqueta: "Restaurantes y fondas" },
      { cat: "bares", etiqueta: "Bares" }, { cat: "hoteles", etiqueta: "Hoteles" },
    ],
    tiposNegocio: ["Paletería / nevería", "Abarrotes / miscelánea", "Minisúper", "Cafetería", "Restaurante", "Bar", "Hotel", "Puesto de mercado", "Escuela"],
    faq: [
      { p: "¿Lleva el control de envases retornables?", r: "Sí. En cada visita se registran los envases o charolas entregados y recogidos por cliente, y queda en el historial de esa parada." },
      { p: "¿Cómo se comprueba que el producto llegó en buen estado?", r: "Con la evidencia de entrega: foto tomada con la cámara en el momento (no de la galería), hora, ubicación y firma del cliente en pantalla." },
      { p: "¿Puedo ver dónde hay paleterías que no me compran?", r: "Sí. El Radar te muestra las paleterías, neverías y tiendas de tu ciudad que no están en tu cartera, verificadas una por una antes de mostrarse." },
    ],
    rutapack: true,
  },
  {
    slug: "carnicos-y-pollo", nombre: "Cárnicos, pollo y pescado", corto: "distribuidoras de cárnicos", producto: "carne, pollo, pescado y embutidos",
    keyword: "control de reparto de cárnicos y pollo",
    tituloSeo: "Reparto de cárnicos y pollo",
    answerFirst: "Mr Ruta es el <b>control de reparto de cárnicos y pollo</b> para distribuidoras que entregan a carnicerías, restaurantes y hoteles con cadena de frío. Pedido por peso, <b>evidencia de entrega con foto y firma</b> y la ruta ordenada, en el celular del chofer y <b>sin cambiar tu facturación</b>.",
    dolores: [
      { titulo: "Se entregó por peso y nadie firmó", texto: "Sin evidencia por parada, cada diferencia de kilos se vuelve una discusión con el cliente al cobrar." },
      { titulo: "La ruta se arma con la factura en la mano", texto: "El chofer decide el orden y la última entrega llega fuera de la ventana de recepción." },
      { titulo: "Restaurantes nuevos que compran al mercado", texto: "Abren fondas y restaurantes todos los meses; nadie los visita a tiempo." },
    ],
    dia: DIA_BASE(
      "El chofer recibe las remisiones del día ya asignadas a su unidad y ordenadas por ventana de recepción.",
      "Entrega con peso confirmado, foto de la báscula o del producto, firma del cliente y hora. Rechazos con motivo y foto.",
      "Entregado, rechazado y pendiente por ruta; kilómetros reales contra plan; incidencias con evidencia."),
    mercado: [
      { cat: "carnicerias", etiqueta: "Carnicerías, pollerías y pescaderías" }, { cat: "restaurantes", etiqueta: "Restaurantes y fondas" },
      { cat: "hoteles", etiqueta: "Hoteles" }, { cat: "comedores_ind", etiqueta: "Comedores industriales" },
      { cat: "supermercados", etiqueta: "Supermercados" },
    ],
    tiposNegocio: ["Carnicería", "Pollería", "Pescadería", "Restaurante", "Fonda / cocina económica", "Hotel", "Comedor industrial", "Supermercado", "Taquería"],
    faq: [
      { p: "¿Cómo se registra una entrega por peso?", r: "El chofer confirma los kilos entregados por producto, toma la foto y el cliente firma en pantalla. La diferencia contra lo remisionado queda registrada con motivo." },
      { p: "¿Qué pasa si el cliente rechaza parte del pedido?", r: "Se marca el rechazo por producto con motivo y foto. El producto regresa a la bodega con su registro y el cobro se ajusta al momento." },
      { p: "¿Se integra con mi sistema de facturación?", r: "Mr Ruta lee tus remisiones y facturas desde Excel, Odoo o Microsip y regresa lo entregado, rechazado y pendiente. Tu facturación sigue donde está." },
    ],
    rutapack: true,
  },
  {
    slug: "frutas-y-verduras", nombre: "Frutas y verduras", corto: "distribuidoras de frutas y verduras", producto: "fruta, verdura y abarrote fresco desde la central de abastos",
    keyword: "software para distribuidora de frutas y verduras",
    tituloSeo: "Reparto de frutas y verduras",
    answerFirst: "Mr Ruta es el <b>software para distribuidora de frutas y verduras</b> que sale de la central de abastos con la ruta ordenada, el pedido de cada fonda y restaurante en el celular del repartidor y la <b>merma contada por parada</b>. Sin cambiar de camioneta y <b>sin depender de la señal</b>.",
    dolores: [
      { titulo: "El pedido llegó por WhatsApp a las once de la noche", texto: "Cada cliente pide por un canal distinto y alguien lo pasa a mano a la lista de carga. Lo que se olvida, se pierde." },
      { titulo: "Lo que regresa maduro ya no se vende mañana", texto: "Sin conteo por parada nadie sabe qué producto regresa y de qué cliente." },
      { titulo: "Fondas y restaurantes que van por su cuenta a la central", texto: "Están a cuadras de tu ruta y nadie los ha visitado con una propuesta de reparto." },
    ],
    dia: DIA_BASE(
      "Los pedidos del día entran de Excel o del sistema y se arman por unidad. El repartidor ve su carga por producto y por cliente.",
      "Entrega con cantidad confirmada, foto y firma. Lo que el cliente no acepta regresa registrado por producto.",
      "Venta neta por ruta, merma por producto y cobro del día. El dueño lo ve antes de que regresen las unidades."),
    mercado: [
      { cat: "fruterias", etiqueta: "Fruterías y recauderías" }, { cat: "restaurantes", etiqueta: "Fondas, restaurantes y jugos" },
      { cat: "hoteles", etiqueta: "Hoteles" }, { cat: "comedores_ind", etiqueta: "Comedores industriales" },
      { cat: "abarrotes", etiqueta: "Abarrotes" }, { cat: "minisuper", etiqueta: "Minisúpers" },
    ],
    tiposNegocio: ["Frutería / recaudería", "Fonda / cocina económica", "Restaurante", "Juguería", "Hotel", "Comedor industrial", "Abarrotes", "Minisúper", "Puesto de mercado"],
    faq: [
      { p: "¿Cómo entran los pedidos de los clientes?", r: "Desde tu Excel, tu sistema o capturados por el vendedor en la app. Se arman por unidad y por ruta antes de salir de la central." },
      { p: "¿Se puede vender por kilo, por caja y por pieza?", r: "Sí. Cada producto lleva su unidad y su precio en el catálogo; el repartidor confirma la cantidad entregada en esa unidad." },
      { p: "¿Cómo controlo la merma?", r: "Todo lo que regresa se registra por producto y por cliente en la parada. La merma sale en pesos en el corte del día y en el tablero de dirección." },
    ],
    rutapack: false,
  },
  {
    slug: "lacteos-y-cremeria", nombre: "Lácteos y cremería", corto: "distribuidoras de lácteos", producto: "leche, quesos, crema, yogurt y embutidos",
    keyword: "ruteo para distribuidora de lácteos",
    tituloSeo: "Ruteo para lácteos y cremería",
    answerFirst: "Mr Ruta es el sistema de <b>ruteo para distribuidora de lácteos</b> que entrega a cremerías, abarrotes y cafeterías con la ruta ordenada, el <b>pedido sugerido por cliente</b> y la caducidad bajo control. Corre en el celular del vendedor <b>sin cambiar tu sistema</b> de facturación.",
    dolores: [
      { titulo: "Producto que caduca en la tienda y regresa", texto: "Sin sugerido por cliente se carga de más y lo que no rota se devuelve o se pierde." },
      { titulo: "Cremerías que compran a tres proveedores", texto: "Sin visita puntual y sin argumento, el cliente compra a quien pasó primero." },
      { titulo: "La cadena de frío sin evidencia", texto: "Cuando hay un reclamo, no hay foto ni hora que lo respalde." },
    ],
    dia: DIA_BASE(
      "Carga por producto y presentación; el vendedor ve su ruta con el sugerido de cada cremería.",
      "Sugerido por cliente (lo que dejó menos lo que regresó), devolución y cobro en la misma pantalla.",
      "Venta neta, devoluciones por producto y lo cobrado por ruta."),
    mercado: [
      { cat: "cremerias", etiqueta: "Cremerías" }, { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" },
      { cat: "minisuper", etiqueta: "Minisúpers" }, { cat: "panaderias", etiqueta: "Panaderías" },
      { cat: "restaurantes", etiqueta: "Cafeterías y restaurantes" }, { cat: "dulcerias", etiqueta: "Dulcerías y materias primas" },
    ],
    tiposNegocio: ["Cremería", "Abarrotes / miscelánea", "Minisúper", "Panadería", "Cafetería", "Restaurante", "Dulcería", "Supermercado"],
    faq: [
      { p: "¿Cómo evito cargar de más a una cremería?", r: "Con el sugerido por cliente: lo que dejaste la visita pasada menos lo que regresó. Si un producto regresa, la siguiente vez se sugiere menos; el sistema nunca inventa demanda." },
      { p: "¿Qué pasa si el cliente no paga completo?", r: "El vendedor registra lo cobrado y lo que quedó pendiente en la misma parada; aparece en el corte del día y en el historial del cliente." },
      { p: "¿Cómo encuentro cremerías que no me compran?", r: "El Radar te muestra las cremerías, abarrotes y cafeterías de tu ciudad que no están en tu cartera, verificadas antes de mostrarse." },
    ],
    rutapack: false,
  },
  {
    slug: "congelados", nombre: "Congelados", corto: "distribuidoras de congelados", producto: "alimentos congelados para restaurantes, hoteles y comedores",
    keyword: "software para distribuidora de congelados",
    tituloSeo: "Software de reparto de congelados",
    answerFirst: "Mr Ruta es el <b>software para distribuidora de congelados</b> que entrega a restaurantes, hoteles y comedores industriales con la ruta ordenada, la <b>remisión en el celular del chofer</b> y la evidencia de entrega con foto, GPS y firma. Se conecta a tu ERP <b>sin cambiar tu facturación</b>.",
    dolores: [
      { titulo: "La ventana de recepción se cierra y la camioneta sigue en tráfico", texto: "Sin ruta ordenada, las entregas de la tarde llegan cuando el cliente ya cerró y regresan a la bodega." },
      { titulo: "Cajas entregadas y cajas facturadas no cuadran", texto: "Sin evidencia por remisión, cada diferencia es una nota de crédito." },
      { titulo: "El chofer conoce la ruta; el sistema no", texto: "Cuando cambia de chofer, la ruta vuelve a empezar de cero." },
    ],
    dia: DIA_BASE(
      "Las remisiones del ERP llegan y el despacho las asigna por unidad y zona; las direcciones dudosas se revisan antes de salir.",
      "Entrega por remisión: cajas confirmadas, foto, firma y hora. Rechazos con motivo.",
      "Entregado, rechazado y pendiente por unidad; kilómetros y tiempos reales contra el plan."),
    mercado: [
      { cat: "restaurantes", etiqueta: "Restaurantes y cafeterías" }, { cat: "hoteles", etiqueta: "Hoteles" },
      { cat: "comedores_ind", etiqueta: "Comedores industriales" }, { cat: "bares", etiqueta: "Bares" },
      { cat: "supermercados", etiqueta: "Supermercados" }, { cat: "minisuper", etiqueta: "Minisúpers" },
    ],
    tiposNegocio: ["Restaurante", "Cafetería", "Hotel", "Comedor industrial", "Bar", "Supermercado", "Minisúper", "Escuela"],
    faq: [
      { p: "¿Se conecta con Microsip, Odoo o Excel?", r: "Sí. Mr Ruta lee las remisiones y facturas de tu sistema y regresa lo entregado, rechazado y pendiente. La facturación no cambia de lugar." },
      { p: "¿Cómo se asignan las remisiones a cada unidad?", r: "El despacho las asigna por zona y unidad; el sistema ordena la ruta de cada unidad y el encargado ajusta lo que haga falta antes de enviarla al chofer." },
      { p: "¿Qué evidencia queda de cada entrega?", r: "Foto tomada con la cámara en el momento, ubicación, hora, firma del cliente y cajas confirmadas por remisión." },
    ],
    rutapack: true,
  },
  {
    slug: "abarrotes-mayoreo", nombre: "Abarrotes al mayoreo", corto: "distribuidoras de abarrotes", producto: "abarrotes, dulces y artículos de consumo al detalle",
    keyword: "sistema de reparto para distribuidora de abarrotes",
    tituloSeo: "Reparto para abarrotes al mayoreo",
    answerFirst: "Mr Ruta es el <b>sistema de reparto para distribuidora de abarrotes</b> con preventa y entrega: el vendedor levanta el pedido con <b>sugerido por tienda</b>, el despacho arma las unidades y el chofer entrega con evidencia. Todo en el celular, <b>con o sin señal</b>.",
    dolores: [
      { titulo: "Preventa en papel, captura en la tarde, entrega mañana con errores", texto: "Cada paso a mano mete un error; el cliente recibe lo que no pidió y regresa lo que sí." },
      { titulo: "Tiendas que compran al competidor porque llegó antes", texto: "Sin frecuencia de visita definida, la tienda se surte con quien pasa." },
      { titulo: "No sabes cuántas tiendas te faltan en tu propia zona", texto: "Las camionetas pasan frente a cientos de abarrotes que no son clientes." },
    ],
    dia: DIA_BASE(
      "El preventista ve su ruta del día con el sugerido de cada tienda; el chofer recibe lo vendido ayer ya armado por unidad.",
      "Pedido en tres toques por tienda; entrega con foto y firma al día siguiente.",
      "Vendido, entregado, rechazado y cobrado por ruta; efectivo por chofer."),
    mercado: [
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "minisuper", etiqueta: "Minisúpers" },
      { cat: "farmacias", etiqueta: "Farmacias" }, { cat: "papelerias", etiqueta: "Papelerías" },
      { cat: "dulcerias", etiqueta: "Dulcerías" }, { cat: "otros_alimentos", etiqueta: "Otras tiendas de alimentos" },
    ],
    tiposNegocio: ["Abarrotes / miscelánea", "Minisúper", "Dulcería", "Papelería", "Farmacia", "Fonda", "Puesto de mercado", "Tienda escolar"],
    faq: [
      { p: "¿Maneja preventa y entrega por separado?", r: "Sí. El preventista vende hoy en su ruta y el chofer entrega mañana con la carga ya armada; cada uno tiene su app y su corte." },
      { p: "¿El vendedor ve el precio correcto de cada producto?", r: "Sí. El catálogo entra con tus presentaciones y precios, y el vendedor teclea solo la cantidad; el total se calcula en la pantalla." },
      { p: "¿Cuántas tiendas hay en mi zona que no me compran?", r: "Lo contamos con nuestros registros actualizados de tu ciudad y te mostramos el mapa; el Radar te sirve diez por día para visitarlas." },
    ],
    rutapack: false,
  },
  {
    slug: "botanas", nombre: "Botanas y dulces", corto: "distribuidoras de botanas", producto: "botanas, frituras, dulces y galletas",
    keyword: "app de ruta para distribuidora de botanas",
    tituloSeo: "App de ruta para botanas",
    answerFirst: "Mr Ruta es la <b>app de ruta para distribuidora de botanas</b> que reparte a tiendas, escuelas y bares con la ruta ordenada, el <b>sugerido por tienda</b> y el cobro en la misma parada. Funciona en el celular del vendedor <b>sin señal</b> y se sincroniza sola.",
    dolores: [
      { titulo: "Cuarenta tiendas al día y el cuaderno como sistema", texto: "Rutas rápidas y de muchas paradas donde nadie registra qué se dejó ni qué se cobró." },
      { titulo: "Caducados en el anaquel que regresan al mes", texto: "Sin sugerido, se sobrecarga a la tienda y lo que no rota se recoge caducado." },
      { titulo: "Tiendas escolares y bares que nadie visita", texto: "Puntos de alto consumo a cuadras de la ruta que compran al que llega primero." },
    ],
    dia: DIA_BASE(
      "Carga por producto y presentación; el vendedor ve sus 40 paradas ordenadas.",
      "Sugerido, cambio de producto próximo a caducar y cobro, en tres toques. Sin señal se guarda y sincroniza después.",
      "Venta neta por ruta, caducados recogidos y efectivo del día por vendedor."),
    mercado: [
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "minisuper", etiqueta: "Minisúpers" },
      { cat: "escuelas", etiqueta: "Escuelas" }, { cat: "bares", etiqueta: "Bares" },
      { cat: "papelerias", etiqueta: "Papelerías" }, { cat: "depositos_cerveza", etiqueta: "Depósitos" },
    ],
    tiposNegocio: ["Abarrotes / miscelánea", "Minisúper", "Tienda escolar", "Bar", "Papelería", "Depósito", "Puesto de mercado", "Cafetería"],
    faq: [
      { p: "¿Aguanta rutas de 40 o 50 paradas al día?", r: "Sí. La app está hecha para paradas de dos o tres minutos: sugerido, ajuste y cobro en tres toques, con cantidades tecleables." },
      { p: "¿Cómo se manejan los cambios de producto caducado?", r: "Se registran como devolución con motivo en la misma parada; el sistema descuenta del sugerido siguiente y lo reporta por cliente." },
      { p: "¿Funciona con varios vendedores y rutas a la vez?", r: "Sí. Cada vendedor tiene su ruta, su carga y su corte; dirección ve todas las rutas en un solo tablero." },
    ],
    rutapack: false,
  },
  {
    slug: "bebidas-y-agua", nombre: "Bebidas y agua", corto: "distribuidoras de bebidas", producto: "refrescos, agua embotellada, cerveza y bebidas",
    keyword: "software de distribución de bebidas y agua",
    tituloSeo: "Distribución de bebidas y agua",
    answerFirst: "Mr Ruta es el <b>software de distribución de bebidas y agua</b> que ordena la ruta, lleva el <b>envase retornable por cliente</b> y registra la entrega con foto y firma. El vendedor y el chofer trabajan desde el celular, <b>con o sin señal</b>, y dirección ve todo el mismo día.",
    dolores: [
      { titulo: "Los garrafones y cajas retornables no cuadran nunca", texto: "Sin saldo por cliente, el envase se pierde y nadie lo cobra." },
      { titulo: "Camionetas cargadas de más y de menos", texto: "Sin sugerido por cliente, una ruta regresa llena y otra se queda sin producto a media mañana." },
      { titulo: "Bares y fondas que compran al depósito", texto: "Puntos de venta que piden por volumen y nadie los atiende con frecuencia." },
    ],
    dia: DIA_BASE(
      "Carga por producto y envase, por unidad.",
      "Entrega, envases recogidos y cobro en una pantalla. Foto y firma cuando el cliente lo pide.",
      "Venta neta, envases registrados por cliente y efectivo por ruta."),
    mercado: [
      { cat: "abarrotes", etiqueta: "Abarrotes y misceláneas" }, { cat: "minisuper", etiqueta: "Minisúpers" },
      { cat: "restaurantes", etiqueta: "Restaurantes y fondas" }, { cat: "bares", etiqueta: "Bares" },
      { cat: "hoteles", etiqueta: "Hoteles" }, { cat: "gimnasios", etiqueta: "Gimnasios" },
    ],
    tiposNegocio: ["Abarrotes / miscelánea", "Minisúper", "Restaurante", "Fonda", "Bar", "Hotel", "Gimnasio", "Oficina", "Depósito"],
    faq: [
      { p: "¿Lleva el saldo de garrafones y envases por cliente?", r: "Sí. Cada entrega registra los envases dejados y recogidos por cliente y queda en el historial de esa parada." },
      { p: "¿Sirve para autoventa y para preventa?", r: "Sí. La app del vendedor levanta el pedido y cobra en la parada; la del chofer entrega con evidencia. Si tu ruta vende y entrega al momento, el vendedor usa las dos funciones en la misma visita." },
      { p: "¿Se registra el cobro en la parada?", r: "Sí. Lo cobrado y lo que quedó pendiente se registran en la misma pantalla del pedido y aparecen en el corte del día." },
    ],
    rutapack: false,
  },
  {
    slug: "gas-lp", nombre: "Gas LP", corto: "distribuidoras de gas LP", producto: "gas LP en cilindro y estacionario",
    keyword: "control de rutas de reparto de gas LP",
    tituloSeo: "Rutas de reparto de gas LP",
    answerFirst: "Mr Ruta es el <b>control de rutas de reparto de gas LP</b> que ordena la ruta de cada unidad, registra la entrega con <b>foto, ubicación y firma</b> y lleva el cobro y el crédito por cliente. Para negocios (fondas, tortillerías, hoteles) y para ruta de colonia, desde el celular del operador.",
    dolores: [
      { titulo: "La unidad recorre la colonia sin saber quién necesita", texto: "Sin historial por cliente ni ruta ordenada, se pasa por donde no hay venta y se falta a donde sí." },
      { titulo: "Entregas sin comprobante y cobros sin cuadre", texto: "Al corte, los kilos despachados y el efectivo no coinciden y no hay evidencia para saber por qué." },
      { titulo: "Negocios que consumen mucho y compran a otro", texto: "Tortillerías, fondas y lavanderías a cuadras de la ruta que nadie visita." },
    ],
    dia: DIA_BASE(
      "El operador ve su ruta del día ordenada y el historial de cada cliente.",
      "Entrega con litros o kilos confirmados, foto y firma; lo cobrado y lo pendiente en la misma pantalla.",
      "Despachado, cobrado y pendiente por unidad; kilómetros reales contra el plan."),
    mercado: [
      { cat: "restaurantes", etiqueta: "Fondas y restaurantes" }, { cat: "tortillerias", etiqueta: "Tortillerías" },
      { cat: "panaderias", etiqueta: "Panaderías" }, { cat: "lavanderias", etiqueta: "Lavanderías" },
      { cat: "hoteles", etiqueta: "Hoteles" }, { cat: "comedores_ind", etiqueta: "Comedores industriales" },
    ],
    tiposNegocio: ["Fonda / restaurante", "Tortillería", "Panadería", "Lavandería", "Hotel", "Comedor industrial", "Casa habitación", "Escuela"],
    faq: [
      { p: "¿Sirve para ruta de colonia y para negocios a la vez?", r: "Sí. Los negocios llevan pedido y frecuencia; la ruta de colonia se registra por parada con lo despachado y cobrado." },
      { p: "¿Cómo se comprueba cada entrega?", r: "Con foto tomada en el momento, ubicación, hora y firma del cliente. El comprobante queda ligado a la parada." },
      { p: "¿Se registra lo que queda pendiente de pago?", r: "Sí. En cada parada se registra lo cobrado y lo pendiente; el operador lo ve en su corte y dirección en el tablero." },
    ],
    rutapack: false,
  },
  {
    slug: "refacciones-y-autopartes", nombre: "Refacciones y autopartes", corto: "distribuidoras de refacciones", producto: "refacciones, llantas, lubricantes y autopartes",
    keyword: "software de entrega de refacciones y autopartes",
    tituloSeo: "Entrega de refacciones y autopartes",
    answerFirst: "Mr Ruta es el <b>software de entrega de refacciones y autopartes</b> para distribuidoras que surten talleres, refaccionarias y llanteras: la ruta ordenada por urgencia, la <b>remisión en el celular del repartidor</b> y la entrega con foto y firma. Se conecta a tu sistema <b>sin cambiar la facturación</b>.",
    dolores: [
      { titulo: "El taller tiene el coche en el elevador y la pieza en tráfico", texto: "Sin ruta ordenada ni registro de la entrega, el repartidor decide el orden y el cliente urgente espera." },
      { titulo: "Devoluciones y garantías sin registro", texto: "La pieza regresa sin motivo ni evidencia y se vuelve una nota de crédito discutida." },
      { titulo: "Talleres nuevos que compran por catálogo en línea", texto: "Abren talleres y llanteras cada mes; nadie los visita con oferta de surtido." },
    ],
    dia: DIA_BASE(
      "Las remisiones del día llegan del sistema y el despacho las asigna por unidad; las urgentes se ponen al frente a mano.",
      "Entrega por remisión con piezas confirmadas, foto y firma. Devoluciones con motivo.",
      "Entregado, devuelto y pendiente por unidad; hora real de cada entrega."),
    mercado: [
      { cat: "talleres", etiqueta: "Talleres mecánicos" }, { cat: "refaccionarias", etiqueta: "Refaccionarias" },
      { cat: "llanteras", etiqueta: "Llanteras y vulcanizadoras" }, { cat: "transportistas", etiqueta: "Transportistas" },
      { cat: "agencias_autos", etiqueta: "Agencias y lotes de autos" },
    ],
    tiposNegocio: ["Taller mecánico", "Refaccionaria", "Llantera", "Hojalatería y pintura", "Transportista", "Agencia de autos", "Lote de autos", "Flotilla"],
    faq: [
      { p: "¿Cómo se atienden las entregas urgentes?", r: "El despacho las pone al frente de la ruta de esa unidad y el sistema ordena el resto de las paradas por cercanía. La entrega queda con foto y firma en cuanto se hace." },
      { p: "¿Cómo se registran devoluciones y garantías?", r: "En la parada, por pieza, con motivo y foto. El sistema lo regresa a tu ERP como devolución para que la nota de crédito no se discuta." },
      { p: "¿Puedo saber cuántos talleres hay en mi zona?", r: "Sí. Con nuestros registros actualizados de tu ciudad te decimos cuántos talleres, refaccionarias y llanteras hay alrededor de tu bodega y cuáles no son tus clientes." },
    ],
    rutapack: false,
  },
  {
    slug: "limpieza-y-quimicos", nombre: "Limpieza y químicos", corto: "distribuidoras de productos de limpieza", producto: "productos de limpieza, químicos y desechables",
    keyword: "reparto de productos de limpieza y químicos",
    tituloSeo: "Reparto de productos de limpieza",
    answerFirst: "Mr Ruta es el sistema de <b>reparto de productos de limpieza y químicos</b> para distribuidoras que surten restaurantes, hoteles, escuelas y hospitales con pedido programado, ruta ordenada y <b>evidencia de entrega</b> con foto y firma. Desde el celular del repartidor, <b>sin cambiar tu facturación</b>.",
    dolores: [
      { titulo: "Pedidos programados que se entregan tarde", texto: "Los clientes institucionales tienen horario de recepción; sin ruta ordenada, la entrega llega cuando ya cerraron." },
      { titulo: "Garrafones y tambos retornables sin control", texto: "El envase vale y nadie lleva el saldo por cliente." },
      { titulo: "Hoteles y escuelas que compran a un mayorista lejano", texto: "Clientes de volumen a minutos de la bodega que nunca han recibido una visita." },
    ],
    dia: DIA_BASE(
      "Los pedidos del día entran de tu sistema o los levanta el vendedor; se arma la carga por unidad.",
      "Entrega con productos confirmados, foto y firma del responsable de recepción.",
      "Entregado y pendiente por ruta; lo que quedó para la siguiente visita."),
    mercado: [
      { cat: "restaurantes", etiqueta: "Restaurantes y cafeterías" }, { cat: "hoteles", etiqueta: "Hoteles" },
      { cat: "escuelas", etiqueta: "Escuelas" }, { cat: "hospitales", etiqueta: "Hospitales y clínicas" },
      { cat: "lavanderias", etiqueta: "Lavanderías" }, { cat: "gimnasios", etiqueta: "Gimnasios" },
    ],
    tiposNegocio: ["Restaurante", "Hotel", "Escuela", "Hospital / clínica", "Lavandería", "Gimnasio", "Oficina", "Fábrica", "Comedor industrial"],
    faq: [
      { p: "¿Maneja pedidos recurrentes?", r: "Sí. El sugerido de cada cliente parte de su última visita (lo que dejaste menos lo que regresó) y el vendedor lo ajusta en tres toques." },
      { p: "¿Quién firma la entrega en un hotel o escuela?", r: "El responsable de recepción firma en pantalla y queda con nombre, hora y foto ligados a la remisión." },
      { p: "¿Se integra con mi ERP?", r: "Sí. Lee remisiones y facturas de Excel, Odoo o Microsip y regresa lo entregado y lo pendiente. La facturación no cambia de lugar." },
    ],
    rutapack: false,
  },
  {
    slug: "materiales-de-construccion", nombre: "Materiales de construcción", corto: "distribuidoras de materiales", producto: "pisos, azulejos, cemento, varilla y material para obra",
    keyword: "logística de reparto de materiales de construcción",
    tituloSeo: "Reparto de materiales de construcción",
    answerFirst: "Mr Ruta es el sistema de <b>logística de reparto de materiales de construcción</b> que asigna las remisiones a cada unidad por zona, ordena la ruta y registra la entrega en obra con <b>foto, ubicación y firma</b>. Se conecta a tu sistema <b>sin cambiar la facturación</b>.",
    dolores: [
      { titulo: "La obra no tiene número y el chofer da vueltas", texto: "Direcciones incompletas que se corrigen por teléfono en cada entrega; nadie guarda la ubicación real." },
      { titulo: "Entregas en obra sin quien firme", texto: "El material se descarga y después nadie reconoce haberlo recibido." },
      { titulo: "Ferreterías y contratistas que compran al de enfrente", texto: "Clientes de volumen en tu zona que nunca recibieron una visita." },
    ],
    dia: DIA_BASE(
      "Remisiones asignadas por zona a cada unidad; direcciones dudosas marcadas para confirmar antes de salir.",
      "Entrega en obra con foto del material descargado, ubicación exacta y firma; la coordenada se guarda para la siguiente vez.",
      "Entregado, pendiente y reprogramado por unidad; kilómetros reales."),
    mercado: [
      { cat: "ferreterias", etiqueta: "Ferreterías y tlapalerías" }, { cat: "pisos", etiqueta: "Pisos y recubrimientos" },
      { cat: "pinturas", etiqueta: "Pinturas" }, { cat: "mat_construccion", etiqueta: "Materialeras" },
      { cat: "constructoras", etiqueta: "Constructoras y contratistas" },
    ],
    tiposNegocio: ["Ferretería", "Materialera", "Constructora", "Contratista", "Obra", "Tienda de pisos", "Pintura", "Plomería / electricidad"],
    faq: [
      { p: "¿Qué pasa con las direcciones de obra que no existen en el mapa?", r: "El sistema las marca antes de salir para confirmarlas; en la entrega el chofer guarda la ubicación real y la siguiente vez la ruta ya la conoce." },
      { p: "¿Cómo se reparten las remisiones entre unidades?", r: "El despacho las asigna por zona a cada unidad; cada unidad tiene registrada su capacidad y el sistema ordena su ruta." },
      { p: "¿Cómo se comprueba una entrega en obra?", r: "Foto del material descargado tomada en el momento, ubicación, hora y firma del residente o encargado." },
    ],
    rutapack: true,
  },
];

export const giroPorSlug = (slug: string) => GIROS.find((g) => g.slug === slug);

// Correspondencia con los rankings del padrón (claves de zonas.json)
export const RANKING_KEY: Record<string, string> = {
  "panaderia": "panaderia", "tortilleria": "tortilleria", "helados-y-hielo": "helados_hielo",
  "carnicos-y-pollo": "carnicos_pollo", "frutas-y-verduras": "frutas_verduras", "lacteos-y-cremeria": "lacteos_cremeria",
  "congelados": "congelados", "abarrotes-mayoreo": "abarrotes_mayoreo", "botanas": "botanas", "bebidas-y-agua": "bebidas_agua",
  "gas-lp": "gas_lp", "refacciones-y-autopartes": "refacciones", "limpieza-y-quimicos": "limpieza_quimicos",
  "materiales-de-construccion": "construccion",
};
