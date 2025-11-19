import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import formatDate from "../../../../utils/formatDate";

export default function AssigmentDialog({ openDialog, selectedAssignment, handleCloseDialog }) {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Detail Tugas</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle2" gutterBottom>Judul:</Typography>
                <Typography mb={2}>{selectedAssignment?.title || "-"}</Typography>

                <Typography variant="subtitle2" gutterBottom>Batas Pengumpulan:</Typography>
                <Typography mb={2}>
                    {selectedAssignment?.dueDate
                        ? formatDate(selectedAssignment.dueDate)
                        : "-"}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>Deskripsi:</Typography>
                <Typography whiteSpace="pre-line">
                    {selectedAssignment?.description || "-"}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Tutup
                </Button>
            </DialogActions>
        </Dialog>
    )
}
