import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    Alert,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, FileUpload } from '@mui/icons-material';
import { useAuth } from '../../../../hooks/useAuth';
import useAlert from '../../../../hooks/useAlert';
import { cookieService } from '../../../../services/cookieService';
import userService from '../../../../services/userService';

export default function ImportUserDialog({ open, onClose }) {
    const [isUploading, setIsUploading] = useState(false);
    const [importStatus, setImportStatus] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = useRef(null);
    const { socket } = useAuth();
    const { showAlert } = useAlert();
    const socketIdRef = useRef(cookieService.getSocketId());

    useEffect(() => {
        if (!socket) return;

        if (!socketIdRef.current) {
            socketIdRef.current = socket.id;
            cookieService.setSocketId(socket.id);
        }

        const onImportStatus = (data) => {
            console.log("✅ Import status update:", data);
            setImportStatus(data);

            if (data.processed + data.skipped === data.total) {
                showAlert(`Import completed! Successfully processed ${data.processed} records, ${data.skipped} skipped.`, 'success');
                setIsUploading(false);
                setTimeout(() => {
                    setImportStatus(null);
                    onClose();
                }, 2000);
            }
        };

        const onImportError = (error) => {
            console.error("❌ Import error:", error);
            showAlert(`Import error: ${error.message}`, 'error');
            setIsUploading(false);
        };

        socket.on("importStatus", onImportStatus);
        socket.on("importError", onImportError);

        return () => {
            socket.off("importStatus", onImportStatus);
            socket.off("importError", onImportError);
        };
    }, [socket, showAlert, onClose]);

    useEffect(() => {
        if (uploadResult) {
            const timer = setTimeout(() => {
                setUploadResult(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [uploadResult]);

    const handleUpload = async () => {
        const file = fileInputRef.current.files[0];

        if (!file) {
            showAlert("Please select a file first!", 'warning');
            return;
        }

        if (!socketIdRef.current) {
            showAlert("Socket connection not available! Please try again.", 'error');
            return;
        }

        setIsUploading(true);
        setUploadResult(null);
        setImportStatus(null);


        try {
            const token = await cookieService.getAuthToken()
            const formData = new FormData();
            formData.append("file", file);
            formData.append("token", token);
            const response = await userService.importUsers(formData);
            setUploadResult({ success: true, message: response.message || "File uploaded successfully, processing data..." });
            showAlert("File uploaded successfully, processing data...", 'success');
        } catch (err) {
            setUploadResult({ success: false, message: "Upload failed: " + (err.message || "Unknown error") });
            showAlert("Upload failed: " + (err.message || "Unknown error"), 'error');
            setIsUploading(false);
        }
    };

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        setSelectedFileName(file?.name || '');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ px: 3, py: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">📥 Import Users</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Box my={1}>
                    <Box my={1}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".xlsx, .xls, .csv"
                            disabled={isUploading}
                            style={{ display: 'none' }}
                            id="upload-file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="upload-file-input">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                disabled={isUploading}
                                startIcon={<FileUpload />}
                            >
                                {fileInputRef.current?.files?.[0]?.name || 'Choose File'}
                            </Button>
                        </label>
                    </Box>

                    {uploadResult && (
                        <Alert
                            severity={uploadResult.success ? "success" : "error"}
                            sx={{ mb: 2 }}
                            variant="filled"
                        >
                            {uploadResult.message}
                        </Alert>
                    )}

                    {importStatus && (
                        <Box mt={2}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                📊 Import Progress
                            </Typography>

                            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                                <Box
                                    bgcolor="grey.100"
                                    p={2}
                                    borderRadius={2}
                                    boxShadow={1}
                                >
                                    <Typography variant="body2" color="textSecondary">Total</Typography>
                                    <Typography variant="h6">{importStatus.total}</Typography>
                                </Box>
                                <Box
                                    bgcolor="success.main"
                                    p={2}
                                    borderRadius={2}
                                    color="white"
                                    boxShadow={1}
                                >
                                    <Typography variant="body2">Processed</Typography>
                                    <Typography variant="h6">{importStatus.processed}</Typography>
                                </Box>
                                <Box
                                    bgcolor="warning.main"
                                    p={2}
                                    borderRadius={2}
                                    color="white"
                                    boxShadow={1}
                                >
                                    <Typography variant="body2">Skipped</Typography>
                                    <Typography variant="h6">{importStatus.skipped}</Typography>
                                </Box>
                            </Box>

                            {isUploading && (
                                <LinearProgress
                                    variant="determinate"
                                    value={(importStatus.processed / importStatus.total) * 100}
                                    sx={{ mt: 2, borderRadius: 1, height: 8 }}
                                />
                            )}

                            {importStatus.skippedDetails?.length > 0 && (
                                <Box mt={3}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        ⚠️ Skipped Records
                                    </Typography>
                                    <Box
                                        maxHeight={200}
                                        overflow="auto"
                                        bgcolor="grey.100"
                                        p={2}
                                        borderRadius={2}
                                        sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                                    >
                                        {importStatus.skippedDetails.map((item, idx) => (
                                            <pre key={idx} style={{ margin: 0 }}>
                                                {JSON.stringify(item, null, 2)}
                                            </pre>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
                <Button
                    onClick={handleUpload}
                    disabled={isUploading || !socket?.connected}
                    variant="contained"
                    color="primary"
                    startIcon={<FileUpload />}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
