import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "../../../libs/axiosInstance"; // Pastikan path ini sesuai struktur project-mu
import { toast } from "react-toastify";

export default function PengajarSiswa() {
  const [search, setSearch] = useState("");
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data guru dari backend
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const res = await axios.get("/users/role?roleName=teacher");
        setGuruList(res.data.users);
      } catch (err) {
        toast.error("Gagal memuat data guru");
      } finally {
        setLoading(false);
      }
    };

    fetchGuru();
  }, []);

  const filtered = guruList.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const getAvatar = (gender, id) => {
    return gender === "male"
      ? `https://randomuser.me/api/portraits/men/${id % 100}.jpg`
      : `https://randomuser.me/api/portraits/women/${id % 100}.jpg`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 4, fontSize: "1.8rem" }}
      >
        Data Guru
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <TextField
          placeholder="Cari Nama Guru"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 320 }}
          InputProps={{
            sx: { borderRadius: 3, backgroundColor: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 4, overflow: "hidden", border: "2px solid #C7C7C7" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#F6F6F6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nomor Hp</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((guru, i) => (
                <TableRow key={guru.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={guru.avatar || getAvatar(guru.gender, guru.id)}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{guru.name}</TableCell>
                  <TableCell>{guru.phone || "-"}</TableCell>
                  <TableCell>{guru.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
