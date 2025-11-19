import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Box
} from "@mui/material";
import { useState } from "react";
import formatDate from "../../../../utils/formatDate";
import { HiPencil, HiPlus, HiReply, HiTrash } from "react-icons/hi";
import { useLoading } from "../../../../hooks/useLoading";
import lessonService from "../../../../services/lessonService";
import { useConfirm } from "../../../../hooks/useConfirm";


export default function LessonTable({ lessons = [], showAlert, onSuccess, classId, className }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const confirm = useConfirm();
    const { showLoading, hideLoading } = useLoading();


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const paginatedLessons = lessons.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );



    const handleDelete = async (lesson) => {
        const confirmed = await confirm({
            title: `Hapus Data Tugas`,
            message: !lesson.deletedAt ? `Hapus data Tugas (softDelete) ${lesson.title}` : `Hapus data tugas permanen ${lesson.title}`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await lessonService.deleteLesson(lesson.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    onSuccess?.();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete lesson", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestore = async (lesson) => {
        const confirmed = await confirm({
            title: `Pulihkan Data Tugas`,
            message: `Are you sure to restore ${lesson.title}`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await lessonService.restoreLesson(lesson.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    onSuccess?.();
                }
            } catch (error) {
                showAlert(error.message || "Failed to restore user", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    return (
        <>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Daftar Materi
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<HiPlus />}
                            sx={{
                                bgcolor: '#1B986E',
                                '&:hover': {
                                    bgcolor: '#157A58'
                                }
                            }}
                            onClick={() => { console.log("tambah") }}
                        >
                            Tambah Materi
                        </Button>

                    </Box>

                    <Table stickyHeader aria-label="Lesson Table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Judul Materi</TableCell>
                                <TableCell>Code Kelas</TableCell>
                                <TableCell>File Url</TableCell>
                                <TableCell>Urutan</TableCell>
                                <TableCell>Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedLessons.length > 0 ? (
                                paginatedLessons.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Lihat detail">
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "primary.main",
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            color: "success.main",
                                                            textDecoration: "underline",
                                                        }
                                                    }}
                                                    onClick={() => { console.log("Detail") }}
                                                    component="button"
                                                >
                                                    {row.title}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {row.code}
                                        </TableCell>
                                        <TableCell>
                                            {row.videoUrl ? (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "primary.main",
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            color: "success.main",
                                                            textDecoration: "underline",
                                                        }
                                                    }}
                                                    component="a"
                                                    href={row.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {row.videoUrl}
                                                </Typography>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {row.order}
                                        </TableCell>
                                        <TableCell>
                                            {!row.deletedAt ? (
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" color="primary" onClick={() => handleOpenDrawer("edit", row)}>
                                                        <HiPencil size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Restore" onClick={() => { handleRestore(row) }}>
                                                    <IconButton size="small" color="warning">
                                                        <HiReply size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Hapus">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => { handleDelete(row) }}
                                                >
                                                    <HiTrash size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Tidak ada data tugas tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={lessons.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </CardContent>
            </Card>

        </>
    );
}
