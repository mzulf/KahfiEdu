import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

const roleColors = {
    student: {
        bg: '#007AFF',
        color: '#fff',
    },
    parent: {
        bg: '#1B986E',
        color: '#fff',
    },
    teacher: {
        bg: '#F2994A',
        color: '#fff',
    },
    default: {
        bg: '#E0E0E0',
        color: '#323232',
    },
};

const UserCount = ({ countByRole, totalUsers }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Total Pengguna
                </Typography>

                <Stack spacing={1}>
                    {[...countByRole]
                        .sort((a, b) => a.roleName.localeCompare(b.roleName))
                        .map(({ roleName, total, active, inactive }) => {
                            const { bg, color } = roleColors[roleName] || roleColors.default;

                            return (
                                <Card key={roleName} sx={{ backgroundColor: bg, color }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography fontWeight="bold" textTransform="capitalize">
                                                {roleName.replace('_', ' ')}
                                            </Typography>
                                            <Typography fontWeight="bold">{total} Total</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" px={1}>
                                            <Typography variant="body2">Active: {active}</Typography>
                                            <Typography variant="body2">Inactive: {inactive}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}

                    <Card sx={{ backgroundColor: '#1B986E', color: '#fff' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography fontWeight="bold">Total</Typography>
                            <Typography fontWeight="bold">{totalUsers}</Typography>
                        </CardContent>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default UserCount
