"use client";
import { useState } from "react";
import { GIROS } from "@/content/giros";
import { SITIO } from "@/content/sitio";

type Tipo = "radar" | "demo" | "contacto";

// Un solo camino para todo lead del sitio. Nunca finge el envío: si el servidor
// no confirma, se muestra el error y el WhatsApp como salida.
export function LeadForm({ tipo, giro, ciudad, titulo, sub, boton }: { tipo: Tipo; giro?: string; ciudad?: string; titulo: string; sub?: string; boton: string }) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const datos: Record<string, string> = {};
    f.forEach((v, k) => (datos[k] = String(v).trim()));
    if (datos.web) return; // honeypot
    if (!datos.nombre || !(datos.whatsapp || datos.correo)) { setEstado("error"); setMsg("Falta tu nombre y un WhatsApp o correo."); return; }
    setEstado("enviando");
    try {
      const atr: Record<string, string> = {};
      try {
        const p = new URLSearchParams(window.location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach((k) => { const v = p.get(k) || sessionStorage.getItem(k); if (v) { atr[k] = v; sessionStorage.setItem(k, v); } });
      } catch {}
      const r = await fetch(SITIO.leadsEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, giro: datos.giro || giro || "", ciudad: ciudad || "", ...datos, pagina: window.location.pathname, ...atr }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setEstado("ok");
      try { (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: tipo === "radar" ? "radar_solicitado" : "lead_form", tipo, giro: datos.giro || giro || "" }); } catch {}
    } catch (err) {
      setEstado("error"); setMsg("No se pudo enviar. Escríbenos por WhatsApp y te contestamos hoy.");
      console.error(err);
    }
  }

  if (estado === "ok") {
    return (
      <div className="card p-8 flex flex-col gap-3 shadow-xl">
        <span className="display text-[30px] text-asfalto">Recibido.</span>
        <p className="text-[16px] text-carbon leading-relaxed">{tipo === "radar" ? "Contamos los negocios alrededor de tu bodega y te mandamos el número con el mapa." : "Te escribe una persona del equipo, no un bot."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="card p-6 md:p-8 flex flex-col gap-4 shadow-xl" aria-label={titulo}>
      <div className="flex flex-col gap-1">
        <span className="display text-[28px] text-asfalto">{titulo}</span>
        {sub && <span className="text-[14px] text-carbon">{sub}</span>}
      </div>
      <input type="text" name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">Nombre
        <input name="nombre" required autoComplete="name" className="h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
      </label>
      {!giro && (
        <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">Giro
          <select name="giro" className="h-12 border-[1.5px] border-plata rounded-md px-3 text-[16px] font-normal normal-case tracking-normal text-asfalto bg-white" defaultValue="">
            <option value="" disabled>Elige tu giro</option>
            {GIROS.map((g) => <option key={g.slug} value={g.slug}>{g.nombre}</option>)}
            <option value="otro">Otro</option>
          </select>
        </label>
      )}
      {tipo === "radar" && (
        <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">Dirección de tu bodega o planta
          <input name="direccion" required placeholder="Calle, colonia, ciudad" className="h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
        </label>
      )}
      {tipo !== "radar" && (
        <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">Empresa
          <input name="empresa" autoComplete="organization" className="h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
        </label>
      )}
      <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">WhatsApp
        <input name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="81 0000 0000" className="h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
      </label>
      {tipo === "contacto" && (
        <>
          <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">Correo
            <input name="correo" type="email" autoComplete="email" className="h-12 border-[1.5px] border-plata rounded-md px-3.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-bold uppercase tracking-wider text-carbon">¿Qué necesitas?
            <textarea name="mensaje" rows={4} className="border-[1.5px] border-plata rounded-md px-3.5 py-2.5 text-[16px] font-normal normal-case tracking-normal text-asfalto" />
          </label>
        </>
      )}
      <button type="submit" disabled={estado === "enviando"} className="btn btn-naranja !min-h-[54px] disabled:opacity-60">{estado === "enviando" ? "Enviando…" : boton}</button>
      {estado === "error" && <p role="alert" className="text-[14px] text-naranja-2 font-semibold">{msg}</p>}
      <span className="text-[13px] text-gris text-center">Sin costo. Te escribe una persona, no un bot.</span>
    </form>
  );
}
