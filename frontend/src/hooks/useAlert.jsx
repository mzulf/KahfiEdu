import { useContext } from "react";
import AlertContext from "../contexts/AlertContext";

const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export default useAlert;