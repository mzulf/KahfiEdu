import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Typography, Box, Avatar
} from "@mui/material";
import { useCallback, useState } from "react";
import ConfirmDialogContext from "../contexts/ConfirmDialogContext";
import { HiExclamation, HiInformationCircle, HiXCircle } from "react-icons/hi";

const iconMap = {
    info: {
        icon: <HiInformationCircle size={100} />,
        color: 'info.main',
        bgColor: 'white'
    },
    warning: {
        icon: <HiExclamation size={100} />,
        color: 'warning.main',
        bgColor: 'white'
    },
    error: {
        icon: <HiXCircle size={100} />,
        color: 'error.main',
        bgColor: 'white'
    }
};

const ConfirmDialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        confirmText: 'Yes',
        cancelText: 'No',
        onConfirm: () => { },
        type: 'info'
    });

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setDialog({
                open: true,
                ...options,
                onConfirm: () => {
                    resolve(true);
                    setDialog(prev => ({ ...prev, open: false }));
                },
                onCancel: () => {
                    resolve(false);
                    setDialog(prev => ({ ...prev, open: false }));
                }
            });
        });
    }, []);

    const { icon, color, bgColor } = iconMap[dialog.type] || iconMap.info;

    return (
        <ConfirmDialogContext.Provider value={confirm}>
            {children}
            <Dialog
                open={dialog.open}
                onClose={dialog.onCancel}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: { xs: '90%', sm: 400 },
                        maxWidth: 500
                    }
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                    >
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: bgColor,
                                color: color,
                                mb: 2
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Typography
                            variant="h6"
                            color={color}
                            fontWeight="bold"
                            gutterBottom
                        >
                            {dialog.title}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ px: 3, py: 1 }}
                    >
                        {dialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                    <Button
                        onClick={dialog.onCancel}
                        color="inherit"
                        variant="outlined"
                        sx={{
                            minWidth: 100,
                            borderRadius: 2
                        }}
                    >
                        {dialog.cancelText}
                    </Button>
                    <Button
                        onClick={dialog.onConfirm}
                        variant="contained"
                        color={dialog.type === 'error' ? 'error' :
                            dialog.type === 'warning' ? 'warning' : 'primary'}
                        autoFocus
                        sx={{
                            minWidth: 100,
                            borderRadius: 2
                        }}
                    >
                        {dialog.confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmDialogContext.Provider>
    );
};

export default ConfirmDialogProvider;
