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
} from "@mui/material";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import FieldDataGuru from "./field-dataguru";

/* =======================
   DATA DUMMY GURU
======================= */
const guruDataDummy = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    phone: "081234567890",
    email: "ahmad@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Siti Aisyah",
    phone: "082345678901",
    email: "aisyah@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 3,
    name: "Muhammad Rizki",
    phone: "083456789012",
    email: "rizki@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export default function GuruList() {
  const [dataGuru, setDataGuru] = useState(guruDataDummy);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);

  /* =======================
     FILTER SEARCH
  ======================= */
  const filteredData = dataGuru.filter((guru) =>
    guru.name.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleSaveGuru = (newData) => {
    if (editMode) {
      setDataGuru((prev) =>
        prev.map((g) => (g.id === newData.id ? newData : g))
      );
    } else {
      setDataGuru((prev) => [...prev, newData]);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ fontFamily: "Poppins" }}>
          <CardContent>
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="h6">Data Guru</Typography>
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

            {/* SEARCH */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <TextField
                size="small"
                label="Cari Nama Guru"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            {/* TABLE */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Foto</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>Nomor Telepon</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((guru, index) => (
                        <TableRow key={guru.id}>
                          <TableCell>
                            {page * rowsPerPage + index + 1}
                          </TableCell>

                          <TableCell>
                            <Avatar
                              src={guru.avatar}
                              alt={guru.name}
                              sx={{ width: 42, height: 42 }}
                            />
                          </TableCell>

                          <TableCell sx={{ fontWeight: 600 }}>
                            {guru.name}
                          </TableCell>
                          <TableCell>{guru.phone}</TableCell>
                          <TableCell>{guru.email}</TableCell>

                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                              onClick={() =>
                                handleOpenDrawer("edit", guru)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
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
              count={filteredData.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
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
      </Grid>
    </Grid>
  );
}
