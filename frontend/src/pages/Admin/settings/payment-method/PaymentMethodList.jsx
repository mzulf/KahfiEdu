// PaymentMethodList.jsx
import { Card, CardContent, Box, Typography, Button, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import paymentMethodService from '../../../../services/paymentMethodService';

import PaymentMethodAccordion from '../../../../components/Admin/payment_method/PaymentMethodAccordion';
import PaymentMethodDrawer from '../../../../components/Admin/payment_method/drawer/PaymentMethodDrawer';
import useMethodHandlers from '../../../../helpers/methodHandler';
import useAlert from '../../../../hooks/useAlert';
import { useLoading } from '../../../../hooks/useLoading';

export default function PaymentMethodList() {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();


    const fetchPayments = async () => {
        try {
            showLoading();
            const res = await paymentMethodService.getMethods();
            setPaymentMethods(res.success ? res.paymentMethods : []);
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);


    const {
        drawerOpen,
        selectedMethod,
        editMode,
        handleCloseDrawer,
        handleOpenDrawer,
    } = useMethodHandlers();

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8, xl: 9 }}>
                <Card sx={{ fontFamily: 'poppins' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography variant="h6">Payment Method</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Data Payment Method & Banks
                                </Typography>
                            </Box>
                            <Button onClick={() => handleOpenDrawer('add')} variant="contained" sx={{ bgcolor: "#008B47" }} startIcon={<Add />}>
                                Tambah
                            </Button>
                        </Box>
                        {paymentMethods.map((method, index) => (
                            <PaymentMethodAccordion
                                key={index}
                                method={method}
                                refreshData={fetchPayments}
                                onEditMethod={handleOpenDrawer}
                            />
                        ))}
                    </CardContent>

                    <PaymentMethodDrawer
                        open={drawerOpen}
                        onClose={handleCloseDrawer}
                        editMode={editMode}
                        paymentMethod={selectedMethod}
                        onSuccess={() => {
                            handleCloseDrawer();
                            fetchPayments();
                        }}
                    />
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4, xl: 3 }}>
                <Card sx={{ fontFamily: 'poppins' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Statistik Bank per Metode
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
