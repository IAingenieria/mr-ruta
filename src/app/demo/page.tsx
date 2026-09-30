import { meta, breadcrumb } from "@/lib/seo";
import { JsonLd } from "@/components/ui";
import { DemoWizard } from "@/components/DemoWizard";

export const metadata = meta({
  title: "Crea tu demo de Mr Ruta con tu giro y tu ciudad | Mr Ruta",
  description: "Cuatro preguntas y tu demo está corriendo: pedidos de tu giro en tu ciudad, tus unidades y tus choferes, con la app del vendedor, el despacho y el Radar. Sin instalar nada.",
  path: "/demo",
});

export default function Demo() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Inicio", path: "/" }, { name: "Crea tu demo", path: "/demo" }])} />
      <DemoWizard />
    </>
  );
}
