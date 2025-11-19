import { useContext } from 'react';
import ConfirmDialogContext from '../contexts/ConfirmDialogContext';

export const useConfirm = () => {
    const confirm = useContext(ConfirmDialogContext);
    if (!confirm) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return confirm;
};