import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
}

const DEMO_TASKS: Task[] = [
  { id: "1", title: "Design homepage mockup", status: "done", priority: "high" },
  { id: "2", title: "Set up MongoDB database", status: "done", priority: "high" },
  { id: "3", title: "Create API endpoints", status: "in-progress", priority: "high" },
  { id: "4", title: "Build React components", status: "in-progress", priority: "medium" },
  { id: "5", title: "Write unit tests", status: "todo", priority: "medium" },
  { id: "6", title: "Deploy to production", status: "todo", priority: "low" },
]

export default function TaskDashboardDemo() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const addTask = () => {
    if (!newTaskTitle.trim()) return
    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskTitle,
      status: "todo",
      priority: "medium",
    }
    setTasks([...tasks, newTask])
    setNewTaskTitle("")
  }

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const todoTasks = tasks.filter(t => t.status === "todo")
  const inProgressTasks = tasks.filter(t => t.status === "in-progress")
  const doneTasks = tasks.filter(t => t.status === "done")

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Task */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          data-testid="input-new-task"
        />
        <Button onClick={addTask} className="gap-2" data-testid="button-add-task">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary/50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{todoTasks.length}</div>
          <div className="text-sm text-muted-foreground">To Do</div>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{doneTasks.length}</div>
          <div className="text-sm text-muted-foreground">Done</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-foreground">📋 To Do</h3>
          <div className="space-y-2">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="bg-secondary/50 p-3 rounded border border-border/50 cursor-pointer hover:border-border transition-colors group"
                onClick={() => updateTaskStatus(task.id, "in-progress")}
                data-testid={`task-${task.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 mt-1 text-muted-foreground" />
                      <p className="text-sm">{task.title}</p>
                    </div>
                    <span className={`text-xs mt-2 inline-block ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTask(task.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-foreground">🚀 In Progress</h3>
          <div className="space-y-2">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="bg-primary/10 p-3 rounded border border-primary/30 cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => updateTaskStatus(task.id, "done")}
                data-testid={`task-${task.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 mt-1 text-primary" />
                      <p className="text-sm">{task.title}</p>
                    </div>
                    <span className={`text-xs mt-2 inline-block ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTask(task.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-foreground">✅ Done</h3>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="bg-green-500/10 p-3 rounded border border-green-500/30 cursor-pointer hover:border-green-500/50 transition-colors group"
                onClick={() => updateTaskStatus(task.id, "in-progress")}
                data-testid={`task-${task.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-green-500" />
                      <p className="text-sm line-through text-muted-foreground">{task.title}</p>
                    </div>
                    <span className={`text-xs mt-2 inline-block ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTask(task.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
