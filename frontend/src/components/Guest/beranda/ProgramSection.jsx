import { Container, Grid, Typography, Box } from "@mui/material";
import ProgramCard from "./ProgramCard";

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
        <Box>
            <Container>
                <Typography
                    component="p"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{
                        fontSize: { xs: 28, sm: 34, md: 42 },
                    }}
                >
                    Pilih Program
                </Typography>

                <Grid
                    container
                    spacing={{ xs: 4, md: 4 }}
                    mt={{ xs: 4, md: 8 }}
                >
                    {programs.map((program, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={index}
                        >
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
        </Box>
    );
}
