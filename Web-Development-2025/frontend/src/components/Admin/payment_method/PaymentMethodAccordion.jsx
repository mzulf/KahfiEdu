// PaymentMethodAccordion.jsx
import {
    Accordion, AccordionSummary, AccordionDetails,
    Box, Typography, Menu, MenuItem, Stack,
    Badge,
    Button,
    IconButton
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { HiDotsVertical } from 'react-icons/hi';
import { useState } from 'react';
import BankListItem from './BankListItem';
import { capitalizeWords } from '../../../utils/formatedFont';
import useBankHandlers from '../../../helpers/bankHandlers';
import useMethodHandlers from '../../../helpers/methodHandler';
import BankDrawer from './drawer/BankDrawer';

export default function PaymentMethodAccordion({ method, refreshData, onEditMethod }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const {
        bankDrawerOpen,
        selectedBank,
        editModeBank,
        handleOpenBankDrawer,
        handleCloseBankDrawer,
        handleDeleteBank,
        handleRestoreBank
    } = useBankHandlers(refreshData);


    const { handleDeleteMethod, handleRestoreMethod } = useMethodHandlers(refreshData);


    return (
        <Accordion>
            <AccordionSummary
                aria-controls="content"
                id="header"
                expandIcon={<span />}
                sx={{ bgcolor: method.deletedAt ? '#6b6b6b' : '#008B47', color: 'white' }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    {/* Kiri: Info Method */}
                    <Box flexGrow={1}>
                        <Badge
                            badgeContent={method.banks.length}
                            color="secondary"
                            showZero
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                    right: -4,
                                    top: 10,
                                    padding: '0 4px',
                                },
                            }}
                        >
                            <Typography fontWeight="bold" className='pr-3'>
                                {capitalizeWords(method.name)}
                            </Typography>
                        </Badge>
                        <Typography variant="body2">
                            {method.description}
                        </Typography>
                        {method.deletedAt &&
                            <Typography variant="body2" className='text-red-200'>
                                Tanggal Hapus: {method.formattedDeletedAt}
                            </Typography>
                        }
                    </Box>

                    {/* Kanan: Icon */}
                    <Box ml={2} display="flex" alignItems="center">

                        <HiDotsVertical
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={handleMenuClick}
                            onFocus={(e) => e.stopPropagation()}
                        />
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails>
                <Box display="flex" mb={1} justifyContent="end" alignItems="center" gap={1}>
                    <Typography fontWeight="bold">Tambah {capitalizeWords(method.name)}</Typography>
                    <IconButton
                        size='small'
                        variant="outline"
                        sx={{ color: "primary.main" }}
                        onClick={() => handleOpenBankDrawer('add')}
                    >
                        <Add />
                    </IconButton>
                </Box>
                <Stack spacing={2}>
                    {method.banks.map((bank, idx) => (
                        <BankListItem
                            key={idx}
                            bank={bank}
                            onDelete={handleDeleteBank}
                            onRestore={handleRestoreBank}
                            onEdit={handleOpenBankDrawer}
                        />
                    ))}
                </Stack>
            </AccordionDetails>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {method.deletedAt ?
                    <MenuItem onClick={() => { handleClose(); handleRestoreMethod(method) }}>Restore</MenuItem>
                    : <MenuItem onClick={() => { handleClose(); onEditMethod('edit', method);; }}>Edit</MenuItem>
                }
                <MenuItem onClick={() => { handleClose(); handleDeleteMethod(method) }}>Hapus</MenuItem>
            </Menu>
            <BankDrawer
                open={bankDrawerOpen}
                onClose={handleCloseBankDrawer}
                editMode={editModeBank}
                bank={selectedBank}
                method={method}
                onSuccess={() => {
                    handleCloseBankDrawer();
                    refreshData();
                }}
            />

        </Accordion>
    );
}
