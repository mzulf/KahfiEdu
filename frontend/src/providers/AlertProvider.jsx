import CustomAlert from '../components/UI/CustomeAlert';
import AlertContext from '../contexts/AlertContext';

export function AlertProvider({ children }) {
    const alert = CustomAlert();

    return (
        <AlertContext.Provider value={alert}>
            {alert.AlertComponent()}
            {children}
        </AlertContext.Provider>
    );
}

export default AlertProvider;