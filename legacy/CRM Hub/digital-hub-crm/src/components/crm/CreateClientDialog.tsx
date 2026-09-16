import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useClients } from "@/hooks/baserowHooks";
import { clientSchema } from "@/lib/schemas";
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

interface CreateClientDialogProps {
  onCreate: () => void;
  clientToEdit?: any;
}

export const CreateClientDialog = ({ onCreate, clientToEdit }: CreateClientDialogProps) => {
  const { create, update } = useClients();
  const isEditing = !!clientToEdit;

  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      Nombre: "",
      Empresa: "",
      Email: "",
      Teléfono: "",
      WhatsApp: "",
      Estado: "Prospecto",
      Fuente: "",
      Notas: "",
      "Fecha creación": new Date().toISOString().split('T')[0],
      "Última interacción": "",
    },
  });

  // Actualizar valores del formulario cuando cambie clientToEdit
  useEffect(() => {
    if (clientToEdit) {
      form.reset({
        Nombre: clientToEdit.Nombre || "",
        Empresa: clientToEdit.Empresa || "",
        Email: clientToEdit.Email || "",
        Teléfono: clientToEdit.Teléfono || "",
        WhatsApp: clientToEdit.WhatsApp || "",
        Estado: clientToEdit.Estado || "Prospecto",
        Fuente: clientToEdit.Fuente || "",
        Notas: clientToEdit.Notas || "",
        "Fecha creación": clientToEdit["Fecha creación"] ? clientToEdit["Fecha creación"].split('T')[0] : new Date().toISOString().split('T')[0],
        "Última interacción": clientToEdit["Última interacción"] ? clientToEdit["Última interacción"].split('T')[0] : "",
      });
    } else {
      form.reset({
        Nombre: "",
        Empresa: "",
        Email: "",
        Teléfono: "",
        WhatsApp: "",
        Estado: "Prospecto",
        Fuente: "",
        Notas: "",
        "Fecha creación": new Date().toISOString().split('T')[0],
        "Última interacción": "",
      });
    }
  }, [clientToEdit, form]);

  const onSubmit = async (data: any) => {
    try {
      const cleanData = {
        Nombre: data.Nombre || "",
        Empresa: data.Empresa || "",
        Email: data.Email || "",
        Teléfono: data.Teléfono || "",
        WhatsApp: data.WhatsApp || "",
        Estado: data.Estado || "Prospecto",
        Fuente: data.Fuente || "",
        Notas: data.Notas || "",
        "Fecha creación": data["Fecha creación"] ? new Date(data["Fecha creación"]).toISOString() : new Date().toISOString(),
        "Última interacción": data["Última interacción"] ? new Date(data["Última interacción"]).toISOString() : null,
      };
      
      if (isEditing) {
        await update.mutateAsync({ id: clientToEdit.id, data: cleanData });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await create.mutateAsync(cleanData);
        toast.success("Cliente creado exitosamente");
      }
      
      form.reset();
      onCreate();
    } catch (error: any) {
      toast.error(isEditing ? "Error al actualizar cliente" : "Error al crear cliente");
      console.error("Error completo:", error);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Actualiza la información del cliente" : "Agrega un nuevo cliente al sistema"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="Nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Empresa */}
            <FormField
              control={form.control}
              name="Empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teléfono */}
            <FormField
              control={form.control}
              name="Teléfono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+52 81 1234 5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WhatsApp */}
            <FormField
              control={form.control}
              name="WhatsApp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="5281234567" {...field} />
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
                      <option value="Prospecto">Prospecto</option>
                      <option value="Contactado">Contactado</option>
                      <option value="En negociación">En negociación</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuente */}
            <FormField
              control={form.control}
              name="Fuente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente</FormLabel>
                  <FormControl>
                    <Input placeholder="Referido, Google Ads, etc." {...field} />
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
          </div>

          {/* Notas - Full width */}
          <FormField
            control={form.control}
            name="Notas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Información adicional sobre el cliente..."
                    className="min-h-[100px]"
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
                  ? "Actualizar Cliente" 
                  : "Guardar Cliente"
              }
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
