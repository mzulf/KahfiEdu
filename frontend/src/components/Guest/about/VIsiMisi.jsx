import { Container, Typography } from "@mui/material";

export default function VIsiMisi() {
    return (
        <>
            <Container className="flex justify-between items-start space-x-10">
                <div className="w-full bg-[#AEE6BC] p-8 rounded-lg">
                    <Typography
                        variant="h4"
                    >
                        Visi
                    </Typography>
                    <Typography
                        mt={2}
                        component="p"
                        fontSize={18}
                        fontWeight={300}
                        fontFamily="Poppins"
                    >
                        Menjadikan platform pendidikan Islami inovatif dan berkelanjutan, membangun generasi berkarakter unggul melalui nilai-nilai Islam.
                    </Typography>
                </div>
                <div className="w-full bg-[#AEE6BC] p-8 rounded-lg">
                    <Typography variant="h4">
                        Misi
                    </Typography>
                    <ul className="mt-4 list-disc list-inside text-[18px] font-light font-[Poppins]">
                        <li>
                            Menyediakan pendidikan Islami berkualitas melalui program Baca Tulis Qur’an, Tahfidz, dan Tahsin dengan efektif.
                        </li>
                        <li>
                            Memberdayakan para guru dengan pelatihan dan komunitas yang mendukung peningkatan kompetensi mereka.
                        </li>
                        <li>
                            Membangun ekosistem pendidikan yang kolaboratif antara pendidik, orang tua, dan siswa guna menciptakan lingkungan belajar yang positif.
                        </li>
                    </ul>
                </div>

            </Container>
            <Container className="mt-12">
                <Typography
                    component="p"
                    fontSize={32}
                    fontWeight={500}
                    fontFamily="Poppins"
                >
                    Sejarah Singkat <span className="text-kahf-green">Kahf</span> Education
                </Typography>
                <Typography
                    mt={2}
                    component="p"
                    fontSize={20}
                    fontWeight={300}
                    fontFamily="Poppins"
                >
                    Lorem ipsum dolor sit amet consectetur. Et duis nunc amet dignissim gravida. Duis nulla viverra tristique quis tellus volutpat morbi. Bibendum sed mus facilisis porttitor sed pulvinar. Morbi egestas egestas sed mattis dictum lacus enim. Facilisi dignissim leo odio malesuada eget eget vulputate.
                </Typography>

            </Container>
        </>
    )
}
