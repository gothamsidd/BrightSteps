export const dynamic = "force-dynamic";

import { getCalendarEvents } from "@/actions/calendar";
import { getTodos } from "@/actions/todo";
import CalendarView from "./_components/calendar-view";
import TodoList from "./_components/todo-list";

export default async function CalendarPage() {
  let events = [];
  let todos = [];

  try {
    [events, todos] = await Promise.all([
      getCalendarEvents(),
      getTodos(),
    ]);
  } catch (error) {
    console.error("Error loading calendar data:", error);
    // Continue with empty arrays if there's an error
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-6">
        <h1 className="text-6xl font-bold gradient-title">Calendar & Tasks</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CalendarView initialEvents={events} />
        </div>

        {/* Todo List - Takes 1 column */}
        <div className="lg:col-span-1">
          <TodoList initialTodos={todos} />
        </div>
      </div>
    </div>
  );
}

