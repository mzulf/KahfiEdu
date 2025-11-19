// hooks/useBankHandlers.js

import useAlert from '../hooks/useAlert';
import { useConfirm } from '../hooks/useConfirm'
import { useState } from 'react';
import { useLoading } from '../hooks/useLoading';
import bankService from '../services/bankService';

export default function useBankHandlers(refreshData) {
    const [bankDrawerOpen, setBankDrawerOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [editModeBank, setEditModeBank] = useState(false);
    const { showAlert } = useAlert();
    const confirm = useConfirm();
    const { showLoading, hideLoading } = useLoading();

    const handleOpenBankDrawer = (mode, bank) => {
        if (mode === 'edit' && bank) {
            setSelectedBank(bank);
            setEditModeBank(true);
        } else {
            setSelectedBank(null);
            setEditModeBank(false);
        }
        setBankDrawerOpen(true);
    };

    const handleCloseBankDrawer = () => {
        setBankDrawerOpen(false);
        setSelectedBank(null);
    };

    const handleDeleteBank = async (bank) => {
        const confirmed = await confirm({
            title: bank.deletedAt ? "Hapus Permanen" : "Hapus (Soft Delete)",
            message: `Yakin ingin hapus ${bank.name}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await bankService.deleteBank(bank.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    refreshData();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestoreBank = async (bank) => {
        const confirmed = await confirm({
            title: `Pulihkan Bank`,
            message: `Pulihkan bank ${bank.name}?`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await bankService.restoreBank(bank.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    refreshData();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    return {
        bankDrawerOpen,
        selectedBank,
        editModeBank,
        handleOpenBankDrawer,
        handleCloseBankDrawer,
        handleDeleteBank,
        handleRestoreBank,
    };
}
