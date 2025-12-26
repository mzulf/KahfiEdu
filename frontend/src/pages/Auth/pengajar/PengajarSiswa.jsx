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
  CircularProgress,
  Alert,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/guru";
const API_KEY = "ueRs7TFkywICK0yI0koUuoVu1OynOmZ";

export default function PengajarSiswa() {
  const [search, setSearch] = useState("");
  const [dataGuru, setDataGuru] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);

  const fetchDataGuru = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL, {
        params: { page: page + 1, limit: rowsPerPage, search },
        headers: { "x-api-key": API_KEY },
      });

      if (res.data?.success) {
        setDataGuru(res.data.data || []);
        setTotalData(res.data.total || 0);
      }
    } catch {
      setError("Gagal mengambil data guru");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchDataGuru();
  }, [fetchDataGuru]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchDataGuru();
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <Box sx={{ position: "relative" }}>
      {/* ================= BG GRADIENT ATAS ================= */}
      <Box
        sx={{
          height: { xs: 120, md: 170 }, 
          background: "linear-gradient(135deg, #047857, #34D399)",
          borderRadius: "0 0 48px 48px",
        }}
      />

      {/* ================= CONTENT ================= */}
      <Container maxWidth="lg" sx={{ mt: -12, mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            boxShadow: "0 20px 50px rgba(0,0,0,.2)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={4}>
            Data Guru
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* SEARCH */}
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <TextField
              placeholder="Cari Nama Guru"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 320 }}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: "#ECFDF5",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* TABLE */}
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #D1FAE5",
                  boxShadow: "none",
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "#ECFDF5" }}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Foto</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>No HP</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {dataGuru.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Tidak ada data guru
                        </TableCell>
                      </TableRow>
                    ) : (
                      dataGuru.map((guru, i) => (
                        <TableRow key={guru.id}>
                          <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                          <TableCell>
                            <Avatar src={guru.foto} />
                          </TableCell>
                          <TableCell>{guru.nama}</TableCell>
                          <TableCell>{guru.nomorTelepon}</TableCell>
                          <TableCell>{guru.email}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* PAGINATION */}
              <Box display="flex" justifyContent="center" mt={3}>
                <TablePagination
                  component="div"
                  count={totalData}
                  page={page}
                  onPageChange={(e, p) => setPage(p)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) =>
                    setRowsPerPage(parseInt(e.target.value, 10))
                  }
                />
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
