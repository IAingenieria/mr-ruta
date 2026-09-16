import { productoPorSlug, ProductoPage, productoMeta } from "@/components/ProductoPage";
const p = productoPorSlug("despacho")!;
export const metadata = productoMeta(p);
export default function Page() { return <ProductoPage p={p} />; }
