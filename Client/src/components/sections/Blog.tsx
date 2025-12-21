import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import blog1 from "@assets/generated_images/abstract_code_visualization_for_blog_post.png"
import { blogsAPI } from "@/lib/api"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content?: string
  image?: string
  category: string
  readTime: string
  published: boolean
  createdAt: string
}

const defaultImages = [blog1]

const DEMO_BLOGS: BlogPost[] = [
  {
    _id: "1",
    title: "Building Scalable MERN Applications",
    excerpt: "Learn how to architect large-scale applications using MongoDB, Express, React, and Node.js. We'll explore best practices for database design, API optimization, and frontend state management.",
    category: "Tutorial",
    readTime: "8 min read",
    published: true,
    createdAt: new Date(2024, 11, 15).toISOString(),
    image: blog1
  },
  {
    _id: "2",
    title: "React Performance Optimization Techniques",
    excerpt: "Discover advanced techniques to improve your React application's performance. From code splitting to memoization, learn how to create lightning-fast user interfaces.",
    category: "Guide",
    readTime: "10 min read",
    published: true,
    createdAt: new Date(2024, 11, 10).toISOString(),
    image: blog1
  },
  {
    _id: "3",
    title: "MongoDB Best Practices for Production",
    excerpt: "Essential MongoDB practices for production environments. Learn about indexing strategies, backup solutions, security configurations, and monitoring techniques.",
    category: "Best Practices",
    readTime: "12 min read",
    published: true,
    createdAt: new Date(2024, 11, 5).toISOString(),
    image: blog1
  }
]

export default function Blog() {
  const { data: blogs = DEMO_BLOGS, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      try {
        const data = await blogsAPI.getAll()
        // Ensure we always return an array
        if (!data || !Array.isArray(data) || data.length === 0) {
          return DEMO_BLOGS
        }
        return data
      } catch (error) {
        console.error('Error fetching blogs:', error)
        // Return demo data as fallback
        return DEMO_BLOGS
      }
    },
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  return (
    <section id="blog" className="py-24 container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
      >
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Latest Insights</h2>
          <p className="text-muted-foreground text-lg">
            Thoughts, tutorials, and articles about web development and design.
          </p>
        </div>
        <Button variant="outline" className="group">
          Read All Articles
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border border-border/40 shadow-md hover:shadow-xl hover:border-primary/40 overflow-hidden flex flex-col group bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-xl transition-all duration-500">
                  <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary/10 to-secondary/10">
                    <motion.div 
                      className="absolute top-3 left-3 z-10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge className="bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary/90 text-xs font-semibold">
                        {blog.category}
                      </Badge>
                    </motion.div>
                    <img 
                      src={blog.image || defaultImages[index % defaultImages.length]} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <span className="text-xs font-medium">{blog.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0 pb-2">
                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <Button variant="link" className="p-0 h-auto text-xs font-medium group-hover:text-primary transition-colors duration-300">
                        Read More <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
