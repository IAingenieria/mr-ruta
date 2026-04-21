import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useTasks } from "@/hooks/baserowHooks";
import { taskSchema } from "@/lib/schemas";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateTaskDialogProps {
  onCreate: () => void;
  taskToEdit?: any;
}

export const CreateTaskDialog = ({ onCreate, taskToEdit }: CreateTaskDialogProps) => {
  const { create, update } = useTasks();
  const isEditing = !!taskToEdit;

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      Título: "",
      Descripción: "",
      Prioridad: "Media",
      Estado: "Pendiente",
      "Relacionado con": "",
      "Fecha límite": "",
      "Fecha creación": new Date().toISOString().split('T')[0],
      "Fecha completada": "",
      Recordatorio: false,
      Número: 1,
    },
  });

  // Actualizar valores del formulario cuando cambie taskToEdit
  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        Título: taskToEdit.Título || "",
        Descripción: taskToEdit.Descripción || "",
        Prioridad: taskToEdit.Prioridad?.value || taskToEdit.Prioridad || "Media",
        Estado: taskToEdit.Estado?.value || taskToEdit.Estado || "Pendiente",
        "Relacionado con": taskToEdit["Relacionado con"] || "",
        "Fecha límite": taskToEdit["Fecha límite"] ? taskToEdit["Fecha límite"].split('T')[0] : "",
        "Fecha creación": taskToEdit["Fecha creación"] ? taskToEdit["Fecha creación"].split('T')[0] : new Date().toISOString().split('T')[0],
        "Fecha completada": taskToEdit["Fecha completada"] ? taskToEdit["Fecha completada"].split('T')[0] : "",
        Recordatorio: taskToEdit.Recordatorio || false,
        Número: taskToEdit.Número || 1,
      });
    } else {
      form.reset({
        Título: "",
        Descripción: "",
        Prioridad: "Media",
        Estado: "Pendiente",
        "Relacionado con": "",
        "Fecha límite": "",
        "Fecha creación": new Date().toISOString().split('T')[0],
        "Fecha completada": "",
        Recordatorio: false,
        Número: 1,
      });
    }
  }, [taskToEdit, form]);

  const onSubmit = async (data: any) => {
    try {
      const cleanData = {
        Título: data.Título || "",
        Descripción: data.Descripción || "",
        Prioridad: data.Prioridad || "Media",
        Estado: data.Estado || "Pendiente",
        "Relacionado con": data["Relacionado con"] || "",
        "Fecha límite": data["Fecha límite"] ? new Date(data["Fecha límite"]).toISOString() : null,
        "Fecha creación": data["Fecha creación"] ? new Date(data["Fecha creación"]).toISOString() : new Date().toISOString(),
        "Fecha completada": data["Fecha completada"] ? new Date(data["Fecha completada"]).toISOString() : null,
        Recordatorio: data.Recordatorio || false,
        Número: data.Número || 1,
      };
      
      if (isEditing) {
        await update.mutateAsync({ id: taskToEdit.id, data: cleanData });
        toast.success("Tarea actualizada exitosamente");
      } else {
        await create.mutateAsync(cleanData);
        toast.success("Tarea creada exitosamente");
      }
      
      form.reset();
      onCreate();
    } catch (error: any) {
      toast.error(isEditing ? "Error al actualizar tarea" : "Error al crear tarea");
      console.error("Error completo:", error);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Actualiza la información de la tarea" : "Crea una nueva tarea para gestionar tu trabajo"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="Título"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la tarea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prioridad */}
            <FormField
              control={form.control}
              name="Prioridad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="Estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relacionado con */}
            <FormField
              control={form.control}
              name="Relacionado con"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente relacionado</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha límite */}
            <FormField
              control={form.control}
              name="Fecha límite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha límite</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha creación */}
            <FormField
              control={form.control}
              name="Fecha creación"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de creación</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número */}
            <FormField
              control={form.control}
              name="Número"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número (1-10)</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descripción - Full width */}
          <FormField
            control={form.control}
            name="Descripción"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción detallada de la tarea..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recordatorio */}
          <FormField
            control={form.control}
            name="Recordatorio"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Activar recordatorio
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCreate}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={create.isPending || update.isPending}
            >
              {(create.isPending || update.isPending) 
                ? "Guardando..." 
                : isEditing 
                  ? "Actualizar Tarea" 
                  : "Guardar Tarea"
              }
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
