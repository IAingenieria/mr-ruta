import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Truck,
  Bell,
  Search,
  Users,
  TrendingUp,
  CheckSquare,
  Calendar,
  CalendarDays,
  DollarSign,
  LayoutDashboard,
  FileText,
  CalendarCheck,
  User,
  Clock,
  LogOut
} from "lucide-react";
import { logout } from "@/components/auth/LoginPage";
import { DashboardView } from "@/components/crm/DashboardView";
import { ProspectsView } from "@/components/crm/ProspectsView";
import { QuotesView } from "@/components/crm/QuotesView";
import { TasksView } from "@/components/crm/TasksView";
import { ClientsView } from "@/components/crm/ClientsView";
import { MeetingsView } from "@/components/crm/MeetingsView";
import { CalendarView } from "@/components/crm/CalendarView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTasks } from "@/hooks/baserowHooks";

type View = "dashboard" | "prospects" | "clients" | "quotes" | "tasks" | "meetings" | "calendar" | "citas";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const { list } = useTasks();
  const { data: tasksData } = list;

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });

  const tasks = (tasksData as any)?.results ?? [];
  const tasksWithReminder = tasks.filter((task: any) => {
    const hasReminder = task["Recordatorio"];
    const isNotCompleted = (task["Estado"]?.value || task["Estado"]) !== "Completada";
    return hasReminder && isNotCompleted;
  });
  
  const notificationCount = tasksWithReminder.length;

  const tabs = [
    { id: "dashboard" as View,  label: "Dashboard",    icon: LayoutDashboard },
    { id: "prospects" as View,  label: "Prospectos",   icon: TrendingUp      },
    { id: "clients" as View,    label: "Clientes",     icon: Users           },
    { id: "quotes" as View,     label: "Cotizaciones", icon: FileText        },
    { id: "tasks" as View,      label: "Tareas",       icon: CheckSquare     },
    { id: "meetings" as View,   label: "Reuniones",    icon: Calendar        },
    { id: "calendar" as View,   label: "Calendario",   icon: CalendarDays    },
    { id: "citas" as View,      label: "Citas",        icon: CalendarCheck   },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground">
                <Truck className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-foreground">Mr. Ruta</h1>
                <p className="text-xs text-muted-foreground capitalize">{today}</p>
              </div>
            </div>

            {/* Center: Date on mobile */}
            <div className="md:hidden">
              <p className="text-xs text-muted-foreground capitalize">{format(new Date(), "d MMM", { locale: es })}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search */}
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-64 bg-muted/50"
                />
              </div>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-danger text-danger-foreground text-xs">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">Tareas con Recordatorio</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notificationCount} {notificationCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}
                    </p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {tasksWithReminder.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No hay tareas con recordatorio
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {tasksWithReminder.map((task: any) => (
                          <div key={task.id} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setCurrentView("tasks")}>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <Clock className="h-4 w-4 text-orange-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {task["Título"] || "Sin título"}
                                </p>
                                {task["Fecha límite"] && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Vence: {format(new Date(task["Fecha límite"]), "d 'de' MMMM", { locale: es })}
                                  </p>
                                )}
                                {task["Descripción"] && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {task["Descripción"]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Avatar + Logout */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-2">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground mb-1">{import.meta.env.VITE_CRM_EMAIL}</div>
                  <button
                    onClick={() => { logout(); window.location.reload(); }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-muted text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap
                    transition-all duration-200 border-b-2 hover:bg-muted/50
                    ${isActive 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-6">
        {currentView === "dashboard" && (
          <DashboardView 
            onNavigateToCitas={() => setCurrentView("citas")}
            onNavigateToQuotes={() => setCurrentView("quotes")}
            onNavigateToTasks={() => setCurrentView("tasks")}
            onNavigateToMeetings={() => setCurrentView("meetings")}
            onNavigateToClients={() => setCurrentView("clients")}
          />
        )}
        {currentView === "prospects" && <ProspectsView />}
        {currentView === "clients" && <ClientsView />}
        {currentView === "quotes" && <QuotesView />}
        {currentView === "tasks" && <TasksView />}
        {currentView === "meetings" && <MeetingsView />}
        {currentView === "calendar" && <CalendarView />}
        {currentView === "citas" && (
          <div className="w-full h-[calc(100vh-180px)] rounded-lg overflow-hidden border border-border">
            {/* TODO: Reemplazar con la URL de cal.com de Mr. Ruta cuando esté disponible */}
            <iframe
              src="https://cal.com/mr-ruta"
              className="w-full h-full"
              frameBorder="0"
              allow="camera; microphone; fullscreen; payment"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
