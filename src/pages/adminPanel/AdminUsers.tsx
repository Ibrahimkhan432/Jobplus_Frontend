import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/utils/axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { toast } from "sonner";

type UserRow = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "recruiter" | "student";
  recruiterStatus?: "pending" | "verified" | "suspended" | "rejected";
  createdAt: string;
};

type RecruiterStatus = "pending" | "verified" | "suspended" | "rejected";

const recruiterStatusOptions: RecruiterStatus[] = [
  "pending",
  "verified",
  "suspended",
  "rejected",
];

function recruiterStatusChipColor(status?: RecruiterStatus) {
  switch (status) {
    case "verified":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "error";
    case "rejected":
      return "default";
    default:
      return "default";
  }
}

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);

  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("");
  const [recruiterStatus, setRecruiterStatus] = useState<string>("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (q.trim()) params.q = q.trim();
      if (role) params.role = role;
      if (recruiterStatus) params.recruiterStatus = recruiterStatus;

      const res = await axiosInstance.get("/admin/users", { params });
      if (res.data?.success) {
        setUsers(res.data.users || []);
        return;
      }
      setError("Failed to load users.");
    } catch (e) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRecruiterStatus = async (userId: string, status: RecruiterStatus) => {
    try {
      const res = await axiosInstance.put(`/admin/recruiters/${userId}/status`, {
        recruiterStatus: status,
      });
      if (res.data?.success) {
        toast.success("Recruiter status updated");
        await fetchUsers();
        return;
      }
      toast.error(res.data?.message || "Failed to update recruiter status");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update recruiter status");
    }
  };

  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      {
        field: "fullName",
        headerName: "Name",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 220,
      },
      {
        field: "role",
        headerName: "Role",
        width: 130,
        renderCell: (params) => <Chip size="small" label={params.value} />,
      },
      {
        field: "recruiterStatus",
        headerName: "Recruiter status",
        width: 170,
        valueGetter: (_value, row) =>
          row.role === "recruiter" ? (row.recruiterStatus || "pending") : "-",
      },
      {
        field: "statusActions",
        headerName: "Actions",
        width: 280,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row;
          if (row.role !== "recruiter") {
            return <Typography variant="body2" color="text.secondary">-</Typography>;
          }

          const current = (row.recruiterStatus || "pending") as RecruiterStatus;
          return (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
              <Chip
                size="small"
                label={current}
                color={recruiterStatusChipColor(current)}
                variant={current === "rejected" ? "outlined" : "filled"}
              />
              <TextField
                size="small"
                select
                value={current}
                onChange={(e) => updateRecruiterStatus(row._id, e.target.value as RecruiterStatus)}
                sx={{ minWidth: 140 }}
              >
                {recruiterStatusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Created",
        width: 140,
        valueGetter: (_value, row) => {
          const v = row.createdAt;
          return typeof v === "string" ? v.split("T")[0] : "";
        },
      },
    ],
    []
  );

  const filtered = users;

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Approve, suspend, or reject recruiters. Search users by name/email.
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <TextField
            label="Search"
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or email"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Role"
            size="small"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ width: { xs: "100%", md: 180 } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </TextField>
          <TextField
            label="Recruiter status"
            size="small"
            select
            value={recruiterStatus}
            onChange={(e) => setRecruiterStatus(e.target.value)}
            sx={{ width: { xs: "100%", md: 200 } }}
          >
            <MenuItem value="">All</MenuItem>
            {recruiterStatusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={fetchUsers} sx={{ height: 40, whiteSpace: "nowrap" }}>
            Apply filters
          </Button>
        </Stack>
      </Paper>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            slots={{
              loadingOverlay: () => (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
