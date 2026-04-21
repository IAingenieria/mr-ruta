import { z } from "zod";

export const clientSchema = z.object({
  Nombre: z.string().min(1, "Nombre es requerido"),
  Empresa: z.string().min(1, "Empresa es requerida"),
  Email: z.string().email("Email inválido"),
  Teléfono: z.string().optional().or(z.literal("")),
  WhatsApp: z.string().optional().or(z.literal("")),
  Estado: z.enum(["Prospecto", "Contactado", "En negociación", "Cliente", "Inactivo"]),
  Fuente: z.string().optional().or(z.literal("")),
  Notas: z.string().optional().or(z.literal("")),
  "Fecha creación": z.string().optional().or(z.literal("")),
  "Última interacción": z.string().optional().or(z.literal("")),
});

// Schema para items de cotización
export const quoteItemSchema = z.object({
  cantidad: z.number().min(1, "Cantidad mínima es 1"),
  descripcion: z.string().min(1, "Descripción es requerida"),
  precioUnitario: z.number().min(0, "Precio debe ser positivo"),
});

export const quoteSchema = z.object({
  Folio: z.string().optional(),
  Cliente: z.string().min(1, "Cliente es requerido"),
  Telefono: z.string().optional().or(z.literal("")),
  Email: z.string().optional().or(z.literal("")),
  Direccion: z.string().optional().or(z.literal("")),
  Items: z.array(quoteItemSchema).min(1, "Debe agregar al menos un servicio"),
  Subtotal: z.number().min(0),
  IVA: z.number().min(0),
  Monto: z.number().min(0, "Monto debe ser positivo"),
  Moneda: z.enum(["MXN", "USD"]),
  Estado: z.enum(["Borrador", "Enviada", "En revisión", "Aprobada", "Rechazada", "Expirada"]),
  "Fecha creación": z.string().optional().or(z.literal("")),
  "Fecha vencimiento": z.string().optional().or(z.literal("")),
  ValidezDias: z.number().optional(),
  Notas: z.string().optional().or(z.literal("")),
  CondicionesPago: z.string().optional().or(z.literal("")),
  "Archivo adjunto": z.any().optional(),
});

export const taskSchema = z.object({
  Título: z.string().min(1, "Título es requerido"),
  Descripción: z.string().optional().or(z.literal("")),
  Prioridad: z.enum(["Alta", "Media", "Baja"]),
  Estado: z.enum(["Pendiente", "En proceso", "Completada", "Cancelada"]),
  "Relacionado con": z.string().optional().or(z.literal("")),
  "Fecha límite": z.string().optional().or(z.literal("")),
  "Fecha creación": z.string().optional().or(z.literal("")),
  "Fecha completada": z.string().optional().or(z.literal("")),
  Recordatorio: z.boolean().optional(),
  Número: z.number().min(1, "Mínimo 1").max(10, "Máximo 10").optional(),
});

export const meetingSchema = z.object({
  Título: z.string().min(1, "Título es requerido"),
  Cliente: z.string().min(1, "Cliente es requerido"),
  Fecha: z.string().min(1, "Fecha es requerida"),
  Hora: z.string().min(1, "Hora es requerida"),
  "Duración (min)": z.number().min(1, "Duración debe ser positiva"),
  Tipo: z.enum(["Primera reunión", "Seguimiento", "Presentación propuesta", "Cierre"]),
  Estado: z.enum(["Programada", "Completada", "Cancelada", "Reprogramada"]),
  "Estimado_$": z.number().min(0, "El estimado debe ser positivo").optional().or(z.literal(0)),
  "Ubicación/Link": z.string().url("URL inválida").optional().or(z.literal("")),
  "Notas previas": z.string().optional().or(z.literal("")),
  "Notas posteriores": z.string().optional().or(z.literal("")),
});