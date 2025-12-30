// src/components/products/ProductDrawer.tsx
import { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    Button,
    Stack,
    CircularProgress,
    IconButton,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import paymentMethodService from "../../../../services/paymentMethodService";
import { HiOutlineXCircle } from "react-icons/hi";
import useAlert from "../../../../hooks/useAlert";

export const PaymentMethodDrawer = ({
    open,
    onClose,
    editMode,
    paymentMethod,
    onSuccess,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const { showAlert } = useAlert();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
        }
    });


    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, editMode, paymentMethod]);


    const resetForm = () => {
        if (editMode && paymentMethod) {
            reset({
                name: paymentMethod.name,
                description: paymentMethod.description || "",
            });

        } else {
            reset({
                name: "",
                description: "",
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            if (editMode && paymentMethod) {
                const response = await paymentMethodService.updateMethod(paymentMethod.id, data);
                if (response.success) {
                    showAlert(response.message, "success")
                    onSuccess();
                }
            } else {
                const response = await paymentMethodService.createMethod(data);
                if (response.success) {
                    showAlert(response.message, "success")
                    onSuccess();
                }
            }
        } catch (error) {
            showAlert(error.message, "error")
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
                sx: { width: { xs: '100%', sm: 400 } }
            }}
        >
            <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">
                        {editMode ? "Edit Payment Method" : "Add Payment Method"}
                    </Typography>
                    <IconButton onClick={onClose} edge="end">
                        <HiOutlineXCircle size={32} className="text-red-500" />
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: "Nama Methode wajib diisi",
                                maxLength: {
                                    value: 255,
                                    message: "Nama tidak boleh lebih dari 255 karakter"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nama Method"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    disabled={submitting}
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: "Deskripsi kategori wajib diisi",
                                maxLength: {
                                    value: 40,
                                    message: "Deskripsi tidak boleh lebih dari 40 karakter"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Deskripsi"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    disabled={submitting}
                                />
                            )}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                color="default"
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-utama"
                                type="submit"
                                variant="contained"
                                sx={{ bgcolor: "#008B47" }}
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : null}
                            >
                                {submitting ? "Saving..." : editMode ? "Update" : "Create"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Drawer>
    );
};

export default PaymentMethodDrawer;