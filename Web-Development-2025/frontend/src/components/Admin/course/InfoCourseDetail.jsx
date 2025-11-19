import { Box, Card, CardContent, Typography } from "@mui/material";

export default function InfoCourseDetail({ course }) {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{course.title}</Typography>
                    <Box gap={1}>
                        <Box
                            px={2}
                            py={0.5}
                            borderRadius="16px"
                            boxShadow={2}
                            sx={{
                                backgroundColor: course.isPublish ? '#0288d1' : '#b0bec5',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body2">
                                {course.publish}
                            </Typography>
                        </Box>
                        <Box
                            ml={1}
                            px={2}
                            py={0.5}
                            borderRadius="16px"
                            boxShadow={2}
                            sx={{
                                backgroundColor: course.isFeatured ? '#fbc02d' : '#b0bec5',
                                color: course.isFeatured ? '#000' : '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body2">
                                {course.feature}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography className="text-2xl font-poppins" mb={1}>{course.description}</Typography>
            </CardContent>
        </Card>
    )
}
