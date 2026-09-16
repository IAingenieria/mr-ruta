import { productoPorSlug, ProductoPage, productoMeta } from "@/components/ProductoPage";
const p = productoPorSlug("vendedor")!;
export const metadata = productoMeta(p);
export default function Page() { return <ProductoPage p={p} />; }
