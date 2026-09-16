// Generador de propuesta comercial + cotización en HTML para impresión/PDF
// Página 1: cotización formal | Páginas 2-5: propuesta comercial completa

export interface QuoteItem {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
}

export interface PropuestaData {
  antecedentes?: string;
  generalidades?: string;
  objetivos?: {
    productividad?: string[];
    ahorros?: string[];
    servicio?: string[];
  };
  actividadesGenericas?: string[];
  kpis?: Array<{ categoria: string; items: string[] }>;
  actividades?: Array<{
    seccion: string;
    items: Array<{ nombre: string; responsable?: string; semanas?: number[] }>;
  }>;
  fechaInicioActividades?: Date;
  complementos?: string[];
  tiemposCompromiso?: string[];
  condicionesPagoDetalle?: string[];
  firmante?: {
    nombre: string;
    cargo: string;
    empresa: string;
    email?: string;
    telefono?: string;
  };
}

export interface QuoteData {
  folio: string;
  fecha: Date;
  fechaVencimiento?: Date;
  cliente: {
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };
  servicios: QuoteItem[];
  subtotal: number;
  iva: number;
  total: number;
  notas?: string;
  condicionesPago?: string;
  validezDias?: number;
  empresa?: {
    nombre: string;
    subtitulo: string;
    direccion: string;
    telefono: string;
    email: string;
    rfc?: string;
    beneficiario: string;
    banco: string;
    clabe: string;
    tarjeta: string;
  };
  propuesta?: PropuestaData;
}

const defaultEmpresa = {
  nombre: "Mr. Ruta",
  subtitulo: "Soluciones de Distribución y Logística",
  direccion: "Monterrey, Nuevo León, México",
  telefono: "",
  email: "contacto@mr-ruta.com",
  rfc: "",
  beneficiario: "Mr. Ruta S.A. DE C.V.",
  banco: "",
  clabe: "",
  tarjeta: "",
};

const TRUCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
  <rect x="9" y="11" width="14" height="10" rx="2"/>
  <circle cx="12" cy="21" r="1"/>
  <circle cx="20" cy="21" r="1"/>
</svg>`;

const TRUCK_SVG_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
  <rect x="9" y="11" width="14" height="10" rx="2"/>
  <circle cx="12" cy="21" r="1"/>
  <circle cx="20" cy="21" r="1"/>
</svg>`;

export const generateFolio = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COT${year}${month}${day}${random}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatDateLong = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const addWeeks = (date: Date, weeks: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
};

const getMonthLabel = (date: Date, offsetMonths: number): string => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + offsetMonths);
  const label = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(d);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// ─── PAGE HEADER (reusable for pages 2-5) ────────────────────────────────────
const pageHeader = (empresa: typeof defaultEmpresa): string => `
<div class="page-header">
  <div class="page-header-left">
    ${TRUCK_SVG_SMALL}
    <div>
      <span class="page-header-company">${empresa.nombre}</span>
      <span class="page-header-sub">${empresa.subtitulo}</span>
    </div>
  </div>
  <div class="page-header-title">Propuesta Comercial</div>
</div>`;

// ─── GENERATE PROPOSAL EXTRA PAGES ───────────────────────────────────────────
const generatePropuestaPages = (data: QuoteData): string => {
  const empresa = data.empresa || defaultEmpresa;
  const p = data.propuesta || {};
  const fechaInicio = p.fechaInicioActividades || data.fecha;

  // ── Defaults ──────────────────────────────────────────────────────────────
  const antecedentes = p.antecedentes ||
    `Con base en los requerimientos de distribución y logística identificados, ${empresa.nombre} hace de su conocimiento los servicios especializados que presta por medio de la presente propuesta comercial dirigida a <strong>${data.cliente.nombre}</strong>.<br><br>
     Se analizaron los procesos actuales de distribución y se identificaron oportunidades de mejora en eficiencia operativa, reducción de costos y calidad de servicio. Mediante la integración de rutas optimizadas, seguimiento en tiempo real y control de entregas, se pueden lograr mejoras sustanciales en los indicadores de operación.`;

  const generalidades = p.generalidades ||
    `Los servicios de Distribución y Logística que presentamos consisten en la integración de cuatro módulos que permiten reducir significativamente tiempos, costos operativos y cantidad de recursos:`;

  const objetivos = p.objetivos || {
    productividad: [
      "Más entregas en menos tiempo, con menos vehículos",
      "Optimización de la carga por unidad de reparto",
      "Reducción de tiempos de traslado y espera",
    ],
    ahorros: [
      "Combustible",
      "Mantenimiento vehicular",
      "Desgaste de unidades",
      "Tiempo de planeación de rutas",
      "Jornadas de trabajo más cortas",
      "Horas extras",
    ],
    servicio: [
      "Entregas más rápidas",
      "Visitas puntuales a clientes",
      "Evidencias fotográficas de entrega",
    ],
  };

  const actividadesGenericas = p.actividadesGenericas || [
    `${data.cliente.nombre} enviará en formato Excel toda la información necesaria para planear las rutas: Direcciones, productos, cantidades, fechas, etc.`,
    `Personal de ${empresa.nombre} planeará las rutas fijas y variables y las cargará en los sistemas de seguimiento para su ejecución.`,
    `${empresa.nombre} capacitará a los usuarios clave de ${data.cliente.nombre} vía remota.`,
    "Documentación: parametrización, instalación y manuales de capacitación.",
    `Soporte al arranque vía remota por parte de ${empresa.nombre} durante tres días.`,
    `Una junta remota mensual de ${empresa.nombre} con los responsables del cliente para revisar indicadores y mejoras posibles.`,
  ];

  const kpis = p.kpis || [
    {
      categoria: "Distribución",
      items: [
        "% Cumplimiento de ruta programada",
        "Número de clientes visitados vs. clientes programados",
        "% Efectividad de entrega por ruta",
        "Kilómetros recorridos al día por unidad",
        "Tiempo promedio de entrega por parada",
        "% Entregas dentro de ventana horaria",
        "Número y % de clientes cerrados por ruta",
        "% de devolución por ruta, por producto, por cliente",
        "% y # de clientes nuevos atendidos",
        "Costo por entrega / costo por kilómetro",
      ],
    },
    {
      categoria: "Servicio al Cliente",
      items: [
        "% Pedidos entregados completos (sin faltantes)",
        "% Satisfacción del cliente (encuestas post-entrega)",
        "Tiempo de respuesta a incidencias",
        "# de reclamaciones recibidas por período",
        "% Resolución de incidencias en primera respuesta",
        "Frecuencia de visita cumplida vs. programada",
        "# de evidencias fotográficas registradas",
        "% Facturas con firma de recepción",
      ],
    },
    {
      categoria: "Eficiencia Operativa",
      items: [
        "% Ocupación de carga por vehículo",
        "% Rutas completadas sin incidencias",
        "Tiempo promedio de carga en cedis",
        "% Cumplimiento del plan de trabajo semanal",
        "# de incidencias reportadas por ruta",
        "Consumo de combustible por kilómetro",
        "% Mantenimientos preventivos realizados a tiempo",
        "Rotación de inventario en ruta",
      ],
    },
  ];

  const actividades = p.actividades || [
    {
      seccion: "Administrativas",
      items: [
        { nombre: "Firma de propuesta y contrato", responsable: `${empresa.nombre} / Cliente`, semanas: [1] },
        { nombre: "Reunión inicial de arranque", responsable: `${empresa.nombre} / Cliente`, semanas: [1, 2] },
      ],
    },
    {
      seccion: "Configuración del Servicio",
      items: [
        { nombre: "Catálogo de clientes y direcciones", responsable: "Cliente", semanas: [2, 3] },
        { nombre: "Inventario de productos (SKUs)", responsable: "Cliente", semanas: [2, 3] },
        { nombre: "Lista de rutas actuales con sus puntos", responsable: "Cliente", semanas: [3] },
        { nombre: "Definición de reglas de negocio", responsable: `${empresa.nombre} / Cliente`, semanas: [3, 4] },
        { nombre: "Inventario actual por ruta / día (últimas 6 semanas)", responsable: "Cliente", semanas: [3, 4] },
        { nombre: "Optimización de rutas propuestas", responsable: empresa.nombre, semanas: [4, 5] },
        { nombre: "Revisión y validación de nuevas rutas", responsable: `${empresa.nombre} / Cliente`, semanas: [5, 6] },
      ],
    },
    {
      seccion: "Arranque de Operaciones",
      items: [
        { nombre: "Capacitación al responsable de cedis", responsable: empresa.nombre, semanas: [6, 7] },
        { nombre: "Capacitación a operadores y personal de ruta", responsable: empresa.nombre, semanas: [7] },
        { nombre: "Carga y prueba de 1 ruta piloto", responsable: empresa.nombre, semanas: [7, 8] },
        { nombre: "Prueba de ruta durante varios días", responsable: empresa.nombre, semanas: [8, 9] },
        { nombre: "Arranque con todas las rutas", responsable: empresa.nombre, semanas: [9, 10] },
        { nombre: "Soporte a la operación", responsable: empresa.nombre, semanas: [10, 11, 12] },
      ],
    },
  ];

  const complementos = p.complementos || [
    "Soporte técnico por vía remota (TeamViewer / videollamada)",
    "Seguimiento de rutas en tiempo real con dashboard web",
    "Evidencias fotográficas y firma digital de entrega",
    "Reportes y KPIs exportables a Excel / PDF",
    "Interfaz con sistemas ERP del cliente (cotizado por separado)",
  ];

  const tiemposCompromiso = p.tiemposCompromiso || [
    "Contrato inicial de tres meses con renovación automática mensual",
    "Periodo de ajuste y optimización: primeros 30 días de operación",
    "Tiempo de respuesta a incidencias: máximo 24 horas hábiles",
  ];

  const condicionesPagoDetalle = p.condicionesPagoDetalle || [
    "Los precios están expresados en pesos mexicanos y no incluyen IVA",
    "No se incluyen costos de viáticos para actividades presenciales",
    "Los costos de configuración se facturarán a la confirmación de la propuesta con 15 días de crédito",
    "Los honorarios mensuales se facturarán al 100% al inicio de cada mes de servicio",
    "Para servicios continuos, Mr. Ruta otorga 30 días de crédito a partir del envío de la factura",
  ];

  const firmante = p.firmante || {
    nombre: empresa.nombre,
    cargo: "Dirección Comercial",
    empresa: empresa.nombre,
    email: empresa.email,
    telefono: empresa.telefono,
  };

  // ── Build week headers (3 months × ~4 weeks = 12 columns) ─────────────────
  const month0 = getMonthLabel(fechaInicio, 0);
  const month1 = getMonthLabel(fechaInicio, 1);
  const month2 = getMonthLabel(fechaInicio, 2);

  const weekHeaders = [
    { month: month0, weeks: ["1", "2", "3", "4"] },
    { month: month1, weeks: ["1", "2", "3", "4"] },
    { month: month2, weeks: ["1", "2", "3", "4"] },
  ];

  const buildWeekCells = (semanas: number[] = []): string => {
    let cells = "";
    for (let w = 1; w <= 12; w++) {
      cells += semanas.includes(w)
        ? `<td class="gantt-cell gantt-active"></td>`
        : `<td class="gantt-cell"></td>`;
    }
    return cells;
  };

  const ganttRows = actividades.map(sec => {
    const secRow = `<tr class="gantt-section-row"><td colspan="14" class="gantt-section">${sec.seccion}</td></tr>`;
    const itemRows = sec.items.map(item => `
      <tr>
        <td class="gantt-name">${item.nombre}</td>
        <td class="gantt-resp">${item.responsable || ""}</td>
        ${buildWeekCells(item.semanas)}
      </tr>`).join("");
    return secRow + itemRows;
  }).join("");

  const kpiRows = kpis.map(cat => {
    const catRow = `<tr class="kpi-section-row"><td colspan="2" class="kpi-section">${cat.categoria}</td></tr>`;
    const items = cat.items.map((item, idx) => `
      <tr>
        <td class="kpi-num">${idx + 1}</td>
        <td class="kpi-item">${item}</td>
      </tr>`).join("");
    return catRow + items;
  }).join("");

  // ── Service modules (Generalidades) ─────────────────────────────────────
  const servicioModulos = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
      titulo: "Planeación de Rutas",
      items: ["Rutas fijas (mandatorias)", "Rutas variables (dinámicas)", "Balanceo de carga y trabajo"],
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      titulo: "Seguimiento en Tiempo Real",
      items: ["Navegación guiada", "Tiempos de descarga", "Evidencias de entrega", "Dashboards de control"],
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>`,
      titulo: "Zonificación de Territorios",
      items: ["Diseño de zonas de venta", "Balanceo de facturación", "Optimización de frecuencias"],
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
      titulo: "Reportes y Control",
      items: ["KPIs de desempeño", "App de administración", "Web service de control", "Exportación a Excel / PDF"],
    },
  ];

  const modulosHTML = servicioModulos.map(m => `
    <div class="modulo-box">
      <div class="modulo-icon">${m.icon}</div>
      <div class="modulo-titulo">${m.titulo}</div>
      <ul class="modulo-list">
        ${m.items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>`).join("");

  // ─────────────────────────────────────────────────────────────────────────
  return `
<!-- ════════════════ PÁGINA 2: ANTECEDENTES + OBJETIVOS ════════════════ -->
<div class="page-break">
  ${pageHeader(empresa)}

  <div class="prop-section">
    <h2 class="prop-section-title">Antecedentes</h2>
    <p class="prop-text">${antecedentes}</p>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Generalidades</h2>
    <p class="prop-text">${generalidades}</p>
    <div class="modulos-grid">
      ${modulosHTML}
    </div>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Objetivos</h2>
    <table class="obj-table">
      <thead>
        <tr>
          <th>1) Aumento en Productividad</th>
          <th>2) Ahorros Operacionales</th>
          <th>3) Mejor Servicio a Clientes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            ${(objetivos.productividad || []).map(i => `<p class="obj-item">▪ ${i}</p>`).join("")}
          </td>
          <td>
            ${(objetivos.ahorros || []).map(i => `<p class="obj-item">▪ ${i}</p>`).join("")}
          </td>
          <td>
            ${(objetivos.servicio || []).map(i => `<p class="obj-item">▪ ${i}</p>`).join("")}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Parametrización de la Solución</h2>
    <p class="prop-text">${empresa.nombre} llevará a cabo un análisis de las necesidades logísticas y de los procesos de ${data.cliente.nombre}.</p>
    <p class="prop-text">Al final de la fase de análisis, serán identificadas la totalidad de las adecuaciones necesarias para el funcionamiento óptimo del servicio.</p>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Actividades Genéricas a Realizar</h2>
    <ol class="prop-ol">
      ${actividadesGenericas.map(a => `<li>${a}</li>`).join("")}
    </ol>
  </div>

  <div class="prop-footer">
    <p>${empresa.nombre} | ${empresa.direccion} | ${empresa.email}</p>
  </div>
</div>

<!-- ════════════════ PÁGINA 3: KPIs ════════════════ -->
<div class="page-break">
  ${pageHeader(empresa)}

  <div class="prop-section">
    <h2 class="prop-section-title">KPI's para ser Medidos durante la Operación</h2>
    <table class="kpi-table">
      <thead>
        <tr>
          <th class="kpi-th-num">#</th>
          <th class="kpi-th-item">Indicador</th>
        </tr>
      </thead>
      <tbody>
        ${kpiRows}
      </tbody>
    </table>
  </div>

  <div class="prop-footer">
    <p>${empresa.nombre} | ${empresa.direccion} | ${empresa.email}</p>
  </div>
</div>

<!-- ════════════════ PÁGINA 4: ACTIVIDADES Y TIEMPOS ════════════════ -->
<div class="page-break">
  ${pageHeader(empresa)}

  <div class="prop-section">
    <h2 class="prop-section-title">Actividades Específicas y Tiempos</h2>
    <p class="prop-text-sm">Fecha de inicio estimada: <strong>${formatDateLong(fechaInicio)}</strong></p>

    <div class="gantt-wrapper">
      <table class="gantt-table">
        <thead>
          <tr>
            <th class="gantt-th-name" rowspan="2">Actividades</th>
            <th class="gantt-th-resp" rowspan="2">Responsables</th>
            ${weekHeaders.map(m => `<th colspan="4" class="gantt-th-month">${m.month}</th>`).join("")}
          </tr>
          <tr>
            ${weekHeaders.map(m => m.weeks.map(w => `<th class="gantt-th-week">${w}</th>`).join("")).join("")}
          </tr>
        </thead>
        <tbody>
          ${ganttRows}
        </tbody>
      </table>
    </div>
  </div>

  <div class="prop-footer">
    <p>${empresa.nombre} | ${empresa.direccion} | ${empresa.email}</p>
  </div>
</div>

<!-- ════════════════ PÁGINA 5: COMPLEMENTOS + CONDICIONES + FIRMAS ════════════════ -->
<div class="page-break">
  ${pageHeader(empresa)}

  <div class="prop-section">
    <h2 class="prop-section-title">Complementos del Servicio</h2>
    <ul class="prop-ul">
      ${complementos.map((c, i) => `<li>${String.fromCharCode(97 + i)}) ${c}</li>`).join("")}
    </ul>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Tiempos de Compromiso</h2>
    <ul class="prop-ul-dot">
      ${tiemposCompromiso.map(t => `<li>${t}</li>`).join("")}
    </ul>
  </div>

  <div class="prop-section">
    <h2 class="prop-section-title">Consideraciones de Pago</h2>
    <ul class="prop-ul-dot">
      ${condicionesPagoDetalle.map(c => `<li>${c}</li>`).join("")}
    </ul>
  </div>

  <p class="prop-text" style="margin-top:16px;">Quedamos a sus órdenes para aclarar cualquier duda o ampliar la información.</p>
  <p class="prop-text">Estimado(a) <strong>${data.cliente.nombre}</strong>, si está de acuerdo con la presente propuesta, le agradeceremos que nos la envíe de vuelta con su firma de aprobación.</p>
  <p class="prop-text">Muchas gracias.</p>

  <div class="firma-grid">
    <div class="firma-box">
      <div class="firma-empresa">${firmante.empresa}</div>
      <div class="firma-line"></div>
      <div class="firma-nombre">${firmante.nombre}</div>
      <div class="firma-cargo">${firmante.cargo}</div>
      ${firmante.email ? `<div class="firma-contact">${firmante.email}</div>` : ""}
      ${firmante.telefono ? `<div class="firma-contact">${firmante.telefono}</div>` : ""}
    </div>
    <div class="firma-box">
      <div class="firma-empresa">Aceptación de esta propuesta por<br>${data.cliente.nombre}</div>
      <div class="firma-line"></div>
      <div class="firma-nombre">&nbsp;</div>
      <div class="firma-cargo">Director / Representante Legal</div>
    </div>
  </div>

  <div class="prop-footer">
    <p>${empresa.nombre} | ${empresa.direccion} | ${empresa.email}</p>
  </div>
</div>`;
};

// ─── FULL CSS (pages 1 + 2-5) ─────────────────────────────────────────────
const STYLES = `
  @page { size: letter; margin: 0.4in; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 11px; line-height: 1.3; color: #1a1a1a;
    background: white; width: 100%; max-width: 8in; margin: 0 auto; padding: 15px;
  }

  /* ── PAGE 1: QUOTE ─────────────────────────── */
  .header {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: flex-start; padding-bottom: 12px;
    border-bottom: 3px solid #0F7A4A; margin-bottom: 15px; gap: 15px;
  }
  .company-info h1 { font-size:20px; font-weight:700; color:#0F7A4A; margin-bottom:3px; }
  .company-info .subtitle { font-size:11px; color:#666; }
  .company-info .contact { font-size:10px; color:#888; margin-top:5px; }
  .logo-center { display:flex; justify-content:center; align-items:center; }
  .logo-center img { height:60px; width:auto; object-fit:contain; }
  .quote-header { text-align:right; }
  .quote-header h2 { font-size:22px; color:#0F7A4A; font-weight:700; margin-bottom:5px; }
  .quote-header .folio { font-size:14px; font-weight:600; color:#333; }
  .quote-header .dates { font-size:10px; color:#666; margin-top:5px; }
  .client-section {
    background:#f8f9fa; border:1px solid #e0e0e0; border-left:4px solid #0F7A4A;
    padding:12px 15px; margin-bottom:15px; border-radius:4px;
  }
  .client-section h3 {
    font-size:12px; font-weight:600; color:#0F7A4A; margin-bottom:8px;
    text-transform:uppercase; letter-spacing:0.5px;
  }
  .client-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:5px 20px; }
  .client-item { font-size:11px; }
  .client-item strong { color:#555; }
  .services-section { margin-bottom:15px; }
  .services-table { width:100%; border-collapse:collapse; font-size:10px; }
  .services-table th {
    background:#0F7A4A; color:white; padding:8px 6px; text-align:left;
    font-weight:600; font-size:10px; text-transform:uppercase; letter-spacing:0.3px;
  }
  .services-table th.center,.services-table td.center { text-align:center; }
  .services-table th.right,.services-table td.right { text-align:right; }
  .services-table td { padding:10px 6px; border-bottom:1px solid #e0e0e0; vertical-align:top; }
  .services-table tr:nth-child(even) td { background:#fafafa; }
  .services-table .descripcion { min-width:280px; line-height:1.4; }
  .services-table th:nth-child(1),.services-table td:nth-child(1) { width:35px; }
  .services-table th:nth-child(2),.services-table td:nth-child(2) { width:50px; }
  .services-table th:nth-child(4),.services-table td:nth-child(4) { width:90px; }
  .services-table th:nth-child(5),.services-table td:nth-child(5) { width:90px; }
  .totals-section { display:flex; justify-content:flex-end; margin-bottom:15px; }
  .totals-box { width:250px; border:1px solid #e0e0e0; border-radius:4px; overflow:hidden; }
  .totals-row { display:flex; justify-content:space-between; padding:8px 12px; border-bottom:1px solid #e0e0e0; font-size:11px; }
  .totals-row:last-child { border-bottom:none; }
  .totals-row.subtotal,.totals-row.iva { background:#f8f9fa; }
  .totals-row.total { background:#0F7A4A; color:white; font-size:14px; font-weight:700; padding:10px 12px; }
  .bottom-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px; }
  .info-box { background:#f8f9fa; border:1px solid #e0e0e0; padding:12px; border-radius:4px; font-size:10px; }
  .info-box h4 { font-size:11px; font-weight:600; color:#0F7A4A; margin-bottom:8px; text-transform:uppercase; }
  .info-box p { margin-bottom:4px; color:#555; }
  .notes-section { background:#fff8e6; border:1px solid #f0c36d; padding:10px 12px; border-radius:4px; margin-bottom:15px; font-size:10px; }
  .notes-section h4 { font-size:11px; font-weight:600; color:#8a6d3b; margin-bottom:5px; }
  .notes-section p { color:#6d5a2e; white-space:pre-wrap; }
  .validity {
    text-align:center; font-size:11px; color:#0F7A4A; font-weight:600;
    padding:8px; background:#e6f5ef; border:1px solid #0F7A4A; border-radius:4px; margin-bottom:10px;
  }
  .footer { text-align:center; font-size:9px; color:#888; padding-top:10px; border-top:1px solid #e0e0e0; }

  /* ── PAGES 2-5: PROPUESTA ───────────────────── */
  .page-break { page-break-before: always; padding-top: 5px; }

  .page-header {
    display:flex; justify-content:space-between; align-items:center;
    padding-bottom:10px; border-bottom:3px solid #0F7A4A; margin-bottom:16px;
  }
  .page-header-left { display:flex; align-items:center; gap:10px; }
  .page-header-company { display:block; font-size:16px; font-weight:700; color:#0F7A4A; line-height:1.1; }
  .page-header-sub { display:block; font-size:9px; color:#666; }
  .page-header-title {
    font-size:14px; font-weight:700; color:white; background:#0F7A4A;
    padding:6px 14px; border-radius:3px; letter-spacing:0.3px;
  }

  .prop-section { margin-bottom:16px; }
  .prop-section-title {
    font-size:13px; font-weight:700; color:#0F7A4A; margin-bottom:8px;
    border-bottom:1px solid #0F7A4A; padding-bottom:4px;
  }
  .prop-text { font-size:10.5px; color:#333; margin-bottom:6px; line-height:1.5; }
  .prop-text-sm { font-size:10px; color:#555; margin-bottom:8px; }

  /* Service modules */
  .modulos-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:10px; }
  .modulo-box {
    border:1px solid #ddd; border-top:3px solid #0F7A4A;
    padding:10px; border-radius:4px; background:#fafafa;
  }
  .modulo-icon { margin-bottom:6px; }
  .modulo-titulo { font-size:11px; font-weight:700; color:#0F7A4A; margin-bottom:5px; }
  .modulo-list { list-style:none; padding:0; }
  .modulo-list li { font-size:10px; color:#444; padding:1px 0; }
  .modulo-list li::before { content:"• "; color:#0F7A4A; }

  /* Objectives table */
  .obj-table { width:100%; border-collapse:collapse; font-size:10px; }
  .obj-table th {
    background:#0F7A4A; color:white; padding:8px 10px;
    text-align:left; font-weight:600; font-size:10px;
  }
  .obj-table td { padding:8px 10px; border:1px solid #e0e0e0; vertical-align:top; }
  .obj-item { margin-bottom:4px; }
  .obj-item::before { content:"▪ "; color:#0F7A4A; font-size:9px; }

  /* Activities lists */
  .prop-ol { margin-left:18px; }
  .prop-ol li { font-size:10.5px; color:#333; padding:3px 0; line-height:1.5; }
  .prop-ul { list-style:none; padding:0; }
  .prop-ul li { font-size:10.5px; color:#333; padding:2px 0; }
  .prop-ul-dot { list-style:disc; margin-left:18px; }
  .prop-ul-dot li { font-size:10.5px; color:#333; padding:2px 0; }

  /* KPI table */
  .kpi-table { width:100%; border-collapse:collapse; font-size:10px; }
  .kpi-th-num { width:30px; background:#0F7A4A; color:white; padding:6px; text-align:center; }
  .kpi-th-item { background:#0F7A4A; color:white; padding:6px 8px; }
  .kpi-section-row { background:#e6f5ef; }
  .kpi-section {
    font-weight:700; font-size:11px; color:#0F7A4A;
    padding:6px 8px; border-top:2px solid #0F7A4A;
  }
  .kpi-num { text-align:center; padding:5px 4px; border-bottom:1px solid #eee; color:#888; }
  .kpi-item { padding:5px 8px; border-bottom:1px solid #eee; }
  .kpi-table tr:nth-child(even) .kpi-item,
  .kpi-table tr:nth-child(even) .kpi-num { background:#fafafa; }

  /* Gantt table */
  .gantt-wrapper { overflow-x:auto; }
  .gantt-table { width:100%; border-collapse:collapse; font-size:9px; }
  .gantt-th-name { background:#0F7A4A; color:white; padding:5px 6px; min-width:180px; }
  .gantt-th-resp { background:#0F7A4A; color:white; padding:5px 6px; min-width:100px; }
  .gantt-th-month {
    background:#0F7A4A; color:white; padding:4px 2px;
    text-align:center; font-size:9px; border-left:1px solid #0a5c38;
  }
  .gantt-th-week {
    background:#1a8c55; color:white; padding:3px 2px;
    text-align:center; font-size:8px; width:28px; border-left:1px solid #0a5c38;
  }
  .gantt-section-row { background:#e6f5ef; }
  .gantt-section {
    font-weight:700; color:#0F7A4A; padding:5px 6px;
    font-size:10px; border-top:1px solid #0F7A4A;
  }
  .gantt-name { padding:4px 6px; border-bottom:1px solid #eee; color:#333; }
  .gantt-resp { padding:4px 6px; border-bottom:1px solid #eee; color:#666; font-size:8.5px; }
  .gantt-cell { width:28px; border-left:1px solid #eee; border-bottom:1px solid #eee; }
  .gantt-active { background:#0F7A4A; }
  .gantt-table tr:nth-child(even) .gantt-name,
  .gantt-table tr:nth-child(even) .gantt-resp { background:#fafafa; }

  /* Signatures */
  .firma-grid { display:grid; grid-template-columns:1fr 1fr; gap:30px; margin-top:24px; }
  .firma-box { text-align:center; padding:12px; }
  .firma-empresa { font-size:11px; font-weight:700; color:#333; margin-bottom:30px; }
  .firma-line { border-top:1px solid #333; margin:0 20px 8px; }
  .firma-nombre { font-size:11px; font-weight:600; color:#0F7A4A; }
  .firma-cargo { font-size:10px; color:#666; margin-top:2px; }
  .firma-contact { font-size:9px; color:#888; margin-top:2px; }

  .prop-footer {
    text-align:center; font-size:9px; color:#888;
    padding-top:8px; border-top:1px solid #e0e0e0; margin-top:16px;
  }

  /* Print fixes */
  @media print {
    @page { size:letter; margin:0.4in; }
    body { font-size:10px; -webkit-print-color-adjust:exact; color-adjust:exact; padding:0; }
    .services-table th, .totals-row.total,
    .page-header-title, .prop-section-title,
    .obj-table th, .kpi-section-row, .kpi-section,
    .gantt-th-name, .gantt-th-resp, .gantt-th-month, .gantt-th-week,
    .gantt-active, .gantt-section-row, .modulo-box { -webkit-print-color-adjust:exact; color-adjust:exact; }
  }
`;

// ─── MAIN GENERATOR ───────────────────────────────────────────────────────────
export const generateQuoteHTML = (data: QuoteData): string => {
  const empresa = data.empresa || defaultEmpresa;
  const validezDias = data.validezDias || 30;
  const fechaVencimiento = data.fechaVencimiento || new Date(data.fecha.getTime() + validezDias * 24 * 60 * 60 * 1000);

  const serviciosRows = data.servicios.map((item, index) => {
    const importe = item.cantidad * item.precioUnitario;
    return `
      <tr>
        <td class="center">${index + 1}</td>
        <td class="center">${item.cantidad}</td>
        <td class="descripcion">${item.descripcion}</td>
        <td class="right">${formatCurrency(item.precioUnitario)}</td>
        <td class="right">${formatCurrency(importe)}</td>
      </tr>`;
  }).join("");

  const propuestaPages = generatePropuestaPages(data);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Propuesta Comercial ${data.folio}</title>
      <style>${STYLES}</style>
    </head>
    <body>

      <!-- ════════════════ PÁGINA 1: COTIZACIÓN ════════════════ -->
      <div class="header">
        <div class="company-info">
          <h1>${empresa.nombre}</h1>
          <div class="subtitle">${empresa.subtitulo}</div>
          <div class="contact">
            ${empresa.direccion}<br>
            Tel: ${empresa.telefono} | ${empresa.email}
            ${empresa.rfc ? `<br>RFC: ${empresa.rfc}` : ''}
          </div>
        </div>
        <div class="logo-center">
          ${TRUCK_SVG}
        </div>
        <div class="quote-header">
          <h2>COTIZACIÓN</h2>
          <div class="folio">${data.folio}</div>
          <div class="dates">
            Fecha: ${formatDate(data.fecha)}<br>
            Vigencia: ${formatDate(fechaVencimiento)}
          </div>
        </div>
      </div>

      <div class="client-section">
        <h3>Datos del Cliente</h3>
        <div class="client-grid">
          <div class="client-item"><strong>Cliente:</strong> ${data.cliente.nombre}</div>
          ${data.cliente.telefono ? `<div class="client-item"><strong>Teléfono:</strong> ${data.cliente.telefono}</div>` : ''}
          ${data.cliente.email ? `<div class="client-item"><strong>Email:</strong> ${data.cliente.email}</div>` : ''}
          ${data.cliente.direccion ? `<div class="client-item"><strong>Dirección:</strong> ${data.cliente.direccion}</div>` : ''}
        </div>
      </div>

      <div class="services-section">
        <table class="services-table">
          <thead>
            <tr>
              <th class="center">NO.</th>
              <th class="center">CANT.</th>
              <th>DESCRIPCIÓN DEL SERVICIO / PRODUCTO</th>
              <th class="right">P. UNITARIO</th>
              <th class="right">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            ${serviciosRows}
          </tbody>
        </table>
      </div>

      <div class="totals-section">
        <div class="totals-box">
          <div class="totals-row subtotal">
            <span>Subtotal:</span>
            <span>${formatCurrency(data.subtotal)}</span>
          </div>
          <div class="totals-row iva">
            <span>IVA (16%):</span>
            <span>${formatCurrency(data.iva)}</span>
          </div>
          <div class="totals-row total">
            <span>TOTAL:</span>
            <span>${formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>

      <div class="bottom-grid">
        <div class="info-box">
          <h4>Condiciones de Pago</h4>
          ${data.condicionesPago ? `<p>${data.condicionesPago}</p>` : `
          <p>• 50% de anticipo para iniciar</p>
          <p>• 50% restante al finalizar</p>
          <p>• Precios en MXN</p>`}
        </div>
        <div class="info-box">
          <h4>Datos Bancarios</h4>
          <p><strong>Beneficiario:</strong> ${empresa.beneficiario}</p>
          <p><strong>Banco:</strong> ${empresa.banco}</p>
          <p><strong>CLABE INTERBANCARIA:</strong> ${empresa.clabe}</p>
          ${empresa.tarjeta ? `<p><strong>Tarjeta:</strong> ${empresa.tarjeta}</p>` : ''}
        </div>
      </div>

      ${data.notas ? `
      <div class="notes-section">
        <h4>Observaciones:</h4>
        <p>${data.notas}</p>
      </div>` : ''}

      <div class="validity">
        Esta cotización tiene una vigencia de ${validezDias} días a partir de la fecha de emisión
      </div>

      <div class="footer">
        <p>${empresa.nombre} | ${empresa.direccion} | Tel: ${empresa.telefono}</p>
      </div>

      ${propuestaPages}

    </body>
    </html>
  `;
};

export const printQuote = (data: QuoteData): void => {
  const html = generateQuoteHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 250);
  }
};

export const downloadQuoteHTML = (data: QuoteData): void => {
  const html = generateQuoteHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PropuestaComercial_${data.folio}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
