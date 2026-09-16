import { SITIO } from "@/content/sitio";

export const dynamic = "force-static";

// Índice de sitemaps: Next genera /sitemap/<id>.xml pero no el índice en /sitemap.xml.
export function GET() {
  const ids = ["nucleo", "giros", "geo", "mercado"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    ids.map((id) => `  <sitemap><loc>${SITIO.dominio}/sitemap/${id}.xml</loc><lastmod>2026-09-16</lastmod></sitemap>`).join("\n") +
    `\n</sitemapindex>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
