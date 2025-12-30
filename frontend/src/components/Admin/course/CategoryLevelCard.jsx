import { Card, CardContent, InputLabel, MenuItem, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export default function CategoryLevelCard({ control, errors, categories, submitting }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={1}>Category & Lavel</Typography>
                <div>
                    <InputLabel shrink>Kategori</InputLabel>
                    <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: "Kategori wajib dipilih" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                error={!!errors.categoryId}
                                helperText={errors.categoryId?.message}
                                disabled={submitting}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </div>
                <div style={{ marginTop: "16px" }}>
                    <InputLabel shrink>Level</InputLabel>
                    <Controller
                        name="level"
                        control={control}
                        rules={{ required: "Tingkat wajib diisi" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Tingkat Usia"
                                fullWidth
                                error={!!errors.level}
                                helperText={errors.level?.message}
                                disabled={submitting}
                            >
                                <MenuItem value="Anak-anak (4–10 tahun)">Anak-anak (4–10 tahun)</MenuItem>
                                <MenuItem value="Remaja (11–17 tahun)">Remaja (11–17 tahun)</MenuItem>
                                <MenuItem value="Dewasa (18 tahun ke atas)">Dewasa (18 tahun ke atas)</MenuItem>
                            </TextField>
                        )}
                    />

                </div>
            </CardContent>
        </Card>
    );
}
