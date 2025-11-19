import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box,
    Autocomplete,
    Chip
} from "@mui/material";
import { HiAdjustments } from "react-icons/hi";

export default function FilterBlog({
    tags,
    initialSelectedTags = [],
    setFilters,
    search,
    status,
    setStatus,
    isFeatured,
    setIsFeatured,
    isPublish,
    setIsPublish,
    rowsPerPage,
    setRowsPerPage,
    handleResetFilter
}) {


    return (
        <Accordion>
            <AccordionSummary sx={{ bgcolor: 'warning.main', color: 'white' }}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: "100%", fontSize: "18px" }}
                >
                    <HiAdjustments size={20} className="mr-2" />
                    Filter
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <TextField
                    sx={{ my: 2 }}
                    fullWidth
                    label="Cari Blog"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) =>
                        setFilters(prev => ({ ...prev, search: e.target.value }))
                    }
                />
                <Autocomplete
                    sx={{
                        mb: 2,
                    }}
                    multiple
                    options={tags}
                    value={initialSelectedTags}
                    onChange={(_, value) => setFilters(prev => ({ ...prev, tags: value }))}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip label={option} {...getTagProps({ index })} key={option} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Filter berdasarkan tags" />
                    )}
                />
                <Grid container spacing={2} columns={2} mb={2}>
                    <Grid size={{ xs: 12, md: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="all">Semua</MenuItem>
                                <MenuItem value="active">Aktif</MenuItem>
                                <MenuItem value="deleted">Terhapus</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="is-featured-label">Featured</InputLabel>
                            <Select
                                labelId="is-featured-label"
                                value={isFeatured === null ? '' : isFeatured.toString()}
                                label="Featured"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setIsFeatured(val === '' ? null : val === 'true');
                                }}
                            >
                                <MenuItem value="">Semua</MenuItem>
                                <MenuItem value="true">Ya</MenuItem>
                                <MenuItem value="false">Tidak</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="is-publish-label">Publish</InputLabel>
                            <Select
                                labelId="is-publish-label"
                                value={isPublish === null ? '' : isPublish.toString()}
                                label="Publish"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setIsPublish(val === '' ? null : val === 'true');
                                }}
                            >
                                <MenuItem value="">Semua</MenuItem>
                                <MenuItem value="true">Ya</MenuItem>
                                <MenuItem value="false">Tidak</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="rows-per-page-label">Rows per Page</InputLabel>
                            <Select
                                labelId="rows-per-page-label"
                                value={rowsPerPage}
                                label="Rows per Page"
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                }}
                            >
                                {[6, 9, 12].map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Button variant="outlined" fullWidth onClick={handleResetFilter}>
                    Reset Filter
                </Button>
            </AccordionDetails>
        </Accordion>
    );
}
