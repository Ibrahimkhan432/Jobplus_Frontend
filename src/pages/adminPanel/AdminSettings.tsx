import { Alert, Box, Typography } from "@mui/material";

export default function AdminSettings() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
        Settings
      </Typography>
      <Alert severity="info">System settings UI will be implemented next.</Alert>
    </Box>
  );
}
