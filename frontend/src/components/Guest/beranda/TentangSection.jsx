import { Box, Container, Typography } from "@mui/material";

export default function TentangSection() {
    return (
        <Box
            sx={{
                width: "100%",
                backgroundImage: `url('/img/bg-tentang.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center",
                py: { xs: 6, md: 10 },
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: { xs: 4, md: 6 },
                }}
            >
                <Box
                    component="img"
                    src="/img/ilustrasi/teacher.png"
                    alt="Teacher"
                    sx={{
                        height: { xs: 280, sm: 360, md: 573 },
                        width: "auto",
                        maxWidth: "100%",
                    }}
                />

                <Box sx={{ p: { xs: 0, md: 4 } }}>
                    <Typography
                        component="p"
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: 28, sm: 36, md: 48 },
                            textAlign: { xs: "center", md: "left" },
                        }}
                    >
                        Tentang Kahfi Education
                    </Typography>

                    <Typography
                        component="p"
                        fontWeight={300}
                        sx={{
                            mt: 2,
                            fontSize: { xs: 16, sm: 18, md: 24 },
                            textAlign: { xs: "center", md: "left" },
                        }}
                    >
                        Kahfi Education adalah layanan pembelajaran Al-Qur’an yang fleksibel dan personal untuk semua usia. Kami menghadirkan program mengaji dengan metode yang mudah, terstruktur, dan dibimbing oleh pengajar berpengalaman. Adapun program yang kami miliki!
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
