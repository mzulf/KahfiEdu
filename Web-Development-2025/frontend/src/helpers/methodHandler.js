import useAlert from '../hooks/useAlert';
import { useConfirm } from '../hooks/useConfirm'
import { useLoading } from '../hooks/useLoading';
import paymentMethodService from '../services/paymentMethodService';
import { useState } from 'react';

export default function useMethodHandlers(refreshData) {
    const { showAlert } = useAlert();
    const confirm = useConfirm();
    const { showLoading, hideLoading } = useLoading();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const handleOpenDrawer = (mode, method) => {
        if (mode === "edit" && method) {
            setSelectedMethod(method);
            setEditMode(true);
        } else {
            setSelectedMethod(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedMethod(null);
    };

    const handleDeleteMethod = async (method) => {
        const confirmed = await confirm({
            title: method.deletedAt ? "Hapus Permanen" : "Hapus (Soft Delete)",
            message: `Yakin ingin hapus ${method.name}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await paymentMethodService.deleteMethod(method.id);
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

    const handleRestoreMethod = async (method) => {
        const confirmed = await confirm({
            title: `Pulihkan Method`,
            message: `Pulihkan method ${method.name}?`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await paymentMethodService.restoreMethod(method.id);
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
        drawerOpen,
        selectedMethod,
        editMode,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDeleteMethod,
        handleRestoreMethod
    };
}
