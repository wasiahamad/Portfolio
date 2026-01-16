import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "wouter"
import projectPlaceholder from "@assets/generated_images/minimalist_abstract_3d_shape_for_project_cover.png"
import { projectsAPI } from "@/lib/api"

interface Project {
  _id: string
  title: string
  description: string
  image?: string
  tags?: string[]
  technologies?: string[]
  liveUrl?: string
  github?: string
  featured?: boolean
}

const DEMO_PROJECTS: Project[] = [
  {
    _id: "1",
    title: "Task Management Dashboard",
    description:
      "A full-featured task management application with real-time updates, user collaboration, and analytics.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    _id: "2",
    title: "E-Commerce Store",
    description:
      "Complete e-commerce platform with product catalog, shopping cart, secure payment processing, and admin panel.",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    _id: "3",
    title: "Social Media Platform",
    description:
      "A Twitter-like social networking platform with posts, comments, likes, follows, and real-time notifications.",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Socket.io"],
  },
]

export default function ProjectsPage() {
  const [, setLocation] = useLocation()

  const { data: projects = DEMO_PROJECTS, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const data = await projectsAPI.getAll()
        if (!data || !Array.isArray(data) || data.length === 0) {
          return DEMO_PROJECTS
        }
        // Map technologies to tags if tags not present
        return data.map(project => ({
          ...project,
          tags: project.tags || project.technologies || []
        }))
      } catch {
        return DEMO_PROJECTS
      }
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-28">
        <section className="container px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">All Projects</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore the complete list of my projects.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLocation(`/project/${project._id}`)}
                  >
                    <Card className="h-full border border-border/40 shadow-md hover:shadow-xl hover:border-primary/40 overflow-hidden flex flex-col group bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-xl transition-all duration-500 cursor-pointer">
                      {/* Image Container - Blog style */}
                      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary/10 to-secondary/10">
                        {/* Featured Badge */}
                        {project.featured && (
                          <motion.div 
                            className="absolute top-3 left-3 z-10"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className="bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary/90 text-xs font-semibold">
                              Featured
                            </Badge>
                          </motion.div>
                        )}
                        {/* Category Badge */}
                        {!project.featured && project.tags && project.tags.length > 0 && (
                          <motion.div 
                            className="absolute top-3 left-3 z-10"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className="bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary/90 text-xs font-semibold">
                              {project.tags[0]}
                            </Badge>
                          </motion.div>
                        )}
                        <img
                          src={project.image || projectPlaceholder}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button size="sm" variant="secondary" className="text-xs gap-1.5 shadow-lg">
                                <ExternalLink className="w-3.5 h-3.5" /> Live
                              </Button>
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button size="sm" variant="secondary" className="text-xs gap-1.5 shadow-lg">
                                <Github className="w-3.5 h-3.5" /> Code
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Content - Blog style */}
                      <div className="p-4 pb-2">
                        <h3 className="text-base font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {project.title}
                        </h3>
                      </div>
                      
                      <div className="flex-grow px-4 pt-0 pb-2">
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {project.tags?.slice(0, 6).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs font-medium px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags && project.tags.length > 6 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              +{project.tags.length - 6}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="px-4 pt-2 pb-4">
                        <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                          <Button variant="link" className="p-0 h-auto text-xs font-medium group-hover:text-primary transition-colors duration-300">
                            View Details <ArrowRight className="ml-1 w-3 h-3" />
                          </Button>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
