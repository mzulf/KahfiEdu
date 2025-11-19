import { Box, Container, Typography } from "@mui/material";

export default function HeroAbout() {
    return (
        <Box position="relative">
            <Container className="flex flex-col-reverse md:flex-row items-start justify-between py-12">
                <Box className="flex-1">
                    <Typography
                        variant="h5"
                        component="h2"
                        fontSize={28}
                        fontWeight={400}
                    >
                        Tentang Kami
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h2"
                        fontSize={42}
                        fontWeight={500}
                    >
                        Belajar dari Hati
                        untuk Generasi Qur’ani
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        fontWeight={300}
                        mt={2}
                    >
                        Kahfi Education adalah lembaga pendidikan Islam yang berdedikasi untuk membentuk generasi yang berakhlak mulia dan cinta Al-Qur’an
                    </Typography>
                </Box>
                <Box className="flex-1">
                    <img
                        src="img/ilustrasi/ilustrasi-5.png"
                        alt="Guru Mengajar"
                        className="w-[85%] h-auto rounded-xl transition-transform duration-300 hover:scale-105 mx-auto"
                    />
                </Box>
            </Container>
            <img src="/img/ilustrasi/shape.svg" alt="" className='w-full absolute bottom-0 -z-1' />
        </Box>
    )
}
