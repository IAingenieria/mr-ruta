// Sitio exportado estático bajo /logistica: next/image no antepone el basePath a rutas de texto,
// así que el cargador lo hace (las imágenes viven en /logistica/img/…). No hay optimizador: la
// anchura sólo varía la liga para que el navegador elija del srcset.
export default function cargadorImagen({ src, width }: { src: string; width: number }) {
  const ruta = src.startsWith("/") && !src.startsWith("/logistica/") ? `/logistica${src}` : src;
  return `${ruta}?w=${width}`;
}
