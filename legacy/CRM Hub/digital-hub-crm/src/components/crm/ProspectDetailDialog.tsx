import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Phone, Mail, MessageCircle, Edit2, Check,
  Send, FileText, RefreshCw, CalendarDays,
  Building2, MapPin, UserCheck, DollarSign,
  TrendingUp, Clock, ChevronRight, AlertTriangle,
  Users, Star, Save, X,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Prospect, ProspectStage, InteractionType, Interaction,
  STAGES, stageConfig,
} from "./ProspectsView";

// ─── Interaction config ────────────────────────────────────────────────────────

type IntConfig = { icon: any; color: string; bg: string; label: string };

const interactionConfig: Record<InteractionType, IntConfig> = {
  "Llamada":           { icon: Phone,        color: "text-blue-600",    bg: "bg-blue-100",   label: "Llamada"           },
  "Email":             { icon: Mail,         color: "text-violet-600",  bg: "bg-violet-100", label: "Email"             },
  "WhatsApp":          { icon: MessageCircle,color: "text-green-600",   bg: "bg-green-100",  label: "WhatsApp"          },
  "Reunión":           { icon: Users,        color: "text-orange-600",  bg: "bg-orange-100", label: "Reunión"           },
  "Nota interna":      { icon: FileText,     color: "text-gray-500",    bg: "bg-gray-100",   label: "Nota interna"      },
  "Propuesta enviada": { icon: Send,         color: "text-primary",     bg: "bg-primary/10", label: "Propuesta enviada" },
  "Seguimiento":       { icon: RefreshCw,    color: "text-amber-600",   bg: "bg-amber-100",  label: "Seguimiento"       },
};

const INTERACTION_TYPES: InteractionType[] = [
  "Llamada", "Email", "WhatsApp", "Reunión",
  "Nota interna", "Propuesta enviada", "Seguimiento",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

const relativeDate = (iso: string) => {
  const days = differenceInDays(new Date(), parseISO(iso));
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  return format(parseISO(iso), "d 'de' MMMM yyyy", { locale: es });
};

// ─── Stage stepper ────────────────────────────────────────────────────────────

interface StageStepperProps {
  current: ProspectStage;
  onChange: (s: ProspectStage) => void;
}

const StageStepper = ({ current, onChange }: StageStepperProps) => {
  const activeIdx = STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {STAGES.map((stage, idx) => {
        const done = idx < activeIdx;
        const active = idx === activeIdx;
        const cfg = stageConfig[stage];
        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            className={`
              flex items-center shrink-0 text-xs px-3 py-1.5 transition-all
              first:rounded-l-full last:rounded-r-full
              border border-r-0 last:border-r
              ${active
                ? `${cfg.badge} font-semibold`
                : done
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
              }
            `}
          >
            {done && <Check className="h-3 w-3 mr-1 shrink-0" />}
            {stage}
          </button>
        );
      })}
    </div>
  );
};

// ─── Timeline entry ───────────────────────────────────────────────────────────

const TimelineEntry = ({ entry }: { entry: Interaction }) => {
  const cfg = interactionConfig[entry.type];
  const Icon = cfg.icon;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-4 w-4 ${cfg.color}`} />
        </div>
        <div className="w-px flex-1 bg-border mt-1" />
      </div>
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${cfg.color}`}>{entry.type}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{relativeDate(entry.date)}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground font-medium">{entry.author}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{entry.content}</p>
        {entry.result && (
          <div className="mt-2 flex items-start gap-1.5 bg-muted/60 rounded-lg px-3 py-2">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground italic">{entry.result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Add interaction form ─────────────────────────────────────────────────────

interface AddInteractionProps {
  onAdd: (interaction: Interaction) => void;
}

const AddInteractionForm = ({ onAdd }: AddInteractionProps) => {
  const [type, setType] = useState<InteractionType>("Llamada");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [author, setAuthor] = useState("Luis H. Muro");

  const handleSubmit = () => {
    if (!content.trim()) return;
    const entry: Interaction = {
      id: `i-${Date.now()}`,
      type,
      date: new Date().toISOString(),
      author,
      content: content.trim(),
      result: result.trim() || undefined,
    };
    onAdd(entry);
    setContent("");
    setResult("");
  };

  const SelectedIcon = interactionConfig[type].icon;

  return (
    <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/30">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
        Registrar interacción
      </p>

      {/* Type selector */}
      <div className="flex gap-1.5 flex-wrap">
        {INTERACTION_TYPES.map((t) => {
          const cfg = interactionConfig[t];
          const TIcon = cfg.icon;
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`
                flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all
                ${type === t
                  ? `${cfg.bg} ${cfg.color} border-current font-semibold`
                  : "bg-background border-border text-muted-foreground hover:border-primary/40"}
              `}
            >
              <TIcon className="h-3 w-3" />
              {t}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Textarea
        placeholder="¿Qué ocurrió en esta interacción? Sé específico: temas discutidos, reacciones, objeciones..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] text-sm resize-none"
      />

      {/* Result */}
      <Input
        placeholder="Resultado / siguiente acción acordada (opcional)"
        value={result}
        onChange={(e) => setResult(e.target.value)}
        className="text-sm"
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-5 w-5 rounded-full ${interactionConfig[type].bg} flex items-center justify-center`}>
            <SelectedIcon className={`h-3 w-3 ${interactionConfig[type].color}`} />
          </div>
          <span className="text-xs text-muted-foreground">{author}</span>
        </div>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          Registrar
        </Button>
      </div>
    </div>
  );
};

// ─── Main dialog ──────────────────────────────────────────────────────────────

interface Props {
  prospect: Prospect;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdate: (p: Prospect) => void;
}

export const ProspectDetailDialog = ({ prospect, open, onOpenChange, onUpdate }: Props) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(prospect.notas);
  const [editingFollowup, setEditingFollowup] = useState(false);
  const [followupDate, setFollowupDate] = useState(
    prospect.proximoSeguimiento
      ? prospect.proximoSeguimiento.split("T")[0]
      : ""
  );

  const cfg = stageConfig[prospect.etapa];
  const daysInPipeline = differenceInDays(new Date(), parseISO(prospect.fechaCreacion));
  const lastInt = prospect.interacciones[0];

  const changeStage = (stage: ProspectStage) => {
    onUpdate({ ...prospect, etapa: stage });
  };

  const saveNotes = () => {
    onUpdate({ ...prospect, notas: notes });
    setEditingNotes(false);
  };

  const saveFollowup = () => {
    onUpdate({
      ...prospect,
      proximoSeguimiento: followupDate ? `${followupDate}T09:00:00` : undefined,
    });
    setEditingFollowup(false);
  };

  const addInteraction = (entry: Interaction) => {
    onUpdate({
      ...prospect,
      interacciones: [entry, ...prospect.interacciones],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 gap-0">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-border space-y-3">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                    {getInitials(prospect.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl font-bold leading-tight">
                    {prospect.nombre}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {prospect.cargo} · {prospect.empresa}
                  </p>
                </div>
              </div>

              {/* Quick contact */}
              <div className="flex gap-2 shrink-0">
                {prospect.whatsapp && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1.5"
                    onClick={() => window.open(`https://wa.me/${prospect.whatsapp}`, "_blank")}>
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                )}
                {prospect.email && (
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => window.open(`mailto:${prospect.email}`, "_blank")}>
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                )}
                {prospect.telefono && (
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => window.open(`tel:${prospect.telefono}`, "_blank")}>
                    <Phone className="h-4 w-4" /> Llamar
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Stage stepper */}
          <StageStepper current={prospect.etapa} onChange={changeStage} />
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel */}
          <div className="w-72 shrink-0 border-r border-border overflow-y-auto p-4 space-y-4">

            {/* Deal value */}
            <div className="bg-primary/5 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor estimado</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(prospect.valorEstimado)}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Probabilidad</span>
                  <span className="font-semibold text-foreground">{prospect.probabilidad}%</span>
                </div>
                <Progress value={prospect.probabilidad} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Pond.: {formatCurrency(prospect.valorEstimado * prospect.probabilidad / 100)}
                </p>
              </div>
            </div>

            {/* Info grid */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Empresa</p>
                  <p className="text-sm font-medium">{prospect.empresa}</p>
                  <p className="text-xs text-muted-foreground">{prospect.sector}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ejecutivo asignado</p>
                  <p className="text-sm font-medium">{prospect.ejecutivo}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Fuente</p>
                  <p className="text-sm font-medium">{prospect.fuente}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">En pipeline</p>
                  <p className="text-sm font-medium">{daysInPipeline} días</p>
                  <p className="text-xs text-muted-foreground">
                    Desde {format(parseISO(prospect.fechaCreacion), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-xs font-medium break-all">{prospect.email}</p>
                </div>
              </div>

              {prospect.telefono && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">{prospect.telefono}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Próximo seguimiento */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Próximo seguimiento</p>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                  onClick={() => setEditingFollowup((v) => !v)}>
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              {editingFollowup ? (
                <div className="space-y-2">
                  <Input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)} className="text-sm" />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs" onClick={saveFollowup}>Guardar</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setEditingFollowup(false)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  prospect.proximoSeguimiento
                    ? "bg-primary/5"
                    : "bg-muted/50 border-dashed border border-border"
                }`}>
                  <CalendarDays className={`h-4 w-4 shrink-0 ${
                    prospect.proximoSeguimiento ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <span className={`text-sm ${
                    prospect.proximoSeguimiento ? "font-semibold text-primary" : "text-muted-foreground"
                  }`}>
                    {prospect.proximoSeguimiento
                      ? format(parseISO(prospect.proximoSeguimiento), "EEEE d 'de' MMMM", { locale: es })
                      : "Sin fecha programada"}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Notas del ejecutivo</p>
                {!editingNotes && (
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                    onClick={() => setEditingNotes(true)}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-sm min-h-[120px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs gap-1" onClick={saveNotes}>
                      <Save className="h-3 w-3" /> Guardar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs gap-1"
                      onClick={() => { setNotes(prospect.notas); setEditingNotes(false); }}>
                      <X className="h-3 w-3" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {prospect.notas || "Sin notas."}
                </p>
              )}
            </div>

            {/* Mark as lost */}
            {prospect.etapa !== "Perdido" && prospect.etapa !== "Cierre ganado" && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-danger border-danger/40 hover:bg-danger/5"
                  onClick={() => changeStage("Perdido")}
                >
                  Marcar como Perdido
                </Button>
              </>
            )}
          </div>

          {/* Right panel — timeline */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="actividad" className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 pt-4 border-b border-border">
                <TabsList className="h-9">
                  <TabsTrigger value="actividad" className="text-xs gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Actividad ({prospect.interacciones.length})
                  </TabsTrigger>
                  <TabsTrigger value="proximas" className="text-xs gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Próximas acciones
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Actividad tab */}
              <TabsContent value="actividad" className="flex-1 overflow-y-auto p-5 space-y-4 m-0">
                {/* Add interaction */}
                <AddInteractionForm onAdd={addInteraction} />

                {/* Timeline */}
                {prospect.interacciones.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin actividad registrada.</p>
                    <p className="text-xs mt-1">Registra la primera interacción arriba.</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    {prospect.interacciones.map((entry) => (
                      <TimelineEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Próximas acciones tab */}
              <TabsContent value="proximas" className="flex-1 overflow-y-auto p-5 space-y-4 m-0">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Checklist de seguimiento senior
                  </p>

                  {[
                    { icon: Phone,     label: "Llamada de seguimiento programada",    done: !!prospect.proximoSeguimiento },
                    { icon: FileText,  label: "Propuesta enviada y confirmada",        done: ["Propuesta enviada","Negociación","Cierre ganado"].includes(prospect.etapa) },
                    { icon: Users,     label: "Demo técnica realizada",               done: ["Calificado","Propuesta enviada","Negociación","Cierre ganado"].includes(prospect.etapa) },
                    { icon: DollarSign,label: "Presupuesto del cliente confirmado",   done: ["Negociación","Cierre ganado"].includes(prospect.etapa) },
                    { icon: Star,      label: "Sponsor interno identificado",         done: prospect.interacciones.some(i => i.type === "Reunión") },
                    { icon: Check,     label: "Contrato revisado por ambas partes",   done: prospect.etapa === "Cierre ganado" },
                  ].map(({ icon: Icon, label, done }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 rounded-lg border ${
                      done
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-muted/30"
                    }`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                        done ? "bg-success/20" : "bg-muted"
                      }`}>
                        <Icon className={`h-3.5 w-3.5 ${done ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-sm flex-1 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {label}
                      </span>
                      {done && <Check className="h-4 w-4 text-success shrink-0" />}
                    </div>
                  ))}

                  <Separator />

                  {/* Objection log */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Posibles objeciones detectadas
                    </p>
                    {prospect.interacciones
                      .filter(i => i.content.toLowerCase().includes("precio") ||
                                   i.content.toLowerCase().includes("presupuesto") ||
                                   i.content.toLowerCase().includes("competi") ||
                                   i.content.toLowerCase().includes("integr"))
                      .slice(0, 3)
                      .map(i => {
                        const cfg = interactionConfig[i.type];
                        const Icon = cfg.icon;
                        return (
                          <div key={i.id} className="flex items-start gap-2 p-2 rounded-lg bg-warning/5 border border-warning/20 mb-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                            <p className="text-xs text-foreground leading-relaxed line-clamp-2">{i.content}</p>
                          </div>
                        );
                      })}
                    {prospect.interacciones.filter(i =>
                      i.content.toLowerCase().includes("precio") ||
                      i.content.toLowerCase().includes("presupuesto") ||
                      i.content.toLowerCase().includes("competi") ||
                      i.content.toLowerCase().includes("integr")
                    ).length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        No se detectaron objeciones en la actividad registrada.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
