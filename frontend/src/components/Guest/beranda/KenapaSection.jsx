import { Box, Container, Grid, Typography } from "@mui/material";
import {
    HiBookOpen,
    HiChatAlt2,
    HiCheck,
    HiClock,
    HiStatusOnline,
    HiUserGroup
} from "react-icons/hi";
import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: HiStatusOnline,
        title: "Belajar dari mana saja",
        desc: "Cukup dengan internet, belajar bisa dilakukan dari rumah, sekolah, atau mana saja."
    },
    {
        icon: HiCheck,
        title: "Guru Bersertifikat",
        desc: "Pengajar berpengalaman dan tersertifikasi, siap membimbing dengan metode terbaik."
    },
    {
        icon: HiClock,
        title: "Jadwal Fleksibel",
        desc: "Bebas atur jadwal belajar sesuai waktu luang siswa."
    },
    {
        icon: HiBookOpen,
        title: "Kurikulum Bertahap",
        desc: "Pembelajaran terstruktur dari dasar (Iqra’) hingga mahir (Itqan)."
    },
    {
        icon: HiChatAlt2,
        title: "Interaktif & Personal",
        desc: "Belajar aktif dengan pendekatan yang menyenangkan dan disesuaikan."
    },
    {
        icon: HiUserGroup,
        title: "Untuk Semua Usia",
        desc: "Cocok untuk anak-anak, remaja, hingga dewasa."
    },
];

export default function KenapaSection() {
    return (
        <Box>
            <Container>
                <Typography
                    component="p"
                    fontWeight="bold"
                    sx={{
                        fontSize: { xs: 28, sm: 34, md: 42 },
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    Kenapa Pilih Kahfi Education?
                </Typography>

                <Typography
                    component="p"
                    fontWeight={300}
                    sx={{
                        fontSize: { xs: 16, sm: 18, md: 20 },
                        mt: 1,
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    Kahfi Education menawarkan pembelajaran Al-Qur’an online dan privat yang fleksibel, didampingi oleh pengajar tersertifikasi dan metode yang terstruktur.
                </Typography>
            </Container>

            <Box
                sx={{
                    width: "100%",
                    backgroundImage: `url('/img/ilustrasi/bg-why.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mt: 5,
                    py: { xs: 4, md: 8 },
                }}
            >
                <Container>
                    <Grid container spacing={{ xs: 3, md: 4 }}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    desc={feature.desc}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
