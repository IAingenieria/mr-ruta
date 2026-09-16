import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useMeetings } from "@/hooks/baserowHooks";
import { meetingSchema } from "@/lib/schemas";
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

interface CreateMeetingDialogProps {
  onCreate: () => void;
  meetingToEdit?: any;
}

export const CreateMeetingDialog = ({ onCreate, meetingToEdit }: CreateMeetingDialogProps) => {
  const { create, update } = useMeetings();
  const isEditing = !!meetingToEdit;

  const form = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      Título: "",
      Cliente: "",
      Fecha: new Date().toISOString().split('T')[0],
      Hora: "",
      "Duración (min)": 60,
      Tipo: "Primera reunión",
      Estado: "Programada",
      "Estimado_$": 0,
      "Ubicación/Link": "",
      "Notas previas": "",
      "Notas posteriores": "",
    },
  });

  // Actualizar valores del formulario cuando cambie meetingToEdit
  useEffect(() => {
    if (meetingToEdit) {
      form.reset({
        Título: meetingToEdit.Título || "",
        Cliente: meetingToEdit.Cliente || "",
        Fecha: meetingToEdit.Fecha ? meetingToEdit.Fecha.split('T')[0] : new Date().toISOString().split('T')[0],
        Hora: meetingToEdit.Hora || "",
        "Duración (min)": meetingToEdit["Duración (min)"] || 60,
        Tipo: meetingToEdit.Tipo?.value || meetingToEdit.Tipo || "Primera reunión",
        Estado: meetingToEdit.Estado?.value || meetingToEdit.Estado || "Programada",
        "Estimado_$": meetingToEdit["Estimado_$"] || 0,
        "Ubicación/Link": meetingToEdit["Ubicación/Link"] || "",
        "Notas previas": meetingToEdit["Notas previas"] || "",
        "Notas posteriores": meetingToEdit["Notas posteriores"] || "",
      });
    } else {
      form.reset({
        Título: "",
        Cliente: "",
        Fecha: new Date().toISOString().split('T')[0],
        Hora: "",
        "Duración (min)": 60,
        Tipo: "Primera reunión",
        Estado: "Programada",
        "Estimado_$": 0,
        "Ubicación/Link": "",
        "Notas previas": "",
        "Notas posteriores": "",
      });
    }
  }, [meetingToEdit, form]);

  const onSubmit = async (data: any) => {
    try {
      const cleanData = {
        Título: data.Título || "",
        Cliente: data.Cliente || "",
        Fecha: data.Fecha ? new Date(data.Fecha).toISOString() : new Date().toISOString(),
        Hora: data.Hora || "",
        "Duración (min)": data["Duración (min)"] || 60,
        Tipo: data.Tipo || "Primera reunión",
        Estado: data.Estado || "Programada",
        "Estimado_$": data["Estimado_$"] || 0,
        "Ubicación/Link": data["Ubicación/Link"] || "",
        "Notas previas": data["Notas previas"] || "",
        "Notas posteriores": data["Notas posteriores"] || "",
      };
      
      if (isEditing) {
        await update.mutateAsync({ id: meetingToEdit.id, data: cleanData });
        toast.success("Reunión actualizada exitosamente");
      } else {
        await create.mutateAsync(cleanData);
        toast.success("Reunión creada exitosamente");
      }
      
      form.reset();
      onCreate();
    } catch (error: any) {
      toast.error(isEditing ? "Error al actualizar reunión" : "Error al crear reunión");
      console.error("Error completo:", error);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Reunión" : "Nueva Reunión"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Actualiza la información de la reunión" : "Programa una nueva reunión con el cliente"}
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
                    <Input placeholder="Título de la reunión" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cliente */}
            <FormField
              control={form.control}
              name="Cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="Fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hora */}
            <FormField
              control={form.control}
              name="Hora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duración */}
            <FormField
              control={form.control}
              name="Duración (min)"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración (minutos) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={15} 
                      step={15}
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="Tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="Primera reunión">Primera reunión</option>
                      <option value="Seguimiento">Seguimiento</option>
                      <option value="Presentación propuesta">Presentación propuesta</option>
                      <option value="Cierre">Cierre</option>
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
                      <option value="Programada">Programada</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                      <option value="Reprogramada">Reprogramada</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estimado_$ */}
            <FormField
              control={form.control}
              name="Estimado_$"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimado_$</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      step={0.01}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ubicación/Link */}
            <FormField
              control={form.control}
              name="Ubicación/Link"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Ubicación o Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección física o enlace de videollamada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notas previas */}
          <FormField
            control={form.control}
            name="Notas previas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas previas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Notas y preparación para la reunión..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notas posteriores */}
          <FormField
            control={form.control}
            name="Notas posteriores"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas posteriores</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Resumen y seguimiento de la reunión..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  ? "Actualizar Reunión" 
                  : "Guardar Reunión"
              }
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
