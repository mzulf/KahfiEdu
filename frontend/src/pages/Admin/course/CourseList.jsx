import {
    Grid,
    Stack,
    Typography,
    Button,
    Pagination
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLoading } from "../../../hooks/useLoading";
import useAlert from "../../../hooks/useAlert";
import courseService from "../../../services/courseService";
import FilterCourse from "../../../components/Admin/course/FIlterCourse";
import CardCourse from "../../../components/Admin/course/CardCourse";
import categoryService from "../../../services/categoryService";
import { useNavigate } from "react-router-dom";

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isFeatured, setIsFeatured] = useState(null);
    const [isPublish, setIsPublish] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const navigate = useNavigate()

    const fetchCourses = async () => {
        showLoading();
        try {
            const res = await courseService.getCourses({
                page: page + 1,
                limit: rowsPerPage,
                status,
                search,
                categoryId: selectedCategoryId,
                isFeatured,
                isPublish,
            });
            if (res.success) {
                setCourses(res.courses);
                setTotalRows(res.meta?.total || 0);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    };
    const fetchCategories = async () => {
        showLoading();
        try {
            const res = await categoryService.getCategories({
                isActive: true
            });
            if (res.success) {
                setCategories(res.categories);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [page, rowsPerPage, status, search, selectedCategoryId, isFeatured, isPublish]);

    const handleResetFilter = () => {
        setSearch("");
        setStatus("all");
        setIsFeatured(null);
        setIsPublish(null);
        setSelectedCategoryId("");
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event);
        setPage(0); // Reset to first page when rowsPerPage is changed
    };



    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1); // karena state page kamu 0-based
    };

    const navigateToCreate = () => {
        navigate("/admin/course/create")
        window.scrollTo(0, 0)
    }

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
                <Stack spacing={1}>
                    <FilterCourse
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        isFeatured={isFeatured}
                        setIsFeatured={setIsFeatured}
                        isPublish={isPublish}
                        setIsPublish={setIsPublish}
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                        categories={categories}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={handleRowsPerPageChange}
                        handleResetFilter={handleResetFilter}
                    />
                    <Button fullWidth variant="contained" onClick={() => navigateToCreate()}>
                        Tambah
                    </Button>
                </Stack>
            </Grid>

            {/* Course List */}
            <Grid size={{ xs: 12, md: 9 }}>
                <Grid container spacing={2}>
                    {courses.length === 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Typography textAlign="center" variant="h6">
                                Data course tidak ditemukan
                            </Typography>
                        </Grid>
                    )}
                    {courses.map((course, index) => (
                        <Grid key={index} size={{ xs: 6, md: 4 }}>
                            <CardCourse
                                course={course}
                                refreshData={
                                    () => {
                                        fetchCourses();
                                    }
                                }
                            />
                        </Grid>
                    ))}

                </Grid>
            </Grid>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="end">
                <Stack spacing={2} >
                    <Pagination
                        shape="rounded"
                        count={totalPages}
                        page={page + 1} // konversi ke 1-based untuk MUI
                        onChange={handlePageChange}
                        color="primary"
                        siblingCount={0}
                        boundaryCount={2}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

export default CourseList;
