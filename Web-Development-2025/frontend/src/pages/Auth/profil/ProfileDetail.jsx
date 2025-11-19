import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import {
  Typography,
  Avatar,
  Container,
  TextField,
  Button,
  Paper,
  Box,
  Grid
} from "@mui/material";

const ProfileEdit = () => {
  const navigate = useNavigate();

  const initialUserData = {
    name: "John Bee",
    class: "Kelas 2",
    username: "John",
    phone: "+62 8123 456 78",
    email: "siswa@gmail.com",
    gender: "Male",
    birthDate: "2 Jan 2015",
    password: "********",
    address: "Kab. Kuta, Bali, Indonesia"
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    navigate("/profile-detail");
  };

  const handleSave = () => {
    setIsEditing(false);
    navigate("/profile-detail");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Box textAlign="center" mb={4}>
            <Box position="relative" display="inline-block">
              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
                sx={{ width: 112, height: 112, bgcolor: "#bbdefb", mx: "auto" }}
              />
              <Box position="absolute" bottom={0} right={0} bgcolor="black" color="white" borderRadius="50%" p={0.5}>
                <FiEdit size={14} />
              </Box>
            </Box>
            <Typography variant="h6" mt={2}>{userData.name}</Typography>
            <Typography variant="body2" color="text.secondary">{userData.class}</Typography>
          </Box>

          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              {[
                { label: "Username", name: "username" },
                { label: "No. Telp", name: "phone" },
                { label: "Email", name: "email" },
                { label: "Gender", name: "gender" },
                { label: "Tanggal lahir", name: "birthDate" },
                { label: "Password", name: "password", type: "password" },
                { label: "Alamat", name: "address" },
              ].map(({ label, name, type }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    name={name}
                    type={type || "text"}
                    value={userData[name]}
                    onChange={handleChange}
                    disabled={!isEditing || name === "email"}
                  />
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileEdit;