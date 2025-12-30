import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function ExportDialog({ open, onClose, onExport }) {
    const [format, setFormat] = useState('xlsx');

    const handleChange = (event) => {
        setFormat(event.target.value);
    };

    const handleExportClick = () => {
        onExport(format);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Export Users</DialogTitle>
            <DialogContent>
                <FormLabel component="legend">Select Export Format</FormLabel>
                <RadioGroup value={format} onChange={handleChange} row>
                    <FormControlLabel value="xlsx" control={<Radio />} label="Excel (.xlsx)" />
                    <FormControlLabel value="csv" control={<Radio />} label="CSV (.csv)" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportClick}
                    color="primary"
                >
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
}
