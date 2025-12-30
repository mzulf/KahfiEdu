import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "../../../libs/axiosInstance";
import { toast } from "react-toastify";

export default function DetailGuru() {
  const { id } = useParams();
  const [guru, setGuru] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchGuru = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/user/${id}`);
        setGuru(res.data.user);
      } catch {
        toast.error("Gagal mengambil detail guru");
      } finally {
        setLoading(false);
      }
    };
    fetchGuru();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (!guru)
    return (
      <Container>
        <Typography mt={4}>Data guru tidak ditemukan</Typography>
      </Container>
    );

  const fullAddress = [
    guru.alamat,
    guru.village,
    guru.district,
    guru.regency,
    guru.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Container maxWidth="sm" sx={{ mt: 7, mb: 7 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          border: "2px solid #A7F3D0",
          boxShadow: "0 12px 32px rgba(0,0,0,.2)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={guru.avatar}
            sx={{
              width: 110,
              height: 110,
              bgcolor: "#047857",
              boxShadow: "0 6px 16px rgba(0,0,0,.3)",
            }}
          >
            {!guru.avatar && guru.name?.[0]}
          </Avatar>

          <Typography variant="h5" fontWeight="bold">
            {guru.name}
          </Typography>
          <Typography color="text.secondary">{guru.email}</Typography>
          <Typography color="text.secondary">{guru.phone || "-"}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight="bold" mb={1}>
          Alamat
        </Typography>
        <Typography color="text.secondary">
          {fullAddress || "-"}
        </Typography>
      </Paper>
    </Container>
  );
}
