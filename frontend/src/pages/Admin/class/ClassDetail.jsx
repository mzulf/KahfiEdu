import { useNavigate, useSearchParams } from "react-router-dom"
import useAlert from '../../../hooks/useAlert';
import { useLoading } from '../../../hooks/useLoading';
import { useState } from 'react';
import classService from '../../../services/classService';
import { useEffect } from 'react';
import BasicInfoClass from '../../../components/Admin/class/detail/BasicInfoClass';
import AksiCard from '../../../components/Admin/class/detail/AksiCard';
import EnrollmentTable from '../../../components/Admin/class/detail/EnrollmentTable';
import { Grid, Typography } from "@mui/material";
import AssigmentTable from "../../../components/Admin/class/detail/AssigmentTable";
import LessonTable from "../../../components/Admin/class/detail/LessonTable";


export default function ClassDetail() {
    const [classData, setClassData] = useState(null);
    const [searchParams] = useSearchParams();
    const [enrollments, setEnrollments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [lessons, setLessons] = useState([]);
    const classId = searchParams.get('classId')
    const navigate = useNavigate()
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    const fetchClass = async () => {
        if (!classId) {
            showAlert("Id Class tidak ditemukan", "error")
            return;
        };
        showLoading();
        try {
            const res = await classService.getClassById(classId);
            if (res.success) {
                setClassData(res.class);
                setEnrollments(res.class.class_enrollments);
                setAssignments(res.class.assignments);
                setLessons(res.class.lessons);
                console.log(res.class);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    }

    useEffect(() => {
        fetchClass();
    }, [classId]);

    if (!classData) {
        return (
            <>
                <Typography variant="body1" fontWeight="semibold" textAlign="center">
                    Data kelas tidak ditemukan
                </Typography>
            </>
        )
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <BasicInfoClass classData={classData} />
                    <AksiCard classData={classData} navigate={navigate} showAlert={showAlert} />
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <EnrollmentTable enrollments={enrollments} navigate={navigate} />
                    <LessonTable
                        classId={classData.id}
                        className={classData.name}
                        lessons={lessons}
                        showAlert={showAlert}
                        onSuccess={() => {
                            fetchClass();
                        }}
                    />
                    <AssigmentTable
                        classId={classData.id}
                        className={classData.name}
                        assignments={assignments}
                        showAlert={showAlert}
                        onSuccess={() => {
                            fetchClass();
                        }}
                    />

                </Grid>
            </Grid>
        </>
    )
}