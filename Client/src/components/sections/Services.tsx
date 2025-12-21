import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Smartphone, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Web Development",
    desc: "Custom websites built with modern technologies like React, Next.js, and TypeScript. Optimized for performance and SEO.",
    color: "text-blue-500"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Responsive Design",
    desc: "Layouts that adapt perfectly to any screen size, ensuring a consistent experience across mobile, tablet, and desktop.",
    color: "text-purple-500"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Motion & Animation",
    desc: "Adding life to interfaces with smooth transitions, micro-interactions, and complex 3D visualizations using Three.js.",
    color: "text-amber-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Performance Optimization",
    desc: "Auditing and optimizing applications for maximum speed, accessibility, and Core Web Vitals compliance.",
    color: "text-emerald-500"
  }
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 px-4">
            Services
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What I Can Do For You</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            I offer a full range of digital services to help bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-background/50 backdrop-blur-sm group">
                <CardHeader>
                  <div className={`mb-4 p-3 rounded-xl bg-background w-fit shadow-sm group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {service.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
