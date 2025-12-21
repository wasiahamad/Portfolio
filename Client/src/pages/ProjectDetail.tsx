import { useParams, useLocation } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import TaskDashboardDemo from "@/components/project-demos/TaskDashboardDemo"
import EcommerceDemo from "@/components/project-demos/EcommerceDemo"
import SocialMediaDemo from "@/components/project-demos/SocialMediaDemo"
import CMSDemo from "@/components/project-demos/CMSDemo"
import CollaborationDemo from "@/components/project-demos/CollaborationDemo"
import { DEMO_PROJECTS } from "@/data/demo-projects"

interface Project {
  _id: string
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

const demoComponents: { [key: string]: React.ComponentType } = {
  "Task Management Dashboard": TaskDashboardDemo,
  "E-Commerce Store": EcommerceDemo,
  "Social Media Platform": SocialMediaDemo,
  "Content Management System": CMSDemo,
  "Project Collaboration Tool": CollaborationDemo,
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [, setLocation] = useLocation()

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) throw new Error("Project not found")
      return res.json()
    },
  })

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>
  }

  const DemoComponent = demoComponents[project.title]
  const demoProject = DEMO_PROJECTS.find(p => p.title === project.title)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Project Info */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">{project.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" /> View Source
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-12 rounded-lg overflow-hidden border border-border">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Interactive Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Interactive Demo</h2>
          <div className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm">
            {DemoComponent ? (
              <DemoComponent />
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>Interactive demo for this project</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        {demoProject && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {demoProject.features?.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Technologies Used</h3>
              <ul className="space-y-2">
                {demoProject.technologies?.map((tech, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-muted-foreground">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
