import type { NextConfig } from "next";

// Versión «Logística» para www.goodmantech.com.mx (Luis, 30-sep-2026): el sitio completo de Mr Ruta
// se exporta estático y vive dentro del proyecto de Goodman Tech en public/logistica/.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/logistica",
  trailingSlash: true,
  images: { loader: "custom", loaderFile: "./src/lib/cargador-imagen.ts" },
};

export default nextConfig;
