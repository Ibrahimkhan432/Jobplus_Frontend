import { useSelector } from "react-redux";
import { Box, Chip, Typography } from "@mui/material";
import { DataGrid, GridOverlay, type GridColDef } from "@mui/x-data-grid";

function AppliedJobTable() {
  const allAppliedJobs = useSelector((store: any) => store.job.allAppliedJobs);

  const rows = (allAppliedJobs || []).map((appliedJob: any) => ({
    id: appliedJob?._id,
    date: appliedJob?.createdAt ? String(appliedJob.createdAt).split("T")[0] : "",
    role: appliedJob?.job?.title ?? "",
    company: appliedJob?.job?.company?.name ?? "",
    status: String(appliedJob?.status || "").toLowerCase(),
  }));

  const NoRows = () => (
    <GridOverlay>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You haven't applied any job yet.
        </Typography>
      </Box>
    </GridOverlay>
  );

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 120 },
    { field: "role", headerName: "Job Role", flex: 1, minWidth: 180 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 160 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const value = String(params.value || "");
        const color = value === "accepted" ? "success" : value === "rejected" ? "error" : "warning";
        return <Chip size="small" label={value.toUpperCase()} color={color as any} variant="outlined" />;
      },
    },
  ];

  return (
    <Box sx={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        slots={{
          noRowsOverlay: NoRows,
        }}
      />
    </Box>
  );
}

export default AppliedJobTable;
