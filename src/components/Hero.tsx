import CategoryCarousel from "./CategoryCarousel";
import ProfileCompletionBanner from "./global/ProfileCompletionBanner";
import SearchBox from "./search-box";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

function Hero() {
  const headlineVariants = useMemo(
    () => [
      "Dream Job",
      "Remote Role",
      "Next Internship",
      "Career Upgrade",
    ],
    []
  );

  const [headlineIndex, setHeadlineIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        title: "Discover roles that match your skills",
        subtitle: "Search across companies, locations, and job types with smart filters.",
      },
      {
        title: "Apply faster with a professional profile",
        subtitle: "Upload your resume, highlight your skills, and track applications.",
      },
      {
        title: "Recruiters find you, not the other way around",
        subtitle: "Keep your profile updated and get noticed by recruiters.",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeadlineIndex((p) => (p + 1) % headlineVariants.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [headlineVariants.length]);

  return (
    <div className="min-h-screen">
      <ProfileCompletionBanner />
      {/* Hero Section with Background Image and Integrated Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bgMain-gradient blur-3xl opacity-70 float-slow" />
          <div className="absolute top-10 -right-28 h-80 w-80 rounded-full bgMain-gradient blur-3xl opacity-60 float-slow-delay" />
          <div className="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bgMain-gradient blur-3xl opacity-50 float-slow" />
        </div>

        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 6, md: 10 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 950,
                  letterSpacing: -0.8,
                  color: "#fff",
                  textShadow: "0 10px 30px rgba(0,0,0,0.35)",
                }}
              >
                Find your{" "}
                <Box component="span" sx={{ display: "inline-block", minWidth: { xs: 170, sm: 220 } }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={headlineIndex}
                      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                      transition={{ duration: 0.35 }}
                      style={{
                        display: "inline-block",
                        background: "linear-gradient(90deg, #93C5FD, #22D3EE, #F472B6)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {headlineVariants[headlineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1.5, color: "rgba(255,255,255,0.86)", maxWidth: 880 }}>
                Connect with top employers, explore jobs that fit your skills, and track your applications in one place.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ width: "100%", maxWidth: 980 }}
            >
              {/* Search Box */}
              <SearchBox />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <CategoryCarousel />
            </motion.div>

            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                maxWidth: 980,
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255,255,255,0.22)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
                <Box sx={{ flex: 1, minHeight: 74 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#fff" }}>
                        {slides[active].title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, color: "rgba(255,255,255,0.78)" }}>
                        {slides[active].subtitle}
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                </Box>
                <Stack direction="row" spacing={1} justifyContent="center">
                  {slides.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setActive(i)}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        cursor: "pointer",
                        backgroundColor: i === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                        transition: "background-color 150ms ease",
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Paper>

            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ pt: 1 }}>
              <Button variant="contained" href="/jobs" sx={{ textTransform: "none" }}>
                Browse Jobs
              </Button>
              <Button
                variant="outlined"
                href="/signup"
                sx={{
                  textTransform: "none",
                  borderColor: "rgba(255,255,255,0.55)",
                  color: "#fff",
                  "&:hover": { borderColor: "rgba(255,255,255,0.85)", backgroundColor: "rgba(255,255,255,0.10)" },
                }}
              >
                Create Profile
              </Button>
            </Stack>
          </Stack>
        </Container>
      </section>
    </div>
  );
}

export default Hero;
