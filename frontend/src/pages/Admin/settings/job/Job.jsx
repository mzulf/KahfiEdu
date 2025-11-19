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
import jobService from "../../../../services/jobService";
import JobDrawer from "../../../../components/Admin/job/drawer/JobDrawer";
import { useConfirm } from "../../../../hooks/useConfirm";
import { capitalizeWords } from "../../../../utils/formatedFont";
import { HiPlus } from "react-icons/hi";

export default function Job() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const confirm = useConfirm();

    const fetchJobs = async () => {
        showLoading();
        try {
            const response = await jobService.getJobs({
                page: page + 1,
                limit: rowsPerPage,
                status,
                search,
            });

            if (response.success) {
                console.log(response.jobs)
                setJobs(response.jobs);
                setTotalRows(response.total || response.jobs.length);
                console.log("Jobs fetched successfully:", response.jobs);
            }
        } catch (error) {
            showAlert(error.message || "Gagal mengambil data pekerjaan", "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [search, page, rowsPerPage, status]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleOpenDrawer = (mode, job) => {
        if (mode === "edit" && job) {
            setSelectedJob(job);
            setEditMode(true);
        } else {
            setSelectedJob(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedJob(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(0);
    }

    const handleDeleteJob = async (jobId) => {
        const confirmed = await confirm({
            title: "Konfirmasi Hapus",
            message: "Apakah Anda yakin ingin menghapus lowongan ini?",
            confirmText: "Hapus",
            cancelText: "Batal",
            type: "error",
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await jobService.deleteJob(jobId);
                if (response.success) {
                    showAlert("Lowongan berhasil dihapus", "success");
                    fetchJobs();
                } else {
                    showAlert(response.message || "Gagal menghapus lowongan", "error");
                }
            } catch (error) {
                showAlert(error.message || "Gagal menghapus lowongan", "error");
            } finally {
                hideLoading();
            }
        }
    }

    const handleRestoreJob = async (jobId) => {
        const confirmed = await confirm({
            title: "Konfirmasi Restore",
            message: "Apakah Anda yakin ingin mengembalikan lowongan ini?",
            confirmText: "Restore",
            cancelText: "Batal",
            type: "warning",
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await jobService.restoreJob(jobId);
                if (response.success) {
                    showAlert("Lowongan berhasil dikembalikan", "success");
                    fetchJobs();
                } else {
                    showAlert(response.message || "Gagal mengembalikan lowongan", "error");
                }
            } catch (error) {
                showAlert(error.message || "Gagal mengembalikan lowongan", "error");
            } finally {
                hideLoading();
            }
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Card sx={{ fontFamily: "Poppins" }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="h6">Lowongan Pekerjaan</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Data Lowongan Pekerjaan
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
                            <Box mb={2} display={"flex"} alignItems="center" justifyContent="end">
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel id="selected-job-status">Status</InputLabel>
                                    <Select
                                        id="selected-job-status"
                                        labelId="selected-job-status"
                                        value={status}
                                        label="Status"
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="deleted">Deleted</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    size="small"
                                    label="Cari Lowongan"
                                    variant="outlined"
                                    placeholder="Cari lowongan..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    sx={{ width: "250px", marginLeft: "20px" }}
                                />
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Judul</TableCell>
                                            <TableCell>Posisi</TableCell>
                                            <TableCell>Lokasi</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {jobs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    Tidak ada data
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            jobs.map((job, index) => (
                                                <TableRow key={job.id || index}>
                                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell>{capitalizeWords(job.title)}</TableCell>
                                                    <TableCell>{job.position}</TableCell>
                                                    <TableCell>{job.location}</TableCell>
                                                    <TableCell>{capitalizeWords(job.employmentType)}</TableCell>
                                                    <TableCell align="right">
                                                        {job.deletedAt ? (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="warning"
                                                                onClick={() => handleRestoreJob(job.id)}
                                                                sx={{ mr: 1 }}
                                                            >
                                                                Restore
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    handleOpenDrawer("edit", job)
                                                                }}
                                                                sx={{ mr: 1 }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => handleDeleteJob(job.id)}
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

                            <TablePagination
                                component="div"
                                count={totalRows}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <JobDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                data={selectedJob}
                editMode={editMode}
                onSuccess={() => {
                    fetchJobs();
                    handleCloseDrawer();
                }}
            />
        </>
    );
}
