import { SITIO } from "@/content/sitio";
import { meta } from "@/lib/seo";
import { Seccion, Eyebrow } from "@/components/ui";

export const metadata = meta({
  title: "Aviso de privacidad | Mr Ruta",
  description: "Qué datos recopila el sitio de Mr Ruta, para qué se usan, con quién se comparten y cómo ejercer tus derechos ARCO. Responsable: Goodman Tech.",
  path: "/aviso-de-privacidad",
  noindex: true,
});

export default function Aviso() {
  return (
    <Seccion className="py-12 md:py-16">
      <div className="flex flex-col gap-6 max-w-[820px] prose-mr text-[16px] text-carbon">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="display text-[40px] md:text-[60px] text-asfalto">Aviso de privacidad</h1>
        <p><strong>Responsable.</strong> {SITIO.empresa} (en adelante «Mr Ruta»), con domicilio en [DOMICILIO FISCAL], es responsable del tratamiento de los datos personales que se recaban a través de este sitio.</p>
        <p><strong>Datos que recabamos.</strong> Nombre, empresa, teléfono o WhatsApp, correo electrónico, giro, ciudad y la dirección de tu bodega cuando solicitas el conteo de negocios. También datos de navegación (páginas visitadas, origen de la visita) mediante herramientas de medición.</p>
        <p><strong>Para qué los usamos.</strong> Contactarte para atender tu solicitud, preparar tu demostración o el conteo de negocios que pediste, y darte seguimiento comercial. No vendemos tus datos ni los compartimos con terceros, salvo los proveedores tecnológicos necesarios para operar el sitio y la plataforma.</p>
        <p><strong>Derechos ARCO.</strong> Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a [CORREO DE PRIVACIDAD]. Atendemos las solicitudes en un plazo máximo de 20 días hábiles.</p>
        <p><strong>Cambios.</strong> Cualquier modificación a este aviso se publicará en esta página. Última actualización: [FECHA].</p>
      </div>
    </Seccion>
  );
}
