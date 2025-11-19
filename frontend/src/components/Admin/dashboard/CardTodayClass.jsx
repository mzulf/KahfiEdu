import { Box, Button, Typography } from "@mui/material";
import { HiDotsHorizontal } from "react-icons/hi";

export default function CardTodayClass() {
    return (
        <>
            <Typography mb={2} fontWeight={500} fontSize="20px" ml={1}>Kelas hari ini</Typography>
            <div className="relative rounded-lg bg-white shadow-sm">
                <div className="absolute top-0 rounded-t-lg p-3 bg-kahf-green w-full" />
                <Box pt={5} px={3} pb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={500} fontSize="20px">THFZ01</Typography>
                        <HiDotsHorizontal size={20} />
                    </Box>
                    <Typography fontWeight={300} fontSize="14px" color="gray" mt={1}>Pukul 11.00 - 12.00</Typography>
                    <Box display="flex" justifyContent="end">
                        <Button
                            sx={{
                                bgcolor: "#008B47",
                                color: "white",
                                mt: 2,
                                px: 4,
                            }}
                        >
                            Absen
                        </Button>
                    </Box>
                </Box>
            </div>
            <div className="relative rounded-lg bg-white shadow-sm mt-4">
                <div className="absolute top-0 rounded-t-lg p-3 bg-kahf-green w-full" />
                <Box pt={5} px={3} pb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={500} fontSize="20px">THFZ01</Typography>
                        <HiDotsHorizontal size={20} />
                    </Box>
                    <Typography fontWeight={300} fontSize="14px" color="gray" mt={1}>Pukul 11.00 - 12.00</Typography>
                    <Box display="flex" justifyContent="end">
                        <Button
                            sx={{
                                bgcolor: "#008B47",
                                color: "white",
                                mt: 2,
                                px: 4,
                            }}
                        >
                            Absen
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    )
}
