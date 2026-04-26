import { useState, useMemo } from "react";
import { format, differenceInDays, parseISO, isPast, isToday, isThisWeek } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus, Search, TrendingUp, Users, AlertTriangle,
  Target, Phone, Mail, MessageCircle, Edit,
  LayoutGrid, List, DollarSign, Building2,
  CalendarClock, ChevronDown, RefreshCw, FileText,
  Send, UserCheck, Filter, EyeOff, PhoneCall, ChevronRight,
  ContactRound, Clock3, Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ProspectDetailDialog } from "./ProspectDetailDialog";
import { CreateProspectDialog } from "./CreateProspectDialog";
import { useProspects } from "@/hooks/baserowHooks";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProspectStage =
  | "Nuevo"
  | "Contactado"
  | "Calificado"
  | "Propuesta enviada"
  | "Negociación"
  | "Cierre ganado"
  | "Perdido";

export type InteractionType =
  | "Llamada"
  | "Email"
  | "WhatsApp"
  | "Reunión"
  | "Nota interna"
  | "Propuesta enviada"
  | "Seguimiento";

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string;
  author: string;
  content: string;
  result?: string;
}

export interface Prospect {
  id: string;
  nombre: string;
  empresa: string;
  cargo: string;
  sector: string;
  email: string;
  telefono: string;
  whatsapp: string;
  etapa: ProspectStage;
  valorEstimado: number;
  probabilidad: number;
  fuente: string;
  estado: string;
  municipio: string;
  ejecutivo: string;
  fechaCreacion: string;
  proximoSeguimiento?: string;
  interacciones: Interaction[];
  notas: string;
}

// ─── Stage config ─────────────────────────────────────────────────────────────

export const STAGES: ProspectStage[] = [
  "Nuevo", "Contactado", "Calificado",
  "Propuesta enviada", "Negociación", "Cierre ganado",
];

export const stageConfig: Record<ProspectStage, {
  label: string; badge: string; dot: string; colHeader: string; colBg: string;
}> = {
  "Nuevo":            { label: "Nuevo",            badge: "bg-blue-100 text-blue-800 border-blue-200",       dot: "bg-blue-500",    colHeader: "border-t-blue-500",    colBg: "bg-blue-50/40"    },
  "Contactado":       { label: "Contactado",       badge: "bg-amber-100 text-amber-800 border-amber-200",   dot: "bg-amber-500",   colHeader: "border-t-amber-500",   colBg: "bg-amber-50/40"   },
  "Calificado":       { label: "Calificado",       badge: "bg-violet-100 text-violet-800 border-violet-200",dot: "bg-violet-500",  colHeader: "border-t-violet-500",  colBg: "bg-violet-50/40"  },
  "Propuesta enviada":{ label: "Propuesta enviada",badge: "bg-orange-100 text-orange-800 border-orange-200",dot: "bg-orange-500",  colHeader: "border-t-orange-500",  colBg: "bg-orange-50/40"  },
  "Negociación":      { label: "Negociación",      badge: "bg-indigo-100 text-indigo-800 border-indigo-200",dot: "bg-indigo-500",  colHeader: "border-t-indigo-500",  colBg: "bg-indigo-50/40"  },
  "Cierre ganado":    { label: "Cierre ganado",    badge: "bg-green-100 text-green-800 border-green-200",   dot: "bg-green-500",   colHeader: "border-t-green-500",   colBg: "bg-green-50/40"   },
  "Perdido":          { label: "Perdido",          badge: "bg-gray-100 text-gray-600 border-gray-200",      dot: "bg-gray-400",    colHeader: "border-t-gray-400",    colBg: "bg-gray-50/40"    },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROSPECTS: Prospect[] = [
  {
    id: "p1",
    nombre: "Carlos Garza Treviño",
    empresa: "Distribuidora Regio Norte",
    cargo: "Director de Operaciones",
    sector: "Consumo masivo",
    email: "cgarza@regionorte.com.mx",
    telefono: "+52 81 8765 4321",
    whatsapp: "528187654321",
    etapa: "Calificado",
    valorEstimado: 185000,
    probabilidad: 65,
    fuente: "Referido cliente",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-03-10T09:00:00",
    proximoSeguimiento: "2026-04-23T10:00:00",
    notas: "Opera 12 rutas DSD en zona norte MTY. Pain point principal: fill rate por debajo del 94%. Muy interesado en el módulo de picking y geofencing. Tomador de decisión directo, sin comité.",
    interacciones: [
      { id: "i1a", type: "Llamada", date: "2026-04-15T11:30:00", author: "Luis H. Muro", content: "Llamada de seguimiento post-demo. Confirma interés. Solicita propuesta formal con desglose de implementación.", result: "Solicita propuesta en 5 días hábiles." },
      { id: "i1b", type: "Reunión", date: "2026-04-08T10:00:00", author: "Luis H. Muro", content: "Demo técnica de 90 min. Asistieron Carlos + Jefe de TI. Se mostraron impresionados con el Sargento Timer y el módulo FEFO. Preguntas sobre integración con su ERP actual (SAP B1).", result: "Demo exitosa. Pasan a evaluación técnica." },
      { id: "i1c", type: "Email", date: "2026-03-18T09:00:00", author: "Luis H. Muro", content: "Envío de presentación ejecutiva y casos de éxito del sector pan/panadería. Se adjuntó ROI estimado para operación de 12 rutas.", result: "Confirmó recepción y agendó demo para el 8 de abril." },
      { id: "i1d", type: "Llamada", date: "2026-03-10T14:00:00", author: "Luis H. Muro", content: "Primera llamada de contacto. Referido por Héctor Vázquez (Bodegón del Norte). Identificó dolor principal: sus repartidores no registran devoluciones correctamente, generando merma oculta.", result: "Prospecto calificado. Agendó segunda llamada para demo." },
    ],
  },
  {
    id: "p2",
    nombre: "Patricia Sánchez Morales",
    empresa: "Grupo Alimenticio del Norte",
    cargo: "Gerente de Logística",
    sector: "Alimentos perecederos",
    email: "psanchez@grupoalnorte.mx",
    telefono: "+52 81 2345 6789",
    whatsapp: "528123456789",
    etapa: "Negociación",
    valorEstimado: 320000,
    probabilidad: 80,
    fuente: "LinkedIn",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-02-20T08:00:00",
    proximoSeguimiento: "2026-04-21T09:00:00",
    notas: "Operación grande: 28 rutas, 3 CEDIS. El CFO quiere ver un piloto de 90 días antes de firma. Competidor principal activo: Optimobility. Ventaja nuestra: precio 30% menor y sin cobro por usuario.",
    interacciones: [
      { id: "i2a", type: "Reunión", date: "2026-04-17T16:00:00", author: "Luis H. Muro", content: "Reunión de negociación de contrato. Solicitan 90 días de piloto gratuito en 5 rutas antes de firma completa. Revisión de cláusulas de SLA y uptime.", result: "Pendiente: enviar propuesta con piloto incluido antes del viernes." },
      { id: "i2b", type: "Propuesta enviada", date: "2026-04-10T12:00:00", author: "Luis H. Muro", content: "Envío de propuesta comercial formal. $320,000 MXN implementación + $18,500/mes mantenimiento. Incluye capacitación para 3 CEDIS y soporte dedicado 6 meses.", result: "CFO solicitó revisión con su área legal." },
      { id: "i2c", type: "Reunión", date: "2026-03-28T11:00:00", author: "Luis H. Muro", content: "Presentación ante comité técnico (IT + Logística + Finanzas). Duración 2 horas. Fuerte cuestionamiento sobre seguridad de datos y disponibilidad offline.", result: "Aprobación técnica. Pasan a aprobación directiva." },
      { id: "i2d", type: "Llamada", date: "2026-02-20T10:00:00", author: "Luis H. Muro", content: "Contacto inicial vía LinkedIn. Patricia buscaba activamente soluciones DSD. Rápida calificación: 28 rutas, presupuesto aprobado Q2.", result: "Alta prioridad. Agendó demo para la semana siguiente." },
    ],
  },
  {
    id: "p3",
    nombre: "Miguel Torres Ávila",
    empresa: "Panificadora La Espiga",
    cargo: "Dueño / Director General",
    sector: "Panadería industrial",
    email: "miguel@laespiga.com.mx",
    telefono: "+52 818 901 2345",
    whatsapp: "528189012345",
    etapa: "Contactado",
    valorEstimado: 95000,
    probabilidad: 35,
    fuente: "DENUE",
    municipio: "Apodaca",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-04-01T10:00:00",
    proximoSeguimiento: "2026-04-22T11:00:00",
    notas: "PYME con 6 rutas. Actualmente llevan control en Excel y WhatsApp. Muy interesante para módulo básico. Miguel es escéptico de tecnología pero su hijo (que también trabaja ahí) fue el que se entusiasmó en la llamada.",
    interacciones: [
      { id: "i3a", type: "Email", date: "2026-04-05T08:00:00", author: "Luis H. Muro", content: "Envío de one-pager con propuesta de valor adaptada a PYME. Énfasis en la demo gratuita y precio accesible del plan básico.", result: "Sin respuesta aún. Dar seguimiento el 22 de abril." },
      { id: "i3b", type: "Llamada", date: "2026-04-01T14:30:00", author: "Luis H. Muro", content: "Primera llamada. Prospecto identificado vía DENUE (giro panadería, >5 empleados, zona Apodaca). Miguel respondió con interés moderado. Su hijo Ricardo hizo preguntas técnicas muy buenas.", result: "Interesados en demo. Pendiente confirmar fecha." },
    ],
  },
  {
    id: "p4",
    nombre: "Ana Rodríguez Peña",
    empresa: "Distribuidora Bebidas del Bajío",
    cargo: "VP de Ventas y Distribución",
    sector: "Bebidas",
    email: "arodriguez@bebidasbajio.mx",
    telefono: "+52 477 234 5678",
    whatsapp: "524772345678",
    etapa: "Propuesta enviada",
    valorEstimado: 250000,
    probabilidad: 55,
    fuente: "Evento ANTAD",
    municipio: "Guadalajara",
    estado: "Jalisco",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-03-05T09:00:00",
    proximoSeguimiento: "2026-04-24T15:00:00",
    notas: "Conocimos en ANTAD. Operan en Guanajuato y Jalisco, 18 rutas. Han tenido problemas fuertes de cobranza (DSO >45 días). El módulo de bloqueo por crédito fue lo que más les llamó la atención.",
    interacciones: [
      { id: "i4a", type: "Seguimiento", date: "2026-04-14T10:00:00", author: "Luis H. Muro", content: "Llamada de seguimiento a propuesta enviada el 1ro de abril. Ana comenta que está en revisión con su CFO. Sin objeciones de fondo hasta ahora.", result: "Esperando respuesta del CFO esta semana." },
      { id: "i4b", type: "Propuesta enviada", date: "2026-04-01T17:00:00", author: "Luis H. Muro", content: "Envío de propuesta comercial con énfasis en módulo de cobranza y DSO. Incluyó calculadora de ROI mostrando recuperación de inversión en 8 meses.", result: "Confirma recepción. Revisará con equipo directivo." },
      { id: "i4c", type: "Reunión", date: "2026-03-20T11:00:00", author: "Luis H. Muro", content: "Demo técnica vía Zoom (2 hrs). Asistieron Ana + Coordinador de Distribución + Gerente TI. Se demostró el módulo de bloqueo por crédito y el dashboard directivo.", result: "Muy positiva. Solicitaron propuesta formal." },
      { id: "i4d", type: "Llamada", date: "2026-03-05T09:30:00", author: "Luis H. Muro", content: "Contacto inicial post-ANTAD. Intercambio de tarjetas en el evento. Se agendó llamada de 30 min para calificación.", result: "Prospecto calificado. 18 rutas, presupuesto disponible Q2." },
    ],
  },
  {
    id: "p5",
    nombre: "Roberto Mendoza Cisneros",
    empresa: "Logística Express MTY",
    cargo: "CEO",
    sector: "Logística 3PL",
    email: "roberto.mendoza@logexpress.mx",
    telefono: "+52 81 5555 1234",
    whatsapp: "528155551234",
    etapa: "Nuevo",
    valorEstimado: 420000,
    probabilidad: 20,
    fuente: "Referido cliente",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-04-18T08:00:00",
    proximoSeguimiento: "2026-04-22T10:00:00",
    notas: "Referido de Héctor Vázquez. Operación muy grande: 45 rutas DSD + 3PL. Ticket potencial más alto del pipeline. Aún no hemos tenido primera conversación.",
    interacciones: [
      { id: "i5a", type: "Nota interna", date: "2026-04-18T09:00:00", author: "Luis H. Muro", content: "Prospecto registrado por referido de Héctor Vázquez (Bodegón del Norte). Roberto es su cuñado. Llamar antes del viernes 22 para agendar demo.", result: "" },
    ],
  },
  {
    id: "p6",
    nombre: "José Guzmán Villanueva",
    empresa: "Carnes y Derivados del Norte",
    cargo: "Gerente de Distribución",
    sector: "Cárnicos",
    email: "jguzman@carnesdelnorte.mx",
    telefono: "+52 81 7654 3210",
    whatsapp: "528176543210",
    etapa: "Contactado",
    valorEstimado: 78000,
    probabilidad: 30,
    fuente: "Llamada fría",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-03-25T11:00:00",
    proximoSeguimiento: "2026-04-25T11:00:00",
    notas: "8 rutas en zona metropolitana MTY. Sector cárnicos perecederos, FEFO crítico. Respondió bien a la llamada inicial pero dice que \"no tienen presupuesto este año\". Hay que explorar si es una objeción real o de timing.",
    interacciones: [
      { id: "i6a", type: "Email", date: "2026-03-28T09:00:00", author: "Luis H. Muro", content: "Envío de caso de éxito con empresa similar del sector cárnicos + video de 3 min del módulo FEFO. Asunto: 'Cómo reducir 40% la merma por caducidad en 60 días'.", result: "Abrió el email (tracking). Sin respuesta directa." },
      { id: "i6b", type: "Llamada", date: "2026-03-25T11:00:00", author: "Luis H. Muro", content: "Llamada fría de prospección. José respondió amablemente. Mencionó que tienen problemas con merma de producto pero el presupuesto para tech está congelado.", result: "Seguimiento en 30 días. Posible reactivación Q3." },
    ],
  },
  {
    id: "p7",
    nombre: "Sofía Martínez Leal",
    empresa: "Grupo Lácteos del Noreste",
    cargo: "Directora de TI y Operaciones",
    sector: "Lácteos",
    email: "sofia.martinez@lacteosne.mx",
    telefono: "+52 81 3333 7890",
    whatsapp: "528133337890",
    etapa: "Calificado",
    valorEstimado: 380000,
    probabilidad: 70,
    fuente: "Webinar Mr. Ruta",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-03-15T10:00:00",
    proximoSeguimiento: "2026-04-21T14:00:00",
    notas: "Asistió al webinar de logística DSD. 22 rutas, operan en NL, Coah y Tamps. Sofía tiene perfil muy técnico y ya revisó la documentación de la API. Quieren integración con su WMS actual (Oracle WMS Cloud).",
    interacciones: [
      { id: "i7a", type: "Reunión", date: "2026-04-16T10:00:00", author: "Luis H. Muro", content: "Visita presencial a sus oficinas en MTY. Duración 3 hrs. Se revisó arquitectura técnica detallada y roadmap de integración con Oracle WMS Cloud. Equipo técnico de Sofía muy involucrado.", result: "Avanzan a propuesta técnica-comercial. Plazo: esta semana." },
      { id: "i7b", type: "Llamada", date: "2026-04-03T09:00:00", author: "Luis H. Muro", content: "Llamada de calificación técnica. 45 min. Sofía ya había revisado la documentación de la API. Preguntas muy específicas sobre latencia offline y reconciliación de datos.", result: "Altamente calificada. Agendó visita presencial." },
      { id: "i7c", type: "Seguimiento", date: "2026-03-15T16:00:00", author: "Luis H. Muro", content: "Contacto post-webinar. Sofía dejó datos en el formulario de interés. Primera llamada de contacto para entender su operación.", result: "Interés alto. Agendó llamada técnica en 2 semanas." },
    ],
  },
  {
    id: "p8",
    nombre: "Héctor Vázquez Garza",
    empresa: "Bodegón del Norte",
    cargo: "Dueño / Director General",
    sector: "Consumo masivo",
    email: "hvazquez@bodegondelnorte.mx",
    telefono: "+52 81 9999 0011",
    whatsapp: "528199990011",
    etapa: "Cierre ganado",
    valorEstimado: 160000,
    probabilidad: 100,
    fuente: "Referido cliente",
    municipio: "Monterrey",
    estado: "Nuevo León",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-01-15T08:00:00",
    proximoSeguimiento: undefined,
    notas: "CLIENTE GANADO. Proceso de venta duró 45 días. Ahora es referente activo (ya refirió a Roberto Mendoza). Onboarding completado el 5 de abril. 10 rutas DSD activas en el sistema.",
    interacciones: [
      { id: "i8a", type: "Nota interna", date: "2026-04-05T10:00:00", author: "Luis H. Muro", content: "Onboarding completado exitosamente. 10 rutas migradas. Equipo capacitado (22 personas). Sistema Mr. Ruta activo desde hoy.", result: "Cliente operando al 100% en producción." },
      { id: "i8b", type: "Reunión", date: "2026-03-01T11:00:00", author: "Luis H. Muro", content: "Firma de contrato. Reunión de cierre con Héctor y su contador. Se firmó implementación de $160,000 MXN + mantenimiento mensual.", result: "CIERRE GANADO. Inicio de implementación en 2 semanas." },
      { id: "i8c", type: "Propuesta enviada", date: "2026-02-15T17:00:00", author: "Luis H. Muro", content: "Propuesta final enviada con descuento de implementación por pronto pago.", result: "Acceptó condiciones. Agendó firma para el 1ro de marzo." },
    ],
  },
  {
    id: "p9",
    nombre: "Fernando Ríos Castillo",
    empresa: "Grupo Distribución MX",
    cargo: "CFO",
    sector: "Consumo masivo",
    email: "frios@gdmx.com.mx",
    telefono: "+52 55 1234 5678",
    whatsapp: "525512345678",
    etapa: "Perdido",
    valorEstimado: 210000,
    probabilidad: 0,
    fuente: "Evento industria",
    municipio: "Ciudad de México",
    estado: "CDMX",
    ejecutivo: "Luis H. Muro",
    fechaCreacion: "2026-01-20T09:00:00",
    proximoSeguimiento: undefined,
    notas: "Perdido contra Optimobility. Precio fue el factor decisivo (Optimo ofreció 25% más barato). Dejaron abierta la puerta para reevaluar en 12 meses si Optimo no cumple expectativas.",
    interacciones: [
      { id: "i9a", type: "Llamada", date: "2026-03-10T14:00:00", author: "Luis H. Muro", content: "Fernando notificó que eligieron Optimobility por precio. Agradeció el proceso y pidió mantenerse en contacto.", result: "PERDIDO. Recontactar en enero 2027." },
      { id: "i9b", type: "Propuesta enviada", date: "2026-02-20T17:00:00", author: "Luis H. Muro", content: "Propuesta final enviada tras 3 rondas de negociación. Precio final ajustado al mínimo posible.", result: "En evaluación contra competidor." },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

const daysSince = (iso: string) =>
  differenceInDays(new Date(), parseISO(iso));

// ─── Prospect card (kanban + list) ─────────────────────────────────────────────

interface ProspectCardProps {
  prospect: Prospect;
  onClick: () => void;
  compact?: boolean;
}

const ProspectCard = ({ prospect, onClick, compact = false }: ProspectCardProps) => {
  const { badge } = stageConfig[prospect.etapa];
  const lastInteraction = prospect.interacciones[0];
  const daysAgo = lastInteraction ? daysSince(lastInteraction.date) : null;
  const isOverdue = prospect.proximoSeguimiento
    ? isPast(parseISO(prospect.proximoSeguimiento))
    : false;

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border ${
        isOverdue ? "border-danger/40 bg-danger/[0.02]" : "border-border"
      }`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-2">
            <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {getInitials(prospect.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">{prospect.nombre}</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Building2 className="h-3 w-3 shrink-0" />
                {prospect.empresa}
              </p>
              <p className="text-xs text-muted-foreground truncate">{prospect.cargo}</p>
            </div>
          </div>

          {/* Value + probability */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">
              {formatCurrency(prospect.valorEstimado)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{prospect.probabilidad}%</span>
              <Progress value={prospect.probabilidad} className="w-14 h-1.5" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border/60">
            <span className={`text-xs flex items-center gap-1 ${daysAgo !== null && daysAgo > 7 ? "text-warning" : "text-muted-foreground"}`}>
              <RefreshCw className="h-3 w-3" />
              {daysAgo === null
                ? "Sin actividad"
                : daysAgo === 0
                ? "Hoy"
                : `Hace ${daysAgo}d`}
            </span>
            {isOverdue ? (
              <span className="text-xs text-danger flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
                Seguimiento vencido
              </span>
            ) : prospect.proximoSeguimiento ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarClock className="h-3 w-3" />
                {format(parseISO(prospect.proximoSeguimiento), "d MMM", { locale: es })}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Baserow row → Prospect mapper ───────────────────────────────────────────

const VALID_STAGES = new Set<ProspectStage>([
  "Nuevo","Contactado","Calificado","Propuesta enviada","Negociación","Cierre ganado","Perdido",
]);

const rowToProspect = (row: Record<string, unknown>): Prospect => {
  const str = (v: unknown) => (v == null ? "" : String(v));
  const num = (v: unknown) => (v == null ? 0 : Number(v) || 0);

  // Etapa: puede venir como objeto {value} (single_select) o string
  let etapaRaw = row["Etapa"];
  if (etapaRaw && typeof etapaRaw === "object" && "value" in (etapaRaw as object)) {
    etapaRaw = (etapaRaw as { value: string }).value;
  }
  const etapa: ProspectStage = VALID_STAGES.has(etapaRaw as ProspectStage)
    ? (etapaRaw as ProspectStage)
    : "Nuevo";

  // Interacciones: string JSON o array
  let interacciones: Interaction[] = [];
  const rawInter = row["Interacciones"];
  if (typeof rawInter === "string" && rawInter.trim().startsWith("[")) {
    try { interacciones = JSON.parse(rawInter); } catch { /* ignore */ }
  } else if (Array.isArray(rawInter)) {
    interacciones = rawInter as Interaction[];
  }

  // Estado y municipio: prueba columnas directas (minúscula y mayúscula) y luego Notas
  const notas = str(row["Notas"]);
  const ciudadMatch = notas.match(/Ciudad:\s*([^,|]+),\s*([^|]+)/);
  const municipio =
    str(row["ciudad"] || row["Ciudad"] || row["municipio"] || row["Municipio"]) ||
    (ciudadMatch ? ciudadMatch[1].trim() : "");
  const estado =
    str(row["estado"] || row["Estado"]) ||
    (ciudadMatch ? ciudadMatch[2].trim() : "");

  // nombre_negocio → Empresa; categoria → Sector (fallbacks para importaciones del CSV)
  const empresa = str(row["Empresa"] || row["nombre_negocio"]);
  const sector  = str(row["Sector"]  || row["categoria"]);
  const telefono = str(row["Teléfono"] || row["telefono"]);
  const email    = str(row["Email"]    || row["email"]);

  return {
    id:                String(row["id"] ?? Math.random()),
    nombre:            str(row["Nombre"] || row["nombre_negocio"]),
    empresa,
    cargo:             str(row["Cargo"]),
    sector,
    email,
    telefono,
    whatsapp:          str(row["WhatsApp"]),
    etapa,
    valorEstimado:     num(row["Valor estimado"]),
    probabilidad:      num(row["Probabilidad"]),
    fuente:            str(row["Fuente"]),
    estado,
    municipio,
    ejecutivo:         str(row["Ejecutivo"]),
    fechaCreacion:     str(row["Fecha creación"]) || new Date().toISOString(),
    proximoSeguimiento: str(row["Próximo seguimiento"]) || undefined,
    interacciones,
    notas,
  };
};

// ─── Main view ────────────────────────────────────────────────────────────────

export const ProspectsView = () => {
  const { list: prospectsQuery, create, update, remove } = useProspects();

  // Mapear filas de Baserow al tipo Prospect
  const prospects: Prospect[] = useMemo(() => {
    const rows = (prospectsQuery.data as any)?.results ?? [];
    const mapped = rows.map(rowToProspect);
    // Añadir mock prospects sólo si Baserow no tiene datos aún
    return mapped.length > 0 ? mapped : MOCK_PROSPECTS;
  }, [prospectsQuery.data]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterMunicipio, setFilterMunicipio] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterSeguimiento, setFilterSeguimiento] = useState<string>("all");
  const [filterContacto, setFilterContacto] = useState(false);
  const [showLost, setShowLost] = useState(false);
  const [colExpanded, setColExpanded] = useState<Record<string, boolean>>({});
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const KANBAN_LIMIT = 25;

  // ── Derived ──
  const estados = useMemo(
    () => [...new Set(prospects.map((p) => p.estado).filter(Boolean))].sort(),
    [prospects]
  );

  // Municipios se limitan al estado seleccionado
  const municipios = useMemo(() => {
    const base = filterEstado === "all"
      ? prospects
      : prospects.filter((p) => p.estado === filterEstado);
    return [...new Set(base.map((p) => p.municipio).filter(Boolean))].sort();
  }, [prospects, filterEstado]);

  const sectores = useMemo(
    () => [...new Set(prospects.map((p) => p.sector).filter(Boolean))].sort(),
    [prospects]
  );

  const activeFiltersCount = [
    filterEstado !== "all",
    filterMunicipio !== "all",
    filterSector !== "all",
    filterSeguimiento !== "all",
    filterContacto,
    search.length > 0,
  ].filter(Boolean).length;

  const active = useMemo(
    () => prospects.filter((p) => p.etapa !== "Perdido" && p.etapa !== "Cierre ganado"),
    [prospects]
  );

  const pipelineValue = useMemo(
    () => active.reduce((sum, p) => sum + p.valorEstimado * (p.probabilidad / 100), 0),
    [active]
  );

  const overdueCount = useMemo(
    () => active.filter((p) =>
      p.proximoSeguimiento && isPast(parseISO(p.proximoSeguimiento))
    ).length,
    [active]
  );

  const wonThisMonth = useMemo(
    () => prospects.filter((p) => p.etapa === "Cierre ganado").length,
    [prospects]
  );

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (p.etapa === "Perdido" && !showLost) return false;
      if (filterStage !== "all" && p.etapa !== filterStage) return false;
      if (filterEstado    !== "all" && p.estado    !== filterEstado)    return false;
      if (filterMunicipio !== "all" && p.municipio !== filterMunicipio) return false;
      if (filterSector !== "all" && p.sector !== filterSector) return false;

      // Filtro: solo con contacto (teléfono o email)
      if (filterContacto && !p.telefono && !p.email) return false;

      // Filtro: seguimiento
      if (filterSeguimiento !== "all") {
        const sig = p.proximoSeguimiento ? parseISO(p.proximoSeguimiento) : null;
        if (filterSeguimiento === "vencido")       { if (!sig || !isPast(sig))       return false; }
        if (filterSeguimiento === "hoy")           { if (!sig || !isToday(sig))       return false; }
        if (filterSeguimiento === "semana")        { if (!sig || !isThisWeek(sig, { weekStartsOn: 1 })) return false; }
        if (filterSeguimiento === "sin_programar") { if (sig)                         return false; }
      }

      const q = search.toLowerCase();
      if (q) {
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.empresa.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          p.cargo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prospects, search, filterStage, filterEstado, filterMunicipio, filterSector, filterSeguimiento, filterContacto, showLost]);

  const byStage = useMemo(() => {
    const map: Record<ProspectStage, Prospect[]> = {
      "Nuevo": [], "Contactado": [], "Calificado": [],
      "Propuesta enviada": [], "Negociación": [],
      "Cierre ganado": [], "Perdido": [],
    };
    filtered.forEach((p) => {
      const bucket = map[p.etapa] ?? map["Nuevo"];
      bucket.push(p);
    });
    return map;
  }, [filtered]);

  // ── Callbacks ──
  const handleUpdate = (updated: Prospect) => {
    // Persist to Baserow
    const rowId = parseInt(updated.id, 10);
    if (!isNaN(rowId)) {
      update.mutate({
        id: rowId,
        data: {
          "Nombre":             updated.nombre,
          "Empresa":            updated.empresa,
          "Cargo":              updated.cargo,
          "Sector":             updated.sector,
          "Email":              updated.email,
          "Teléfono":           updated.telefono,
          "WhatsApp":           updated.whatsapp,
          "Etapa":              updated.etapa,
          "Valor estimado":     updated.valorEstimado,
          "Probabilidad":       updated.probabilidad,
          "Fuente":             updated.fuente,
          "Ejecutivo":          updated.ejecutivo,
          "Próximo seguimiento": updated.proximoSeguimiento ?? "",
          "Interacciones":      JSON.stringify(updated.interacciones),
          "Notas":              updated.notas,
        },
      });
    }
    setSelectedProspect(updated);
  };

  const handleCreate = (newP: Prospect) => {
    create.mutate({
      "Nombre":             newP.nombre,
      "Empresa":            newP.empresa,
      "Cargo":              newP.cargo,
      "Sector":             newP.sector,
      "Email":              newP.email,
      "Teléfono":           newP.telefono,
      "WhatsApp":           newP.whatsapp,
      "Etapa":              newP.etapa,
      "Valor estimado":     newP.valorEstimado,
      "Probabilidad":       newP.probabilidad,
      "Fuente":             newP.fuente,
      "Ejecutivo":          newP.ejecutivo,
      "Fecha creación":     newP.fechaCreacion,
      "Próximo seguimiento": newP.proximoSeguimiento ?? "",
      "Interacciones":      "[]",
      "Notas":              newP.notas,
    });
    setCreateOpen(false);
  };

  const openDetail = (p: Prospect) => {
    setSelectedProspect(p);
    setDetailOpen(true);
  };

  // ── KPI cards ──
  const kpis = [
    {
      label: "Prospectos activos",
      value: active.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-l-primary",
    },
    {
      label: "Pipeline ponderado",
      value: formatCurrency(pipelineValue),
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-l-secondary",
    },
    {
      label: "Seguimientos vencidos",
      value: overdueCount,
      icon: AlertTriangle,
      color: overdueCount > 0 ? "text-danger" : "text-success",
      bg: overdueCount > 0 ? "bg-danger/10" : "bg-success/10",
      border: overdueCount > 0 ? "border-l-danger" : "border-l-success",
    },
    {
      label: "Cierres ganados",
      value: wonThisMonth,
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-l-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Loading / error banner */}
      {prospectsQuery.isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Cargando prospectos desde Baserow...
        </div>
      )}
      {prospectsQuery.isError && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 px-4 py-2 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          Error al cargar desde Baserow. Mostrando datos locales.
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className={`border-l-4 ${k.border}`}>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`h-5 w-5 ${k.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Row 1: search + actions */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nombre, empresa, sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              {/* View toggle */}
              <div className="flex gap-1 border rounded-lg p-1">
                <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="sm"
                  onClick={() => setViewMode("kanban")} className="h-7 w-7 p-0">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm"
                  onClick={() => setViewMode("list")} className="h-7 w-7 p-0">
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant={showLost ? "default" : "outline"} size="sm"
                onClick={() => setShowLost((v) => !v)} className="gap-1.5">
                <EyeOff className="h-4 w-4" />
                Perdidos
              </Button>
              <Button className="bg-primary hover:bg-primary/90 gap-1.5"
                onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo
              </Button>
            </div>
          </div>

          {/* Row 2: smart filters */}
          <div className="flex flex-wrap gap-2 items-center pt-1 border-t border-border/60">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full text-[10px] h-4 w-4 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </span>

            {/* Sector */}
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger className={`w-[160px] h-8 text-xs ${filterSector !== "all" ? "border-primary text-primary" : ""}`}>
                <Tag className="h-3.5 w-3.5 mr-1 shrink-0" />
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                {sectores.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select
              value={filterEstado}
              onValueChange={(v) => {
                setFilterEstado(v);
                setFilterMunicipio("all"); // reset municipio al cambiar estado
              }}
            >
              <SelectTrigger className={`w-[160px] h-8 text-xs ${filterEstado !== "all" ? "border-primary text-primary" : ""}`}>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {estados.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Municipio — limitado al estado seleccionado */}
            <Select value={filterMunicipio} onValueChange={setFilterMunicipio}>
              <SelectTrigger className={`w-[165px] h-8 text-xs ${filterMunicipio !== "all" ? "border-primary text-primary" : ""}`}>
                <SelectValue placeholder={filterEstado === "all" ? "Municipio" : `Municipio (${municipios.length})`} />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">
                  {filterEstado === "all" ? "Todos los municipios" : `Todos (${municipios.length})`}
                </SelectItem>
                {municipios.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Seguimiento */}
            <Select value={filterSeguimiento} onValueChange={setFilterSeguimiento}>
              <SelectTrigger className={`w-[180px] h-8 text-xs ${filterSeguimiento !== "all" ? "border-warning text-warning" : ""}`}>
                <CalendarClock className="h-3.5 w-3.5 mr-1 shrink-0" />
                <SelectValue placeholder="Seguimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los seguimientos</SelectItem>
                <SelectItem value="vencido">⚠️ Vencido</SelectItem>
                <SelectItem value="hoy">📅 Hoy</SelectItem>
                <SelectItem value="semana">📆 Esta semana</SelectItem>
                <SelectItem value="sin_programar">⏸ Sin programar</SelectItem>
              </SelectContent>
            </Select>

            {/* Solo con contacto */}
            <Button
              variant={filterContacto ? "default" : "outline"} size="sm"
              onClick={() => setFilterContacto((v) => !v)}
              className={`h-8 text-xs gap-1.5 ${filterContacto ? "bg-primary" : ""}`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Con contacto
            </Button>

            {/* Limpiar filtros */}
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground gap-1"
                onClick={() => {
                  setFilterSector("all");
                  setFilterEstado("all");
                  setFilterMunicipio("all");
                  setFilterSeguimiento("all");
                  setFilterContacto(false);
                  setSearch("");
                }}>
                Limpiar filtros
              </Button>
            )}

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} prospecto{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Kanban view */}
      {viewMode === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGES.map((stage) => {
              const cfg = stageConfig[stage];
              const cards = byStage[stage];
              const isExpanded = colExpanded[stage] ?? false;
              const visibleCards = isExpanded ? cards : cards.slice(0, KANBAN_LIMIT);
              const hiddenCount = cards.length - KANBAN_LIMIT;
              const colValue = cards.reduce((s, p) => s + p.valorEstimado, 0);
              return (
                <div key={stage} className="w-64 flex flex-col gap-2">
                  {/* Column header */}
                  <div className={`rounded-xl border-t-4 ${cfg.colHeader} ${cfg.colBg} p-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <span className="text-xs font-semibold text-foreground">{stage}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                        {cards.length}
                      </Badge>
                    </div>
                    {colValue > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {formatCurrency(colValue)}
                      </p>
                    )}
                    {cards.length > KANBAN_LIMIT && !isExpanded && (
                      <p className="text-[10px] text-warning mt-0.5 font-medium">
                        Mostrando {KANBAN_LIMIT} de {cards.length}
                      </p>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {visibleCards.map((p) => (
                      <ProspectCard key={p.id} prospect={p} onClick={() => openDetail(p)} />
                    ))}
                    {cards.length === 0 && (
                      <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground">Sin prospectos</p>
                      </div>
                    )}
                    {/* Ver más / Colapsar */}
                    {cards.length > KANBAN_LIMIT && (
                      <button
                        onClick={() => setColExpanded((prev) => ({ ...prev, [stage]: !isExpanded }))}
                        className="w-full text-xs text-primary font-medium py-2 rounded-lg border border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>Colapsar</>
                        ) : (
                          <>
                            <ChevronRight className="h-3.5 w-3.5" />
                            Ver {hiddenCount} más
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Lost column — only if showLost */}
            {showLost && (() => {
              const lostCards = byStage["Perdido"];
              const isLostExpanded = colExpanded["Perdido"] ?? false;
              const visibleLost = isLostExpanded ? lostCards : lostCards.slice(0, KANBAN_LIMIT);
              return (
                <div className="w-64 flex flex-col gap-2">
                  <div className={`rounded-xl border-t-4 ${stageConfig["Perdido"].colHeader} ${stageConfig["Perdido"].colBg} p-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${stageConfig["Perdido"].dot}`} />
                        <span className="text-xs font-semibold text-foreground">Perdido</span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                        {lostCards.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {visibleLost.map((p) => (
                      <ProspectCard key={p.id} prospect={p} onClick={() => openDetail(p)} />
                    ))}
                    {lostCards.length > KANBAN_LIMIT && (
                      <button
                        onClick={() => setColExpanded((prev) => ({ ...prev, "Perdido": !isLostExpanded }))}
                        className="w-full text-xs text-primary font-medium py-2 rounded-lg border border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-1 transition-colors"
                      >
                        {isLostExpanded ? "Colapsar" : <>
                          <ChevronRight className="h-3.5 w-3.5" />
                          Ver {lostCards.length - KANBAN_LIMIT} más
                        </>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No se encontraron prospectos</p>
                </div>
              )}
              {filtered.map((p) => {
                const cfg = stageConfig[p.etapa];
                const lastInt = p.interacciones[0];
                const isOverdue = p.proximoSeguimiento && isPast(parseISO(p.proximoSeguimiento));
                return (
                  <div
                    key={p.id}
                    onClick={() => openDetail(p)}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <Avatar className="h-10 w-10 shrink-0 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {getInitials(p.nombre)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{p.nombre}</p>
                        <Badge variant="secondary" className={`text-xs ${cfg.badge}`}>
                          {p.etapa}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" /> Vencido
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.empresa} · {p.cargo}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(p.valorEstimado)}</p>
                        <p className="text-xs text-muted-foreground">{p.probabilidad}% prob.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Últ. contacto</p>
                        <p className="text-xs font-medium">
                          {lastInt
                            ? format(parseISO(lastInt.date), "d MMM", { locale: es })
                            : "—"}
                        </p>
                      </div>
                      <div className="text-right w-28">
                        <p className="text-xs text-muted-foreground">Próx. seguimiento</p>
                        <p className={`text-xs font-medium ${isOverdue ? "text-danger" : ""}`}>
                          {p.proximoSeguimiento
                            ? format(parseISO(p.proximoSeguimiento), "d MMM yyyy", { locale: es })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {p.whatsapp && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600"
                          onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${p.whatsapp}`, "_blank"); }}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {p.email && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                          onClick={(e) => { e.stopPropagation(); window.open(`mailto:${p.email}`, "_blank"); }}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      {selectedProspect && (
        <ProspectDetailDialog
          prospect={selectedProspect}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdate={handleUpdate}
        />
      )}

      {/* Create dialog */}
      <CreateProspectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </div>
  );
};
