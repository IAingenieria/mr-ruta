import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateMeetingDialog } from "./CreateMeetingDialog";
import { useMeetings } from "@/hooks/baserowHooks";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Link,
  Users,
  Trash2,
  Video,
  Edit,
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

const statusColors = {
  "Programada": "bg-blue-100 text-blue-800 border-blue-200",
  "Completada": "bg-green-100 text-green-800 border-green-200",
  "Cancelada": "bg-red-100 text-red-800 border-red-200",
  "Reprogramada": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const typeColors = {
  "Primera reunión": "bg-purple-100 text-purple-800 border-purple-200",
  "Seguimiento": "bg-orange-100 text-orange-800 border-orange-200",
  "Presentación propuesta": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Cierre": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const MeetingsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);
  const [meetingToEdit, setMeetingToEdit] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { list, remove } = useMeetings();
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
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("Error al cargar reuniones");
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Error al cargar las reuniones</p>
      </div>
    );
  }

  const meetings = data?.results ?? [];

  const filteredMeetings = meetings.filter((meeting: any) => {
    const titulo = meeting["Título"] || "";
    const cliente = meeting["Cliente"] || "";
    
    const matchesSearch =
      titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (meeting["Estado"]?.value || meeting["Estado"]) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Reunión eliminada exitosamente");
      setMeetingToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar reunión");
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
                  placeholder="Buscar reunión..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todos los estados</option>
                <option value="Programada">Programada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Reprogramada">Reprogramada</option>
              </select>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Reunión
                  </Button>
                </DialogTrigger>
                <CreateMeetingDialog onCreate={() => setDialogOpen(false)} />
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredMeetings.map((meeting: any) => (
          <Card key={meeting.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusColors[meeting["Estado"]?.value || meeting["Estado"] || "Programada"]}`}
                  >
                    {meeting["Estado"]?.value || meeting["Estado"] || "Programada"}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${typeColors[meeting["Tipo"]?.value || meeting["Tipo"] || "Primera reunión"]}`}
                  >
                    {meeting["Tipo"]?.value || meeting["Tipo"] || "Primera reunión"}
                  </Badge>
                </div>

                <h4 className="font-semibold text-sm mb-1">
                  {meeting["Título"] || "Sin título"}
                </h4>

                <div className="flex items-center gap-4 text-xs mb-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{meeting["Cliente"] || "Sin cliente"}</span>
                  </div>
                  {meeting["Fecha"] && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(meeting["Fecha"]).toLocaleDateString()}</span>
                    </div>
                  )}
                  {meeting["Hora"] && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{meeting["Hora"]}</span>
                    </div>
                  )}
                </div>

                {meeting["Duración (min)"] && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>Duración: {meeting["Duración (min)"]} minutos</span>
                  </div>
                )}

                {meeting["Ubicación/Link"] && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    {meeting["Ubicación/Link"].startsWith("http") ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    <span className="truncate">{meeting["Ubicación/Link"]}</span>
                  </div>
                )}

                {meeting["Notas previas"] && (
                  <p className="text-xs text-muted-foreground">
                    {meeting["Notas previas"]}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMeetingToEdit(meeting);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setMeetingToDelete(meeting.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay reuniones</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Intenta ajustar tus filtros"
              : "Programa tu primera reunión para comenzar"}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Reunión
              </Button>
            </DialogTrigger>
            <CreateMeetingDialog onCreate={() => setDialogOpen(false)} />
          </Dialog>
        </div>
      )}

      <AlertDialog open={meetingToDelete !== null} onOpenChange={() => setMeetingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reunión será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => meetingToDelete && handleDelete(meetingToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <CreateMeetingDialog 
          meetingToEdit={meetingToEdit}
          onCreate={() => {
            setEditDialogOpen(false);
            setMeetingToEdit(null);
          }} 
        />
      </Dialog>
    </div>
  );
};
