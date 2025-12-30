import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import KahfLogo from "../../../components/KahfLogo";


const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const userData = {
    name: "John Bee",
    location: "Bali, Indonesia",
    email: "john@gmail.com",
    phone: "62 8123 4567 89",
  };

  const parentData = {
    name: "Sri Yulianti",
    role: "Ibu",
    gender: "Female",
    phone: "+62 8144 6555 990",
  };

  const taskHistory = [
    {
      date: "Today",
      time: "12:41",
      task: "Tugas menulis",
      schedule: "08:00 AM - 10:00 AM",
      status: "Progress",
    },
    {
      date: "Yesterday",
      time: "10:00",
      task: "Tugas belajar",
      schedule: "08:00 AM - 10:00 AM",
      status: "Done",
    },
    {
      date: "Friday",
      time: "18:00",
      task: "Tugas belajar",
      schedule: "08:00 AM - 10:00 AM",
      status: "Done",
    },
  ];

  const attendanceHistory = [
    {
      name: "John Bee",
      session: "Session 3",
      time: "08:00 AM - 10:00 AM",
      date: "Today, 10 Mei 2025",
      status: "Attend",
    },
    {
      name: "John Bee",
      session: "Session 2",
      time: "09:00 AM - 11:00 AM",
      date: "Kamis, 9 Mei 2025",
      status: "Attend",
    },
    {
      name: "John Bee",
      session: "Session 1",
      time: "08:00 AM - 10:00 AM",
      date: "Rabu, 8 Mei 2025",
      status: "Attend",
    },
  ];

  const paymentHistory = [
    {
      no: 1,
      period: 2025,
      description: "Bulan Kedua",
      date: "2 Mei 2025",
      billing: "100.000",
      payment: "0",
      status: "Upcoming",
    },
    {
      no: 2,
      period: 2025,
      description: "E - Book",
      date: "22 Apr 2025",
      billing: "50.000",
      payment: "50.000",
      status: "Paid",
    },
    {
      no: 3,
      period: 2025,
      description: "Bulan Pertama",
      date: "15 Apr 2025",
      billing: "150.000",
      payment: "150.000",
      status: "Paid",
    },
    {
      no: 4,
      period: 2025,
      description: "Biaya Masuk",
      date: "2 Apr 2025",
      billing: "100.000",
      payment: "100.000",
      status: "Paid",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    navigate('/siswa/profile-edit');
  };

  const getStatusChip = (status) => {
    if (status === "Paid") {
      return (
        <Chip
          label="Paid ✓"
          size="small"
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            fontWeight: "bold",
          }}
        />
      );
    } else if (status === "Upcoming") {
      return (
        <Chip
          label="Upcoming ⏰"
          size="small"
          sx={{
            bgcolor: "#ff9800",
            color: "white",
            fontWeight: "bold",
          }}
        />
      );
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" >

    {/* ================= PROFILE HEADER ================= */}
{/* ================= PROFILE HEADER ================= */}
<Box
  sx={{
    background: "linear-gradient(135deg, #047857, #34D399)", // gradasi
    pb: 12,
    pt: 6,
    borderRadius: "0 0 56px 56px",
  }}
>
  <Container>
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 5,
        px: { xs: 3, md: 5 },
        py: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center", // 🔥 sejajar tengah
        justifyContent: "space-between",
        gap: { xs: 3, md: 2 }, // 🔥 lebih dekat
        boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
      }}
    >
      {/* LEFT PROFILE */}
      <Box display="flex" alignItems="center" gap={3}>
        {/* Avatar Ring */}
        <Box
          sx={{
            p: 0.8,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #047857, #34D399)",
          }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: "#ECFDF5",
              color: "#047857",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 48 }} />
          </Avatar>
        </Box>

        {/* User Info */}
        <Box>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            {userData.name}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <LocationOnIcon sx={{ fontSize: 18, color: "#047857" }} />
            <Typography variant="body2" color="text.secondary">
              {userData.location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <EmailIcon sx={{ fontSize: 18, color: "#047857" }} />
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <WhatsAppIcon sx={{ fontSize: 18, color: "#047857" }} />
            <Typography variant="body2" color="text.secondary">
              {userData.phone}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ACTION BUTTONS */}
      <Box
        display="flex"
        flexDirection="column"
        gap={1} // 🔥 lebih rapet
        sx={{
          width: { xs: "100%", md: "auto" },
          alignItems: { xs: "stretch", md: "flex-end" },
        }}
      >
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProfile}
          sx={{
            bgcolor: "#047857",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 3,
            px: 3,
            py: 1,
            minWidth: 150,
            "&:hover": {
              bgcolor: "#065F46",
              transform: "translateY(-1px)",
            },
          }}
        >
          Edit Profile
        </Button>

        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: "#DC2626",
            color: "#DC2626",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 3,
            px: 3,
            py: 1,
            minWidth: 150,
            "&:hover": {
              bgcolor: "#FEE2E2",
              borderColor: "#DC2626",
              transform: "translateY(-1px)",
            },
          }}
        >
          Log out
        </Button>
      </Box>
    </Box>
  </Container>
</Box>


      {/* Main Content */}
      <Box sx={{ mt: 4, mb: 4, px: 16 }}>
        <Grid container spacing={4}>
        {/* Left Side - Parent Data */}
<Grid size={{ xs: 12, md: 4 }}>
  <Typography variant="h6" fontWeight="bold" mb={2}>
    Data Orang Tua
  </Typography>

  <Box
    sx={{
      backgroundColor: "#ECFDF5",
      borderRadius: 3,
      p: 3,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      border: "1px solid #D1FAE5",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 16px 35px rgba(0,0,0,0.12)",
        transform: "translateY(-2px)",
      },
    }}
  >
    {/* Nama */}
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Avatar
        sx={{
          bgcolor: "#047857",
          width: 36,
          height: 36,
        }}
      >
        <PersonOutlineIcon sx={{ fontSize: 18 }} />
      </Avatar>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Nama Orang Tua
        </Typography>
        <Typography fontWeight={600}>
          {parentData.name}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 1.5 }} />

    {/* Role */}
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Avatar
        sx={{
          bgcolor: "#10B981",
          width: 36,
          height: 36,
        }}
      >
        <Chip
          label={parentData.role}
          size="small"
          sx={{
            bgcolor: "white",
            color: "#047857",
            fontWeight: 600,
            height: 20,
          }}
        />
      </Avatar>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Peran
        </Typography>
        <Typography fontWeight={600}>
          {parentData.role}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 1.5 }} />

    {/* Gender */}
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Avatar
        sx={{
          bgcolor: "#34D399",
          width: 36,
          height: 36,
        }}
      >
        <PersonOutlineIcon sx={{ fontSize: 18 }} />
      </Avatar>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Gender
        </Typography>
        <Typography fontWeight={600}>
          {parentData.gender}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 1.5 }} />

    {/* Phone */}
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        sx={{
          bgcolor: "#059669",
          width: 36,
          height: 36,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 18 }} />
      </Avatar>

      <Box>
        <Typography variant="caption" color="text.secondary">
          No. Telp
        </Typography>
        <Typography fontWeight={600}>
          {parentData.phone}
        </Typography>
      </Box>
    </Box>
  </Box>
</Grid>



         <Grid size={{ xs: 12, md: 8 }}>
  <Box
    sx={{
      backgroundColor: "#ECFDF5",
      borderRadius: 4,
      p: { xs: 2, md: 3 },
      boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
      border: "1.5px solid #D1FAE5",
    }}
  >
    {/* ================= TABS ================= */}
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="fullWidth"
      sx={{
        mb: 3,
        backgroundColor: "white",
        borderRadius: 3,
        p: 0.5,
        boxShadow: "inset 0 0 0 1px #E5E7EB",
        "& .MuiTabs-indicator": { display: "none" },
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          minHeight: 44,
          transition: "all .35s cubic-bezier(.34,1.56,.64,1)",
        },
        "& .MuiTab-root:hover": {
          backgroundColor: "#ECFDF5",
        },
        "& .Mui-selected": {
          backgroundColor: "#047857",
          color: "white !important",
          boxShadow: "0 8px 20px rgba(4,120,87,.35)",
        },
      }}
    >
      <Tab label="📋 Tugas" />
      <Tab label="📅 Absen" />
      <Tab label="💳 Pembayaran" />
    </Tabs>

    {/* ================= CONTENT ANIMATION WRAPPER ================= */}
    <Box
      sx={{
        animation: "fadeSlide .45s ease",
        "@keyframes fadeSlide": {
          from: { opacity: 0, transform: "translateY(12px) scale(.98)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      }}
    >
      {/* ================= TUGAS ================= */}
      {activeTab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              📝 Daftar Tugas
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {taskHistory.map((task, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all .35s cubic-bezier(.34,1.56,.64,1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 14px 30px rgba(0,0,0,.15)",
                    },
                    "&:active::after": {
                      opacity: 1,
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle, rgba(16,185,129,.3) 0%, transparent 60%)",
                      opacity: 0,
                      transition: "opacity .4s",
                    },
                    "@media (hover: none)": {
                      "&:hover": { transform: "none", boxShadow: "none" },
                    },
                  }}
                >
                  <Box display="flex" gap={2}>
                    <Box minWidth={70} textAlign="center">
                      <Typography fontWeight={600}>{task.date}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.time}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontWeight={600}>{task.task}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.schedule}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={task.status === "Progress" ? "Progress" : "Done ✓"}
                    sx={{
                      fontWeight: 600,
                      bgcolor:
                        task.status === "Progress" ? "#FEF3C7" : "#D1FAE5",
                      color:
                        task.status === "Progress" ? "#92400E" : "#047857",
                      transition: "all .25s",
                      "&:hover": {
                        transform: "scale(1.08)",
                        boxShadow: "0 6px 14px rgba(16,185,129,.35)",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= ABSEN ================= */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              📊 Riwayat Absen
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {attendanceHistory.map((record, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    transition: "all .3s",
                    "&:hover": {
                      transform: "translateX(6px)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.12)",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>{record.session}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.time}
                      </Typography>
                    </Box>
                    <Chip
                      label="Attend ✓"
                      sx={{
                        bgcolor: "#047857",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {record.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= PEMBAYARAN ================= */}
      {activeTab === 2 && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              💳 Riwayat Pembayaran
            </Typography>

            <TableContainer
              sx={{
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F0FDF4" }}>
                    <TableCell>No</TableCell>
                    <TableCell>Periode</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((row) => (
                    <TableRow
                      key={row.no}
                      sx={{
                        transition: "all .25s",
                        "&:hover": {
                          backgroundColor: "#ECFDF5",
                        },
                      }}
                    >
                      <TableCell>{row.no}</TableCell>
                      <TableCell>{row.period}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  </Box>
</Grid>


        </Grid>
      </Box>

    </Box>
  );
};

export default Profile;