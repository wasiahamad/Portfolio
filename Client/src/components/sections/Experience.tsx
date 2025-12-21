import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { experienceAPI } from "@/lib/api"

interface Experience {
  _id: string
  role: string
  company: string
  period: string
  description: string
  skills: string[]
  order: number
}

const DEMO_EXPERIENCES: Experience[] = [
  {
    _id: "1",
    role: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2022 - Present",
    description: "Leading the development of large-scale MERN applications with a team of 5 engineers. Architected microservices, implemented CI/CD pipelines, and mentored junior developers. Increased application performance by 40% through optimization.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "GraphQL"],
    order: 1
  },
  {
    _id: "2",
    role: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    period: "2020 - 2022",
    description: "Developed and maintained multiple web applications using MERN stack. Implemented RESTful APIs, real-time features with WebSocket, and responsive frontend designs. Collaborated with cross-functional teams and managed technical documentation.",
    skills: ["React", "Express.js", "MongoDB", "JavaScript", "REST APIs", "Tailwind CSS"],
    order: 2
  },
  {
    _id: "3",
    role: "Junior Developer",
    company: "StartUp Ventures",
    period: "2019 - 2020",
    description: "Started my journey in web development, contributing to frontend and backend features. Built components in React, wrote API endpoints in Express.js, and gained hands-on experience with MongoDB database management.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "HTML/CSS", "Git"],
    order: 3
  }
]

export default function Experience() {
  const { data: experiences = DEMO_EXPERIENCES, isLoading } = useQuery<Experience[]>({
    queryKey: ["experience"],
    queryFn: async () => {
      try {
        const data = await experienceAPI.getAll()
        // Ensure we always return an array
        if (!data || !Array.isArray(data) || data.length === 0) {
          return DEMO_EXPERIENCES
        }
        return data
      } catch (error) {
        console.error('Error fetching experience:', error)
        // Return demo data as fallback
        return DEMO_EXPERIENCES
      }
    },
  })

  return (
    <section id="experience" className="py-24 container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Client Works & Experience</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          My professional journey and the value I've delivered to clients and companies.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2 ml-6 md:ml-0" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 z-10" />

                <div className="flex-1 ml-12 md:ml-0">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <CardTitle className="text-xl font-bold">{exp.role}</CardTitle>
                        <Badge variant="outline" className="w-fit flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Briefcase className="w-4 h-4" />
                        {exp.company}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
