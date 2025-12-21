import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, FileText, Plus, X } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "offline"
}

interface ProjectTask {
  id: string
  title: string
  assignee: string
  status: "todo" | "in-progress" | "review" | "done"
}

const DEMO_TEAM: TeamMember[] = [
  { id: "1", name: "Alice", role: "Project Lead", avatar: "👩", status: "online" },
  { id: "2", name: "Bob", role: "Frontend Dev", avatar: "👨", status: "online" },
  { id: "3", name: "Carol", role: "Backend Dev", avatar: "👩", status: "offline" },
  { id: "4", name: "David", role: "Designer", avatar: "👨", status: "online" },
]

const DEMO_TASKS: ProjectTask[] = [
  { id: "1", title: "Design UI mockups", assignee: "David", status: "done" },
  { id: "2", title: "Setup React project", assignee: "Bob", status: "done" },
  { id: "3", title: "Create API endpoints", assignee: "Carol", status: "in-progress" },
  { id: "4", title: "Database schema", assignee: "Carol", status: "in-progress" },
  { id: "5", title: "Authentication module", assignee: "Bob", status: "todo" },
]

export default function CollaborationDemo() {
  const [tasks, setTasks] = useState<ProjectTask[]>(DEMO_TASKS)
  const [team] = useState<TeamMember[]>(DEMO_TEAM)
  const [newTask, setNewTask] = useState("")

  const handleAddTask = () => {
    if (!newTask.trim()) return
    const task: ProjectTask = {
      id: String(Date.now()),
      title: newTask,
      assignee: "Alice",
      status: "todo",
    }
    setTasks([...tasks, task])
    setNewTask("")
  }

  const updateTaskStatus = (id: string, status: ProjectTask["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const getStatusColor = (status: ProjectTask["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-500/20 text-gray-400"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400"
      case "review":
        return "bg-yellow-500/20 text-yellow-400"
      case "done":
        return "bg-green-500/20 text-green-400"
    }
  }

  const todoCount = tasks.filter(t => t.status === "todo").length
  const inProgressCount = tasks.filter(t => t.status === "in-progress").length
  const reviewCount = tasks.filter(t => t.status === "review").length
  const doneCount = tasks.filter(t => t.status === "done").length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Team Sidebar */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Team Members
          </h3>
          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="flex items-center gap-3" data-testid={`team-member-${member.id}`}>
                <div className="text-2xl">{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    member.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={member.status}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Preview */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Recent Chat
          </h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-secondary/50 rounded">
              <p className="font-medium">Alice</p>
              <p className="text-xs text-muted-foreground">Merge ready?</p>
            </div>
            <div className="p-2 bg-secondary/50 rounded">
              <p className="font-medium">Bob</p>
              <p className="text-xs text-muted-foreground">One more review...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Workspace */}
      <div className="lg:col-span-3 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-secondary/50 p-3 rounded text-center">
            <div className="text-lg font-bold">{todoCount}</div>
            <div className="text-xs text-muted-foreground">To Do</div>
          </div>
          <div className="bg-secondary/50 p-3 rounded text-center">
            <div className="text-lg font-bold">{inProgressCount}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="bg-secondary/50 p-3 rounded text-center">
            <div className="text-lg font-bold">{reviewCount}</div>
            <div className="text-xs text-muted-foreground">Review</div>
          </div>
          <div className="bg-secondary/50 p-3 rounded text-center">
            <div className="text-lg font-bold">{doneCount}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
        </div>

        {/* Add Task */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-secondary/50 focus:outline-none focus:border-primary text-sm"
            data-testid="input-new-task"
          />
          <Button onClick={handleAddTask} size="sm" className="gap-2" data-testid="button-add-task">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              data-testid={`task-${task.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium">{task.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Assigned to: {task.assignee}</span>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as ProjectTask["status"])}
                      className={`text-xs px-2 py-1 rounded border-0 focus:outline-none cursor-pointer ${getStatusColor(
                        task.status
                      )}`}
                      data-testid={`status-select-${task.id}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  data-testid={`button-delete-${task.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
