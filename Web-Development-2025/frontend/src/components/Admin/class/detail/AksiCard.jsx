import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { HiPencil, HiShare, HiTrash } from "react-icons/hi";

export default function AksiCard({ classData, navigate, showAlert }) {
    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Aksi
                </Typography>
                <Stack spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<HiShare />}
                        sx={{
                            backgroundColor: '#9e9e9e',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#7e7e7e',
                            },
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/class/detail?classId=${classData.id}`);
                            showAlert("Link kelas telah disalin ke clipboard", "success");
                        }}
                    >
                        Bagikan
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<HiPencil />}
                        onClick={() => navigate(`/admin/class/edit?classId=${classData.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<HiTrash />}
                        color="error"
                        onClick={() => {
                            showAlert("Fungsi hapus belum diimplementasikan", "warning");
                        }}
                    >
                        Hapus
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}
