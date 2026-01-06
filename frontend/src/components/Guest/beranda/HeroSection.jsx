import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { HiUser, HiCalendar, HiBadgeCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                backgroundImage: `url('/img/hero.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        maxWidth: { xs: "100%", md: "50%" },
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography
                        component="p"
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: 42, sm: 56, md: 80 },
                            color: "white",
                        }}
                    >
                        Kahfi Education
                    </Typography>

                    <Typography
                        component="p"
                        sx={{
                            fontSize: { xs: 18, md: 28 },
                            color: "white",
                        }}
                    >
                        Belajar Al-Qur’an Jadi Lebih Mudah & Personal
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            mt: 4,
                            justifyContent: { xs: "center", md: "flex-start" },
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/register")}
                            className="!text-white !border-white !py-4 !px-10"
                        >
                            Daftar Sekarang
                        </Button>
                    </Box>

                    <Box mt={6}>
                        <Grid container spacing={2}>
                            {[HiUser, HiCalendar, HiBadgeCheck].map((Icon, i) => (
                                <Grid item xs={12} sm={4} key={i}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 1,
                                            bgcolor: "white",
                                            borderRadius: 1,
                                            p: 2,
                                        }}
                                    >
                                        <Icon size={28} />
                                        <Typography fontWeight={500}>
                                            {["Privat", "Fleksibel", "Pengajar"][i]}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Container>

            <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
                <img src="/img/hero.svg" alt="" className="w-full" />
            </Box>
        </Box>
    );
}
