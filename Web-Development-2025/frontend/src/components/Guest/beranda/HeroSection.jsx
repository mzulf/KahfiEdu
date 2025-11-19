import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { HiUser, HiCalendar, HiBadgeCheck } from 'react-icons/hi';

export default function HeroSection() {
    return (
        <div className='relative min-h-[100vh] flex justify-start items-center' style={{ backgroundImage: `url('/img/hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Container maxWidth="lg">
                <Box className="flex flex-col md:flex-row items-center justify-between" maxWidth='50%'>
                    <Box className="flex-1 text-center md:text-left text-white">
                        <Typography
                            variant="h4"
                            component="p"
                            fontSize={80}
                            fontWeight='bold'
                        >
                            Kahfi
                            Education
                        </Typography>
                        <Typography
                            component="p"
                            fontSize={28}
                            fontWeight={400}
                        >
                            Belajar Al-Qur’an Jadi Lebih Mudah & Personal
                        </Typography>

                        <Box className="flex flex-col md:flex-row gap-4 mt-6 justify-center md:justify-start">
                            <Button
                                variant="contained"
                                className='!bg-kahf-green !text-white !py-4 !px-10'
                            >
                                Pilih Program
                            </Button>
                            <Button
                                variant="outlined"
                                className='!text-white !border-white !py-4 !px-10'
                            >
                                Daftar Sekarang
                            </Button>
                        </Box>

                        <Box className="mt-8  text-green-700">
                            <Grid container spacing={3} justifyContent="space-around">
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box className="flex flex-col h-full gap-4 items-center justify-center text-center bg-slate-50 rounded-sm p-2">
                                        <HiUser size={28} />
                                        <Typography variant="body2" fontWeight={500} className="mt-2">Privat</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box className="flex flex-col h-full gap-4 justify-center items-center text-center bg-slate-50 rounded-sm p-2">
                                        <HiCalendar size={28} />
                                        <Typography variant="body2" fontWeight={500} className="mt-2">Fleksibel</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box className="flex flex-col gap-4 items-center text-center bg-slate-50 rounded-sm p-2">
                                        <HiBadgeCheck size={28} />
                                        <Typography variant="body2" fontWeight={500} className="mt-2">Pengajar</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* img */}
            <Box className="absolute bottom-0 w-full">
                <img src="/img/hero.svg" alt="Hero Bottom Decoration" className="w-full h-full" />
            </Box>
        </div>
    )
}
