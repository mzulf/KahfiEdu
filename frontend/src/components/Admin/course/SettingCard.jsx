import {
    Card,
    CardContent,
    Typography,
    FormControl,
    TextField,
    MenuItem
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function SettingsCard({ control }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={2}>Pengaturan Program</Typography>

                {/* Status Publikasi */}
                <FormControl fullWidth margin="normal">
                    <Controller
                        name="isPublish"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Status Publikasi"
                                fullWidth
                            >
                                <MenuItem value={true}>Publish</MenuItem>
                                <MenuItem value={false}>Draft</MenuItem>
                            </TextField>
                        )}
                    />
                </FormControl>

                {/* Tampilkan di Beranda */}
                <FormControl fullWidth margin="normal">
                    <Controller
                        name="isFeatured"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Tampilkan di Beranda"
                                fullWidth
                            >
                                <MenuItem value={true}>Ya</MenuItem>
                                <MenuItem value={false}>Tidak</MenuItem>
                            </TextField>
                        )}
                    />
                </FormControl>
            </CardContent>
        </Card>
    );
}
