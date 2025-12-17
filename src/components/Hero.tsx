import CategoryCarousel from "./CategoryCarousel";
import ProfileCompletionBanner from "./global/ProfileCompletionBanner";
import SearchBox from "./search-box";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { GraduationCap, Code2, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const { allJobs } = useSelector((store: any) => store.job);

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

  useEffect(() => {
    const id = window.setInterval(() => {
      // keep the interval alive for future use (e.g., announcements), but no carousel UI is shown now
      // leaving this empty avoids user-visible motion noise in the hero
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
                        background: "linear-gradient(90deg, #93C5FD, #22D3EE, #ffffff)",
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ width: "100%", maxWidth: 980 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  width: "100%",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                  borderColor: "rgba(255,255,255,0.22)",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#fff" }}>
                      Featured Jobs
                    </Typography>
                    <Button
                      variant="text"
                      href="/jobs"
                      sx={{ textTransform: "none", color: "rgba(255,255,255,0.92)" }}
                    >
                      View all
                    </Button>
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                    {(allJobs || []).slice(0, 3).map((job: any, idx: number) => (
                      <motion.div
                        key={job?._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        whileHover={{ y: -3, scale: 1.01 }}
                        style={{ flex: 1 }}
                      >
                        <Paper
                          onClick={() => job?._id && navigate(`/jobs?jobId=${job._id}`)}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            cursor: job?._id ? "pointer" : "default",
                            backgroundColor: "rgba(0,0,0,0.18)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#fff",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.22)" },
                          }}
                        >
                          <Stack spacing={0.75}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                              {job?.title || "New opportunity"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                              {job?.company?.name || "Organization"} · {job?.location || "On-site / Remote"}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
                              <Sparkles size={14} color="#fff" />
                              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.78)", fontWeight: 700 }}>
                                Apply in minutes
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </motion.div>
                    ))}

                    {(allJobs || []).length === 0 ? (
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          backgroundColor: "rgba(0,0,0,0.18)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          color: "#fff",
                          flex: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                          No jobs to feature yet. Try searching to explore opportunities.
                        </Typography>
                      </Paper>
                    ) : null}
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>

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
