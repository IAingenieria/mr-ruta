import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useTasks } from "@/hooks/baserowHooks";
import { toast } from "sonner";
import {
  Search,
  Plus,
  CheckSquare,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Package,
  RefreshCw,
  Trash2,
  Edit,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeIcons = {
  "Llamada": Phone,
  "Email": Mail,
  "Junta": CalendarIcon,
  "Entrega": Package,
  "Seguimiento": RefreshCw,
};

const priorityColors = {
  "Alta": "bg-red-100 text-red-800 border-red-200",
  "Media": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Baja": "bg-green-100 text-green-800 border-green-200",
};

const statusColors = {
  "Pendiente": "bg-blue-100 text-blue-800 border-blue-200",
  "En proceso": "bg-orange-100 text-orange-800 border-orange-200",
  "Completada": "bg-green-100 text-green-800 border-green-200",
  "Cancelada": "bg-red-100 text-red-800 border-red-200",
};

export const TasksView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityNumber, setPriorityNumber] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { list, remove, update } = useTasks();
  const { data, isLoading, isError, error } = list;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-slate-900 border border-slate-700 p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-slate-800" />
                  <Skeleton className="h-3 w-1/2 bg-slate-800" />
                  <Skeleton className="h-3 w-2/3 bg-slate-800" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("Error al cargar tareas");
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Error al cargar las tareas</p>
        <p className="text-sm text-red-600 mt-2">{String(error)}</p>
      </div>
    );
  }

  const tasks = (data as any)?.results ?? [];

  const filteredTasks = tasks
    .filter((task: any) => {
      const titulo = task["Título"] || "";
      const descripcion = task["Descripción"] || "";
      const taskStatus = task["Estado"]?.value || task["Estado"];
      
      const matchesSearch =
        titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || statusFilter === "Fechas" || taskStatus === statusFilter;
      
      // Excluir tareas completadas si no está seleccionado el filtro "Completada"
      const isCompleted = taskStatus === "Completada";
      const shouldShowCompleted = statusFilter === "Completada";
      if (isCompleted && !shouldShowCompleted) {
        return false;
      }
      
      const taskNumber = task["Número"] || task.Número;
      const taskNumberAsNumber = taskNumber ? Number(taskNumber) : null;
      const matchesPriority = priorityNumber === null || taskNumberAsNumber === priorityNumber;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a: any, b: any) => {
      if (statusFilter === "Fechas") {
        const dateA = a["Fecha límite"] ? new Date(a["Fecha límite"]).getTime() : Infinity;
        const dateB = b["Fecha límite"] ? new Date(b["Fecha límite"]).getTime() : Infinity;
        const now = new Date().getTime();
        
        const isOverdueA = dateA < now;
        const isOverdueB = dateB < now;
        
        if (isOverdueA && !isOverdueB) return -1;
        if (!isOverdueA && isOverdueB) return 1;
        
        return dateA - dateB;
      }
      
      const numA = Number(a["Número"] || a.Número || 999);
      const numB = Number(b["Número"] || b.Número || 999);
      return numA - numB;
    });

  const toggleTaskStatus = async (task: any) => {
    try {
      const currentStatus = task["Estado"]?.value || task["Estado"];
      const newStatus = currentStatus === "Completada" ? "Pendiente" : "Completada";
      
      console.log("Toggling task:", {
        id: task.id,
        currentStatus,
        newStatus,
        taskData: task
      });
      
      await update.mutateAsync({
        id: task.id,
        data: { Estado: newStatus }
      });
      
      toast.success(`Tarea marcada como ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Error al actualizar tarea");
      console.error("Error toggling task:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Tarea eliminada exitosamente");
      setTaskToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar tarea");
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
                  placeholder="Buscar tareas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={priorityNumber !== null ? "bg-blue-100 text-blue-800 border-blue-300" : ""}
                  >
                    {priorityNumber !== null ? `Prioridad ${priorityNumber}` : "Pendientes"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setPriorityNumber(null)}
                    className={priorityNumber === null ? "bg-accent" : ""}
                  >
                    Todas las prioridades
                  </DropdownMenuItem>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <DropdownMenuItem
                      key={num}
                      onClick={() => setPriorityNumber(num)}
                      className={priorityNumber === num ? "bg-accent" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                          {num}
                        </div>
                        <span>Prioridad {num}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todos los estados</option>
                <option value="Fechas">Fechas</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </DialogTrigger>
                <CreateTaskDialog onCreate={() => setDialogOpen(false)} />
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task: any) => {
          const isCompleted = (task["Estado"]?.value || task["Estado"]) === "Completada";
          const IconComponent = typeIcons[task["Tipo"] as keyof typeof typeIcons] || CheckSquare;
          const priority = task["Prioridad"]?.value || task["Prioridad"] || "Media";
          const status = task["Estado"]?.value || task["Estado"] || "Pendiente";
          const numero = task["Número"] || task.Número;
          
          console.log("Task:", task["Título"], "Número:", numero);
          
          const priorityBorderColor = {
            "Alta": "border-l-red-500",
            "Media": "border-l-yellow-500",
            "Baja": "border-l-green-500",
          };
          
          return (
            <Card 
              key={task.id} 
              className={`bg-slate-900 border border-slate-700 hover:border-blue-500/50 transition-all duration-200 overflow-hidden border-l-4 ${priorityBorderColor[priority as keyof typeof priorityBorderColor] || "border-l-blue-500"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-blue-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-white text-sm leading-tight ${isCompleted ? 'line-through opacity-60' : ''}`}>
                        {task["Título"] || "Sin título"}
                      </h4>
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleTaskStatus(task)}
                        className="border-slate-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </div>
                    
                    <p className="text-slate-400 text-xs mt-0.5">{status}</p>
                    
                    {/* Task details */}
                    <div className="mt-3 space-y-1.5">
                      {task["Relacionado con"] && (
                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span>{task["Relacionado con"]}</span>
                        </div>
                      )}
                      {task["Fecha límite"] && (
                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                          <span>{new Date(task["Fecha límite"]).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task["Descripción"] && (
                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate">{task["Descripción"]}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${priorityColors[priority as keyof typeof priorityColors]}`}>
                          {priority}
                        </Badge>
                        {numero && (
                          <div className="h-6 w-6 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-bold">
                            {numero}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                          onClick={() => {
                            setTaskToEdit(task);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                          onClick={() => setTaskToDelete(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Intenta ajustar tus filtros"
              : "Crea tu primera tarea para comenzar"}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <CreateTaskDialog onCreate={() => setDialogOpen(false)} />
          </Dialog>
        </div>
      )}

      <AlertDialog open={taskToDelete !== null} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tarea será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => taskToDelete && handleDelete(taskToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <CreateTaskDialog 
          taskToEdit={taskToEdit}
          onCreate={() => {
            setEditDialogOpen(false);
            setTaskToEdit(null);
          }} 
        />
      </Dialog>
    </div>
  );
};
