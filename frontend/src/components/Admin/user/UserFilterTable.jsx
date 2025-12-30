import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUpload from '@mui/icons-material/FileUpload';
import { HiSearch } from "react-icons/hi"
import ImportUserDialog from '../../../components/Admin/user/dialog/ImportUserDialog';
import ExportDialog from '../../../components/Admin/user/dialog/ExportUserDialog';
import useAlert from "../../../hooks/useAlert";
import userService from "../../../services/userService";
import { useState } from "react";

const UserFilterTable = ({ roles, status, selectedRoleId, handleStatusChange, handleRoleChange, handleSearch }) => {
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const { showAlert } = useAlert();

    const handleExport = async (format) => {
        try {
            const res = await userService.exportUsers(format)
            if (res.success) {
                showAlert(res.message, 'success')
                setExportDialogOpen(false)
            } else {
                showAlert(res.message, 'error')
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }
    return (
        <>

            <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>

                <Box display="flex" justifyContent="end" alignItems="center" gap={1}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        sx={{
                            bgcolor: '#1B986E',
                            '&:hover': {
                                bgcolor: '#157A58'
                            }
                        }}
                        onClick={() => setExportDialogOpen(true)}
                    >
                        Export
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FileUpload />}
                        sx={{
                            bgcolor: '#1B986E',
                            '&:hover': {
                                bgcolor: '#157A58'
                            }
                        }}
                        onClick={() => setImportDialogOpen(true)}
                    >
                        Import
                    </Button>
                </Box>
                <Box display="flex" justifyContent="end" alignItems="center" gap={1}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="selected-user-status">Status</InputLabel>
                        <Select
                            id="selected-user-status"
                            labelId="selected-user-status"
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="all">All Users</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="deleted">Deleted</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="selected-role-id">Role</InputLabel>
                        <Select
                            id="selected-role-id"
                            labelId="selected-role-id"
                            label="Role"
                            value={selectedRoleId}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id} >
                                    {role.name.replace(/\b\w/g, char => char.toUpperCase())}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        placeholder="Cari nama ..."
                        onChange={(e) => handleSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HiSearch size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 200 }}
                    />
                </Box>

            </Stack>
            <ImportUserDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            />

            <ExportDialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                onExport={handleExport}
            />
        </>
    )
}

export default UserFilterTable
