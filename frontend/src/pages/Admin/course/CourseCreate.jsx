import { useEffect, useState } from "react";
import ManageCourse from "../../../components/Admin/course/ManageCourse";
import useAlert from "../../../hooks/useAlert";
import { useLoading } from "../../../hooks/useLoading";
import categoryService from "../../../services/categoryService";


export default function CourseCreate() {
    const [categories, setCategories] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();

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
        fetchCategories();
    }, []);

    return (
        <>
            <ManageCourse
                editMode={false}
                course={null}
                categories={categories}
            />
        </>
    )
}
