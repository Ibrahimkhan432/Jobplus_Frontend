import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import JobCard from "./Jobcard";
import { motion } from "framer-motion";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

function LatestJobs() {
  const navigate = useNavigate();
  const { allJobs } = useSelector((store: any) => store.job);
  console.log("allJobs in LatestJobs:", allJobs);

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between" sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff" }}>
                Featured Jobs
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.78)" }}>
                Explore our latest job opportunities
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/jobs"
              variant="contained"
              sx={{ textTransform: "none", alignSelf: { xs: "stretch", md: "auto" } }}
            >
              View All Jobs
            </Button>
          </Stack>
        </motion.div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
            gap: 2.5,
          }}
        >
          {allJobs?.length === 0 ? (
            <Box
              sx={{
                gridColumn: "1 / -1",
                p: 4,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>
                No Jobs Found
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.75)" }}>
                Try checking back later or explore other categories.
              </Typography>
            </Box>
          ) : (
            allJobs?.slice(0, 6).map((job: any, idx: number) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <JobCard job={job} onSelect={(id: string) => navigate(`/jobs?jobId=${id}`)} />
              </motion.div>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default LatestJobs;
