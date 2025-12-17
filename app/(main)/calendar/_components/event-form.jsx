"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export default function EventForm({ initialDate, event, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: initialDate ? (() => {
      try {
        return format(new Date(initialDate), "yyyy-MM-dd'T'HH:mm");
      } catch {
        return "";
      }
    })() : "",
    endDate: "",
    location: "",
    type: "event",
    color: "blue",
  });

  useEffect(() => {
    if (event) {
      try {
        setFormData({
          title: event.title || "",
          description: event.description || "",
          startDate: event.startDate
            ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm")
            : "",
          endDate: event.endDate
            ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm")
            : "",
          location: event.location || "",
          type: event.type || "event",
          color: event.color || "blue",
        });
      } catch (error) {
        console.error("Error formatting event dates:", error);
      }
    } else if (initialDate) {
      try {
        setFormData((prev) => ({
          ...prev,
          startDate: format(new Date(initialDate), "yyyy-MM-dd'T'HH:mm"),
        }));
      } catch (error) {
        console.error("Error formatting initial date:", error);
      }
    }
  }, [event, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Event title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date & Time *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date & Time</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Event location"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Event Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select
            value={formData.color}
            onValueChange={(value) =>
              setFormData({ ...formData, color: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}

