import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Box, IconButton, Typography } from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Palette,
  Database,
  Layers,
  PenTool,
  Smartphone,
  Settings,
  BarChart,
  Target,
  CheckCircle,
  Shield,
  Cloud,
  Link as LinkIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
interface Category {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}


export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const categories: Category[] = [
    { id: "frontend", name: "Frontend Developer", icon: <Code className="h-6 w-6" />, count: 842 },
    { id: "fullstack", name: "Full Stack Developer", icon: <Layers className="h-6 w-6" />, count: 765 },
    { id: "backend", name: "Backend Developer", icon: <Database className="h-6 w-6" />, count: 693 },
    { id: "ui-ux", name: "UI/UX Designer", icon: <Palette className="h-6 w-6" />, count: 528 },
    { id: "graphic", name: "Graphic Designer", icon: <PenTool className="h-6 w-6" />, count: 476 },
    { id: "mobile", name: "Mobile Developer", icon: <Smartphone className="h-6 w-6" />, count: 412 },
    { id: "devops", name: "DevOps Engineer", icon: <Settings className="h-6 w-6" />, count: 387 },
    { id: "data", name: "Data Scientist", icon: <BarChart className="h-6 w-6" />, count: 342 },
    { id: "product", name: "Product Manager", icon: <Target className="h-6 w-6" />, count: 298 },
    { id: "qa", name: "QA Engineer", icon: <CheckCircle className="h-6 w-6" />, count: 276 },
    { id: "security", name: "Security Engineer", icon: <Shield className="h-6 w-6" />, count: 245 },
    { id: "cloud", name: "Cloud Architect", icon: <Cloud className="h-6 w-6" />, count: 213 },
    { id: "blockchain", name: "Blockchain Developer", icon: <LinkIcon className="h-6 w-6" />, count: 187 },
  ]

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()
      return () => scrollContainer.removeEventListener("scroll", checkScroll)
    }
  }, [])

  // Auto-scroll continuously from right to left
  useEffect(() => {
    // Initialize carousel to start from the rightmost position
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }, 3000);
    
    const startAutoScroll = () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current)
      }
      
      autoScrollInterval.current = setInterval(() => {
        // Only scroll if not hovering
        if (!isHovering && scrollRef.current) {
          // Check if we're at the beginning and loop back to the end if needed
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
          if (scrollLeft <= 0) {
            // Jump to near the end to create a continuous loop effect
            scrollRef.current.scrollLeft = scrollWidth - clientWidth - 200
          }
          
          // Scroll left by a smaller amount to create slower right-to-left movement
          scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' })
        }
      }, 2000) // Scroll every 3 seconds
    }

    // Start auto-scroll after a delay
    const autoScrollTimer = setTimeout(startAutoScroll, 2000)

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current)
      }
      clearTimeout(autoScrollTimer)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = clientWidth * 20
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }



  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 1100, mx: "auto", px: { xs: 2, sm: 3 }, mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>
          Browse Categories
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            sx={{
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.10)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.16)" },
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            sx={{
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.10)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.16)" },
            }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>

      <Box 
        ref={scrollRef} 
        className="scrollbar-hide" 
        sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 1.5, px: 0.5 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {categories.map((category, idx) => (
          <Link key={category.id} to={`/jobs?category=${category.id}`} className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.35 }}
              whileHover={{ y: -2 }}
              style={{ width: 220, maxWidth: "85vw" }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  p: 2,
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  transition: "background-color 150ms ease",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.14)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.14)" }}>
                    <Box sx={{ color: "#fff" }}>{category.icon}</Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#fff" }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                      {category.count} jobs
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
