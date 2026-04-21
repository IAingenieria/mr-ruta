import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuotes } from "@/hooks/baserowHooks";
import { quoteSchema } from "@/lib/schemas";
import { uploadFile } from "@/lib/baserow";
import { generateFolio } from "@/lib/quoteGenerator";
import { Plus, Trash2, Calculator } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteItem {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
}

interface CreateQuoteDialogProps {
  onCreate: () => void;
  quoteToEdit?: any;
}

export const CreateQuoteDialog = ({ onCreate, quoteToEdit }: CreateQuoteDialogProps) => {
  const { create, update } = useQuotes();
  const isEditing = !!quoteToEdit;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      Folio: generateFolio(),
      Cliente: "",
      Telefono: "",
      Email: "",
      Direccion: "",
      Items: [{ cantidad: 1, descripcion: "", precioUnitario: 0 }] as QuoteItem[],
      Subtotal: 0,
      IVA: 0,
      Monto: 0,
      Moneda: "MXN" as const,
      Estado: "Borrador" as const,
      "Fecha creación": new Date().toISOString().split('T')[0],
      "Fecha vencimiento": "",
      ValidezDias: 30,
      Notas: "",
      CondicionesPago: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "Items",
  });

  // Calcular totales cuando cambian los items
  const watchItems = form.watch("Items");
  
  useEffect(() => {
    const subtotal = watchItems.reduce((acc, item) => {
      return acc + (item.cantidad || 0) * (item.precioUnitario || 0);
    }, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    form.setValue("Subtotal", subtotal);
    form.setValue("IVA", iva);
    form.setValue("Monto", total);
  }, [watchItems, form]);

  // Actualizar valores del formulario cuando cambie quoteToEdit
  useEffect(() => {
    if (quoteToEdit) {
      // Parsear items si existen
      let items: QuoteItem[] = [{ cantidad: 1, descripcion: "", precioUnitario: 0 }];
      if (quoteToEdit.Items) {
        try {
          items = typeof quoteToEdit.Items === 'string' 
            ? JSON.parse(quoteToEdit.Items) 
            : quoteToEdit.Items;
        } catch (e) {
          console.error("Error parsing items:", e);
        }
      }
      
      form.reset({
        Folio: quoteToEdit.Folio || generateFolio(),
        Cliente: quoteToEdit.Cliente || "",
        Telefono: quoteToEdit.Telefono || "",
        Email: quoteToEdit.Email || "",
        Direccion: quoteToEdit.Direccion || "",
        Items: items,
        Subtotal: quoteToEdit.Subtotal || 0,
        IVA: quoteToEdit.IVA || 0,
        Monto: quoteToEdit.Monto || 0,
        Moneda: quoteToEdit.Moneda || "MXN",
        Estado: quoteToEdit.Estado?.value || quoteToEdit.Estado || "Borrador",
        "Fecha creación": quoteToEdit["Fecha creación"] ? quoteToEdit["Fecha creación"].split('T')[0] : new Date().toISOString().split('T')[0],
        "Fecha vencimiento": quoteToEdit["Fecha vencimiento"] || "",
        ValidezDias: quoteToEdit.ValidezDias || 30,
        Notas: quoteToEdit.Notas || "",
        CondicionesPago: quoteToEdit.CondicionesPago || "",
      });
      setSelectedFile(null);
    } else {
      form.reset({
        Folio: generateFolio(),
        Cliente: "",
        Telefono: "",
        Email: "",
        Direccion: "",
        Items: [{ cantidad: 1, descripcion: "", precioUnitario: 0 }],
        Subtotal: 0,
        IVA: 0,
        Monto: 0,
        Moneda: "MXN",
        Estado: "Borrador",
        "Fecha creación": new Date().toISOString().split('T')[0],
        "Fecha vencimiento": "",
        ValidezDias: 30,
        Notas: "",
        CondicionesPago: "",
      });
      setSelectedFile(null);
    }
  }, [quoteToEdit, form]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const onSubmit = async (data: any) => {
    try {
      // Serializar items como JSON string para almacenar
      const itemsJson = JSON.stringify(data.Items);
      
      // Crear metadata JSON con todos los datos adicionales
      const metadata = {
        items: data.Items,
        telefono: data.Telefono || "",
        email: data.Email || "",
        direccion: data.Direccion || "",
        subtotal: data.Subtotal || 0,
        iva: data.IVA || 0,
        validezDias: data.ValidezDias || 30,
        condicionesPago: data.CondicionesPago || "",
        folio: data.Folio || generateFolio(),
      };
      
      // Guardar metadata en Notas como JSON al inicio
      const metadataStr = `<!--QUOTE_DATA:${JSON.stringify(metadata)}-->`;
      const notasConMetadata = `${metadataStr}\n${data.Notas || ""}`;
      
      const cleanData = {
        Cliente: data.Cliente || "",
        Monto: data.Monto || 0,
        Moneda: data.Moneda || "MXN",
        Estado: data.Estado || "Borrador",
        "Fecha creación": data["Fecha creación"] ? new Date(data["Fecha creación"]).toISOString() : new Date().toISOString(),
        Notas: notasConMetadata,
      };
      
      console.log("Saving quote with data:", cleanData);

      // Si hay un archivo seleccionado, subirlo
      if (selectedFile) {
        try {
          toast.info("Subiendo archivo...");
          const fileResponse = await uploadFile(selectedFile);
          const fileInfo = `\n\nArchivo adjunto: ${selectedFile.name} (ID: ${fileResponse.name})`;
          cleanData.Notas = `${cleanData.Notas}${fileInfo}`.trim();
          toast.success("Archivo subido exitosamente");
        } catch (fileError) {
          console.error("Error uploading file:", fileError);
          toast.error("Error al subir el archivo.");
        }
      }
      
      if (isEditing) {
        await update.mutateAsync({ id: quoteToEdit.id, data: cleanData });
        toast.success("Cotización actualizada exitosamente");
      } else {
        await create.mutateAsync(cleanData);
        toast.success("Cotización creada exitosamente");
      }
      
      form.reset();
      setSelectedFile(null);
      onCreate();
    } catch (error: any) {
      toast.error(isEditing ? "Error al actualizar cotización" : "Error al crear cotización");
      console.error("Error completo:", error);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Cotización" : "Nueva Cotización"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Actualiza la información de la cotización" : "Completa los datos para generar la cotización"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Sección: Datos del Cliente */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Datos del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <FormField
                control={form.control}
                name="Cliente"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nombre / Razón Social *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="81 1234 5678" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Direccion"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-4">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, número, colonia, ciudad" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Sección: Servicios / Productos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">Servicios / Productos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ cantidad: 1, descripcion: "", precioUnitario: 0 })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar línea
              </Button>
            </div>
            
            {/* Header de la tabla */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
              <div className="col-span-1">Cant.</div>
              <div className="col-span-6">Descripción del servicio / producto</div>
              <div className="col-span-2 text-right">P. Unitario</div>
              <div className="col-span-2 text-right">Importe</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {fields.map((field, index) => {
                const cantidad = form.watch(`Items.${index}.cantidad`) || 0;
                const precioUnitario = form.watch(`Items.${index}.precioUnitario`) || 0;
                const importe = cantidad * precioUnitario;

                return (
                  <Card key={field.id} className="bg-muted/30">
                    <CardContent className="p-2">
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <FormField
                          control={form.control}
                          name={`Items.${index}.cantidad`}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  className="h-9 text-center"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`Items.${index}.descripcion`}
                          render={({ field }) => (
                            <FormItem className="col-span-6">
                              <FormControl>
                                <Textarea
                                  placeholder="Descripción detallada del servicio o producto..."
                                  className="min-h-[60px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`Items.${index}.precioUnitario`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  placeholder="0.00"
                                  className="h-9 text-right"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="col-span-2 h-9 flex items-center justify-end text-sm font-medium">
                          {formatCurrency(importe)}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => fields.length > 1 && remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Totales */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(form.watch("Subtotal"))}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">IVA (16%):</span>
                  <span>{formatCurrency(form.watch("IVA"))}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2 font-bold text-base">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(form.watch("Monto"))}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Configuración */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="Folio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folio</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Fecha creación"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ValidezDias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vigencia (días)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    >
                      <option value="Borrador">Borrador</option>
                      <option value="Enviada">Enviada</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                      <option value="Expirada">Expirada</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Notas y Condiciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="CondicionesPago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones de Pago</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: 50% anticipo, 50% al finalizar..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCreate}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending)
                ? "Guardando..."
                : isEditing
                  ? "Actualizar Cotización"
                  : "Guardar Cotización"
              }
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
