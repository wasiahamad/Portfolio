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
  technologies?: string[]
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

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        const data = await projectsAPI.getById(id!)
        // Map technologies to tags if tags not present
        if (data && !data.tags && data.technologies) {
          data.tags = data.technologies
        }
        return data
      } catch (error) {
        console.error('Error fetching project:', error)
        // Fallback to demo project if API fails (demo projects use index as id)
        const demoIndex = DEMO_PROJECTS.findIndex((p, idx) => (idx + 1).toString() === id)
        if (demoIndex !== -1) {
          return {
            _id: id!,
            title: DEMO_PROJECTS[demoIndex].title,
            description: DEMO_PROJECTS[demoIndex].features?.[0] || '',
            tags: DEMO_PROJECTS[demoIndex].technologies || [],
          } as Project
        }
        throw error
      }
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
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Project Image - Moved to top */}
          {project.image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 md:mb-12 rounded-xl overflow-hidden border border-border/50 shadow-2xl"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
              />
            </motion.div>
          )}

          {/* Project Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {project.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-3xl leading-relaxed">
              {project.description}
            </p>
            
            {/* Technologies Section - Blog style */}
            {(project.tags || project.technologies) && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.tags || project.technologies)?.map((tag) => (
                    <motion.div
                      key={tag}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <motion.a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="gap-2 shadow-md hover:shadow-lg transition-all">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </Button>
                </motion.a>
              )}
              {(project.githubUrl || project.github) && (
                <motion.a 
                  href={project.githubUrl || project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="gap-2 border-border/50 hover:border-primary/50 transition-all">
                    <Github className="w-4 h-4" /> View Source
                  </Button>
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Demo */}
        {DemoComponent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Interactive Demo</h2>
            <Card className="border border-border/50 rounded-xl overflow-hidden shadow-lg bg-card/50 backdrop-blur-sm">
              <div className="p-4 md:p-6">
                <DemoComponent />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Project Details */}
        {demoProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-xl border border-border/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {demoProject.features?.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-primary font-bold mt-0.5 text-lg">✓</span>
                          <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-xl border border-border/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="text-primary">⚡</span>
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {demoProject.technologies?.map((tech, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge variant="secondary" className="text-xs font-medium">
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* More Projects Section */}
        {otherProjects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 md:mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">More Projects</h2>
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
          </motion.div>
        )}
      </div>
    </div>
  )
}
