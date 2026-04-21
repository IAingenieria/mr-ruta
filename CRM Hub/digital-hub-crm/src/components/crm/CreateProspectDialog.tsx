import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Prospect, ProspectStage, STAGES } from "./ProspectsView";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  empresa: z.string().min(2, "Empresa requerida"),
  cargo: z.string().min(2, "Cargo requerido"),
  sector: z.string().min(2, "Sector requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  etapa: z.enum(["Nuevo", "Contactado", "Calificado", "Propuesta enviada", "Negociación", "Cierre ganado", "Perdido"]),
  valorEstimado: z.coerce.number().min(0, "Debe ser positivo"),
  probabilidad: z.coerce.number().min(0).max(100, "0-100%"),
  fuente: z.string().min(1, "Fuente requerida"),
  ejecutivo: z.string().min(2, "Ejecutivo requerido"),
  proximoSeguimiento: z.string().optional().or(z.literal("")),
  notas: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: Prospect) => void;
}

export const CreateProspectDialog = ({ open, onOpenChange, onCreate }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      empresa: "",
      cargo: "",
      sector: "",
      email: "",
      telefono: "",
      whatsapp: "",
      etapa: "Nuevo",
      valorEstimado: 0,
      probabilidad: 20,
      fuente: "",
      ejecutivo: "Luis H. Muro",
      proximoSeguimiento: "",
      notas: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const prospect: Prospect = {
      id: `p-${Date.now()}`,
      nombre: data.nombre,
      empresa: data.empresa,
      cargo: data.cargo,
      sector: data.sector,
      email: data.email,
      telefono: data.telefono || "",
      whatsapp: data.whatsapp || "",
      etapa: data.etapa as ProspectStage,
      valorEstimado: data.valorEstimado,
      probabilidad: data.probabilidad,
      fuente: data.fuente,
      ejecutivo: data.ejecutivo,
      fechaCreacion: new Date().toISOString(),
      proximoSeguimiento: data.proximoSeguimiento
        ? `${data.proximoSeguimiento}T09:00:00`
        : undefined,
      interacciones: [],
      notas: data.notas || "",
    };

    onCreate(prospect);
    toast.success(`Prospecto "${data.nombre}" creado exitosamente`);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Prospecto</DialogTitle>
          <DialogDescription>
            Registra un nuevo prospecto en el pipeline de ventas
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Sección: Contacto */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Información de contacto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo *</FormLabel>
                    <FormControl><Input placeholder="Carlos García Martínez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="empresa" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl><Input placeholder="Distribuidora del Norte SA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="cargo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl><Input placeholder="Director de Operaciones" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="sector" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector *</FormLabel>
                    <FormControl>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...field}>
                        <option value="">Seleccionar sector</option>
                        <option>Consumo masivo</option>
                        <option>Alimentos perecederos</option>
                        <option>Bebidas</option>
                        <option>Panadería industrial</option>
                        <option>Lácteos</option>
                        <option>Cárnicos</option>
                        <option>Logística 3PL</option>
                        <option>Farmacéutico</option>
                        <option>Otro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl><Input type="email" placeholder="contacto@empresa.mx" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="telefono" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl><Input placeholder="+52 81 1234 5678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (solo números)</FormLabel>
                    <FormControl><Input placeholder="528112345678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Sección: Pipeline */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Información de pipeline
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="etapa" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa *</FormLabel>
                    <FormControl>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" {...field}>
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="fuente" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuente *</FormLabel>
                    <FormControl>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" {...field}>
                        <option value="">Seleccionar fuente</option>
                        <option>Referido cliente</option>
                        <option>LinkedIn</option>
                        <option>Webinar Mr. Ruta</option>
                        <option>Evento industria</option>
                        <option>DENUE</option>
                        <option>Llamada fría</option>
                        <option>Sitio web</option>
                        <option>Redes sociales</option>
                        <option>Otro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="valorEstimado" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor estimado (MXN) *</FormLabel>
                    <FormControl><Input type="number" min={0} placeholder="150000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="probabilidad" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probabilidad de cierre (%) *</FormLabel>
                    <FormControl><Input type="number" min={0} max={100} placeholder="50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="ejecutivo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ejecutivo asignado *</FormLabel>
                    <FormControl><Input placeholder="Luis H. Muro" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="proximoSeguimiento" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo seguimiento</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Notas */}
            <FormField control={form.control} name="notas" render={({ field }) => (
              <FormItem>
                <FormLabel>Notas del ejecutivo</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contexto del prospecto, dolor identificado, información estratégica..."
                    className="min-h-[90px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Crear prospecto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
