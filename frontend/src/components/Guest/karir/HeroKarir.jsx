import { Box, Button, Container, Typography } from "@mui/material";
import { HiChevronRight } from "react-icons/hi";

export default function HeroKarir() {
    return (
        <Box >
            <Container className="flex flex-col-reverse md:flex-row items-start justify-between py-12">
                <Box className="flex-1">
                    <Typography
                        variant="h5"
                        component="h2"
                        fontSize={28}
                        fontWeight={400}
                    >
                        <span className="text-kahf-green">Kahfi</span> Education
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h2"
                        fontSize={42}
                        fontWeight={500}
                    >
                        Bergabunglah Menjadi Bagian dari Perjalanan Dakwah Pendidikan
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        fontWeight={300}
                        mt={2}
                    >
                        Kami percaya pendidikan yang baik berangkat dari hati. Mari tumbuh bersama di <span className="text-kahf-green">Kahfi</span> Education.
                    </Typography>
                    <Box className="mt-5">
                        <Button
                            sx={{
                                bgcolor: '#1A7F4D',
                                color: '#FFFFFF',
                                '&:hover': {
                                    bgcolor: '#145A3A',
                                },
                                padding: '10px 20px',
                                fontSize: '16px',
                                fontWeight: '500',
                            }}
                            endIcon={<HiChevronRight size={24} />}
                        >
                            Lihat Lowongan
                        </Button>
                    </Box>
                </Box>
                <Box className="flex-1">
                    <img
                        src="img/ilustrasi/ilustrasi-6.png"
                        alt="Guru Mengajar"
                        className="w-[85%] h-auto rounded-xl transition-transform duration-300 hover:scale-105 mx-auto"
                    />
                </Box>

            </Container>
        </Box>
    )
}
