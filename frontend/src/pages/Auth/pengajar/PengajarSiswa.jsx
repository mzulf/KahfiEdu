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

// Base URL API
const API_URL = "http://localhost:5000/api/v1/guru";

// API Key
const API_KEY = "ueRs7TFkywICK0yI0koUuoVu1OynOmZ";

export default function PengajarSiswa() {
  const [search, setSearch] = useState("");
  const [dataGuru, setDataGuru] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);

  /* =======================
     FETCH DATA GURU FROM API
  ======================= */
  const fetchDataGuru = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: search,
        },
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (response.data?.success) {
        setDataGuru(response.data.data || []);
        setTotalData(response.data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Gagal mengambil data guru");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  /* =======================
     EFFECT: FETCH ON MOUNT & CHANGE
  ======================= */
  useEffect(() => {
    fetchDataGuru();
  }, [fetchDataGuru]);

  /* =======================
     HANDLE SEARCH WITH DEBOUNCE
  ======================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset ke halaman pertama saat search
      fetchDataGuru();
    }, 500); // Delay 500ms untuk debounce

    return () => clearTimeout(timer);
  }, [search]);

  /* =======================
     HANDLE PAGINATION
  ======================= */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 4, fontSize: "1.8rem" }}
      >
        Data Guru
      </Typography>

      {/* ERROR ALERT */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

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

      {/* LOADING STATE */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tabel Guru */}
          <TableContainer
            component={Paper}
            sx={{ 
              borderRadius: 4, 
              overflow: "hidden", 
              border: "2px solid #C7C7C7",
              mb: 2 
            }}
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
                {dataGuru.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Tidak ada data guru
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  dataGuru.map((guru, i) => (
                    <TableRow 
                      key={guru.id}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                      <TableCell>
                        <Avatar
                          src={guru.foto || undefined}
                          alt={guru.nama}
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            bgcolor: "#008B47" 
                          }}
                        >
                          {!guru.foto && guru.nama?.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {guru.nama}
                      </TableCell>
                      <TableCell>{guru.nomorTelepon}</TableCell>
                      <TableCell>{guru.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}
          {dataGuru.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                component="div"
                count={totalData}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Baris per halaman:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} dari ${count}`
                }
                sx={{
                  '.MuiTablePagination-toolbar': {
                    justifyContent: 'center',
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}