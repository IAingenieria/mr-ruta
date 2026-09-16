import { GIROS } from "@/content/giros";
import { DEFINICIONES, FAQ_GENERAL, SITIO } from "@/content/sitio";
import { zonasMercado, fmt } from "@/lib/zonas";

export const dynamic = "force-static";

// /llms.txt — índice para modelos de lenguaje. Se genera del mismo contenido que las páginas.
export function GET() {
  const d = SITIO.dominio;
  const L: string[] = [];
  L.push("# Mr Ruta", "", `> Mr Ruta es una plataforma de reparto y venta en ruta para distribuidoras con flota propia en México. Tres apps en un solo sistema: Radar (encuentra negocios nuevos cerca de la ruta, verificados uno por uno), app del vendedor (pedido sugerido, devolución y cobro en una pantalla, funciona sin señal) y despacho (pedidos desde Excel, Odoo o Microsip, ruta ordenada, evidencia de entrega con foto, GPS, hora y firma). Cada empresa tiene su propia instancia. Hecha en México por ${SITIO.empresa}.`, "", `Sitio: ${d}`, `Demo con tu giro y tu ciudad en 30 segundos: ${SITIO.demoUrl}`, "");
  L.push("## Páginas principales", "", `- [Inicio](${d}/): qué es Mr Ruta y cifras medidas en campo`, `- [Producto](${d}/producto): las tres apps`, `- [Radar](${d}/producto/radar): clientes nuevos verificados`, `- [App del vendedor](${d}/producto/vendedor): pedido sugerido y devolución`, `- [Despacho y evidencia](${d}/producto/despacho): ruta ordenada y entrega con evidencia`, `- [Planes](${d}/planes)`, `- [Cómo elegir software de reparto](${d}/comparativas): doce preguntas para cualquier proveedor`, `- [Mediciones en campo](${d}/casos)`, `- [Glosario](${d}/glosario)`, `- [Contacto](${d}/contacto)`, "");
  L.push("## Software de reparto por giro", "", ...GIROS.map((g) => `- [${g.keyword.charAt(0).toUpperCase() + g.keyword.slice(1)}](${d}/reparto/${g.slug}): reparto de ${g.producto}`), "");
  L.push("## Mercado por ciudad (negocios contados con registros propios)", "", ...zonasMercado().map((z) => `- [${z.nombre}](${d}/mercado/${z.slug}): ${fmt(z.total)} negocios en la zona de reparto; ${fmt(z.categorias.abarrotes)} abarrotes, ${fmt(z.categorias.restaurantes)} restaurantes y fondas`), "");
  L.push("## Definiciones", "", ...DEFINICIONES.map((x) => `- **${x.termino}**: ${x.def}`), "");
  L.push("## Preguntas frecuentes", "", ...FAQ_GENERAL.filter((f) => !f.r.includes("[")).map((f) => `- **${f.p}** ${f.r}`), "");
  L.push("## Cifras medidas en campo", "", "- Ruta de 15 paradas reales ordenada por Mr Ruta: 13 km en vez de 21.7 (agosto 2026).", "- De 250 negocios de nuestros registros verificados uno por uno contra Google Business, 14.4 % ya habían cerrado; el Radar nunca los muestra.", "- 3,109 tienditas a 5 km de la planta de una panificadora del Estado de México.", "", "## Exclusiones", "", "- /aviso-de-privacidad", "- /api/");
  return new Response(L.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
