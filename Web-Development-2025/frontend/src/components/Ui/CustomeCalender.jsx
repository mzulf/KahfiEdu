import { Box } from '@mui/material'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

export default function CustomeCalender() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',

                    '& .MuiPickersSlideTransition-root': {
                        width: '100%',
                        flex: 1,           // biar dia fleksibel isi tinggi container
                        display: 'flex',
                        flexDirection: 'column',
                    },

                    '& .MuiDayCalendar-monthContainer': {
                        flex: 1,           // agar isi bulan mengambil tinggi penuh
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    },

                    '& .MuiDayCalendar-weekContainer': {
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        flex: 1,            // supaya setiap baris minggu fleksibel tinggi
                        maxHeight: 'calc(100% / 6)',  // atau sesuaikan jumlah minggu (umumnya 5-6)
                    },

                    '& .MuiPickersDay-root': {
                        aspectRatio: '1 / 1',
                        width: '100%',
                        maxWidth: 40,
                        padding: 0,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease-in-out',
                    },

                    '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#0cb061',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#008B47',
                        }
                    },

                    '& .MuiPickersDay-root.MuiPickersDay-today': {
                        border: '1px solid #0cb061',
                    },

                    '& .MuiPickersDay-root.Mui-focusVisible': {
                        outline: '2px solid #1B986E',
                        outlineOffset: 2,
                    },

                    '& .MuiPickersDay-root.Mui-selected.Mui-focusVisible': {
                        outline: '2px solid #008B47',
                        outlineOffset: 2,
                    },

                    '& .MuiDayCalendar-header': {
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: 'auto',    // biar header sesuai konten
                        flexShrink: 0,
                    },

                    '& .MuiDayCalendar-weekDayLabel': {
                        flex: 1,
                        textAlign: 'center',
                    },

                    '& .MuiPickersYear-root': {
                        flex: 1,
                        width: '100%',
                        height: '100%',
                    },
                }}
                slots={{
                    leftArrowIcon: () => (
                        <Box
                            bgcolor="#1B986E"
                            px="10px"
                            py="4px"
                            sx={{
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            <HiArrowLeft size={16} color="white" />
                        </Box>
                    ),
                    rightArrowIcon: () => (
                        <Box
                            bgcolor="#1B986E"
                            px="10px"
                            py="4px"
                            sx={{
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            <HiArrowRight size={16} color="white" />
                        </Box>
                    ),
                }}
                slotProps={{
                    leftArrowButton: {
                        title: 'Sebelumnya',
                        sx: { bgcolor: 'white', '&:hover': { bgcolor: 'lightgray' } }
                    },
                    rightArrowButton: {
                        title: 'Berikutnya',
                        sx: { bgcolor: 'white', '&:hover': { bgcolor: 'lightgray' } }
                    }
                }}
            />
        </LocalizationProvider>
    )
}
