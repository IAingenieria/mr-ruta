import type { Metadata } from "next";
import Script from "next/script";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Header, Footer, BotonWhatsApp, JsonLd } from "@/components/ui";
import { SITIO } from "@/content/sitio";
import { org } from "@/lib/seo";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-barlow-condensed", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.dominio),
  title: { default: "Mr Ruta — Software de reparto y venta en ruta", template: "%s" },
  description: "Plataforma de reparto y venta en ruta para distribuidoras con flota propia: ruta ordenada, pedido sugerido, evidencia de entrega y Radar de clientes nuevos.",
  applicationName: "Mr Ruta",
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        {SITIO.gtmId && (
          <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${SITIO.gtmId}');`}</Script>
        )}
        <JsonLd data={org()} />
      </head>
      <body className="min-h-screen flex flex-col">
        {SITIO.gtmId && (
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${SITIO.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BotonWhatsApp texto="Hola, quiero saber más de Mr Ruta." />
      </body>
    </html>
  );
}
