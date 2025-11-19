import { Box, Button, Card, CardContent, debounce, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useLoading } from "../../../hooks/useLoading";
import useAlert from "../../../hooks/useAlert";
import classService from "../../../services/classService";
import { HiPlus } from "react-icons/hi";
import ClassFilter from "../../../components/Admin/class/ClassFilter";
import ClassTable from "../../../components/Admin/class/ClassTable";
import courseService from "../../../services/courseService";
import userService from "../../../services/userService";
import ClassDrawer from "../../../components/Admin/class/drawer/ClassDrawer";
import { useConfirm } from "../../../hooks/useConfirm";

function ClassList() {
    const [classes, setClasses] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");
    const [courseId, setCourseId] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const [status, setStatus] = useState("all");
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { showAlert } = useAlert();
    const confirm = useConfirm();

    const fetchClasses = async () => {
        showLoading();
        try {
            const res = await classService.getClasses({
                page: page + 1,
                limit: rowsPerPage,
                status,
                search,
                courseId,
                teacherId,
            });
            if (res.success) {
                setClasses(res.classes);
                console.log(res.classes)
                setTotalRows(res.meta?.total || 0);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading()
        }
    }

    const fecthCourses = async () => {
        showLoading();
        try {
            const res = await courseService.getAllCourses();
            if (res.success) {
                setCourses(res.courses);
            }
        } catch (error) {
            console.error(error.message, error);
        } finally {
            hideLoading();
        }
    }
    const fecthTeachers = async () => {
        showLoading();
        try {
            const res = await userService.getUserByRole({
                roleName: "teacher",
            });
            if (res.success) {
                setTeachers(res.users);
            }
        } catch (error) {
            console.error(error.message, error);
        } finally {
            hideLoading();
        }
    }

    useEffect(() => {
        fetchClasses();
        fecthCourses();
        fecthTeachers();
    }, [page, rowsPerPage, status, search, teacherId, courseId]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Add search handler with debounce
    const handleSearch = debounce((value) => {
        setSearch(value);
        setPage(0);
    }, 500);

    // Add status change handler
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(0);
    };


    const handleCourseChange = (event) => {
        setCourseId(event.target.value);
        setPage(0);
    };

    const handleTeacherChange = (event) => {
        setTeacherId(event.target.value);
        setPage(0);
    };

    const handleOpenDrawer = (mode, data) => {
        if (mode === "edit" && data) {
            setSelectedClass(data);
            setEditMode(true);
        } else {
            setSelectedClass(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedClass(null);
    };

    const handleDeleteClass = async (select) => {
        const confirmed = await confirm({
            title: `Hapus Data Pengguna`,
            message: !select.deletedAt ? `Hapus data pengguna (softDelete) ${select.name}` : `Hapus data pengguna permanen ${select.name}`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await classService.deleteClass(select.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    fetchClasses();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete class", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestoreClass = async (select) => {
        const confirmed = await confirm({
            title: `Pulihkan Data Pengguna`,
            message: `Are you sure to restore ${select.name}`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await classService.restoreClass(select.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    fetchClasses();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete class", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                Data Kelas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Export data kelas ke CSV, Excel
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
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
                                Tambah Kelas
                            </Button>
                        </Stack>
                    </Box>

                    <ClassFilter
                        handleSearch={handleSearch}
                        handleStatusChange={handleStatusChange}
                        handleCourseChange={handleCourseChange}
                        handleTeacherChange={handleTeacherChange}
                        status={status}
                        courseId={courseId}
                        teacherId={teacherId}
                        courses={courses}
                        teachers={teachers}
                    />

                    <ClassTable
                        data={classes}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalRows={totalRows}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        handleDeleteClass={handleDeleteClass}
                        handleRestoreClass={handleRestoreClass}
                        handleOpenDrawer={handleOpenDrawer}
                    />
                </CardContent>
            </Card>

            {/* Drawer for Add/Edit Class */}
            <ClassDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                editMode={editMode}
                data={selectedClass}
                courses={courses}
                teachers={teachers}
                onSuccess={() => {
                    handleCloseDrawer();
                    fetchClasses();
                }}
            />
        </>
    )
}

export default ClassList
