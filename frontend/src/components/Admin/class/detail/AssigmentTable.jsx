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
import AssigmentDialog from "../dialog/AssigmentDialog";
import AssigmentDrawer from "../drawer/AssigmentDrawer";
import { useLoading } from "../../../../hooks/useLoading";
import assignmentService from "../../../../services/assigmentService";
import { useConfirm } from "../../../../hooks/useConfirm";


export default function AssigmentTable({ assignments = [], showAlert, onSuccess, classId, className }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDialog, setOpenDialog] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const confirm = useConfirm();
    const { showLoading, hideLoading } = useLoading();


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDrawer = (mode, assignment) => {
        if (mode === "edit" && assignment) {
            setSelectedAssignment(assignment);
            console.log(assignment);
            setEditMode(true);
        } else {
            setSelectedAssignment(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedAssignment(null);
    };

    const paginatedAssigments = assignments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleOpenDialog = (assignment) => {
        setSelectedAssignment(assignment);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAssignment(null);
    };

    const handleDelete = async (assignment) => {
        const confirmed = await confirm({
            title: `Hapus Data Tugas`,
            message: !assignment.deletedAt ? `Hapus data Tugas (softDelete) ${assignment.title}` : `Hapus data tugas permanen ${assignment.title}`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await assignmentService.deleteAssignment(assignment.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    onSuccess?.();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete assignment", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestore = async (assignment) => {
        const confirmed = await confirm({
            title: `Pulihkan Data Tugas`,
            message: `Are you sure to restore ${assignment.title}`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await assignmentService.restoreAssignment(assignment.id);
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
                            Daftar Tugas
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
                            onClick={() => handleOpenDrawer("add")}
                        >
                            Tambah Tugas
                        </Button>

                    </Box>

                    <Table stickyHeader aria-label="Assignment Table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Judul</TableCell>
                                <TableCell>Tanggal Buat</TableCell>
                                <TableCell>Batas Pengumpulan</TableCell>
                                <TableCell>Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedAssigments.length > 0 ? (
                                paginatedAssigments.map((row, index) => (
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
                                                    onClick={() => handleOpenDialog(row)}
                                                    component="button"
                                                >
                                                    {row.title}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {row.createdAt ? formatDate(row.createdAt) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {row.dueDate ? formatDate(row.dueDate) : "-"}
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
                                    <TableCell colSpan={4} align="center">
                                        Tidak ada data tugas tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={assignments.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </CardContent>
            </Card>

            {/* Dialog Detail Tugas */}
            <AssigmentDialog
                handleCloseDialog={handleCloseDialog}
                openDialog={openDialog}
                selectedAssignment={selectedAssignment}
            />

            <AssigmentDrawer
                classId={classId}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                showAlert={showAlert}
                editMode={editMode}
                data={selectedAssignment}
                className={className}
                onSuccess={() => {
                    setEditMode(false);
                    setSelectedAssignment(null);
                    onSuccess?.();
                }}
            />
        </>
    );
}
