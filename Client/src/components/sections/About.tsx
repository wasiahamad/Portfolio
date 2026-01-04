import { motion } from "framer-motion"
import { Code2, Palette, Terminal, Cpu, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import profileImage from "@assets/generated_images/professional_portrait_of_a_creative_developer.png"
import { useQuery } from "@tanstack/react-query"
import { profileAPI } from "@/lib/api"

interface Profile {
  name?: string
  title?: string
  bio?: string
  bio2?: string
  image?: string
  cvUrl?: string
  skills?: {
    frontend?: string
    design?: string
    backend?: string
    optimization?: string
  }
}

const DEMO_PROFILE: Profile = {
  bio: "I'm a passionate developer who loves bridging the gap between design and engineering. With a keen eye for detail and a drive for perfection, I create software that not only works flawlessly but feels amazing to use.",
  bio2: "My journey began with a curiosity for how things work on the web, which quickly turned into a career building complex applications for clients around the globe. I believe in writing clean, accessible code and designing intuitive user interfaces.",
}

export default function About() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const data = await profileAPI.get()
        return data || DEMO_PROFILE
      } catch (error) {
        console.error('Error fetching profile:', error)
        return DEMO_PROFILE
      }
    },
  })

  const displayProfile = profile || DEMO_PROFILE

  const skills = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Frontend",
      desc: profile?.skills?.frontend || "React, TS, Tailwind"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Design & Database",
      desc: profile?.skills?.design || "Figma, Motion, UI/UX, MongoDB, SQL"
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: "Backend",
      desc: profile?.skills?.backend || "Node.js, Express.js, REST APIs, JWT Authentication"
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Tools",
      desc: profile?.skills?.optimization || "Git, GitHub, VS Code, Postman"
    }
  ]

  const handleDownloadCV = () => {
    const fallbackCvUrl = "/resume.pdf"
    const cvUrl = displayProfile.cvUrl || fallbackCvUrl
    
    // Create a temporary anchor element to force download
    const link = document.createElement('a')
    link.href = cvUrl
    link.download = 'CV.pdf' // Force download with filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 relative"
          >
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-10 mix-blend-multiply opacity-60" />
              <img 
                src={profile?.image || profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements behind image */}
            <div className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-primary/20 rounded-2xl" />
            <div className="absolute -z-20 -bottom-6 -right-6 w-full h-full bg-primary/5 rounded-2xl" />
          </motion.div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">About Me</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {displayProfile.bio}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {displayProfile.bio2}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button 
                  onClick={handleDownloadCV}
                  className="h-12 px-8 rounded-full text-base gap-2 group"
                  data-testid="button-download-cv"
                >
                  Download CV
                  <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 px-8 rounded-full text-base gap-2"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-view-projects"
                >
                  View Projects 
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{skill.title}</h3>
                    <p className="text-xs text-muted-foreground">{skill.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
    </section>
  )
}
