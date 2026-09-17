"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GIROS } from "@/content/giros";
import { CIFRAS, SITIO } from "@/content/sitio";
import { Flecha, Check, Telefono } from "@/components/ui";

// Demo guiada en 5 pasos. Los pasos 2–5 alimentan al wizard REAL del worker
// (POST /api/demo/crear): al final el prospecto recibe su demo de verdad, con
// las tres apps corriendo — no una simulación.
const PASOS = ["Inicio", "Giro", "Tamaño", "El dolor", "Tu empresa"];

const ESTADOS = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Coahuila", "Colima", "Chiapas", "Chihuahua", "Ciudad de México", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Estado de México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"];

// Slug del sitio → rutapack del worker (lo que no tiene pack propio usa el genérico).
const PACK: Record<string, string> = { "panaderia": "panaderia", "tortilleria": "tortilleria", "helados-y-hielo": "helados", "carnicos-y-pollo": "carnicos", "congelados": "congelados", "materiales-de-construccion": "construccion" };

const TAMANOS = [
  { id: "1", t: "1", s: "unidad", n: 1 }, { id: "2-5", t: "2 – 5", s: "unidades", n: 2 },
  { id: "6-10", t: "6 – 10", s: "unidades", n: 3 }, { id: "10+", t: "+10", s: "unidades", n: 5 },
];

// Dolor → la app con la que se abre la demo.
const DOLORES = [
  { id: "vendedores", t: "Saber dónde están mis vendedores", app: "/despacho", icono: "pin" },
  { id: "rapido", t: "Entregar más rápido", app: "/ruta", icono: "rayo" },
  { id: "evidencia", t: "Tener evidencia de cada entrega", app: "/chofer", icono: "doc" },
  { id: "devoluciones", t: "Controlar devoluciones", app: "/vendedor", icono: "caja" },
  { id: "kilometros", t: "Reducir kilómetros", app: "/ruta", icono: "gas" },
  { id: "clientes", t: "Conseguir nuevos clientes", app: "", icono: "gente" },
  { id: "todo", t: "Todo lo anterior", app: "", icono: "grid", sub: "Quiero la demo completa" },
];

// Icono por giro (lineales, un solo trazo; nada de emoji).
const ICONO_GIRO: Record<string, string> = {
  "panaderia": "pan", "tortilleria": "tortilla", "helados-y-hielo": "helado", "carnicos-y-pollo": "carne", "frutas-y-verduras": "fruta",
  "lacteos-y-cremeria": "leche", "congelados": "nieve", "abarrotes-mayoreo": "caja", "botanas": "botana", "bebidas-y-agua": "gota",
  "gas-lp": "flama", "refacciones-y-autopartes": "llave", "limpieza-y-quimicos": "spray", "materiales-de-construccion": "ladrillo",
};

const ICONOS: Record<string, React.ReactNode> = {
  pin: <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  rayo: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  doc: <path d="M7 3h7l5 5v13H7zM14 3v5h5M9 14l2 2 4-4" />,
  caja: <path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" />,
  gas: <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M5 21h10M7 8h6M15 10l3 2v6a1.5 1.5 0 0 0 3 0v-7l-3-3" />,
  gente: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />,
  grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  camion: <path d="M1 7h12v9H1zM13 10h5l3 3v3h-8zM5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  escudo: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  monitor: <path d="M3 4h18v12H3zM8 20h8M12 16v4" />,
  chat: <path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.2-4.3A8 8 0 1 1 21 12z" />,
  candado: <path d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" />,
  reloj: <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5l3 2M9 2h6" />,
  barras: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  pan: <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2v6H6v-6a2 2 0 0 1-2-2zM9 13v3M12 13v3M15 13v3" />,
  tortilla: <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 10h.01M14 9h.01M11 14h.01M15 13h.01M8 14h.01" />,
  helado: <path d="M8 10a4 4 0 1 1 8 0M8 10h8l-4 11zM6 8a3 3 0 0 1 3-3M15 5a3 3 0 0 1 3 3" />,
  carne: <path d="M4 13c0-4 3-7 8-7 4 0 7 2 7 5s-2 4-4 5c-2 1-2 4-5 4s-6-3-6-7zM13 11a2 2 0 1 0 0 .01" />,
  fruta: <path d="M12 7c-3-2-7 0-7 5s3 9 5 9 1-1 2-1 1 1 2 1 5-4 5-9-4-7-7-5zM12 7V4M12 4c2 0 3-1 3-1" />,
  leche: <path d="M9 3h6v3l2 3v12H7V9l2-3zM7 13h10" />,
  nieve: <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2" />,
  botana: <path d="M7 3h10l2 6-1 12H6L5 9zM9 3l-1 6M15 3l1 6M5 9h14" />,
  gota: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  flama: <path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-6-3-8 0 4-5 6-5 12a7 7 0 0 0 7 7z" />,
  llave: <path d="M14 7a4 4 0 0 1 5 5l-2 2-4-4zM17 12l-9 9-3-3 9-9M3 21l3-3" />,
  spray: <path d="M9 9h6v12H9zM10 9V6h4v3M10 6h3M13 4h4M17 4l2-2M17 4l2 2M17 4h2" />,
  ladrillo: <path d="M3 6h18v4H3zM3 14h18v4H3zM8 10v4M16 10v4M12 6v4M12 14v4" />,
};
const Icono = ({ n, size = 28, color = "#1F2224", w = 1.8 }: { n: string; size?: number; color?: string; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONOS[n]}</svg>
);

type Datos = { giro: string; tamano: string; dolor: string; nombre: string; empresa: string; estado: string; ciudad: string; choferes: string[]; whatsapp: string };

// Panel visual derecho, como los mockups: foto con corte diagonal naranja,
// nota manuscrita y tarjeta de refuerzo encima de la foto.
function PanelFoto({ foto, alt, nota, tarjeta, lista, hijo }: { foto: string; alt: string; nota: string; tarjeta?: { icono: string; t: string; s?: string }; lista?: string[]; hijo?: React.ReactNode }) {
  return (
    <aside className="relative min-h-[460px] md:min-h-[640px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-naranja" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%)" }} aria-hidden="true" />
      <div className="absolute inset-0" style={{ clipPath: "polygon(6% 0, 100% 0, 100% 100%, 26% 100%)" }}>
        <Image src={foto} alt={alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" priority />
      </div>
      <span className="absolute top-6 right-6 max-w-[240px] text-right font-caveat text-[30px] md:text-[36px] leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-[-4deg]">{nota}</span>
      {tarjeta && (
        <div className="absolute bottom-6 right-6 left-[30%] md:left-auto md:w-[340px] card p-4 md:p-5 flex gap-3 items-start shadow-2xl">
          <span className="w-11 h-11 rounded-full bg-naranja flex items-center justify-center shrink-0"><Icono n={tarjeta.icono} size={22} color="#1F2224" w={2} /></span>
          <span className="flex flex-col gap-0.5"><span className="text-[15px] font-bold text-asfalto leading-snug">{tarjeta.t}</span>{tarjeta.s && <span className="text-[13px] text-carbon">{tarjeta.s}</span>}</span>
        </div>
      )}
      {lista && (
        <ul className="absolute bottom-6 right-6 flex flex-col gap-2.5">
          {lista.map((t) => <li key={t} className="flex items-center gap-3 bg-white/95 rounded-full pl-1 pr-4 py-1 text-[14px] font-semibold text-asfalto shadow-lg"><span className="w-8 h-8 rounded-full bg-naranja flex items-center justify-center"><Icono n="barras" size={16} color="#1F2224" w={2.4} /></span>{t}</li>)}
        </ul>
      )}
      {hijo}
    </aside>
  );
}

export function DemoWizard({ giroInicial, ciudadInicial }: { giroInicial?: string; ciudadInicial?: string }) {
  const [paso, setPaso] = useState(1);
  const [d, setD] = useState<Datos>({ giro: giroInicial && GIROS.some((g) => g.slug === giroInicial) ? giroInicial : "", tamano: "", dolor: "", nombre: "", empresa: "", estado: "", ciudad: ciudadInicial || "", choferes: ["", "", ""], whatsapp: "" });
  const [estado, setEstado] = useState<"idle" | "creando" | "listo" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [res, setRes] = useState<{ code: string; pedidos: number } | null>(null);
  const pct = [0, 0, 25, 50, 75, 100][paso];
  const set = (k: keyof Datos, v: string | string[]) => setD((x) => ({ ...x, [k]: v }));
  const giro = useMemo(() => GIROS.find((g) => g.slug === d.giro), [d.giro]);
  const dolor = useMemo(() => DOLORES.find((x) => x.id === d.dolor), [d.dolor]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [paso]);

  const puede = paso === 1 || (paso === 2 && d.giro) || (paso === 3 && d.tamano) || (paso === 4 && d.dolor) ||
    (paso === 5 && d.nombre.trim() && d.empresa.trim() && d.estado && d.choferes.some((c) => c.trim()));

  async function crear() {
    setEstado("creando"); setMsg("");
    const n = TAMANOS.find((t) => t.id === d.tamano)?.n || 1;
    const unidades = Array.from({ length: n }, (_, i) => ({ numero: `U0${i + 1}`, descripcion: "Camión de reparto" }));
    try {
      const r = await fetch(`${SITIO.demoUrl}/api/demo/crear`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa: d.empresa.trim(), giro: PACK[d.giro] || "generico", estado: d.estado, municipio: d.ciudad.trim() || d.estado, unidades, choferes: d.choferes.map((c) => c.trim()).filter(Boolean) }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setRes({ code: j.code, pedidos: j.pedidos });
      fetch(SITIO.leadsEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo: "demo", nombre: d.nombre.trim(), empresa: d.empresa.trim(), giro: d.giro, ciudad: `${d.ciudad.trim() || d.estado}, ${d.estado}`, whatsapp: d.whatsapp.trim(), correo: "", mensaje: `Dolor: ${dolor?.t || ""} · Unidades: ${d.tamano} · Demo: ${SITIO.demoUrl}/d/${j.code}`, pagina: "/demo" }) }).catch(() => {});
      try { (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "demo_creada", giro: d.giro, dolor: d.dolor }); } catch {}
      setEstado("listo"); setPaso(6);
    } catch (e) {
      setEstado("error"); setMsg("No se pudo crear la demo en este momento. Escríbenos por WhatsApp y te la mandamos hoy."); console.error(e);
    }
  }

  const Stepper = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <ol className="flex items-start flex-1">
        {PASOS.map((p, i) => {
          const n = i + 1; const hecho = paso > n; const activo = paso === n;
          return (
            <li key={p} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 w-[64px]">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold border-2 ${hecho || activo ? "bg-naranja border-naranja text-white" : "border-plata text-gris bg-white"}`}>{hecho ? "✓" : n}</span>
                <span className={`text-[12px] ${activo ? "font-bold text-asfalto" : "text-gris"}`}>{p}</span>
              </div>
              {i < PASOS.length - 1 && <span className={`h-0.5 flex-1 -mt-5 ${paso > n ? "bg-naranja" : "bg-plata-2"}`} />}
            </li>
          );
        })}
      </ol>
      <Progreso />
    </div>
  );

  const Progreso = () => (
    <div className="card px-4 py-2.5 flex items-center gap-3 text-[14px] md:w-[300px]">
      <span className="font-semibold text-asfalto shrink-0">Tu demo:</span>
      <span className="flex-1 h-2.5 bg-plata-2 rounded-full overflow-hidden"><span className="block h-full bg-naranja rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 4)}%` }} /></span>
      <span className="font-bold text-asfalto tabular-nums">{pct}%</span>
    </div>
  );

  const Tarjeta = ({ activa, onClick, children, className = "" }: { activa: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button type="button" onClick={onClick} aria-pressed={activa} className={`relative text-left card p-5 md:p-6 flex gap-4 items-center min-h-[92px] transition-colors hover:border-naranja focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja ${activa ? "border-naranja border-2 bg-[#FFF6EA]" : ""} ${className}`}>
      {activa && <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-naranja text-white flex items-center justify-center text-[14px] font-bold">✓</span>}
      {children}
    </button>
  );

  const Nav = ({ siguiente, textoSig = "Siguiente" }: { siguiente: () => void; textoSig?: string }) => (
    <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6">
      {paso > 1 ? <button type="button" onClick={() => setPaso(paso - 1)} className="btn btn-linea !min-h-[56px]">← Regresar</button> : <span />}
      <button type="button" disabled={!puede || estado === "creando"} onClick={siguiente} className="btn btn-naranja !min-h-[56px] md:!px-10 text-[17px] disabled:opacity-50 disabled:cursor-not-allowed">{estado === "creando" ? "Creando tu demo…" : textoSig} {estado !== "creando" && <Flecha />}</button>
    </div>
  );

  const H = ({ eyebrow, titulo, sub }: { eyebrow: string; titulo: React.ReactNode; sub: string }) => (
    <div className="flex flex-col gap-3">
      <span className="eyebrow text-naranja-2">{eyebrow}</span>
      <h1 className="display text-[40px] md:text-[64px] text-asfalto">{titulo}</h1>
      <p className="text-[17px] md:text-[19px] leading-relaxed text-carbon max-w-[640px]">{sub}</p>
    </div>
  );

  const input = "h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] text-asfalto bg-white w-full";
  const label = "flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon";

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-6 md:py-8 flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="hidden md:inline text-[13px] font-semibold uppercase tracking-wider text-carbon">Rutas ordenadas · Pedidos sugeridos · Entregas con evidencia</span>
        <div className="flex flex-wrap gap-5 text-[14px] text-carbon">
          {[["monitor", "Sin instalar nada"], ["chat", "Sin hablar con un vendedor"], ["escudo", "Tus datos siempre seguros"]].map(([i, t]) => <span key={t} className="flex items-center gap-2"><Icono n={i} size={22} color="#D86018" /> {t}</span>)}
        </div>
      </div>
      {paso <= 5 && paso > 1 && <Stepper />}

      <div className={`grid gap-8 md:gap-12 ${paso === 6 ? "" : "md:grid-cols-[1.1fr_0.9fr]"} md:items-start`}>
        <div className="flex flex-col gap-7">
          {paso === 1 && (
            <>
              <H eyebrow="Demo interactiva" titulo={<>Construyamos tu empresa en <span className="text-naranja">Mr Ruta</span></>} sub="No necesitas instalar nada ni hablar con un vendedor. Responde cuatro cosas y mira cómo funcionaría una ruta real de tu negocio: con tu giro, tu ciudad y tus choferes." />
              <button type="button" onClick={() => setPaso(2)} className="btn btn-naranja !min-h-[66px] text-[19px] md:text-[21px] uppercase tracking-wide w-full sm:w-auto sm:!px-14">Empezar mi demo <Flecha /></button>
              <Progreso />
              <ul className="grid sm:grid-cols-3 gap-4 text-[15px] text-carbon">
                {[["reloj", `En menos de ${CIFRAS.demoSegundos} segundos`], ["barras", "Con pedidos reales de tu giro"], ["pin", "Diseñado para distribuidoras como la tuya"]].map(([i, t]) => <li key={t} className="flex gap-3 items-center"><span className="w-10 h-10 rounded-full bg-[#FFF6EA] flex items-center justify-center shrink-0"><Icono n={i} size={20} color="#D86018" w={2} /></span><span>{t}</span></li>)}
              </ul>
            </>
          )}
          {paso === 2 && (
            <>
              <H eyebrow="Conozcamos tu negocio" titulo="¿Qué distribuye tu empresa?" sub="Elige el giro principal: la demo trae los productos, los tipos de cliente y los pasos de entrega de ese giro." />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {GIROS.map((g) => (
                  <Tarjeta key={g.slug} activa={d.giro === g.slug} onClick={() => set("giro", g.slug)} className="!flex-col !items-center !gap-2.5 !min-h-[124px] !p-4 text-center">
                    <Icono n={ICONO_GIRO[g.slug]} size={34} color={d.giro === g.slug ? "#D86018" : "#1F2224"} />
                    <span className="text-[14px] md:text-[15px] font-bold text-asfalto leading-snug">{g.nombre}</span>
                  </Tarjeta>
                ))}
                <Tarjeta activa={d.giro === "otro"} onClick={() => set("giro", "otro")} className="!flex-col !items-center !gap-2.5 !min-h-[124px] !p-4 text-center"><Icono n="caja" size={34} color={d.giro === "otro" ? "#D86018" : "#1F2224"} /><span className="text-[15px] font-bold text-asfalto">Otro giro</span></Tarjeta>
              </div>
              <Nav siguiente={() => setPaso(3)} />
            </>
          )}
          {paso === 3 && (
            <>
              <H eyebrow="Tu operación en marcha" titulo="¿Cuántas unidades salen a reparto cada día?" sub="Con esto armamos la flota de tu demo: tus unidades, tus choferes y una ruta del tamaño de tu operación." />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TAMANOS.map((t) => (
                  <Tarjeta key={t.id} activa={d.tamano === t.id} onClick={() => set("tamano", t.id)} className="!flex-col !items-center !gap-2 !min-h-[160px] text-center">
                    <span className="flex gap-0.5">{Array.from({ length: Math.min(t.n, 4) }).map((_, i) => <Icono key={i} n="camion" size={26} />)}</span>
                    <span className="display text-[32px] text-asfalto">{t.t}</span>
                    <span className="text-[14px] text-carbon">{t.s}</span>
                  </Tarjeta>
                ))}
              </div>
              <Nav siguiente={() => setPaso(4)} />
            </>
          )}
          {paso === 4 && (
            <>
              <H eyebrow="Tu mayor reto hoy" titulo="¿Qué te gustaría controlar mejor?" sub="Con esto sabemos con qué app abrir tu demo. No es una encuesta: es lo primero que vas a ver funcionando." />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOLORES.map((x) => (
                  <Tarjeta key={x.id} activa={d.dolor === x.id} onClick={() => set("dolor", x.id)} className={x.id === "todo" ? "sm:col-span-2 lg:col-span-3 !min-h-[80px]" : ""}>
                    <Icono n={x.icono} color={d.dolor === x.id ? "#D86018" : "#1F2224"} />
                    <span className="flex flex-col"><span className="text-[15px] font-bold text-asfalto leading-snug">{x.t}</span>{x.sub && <span className="text-[13px] text-carbon">{x.sub}</span>}</span>
                  </Tarjeta>
                ))}
              </div>
              <Nav siguiente={() => setPaso(5)} />
            </>
          )}
          {paso === 5 && (
            <>
              <H eyebrow="Último paso" titulo="Ponle tu nombre a la demo" sub="Con esto la demo dice el nombre de tu empresa, reparte en tu ciudad y saluda a tus choferes por su nombre." />
              <div className="grid sm:grid-cols-2 gap-4">
                <label className={label}>Tu nombre<input className={input} value={d.nombre} onChange={(e) => set("nombre", e.target.value)} autoComplete="name" /></label>
                <label className={label}>Empresa<input className={input} value={d.empresa} onChange={(e) => set("empresa", e.target.value)} autoComplete="organization" /></label>
                <label className={label}>Estado<select className={input} value={d.estado} onChange={(e) => set("estado", e.target.value)}><option value="">Elige tu estado</option>{ESTADOS.map((e) => <option key={e}>{e}</option>)}</select></label>
                <label className={label}>Ciudad o municipio<input className={input} value={d.ciudad} onChange={(e) => set("ciudad", e.target.value)} placeholder="Donde está tu bodega" /></label>
                <label className={label}>WhatsApp (opcional)<input className={input} value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="tel" placeholder="Para mandarte la liga" /></label>
              </div>
              <div className="flex flex-col gap-2">
                <span className={label}>Tus choferes (al menos uno)</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  {d.choferes.map((c, i) => <input key={i} className={input} value={c} placeholder={["Chofer 1", "Chofer 2", "Chofer 3"][i]} onChange={(e) => { const a = [...d.choferes]; a[i] = e.target.value; set("choferes", a); }} />)}
                </div>
              </div>
              {estado === "error" && <p role="alert" className="text-[15px] font-semibold text-naranja-2">{msg}</p>}
              <Nav siguiente={crear} textoSig="Crear mi demo" />
            </>
          )}
          {paso === 6 && res && (
            <div className="flex flex-col gap-7">
              <H eyebrow="Tu demo está corriendo" titulo={<>¡Listo, {d.nombre.trim().split(" ")[0]}! Esta podría ser tu operación mañana.</>} sub={`${d.empresa} ya tiene ${res.pedidos} pedidos de ${giro ? giro.producto.split(",")[0] : "tu giro"} en ${d.ciudad.trim() || d.estado}, ${TAMANOS.find((t) => t.id === d.tamano)?.n || 1} unidad(es) y a ${d.choferes.filter((c) => c.trim()).join(", ")} en la ruta. La liga vive 30 días.`} />
              <div className="grid md:grid-cols-[1fr_0.9fr] gap-8 items-start">
                <div className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <a href={`${SITIO.demoUrl}${dolor?.app ? `${dolor.app}?suc=${res.code}` : `/d/${res.code}`}`} target="_blank" rel="noopener" className="btn btn-naranja !min-h-[64px] text-[18px]">{dolor?.app ? `Abrir: ${dolor.t.toLowerCase()}` : "Abrir mi demo completa"} <Flecha /></a>
                    <a href={`${SITIO.demoUrl}/d/${res.code}`} target="_blank" rel="noopener" className="btn btn-oscuro !min-h-[64px] text-[18px]">Ver las tres apps</a>
                  </div>
                  <div className="card p-6 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${SITIO.demoUrl}/d/${res.code}`)}`} alt="Código QR de tu demo" width={160} height={160} className="rounded-md" />
                    <div className="flex flex-col gap-2">
                      <span className="eyebrow text-carbon">Ábrela en el celular del vendedor</span>
                      <span className="text-[16px] text-asfalto break-all font-semibold">{SITIO.demoUrl}/d/{res.code}</span>
                      <span className="text-[14px] text-carbon">Escanea el código o copia la liga. Cada chofer entra con su nombre; los pedidos se reponen solos con el botón «Sincronizar».</span>
                    </div>
                  </div>
                  <div className="bg-asfalto rounded-2xl p-7 md:p-9 flex flex-col gap-5">
                    <span className="display text-[30px] md:text-[36px] text-white">Ahora hagámoslo con tu ruta real.</span>
                    <span className="text-[15px] text-plata">Carga tus clientes y tus productos y en una semana estás repartiendo con Mr Ruta.</span>
                    <Link href="/contacto" className="btn btn-naranja !min-h-[58px] self-start">Cargar mi primera ruta <Flecha /></Link>
                  </div>
                </div>
                <PanelFoto foto="/img/fotos/entrega.jpg" alt="Entrega con firma en tablet en una tienda" nota="Tu operación, en tus manos" tarjeta={{ icono: "doc", t: "Cada entrega con foto, hora, ubicación y firma", s: "Así se ve en la app del chofer de tu demo." }} />
              </div>
            </div>
          )}
        </div>

        {paso === 1 && (
          <PanelFoto foto="/img/fotos/hero.jpg" alt="Repartidor de Mr Ruta con tablet frente a su camión" nota="Tu operación, en tus manos" hijo={
            <div className="absolute bottom-6 right-6 w-[190px] md:w-[220px] drop-shadow-2xl"><Telefono src="/img/app-ruta.jpg" alt="Ruta del día en la app" w={200} /></div>
          } />
        )}
        {paso === 2 && <PanelFoto foto="/img/fotos/giro.jpg" alt="Repartidor bajando una caja frente a una tienda de abarrotes" nota="Diferentes negocios, misma app" tarjeta={{ icono: "barras", t: "Cada giro trae su catálogo y sus pasos de entrega", s: "Panadería, tortillería, hielo, cárnicos, abarrotes… y 9 más." }} />}
        {paso === 3 && <PanelFoto foto="/img/fotos/flota.jpg" alt="Flota de camiones Mr Ruta en el patio de carga" nota="Tu negocio en movimiento" tarjeta={{ icono: "camion", t: "Sin importar el tamaño de tu flota, la demo se arma a tu medida", s: "Tus unidades y tus choferes, con nombre." }} />}
        {paso === 4 && <PanelFoto foto="/img/fotos/dolor.jpg" alt="Repartidor revisando su tablet en la bodega" nota="Más control para hacer crecer tu negocio" lista={["Operación más eficiente", "Clientes mejor atendidos", "Menos kilómetros", "Más ventas con las mismas camionetas"]} />}
        {paso === 5 && <PanelFoto foto="/img/fotos/entrega.jpg" alt="Entrega con firma en tablet" nota="Ya casi está" tarjeta={{ icono: "escudo", t: `${giro ? giro.nombre : "Tu giro"} · ${TAMANOS.find((t) => t.id === d.tamano)?.t || ""} unidades`, s: dolor?.t || "" }} />}
      </div>

      {paso === 1 && (
        <div className="grid md:grid-cols-[auto_1fr_auto] rounded-2xl overflow-hidden -mx-5 md:mx-0">
          <div className="bg-asfalto text-white p-7 md:p-9 flex flex-col justify-center"><span className="display text-[26px] md:text-[30px] leading-[1]">Distribuye hoy.<br />Llega más lejos<br /><span className="text-naranja">mañana.</span></span></div>
          <div className="bg-white border-y border-plata-2 px-6 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {GIROS.slice(0, 6).map((g) => <Link key={g.slug} href={`/reparto/${g.slug}`} className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-carbon hover:text-naranja-2"><Icono n={ICONO_GIRO[g.slug]} size={26} color="#D86018" />{g.nombre.split(" ")[0]}</Link>)}
            <Link href="/reparto" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-carbon hover:text-naranja-2"><Icono n="caja" size={26} color="#D86018" />Y más</Link>
          </div>
          <div className="bg-naranja text-asfalto p-7 md:p-9 flex flex-col justify-center"><span className="display text-[20px] md:text-[22px] leading-[1.05]">Más que rutas,<br />crecimiento<br />para tu negocio.</span><span className="mt-3 w-12 h-1 bg-white" /></div>
        </div>
      )}
    </div>
  );
}
