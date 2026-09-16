import { Calendar, Plus, MapPin, Video, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMeetings } from "@/hooks/baserowHooks";
import { format, isToday, isFuture, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Meeting {
  id: string;
  title: string;
  client: string;
  clientInitials: string;
  time: string;
  duration: string;
  location: string;
  locationType: "zoom" | "office" | "other";
  objective: string;
  isUpcoming: boolean;
}

const locationIcons = {
  zoom: Video,
  office: MapPin,
  other: MapPin,
};

interface MeetingsTodayProps {
  onNavigate?: () => void;
}

export const MeetingsToday = ({ onNavigate }: MeetingsTodayProps) => {
  const { list } = useMeetings();
  const { data: meetingsData, isLoading } = list;

  const allMeetings = (meetingsData as any)?.results ?? [];

  // Obtener las 3 reuniones más cercanas (futuras o de hoy) ordenadas por fecha
  const upcomingMeetings = allMeetings
    .filter((meeting: any) => {
      const meetingDate = meeting["Fecha"] || meeting["Fecha y hora"];
      if (!meetingDate) return false;
      
      const date = new Date(meetingDate);
      const now = new Date();
      
      // Incluir reuniones de hoy o futuras
      return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a["Fecha"] || a["Fecha y hora"]).getTime();
      const dateB = new Date(b["Fecha"] || b["Fecha y hora"]).getTime();
      return dateA - dateB;
    })
    .slice(0, 3); // Solo las 3 más cercanas

  const getTimeStatus = (meetingDate: string) => {
    const date = new Date(meetingDate);
    const now = new Date();
    
    // Si es hoy y la hora ya pasó o está por venir
    if (isToday(date)) {
      return "bg-success text-success-foreground";
    }
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Próximas Reuniones
            </CardTitle>
            <CardDescription>3 eventos más cercanos</CardDescription>
          </div>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={onNavigate}>
            <Plus className="h-4 w-4 mr-1" />
            Nueva
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-auto">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Cargando reuniones...</p>
          </div>
        ) : upcomingMeetings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Día libre 🎉</p>
            <p className="text-sm">No tienes reuniones próximas</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

            <div className="space-y-6">
              {upcomingMeetings.map((meeting: any) => {
                const meetingDate = meeting["Fecha"] || meeting["Fecha y hora"];
                const meetingTime = meetingDate ? format(new Date(meetingDate), "HH:mm") : "--:--";
                const meetingDateFormatted = meetingDate ? format(new Date(meetingDate), "d MMM", { locale: es }) : "";
                const location = meeting["Ubicación"] || meeting["Lugar"] || "No especificado";
                const locationType = location.toLowerCase().includes("zoom") ? "zoom" : "office";
                const LocationIcon = locationIcons[locationType];
                const isTodayMeeting = meetingDate ? isToday(new Date(meetingDate)) : false;
                
                return (
                  <div key={meeting.id} className="relative pl-14">
                    {/* Time circle */}
                    <div
                      className={`absolute left-0 top-2 w-12 h-12 rounded-full ${getTimeStatus(
                        meetingDate
                      )} flex items-center justify-center font-bold text-xs shadow-md z-10`}
                    >
                      {meetingTime}
                    </div>

                    <Card
                      className={`hover:shadow-lg transition-all duration-200 ${
                        isTodayMeeting ? "border-success border-2" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-1">{meeting["Título"] || "Sin título"}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {meeting["Cliente"] && (
                                <>
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-xs bg-secondary/10 text-secondary">
                                      {meeting["Cliente"].substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{meeting["Cliente"]}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              <LocationIcon className="h-3 w-3 mr-1" />
                              {location}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {meetingDateFormatted}
                            </Badge>
                          </div>

                          {isTodayMeeting && meeting["Enlace"] && (
                            <Button
                              size="sm"
                              className="w-full bg-success hover:bg-success/90 animate-pulse"
                              onClick={() => window.open(meeting["Enlace"], "_blank")}
                            >
                              Unirse a la Reunión
                            </Button>
                          )}

                          {meeting["Notas"] && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Ver notas
                              </summary>
                              <p className="mt-2 text-muted-foreground">{meeting["Notas"]}</p>
                            </details>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
