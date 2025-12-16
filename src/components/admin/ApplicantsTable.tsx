import { useMemo, useState, type MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axiosInstance from '@/utils/axios'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { DataGrid, GridOverlay, type GridColDef } from '@mui/x-data-grid'

const shortlistingStatus = ["Accepted", "Rejected"] as const
type ShortlistingStatus = typeof shortlistingStatus[number]

const NoRows = () => {
  return (
    <GridOverlay>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No applicants found.
        </Typography>
      </Box>
    </GridOverlay>
  )
}

const LoadingOverlay = () => {
  return (
    <GridOverlay>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading applicants...
        </Typography>
      </Box>
    </GridOverlay>
  )
}

const ApplicantsTable = () => {
  const { applicants } = useSelector((store: any) => store.application)
  const applications = applicants?.applications ?? []
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)

  const openActionMenu = Boolean(actionAnchorEl)

  const handleOpenActions = (event: MouseEvent<HTMLButtonElement>, applicationId: string) => {
    setActionAnchorEl(event.currentTarget)
    setSelectedApplicationId(applicationId)
  }

  const handleCloseActions = () => {
    setActionAnchorEl(null)
    setSelectedApplicationId(null)
  }

  const statusHandler = async (status: ShortlistingStatus, id: string) => {
    try {
      const res = await axiosInstance.post(`/application/status/${id}/update`, { status })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log("error in job applicantTable", error)
    }
  }

  const rows = useMemo(() => {
    return applications.map((item: any) => ({
      id: item?._id,
      fullName: item?.applicant?.fullName ?? "",
      email: item?.applicant?.email ?? "",
      contact: item?.applicant?.phoneNumber ?? "",
      resumeUrl: item?.applicant?.profile?.resume ?? "",
      resumeName: item?.applicant?.profile?.resumeOriginalName ?? "Resume",
      date: item?.applicant?.createdAt ? String(item.applicant.createdAt).split("T")[0] : "",
    }))
  }, [applications])

  const columns = useMemo<GridColDef[]>(() => {
    return [
      { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 160 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
      { field: 'contact', headerName: 'Contact', flex: 1, minWidth: 140 },
      {
        field: 'resume',
        headerName: 'Resume',
        flex: 1,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const resumeUrl = params.row.resumeUrl
          const resumeName = params.row.resumeName
          if (!resumeUrl) return <Typography variant="body2">NA</Typography>
          return (
            <Button
              component="a"
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              size="small"
              sx={{ textTransform: 'none', px: 0 }}
            >
              {resumeName}
            </Button>
          )
        },
      },
      { field: 'date', headerName: 'Date', width: 120 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => handleOpenActions(e, String(params.row.id))}
            >
              Action
            </Button>
          )
        },
      },
    ]
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        A list of your recent applied user
      </Typography>

      <Box sx={{ height: 520, width: '100%', backgroundColor: 'background.paper', borderRadius: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={!applicants}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          slots={{
            noRowsOverlay: NoRows,
            loadingOverlay: LoadingOverlay,
          }}
        />
      </Box>

      <Menu anchorEl={actionAnchorEl} open={openActionMenu} onClose={handleCloseActions}>
        {shortlistingStatus.map((status) => (
          <MenuItem
            key={status}
            onClick={async () => {
              if (!selectedApplicationId) return
              await statusHandler(status, selectedApplicationId)
              handleCloseActions()
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default ApplicantsTable
