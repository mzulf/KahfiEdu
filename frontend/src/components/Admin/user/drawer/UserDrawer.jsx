import { useState } from "react";
import useAlert from "../../../../hooks/useAlert";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import userService from "../../../../services/userService";
import { Box, Button, CircularProgress, Drawer, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { HiOutlineXCircle } from "react-icons/hi";
import BasicInformation from "./BasicInformation";
import AddressInformation from "./AddressInformation";

function UserDrawer({
    open,
    onClose,
    editMode,
    user,
    roles,
    onSuccess
}) {
    const [submitting, setSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const { showAlert } = useAlert();

    const { control, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            roleId: "",
            phone: "",
            gender: "",
            alamat: "",
            province: "",
            regency: "",
            district: "",
            village: "",
        }
    });

    useEffect(() => {
        if (open) {
            if (editMode && user) {
                reset({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar ? user.avatar : '',
                    roleId: user.roleId,
                    phone: user.phone ? user.phone : '',
                    gender: user.gender ? user.gender : '',
                    alamat: user.alamat ? user.alamat : '',
                    province: user.province ? user.province : '',
                    regency: user.regency ? user.regency : '',
                    district: user.district ? user.district : '',
                    village: user.village ? user.village : '',
                });
            } else {
                reset({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    avatar: "",
                    roleId: "",
                    phone: "",
                    gender: "",
                    alamat: "",
                    province: "",
                    regency: "",
                    district: "",
                    village: "",
                });
                setAvatarFile(null);
            }
        }
    }, [open, editMode, user, roles, reset]);

    const handleAvatarSelect = (file) => {
        setAvatarFile(file);
        // Clear the avatar URL field since we'll be using the file instead
        setValue("avatar", "");
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);

            let response;
            if (editMode && user) {
                // For update, pass the avatarFile to the service
                response = await userService.updateUser(user.id, data, avatarFile);
                if (response.success) {
                    showAlert(response.message ?? "User berhasil diperbarui", "success");
                } else {
                    showAlert(response.message, "error")
                }

            } else {
                // Pass the avatarFile as second parameter
                response = await userService.createUser(data, avatarFile);

                if (response.success) {
                    showAlert(response.message ?? "User berhasil dibuat", "success");
                } else {
                    showAlert(response.message ?? "Terjadi kesalahan saat membuat user", "error");
                }
            }

            onSuccess();
            onClose(); // Close drawer after success
        } catch (error) {
            showAlert(error.message ?? "Failed to save user", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 500 } }
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">
                        {editMode ? "Edit User" : "Add New User"}
                    </Typography>
                    <IconButton onClick={onClose} edge="end">
                        <HiOutlineXCircle size={32} className="text-red-500" />
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Avatar Upload Component */}
                    <BasicInformation
                        control={control}
                        errors={errors}
                        submitting={submitting}
                        roles={roles}
                        editMode={editMode}
                        user={user}
                        onAvatarSelect={handleAvatarSelect}
                    />

                    <AddressInformation
                        control={control}
                        submitting={submitting}
                        watch={watch}
                        setValue={setValue}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            disabled={submitting}
                            color="default"
                        >Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: '#1B986E',
                                '&:hover': {
                                    bgcolor: '#157A58'
                                }
                            }}
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : null}
                        >
                            {submitting ? 'Saving...' : editMode ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    )
}

export default UserDrawer
