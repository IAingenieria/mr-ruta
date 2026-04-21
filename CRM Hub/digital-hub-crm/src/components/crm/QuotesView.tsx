import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateQuoteDialog } from "./CreateQuoteDialog";
import { useQuotes } from "@/hooks/baserowHooks";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Clock3,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Edit,
  Paperclip,
  Printer,
  FileText,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { printQuote, generateFolio, QuoteData } from "@/lib/quoteGenerator";
import { QuotePreviewDialog } from "./QuotePreviewDialog";

const stageColors = {
  "Borrador": "bg-gray-100 text-gray-800 border-gray-200",
  "Enviada": "bg-blue-100 text-blue-800 border-blue-200",
  "En revisión": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Aprobada": "bg-green-100 text-green-800 border-green-200",
  "Rechazada": "bg-red-100 text-red-800 border-red-200",
  "Expirada": "bg-gray-100 text-gray-800 border-gray-200",
};

export const QuotesView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [quoteToDelete, setQuoteToDelete] = useState<number | null>(null);
  const [quoteToEdit, setQuoteToEdit] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<any | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const { list, remove } = useQuotes();
  const { data, isLoading, isError } = list;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("Error al cargar cotizaciones");
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Error al cargar las cotizaciones</p>
      </div>
    );
  }

  const quotes = data?.results ?? [];

  const filteredQuotes = quotes.filter((quote: any) => {
    const cliente = quote["Cliente"] || "";
    const notas = quote["Notas"] || "";
    
    const matchesSearch =
      cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notas.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (quote["Estado"]?.value || quote["Estado"]) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Cotización eliminada exitosamente");
      setQuoteToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar cotización");
      console.error(error);
    }
  };

  const handlePrintQuote = (quote: any) => {
    console.log("Quote data:", quote);
    
    // Extraer metadata del campo Notas si existe
    let metadata: any = null;
    let notasLimpias = quote["Notas"] || "";
    
    const notasStr = quote["Notas"] || "";
    const metadataMatch = notasStr.match(/<!--QUOTE_DATA:(.*?)-->/);
    if (metadataMatch) {
      try {
        metadata = JSON.parse(metadataMatch[1]);
        notasLimpias = notasStr.replace(/<!--QUOTE_DATA:.*?-->\n?/, "").trim();
        console.log("Extracted metadata:", metadata);
      } catch (e) {
        console.error("Error parsing metadata:", e);
      }
    }
    
    // Usar items de metadata o crear uno por defecto
    let items = metadata?.items || [];
    
    // Si no hay items, crear uno con el monto total
    if (!items || items.length === 0) {
      const monto = quote["Monto"] || 0;
      const subtotal = monto / 1.16;
      items = [{
        cantidad: 1,
        descripcion: notasLimpias || "Servicio",
        precioUnitario: subtotal,
      }];
    }

    // Calcular totales desde items (siempre recalcular para evitar errores)
    const subtotal = items.reduce((acc: number, item: any) => 
      acc + (item.cantidad || 1) * (item.precioUnitario || 0), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const quoteData: QuoteData = {
      folio: metadata?.folio || quote["Folio"] || generateFolio(),
      fecha: quote["Fecha creación"] ? new Date(quote["Fecha creación"]) : new Date(),
      cliente: {
        nombre: quote["Cliente"] || "Cliente",
        telefono: metadata?.telefono || "",
        email: metadata?.email || "",
        direccion: metadata?.direccion || "",
      },
      servicios: items.map((item: any) => ({
        cantidad: item.cantidad || 1,
        descripcion: item.descripcion || "",
        precioUnitario: item.precioUnitario || 0,
      })),
      subtotal,
      iva,
      total,
      notas: notasLimpias,
      condicionesPago: metadata?.condicionesPago || "",
      validezDias: metadata?.validezDias || 30,
    };

    console.log("Final quoteData:", quoteData);
    printQuote(quoteData);
    toast.success("Generando cotización para imprimir...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cotización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Borrador">Borrador</SelectItem>
                  <SelectItem value="Enviada">Enviada</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                  <SelectItem value="Expirada">Expirada</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cotización
                  </Button>
                </DialogTrigger>
                <CreateQuoteDialog onCreate={() => setDialogOpen(false)} />
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredQuotes.map((quote: any) => {
          // Parsear metadata para calcular el monto correcto
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
          
          // Calcular monto correcto desde items
          const items = metadata?.items || [];
          const subtotal = items.reduce((acc: number, item: any) => 
            acc + (item.cantidad || 1) * (item.precioUnitario || 0), 0);
          const iva = subtotal * 0.16;
          const montoCalculado = subtotal + iva;
          
          return (
            <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${stageColors[quote["Estado"]?.value || quote["Estado"] || "Borrador"]}`}
                    >
                      {quote["Estado"]?.value || quote["Estado"] || "Borrador"}
                    </Badge>
                    {quote["Fecha de vencimiento"] && (
                      <Badge variant="outline" className="text-xs">
                        Vence: {new Date(quote["Fecha de vencimiento"]).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {quote["Cliente"] || "Sin cliente"}
                    </h4>
                    {quote["Notas"] && quote["Notas"].includes("Archivo adjunto:") && (
                      <div title="Tiene archivo adjunto">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {notasLimpias && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {notasLimpias}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">
                        ${(montoCalculado || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quote["Moneda"] || "MXN"}
                      </span>
                    </div>
                    {quote["Fecha creación"] && (
                      <span className="text-muted-foreground">
                        Creada: {new Date(quote["Fecha creación"]).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  title="Vista previa"
                  onClick={() => {
                    setPreviewQuote(quote);
                    setPreviewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  title="Imprimir"
                  onClick={() => handlePrintQuote(quote)}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  title="Editar"
                  onClick={() => {
                    // Parsear metadata de las Notas
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
                    
                    // Preparar el objeto para edición con los items parseados
                    const quoteForEdit = {
                      ...quote,
                      Items: metadata?.items || [],
                      Telefono: metadata?.telefono || "",
                      Email: metadata?.email || "",
                      Direccion: metadata?.direccion || "",
                      ValidezDias: metadata?.validezDias || 30,
                      CondicionesPago: metadata?.condicionesPago || "",
                      Folio: metadata?.folio || quote["Folio"] || "",
                      Notas: notasLimpias,
                    };
                    
                    setQuoteToEdit(quoteForEdit);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  title="Eliminar"
                  onClick={() => setQuoteToDelete(quote.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Intenta ajustar tus filtros"
              : "Agrega tu primera cotización para comenzar"}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cotización
              </Button>
            </DialogTrigger>
            <CreateQuoteDialog onCreate={() => setDialogOpen(false)} />
          </Dialog>
        </div>
      )}

      <AlertDialog open={quoteToDelete !== null} onOpenChange={() => setQuoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cotización será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => quoteToDelete && handleDelete(quoteToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <CreateQuoteDialog 
          quoteToEdit={quoteToEdit}
          onCreate={() => {
            setEditDialogOpen(false);
            setQuoteToEdit(null);
          }} 
        />
      </Dialog>

      {/* Preview Dialog */}
      <QuotePreviewDialog
        quote={previewQuote}
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        onPrint={handlePrintQuote}
      />
    </div>
  );
};
