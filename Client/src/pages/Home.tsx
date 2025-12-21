import Navbar from "@/components/layout/Navbar"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Services from "@/components/sections/Services"
import Experience from "@/components/sections/Experience"
import Projects from "@/components/sections/Projects"
import Blog from "@/components/sections/Blog"
import Contact from "@/components/sections/Contact"
import Footer from "@/components/sections/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
