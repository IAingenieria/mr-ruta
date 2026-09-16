import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Printer, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const QuoteCard = ({
  quote,
  onPreview,
  onPrint,
  onEdit,
  onDelete,
}: {
  quote: any;
  onPreview: (quote: any) => void;
  onPrint: (quote: any) => void;
  onEdit: (quote: any) => void;
  onDelete: (quote: any) => void;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return format(date, "d MMM yyyy", { locale: es });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Borrador": return "secondary";
      case "Enviada": return "default";
      case "En revisión": return "warning";
      case "Aprobada": return "success";
      case "Rechazada": return "destructive";
      case "Expirada": return "outline";
      default: return "secondary";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate max-w-[70%]">{quote.Folio}</h3>
          <Badge variant={getStatusBadgeVariant(quote.Estado)}>
            {quote.Estado}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium truncate">{quote.Cliente || "Sin cliente"}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Monto</p>
            <p className="font-bold text-primary">{formatCurrency(quote.Monto || 0)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Fecha</p>
            <p>{formatDate(quote["Fecha creación"])}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onPreview(quote)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onPrint(quote)}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(quote)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(quote)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
