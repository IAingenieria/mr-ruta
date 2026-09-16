import type { MetadataRoute } from "next";
import { SITIO } from "@/content/sitio";

// Buscadores y crawlers de IA pasan; lo que no es público (api, previews) no.
export default function robots(): MetadataRoute.Robots {
  const bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bytespider", "CCBot", "Amazonbot", "meta-externalagent"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      ...bots.map((b) => ({ userAgent: b, allow: "/" })),
    ],
    sitemap: [`${SITIO.dominio}/sitemap.xml`, `${SITIO.dominio}/sitemap/nucleo.xml`, `${SITIO.dominio}/sitemap/giros.xml`, `${SITIO.dominio}/sitemap/geo.xml`, `${SITIO.dominio}/sitemap/mercado.xml`],
    host: SITIO.dominio,
  };
}
