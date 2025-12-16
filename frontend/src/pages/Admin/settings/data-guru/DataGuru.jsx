import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { HiPlus } from "react-icons/hi";
import FieldDataGuru from "./field-dataguru";
import axios from "axios";

// Base URL API
const API_URL = "http://localhost:5000/api/v1/guru";

// API Key
const API_KEY = "ueRs7TFkywICK0yI0koUuoVu1OynOmZ";

export default function GuruList() {
  const [dataGuru, setDataGuru] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);

  /* =======================
     FETCH DATA GURU
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
     DRAWER HANDLER
  ======================= */
  const handleOpenDrawer = (mode, guru = null) => {
    setEditMode(mode === "edit");
    setSelectedGuru(guru);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedGuru(null);
  };

  /* =======================
     SAVE GURU (CREATE/UPDATE)
  ======================= */
  const handleSaveGuru = async (formData) => {
    try {
      if (editMode) {
        // UPDATE
        const response = await axios.put(
          `${API_URL}/${formData.id}`,
          {
            nama: formData.nama,
            nomorTelepon: formData.nomorTelepon,
            email: formData.email,
            foto: formData.foto,
          },
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );

        if (response.data.success) {
          alert("Data guru berhasil diupdate!");
          handleCloseDrawer();
          fetchDataGuru();
        }
      } else {
        // CREATE
        const response = await axios.post(
          API_URL,
          {
            nama: formData.nama,
            nomorTelepon: formData.nomorTelepon,
            email: formData.email,
            foto: formData.foto,
          },
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );

        if (response.data.success) {
          alert("Guru berhasil ditambahkan!");
          handleCloseDrawer();
          fetchDataGuru();
        }
      }
    } catch (err) {
      console.error("Error saving guru:", err);
      alert(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  /* =======================
     DELETE GURU
  ======================= */
  const handleDeleteGuru = async (id) => {
    if (!window.confirm("Yakin ingin menghapus guru ini?")) return;

    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (response.data.success) {
        alert("Guru berhasil dihapus!");
        fetchDataGuru();
      }
    } catch (err) {
      console.error("Error deleting guru:", err);
      alert(err.response?.data?.message || "Gagal menghapus data");
    }
  };

  return (
    // ✅ Hilangkan Grid container dan langsung gunakan Box untuk full width
    <Box sx={{ width: '100%', px: 0 }}>
      <Card sx={{ fontFamily: "Poppins", width: '100%' }}>
        <CardContent sx={{ padding: 3, '&:last-child': { pb: 3 } }}>
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h5" fontWeight={600}>Data Guru</Typography>
                <Typography variant="body2" color="text.secondary">
                  Daftar data pengajar
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{ bgcolor: "#008B47", "&:hover": { bgcolor: "#006f3d" } }}
                startIcon={<HiPlus />}
                onClick={() => handleOpenDrawer("add")}
              >
                Tambah
              </Button>
            </Box>

            {/* ERROR ALERT */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* SEARCH */}
            <Box display="flex" justifyContent="flex-end" mb={3}>
              <TextField
                size="small"
                label="Cari Nama Guru"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                sx={{ minWidth: 300 }}
              />
            </Box>

            {/* LOADING */}
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* TABLE - ✅ Tambah sx untuk lebar penuh */}
                <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 1000, width: '100%', tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600, width: '60px' }}>No</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '100px' }}>Foto</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 'auto' }}>Nama</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 'auto' }}>Nomor Telepon</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 'auto' }}>Email</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, width: '200px' }}>Aksi</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {dataGuru.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            Tidak ada data
                          </TableCell>
                        </TableRow>
                      ) : (
                        dataGuru.map((guru, index) => (
                          <TableRow 
                            key={guru.id}
                            sx={{ '&:hover': { bgcolor: '#fafafa' } }}
                          >
                            <TableCell>
                              {page * rowsPerPage + index + 1}
                            </TableCell>

                            <TableCell>
                              <Avatar
                                src={guru.foto || undefined}
                                alt={guru.nama}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  bgcolor: "#008B47",
                                }}
                              >
                                {!guru.foto &&
                                  guru.nama?.charAt(0).toUpperCase()}
                              </Avatar>
                            </TableCell>

                            <TableCell sx={{ fontWeight: 600 }}>
                              {guru.nama}
                            </TableCell>
                            <TableCell>{guru.nomorTelepon}</TableCell>
                            <TableCell>{guru.email}</TableCell>

                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1 }}
                                onClick={() =>
                                  handleOpenDrawer("edit", {
                                    id: guru.id,
                                    nama: guru.nama,
                                    nomorTelepon: guru.nomorTelepon,
                                    email: guru.email,
                                    foto: guru.foto,
                                  })
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteGuru(guru.id)}
                              >
                                Hapus
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* PAGINATION */}
                <TablePagination
                  component="div"
                  count={totalData}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Baris per halaman:"
                />
              </>
            )}
          </CardContent>
      </Card>

      {/* DRAWER */}
      <FieldDataGuru
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        data={selectedGuru}
        onSave={handleSaveGuru}
      />
    </Box>
  );
}