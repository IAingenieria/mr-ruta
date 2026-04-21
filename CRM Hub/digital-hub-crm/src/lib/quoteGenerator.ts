// Generador de cotizaciones en formato HTML para impresión/PDF
// Formato formal con múltiples líneas de servicios

export interface QuoteItem {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
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
  // Datos de la empresa (configurables)
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

export const generateQuoteHTML = (data: QuoteData): string => {
  const empresa = data.empresa || defaultEmpresa;
  const validezDias = data.validezDias || 30;
  const fechaVencimiento = data.fechaVencimiento || new Date(data.fecha.getTime() + validezDias * 24 * 60 * 60 * 1000);

  const serviciosRows = data.servicios
    .map(
      (item, index) => {
        const importe = item.cantidad * item.precioUnitario;
        return `
        <tr>
          <td class="center">${index + 1}</td>
          <td class="center">${item.cantidad}</td>
          <td class="descripcion">${item.descripcion}</td>
          <td class="right">${formatCurrency(item.precioUnitario)}</td>
          <td class="right">${formatCurrency(importe)}</td>
        </tr>
      `;
      }
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cotización ${data.folio}</title>
      <style>
        @page { 
          size: letter; 
          margin: 0.4in; 
        }
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          font-size: 11px; 
          line-height: 1.3; 
          color: #1a1a1a;
          background: white;
          width: 100%;
          max-width: 8in;
          margin: 0 auto;
          padding: 15px;
        }
        
        /* Header compacto */
        .header { 
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: flex-start;
          padding-bottom: 12px;
          border-bottom: 3px solid #0F7A4A;
          margin-bottom: 15px;
          gap: 15px;
        }
        .company-info h1 { 
          font-size: 20px; 
          font-weight: 700; 
          color: #0F7A4A;
          margin-bottom: 3px;
        }
        .company-info .subtitle {
          font-size: 11px;
          color: #666;
        }
        .company-info .contact {
          font-size: 10px;
          color: #888;
          margin-top: 5px;
        }
        .logo-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-center img {
          height: 60px;
          width: auto;
          object-fit: contain;
        }
        .quote-header { 
          text-align: right;
        }
        .quote-header h2 { 
          font-size: 22px; 
          color: #0F7A4A;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .quote-header .folio {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        .quote-header .dates {
          font-size: 10px;
          color: #666;
          margin-top: 5px;
        }

        /* Información del cliente */
        .client-section { 
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-left: 4px solid #0F7A4A;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .client-section h3 { 
          font-size: 12px; 
          font-weight: 600; 
          color: #0F7A4A; 
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .client-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 5px 20px;
        }
        .client-item { 
          font-size: 11px;
        }
        .client-item strong { 
          color: #555;
        }

        /* Tabla de servicios - PRINCIPAL */
        .services-section {
          margin-bottom: 15px;
        }
        .services-table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 10px;
        }
        .services-table th { 
          background: #0F7A4A;
          color: white;
          padding: 8px 6px; 
          text-align: left; 
          font-weight: 600; 
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .services-table th.center,
        .services-table td.center { 
          text-align: center; 
        }
        .services-table th.right,
        .services-table td.right { 
          text-align: right; 
        }
        .services-table td { 
          padding: 10px 6px; 
          border-bottom: 1px solid #e0e0e0; 
          vertical-align: top;
        }
        .services-table tr:nth-child(even) td {
          background: #fafafa;
        }
        .services-table .descripcion {
          min-width: 280px;
          line-height: 1.4;
        }
        .services-table th:nth-child(1),
        .services-table td:nth-child(1) { width: 35px; }
        .services-table th:nth-child(2),
        .services-table td:nth-child(2) { width: 50px; }
        .services-table th:nth-child(4),
        .services-table td:nth-child(4) { width: 90px; }
        .services-table th:nth-child(5),
        .services-table td:nth-child(5) { width: 90px; }

        /* Sección de totales */
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }
        .totals-box {
          width: 250px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 11px;
        }
        .totals-row:last-child {
          border-bottom: none;
        }
        .totals-row.subtotal {
          background: #f8f9fa;
        }
        .totals-row.iva {
          background: #f8f9fa;
        }
        .totals-row.total {
          background: #0F7A4A;
          color: white;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 12px;
        }

        /* Sección inferior - Condiciones y Pago */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-box {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          padding: 12px;
          border-radius: 4px;
          font-size: 10px;
        }
        .info-box h4 {
          font-size: 11px;
          font-weight: 600;
          color: #0F7A4A;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .info-box p {
          margin-bottom: 4px;
          color: #555;
        }

        /* Notas */
        .notes-section {
          background: #fff8e6;
          border: 1px solid #f0c36d;
          padding: 10px 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 10px;
        }
        .notes-section h4 {
          font-size: 11px;
          font-weight: 600;
          color: #8a6d3b;
          margin-bottom: 5px;
        }
        .notes-section p {
          color: #6d5a2e;
          white-space: pre-wrap;
        }

        /* Validez */
        .validity {
          text-align: center;
          font-size: 11px;
          color: #0F7A4A;
          font-weight: 600;
          padding: 8px;
          background: #e6f5ef;
          border: 1px solid #0F7A4A;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        /* Footer */
        .footer { 
          text-align: center; 
          font-size: 9px; 
          color: #888; 
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        /* Impresión */
        @media print {
          @page {
            size: letter;
            margin: 0.4in;
          }
          body { 
            font-size: 10px;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            padding: 0;
          }
          .services-table th,
          .totals-row.total {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#0F7A4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
          </svg>
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
          <p>• Precios en ${data.total > 0 ? 'MXN' : 'pesos mexicanos'}</p>
          `}
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
      </div>
      ` : ''}

      <div class="validity">
        Esta cotización tiene una vigencia de ${validezDias} días a partir de la fecha de emisión
      </div>

      <div class="footer">
        <p>${empresa.nombre} | ${empresa.direccion} | Tel: ${empresa.telefono}</p>
      </div>
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
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

export const downloadQuoteHTML = (data: QuoteData): void => {
  const html = generateQuoteHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Cotizacion_${data.folio}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
