// Auditoría SEO sobre el sitio servido (npm run start) — recorre todos los sitemaps.
// Reglas: 1 h1 · title ≤ 60 · description 140–155 · canonical = URL propia · JSON-LD ≥ 1 ·
// sin palabras prohibidas · sin "[" de placeholders en páginas indexables.
const BASE = process.argv[2] || "http://localhost:3050";
const DOMINIO = "https://www.mr-ruta.com";
const secciones = ["nucleo", "giros", "geo", "mercado"];
const PROHIBIDAS = /\binegi\b|\bdenue\b|censo econ[oó]mico/i;

const urls = [];
for (const s of secciones) {
  const xml = await (await fetch(`${BASE}/sitemap/${s}.xml`)).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1].replace(DOMINIO, ""));
}
let fallas = 0, avisos = 0;
const cuenta = { paginas: 0 };
for (const path of urls) {
  const r = await fetch(BASE + path);
  const h = await r.text();
  cuenta.paginas++;
  const errs = [], warn = [];
  if (r.status !== 200) errs.push(`HTTP ${r.status}`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) errs.push(`h1=${h1}`);
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; if (!title) errs.push("sin title"); else if (title.length > 60) warn.push(`title ${title.length}`);
  const desc = (h.match(/name="description" content="([^"]*)"/) || [])[1] || ""; if (!desc) errs.push("sin description"); else if (desc.length < 140 || desc.length > 155) warn.push(`desc ${desc.length}`);
  const can = (h.match(/rel="canonical" href="([^"]*)"/) || [])[1] || ""; if (can !== DOMINIO + path && !(path === "/" && can === DOMINIO)) errs.push(`canonical=${can}`);
  if (!/application\/ld\+json/.test(h)) errs.push("sin JSON-LD");
  if (PROHIBIDAS.test(h)) errs.push("PALABRA PROHIBIDA");
  const ph = h.match(/\[(N|TIEMPO DE ARRANQUE|PLAN Y PRECIO|Ciudad|DOMICILIO FISCAL|CORREO DE PRIVACIDAD|FECHA)[^\]]*\]/g); if (ph) warn.push(`placeholders: ${[...new Set(ph)].join(" ")}`);
  if (errs.length) { fallas++; console.log(`FALLA ${path}: ${errs.join(" · ")}`); }
  if (warn.length) { avisos++; console.log(`aviso ${path}: ${warn.join(" · ")}`); }
}
console.log(`\n${cuenta.paginas} páginas · ${fallas} con falla · ${avisos} con aviso`);
process.exit(fallas ? 1 : 0);
