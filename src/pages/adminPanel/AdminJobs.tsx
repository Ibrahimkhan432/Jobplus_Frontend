import { Alert, Box, Typography } from "@mui/material";

export default function AdminJobs() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
        Jobs
      </Typography>
      <Alert severity="info">
        Jobs management UI will be wired up next (list, moderate, edit, remove).
      </Alert>
    </Box>
  );
}
