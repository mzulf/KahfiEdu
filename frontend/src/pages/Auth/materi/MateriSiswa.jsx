import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  Skeleton,
} from "@mui/material";
import materiService from "../../../services/materiService";

export default function MateriSiswa() {
  const [materiList, setMateriList] = useState([]);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await materiService.getMateri({
          status: "active",
          limit: 100,
        });

        setMateriList(res.data || []);
        setSelectedMateri(res.data?.[0] || null);
      } catch (err) {
        console.error("Gagal mengambil materi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, []);

  if (loading) return <MateriSkeleton />;

  if (!materiList.length) {
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <Typography color="text.secondary">Materi belum tersedia</Typography>
      </Box>
    );
  }

  const imageUrl = selectedMateri?.imageUrl
    ? `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${selectedMateri.imageUrl}`
    : null;

  return (
    <Box sx={{ position: "relative" }}>
      {/* ================= BG GRADIENT ================= */}
      <Box
        sx={{
          height: { xs: 120, md: 170 },
          background: "linear-gradient(135deg, #047857, #34D399)",
          borderRadius: "0 0 48px 48px",
        }}
      />

      {/* ================= CONTENT ================= */}
      <Container maxWidth="xl" sx={{ mt: -12, mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            boxShadow: "0 22px 50px rgba(0,0,0,.2)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Materi Pembelajaran
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 3,
            }}
          >
            {/* ================= LEFT DETAIL ================= */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: "2px solid #A7F3D0",
                boxShadow: "0 12px 30px rgba(0,0,0,.18)",
              }}
            >
              {imageUrl && (
                <Box
                  component="img"
                  src={imageUrl}
                  alt="materi"
                  loading="lazy"
                  sx={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                    borderRadius: 3,
                    mb: 3,
                    bgcolor: "#F0FDF4",
                  }}
                />
              )}

              <Typography variant="h5" fontWeight="bold" mb={1}>
                {selectedMateri.title}
              </Typography>

              <Typography color="text.secondary" lineHeight={1.7}>
                {selectedMateri.detail}
              </Typography>
            </Paper>

            {/* ================= RIGHT LIST ================= */}
            <Paper
              sx={{
                borderRadius: 4,
                border: "2px solid #A7F3D0",
                boxShadow: "0 12px 30px rgba(0,0,0,.18)",
                maxHeight: "75vh",
                overflowY: "auto",
              }}
            >
              <Typography
                fontWeight="bold"
                px={2}
                py={2}
                sx={{ borderBottom: "1px solid #D1FAE5" }}
              >
                Daftar Materi
              </Typography>

              <List disablePadding>
                {materiList.map((item) => {
                  const isActive = selectedMateri?.id === item.id;
                  return (
                    <ListItemButton
                      key={item.id}
                      onClick={() => setSelectedMateri(item)}
                      sx={{
                        alignItems: "flex-start",
                        borderBottom: "1px solid #ECFDF5",
                        bgcolor: isActive ? "#ECFDF5" : "transparent",
                        "&:hover": {
                          bgcolor: "#F0FDF4",
                        },
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>{item.title}</Typography>
                        <Typography fontSize={14} color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

/* ================= SKELETON ================= */
function MateriSkeleton() {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          height: { xs: 220, md: 280 },
          background: "linear-gradient(135deg, #047857, #34D399)",
          borderRadius: "0 0 48px 48px",
        }}
      />

      <Container maxWidth="xl" sx={{ mt: -12 }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 3,
            }}
          >
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 3, mb: 3 }} />
              <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} />
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={60} sx={{ mb: 1 }} />
              ))}
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
