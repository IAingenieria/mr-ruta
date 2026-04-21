import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  Download,
  DollarSign,
  User,
  Calendar,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { generateFolio, QuoteData, downloadQuoteHTML } from "@/lib/quoteGenerator";

interface QuotePreviewDialogProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint: (quote: any) => void;
}

export const QuotePreviewDialog = ({
  quote,
  open,
  onOpenChange,
  onPrint,
}: QuotePreviewDialogProps) => {
  if (!quote) return null;

  // Extraer metadata del campo Notas si existe
  let metadata: any = null;
  let notasLimpias = quote["Notas"] || "";
  
  const notasStr = quote["Notas"] || "";
  const metadataMatch = notasStr.match(/<!--QUOTE_DATA:(.*?)-->/);
  if (metadataMatch) {
    try {
      metadata = JSON.parse(metadataMatch[1]);
      notasLimpias = notasStr.replace(/<!--QUOTE_DATA:.*?-->\n?/, "").trim();
    } catch (e) {
      console.error("Error parsing metadata:", e);
    }
  }

  // Usar items de metadata
  const items: any[] = metadata?.items || [];

  // Calcular totales (siempre recalcular desde items para evitar errores)
  const subtotal = items.reduce((acc: number, item: any) => 
    acc + (item.cantidad || 1) * (item.precioUnitario || 0), 0);
  const iva = subtotal * 0.16;
  const monto = subtotal + iva;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const handleDownload = () => {
    // Si no hay items, crear uno con el monto total
    let servicios = items.map((item: any) => ({
      cantidad: item.cantidad || 1,
      descripcion: item.descripcion || "",
      precioUnitario: item.precioUnitario || 0,
    }));

    if (servicios.length === 0) {
      servicios = [{
        cantidad: 1,
        descripcion: notasLimpias || "Servicio",
        precioUnitario: subtotal,
      }];
    }

    const quoteData: QuoteData = {
      folio: metadata?.folio || generateFolio(),
      fecha: quote["Fecha creación"] ? new Date(quote["Fecha creación"]) : new Date(),
      cliente: {
        nombre: quote["Cliente"] || "Cliente",
        telefono: metadata?.telefono || "",
        email: metadata?.email || "",
        direccion: metadata?.direccion || "",
      },
      servicios,
      subtotal,
      iva,
      total: monto,
      notas: notasLimpias,
      condicionesPago: metadata?.condicionesPago || "",
      validezDias: metadata?.validezDias || 30,
    };
    downloadQuoteHTML(quoteData);
  };

  const stageColors: Record<string, string> = {
    "Borrador": "bg-gray-100 text-gray-800",
    "Enviada": "bg-blue-100 text-blue-800",
    "En revisión": "bg-yellow-100 text-yellow-800",
    "Aprobada": "bg-green-100 text-green-800",
    "Rechazada": "bg-red-100 text-red-800",
    "Expirada": "bg-gray-100 text-gray-800",
  };

  const estado = quote["Estado"]?.value || quote["Estado"] || "Borrador";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Vista Previa de Cotización
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Quote Preview Card */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Mr. Ruta</p>
              <h2 className="text-2xl font-bold">Cotización</h2>
              <p className="text-white/70 text-sm mt-1">
                {quote["Folio"] || generateFolio()}
              </p>
            </div>
            <Badge className={stageColors[estado]}>{estado}</Badge>
          </div>
          <div className="mt-4 text-3xl font-bold">
            {formatCurrency(monto)}
          </div>
          <p className="text-white/70 text-sm">
            {quote["Moneda"] || "MXN"} • IVA incluido
          </p>
        </div>

        {/* Client Info */}
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            Datos del Cliente
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p className="font-semibold">{quote["Cliente"] || "Sin cliente"}</p>
            {metadata?.telefono && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> {metadata.telefono}
              </p>
            )}
            {metadata?.email && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {metadata.email}
              </p>
            )}
            {metadata?.direccion && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 md:col-span-2">
                <MapPin className="h-3 w-3" /> {metadata.direccion}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        {items.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2 text-sm">Servicios / Productos</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left w-12">Cant.</th>
                    <th className="px-3 py-2 text-left">Descripción</th>
                    <th className="px-3 py-2 text-right w-24">P. Unit.</th>
                    <th className="px-3 py-2 text-right w-24">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2 text-center">{item.cantidad || 1}</td>
                      <td className="px-3 py-2">{item.descripcion}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(item.precioUnitario || 0)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency((item.cantidad || 1) * (item.precioUnitario || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="bg-muted/30 p-4 rounded-lg mt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Desglose
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (16%):</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(monto)}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              Creada:{" "}
              {quote["Fecha creación"]
                ? new Date(quote["Fecha creación"]).toLocaleDateString("es-MX")
                : "N/A"}
            </span>
          </div>
          {quote["Fecha de vencimiento"] && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Vence: {new Date(quote["Fecha de vencimiento"]).toLocaleDateString("es-MX")}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {quote["Notas"] && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-yellow-800 mb-2">Notas</h4>
            <p className="text-sm text-yellow-700 whitespace-pre-wrap">
              {quote["Notas"]}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar HTML
          </Button>
          <Button onClick={() => onPrint(quote)}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
