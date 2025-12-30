import { Container, Grid, Typography, Card, CardContent } from '@mui/material'
import { HiShieldCheck, HiUsers, HiBookOpen, HiLightBulb } from 'react-icons/hi'

const nilaiData = [
    { icon: <HiShieldCheck size={50} className="text-kahf-green" />, name: 'Amanah' },
    { icon: <HiUsers size={50} className="text-kahf-green" />, name: 'Kolaborasi' },
    { icon: <HiBookOpen size={50} className="text-kahf-green" />, name: 'Cinta Qur\'an' },
    { icon: <HiLightBulb size={50} className="text-kahf-green" />, name: 'Inovasi' },
]

export default function NilaiNilai() {
    return (
        <Container className="py-10">
            <Typography
                component="p"
                fontSize={32}
                fontWeight={500}
                fontFamily="Poppins"
                mb={4}
            >
                Nilai - Nilai <span className="text-kahf-green">Kahf</span> Education
            </Typography>
            <Grid container spacing={4}>
                {nilaiData.map((item, index) => (
                    <Grid size={{ xs: 12, md: 3 }} key={index}>
                        <Card className="flex flex-col items-center justify-center text-center py-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent>
                                <div className="flex justify-center mb-2">
                                    {item.icon}
                                </div>
                                <Typography fontSize={18} fontWeight={500} fontFamily="Poppins">
                                    {item.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
