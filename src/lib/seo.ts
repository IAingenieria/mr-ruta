import type { Metadata } from "next";
import { SITIO } from "@/content/sitio";

type Meta = { title: string; description: string; path: string; noindex?: boolean };

// Title ≤ 60, description 140–155: el preflight lo revisa sobre el HTML generado.
export function meta({ title, description, path, noindex }: Meta): Metadata {
  const url = `${SITIO.dominio}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Mr Ruta", locale: "es_MX", type: "website", images: [{ url: `${SITIO.dominio}/img/logo.png` }] },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const org = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mr Ruta",
  url: SITIO.dominio,
  logo: `${SITIO.dominio}/img/logo.png`,
  parentOrganization: { "@type": "Organization", name: SITIO.empresa },
  areaServed: "MX",
});

export const software = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mr Ruta",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Android, iOS, Web",
  url: SITIO.dominio,
  description: "Plataforma de reparto y venta en ruta para distribuidoras con flota propia: Radar de clientes nuevos, app del vendedor con pedido sugerido y devolución, despacho con ruta ordenada y evidencia de entrega.",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "MXN" },
});

export const faqPage = (faq: { p: string; r: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
});

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITIO.dominio}${it.path}` })),
});

export const service = (name: string, description: string, path: string, area?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name, description, url: `${SITIO.dominio}${path}`,
  provider: { "@type": "Organization", name: "Mr Ruta" },
  serviceType: "Software de reparto y venta en ruta",
  areaServed: area ? { "@type": "City", name: area } : { "@type": "Country", name: "México" },
});

export const dataset = (zona: string, path: string, variables: string[]) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Negocios por tipo en ${zona}`,
  description: `Conteo de negocios por tipo en la zona de reparto de ${zona} (radio de 25 km). ${SITIO.fuenteRegistros}.`,
  url: `${SITIO.dominio}${path}`,
  creator: { "@type": "Organization", name: "Mr Ruta" },
  dateModified: "2026-09",
  spatialCoverage: { "@type": "Place", name: `${zona}, México` },
  variableMeasured: variables,
  license: `${SITIO.dominio}/aviso-de-privacidad`,
});
