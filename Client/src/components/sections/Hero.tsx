import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import heroBg from "@assets/generated_images/abstract_modern_gradient_mesh_background.png"
import { useQuery } from "@tanstack/react-query"
import { profileAPI } from "@/lib/api"

interface Profile {
  name?: string
  title?: string
  bio?: string
  email?: string
}

const DEMO_PROFILE: Profile = {
  name: "Creative Developer",
  title: "Creative Developer & Designer",
  bio: "I build accessible, pixel-perfect, and performant web applications with a focus on motion and user experience.",
}

export default function Hero() {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/30 dark:bg-background/60 backdrop-blur-[2px] z-10" />
        <img 
          src={heroBg} 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-80 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
      </div>

      <div className="container px-4 md:px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-medium text-primary mb-4 tracking-wide">
              {displayProfile.title}
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Crafting Digital <br /> Experiences
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {displayProfile.bio}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="rounded-full text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
              View Projects
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg h-12 px-8 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80">
              Contact Me
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <ArrowDown className="text-muted-foreground w-6 h-6" />
      </motion.div>
    </section>
  )
}
