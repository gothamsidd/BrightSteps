"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "@/actions/todo";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TodoList({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleToggleComplete = async (id) => {
    try {
      await toggleTodoComplete(id);
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
    } catch (error) {
      toast.error(error.message || "Failed to update todo");
    }
  };

  const handleSaveTodo = async (data) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, data);
        toast.success("Task updated successfully");
      } else {
        await createTodo(data);
        toast.success("Task created successfully");
      }

      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
      setIsFormOpen(false);
      setEditingTodo(null);
    } catch (error) {
      toast.error(error.message || "Failed to save task");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      toast.success("Task deleted successfully");
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
    } catch (error) {
      toast.error(error.message || "Failed to delete task");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-500",
      medium: "text-yellow-500",
      low: "text-green-500",
    };
    return colors[priority] || colors.medium;
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setEditingTodo(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({todos.length})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Done ({completedCount})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tasks yet. Create your first task!
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                  todo.completed ? "opacity-60" : ""
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleComplete(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {todo.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due: {(() => {
                              try {
                                return new Date(todo.dueDate).toLocaleDateString();
                              } catch {
                                return "Invalid date";
                              }
                            })()}
                          </span>
                        )}
                        <span
                          className={`text-xs font-medium ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {todo.priority}
                        </span>
                        {todo.category && (
                          <span className="text-xs text-muted-foreground">
                            • {todo.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingTodo(todo);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Todo Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TodoForm
            todo={editingTodo}
            onSave={handleSaveTodo}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function TodoForm({ todo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "",
  });

  useEffect(() => {
    if (todo) {
      try {
        setFormData({
          title: todo.title || "",
          description: todo.description || "",
          dueDate: todo.dueDate
            ? new Date(todo.dueDate).toISOString().split("T")[0]
            : "",
          priority: todo.priority || "medium",
          category: todo.category || "",
        });
      } catch (error) {
        console.error("Error formatting todo dates:", error);
        setFormData({
          title: todo.title || "",
          description: todo.description || "",
          dueDate: "",
          priority: todo.priority || "medium",
          category: todo.category || "",
        });
      }
    }
  }, [todo]);

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
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          placeholder="Task title"
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
          placeholder="Task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          placeholder="e.g., Career, Learning, Application"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

