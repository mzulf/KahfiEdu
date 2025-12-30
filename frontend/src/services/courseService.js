import axiosInstance from "../libs/axiosInstance";
import Course from "../utils/classes/CourseClass";

const courseService = {
    createCourse: async (data, thumbnailFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            const response = await axiosInstance.post(`/course`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    getCourses: async ({ page, limit, search, status, categoryId, isFeatured, isPublish }) => {
        try {
            const response = await axiosInstance.get(`/courses`,
                {
                    params: {
                        page,
                        limit,
                        status,
                        search,
                        categoryId,
                        isFeatured,
                        isPublish
                    }
                }
            );
            return {
                ...response.data,
                courses: response.data.courses.map(c => new Course(c))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch courses');
        }
    },
    getAllCourses: async () => {
        try {
            const response = await axiosInstance.get(`/all/course`);
            return {
                ...response.data,
                courses: response.data.courses.map(c => new Course(c))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch courses');
        }
    },
    getCourseById: async (courseId) => {
        try {
            const response = await axiosInstance.get(`/course/${courseId}`);
            return {
                ...response.data,
                course: new Course(response.data.course)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch courses');
        }
    },
    updateCourse: async (id, data, thumbnailFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            const response = await axiosInstance.put(`/course/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deleteCourse: async (courseId) => {
        try {
            const response = await axiosInstance.delete(`/course/${courseId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete course');
        }
    },
    restoreCourse: async (id) => {
        try {
            const response = await axiosInstance.post(`/course/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore course');
        }
    },
}

export default courseService