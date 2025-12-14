import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";

import useAlert from "../../../../hooks/useAlert";
import { useLoading } from "../../../../hooks/useLoading";
import { useConfirm } from "../../../../hooks/useConfirm";

import materiService from "../../../../services/materiService";
import MateriDrawer from "../../../../components/Admin/materi/drawer/MateriDrawer";

export default function MateriList() {
    const [materi, setMateri] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    // server-side pagination
    const [page, setPage] = useState(0); // MUI = 0 based
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMateri, setSelectedMateri] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const confirm = useConfirm();

    const fetchMateri = async () => {
        showLoading();
        try {
            const response = await materiService.getMateri({
                search,
                status,
                page: page + 1, // API = 1 based
                limit: rowsPerPage,
            });

            if (response.success) {
                setMateri(response.data); // ✅ SUDAH MateriClass
                setTotal(response.pagination.total);
            }
        } catch (error) {
            showAlert(error.message || "Gagal mengambil data materi", "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchMateri();
    }, [search, status, page, rowsPerPage]);

    const handleOpenDrawer = (mode, data = null) => {
        setEditMode(mode === "edit");
        setSelectedMateri(data);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedMateri(null);
        setEditMode(false);
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Konfirmasi Hapus",
            message: "Yakin ingin menghapus materi ini?",
            confirmText: "Hapus",
            cancelText: "Batal",
            type: "error",
        });

        if (!ok) return;

        showLoading();
        try {
            const res = await materiService.deleteMateri(id);
            if (res.success) {
                showAlert("Materi berhasil dihapus", "success");
                fetchMateri();
            }
        } catch (e) {
            showAlert(e.message || "Gagal menghapus materi", "error");
        } finally {
            hideLoading();
        }
    };

    const handleRestore = async (id) => {
        const ok = await confirm({
            title: "Konfirmasi Restore",
            message: "Kembalikan materi ini?",
            confirmText: "Restore",
            cancelText: "Batal",
            type: "warning",
        });

        if (!ok) return;

        showLoading();
        try {
            const res = await materiService.restoreMateri(id);
            if (res.success) {
                showAlert("Materi berhasil direstore", "success");
                fetchMateri();
            }
        } catch (e) {
            showAlert(e.message || "Gagal restore materi", "error");
        } finally {
            hideLoading();
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
                                <Typography variant="h6">Materi</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Master data materi pembelajaran
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<HiPlus />}
                                sx={{ bgcolor: "#008B47", "&:hover": { bgcolor: "#006f3d" } }}
                                onClick={() => handleOpenDrawer("add")}
                            >
                                Tambah
                            </Button>
                        </Box>

                        {/* FILTER */}
                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <MenuItem value="all">Semua</MenuItem>
                                    <MenuItem value="active">Aktif</MenuItem>
                                    <MenuItem value="deleted">Terhapus</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                size="small"
                                label="Cari Materi"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                            />
                        </Box>

                        {/* TABLE */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Judul</TableCell>
                                        <TableCell>Deskripsi</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Updated</TableCell>
                                        <TableCell align="center">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {materi.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Tidak ada data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        materi.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {page * rowsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.statusLabel}</TableCell>
                                                <TableCell>
                                                    {item.createdAt?.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {item.updatedAt?.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.deletedAt ? (
                                                        <Button
                                                            size="small"
                                                            color="warning"
                                                            variant="outlined"
                                                            onClick={() => handleRestore(item.id)}
                                                        >
                                                            Restore
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    handleOpenDrawer("edit", item)
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                                sx={{ ml: 1 }}
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={(e, p) => setPage(p)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </CardContent>
                </Card>

                <MateriDrawer
                    open={drawerOpen}
                    onClose={handleCloseDrawer}
                    data={selectedMateri}
                    editMode={editMode}
                    onSuccess={() => {
                        fetchMateri();
                        handleCloseDrawer();
                    }}
                />
            </Grid>
        </Grid>
    );
}
