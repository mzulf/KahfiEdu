import { Container, Grid, Typography } from "@mui/material";
import TestimoniCard from "./TestimoniCard"; // pastikan path sesuai

const testimonies = [
    {
        name: "Aisyah R.",
        job: "Pelajar",
        message: "Pengajarnya sabar dan sangat membantu. Saya merasa lebih percaya diri membaca Al-Qur’an.",
        avatar: "/img/avatar/1.png",
    },
    {
        name: "Fahmi L.",
        job: "Pelajar",
        message: "Program privatnya cocok sekali buat saya yang sibuk kerja. Jadwal fleksibel dan pengajar berpengalaman.",
        avatar: "/img/avatar/2.png",
    },
    {
        name: "Nadia A.",
        job: "Orang Tua ",
        message: "Anak saya jadi semangat mengaji. Metodenya menyenangkan dan mudah dipahami.",
        avatar: "/img/avatar/3.png",
    },
];

export default function TestimoniSection() {
    return (
        <div className="mt-20">
            <Container>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={42}
                    fontWeight="bold"
                    textAlign="center"
                    mb={2}
                >
                    Testimoni
                </Typography>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={20}
                    fontWeight={300}
                    textAlign="center"
                    mb={6}
                >
                    Kahfi Education hadir untuk mendampingi perjalanan belajar Al-Qur'an dengan hati. Berikut kesan mereka yang telah menjadi bagian dari perjalanan ini.
                </Typography>

                <Grid container spacing={4}>
                    {testimonies.map((item, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index} p={1}>
                            <TestimoniCard
                                name={item.name}
                                message={item.message}
                                avatar={item.avatar}
                                job={item.job}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}
