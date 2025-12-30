import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
import { HiLocationMarker } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactUs() {
    return (
        <Box className=" py-16">
            <Container>
                <Grid container spacing={4} alignItems="flex-start">
                    {/* KIRI: Title & Deskripsi */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            variant="h4"
                            fontWeight={600}
                            fontFamily="Poppins"
                            mb={2}
                        >
                            Hubungi Kami
                        </Typography>
                        <Typography
                            fontSize={18}
                            fontWeight={300}
                            fontFamily="Poppins"
                            color="textSecondary"
                        >
                            Kami siap mendengarkan pertanyaan, masukan, atau peluang kerja sama dari Anda. Silakan isi formulir atau hubungi kami melalui WhatsApp.
                        </Typography>
                    </Grid>

                    {/* KANAN: Form */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                        >
                            <TextField fullWidth label="Nama" variant="outlined" sx={{ mb: 2 }} />
                            <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} />
                            <TextField fullWidth label="Pesan" multiline rows={4} variant="outlined" sx={{ mb: 2 }} />
                            <Button variant="contained" color="success">
                                Kirim Pesan
                            </Button>
                        </Box>

                        {/* Bawah form: WA & Lokasi */}
                        <Box className="mt-6 space-y-2">
                            <Box className=" flex items-center gap-3">
                                <FaWhatsapp size={24} className="text-green-600" />
                                <Typography>
                                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                        Chat via WhatsApp: +62 812-3456-7890
                                    </a>
                                </Typography>
                            </Box>
                            <Box className=" flex items-center gap-3">
                                <HiLocationMarker size={24} className="text-kahf-green" />
                                <Typography>
                                    Jl. Pendidikan Islami No. 10, Jakarta
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
