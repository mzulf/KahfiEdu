import { Grid, Typography, Chip, Box, Button, Card, CardContent } from '@mui/material';
import { Delete, Edit, Undo } from '@mui/icons-material';
import { capitalizeWords, toUpperCaseAll } from '../../../utils/formatedFont';

export default function BankListItem({ bank, onDelete, onRestore, onEdit }) {
    return (
        <Grid container spacing={2} border="1px solid #3a3a3a7b" p={1} alignItems="center">
            {/* Kiri */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography fontWeight="bold">{toUpperCaseAll(bank.name)}</Typography>
                <Typography variant="body2">{bank.noRek}</Typography>
                {bank.deletedAt && (
                    <Typography variant="body2" className="text-red-500">
                        Tanggal Hapus: {bank.formattedDeletedAt}
                    </Typography>
                )}
            </Grid>

            {/* Tengah */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Box display="flex" alignItems="center">
                    <Chip
                        size="small"
                        color={bank.isActive ? "success" : "error"}
                        sx={{ mr: 1, width: "12px", height: "12px" }}
                    />
                    <Typography variant="body2">{capitalizeWords(bank.status)}</Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>{capitalizeWords(bank.an)}</Typography>
            </Grid>

            {/* Kanan */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                    {bank.deletedAt ? (
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<Undo />}
                            onClick={() => onRestore(bank)}
                        >
                            Restore
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="info"
                            startIcon={<Edit />}
                            onClick={() => onEdit("edit", bank)}
                        >
                            Edit
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => onDelete(bank)}
                    >
                        Delete
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}
