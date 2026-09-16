import { meta, breadcrumb, faqPage } from "@/lib/seo";
import { Seccion, Eyebrow, Migas, JsonLd, CTAFinal, H2 } from "@/components/ui";

export const metadata = meta({
  title: "Cómo elegir software de reparto y venta en ruta | Mr Ruta",
  description: "Doce preguntas para comparar cualquier software de ruteo o preventa antes de contratarlo: sin señal, evidencia, devolución, facturación y precio.",
  path: "/comparativas",
});

// Sin afirmaciones sobre competidores: criterios verificables que el lector aplica a cualquier proveedor.
const CRITERIOS = [
  { p: "¿Funciona sin señal en la ruta y se sincroniza solo?", r: "Pide que apaguen los datos del teléfono en la demo y capturen un pedido. Si la app se detiene, en una ruta real de 30 paradas vas a perder entre 4 y 9." },
  { p: "¿La evidencia de entrega es foto tomada con la cámara en el momento?", r: "Una foto de la galería no prueba nada. Pregunta si la app impide subir fotos guardadas y si guarda ubicación y hora junto con la firma." },
  { p: "¿Registra la devolución en la misma pantalla del pedido?", r: "En productos frescos lo que regresa es el número que importa. Si la devolución vive en otro módulo o en papel, el vendedor no la va a capturar." },
  { p: "¿Tienes que cambiar tu sistema de facturación?", r: "Pregunta de dónde lee los pedidos y a dónde regresa lo entregado. Si la respuesta es «migre todo a nuestro sistema», el costo real es el de la migración." },
  { p: "¿El pedido sugerido usa tu historial o inventa demanda?", r: "Un sugerido sin historial debe ser cero. Pide que te expliquen la regla con un cliente real: si no la pueden decir en una frase, no la hay." },
  { p: "¿Cómo se ordena la ruta y cómo la ve el chofer?", r: "Pide la liga que abre el chofer en el teléfono. Si son varias ligas por tramo o la ruta se corta a nueve escalas, en campo no se usa." },
  { p: "¿Te ayuda a encontrar clientes nuevos o solo a atender los que ya tienes?", r: "Pregunta si el sistema conoce los negocios de tu giro en tu ciudad y si los verifica antes de mandarte. Un listado sin verificar manda a tu vendedor a puertas cerradas." },
  { p: "¿Tus datos están en una base compartida con otras empresas?", r: "Pregunta si cada cliente tiene su propia instancia. Una base compartida es más barata para el proveedor y más riesgosa para ti." },
  { p: "¿Se cobra por usuario, por unidad o por sucursal?", r: "El cobro por usuario castiga a las rutas con muchos vendedores. Pide el precio mensual total para tu operación con el número real de personas." },
  { p: "¿Cuánto tarda en estar corriendo y qué te piden para arrancar?", r: "Si la respuesta empieza con «un proyecto de implementación», pregunta cuántas semanas y cuántas horas de tu gente. Lo que se puede probar hoy con tus datos es lo que existe." },
  { p: "¿Se puede probar con tu giro y tu ciudad antes de firmar?", r: "Una demo genérica muestra el sistema; una demo con tus productos y tus colonias muestra tu operación. Pide la segunda." },
  { p: "¿Quién contesta cuando algo falla a las seis de la mañana?", r: "Pide el canal de soporte y el tiempo de respuesta por escrito. La ruta sale a esa hora, no a las nueve." },
];

export default function Comparativas() {
  const migas = [{ name: "Inicio", path: "/" }, { name: "Cómo elegir", path: "/comparativas" }];
  return (
    <>
      <JsonLd data={[breadcrumb(migas), faqPage(CRITERIOS)]} />
      <Seccion className="pt-6 md:pt-8"><Migas items={migas} /></Seccion>
      <Seccion className="py-10 md:py-16">
        <div className="flex flex-col gap-4 max-w-[900px]">
          <Eyebrow>Guía de compra</Eyebrow>
          <h1 className="display text-[44px] md:text-[72px] text-asfalto">Cómo elegir software de reparto y venta en ruta</h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed">Para <b className="ancla">elegir software de reparto</b> conviene hacer las mismas doce preguntas a cualquier proveedor, Mr Ruta incluido, y pedir que las contesten <b className="ancla">en una demo con tus datos</b>, no en una presentación. Aquí están, con lo que hay que mirar en cada respuesta.</p>
        </div>
      </Seccion>
      <Seccion className="pb-16 md:pb-24">
        <ol className="grid gap-5 md:grid-cols-2">
          {CRITERIOS.map((c, i) => (
            <li key={c.p} className="card p-6 md:p-7 flex flex-col gap-2">
              <span className="display text-[30px] text-naranja leading-none">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-[19px] font-bold text-asfalto">{c.p}</h2>
              <p className="text-[15px] leading-relaxed text-carbon">{c.r}</p>
            </li>
          ))}
        </ol>
      </Seccion>
      <section className="bg-white border-y border-plata-2">
        <div className="mx-auto max-w-[1440px] px-5 md:px-[72px] py-16 md:py-24">
          <div className="flex flex-col gap-4 max-w-[900px]">
            <Eyebrow>Cómo contesta Mr Ruta</Eyebrow>
            <H2>Las doce, en la demo de 30 segundos</H2>
            <p className="text-[17px] leading-relaxed text-carbon">La demo se crea con tu giro y tu ciudad y trae las tres apps corriendo. Apaga los datos del teléfono, captura un pedido, ordena la ruta y ábrela en Google Maps, registra una devolución y cierra una entrega con foto y firma. Lo que no puedas hacer en la demo, no lo prometemos.</p>
          </div>
        </div>
      </section>
      <div className="pt-16 md:pt-24"><CTAFinal titulo="Hazle las doce preguntas a tu propia demo." sub="Con tu giro, tu ciudad y tus unidades, en 30 segundos." /></div>
    </>
  );
}
