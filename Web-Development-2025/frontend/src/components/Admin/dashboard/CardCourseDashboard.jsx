import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { HiDotsHorizontal } from "react-icons/hi";

export default function CardCourseDashboard() {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                    <Chip
                        label="Chip Filled"
                        sx={{
                            backgroundColor: "#1B986E",
                            color: "white",
                            fontWeight: 500,
                            borderRadius: "4px"
                        }}
                    />
                    <HiDotsHorizontal size="20px" />
                </Box>

                <Typography fontWeight={500} fontSize="18px">
                    Tahfidz Quran
                </Typography>
                <Typography fontWeight={300} fontSize="16px" color="gray">
                    45 Hari lagi
                </Typography>
            </CardContent>
        </Card>
    )
}
