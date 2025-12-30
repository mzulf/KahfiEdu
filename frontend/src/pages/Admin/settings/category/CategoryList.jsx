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
import useAlert from "../../../../hooks/useAlert";
import { useLoading } from "../../../../hooks/useLoading";
import categoryService from "../../../../services/categoryService";
import { useConfirm } from "../../../../hooks/useConfirm";
import { capitalizeWords } from "../../../../utils/formatedFont";
import { HiPlus } from "react-icons/hi";
import CategoryDrawer from "../../../../components/Admin/category/drawer/CategoryDrawer";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState(null); // null = all, true = aktif, false = nonaktif
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editMode, setEditMode] = useState(false)

    // pagination lokal
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const confirm = useConfirm();

    const fetchCategories = async () => {
        showLoading();
        try {
            const response = await categoryService.getCategories({ search, isActive });

            if (response.success) {
                setCategories(response.categories);
            }
        } catch (error) {
            showAlert(error.message || "Gagal mengambil data kategori", "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [search, isActive]);

    useEffect(() => {
        // reset ke halaman pertama setiap data berubah
        setPage(0);

        const filtered = categories.filter((item) => {
            const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
            const statusMatch = isActive === null || item.isActive === isActive;
            return searchMatch && statusMatch;
        });

        setFilteredCategories(filtered);
    }, [categories, search, isActive]);

    const handleOpenDrawer = (mode, category) => {
        if (mode === "edit" && category) {
            setSelectedCategory(category);
            setEditMode(true);
        } else {
            setSelectedCategory(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedCategory(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleIsActiveChange = (event) => {
        const val = event.target.value;
        setIsActive(val === "all" ? null : val === "active");
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmed = await confirm({
            title: "Konfirmasi Hapus",
            message: "Yakin ingin menghapus kategori ini?",
            confirmText: "Hapus",
            cancelText: "Batal",
            type: "error",
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await categoryService.deleteCategory(categoryId);
                if (response.success) {
                    showAlert("Kategori berhasil dihapus", "success");
                    fetchCategories();
                } else {
                    showAlert(response.message || "Gagal menghapus kategori", "error");
                }
            } catch (error) {
                showAlert(error.message || "Gagal menghapus kategori", "error");
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestoreCategory = async (categoryId) => {
        const confirmed = await confirm({
            title: "Konfirmasi Restore",
            message: "Yakin ingin mengembalikan kategori ini?",
            confirmText: "Restore",
            cancelText: "Batal",
            type: "warning",
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await categoryService.restoreCategory(categoryId);
                if (response.success) {
                    showAlert("Kategori berhasil dikembalikan", "success");
                    fetchCategories();
                } else {
                    showAlert(response.message || "Gagal mengembalikan kategori", "error");
                }
            } catch (error) {
                showAlert(error.message || "Gagal mengembalikan kategori", "error");
            } finally {
                hideLoading();
            }
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Card sx={{ fontFamily: "Poppins" }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Box>
                                <Typography variant="h6">Kategori</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Data kategori pengajaran
                                </Typography>
                            </Box>
                            <Box>

                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: "#008B47", "&:hover": { bgcolor: "#006f3d" } }}
                                    startIcon={<HiPlus />}
                                    onClick={() => handleOpenDrawer("add")}
                                >
                                    Tambah
                                </Button>
                            </Box>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={isActive === null ? "all" : isActive ? "active" : "deleted"}
                                    label="Status"
                                    onChange={handleIsActiveChange}
                                >
                                    <MenuItem value="all">Semua</MenuItem>
                                    <MenuItem value="active">Aktif</MenuItem>
                                    <MenuItem value="deleted">Tidak Aktif</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                size="small"
                                label="Cari"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Kategori</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>
                                            <Typography textAlign="center">
                                                Aksi
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                Tidak ada data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCategories
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((category, index) => (
                                                <TableRow key={category.id}>
                                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell>{capitalizeWords(category.name)}</TableCell>
                                                    <TableCell>
                                                        {category.isActive ? "Aktif" : "Tidak Aktif"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center items-center space-x-4">
                                                            {category.deletedAt ? (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="warning"
                                                                    onClick={() => handleRestoreCategory(category.id)}
                                                                >
                                                                    Restore
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => handleOpenDrawer("edit", category)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                sx={{ ml: 1 }}
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={filteredCategories.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </CardContent>
                </Card>
                <CategoryDrawer
                    open={drawerOpen}
                    onClose={handleCloseDrawer}
                    data={selectedCategory}
                    editMode={editMode}
                    onSuccess={() => {
                        fetchCategories();
                        handleCloseDrawer();
                    }}
                />
            </Grid>
        </Grid>
    );
}
