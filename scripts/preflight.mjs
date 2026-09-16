// Guardián de build del sitio de Mr Ruta. Corre en `prebuild` y en CI.
// Regla de negocio (Luis, 2026-09-15): la fuente pública de los registros NUNCA se nombra
// en nada que vea un cliente, un buscador o una IA. Si aparece en contenido, el build falla.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CARPETAS = ["src", "public"];
const EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".txt", ".css", ".html", ".svg"]);
// Palabras prohibidas en copy público (case-insensitive). Los pipelines internos no viven en este repo.
const PROHIBIDAS = [/\binegi\b/i, /\bdenue\b/i, /censo econ[oó]mico/i, /padr[oó]n oficial/i, /informaci[oó]n p[uú]blica de unidades/i];
// Este archivo y el README son los únicos que pueden mencionar la regla por su nombre.
const EXENTOS = new Set(["scripts/preflight.mjs"]);

const hallazgos = [];
function barrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const rel = p.slice(RAIZ.length).replace(/\\/g, "/").replace(/^\//, "");
    if (n === "node_modules" || n === ".next") continue;
    if (statSync(p).isDirectory()) { barrer(p); continue; }
    if (!EXT.has(extname(n)) || EXENTOS.has(rel)) continue;
    const s = readFileSync(p, "utf8");
    s.split("\n").forEach((linea, i) => {
      for (const re of PROHIBIDAS) if (re.test(linea)) hallazgos.push(`${rel}:${i + 1}: ${linea.trim().slice(0, 110)}`);
    });
  }
}
for (const c of CARPETAS) barrer(join(RAIZ, c));

// Datos que no deben publicarse vacíos
const sitio = readFileSync(join(RAIZ, "src/content/sitio.ts"), "utf8");
const avisos = [];
if (!process.env.NEXT_PUBLIC_WHATSAPP) avisos.push("NEXT_PUBLIC_WHATSAPP no definido: los botones de WhatsApp llevan a /contacto.");
if (!process.env.NEXT_PUBLIC_GTM_ID) avisos.push("NEXT_PUBLIC_GTM_ID no definido: sin medición.");
if (/\[TIEMPO DE ARRANQUE\]/.test(sitio)) avisos.push("FAQ con [TIEMPO DE ARRANQUE] sin definir.");

if (hallazgos.length) {
  console.error("\nPREFLIGHT: palabras prohibidas en contenido público:\n" + hallazgos.map((h) => "  " + h).join("\n"));
  process.exit(1);
}
console.log(`preflight ok: ${CARPETAS.join(", ")} sin menciones prohibidas.`);
for (const a of avisos) console.warn("  aviso: " + a);
