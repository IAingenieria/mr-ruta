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
};
const Icono = ({ n, size = 28, color = "#1F2224" }: { n: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONOS[n]}</svg>
);

type Datos = { giro: string; tamano: string; dolor: string; nombre: string; empresa: string; estado: string; ciudad: string; choferes: string[]; whatsapp: string };

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
      // El lead, con el dolor y el código, para que ventas sepa qué abrir con él.
      fetch(SITIO.leadsEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo: "demo", nombre: d.nombre.trim(), empresa: d.empresa.trim(), giro: d.giro, ciudad: `${d.ciudad.trim() || d.estado}, ${d.estado}`, whatsapp: d.whatsapp.trim(), correo: "", mensaje: `Dolor: ${dolor?.t || ""} · Unidades: ${d.tamano} · Demo: ${SITIO.demoUrl}/d/${j.code}`, pagina: "/demo" }) }).catch(() => {});
      try { (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "demo_creada", giro: d.giro, dolor: d.dolor }); } catch {}
      setEstado("listo"); setPaso(6);
    } catch (e) {
      setEstado("error"); setMsg("No se pudo crear la demo en este momento. Escríbenos por WhatsApp y te la mandamos hoy."); console.error(e);
    }
  }

  const Stepper = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <ol className="flex items-start gap-0 flex-1">
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
      <div className="card px-4 py-2.5 flex items-center gap-3 text-[14px] md:w-[300px]">
        <span className="font-semibold text-asfalto shrink-0">Tu demo:</span>
        <span className="flex-1 h-2.5 bg-plata-2 rounded-full overflow-hidden"><span className="block h-full bg-naranja rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 4)}%` }} /></span>
        <span className="font-bold text-asfalto tabular-nums">{pct}%</span>
      </div>
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

  const Panel = ({ titulo, sub, children }: { titulo: string; sub?: string; children?: React.ReactNode }) => (
    <aside className="relative overflow-hidden rounded-2xl bg-asfalto min-h-[420px] md:min-h-[560px] flex flex-col justify-between p-7 md:p-9 text-white">
      <div className="absolute -right-24 -top-10 flex gap-5 opacity-[0.18]" aria-hidden="true"><div className="w-[90px] h-[720px] bg-naranja skew-x-[-24deg]" /><div className="w-[90px] h-[720px] bg-naranja-2 skew-x-[-24deg]" /></div>
      <div className="relative flex flex-col gap-2">
        <span className="font-caveat text-[34px] md:text-[40px] leading-none text-naranja">{titulo}</span>
        {sub && <span className="text-[15px] text-plata max-w-[320px]">{sub}</span>}
      </div>
      <div className="relative">{children}</div>
    </aside>
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
      <div className="flex items-center justify-between gap-4">
        <span className="hidden md:inline text-[13px] font-semibold uppercase tracking-wider text-carbon">Rutas ordenadas · Pedidos sugeridos · Entregas con evidencia</span>
        <span className="flex items-center gap-2 text-[14px] text-carbon"><Icono n="escudo" size={22} color="#D86018" /> Tus datos siempre seguros</span>
      </div>
      {paso <= 5 && <Stepper />}

      <div className={`grid gap-8 md:gap-12 ${paso === 6 ? "" : "md:grid-cols-[1.15fr_0.85fr]"} md:items-start`}>
        <div className="flex flex-col gap-7">
          {paso === 1 && (
            <>
              <H eyebrow="Demo interactiva" titulo={<>Construyamos tu empresa en <span className="text-naranja">Mr Ruta</span></>} sub="No necesitas instalar nada ni hablar con un vendedor. Responde cuatro cosas y mira cómo funcionaría una ruta real de tu negocio: con tu giro, tu ciudad y tus choferes." />
              <ul className="grid sm:grid-cols-3 gap-4 text-[15px] text-carbon">
                {[`En menos de ${CIFRAS.demoSegundos} segundos`, "Con pedidos reales de tu giro", "Diseñado para distribuidoras como la tuya"].map((t) => <li key={t} className="flex gap-2.5"><Check /><span>{t}</span></li>)}
              </ul>
              <Nav siguiente={() => setPaso(2)} textoSig="Empezar mi demo" />
            </>
          )}
          {paso === 2 && (
            <>
              <H eyebrow="Conozcamos tu negocio" titulo="¿Qué distribuye tu empresa?" sub="Elige el giro principal: la demo trae los productos, los tipos de cliente y los pasos de entrega de ese giro." />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {GIROS.map((g) => (
                  <Tarjeta key={g.slug} activa={d.giro === g.slug} onClick={() => set("giro", g.slug)} className="!min-h-[76px] !p-4">
                    <span className="text-[15px] font-bold text-asfalto leading-snug">{g.nombre}</span>
                  </Tarjeta>
                ))}
                <Tarjeta activa={d.giro === "otro"} onClick={() => set("giro", "otro")} className="!min-h-[76px] !p-4"><span className="text-[15px] font-bold text-asfalto">Otro giro</span></Tarjeta>
              </div>
              <Nav siguiente={() => setPaso(3)} />
            </>
          )}
          {paso === 3 && (
            <>
              <H eyebrow="Tu operación en marcha" titulo="¿Cuántas unidades salen a reparto cada día?" sub="Con esto armamos la flota de tu demo: tus unidades, tus choferes y una ruta del tamaño de tu operación." />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TAMANOS.map((t) => (
                  <Tarjeta key={t.id} activa={d.tamano === t.id} onClick={() => set("tamano", t.id)} className="!flex-col !items-center !gap-2 !min-h-[150px] text-center">
                    <span className="flex gap-1">{Array.from({ length: Math.min(t.n, 4) }).map((_, i) => <Icono key={i} n="camion" size={26} />)}</span>
                    <span className="display text-[30px] text-asfalto">{t.t}</span>
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
                  <Tarjeta key={x.id} activa={d.dolor === x.id} onClick={() => set("dolor", x.id)} className={x.id === "todo" ? "sm:col-span-2 lg:col-span-3 !min-h-[76px]" : ""}>
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
            <div className="flex flex-col gap-7 max-w-[860px]">
              <H eyebrow="Tu demo está corriendo" titulo={<>¡Listo, {d.nombre.trim().split(" ")[0]}! Esta podría ser tu operación mañana.</>} sub={`${d.empresa} ya tiene ${res.pedidos} pedidos de ${giro ? giro.producto.split(",")[0] : "tu giro"} en ${d.ciudad.trim() || d.estado}, ${TAMANOS.find((t) => t.id === d.tamano)?.n || 1} unidad(es) y a ${d.choferes.filter((c) => c.trim()).join(", ")} en la ruta. La liga vive 30 días.`} />
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
              <div className="bg-asfalto rounded-2xl p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2"><span className="display text-[30px] md:text-[36px] text-white">Ahora hagámoslo con tu ruta real.</span><span className="text-[15px] text-plata">Carga tus clientes y tus productos y en una semana estás repartiendo con Mr Ruta.</span></div>
                <Link href="/contacto" className="btn btn-naranja !min-h-[58px] shrink-0">Cargar mi primera ruta <Flecha /></Link>
              </div>
            </div>
          )}
        </div>

        {paso <= 5 && (
          paso === 1 ? (
            <Panel titulo="Tu operación, en tus manos" sub={`Ruta ordenada: ${CIFRAS.kmOrdenada.despues} km en vez de ${CIFRAS.kmOrdenada.antes}, mismas ${CIFRAS.kmOrdenada.paradas} paradas. Medido en campo.`}>
              <div className="flex justify-center"><Telefono src="/img/app-ruta.jpg" alt="Ruta del día en la app de Mr Ruta" w={230} prioridad /></div>
            </Panel>
          ) : paso === 2 ? (
            <Panel titulo="Diferentes negocios, misma app" sub="Cada giro trae sus productos, sus tipos de cliente y sus pasos de entrega ya cargados.">
              <div className="flex justify-center"><Telefono src="/img/app-sugerido.jpg" alt="Pedido sugerido" w={230} /></div>
            </Panel>
          ) : paso === 3 ? (
            <Panel titulo="Tu negocio en movimiento" sub="Sin importar el tamaño de tu flota, la demo arma unidades y choferes a tu medida.">
              <Image src="/img/foto-patio.jpg" alt="Patio de carga con camionetas" width={960} height={536} className="rounded-xl w-full h-auto" />
            </Panel>
          ) : paso === 4 ? (
            <Panel titulo="Más control para crecer" sub="Lo que elijas aquí es lo primero que ves funcionando en tu demo.">
              <ul className="flex flex-col gap-3 text-[15px] text-plata">
                {["Operación más eficiente", "Clientes mejor atendidos", "Menos kilómetros", "Más ventas con las mismas camionetas"].map((t) => <li key={t} className="flex gap-3 items-center"><span className="w-8 h-8 rounded-full bg-naranja flex items-center justify-center text-asfalto font-bold">✓</span>{t}</li>)}
              </ul>
            </Panel>
          ) : (
            <Panel titulo="Ya casi está" sub={`${giro ? giro.nombre : "Tu giro"} · ${TAMANOS.find((t) => t.id === d.tamano)?.t || ""} unidades · ${dolor?.t || ""}`}>
              <div className="flex justify-center"><Telefono src="/img/app-inicio.jpg" alt="Inicio del vendedor" w={230} /></div>
            </Panel>
          )
        )}
      </div>
    </div>
  );
}
