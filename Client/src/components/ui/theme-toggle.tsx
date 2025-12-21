import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border border-border/50"
      data-testid="button-theme-toggle"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "light" ? 0 : 180, scale: theme === "light" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === "light" ? -180 : 0, scale: theme === "light" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
