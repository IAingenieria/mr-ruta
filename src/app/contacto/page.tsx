import { SITIO, waLink, demoLink } from "@/content/sitio";
import { meta, breadcrumb } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, Flecha, WhatsAppIcon } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export const metadata = meta({
  title: "Contacto | Mr Ruta — software de reparto y venta en ruta",
  description: "Escríbenos por WhatsApp o deja tus datos y te contesta una persona del equipo el mismo día. Si prefieres verlo antes, crea tu demo en 30 segundos.",
  path: "/contacto",
});

export default function Contacto() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Contacto", path: "/contacto" }];
  return (
    <>
      <JsonLd data={breadcrumb(migas)} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-start">
          <div className="flex flex-col gap-6">
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="display text-[44px] md:text-[72px] text-asfalto">Te contesta una persona, no un bot</h1>
            <p className="text-[18px] md:text-[20px] leading-relaxed">Escríbenos por WhatsApp o deja tus datos. Si prefieres verlo antes de hablar, <b className="ancla">crea tu demo en 30 segundos</b> con tu giro y tu ciudad.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {SITIO.whatsapp && <a href={waLink("Hola, quiero hablar con alguien de Mr Ruta.")} target="_blank" rel="noopener" className="btn btn-naranja !min-h-[58px]"><WhatsAppIcon size={22} /> WhatsApp</a>}
              <a href={demoLink()} className="btn btn-linea !min-h-[58px]">Crear mi demo <Flecha /></a>
            </div>
            <p className="text-[14px] text-gris">{SITIO.empresa} · {SITIO.ciudad}</p>
          </div>
          <LeadForm tipo="contacto" titulo="Déjanos tus datos" boton="Enviar" />
        </div>
      </Seccion>
    </>
  );
}
