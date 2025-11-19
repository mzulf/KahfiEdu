import { Autocomplete, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function FilterBlog({
    onSearch,
    availableTags,
    initialSearch = "",
    initialSelectedTags = [],
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

    // Debounce search + tag filter changes, then send up to parent
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onSearch({ search: searchTerm, tags: selectedTags });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedTags, onSearch]);

    return (
        <div style={{ position: "sticky", top: 80 }}>
            <Paper elevation={3} className="p-6">
                <Stack spacing={2}>
                    <Typography variant="h6" gutterBottom>
                        Filter Blog
                    </Typography>

                    <TextField
                        fullWidth
                        label="Cari blog..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />

                    <Autocomplete
                        multiple
                        options={availableTags}
                        value={selectedTags}
                        onChange={(_, value) => setSelectedTags(value)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option} {...getTagProps({ index })} key={option} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Filter berdasarkan tags" />
                        )}
                    />
                </Stack>
            </Paper>
        </div>
    );
}
