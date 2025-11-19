import { useEffect, useState } from "react";
import { useLoading } from "../../../hooks/useLoading";
import categoryService from "../../../services/categoryService";
import { useSearchParams } from "react-router-dom";
import courseService from "../../../services/courseService";
import useAlert from "../../../hooks/useAlert";
import { Box, Typography } from "@mui/material";
import ManageCourse from "../../../components/Admin/course/ManageCourse";

function CourseEdit() {
    const [categories, setCategories] = useState([]);
    const [course, setCourse] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams()
    const courseId = searchParams.get('courseId')

    const fetchCourse = async () => {
        if (!courseId) {
            showAlert("Id Course tidak ditemukan", "error")
            return;
        };
        showLoading();
        try {
            const res = await courseService.getCourseById(courseId);
            if (res.success) {
                setCourse(res.course);
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
        fetchCourse()
        fetchCategories();
    }, []);

    if (!course) {
        return (
            <Box>
                <Typography textAlign="center">Course tidak ditemukan</Typography>
            </Box>
        )
    }

    return (
        <>
            <ManageCourse
                editMode={true}
                course={course}
                categories={categories}
            />
        </>
    )
}

export default CourseEdit
