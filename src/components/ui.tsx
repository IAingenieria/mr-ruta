import Link from "next/link";
import Image from "next/image";
import { NAV, SITIO, demoLink, waLink } from "@/content/sitio";

export const Flecha = ({ color = "#1F2224" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ED8B00" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const WhatsAppIcon = ({ color = "#1F2224", size = 26 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 1-13.3 7.9L3 21l1.2-4.5A9 9 0 1 1 21 12z" />
  </svg>
);

export function Header() {
  return (
    <header className="bg-white border-b border-plata-2 sticky top-0 z-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] h-[72px] md:h-[84px] flex items-center justify-between gap-4">
        <Link href="/" aria-label="Mr Ruta — inicio" className="shrink-0">
          <Image src="/img/logo.png" alt="Mr Ruta" width={514} height={270} priority className="h-9 md:h-11 w-auto" />
        </Link>
        <nav aria-label="Principal" className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-carbon">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-naranja-2">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${SITIO.demoUrl}/`} className="hidden md:inline text-[15px] font-semibold text-carbon hover:text-naranja-2">Entrar a mi demo</a>
          <a href={demoLink()} className="btn btn-naranja !min-h-[44px] !px-4 md:!px-6 text-[14px] md:text-[16px]">Crea tu demo en 30 s</a>
          <details className="lg:hidden relative">
            <summary aria-label="Menú" className="w-11 h-11 flex items-center justify-center rounded-md border border-plata-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54585A" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </summary>
            <div className="absolute right-0 top-12 w-56 card p-2 flex flex-col shadow-xl">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="px-3 py-3 text-[15px] font-semibold text-carbon hover:text-naranja-2">{n.label}</Link>
              ))}
              <a href={`${SITIO.demoUrl}/`} className="px-3 py-3 text-[15px] font-semibold text-carbon">Entrar a mi demo</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const cols = [
    { t: "Giros", l: [["/reparto/panaderia", "Panadería"], ["/reparto/tortilleria", "Tortillería"], ["/reparto/helados-y-hielo", "Helados y hielo"], ["/reparto/frutas-y-verduras", "Frutas y verduras"], ["/reparto/carnicos-y-pollo", "Cárnicos y pollo"], ["/reparto", "Todos los giros"]] },
    { t: "Producto", l: [["/producto/radar", "Radar"], ["/producto/vendedor", "App del vendedor"], ["/producto/despacho", "Despacho y evidencia"], ["/mercado", "Mercado por ciudad"], ["/planes", "Planes"]] },
    { t: "Empresa", l: [["/casos", "Mediciones en campo"], ["/glosario", "Glosario de reparto"], ["/comparativas", "Cómo elegir software de reparto"], ["/contacto", "Contacto"], ["/aviso-de-privacidad", "Aviso de privacidad"]] },
  ];
  return (
    <footer className="bg-asfalto text-plata">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-12 md:py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Image src="/img/isotipo.png" alt="Mr Ruta" width={514} height={167} className="h-10 w-auto self-start" />
          <p className="text-[15px] leading-relaxed max-w-[340px]">Plataforma de reparto y venta en ruta para distribuidoras con flota propia. Hecha en México por {SITIO.empresa}.</p>
        </div>
        {cols.map((c) => (
          <div key={c.t} className="flex flex-col gap-2.5 text-[15px]">
            <span className="eyebrow text-white">{c.t}</span>
            {c.l.map(([h, t]) => <Link key={h} href={h} className="hover:text-naranja">{t}</Link>)}
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] pb-8 flex flex-col md:flex-row justify-between gap-2 text-[13px] text-gris border-t border-asfalto-2 pt-5">
        <span>© {new Date().getFullYear()} Mr Ruta · {SITIO.empresa}</span>
        <span>{SITIO.ciudad}</span>
      </div>
    </footer>
  );
}

export function BotonWhatsApp({ texto }: { texto: string }) {
  return (
    <a href={waLink(texto)} aria-label="Escribir por WhatsApp" className="fixed right-4 bottom-4 z-40 w-14 h-14 rounded-full bg-naranja flex items-center justify-center shadow-2xl hover:bg-naranja-2" target={SITIO.whatsapp ? "_blank" : undefined} rel="noopener">
      <WhatsAppIcon />
    </a>
  );
}

export const Seccion = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={className}>
    <div className="mx-auto max-w-[1440px] px-5 md:px-[72px]">{children}</div>
  </section>
);

export const Eyebrow = ({ children, oscuro = false }: { children: React.ReactNode; oscuro?: boolean }) => (
  <span className={`eyebrow ${oscuro ? "text-naranja" : "text-naranja-2"}`}>{children}</span>
);

export const H2 = ({ children, claro = false, className = "" }: { children: React.ReactNode; claro?: boolean; className?: string }) => (
  <h2 className={`display text-[38px] md:text-[52px] ${claro ? "text-white" : "text-asfalto"} ${className}`}>{children}</h2>
);

// Párrafo Answer-First: las anclas vienen marcadas con <b> desde el contenido.
export const AnswerFirst = ({ html, className = "" }: { html: string; className?: string }) => (
  <p className={`text-[18px] md:text-[20px] leading-relaxed ${className}`} dangerouslySetInnerHTML={{ __html: html.replace(/<b>/g, '<b class="ancla">') }} />
);

export function FAQ({ items, titulo = "Preguntas frecuentes", eyebrow = "Antes de la demo" }: { items: { p: string; r: string }[]; titulo?: string; eyebrow?: string }) {
  return (
    <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2>{titulo}</H2>
      </div>
      <div>
        {items.map((f) => (
          <details key={f.p} className="border-t border-plata-2 py-5 last:border-b group">
            <summary className="flex justify-between gap-4 text-[18px] md:text-[19px] font-bold text-asfalto">
              <h3 className="font-bold">{f.p}</h3>
              <span className="text-naranja-2 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
            </summary>
            <p className="pt-3 text-[16px] leading-relaxed text-carbon">{f.r}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CTAFinal({ titulo, sub, giro, ciudad }: { titulo: React.ReactNode; sub: string; giro?: string; ciudad?: string }) {
  return (
    <Seccion className="pb-20 md:pb-24">
      <div className="bg-naranja rounded-2xl p-8 md:p-16 flex flex-col md:flex-row justify-between md:items-center gap-8 relative overflow-hidden">
        <div className="absolute right-[300px] -top-5 hidden md:flex gap-4 opacity-25" aria-hidden="true">
          <div className="w-[60px] h-[320px] bg-asfalto skew-x-[-24deg]" /><div className="w-[60px] h-[320px] bg-asfalto skew-x-[-24deg]" />
        </div>
        <div className="flex flex-col gap-3 relative">
          <h2 className="display text-[34px] md:text-[52px] text-asfalto">{titulo}</h2>
          <p className="text-[17px] md:text-[18px] text-asfalto">{sub}</p>
        </div>
        <a href={demoLink(giro, ciudad)} className="btn btn-oscuro !min-h-[60px] md:!px-8 text-[17px] shrink-0 relative">Crear mi demo <Flecha color="#fff" /></a>
      </div>
    </Seccion>
  );
}

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export const Migas = ({ items }: { items: { name: string; path: string }[] }) => (
  <nav aria-label="Ruta de navegación" className="text-[14px] text-gris flex flex-wrap gap-2">
    {items.map((it, i) => (
      <span key={it.path} className="flex gap-2">
        {i > 0 && <span>›</span>}
        {i < items.length - 1 ? <Link href={it.path} className="hover:text-naranja-2">{it.name}</Link> : <span className="text-carbon font-semibold">{it.name}</span>}
      </span>
    ))}
  </nav>
);

export const Telefono = ({ src, alt, w = 280, prioridad = false }: { src: string; alt: string; w?: number; prioridad?: boolean }) => (
  <div className="rounded-[34px] p-2.5 bg-[#0E0F10] shadow-2xl" style={{ width: w + 20 }}>
    <Image src={src} alt={alt} width={360} height={800} priority={prioridad} className="rounded-[26px] w-full h-auto" sizes={`${w}px`} />
  </div>
);
