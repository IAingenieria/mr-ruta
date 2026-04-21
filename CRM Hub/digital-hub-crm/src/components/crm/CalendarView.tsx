import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const CAL_API_KEY = "cal_live_7e16b2e3e38a304532bcf6a271aa4be2";
const CAL_API_BASE = "https://api.cal.com/v1";

interface CalBooking {
  id: number;
  uid: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  attendees: {
    email: string;
    name: string;
    timeZone: string;
  }[];
  user?: {
    email: string;
    name: string;
  };
  eventType?: {
    title: string;
    slug: string;
  };
  location?: string;
  metadata?: Record<string, unknown>;
}

interface CalEventType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  length: number;
  hidden: boolean;
}

export const CalendarView = () => {
  const [bookings, setBookings] = useState<CalBooking[]>([]);
  const [eventTypes, setEventTypes] = useState<CalEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${CAL_API_BASE}/bookings?apiKey=${CAL_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener reservas");
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error al cargar las reservas de Cal.com");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await fetch(
        `${CAL_API_BASE}/event-types?apiKey=${CAL_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener tipos de eventos");
      }
      const data = await response.json();
      setEventTypes(data.event_types || []);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEventTypes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
      case "rejected":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime);
    return (
      bookingDate.toDateString() === selectedDate.toDateString()
    );
  });

  const upcomingBookings = bookings
    .filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate >= new Date() && booking.status !== "cancelled";
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const bookingDates = bookings.map((b) => new Date(b.startTime).toDateString());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Calendario Cal.com
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus reuniones y citas desde Cal.com
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBookings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button asChild>
            <a
              href="https://app.cal.com/bookings/upcoming"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Cal.com
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Seleccionar Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={es}
              className="rounded-md border"
              modifiers={{
                hasBooking: (date) =>
                  bookingDates.includes(date.toDateString()),
              }}
              modifiersStyles={{
                hasBooking: {
                  backgroundColor: "hsl(var(--primary) / 0.2)",
                  fontWeight: "bold",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Bookings for selected date */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>
                Citas del{" "}
                {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </span>
              <Badge variant="secondary">{filteredBookings.length} citas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay citas para esta fecha</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximas Citas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay citas próximas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} compact />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Types */}
      {eventTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Eventos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventTypes
                .filter((et) => !et.hidden)
                .map((eventType) => (
                  <Card key={eventType.id} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{eventType.title}</h4>
                          {eventType.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {eventType.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{eventType.length} minutos</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface BookingCardProps {
  booking: CalBooking;
  compact?: boolean;
}

const BookingCard = ({ booking, compact = false }: BookingCardProps) => {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
      case "rejected":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  if (compact) {
    return (
      <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium line-clamp-1">{booking.title}</h4>
            <Badge className={getStatusColor(booking.status)} variant="secondary">
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(startTime, "d MMM, yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
              </span>
            </div>
            {booking.attendees?.[0] && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{booking.attendees[0].name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-lg">{booking.title}</h4>
            {booking.eventType && (
              <p className="text-sm text-muted-foreground">
                {booking.eventType.title}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(booking.status)} variant="secondary">
            {getStatusLabel(booking.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </span>
          </div>

          {booking.attendees?.map((attendee, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="line-clamp-1">
                {attendee.name} ({attendee.email})
              </span>
            </div>
          ))}

          {booking.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {booking.location.includes("http") ? (
                <Video className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="line-clamp-1">{booking.location}</span>
            </div>
          )}
        </div>

        {booking.description && (
          <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
            {booking.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
