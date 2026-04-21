import { Users, CheckSquare, Calendar, DollarSign, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TasksToday } from "./TasksToday";
import { MeetingsToday } from "./MeetingsToday";

interface DashboardViewProps {
  onNavigateToCitas?: () => void;
  onNavigateToQuotes?: () => void;
  onNavigateToTasks?: () => void;
  onNavigateToMeetings?: () => void;
  onNavigateToClients?: () => void;
}

export const DashboardView = ({ 
  onNavigateToCitas, 
  onNavigateToQuotes,
  onNavigateToTasks,
  onNavigateToMeetings,
  onNavigateToClients
}: DashboardViewProps) => {
  const stats = [
    {
      title: "Clientes Activos",
      value: "24",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-l-primary",
    },
    {
      title: "Tareas Pendientes",
      value: "8",
      icon: CheckSquare,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-l-success",
    },
    {
      title: "Juntas Programadas",
      value: "3",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-l-secondary",
    },
    {
      title: "Pipeline Total",
      value: "$45,000",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-l-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alert de tareas urgentes */}
      <Alert className="border-danger bg-danger/5">
        <AlertCircle className="h-4 w-4 text-danger" />
        <AlertDescription className="text-sm">
          Tienes <strong>2 tareas urgentes</strong> para hoy que requieren tu atención inmediata.
        </AlertDescription>
      </Alert>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`border-l-4 ${stat.borderColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sección "Mi Día" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksToday />
        <MeetingsToday onNavigate={onNavigateToCitas} />
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          <CardDescription>Crea nuevos elementos con un solo click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="h-auto py-4 flex-col gap-2 bg-primary hover:bg-primary/90" onClick={onNavigateToClients}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nuevo Cliente</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-success hover:bg-success/90" onClick={onNavigateToTasks}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nueva Tarea</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-secondary hover:bg-secondary/90" onClick={onNavigateToMeetings}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nueva Junta</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-warning hover:bg-warning/90" onClick={onNavigateToQuotes}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nueva Cotización</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
