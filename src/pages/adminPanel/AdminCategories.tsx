import { Alert, Box, Typography } from "@mui/material";

export default function AdminCategories() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
        Categories
      </Typography>
      <Alert severity="info">
        Category management UI will be implemented next (CRUD + ordering).
      </Alert>
    </Box>
  );
}
