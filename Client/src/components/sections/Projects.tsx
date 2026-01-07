import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    description: "A full-featured task management application with real-time updates, user collaboration, and analytics. Built with React for dynamic UI, Node.js/Express backend, and MongoDB for data persistence.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "Express", "MongoDB", "WebSocket", "Redux"],
    liveUrl: "https://task-dashboard.example.com",
    github: "https://github.com/username/task-dashboard",
  },
  {
    _id: "2",
    title: "E-Commerce Store",
    description: "Complete e-commerce platform with product catalog, shopping cart, secure payment processing, and admin panel. Features include user authentication, order management, inventory tracking, and email notifications.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "JWT", "Bcrypt"],
    liveUrl: "https://ecommerce-store.example.com",
    github: "https://github.com/username/ecommerce-store",
  },
  {
    _id: "3",
    title: "Social Media Platform",
    description: "A Twitter-like social networking platform with posts, comments, likes, follows, and real-time notifications. Implements feed algorithms, user profiles, and messaging system with Socket.io for instant updates.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop",
    tags: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Redis"],
    liveUrl: "https://social-platform.example.com",
    github: "https://github.com/username/social-platform",
  },
]

export default function Projects() {
  const [, setLocation] = useLocation()
  const { data: projects = DEMO_PROJECTS, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const data = await projectsAPI.getAll()
        // Ensure we always return an array
        if (!data || !Array.isArray(data) || data.length === 0) {
          return DEMO_PROJECTS
        }
        return data
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Return demo data as fallback
        return DEMO_PROJECTS
      }
    },
  })

  const handleProjectClick = (project: Project) => {
    // Navigate to project detail page
    setLocation(`/project/${project._id}`)
  }

  return (
    <section id="projects" className="py-24 container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
      >
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Selected Work</h2>
          <p className="text-muted-foreground text-lg">
            A collection of projects that showcase my passion for design-driven engineering.
          </p>
        </div>
        <Button variant="ghost" className="group cursor-pointer" onClick={() => setLocation('/projects')}>
          View All Projects 
          <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleProjectClick(project)}
              >
                <Card 
                  className="overflow-hidden border border-border/30 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 group bg-gradient-to-br from-card/40 to-background/20 backdrop-blur-md h-full flex flex-col cursor-pointer relative"
                  data-testid={`card-project-${project._id}`}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-video sm:aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 w-full">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-2 gap-1">
                      {project.liveUrl && (
                        <motion.a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          className="w-full"
                        >
                          <Button size="sm" variant="secondary" className="rounded-md text-xs w-full h-7">
                            <ExternalLink className="w-2.5 h-2.5" /> Live
                          </Button>
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          className="w-full"
                        >
                          <Button size="sm" variant="secondary" className="rounded-md text-xs w-full h-7">
                            <Github className="w-2.5 h-2.5" /> Code
                          </Button>
                        </motion.a>
                      )}
                    </div>
                    {/* Image */}
                    <img 
                      src={project.image || projectPlaceholder} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                    />
                  </div>

                  {/* Content */}
                  <motion.div 
                    className="flex-grow flex flex-col p-3 sm:p-4 bg-gradient-to-b from-card/30 to-background/10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 + 0.1 }}
                  >
                    <motion.h3 
                      className="text-xs sm:text-sm md:text-base font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-1.5"
                      whileHover={{ x: 2 }}
                    >
                      {project.title}
                    </motion.h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tags?.slice(0, 3).map(tag => (
                        <motion.div 
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="font-normal text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded">
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                      {project.tags && project.tags.length > 3 && (
                        <Badge variant="secondary" className="font-normal text-[9px] sm:text-[10px] px-1.5 py-0.5">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground leading-relaxed line-clamp-5">
                      {project.description}
                    </p>
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
