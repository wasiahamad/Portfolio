import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
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
  liveUrl?: string
  github?: string
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
        return data
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  onClick={() => setLocation(`/project/${project._id}`)}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden border border-border/30 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img
                        src={project.image || projectPlaceholder}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags?.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Live
                            </Button>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs gap-1"
                            >
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
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
