import { Box, Container, Grid, Typography } from "@mui/material";
import { HiBookOpen, HiChatAlt2, HiCheck, HiClock, HiStatusOffline, HiStatusOnline, HiUserGroup } from "react-icons/hi";
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
        <div>
            <Container>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={42}
                    fontWeight='bold'
                >
                    Kenapa Pilih Kahfi Education?
                </Typography>
                <Typography
                    variant="body2"
                    component="p"
                    fontSize={20}
                    fontWeight={300}
                >
                    Kahfi Education menawarkan pembelajaran Al-Qur’an online dan privat yang fleksibel, didampingi oleh pengajar tersertifikasi dan metode yang terstruktur.
                </Typography>
            </Container>
            <div
                style={{
                    width: '100%',
                    backgroundImage: `url('/img/ilustrasi/bg-why.png')`,
                    backgroundSize: 'cover',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                }}
                className="mt-10 py-10"
            >
                <Container>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    desc={feature.desc}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </div>
    )
}
