import { Box, Container, Typography } from "@mui/material";

export default function TentangSection() {
    return (
        <div
            style={{
                width: '100%',
                backgroundImage: `url('/img/bg-tentang.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container className="flex h-full items-start">
                <img src="/img/ilustrasi/teacher.png" alt="" className="h-[573px]" />
                <Box p={4}>
                    <Typography
                        variant="h4"
                        component="p"
                        fontSize={48}
                        fontWeight='bold'
                    >
                        Tentang Kahfi Education
                    </Typography>
                    <Typography
                        mt={2}
                        variant="h4"
                        component="p"
                        fontSize={24}
                        fontWeight={300}
                    >
                        Kahfi Education adalah layanan pembelajaran Al-Qur’an yang fleksibel dan personal untuk semua usia. Kami menghadirkan program mengaji dengan metode yang mudah, terstruktur, dan dibimbing oleh pengajar berpengalaman. Adapun program yang kami miliki!
                    </Typography>
                </Box>
            </Container>
        </div>
    )
}
