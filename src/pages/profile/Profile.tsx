import AppliedJobTable from "@/components/AppliedJobTable";
import Navbar from "@/components/global/Navbar";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "../../hooks/useGetAppliedJobs";
import { toast } from "sonner";
import { setUser } from "../../../redux/authSlice";
import axiosInstance from "@/utils/axios";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Pen } from "lucide-react";

const isApplied = true;

function Profile() {
  useGetAppliedJobs();
  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
    file: null as File | null,
    profilePhoto: user?.profile?.profilePhoto || ""
  });

  React.useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
      file: null,
      profilePhoto: user?.profile?.profilePhoto || ""
    });
  }, [user]);

  const profileFields = [
    user?.fullName,
    user?.email,
    user?.phoneNumber,
    user?.profile?.bio,
    user?.profile?.skills && user.profile.skills.length > 0,
    user?.profile?.resume,
    user?.profile?.profilePhoto,
  ];
  const filledFields = profileFields.filter(Boolean).length;
  const totalFields = profileFields.length;
  const completion = Math.round((filledFields / totalFields) * 100);
  const isProfileComplete = completion === 100;

  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({
        ...prev,
        profilePhoto: URL.createObjectURL(e.target.files![0]),
        file: e.target.files![0]
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setForm(prev => ({ ...prev, file: e.target.files![0] }));
  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedExtensions = ["pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error("Only PDF files are allowed for resume upload.");
        return;
      }

      setForm(prev => ({ ...prev, file }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("bio", form.bio);
      formData.append("skills", form.skills);

      if (form.file) {
        if (form.file.type.startsWith('image/')) {
          formData.append("profilePhoto", form.file); // for photo
        } else {
          formData.append("file", form.file); // for resume
        }
      }

      const res = await axiosInstance.post(
        `/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("res in profile update", res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log("error while updating profile",error)
      toast.error("Something went wrong while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
      file: null,
      profilePhoto: user?.profile?.profilePhoto || ""
    });
    setEditMode(false);
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
              <Box sx={{ position: "relative", width: 96, height: 96 }}>
                <Avatar
                  src={
                    form.profilePhoto ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s"
                  }
                  alt={user?.fullName}
                  sx={{ width: 96, height: 96 }}
                />
                {editMode ? (
                  <Box
                    onClick={handlePhotoClick}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Pen color="#fff" size={20} />
                  </Box>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  ref={photoInputRef}
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editMode ? (
                    <TextField
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    user?.fullName
                  )}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {editMode ? (
                    <TextField
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="Add a short bio"
                      size="small"
                      fullWidth
                      multiline
                      minRows={2}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {user?.profile?.bio || "No bio added"}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "stretch", sm: "flex-end" } }}>
                {!editMode ? (
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Profile completion
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {filledFields}/{totalFields} fields
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color={isProfileComplete ? "success.main" : "warning.main"}>
                    {isProfileComplete ? "Profile complete!" : `${completion}% complete`}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={completion}
                  sx={{ height: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.08)" }}
                />
              </Box>

              <Divider />

              <Stack spacing={2}>
                <TextField
                  label="Email"
                  name="email"
                  value={editMode ? form.email : (user?.email || "")}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Phone"
                  name="phoneNumber"
                  value={editMode ? form.phoneNumber : (user?.phoneNumber || "")}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: !editMode }}
                />

                {editMode ? (
                  <TextField
                    label="Skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Comma separated skills"
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Skills
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {user?.profile?.skills && user.profile.skills.length > 0 ? (
                        user.profile.skills.map((s: string, idx: number) => (
                          <Chip key={`${s}-${idx}`} label={s} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No skills added
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Resume
                  </Typography>
                  {editMode ? (
                    <Button component="label" variant="outlined">
                      Upload resume (PDF)
                      <input type="file" hidden name="file" onChange={handleFileChange} accept=".pdf" />
                    </Button>
                  ) : user?.profile?.resume ? (
                    <Button
                      component="a"
                      href={user.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      sx={{ textTransform: "none", px: 0 }}
                    >
                      {user?.profile?.resumeOriginalName || "View Resume"}
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No resume uploaded
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {user && user.role === "student" ? (
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Applied Jobs
              </Typography>
              {isApplied ? (
                <AppliedJobTable />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No applied jobs
                </Typography>
              )}
            </Paper>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

export default Profile;