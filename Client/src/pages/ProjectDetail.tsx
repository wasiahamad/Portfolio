import { useParams, useLocation } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"
import TaskDashboardDemo from "@/components/project-demos/TaskDashboardDemo"
import EcommerceDemo from "@/components/project-demos/EcommerceDemo"
import SocialMediaDemo from "@/components/project-demos/SocialMediaDemo"
import CMSDemo from "@/components/project-demos/CMSDemo"
import CollaborationDemo from "@/components/project-demos/CollaborationDemo"
import { DEMO_PROJECTS } from "@/data/demo-projects"
import { projectsAPI } from "@/lib/api"
import projectPlaceholder from "@assets/generated_images/minimalist_abstract_3d_shape_for_project_cover.png"

interface Project {
  _id: string
  title: string
  description: string
  image?: string
  tags?: string[]
  liveUrl?: string
  github?: string
  githubUrl?: string
  featured?: boolean
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

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const data = await projectsAPI.getAll()
        return data || DEMO_PROJECTS
      } catch (error) {
        console.error('Error fetching projects:', error)
        return DEMO_PROJECTS
      }
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

  // Filter out current project from all projects list
  const otherProjects = allProjects.filter(p => p._id !== project._id)

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
            {project.tags?.map((tag) => (
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
            {(project.githubUrl || project.github) && (
              <a href={project.githubUrl || project.github} target="_blank" rel="noopener noreferrer">
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

        {/* All Projects Section */}
        {otherProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">More Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((proj, index) => (
                <motion.div
                  key={proj._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onClick={() => setLocation(`/project/${proj._id}`)}
                  className="cursor-pointer group"
                >
                  <Card className="overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    {/* Project Image */}
                    <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img
                        src={proj.image || projectPlaceholder}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Project Content */}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.tags?.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {proj.tags && proj.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{proj.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                        {proj.description}
                      </p>
                      
                      {/* Action Links */}
                      <div className="flex gap-2 mt-4">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1"
                          >
                            <Button size="sm" variant="outline" className="w-full text-xs gap-1">
                              <ExternalLink className="w-3 h-3" /> Live
                            </Button>
                          </a>
                        )}
                        {(proj.github || proj.githubUrl) && (
                          <a
                            href={proj.github || proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1"
                          >
                            <Button size="sm" variant="outline" className="w-full text-xs gap-1">
                              <Github className="w-3 h-3" /> Code
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
