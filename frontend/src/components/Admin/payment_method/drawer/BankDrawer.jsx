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
    MenuItem,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import bankService from "../../../../services/bankService";
import { HiOutlineXCircle } from "react-icons/hi";
import useAlert from "../../../../hooks/useAlert";
import { toUpperCaseAll } from "../../../../utils/formatedFont";

export const BankDrawer = ({
    open,
    onClose,
    editMode,
    bank,
    method,
    onSuccess,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const { showAlert } = useAlert();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            an: "",
            noRek: "",
            paymentMethodId: "",
            isActive: false
        }
    });


    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, editMode, bank]);


    const resetForm = () => {
        if (editMode && bank) {
            reset({
                name: bank.name,
                an: bank.an,
                noRek: bank.noRek,
                paymentMethodId: bank.paymentMethodId || "",
                isActive: bank.isActive || false,
            });
        } else {
            reset({
                name: "",
                an: "",
                noRek: "",
                paymentMethodId: method?.id || "", // ✅ ambil ID method langsung
                isActive: false,
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            if (editMode && bank) {
                const response = await bankService.updateBank(bank.id, data);
                if (response.success) {
                    showAlert(response.message, "success")
                    onSuccess();
                }
            } else {
                const response = await bankService.createBank(data);
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {editMode ? "Edit Bank" : "Tambah Bank"}
                    </Typography>
                    <IconButton onClick={onClose} edge="end">
                        <HiOutlineXCircle size={28} className="text-red-500" />
                    </IconButton>
                </Box>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    {editMode
                        ? `Edit informasi bank untuk metode:`
                        : `Masukkan informasi bank untuk metode:`}
                </Typography>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    {toUpperCaseAll(method?.name)}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <Controller
                            name="paymentMethodId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Metode Pembayaran"
                                    variant="outlined"
                                    fullWidth
                                    value={toUpperCaseAll(method?.name) || ""}
                                    disabled
                                    hidden
                                />
                            )}
                        />
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: "Nama bank wajib diisi",
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nama Bank"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    disabled={submitting}
                                />
                            )}
                        />
                        <Controller
                            name="noRek"
                            control={control}
                            rules={{
                                required: "Nomor Rek wajib diisi",
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nomor Rekening"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.noRek}
                                    helperText={errors.noRek?.message}
                                    disabled={submitting}
                                />
                            )}
                        />

                        <Controller
                            name="an"
                            control={control}
                            rules={{
                                required: "Atas Nama wajib diisi",
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Atas Nama"
                                    variant="outlined"
                                    rows={3}
                                    error={!!errors.an}
                                    helperText={errors.an?.message}
                                    disabled={submitting}
                                />
                            )}
                        />

                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    {...field}
                                    label="Status Aktif"
                                    variant="outlined"
                                    fullWidth
                                    disabled={submitting}
                                >
                                    <MenuItem value={true}>Aktif</MenuItem>
                                    <MenuItem value={false}>Tidak Aktif</MenuItem>
                                </TextField>
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

export default BankDrawer;