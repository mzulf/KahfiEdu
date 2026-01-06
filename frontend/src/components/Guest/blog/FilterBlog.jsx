import {
    Autocomplete,
    Chip,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function FilterBlog({
    onSearch,
    availableTags,
    initialSearch = "",
    initialSelectedTags = [],
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

    useEffect(() => {
        const debounce = setTimeout(() => {
            onSearch({
                search: searchTerm,
                tags: selectedTags,
            });
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchTerm, selectedTags, onSearch]);

    return (
        <Paper
            elevation={2}
            sx={{
                position: { xs: "static", md: "sticky" },
                top: 88,
                p: { xs: 2, md: 3 },
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                    Filter Blog
                </Typography>

                <TextField
                    fullWidth
                    label="Cari blog"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Autocomplete
                    multiple
                    options={availableTags}
                    value={selectedTags}
                    onChange={(_, value) => setSelectedTags(value)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option}
                                size="small"
                                {...getTagProps({ index })}
                                key={option}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Filter berdasarkan tag" />
                    )}
                />
            </Stack>
        </Paper>
    );
}
