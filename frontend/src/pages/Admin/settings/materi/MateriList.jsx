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

const API_BASE =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:5000";

export default function MateriList() {
    const [materi, setMateri] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMateri, setSelectedMateri] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const confirm = useConfirm();

    // ================= FETCH DATA =================
    const fetchMateri = async () => {
        showLoading();
        try {
            const res = await materiService.getMateri({
                search,
                status,
                page: page + 1,
                limit: rowsPerPage,
            });

            if (res.success) {
                setMateri(res.data);
                setTotal(res.pagination.total);
            }
        } catch (err) {
            showAlert(err.message || "Gagal mengambil data materi", "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchMateri();
    }, [search, status, page, rowsPerPage]);

    // ================= DRAWER =================
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

    // ================= SOFT DELETE =================
    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Konfirmasi Hapus",
            message: "Materi akan dihapus (soft delete).",
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
            showAlert(e.message, "error");
        } finally {
            hideLoading();
        }
    };

    // ================= RESTORE =================
    const handleRestore = async (id) => {
        const ok = await confirm({
            title: "Restore Materi",
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
            showAlert(e.message, "error");
        } finally {
            hideLoading();
        }
    };

    // ================= HARD DELETE =================
    const handleHardDelete = async (id) => {
        const ok = await confirm({
            title: "HAPUS PERMANEN",
            message: "Data akan dihapus permanen dari database!",
            confirmText: "Hapus Permanen",
            cancelText: "Batal",
            type: "error",
        });

        if (!ok) return;

        showLoading();
        try {
            const res = await materiService.deleteMateriPermanent(id);
            if (res.success) {
                showAlert("Materi dihapus permanen", "success");
                fetchMateri();
            }
        } catch (e) {
            showAlert(e.message, "error");
        } finally {
            hideLoading();
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
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
                                sx={{ bgcolor: "#008B47" }}
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
                                        <TableCell>Gambar</TableCell>
                                        <TableCell>Judul</TableCell>
                                        <TableCell>Deskripsi</TableCell>
                                        <TableCell>Detail</TableCell>
                                        <TableCell>Status</TableCell>
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

                                                <TableCell>
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={`${API_BASE}${item.imageUrl}`}
                                                            alt="materi"
                                                            width={60}
                                                            height={60}
                                                            style={{ borderRadius: 8, objectFit: "cover" }}
                                                        />
                                                    ) : "-"}
                                                </TableCell>

                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.description}</TableCell>

                                                <TableCell>
                                                    {item.detail
                                                        ? item.detail.slice(0, 50) + "..."
                                                        : "-"}
                                                </TableCell>

                                                <TableCell>{item.statusLabel}</TableCell>

                                                <TableCell align="center">
                                                    {item.deletedAt ? (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                color="warning"
                                                                onClick={() => handleRestore(item.id)}
                                                            >
                                                                Restore
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                sx={{ ml: 1 }}
                                                                onClick={() => handleHardDelete(item.id)}
                                                            >
                                                                Hapus Permanen
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    handleOpenDrawer("edit", item)
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
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
