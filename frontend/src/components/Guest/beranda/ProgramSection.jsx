import { Container, Grid, Typography } from "@mui/material";
import ProgramCard from "./ProgramCard"; // pastikan path sesuai

const programs = [
    {
        image: "/img/ilustrasi/ilustrasi-1.png",
        title: "Kelas Mengaji Privat",
        desc: "Belajar Al-Qur'an langsung di rumah dengan pendampingan ustadz/ustadzah.",
    },
    {
        image: "/img/ilustrasi/ilustrasi-2.png",
        title: "Kelas Online Interaktif",
        desc: "Belajar Al-Qur'an secara daring via Zoom/Meet bersama guru pilihan.",
    },
    {
        image: "/img/ilustrasi/ilustrasi-3.png",
        title: "Kelas Tahsin (Full Online)",
        desc: "Tingkatkan kualitas bacaan Al-Qur’an dengan tajwid yang benar, 100% online.",
    },
    {
        image: "/img/ilustrasi/ilustrasi-4.png",
        title: "Kelas Tahfidz (Full Online)",
        desc: "Hafalan Al-Qur’an dengan bimbingan intensif dan target yang terukur.",
    },
];

export default function ProgramSection() {
    return (
        <div>
            <Container>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={42}
                    fontWeight="bold"
                    textAlign="center"
                >
                    Pilih Program
                </Typography>
                <Grid container spacing={4} mt={8}>
                    {programs.map((program, index) => (
                        <Grid size={{ xs: 12, md: 3 }} key={index}>
                            <ProgramCard
                                image={program.image}
                                title={program.title}
                                desc={program.desc}
                                isOdd={index % 2 !== 0}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}
