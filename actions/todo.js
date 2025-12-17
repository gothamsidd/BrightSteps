"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

export async function getTodos(completed) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const where = {
      userId: user.id,
      ...(completed !== undefined && { completed }),
    };

    const todos = await db.todo.findMany({
      where,
      orderBy: [
        { completed: "asc" },
        { priority: "desc" },
        { dueDate: "asc" },
      ],
    });

    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("Failed to fetch todos");
  }
}

export async function createTodo(data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const todo = await db.todo.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || "medium",
        category: data.category,
      },
    });

    revalidatePath("/calendar");
    return todo;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo");
  }
}

export async function updateTodo(id, data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const todo = await db.todo.update({
      where: {
        id,
        userId: user.id, // Ensure user owns the todo
      },
      data: {
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        priority: data.priority,
        category: data.category,
      },
    });

    revalidatePath("/calendar");
    return todo;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
}

export async function deleteTodo(id) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.todo.delete({
      where: {
        id,
        userId: user.id, // Ensure user owns the todo
      },
    });

    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
}

export async function toggleTodoComplete(id) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const todo = await db.todo.findUnique({
      where: { id, userId: user.id },
    });

    if (!todo) throw new Error("Todo not found");

    const updated = await db.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });

    revalidatePath("/calendar");
    return updated;
  } catch (error) {
    console.error("Error toggling todo:", error);
    throw new Error("Failed to toggle todo");
  }
}

