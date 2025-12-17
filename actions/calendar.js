"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

export async function getCalendarEvents(startDate, endDate) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    const events = await db.calendarEvent.findMany({
      where: {
        userId: user.id,
        startDate: {
          gte: startDate || defaultStart,
          lte: endDate || defaultEnd,
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
}

export async function createCalendarEvent(data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const event = await db.calendarEvent.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        location: data.location,
        type: data.type || "event",
        color: data.color || "blue",
      },
    });

    revalidatePath("/calendar");
    return event;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Failed to create calendar event");
  }
}

export async function updateCalendarEvent(id, data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const event = await db.calendarEvent.update({
      where: {
        id,
        userId: user.id, // Ensure user owns the event
      },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        location: data.location,
        type: data.type,
        color: data.color,
      },
    });

    revalidatePath("/calendar");
    return event;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw new Error("Failed to update calendar event");
  }
}

export async function deleteCalendarEvent(id) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.calendarEvent.delete({
      where: {
        id,
        userId: user.id, // Ensure user owns the event
      },
    });

    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw new Error("Failed to delete calendar event");
  }
}

