import { useQuery } from "@tanstack/react-query"
import { profileAPI } from "@/lib/api"

interface Profile {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string,
  name?: string
}

export default function Footer() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const data = await profileAPI.get()
        return data
      } catch (error) {
        return {}
      }
    },
  })

  const socialLinks = [
    { name: 'Twitter', url: profile?.twitter || '#' },
    { name: 'GitHub', url: profile?.github || '#' },
    { name: 'LinkedIn', url: profile?.linkedin || '#' },
    { name: 'Website', url: profile?.website || '#' },
  ]

  return (
    <footer className="py-12 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {profile?.name}. All rights reserved.
        </p>
        
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a 
              key={link.name}
              href={link.url} 
              target={link.url !== '#' ? '_blank' : undefined}
              rel={link.url !== '#' ? 'noopener noreferrer' : undefined}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
