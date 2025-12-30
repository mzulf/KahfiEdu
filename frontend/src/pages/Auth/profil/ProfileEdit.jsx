import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  const [userData, setUserData] = useState({
    name: "John Bee",
    class: "Kelas 2",
    username: "John",
    phone: "+62 8123 456 78",
    email: "siswa@gmail.com",
    gender: "Male",
    birthDate: "2 Jan 2015",
    password: "********",
    address: "Kab. Kuta, Bali, Indonesia",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#F9FAFB">
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #047857, #34D399)",
          pt: 5,
          pb: 10, // ⬅️ cuma ±1/3 layar
          borderRadius: "0 0 48px 48px",
        }}
      >
        <Container maxWidth="sm">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "white", mb: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight={700}
            color="white"
            textAlign="center"
            sx={{ mt: 3, mb: 2 }} // ⬅️ JARAK AMAN DARI AVATAR
          >
            Edit Profil
          </Typography>
        </Container>
      </Box>

      {/* ================= CONTENT ================= */}
      <Container maxWidth="sm" sx={{ mt: "-80px", pb: 10 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 24px 50px rgba(0,0,0,0.18)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* ===== AVATAR ===== */}
            <Box textAlign="center" mb={4}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #047857, #34D399)",
                  }}
                >
                  <Avatar
                    src={avatar || undefined}
                    sx={{
                      width: 110,
                      height: 110,
                      bgcolor: "#ECFDF5",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                    }}
                  >
                    {!avatar && (
                      <PersonOutlineIcon
                        sx={{ fontSize: 52, color: "#047857" }}
                      />
                    )}
                  </Avatar>
                </Box>

                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    bgcolor: "#047857",
                    color: "white",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "#065F46" },
                  }}
                >
                  <EditIcon fontSize="small" />
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              </Box>

              <Typography fontWeight={700} mt={2}>
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.class}
              </Typography>
            </Box>

            {/* ===== FORM ===== */}
            <Stack spacing={3}>
              <TextField
                label="Username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="No. Telp"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                fullWidth
              />
              <TextField label="Email" value={userData.email} disabled fullWidth />
              <TextField
                label="Gender"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Tanggal Lahir"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Alamat"
                name="address"
                value={userData.address}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
            </Stack>

            {/* ===== ACTION BUTTONS ===== */}
            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  textTransform: "none",
                  bgcolor: "#047857",
                  "&:hover": { bgcolor: "#065F46" },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileEdit;
