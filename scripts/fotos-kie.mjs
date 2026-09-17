// Genera las fotografías del sitio con KIE (nano-banana-pro) usando el logo oficial
// como referencia para gorras, playeras y camiones. Uso interno; la llave vive en
// el proyecto de videos (.env.local de tvmultimedia), no en este repo.
//   node scripts/fotos-kie.mjs            → genera todas las que falten en public/img/fotos/
//   node scripts/fotos-kie.mjs hero       → solo esa
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV = "C:/Users/Dell/Documents/CLAUDE DESKTOP/VIDEOS TVMultiedia/tvmultimedia/.env.local";
const KEY = readFileSync(ENV, "utf8").split("\n").find((l) => l.startsWith("KIE_API_KEY="))?.split("=")[1]?.trim();
if (!KEY) throw new Error("Sin KIE_API_KEY");
const BASE = "https://api.kie.ai/api/v1/jobs";
const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const LOGO = "https://www.mr-ruta.com/img/logo.png";
const OUT = join(RAIZ, "public", "img", "fotos");
mkdirSync(OUT, { recursive: true });

const MARCA = "The brand logo from the reference image (four diagonal stripes in orange, dark orange and gray with the wordmark MR RUTA) is printed cleanly and legibly";
const ESTILO = "Photorealistic commercial photograph, Mexico, natural daylight, shallow depth of field, clean modern corporate look, sharp, high detail. No other text, no watermark, no other brand names.";

const FOTOS = {
  hero: { ar: "3:4", prompt: `${ESTILO} A smiling Latin American delivery driver in his thirties wearing a black polo shirt and a black cap; ${MARCA} on the cap and on the polo chest. He holds a tablet with both hands, standing on a sunny street of a Mexican city with a colonial cathedral tower softly blurred in the background; behind him a white box truck with ${MARCA} large on its side. Warm orange accents.` },
  giro: { ar: "3:4", prompt: `${ESTILO} A Latin American delivery driver wearing a black cap and black polo with ${MARCA} on them, carrying a cardboard box out of the back of a white delivery van in front of a small Mexican neighborhood grocery store (tienda de abarrotes) with colorful shelves; morning light, candid.` },
  flota: { ar: "16:9", prompt: `${ESTILO} Loading dock of a distribution warehouse at dawn with a fleet of five white box trucks parked in a row, each with ${MARCA} large on the cargo box side; a worker in a black cap walks between them; gray corrugated warehouse wall; orange safety details.` },
  dolor: { ar: "3:4", prompt: `${ESTILO} A confident Latin American delivery driver in a black cap and black polo with ${MARCA} on them, smiling while looking at a tablet, standing inside a warehouse between stacks of cardboard boxes and shrink-wrapped pallets; bright industrial light.` },
  entrega: { ar: "3:4", prompt: `${ESTILO} A Latin American delivery driver in a black cap and black polo with ${MARCA} on them handing a tablet to a Mexican shopkeeper who signs on the screen with her finger at the counter of a small grocery store; boxes of product on the counter; friendly, candid.` },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function poll(id, label) {
  for (let i = 0; i < 120; i++) {
    await sleep(5000);
    const d = await (await fetch(`${BASE}/recordInfo?taskId=${id}`, { headers: H })).json();
    const st = d.data?.state;
    if (st === "success") return JSON.parse(d.data.resultJson).resultUrls[0];
    if (st === "fail") throw new Error(`${label}: ${d.data.failMsg || d.data.failCode}`);
  }
  throw new Error(`${label}: timeout`);
}
async function generar(nombre) {
  const f = FOTOS[nombre]; const dest = join(OUT, `${nombre}.png`);
  if (existsSync(dest)) { console.log(`= ${nombre} ya existe`); return; }
  const r = await (await fetch(`${BASE}/createTask`, { method: "POST", headers: H, body: JSON.stringify({ model: "nano-banana-pro", input: { prompt: f.prompt, image_input: [LOGO], aspect_ratio: f.ar, resolution: "2K", output_format: "png" } }) })).json();
  if (r.code !== 200) throw new Error(`${nombre}: ${r.code} ${r.msg}`);
  console.log(`+ ${nombre} → ${r.data.taskId}`);
  const url = await poll(r.data.taskId, nombre);
  writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`✓ ${nombre}.png`);
}
const cuales = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FOTOS);
const res = await Promise.allSettled(cuales.map(generar));
res.forEach((x, i) => { if (x.status === "rejected") console.error(`✗ ${cuales[i]}: ${x.reason.message}`); });
