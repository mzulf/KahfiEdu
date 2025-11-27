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
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
    { nama: "John Lenon", hp: "6281234567", email: "johnlennon@gmail.com" },
  ];

  const filtered = guruList.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase())
  );

  const avatarImage = "/mnt/data/f8e0de36-954e-494e-878b-71b5926152f3.png";

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
      {/* TITLE */}
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, fontSize: "1.8rem" }}
      >
        Data Guru
      </Typography>

      {/* SEARCH BAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <TextField
          placeholder="Cari Nama Guru"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 350,
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
              backgroundColor: "white",
              border: "1px solid #C7C7C7",
              height: 45,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#555" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1.5px solid #C7C7C7",
        }}
      >
        <Table>
          <TableHead>
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
              <TableRow
                key={i}
                sx={{
                  "& td": { borderBottom: "1px solid #D9D9D9" },
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={avatarImage}
                    sx={{ width: 45, height: 45 }}
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
