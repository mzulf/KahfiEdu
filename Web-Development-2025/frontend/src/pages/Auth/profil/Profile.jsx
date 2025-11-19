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

      {/* Profile Header with Green Gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #81c784 0%, #66bb6a 100%)",
          py: 6,
          px: 3,
          borderRadius: "0 0 40px 40px",
        }}
      >
        <Container>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#2196f3",
                }}
              >
                <PersonOutlineIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box color="white">
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  {userData.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <LocationOnIcon fontSize="small" />
                  <Typography>{userData.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <EmailIcon fontSize="small" />
                  <Typography>{userData.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <WhatsAppIcon fontSize="small" />
                  <Typography>{userData.phone}</Typography>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                sx={{
                  bgcolor: "white",
                  color: "#4caf50",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Edit profile
              </Button>
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                sx={{
                  bgcolor: "#f44336",
                  color: "white",
                  "&:hover": { bgcolor: "#d32f2f" },
                  textTransform: "none",
                  fontWeight: "bold",
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
              Data orang tua
            </Typography>

            <Box mb={3}>
              <Typography color="text.secondary" mb={1}>
                Nama Orang tua: {parentData.name}
              </Typography>
              <Typography color="text.secondary" mb={1}>
                Sebagai: {parentData.role}
              </Typography>
              <Typography color="text.secondary" mb={1}>
                Gender: {parentData.gender}
              </Typography>
              <Typography color="text.secondary" mb={3}>
                No. Telp: {parentData.phone}
              </Typography>
            </Box>

            <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  mb: 2,
                  width: "100%",
                  borderRadius: 2,
                }}
              >
                Anak 1
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  width: "100%",
                  borderColor: "#4caf50",
                  color: "#4caf50",
                  borderRadius: 2,
                }}
              >
                Tambah daftar anak
              </Button>
            </Card>
          </Grid>

          {/* Right Side - Tabs and Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Tabs */}
            <Box mb={3}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#4caf50',
                  },
                  '& .MuiTab-root': {
                    minHeight: 48,
                  },
                  '& .Mui-selected': {
                    color: '#4caf50 !important',
                  }
                }}
              >
                <Tab label="📋 Tugas" sx={{ textTransform: "none", fontWeight: "medium" }} />
                <Tab label="📅 Absen" sx={{ textTransform: "none", fontWeight: "medium" }} />
                <Tab label="💳 Pembayaran" sx={{ textTransform: "none", fontWeight: "medium" }} />
              </Tabs>
            </Box>

            {/* Tugas Tab */}
            {activeTab === 0 && (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      Tugas
                    </Typography>
                    <Typography sx={{ fontSize: "1.2rem" }}>📝</Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={2}>
                    {taskHistory.map((task, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 2,
                          px: 0,
                          borderBottom: index !== taskHistory.length - 1 ? '1px solid #e0e0e0' : 'none'
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box textAlign="center" minWidth={60}>
                            <Typography variant="body2" fontWeight="bold">
                              {task.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.time}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography fontWeight="medium" mb={0.5}>
                              {task.task}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.schedule}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          {task.status === "Progress" ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2">Progress</Typography>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  border: '2px solid #ff9800',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#ff9800'
                                  }}
                                />
                              </Box>
                            </Box>
                          ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2">Done</Typography>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: '#4caf50',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Typography sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Attendance History */}
            {activeTab === 1 && (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      History absen
                    </Typography>
                    <Typography sx={{ fontSize: "1.2rem" }}>📊</Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={2}>
                    {attendanceHistory.map((record, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          '&:hover': { boxShadow: 2 }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography fontWeight="bold" mb={0.5}>
                              {record.name}
                            </Typography>
                            <Typography color="text.secondary" mb={0.5}>
                              {record.session}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {record.time}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {record.date}
                            </Typography>
                            <Chip
                              label={`${record.status} ✓`}
                              size="small"
                              sx={{
                                bgcolor: "#4caf50",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Payment History */}
            {activeTab === 2 && (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      History pembayaran
                    </Typography>
                    <HomeIcon sx={{ color: "#4caf50" }} />
                  </Box>

                  <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 'bold', borderRadius: '8px 0 0 0' }}>No.</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Periode</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Deskripsi</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tanggal</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Billing</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', borderRadius: '0 8px 0 0' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentHistory.map((row, index) => (
                          <TableRow
                            key={row.no}
                            sx={{
                              '&:hover': { bgcolor: '#f9f9f9' },
                              ...(index === paymentHistory.length - 1 && {
                                '& td:first-of-type': { borderRadius: '0 0 0 8px' },
                                '& td:last-of-type': { borderRadius: '0 0 8px 0' }
                              })
                            }}
                          >
                            <TableCell>{row.no}</TableCell>
                            <TableCell>{row.period}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.billing}</TableCell>
                            <TableCell>{row.payment}</TableCell>
                            <TableCell>{getStatusChip(row.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
};

export default Profile;