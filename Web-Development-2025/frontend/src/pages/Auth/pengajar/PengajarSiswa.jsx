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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function PengajarSiswa() {
  const [search, setSearch] = useState("");

  const guruList = [
    {
      nama: "Ustadz Ahmad Fauzi",
      gender: "male",
      hp: "628123456111",
      email: "ahmadfauzi@kahfi.edu",
      fotoId: 12,
    },
    {
      nama: "Ustadz Yusuf Ramadhan",
      gender: "male",
      hp: "628123456222",
      email: "yusuframadhan@kahfi.edu",
      fotoId: 32,
    },
    {
      nama: "Ustadzah Siti Maryam",
      gender: "female",
      hp: "628123456333",
      email: "sitimaryam@kahfi.edu",
      fotoId: 15,
    },
    {
      nama: "Ustadzah Aisyah Rahma",
      gender: "female",
      hp: "628123456444",
      email: "aisyahrahma@kahfi.edu",
      fotoId: 28,
    },
    {
      nama: "Ustadz Ridwan Hakim",
      gender: "male",
      hp: "628123456555",
      email: "ridwanhakim@kahfi.edu",
      fotoId: 45,
    },
    {
      nama: "Ustadzah Nur Halimah",
      gender: "female",
      hp: "628123456666",
      email: "nurhalimah@kahfi.edu",
      fotoId: 48,
    },
  ];

  const filtered = guruList.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase())
  );

  // Foto realistik untuk guru
  const getAvatar = (gender, id) => {
    return gender === "male"
      ? `https://randomuser.me/api/portraits/men/${id}.jpg`
      : `https://randomuser.me/api/portraits/women/${id}.jpg`;
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

      {/* Tabel Guru */}
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
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={getAvatar(guru.gender, guru.fotoId)}
                    sx={{ width: 50, height: 50, borderRadius: "50%" }}
                  />
                </TableCell>
                <TableCell>{guru.nama}</TableCell>
                <TableCell>{guru.hp}</TableCell>
                <TableCell>{guru.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
