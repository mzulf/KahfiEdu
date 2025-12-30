import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Badge,
    IconButton,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Breadcrumbs,
    Link,
    Stack,
    Menu,
    MenuItem,
} from '@mui/material';

// Material-UI Icons
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import useAlert from '../../../hooks/useAlert';
import { useLoading } from '../../../hooks/useLoading';
import { useSearchParams } from 'react-router-dom';
import invoiceService from '../../../services/invoiceService';
import formatDate from '../../../utils/formatDate';

const InvoiceDetail = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const [searchParams] = useSearchParams()
    const invoiceId = searchParams.get('invoiceId')


    const fetchInvoice = async () => {
        showLoading();

        if (!invoiceId) {
            showAlert("invoiceId tidak ditemukan", "info")
            return null
        }

        try {
            const res = await invoiceService.getPaymentById(invoiceId);

            if (res.success) {
                setInvoiceData(res.payment)
            }
        } catch (error) {
            showAlert(error.message, "error")
        } finally {
            hideLoading()
        }
    }

    useEffect(() => {
        fetchInvoice()
    }, [])

    const handleUserMenuClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    console.log(invoiceData)

    if (!invoiceData) {
        return (
            <Box>
                <Typography textAlign="center">Invoice tidak ditemukan</Typography>
            </Box>
        )
    }

    const formatCurrency = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);


    return (
        <Box sx={{ minHeight: '100vh' }}>

            <Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1.5} mb={3}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'green.600', '&:hover': { backgroundColor: 'green.700' } }}
                        startIcon={<DownloadIcon fontSize="small" />}
                    >
                        Simpan
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'orange.500', '&:hover': { backgroundColor: 'orange.600' } }}
                        startIcon={<PrintIcon fontSize="small" />}
                    >
                        Print
                    </Button>
                </Box>

                {/* Invoice Content */}
                <Card sx={{ borderRadius: '8px', boxShadow: 1 }}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Invoice Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                            <Typography variant="h3" component="h1" fontWeight="bold" color="grey.900">
                                Invoice
                            </Typography>
                            <Typography variant="h5" component="div" fontWeight="bold" color="grey.900">
                                {formatDate(invoiceData.payment_date)}
                            </Typography>
                        </Box>

                        {/* From and To Section */}
                        <Grid container spacing={4} mb={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" fontWeight="medium" color="grey.500" mb={1.5}>
                                    From
                                </Typography>
                                <Stack spacing={0.5}>
                                    <Typography variant="body1" fontWeight="semibold" color="grey.900">
                                        {invoiceData.fromUser.name}
                                    </Typography>
                                    <Typography variant="body2" color="grey.600">
                                        Phone : {invoiceData.fromUser.phone}
                                    </Typography>
                                    <Typography variant="body2" color="grey.600">
                                        Email : {invoiceData.fromUser.email}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} alignItems="end" textAlign="end" display={'flex'} flexDirection="column">
                                <Typography variant="body2" fontWeight="medium" color="grey.500" mb={1.5}>
                                    To
                                </Typography>
                                <Stack spacing={0.5}>
                                    <Typography variant="body1" fontWeight="semibold" color="grey.900">
                                        {invoiceData.atas_nama}
                                    </Typography>
                                    <Typography variant="body2" color="grey.600">
                                        Method : {invoiceData.method_name}
                                    </Typography>
                                    <Typography variant="body2" color="grey.600">
                                        Bank : {invoiceData.bank_name}
                                    </Typography>
                                    <Typography variant="body2" color="grey.600">
                                        No Rek : {invoiceData.no_rekening}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Invoice Details */}
                        <Box mb={4}>
                            <Grid container spacing={2} sx={{ mb: 1, py: 1, backgroundColor: "#f2f2f2" }}>
                                <Grid size={{ xs: 12, md: 3 }} textAlign="center">
                                    <Typography variant="body2" color="grey.600">
                                        No Ref : {invoiceData.noRef}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }} textAlign="center">
                                    <Typography variant="body2" color="grey.600">
                                        Metode : {invoiceData.method_name}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 1 }} textAlign="center">
                                    <Typography variant="body2" color="grey.600">
                                        Bank : {invoiceData.bank_name}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }} textAlign="center">
                                    <Typography variant="body2" color="grey.600">
                                        No.Rek : {invoiceData.no_rekening}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }} textAlign="center">
                                    <Typography variant="body2" color="grey.600">
                                        Atas Nama : {invoiceData.atas_nama}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Box>

                        {/* Invoice Table */}
                        <TableContainer sx={{ mb: 4, border: '1px solid', borderColor: 'grey.200', borderRadius: '4px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                        <TableCell sx={{ py: 1.5, px: 2, fontWeight: 'medium', color: 'grey.900' }}>#</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2, fontWeight: 'medium', color: 'grey.900' }}>Program</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2, fontWeight: 'medium', color: 'grey.900' }}>Class</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2, fontWeight: 'medium', color: 'grey.900' }}>Serial Number</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2, fontWeight: 'medium', color: 'grey.900' }}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={invoiceData.id}>
                                        <TableCell sx={{ py: 1.5, px: 2 }}>1</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2 }}>{invoiceData.forClass.course?.title}</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2 }}>{invoiceData.forClass.name}</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2 }}>{invoiceData.noRef}</TableCell>
                                        <TableCell sx={{ py: 1.5, px: 2 }}>{formatCurrency(invoiceData.amount)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Payment Summary */}
                        <Box display="flex" justifyContent="flex-end">
                            <Stack spacing={1.5} sx={{ width: '320px' }}> {/* w-80 */}
                                <Typography variant="body2" color="green.600" fontWeight="medium">
                                    Tanggal Pembayaran : {formatDate(invoiceData.payment_date)}
                                </Typography>
                                {/* <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" fontWeight="semibold">Total :</Typography>
                                    <Typography variant="h6" fontWeight="semibold">{formatCurrency(invoiceData.amount)}</Typography>
                                </Box> */}
                                <Box sx={{ borderTop: '1px solid', borderColor: 'grey.200', pt: 1.5 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" fontWeight="bold">Total : </Typography>
                                        <Typography variant="h5" fontWeight="bold">{formatCurrency(invoiceData.amount)}</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

        </Box>
    );
};

export default InvoiceDetail;