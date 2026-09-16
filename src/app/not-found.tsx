import Link from "next/link";
import { Seccion } from "@/components/ui";

export default function NotFound() {
  return (
    <Seccion className="py-24">
      <div className="flex flex-col gap-4 max-w-[700px]">
        <h1 className="display text-[56px] text-asfalto">Esta página no existe</h1>
        <p className="text-[18px] text-carbon">Quizá la liga cambió. Lo que buscas seguramente está en uno de estos lugares:</p>
        <div className="flex flex-wrap gap-3"><Link href="/" className="btn btn-naranja">Inicio</Link><Link href="/reparto" className="btn btn-linea">Giros</Link><Link href="/producto" className="btn btn-linea">Producto</Link></div>
      </div>
    </Seccion>
  );
}
