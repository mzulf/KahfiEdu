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

const DetailGuru = () => {
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
      } catch (err) {
        toast.error("Gagal mengambil detail guru");
      } finally {
        setLoading(false);
      }
    };

    fetchGuru();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!guru) {
    return (
      <Container>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Detail guru tidak ditemukan
        </Typography>
      </Container>
    );
  }

  const {
    name,
    email,
    phone,
    alamat,
    village,
    district,
    regency,
    province,
    avatar,
  } = guru;

  const fullAddress = [
    alamat,
    village,
    district,
    regency,
    province,
  ].filter(Boolean).join(", ");

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Avatar
            src={avatar}
            alt={name}
            sx={{ width: 100, height: 100 }}
          />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {phone || "-"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Alamat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fullAddress || "-"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailGuru;
