import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      icon: <CheckCircleIcon />,
      color: "#10B981",
      bg: "#ECFDF5",
      text: "Pendaftaran kelas berhasil! Silakan lihat kelas Anda di jadwal.",
    },
    {
      id: 2,
      icon: <CalendarMonthIcon />,
      color: "#F59E0B",
      bg: "#FFFBEB",
      text: "Pengingat: Kelas BTQ Dasar dimulai besok pukul 08.00 WIB.",
    },
    {
      id: 3,
      icon: <MenuBookIcon />,
      color: "#2563EB",
      bg: "#EFF6FF",
      text: "Tugas Menulis Huruf Hijaiyah dikumpulkan besok pukul 09.00.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F0FDF4" }}>
      {/* ================= BG GRADIENT ATAS ================= */}
      <Box
        sx={{
          height: "20vh", // <- 1/3 halaman
          background: "linear-gradient(135deg, #047857, #34D399)",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      />

      {/* ================= CONTENT ================= */}
      <Container
        maxWidth="md"
        sx={{
          mt: "-18vh", // naik ke atas bg
          pb: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h5"
          fontWeight="bold"
          color="white"
          mb={3}
          sx={{ letterSpacing: 0.3 }}
        >
          Notifikasi
        </Typography>

        {/* CARD */}
        <Card
          sx={{
            borderRadius: 4,
            border: "2px solid #D1FAE5",
            boxShadow: "0 12px 30px rgba(0,0,0,.18)",
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {notifications.map((item, index) => (
              <Box key={item.id}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    px: 3,
                    py: 2.5,
                    transition: "0.2s ease",
                    "&:hover": {
                      backgroundColor: "#F0FDFA",
                    },
                  }}
                >
                  {/* ICON */}
                  <Avatar
                    sx={{
                      bgcolor: item.bg,
                      color: item.color,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  {/* TEXT */}
                  <Box>
                    <Typography fontSize={15} fontWeight={500}>
                      {item.text}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary" mt={0.5}>
                      Baru saja
                    </Typography>
                  </Box>
                </Stack>

                {index !== notifications.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
