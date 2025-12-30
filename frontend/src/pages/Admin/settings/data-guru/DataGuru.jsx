import {
  Box,
  Button,
  Card,
  CardContent,
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
import axiosInstance from "../../../../libs/axiosInstance";


export default function DataGuru() {
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

  /* ================= FETCH ================= */
  const fetchDataGuru = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/guru", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
        },
      });

      if (res.data?.success) {
        setDataGuru(res.data.data || []);
        setTotalData(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal ambil data guru");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchDataGuru();
  }, [fetchDataGuru]);

  /* ================= SAVE ================= */
  const handleSaveGuru = async (form) => {
    try {
      if (editMode) {
        await axiosInstance.put(`/guru/${form.id}`, form);
        alert("Data guru berhasil diupdate");
      } else {
        await axiosInstance.post("/guru", form);
        alert("Guru berhasil ditambahkan");
      }
      setDrawerOpen(false);
      fetchDataGuru();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteGuru = async (id) => {
    if (!confirm("Yakin hapus guru ini?")) return;
    try {
      await axiosInstance.delete(`/guru/${id}`);
      alert("Guru berhasil dihapus");
      fetchDataGuru();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus data");
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h5">Data Guru</Typography>
            <Button
              variant="contained"
              startIcon={<HiPlus />}
              onClick={() => {
                setEditMode(false);
                setSelectedGuru(null);
                setDrawerOpen(true);
              }}
            >
              Tambah
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            size="small"
            label="Cari guru"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ mb: 2 }}
          />

          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>Telepon</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataGuru.map((guru, i) => (
                    <TableRow key={guru.id}>
                      <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                      <TableCell>{guru.nama}</TableCell>
                      <TableCell>{guru.nomorTelepon}</TableCell>
                      <TableCell>{guru.email}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditMode(true);
                            setSelectedGuru(guru);
                            setDrawerOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteGuru(guru.id)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <FieldDataGuru
        open={drawerOpen}
        editMode={editMode}
        data={selectedGuru}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveGuru}
      />
    </Box>
  );
}
