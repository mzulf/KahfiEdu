import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { capitalizeWords } from "../../../utils/formatedFont";

export default function ListKarir({ jobs, handleSearchChange }) {
    return (
        <Container>
            <Box display="flex" alignItems="center" justifyContent="space-between" my={4}>
                <Typography
                    component="p"
                    fontSize={32}
                    fontWeight={500}
                    fontFamily="Poppins"
                >
                    Daftar Karir <span className="text-kahf-green">Kahf</span> Education
                </Typography>
                <TextField
                    id="search"
                    label="Cari Lowongan"
                    size="small"
                    variant="outlined"
                    placeholder="Cari lowongan..."
                    onChange={handleSearchChange}
                    sx={{ width: "300px", marginLeft: "20px" }}
                />
            </Box>

            <Grid container spacing={2} className="mt-10">
                {jobs.length === 0 ? (
                    <Grid size={12}>
                        <Typography variant="h6" color="textSecondary" align="center">
                            Tidak ada lowongan pekerjaan saat ini.
                        </Typography>
                    </Grid>
                ) : (
                    jobs.map((job, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card className="border border-gray-300 text-start">
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold" className="text-kahf-green" mb={2}>
                                        {capitalizeWords(job.title)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        className="text-gray-700"
                                        gutterBottom
                                    >
                                        {capitalizeWords(job.position)}
                                    </Typography>
                                    <Typography fontSize={14} fontWeight={300}>
                                        {job.location} - {capitalizeWords(job.employmentType)}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => window.open(job.urlLink, '_blank', 'noopener,noreferrer')}
                                    >
                                        Apply
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
}
