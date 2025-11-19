import { Avatar, Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import { capitalizeFirst } from '../../../../utils/formatedFont'
import formatDate from '../../../../utils/formatDate'
import { HiCalendar } from 'react-icons/hi'

export default function BasicInfoClass({ classData }) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={1}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {classData.course.title}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" className="text-kahf-green">
                            Kelas : {classData.name}
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography
                            color={
                                classData.status === "akan datang"
                                    ? "#454545"
                                    : classData.status === "berjalan"
                                        ? "warning.main"
                                        : "success.main"
                            }
                            fontWeight="semibold"
                            fontSize={18}
                        >
                            {capitalizeFirst(classData.status)} : {Math.round((classData.progress / 16) * 100)}%
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={(classData.progress / 16) * 100}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor:
                                    classData.status === "akan datang"
                                        ? "#ddd"
                                        : undefined,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor:
                                        classData.status === "akan datang"
                                            ? "#454545"
                                            : classData.status === "berjalan"
                                                ? "#FFA000" // warna warning
                                                : "#2e7d32", // warna success
                                },
                            }}
                        />
                    </Box>
                    <Typography className='pt-4' variant='h6' fontWeight='bold'>
                        Guru
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ marginLeft: 2 }}>
                        <Avatar src={classData.teacher?.avatar || "/default-avatar.png"} alt={classData.teacher?.name} sx={{ width: 50, height: 50, marginRight: 1 }} />
                        <Box display="flex" flexDirection="column" ml={1}>
                            <Typography variant="body1" fontWeight="semibold">
                                Nama: {classData.teacher?.name || "Pengajar tidak diketahui"}
                            </Typography>
                            <Typography variant="body1" fontWeight="semibold">
                                Email: {classData.teacher?.email || "Email tidak tersedia"}
                            </Typography>
                            <Typography variant="body1" fontWeight="semibold">
                                Phone: {classData.teacher?.phone || "Telepon tidak tersedia"}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginLeft: 2 }}>
                        <Box textAlign="center">
                            <Typography className="pt-4" variant="body1" fontWeight="bold">
                                Tanggal Mulai
                            </Typography>
                            <Typography variant="body2">
                                <Box component="span" display="inline-flex" gap={0.5} alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
                                    <HiCalendar />
                                    <span>{formatDate(classData.startDate)}</span>
                                </Box>
                            </Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography className="pt-4" variant="body1" fontWeight="bold">
                                Tanggal Berakhir
                            </Typography>
                            <Typography variant="body2">
                                <Box component="span" display="inline-flex" gap={0.5} alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
                                    <HiCalendar />
                                    <span>{formatDate(classData.endDate)}</span>
                                </Box>
                            </Typography>
                        </Box>
                    </Box>

                </Stack>
            </CardContent>
        </Card>
    )
}
