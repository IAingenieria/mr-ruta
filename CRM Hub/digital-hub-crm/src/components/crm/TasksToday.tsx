import { useState } from "react";
import { CheckSquare, Plus, MoreVertical, Phone, Mail, Calendar as CalendarIcon, Package, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/hooks/baserowHooks";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Priority = "🔴 Urgente" | "🟡 Alta" | "🟢 Media";
type TaskType = "Llamada" | "Email" | "Junta" | "Entrega" | "Seguimiento";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  type: TaskType;
  client: string;
  clientInitials: string;
  time?: string;
  completed: boolean;
}

const taskTypeIcons = {
  Llamada: Phone,
  Email: Mail,
  Junta: CalendarIcon,
  Entrega: Package,
  Seguimiento: RefreshCw,
};

export const TasksToday = () => {
  const { list, update } = useTasks();
  const { data: tasksData, isLoading } = list;

  const allTasks = (tasksData as any)?.results ?? [];

  // Filtrar tareas con prioridad 1 y ordenar por fecha más retrasada
  const priorityOneTasks = allTasks
    .filter((task: any) => {
      const taskNumber = task["Número"] || task.Número;
      const taskNumberAsNumber = taskNumber ? Number(taskNumber) : null;
      return taskNumberAsNumber === 1;
    })
    .sort((a: any, b: any) => {
      const dateA = a["Fecha límite"] ? new Date(a["Fecha límite"]).getTime() : Infinity;
      const dateB = b["Fecha límite"] ? new Date(b["Fecha límite"]).getTime() : Infinity;
      return dateA - dateB; // Más antigua primero (más retrasada)
    });

  const toggleTask = async (task: any) => {
    try {
      const currentStatus = task["Estado"]?.value || task["Estado"];
      const newStatus = currentStatus === "Completada" ? "Pendiente" : "Completada";
      
      await update.mutateAsync({
        id: task.id,
        data: { Estado: newStatus }
      });
      
      toast.success(`Tarea marcada como ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Error al actualizar tarea");
      console.error(error);
    }
  };

  const activeTasks = priorityOneTasks.filter((t: any) => (t["Estado"]?.value || t["Estado"]) !== "Completada");
  const completedTasks = priorityOneTasks.filter((t: any) => (t["Estado"]?.value || t["Estado"]) === "Completada");

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-success" />
              Tareas Prioritarias
            </CardTitle>
            <CardDescription>Prioridad 1 - {activeTasks.length} pendientes</CardDescription>
          </div>
          <Button size="sm" className="bg-success hover:bg-success/90">
            <Plus className="h-4 w-4 mr-1" />
            Nueva
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 overflow-auto">
        {/* Tareas activas */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Cargando tareas...</p>
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">¡Todo listo! 🎉</p>
            <p className="text-sm">No tienes tareas con prioridad 1 pendientes</p>
          </div>
        ) : (
          activeTasks.map((task: any) => {
            const taskType = task["Tipo"]?.value || task["Tipo"] || "Seguimiento";
            const TypeIcon = taskTypeIcons[taskType as keyof typeof taskTypeIcons] || RefreshCw;
            const priority = task["Prioridad"]?.value || task["Prioridad"] || "Media";
            const isCompleted = (task["Estado"]?.value || task["Estado"]) === "Completada";
            const numero = task["Número"] || task.Número;
            
            const priorityEmoji = priority === "Alta" ? "🔴" : priority === "Media" ? "🟡" : "🟢";
            
            return (
              <Card
                key={task.id}
                className="p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleTask(task)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{priorityEmoji}</span>
                        {numero && (
                          <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {numero}
                          </div>
                        )}
                        <h4 className="font-semibold text-sm">{task["Título"] || "Sin título"}</h4>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {task["Descripción"] && (
                      <p className="text-xs text-muted-foreground mb-2">{task["Descripción"]}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {taskType}
                      </Badge>
                      
                      {task["Relacionado con"] && (
                        <div className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {task["Relacionado con"].substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{task["Relacionado con"]}</span>
                        </div>
                      )}

                      {task["Fecha límite"] && (
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(task["Fecha límite"]), "d MMM", { locale: es })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}

        {/* Tareas completadas */}
        {completedTasks.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Completadas ({completedTasks.length})
            </p>
            {completedTasks.map((task: any) => {
              const taskType = task["Tipo"]?.value || task["Tipo"] || "Seguimiento";
              const TypeIcon = taskTypeIcons[taskType as keyof typeof taskTypeIcons] || RefreshCw;
              const isCompleted = (task["Estado"]?.value || task["Estado"]) === "Completada";
              
              return (
                <Card
                  key={task.id}
                  className="p-3 mb-2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleTask(task)}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-through">{task["Título"] || "Sin título"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {taskType}
                        </Badge>
                        {task["Relacionado con"] && (
                          <span className="text-xs text-muted-foreground">{task["Relacionado con"]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
