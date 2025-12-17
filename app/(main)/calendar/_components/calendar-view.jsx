"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/actions/calendar";
import { toast } from "sonner";
import EventForm from "./event-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CalendarView({ initialEvents }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents || []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh events when month changes
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);
        const endDate = new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 2, 0);
        const updatedEvents = await getCalendarEvents(startDate, endDate);
        setEvents(updatedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date) => {
    if (!events || events.length === 0) return [];
    return events.filter((event) => {
      if (!event || !event.startDate) return false;
      try {
        const eventDate = new Date(event.startDate);
        return isSameDay(eventDate, date);
      } catch (error) {
        return false;
      }
    });
  };

  const handleDateClick = (date) => {
    if (isSameMonth(date, currentDate)) {
      setSelectedDate(date);
      setEditingEvent(null);
      setIsFormOpen(true);
    }
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = async (data) => {
    try {
      if (editingEvent) {
        await updateCalendarEvent(editingEvent.id, data);
        toast.success("Event updated successfully");
      } else {
        await createCalendarEvent(data);
        toast.success("Event created successfully");
      }
      
      // Refresh events - fetch with date range
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      const updatedEvents = await getCalendarEvents(startDate, endDate);
      setEvents(updatedEvents);
      setIsFormOpen(false);
      setEditingEvent(null);
      setSelectedDate(null);
    } catch (error) {
      toast.error(error.message || "Failed to save event");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteCalendarEvent(id);
      toast.success("Event deleted successfully");
      // Refresh events - fetch with date range
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      const updatedEvents = await getCalendarEvents(startDate, endDate);
      setEvents(updatedEvents);
      setIsFormOpen(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const getEventColor = (type) => {
    const colors = {
      event: "bg-blue-500",
      interview: "bg-green-500",
      deadline: "bg-red-500",
      meeting: "bg-purple-500",
    };
    return colors[type] || colors.event;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[150px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedDate(new Date());
                setEditingEvent(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-4 text-muted-foreground">
            Loading events...
          </div>
        )}
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`min-h-[80px] border rounded p-1 cursor-pointer transition-colors ${
                  isCurrentMonth ? "bg-background" : "bg-muted/30"
                } ${isToday ? "ring-2 ring-primary" : ""} hover:bg-muted/50`}
                onClick={() => handleDateClick(day)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  } ${isToday ? "text-primary font-bold" : ""}`}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${getEventColor(
                        event.type
                      )} text-white cursor-pointer hover:opacity-80`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Create New Event"}
              </DialogTitle>
            </DialogHeader>
            <EventForm
              initialDate={selectedDate}
              event={editingEvent}
              onSave={handleSaveEvent}
              onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : null}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingEvent(null);
                setSelectedDate(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

