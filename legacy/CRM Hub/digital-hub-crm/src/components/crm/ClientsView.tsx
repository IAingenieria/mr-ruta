import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateClientDialog } from "./CreateClientDialog";
import {
  Search,
  Plus,
  MessageCircle,
  Mail,
  Trash2,
  User,
  Edit,
  Grid3x3,
  List,
  Table as TableIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useClients } from "@/hooks/baserowHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type ViewMode = "grid" | "list" | "table";

const statusColors: Record<string, string> = {
  Prospecto: "bg-blue-100 text-blue-800",
  Contactado: "bg-yellow-100 text-yellow-800",
  "En negociación": "bg-orange-100 text-orange-800",
  Cliente: "bg-green-100 text-green-800",
  Inactivo: "bg-gray-100 text-gray-800",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ClientsView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [clientToEdit, setClientToEdit] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { list, remove } = useClients();
  const { data, isLoading, isError, error } = list;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error(`Error al cargar clientes: ${String(error)}`);
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Error al cargar clientes</p>
        <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
      </div>
    );
  }

  const clients = (data as any)?.results ?? [];

  const filteredClients = clients.filter((client: any) => {
    const nombre = client["Nombre"] || "";
    const empresa = client["Empresa"] || "";
    const email = client["Email"] || "";
    
    const matchesSearch =
      nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || client["Estado"] === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone?.replace(/\D/g, '') || '';
    const message = encodeURIComponent(`Hola ${name}, te contacto desde el CRM...`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Cliente eliminado exitosamente");
      setClientToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar cliente");
      console.error(error);
    }
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
                  placeholder="Buscar por nombre, empresa, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Prospecto">Prospecto</SelectItem>
                  <SelectItem value="Contactado">Contactado</SelectItem>
                  <SelectItem value="En negociación">En negociación</SelectItem>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
                  </Button>
                </DialogTrigger>
                <CreateClientDialog onCreate={() => setDialogOpen(false)} />
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client: any) => (
          <Card
            key={client.id}
            className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(client["Nombre"] || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{client["Nombre"]}</h3>
                      <p className="text-sm text-muted-foreground">{client["Empresa"]}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[client["Estado"]] || "bg-gray-100"} variant="secondary">
                    {client["Estado"]}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {client["WhatsApp"] && (
                    <div className="flex items-center gap-2 text-green-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>{client["Teléfono"] || client["WhatsApp"]}</span>
                    </div>
                  )}
                  {client["Email"] && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{client["Email"]}</span>
                    </div>
                  )}
                </div>

                {client["Notas"] && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {client["Notas"]}
                  </p>
                )}

                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {client["Última interacción"] ? `Última: ${client["Última interacción"]}` : "Sin interacciones"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setClientToEdit(client);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setClientToDelete(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {client["WhatsApp"] && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openWhatsApp(client["WhatsApp"], client["Nombre"])}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron clientes</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Intenta ajustar tus filtros"
              : "Agrega tu primer cliente para comenzar"}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
            <CreateClientDialog onCreate={() => setDialogOpen(false)} />
          </Dialog>
        </div>
      )}

      <AlertDialog open={clientToDelete !== null} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clientToDelete && handleDelete(clientToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <CreateClientDialog 
          clientToEdit={clientToEdit}
          onCreate={() => {
            setEditDialogOpen(false);
            setClientToEdit(null);
          }} 
        />
      </Dialog>
    </div>
  );
};
