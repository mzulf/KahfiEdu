import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import FileDownload from '@mui/icons-material/FileDownload';
import FileUpload from '@mui/icons-material/FileUpload';

export default function ClassFilter({
    status,
    handleStatusChange,
    handleSearch,
    courseId,
    teacherId,
    handleCourseChange,
    handleTeacherChange,
    courses = [],
    teachers = [],
}) {
    return (
        <>
            <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
                <Box display="flex" justifyContent="start" alignItems="center" gap={1}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownload />}
                        sx={{
                            bgcolor: '#1B986E',
                            '&:hover': {
                                bgcolor: '#157A58'
                            }
                        }}
                        onClick={() => setExportDialogOpen(true)}
                    >
                        Export
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FileUpload />}
                        sx={{
                            bgcolor: '#1B986E',
                            '&:hover': {
                                bgcolor: '#157A58'
                            }
                        }}
                        onClick={() => setImportDialogOpen(true)}
                    >
                        Import
                    </Button>
                </Box>
                <Box display="flex" justifyContent="end" alignItems="center" gap={1}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="selected-course">Course</InputLabel>
                        <Select
                            labelId="selected-course"
                            value={courseId || ""}
                            label="Course"
                            onChange={handleCourseChange}
                        >
                            <MenuItem value="">All Courses</MenuItem>
                            {courses.map(course => (
                                <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="selected-teacher">Teacher</InputLabel>
                        <Select
                            labelId="selected-teacher"
                            value={teacherId || ""}
                            label="Teacher"
                            onChange={handleTeacherChange}
                        >
                            <MenuItem value="">All Teachers</MenuItem>
                            {teachers.map(teacher => (
                                <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="selected-class-status">Status</InputLabel>
                        <Select
                            id="selected-class-status"
                            labelId="selected-class-status"
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="all">All Classes</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="deleted">Deleted</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        placeholder="Search by class name"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Box>

            </Stack>
        </>
    )
}
