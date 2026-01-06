// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routers/Index";
import AnalyticsTracker from "./AnalyticsTracker";
import { LoadingProvider } from "./providers/LoadingProvider";
import ConfirmDialogProvider from "./providers/ConfirmDialogProvider";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <ConfirmDialogProvider>
      <BrowserRouter>
        <LoadingProvider>
          <AnalyticsTracker />
          <AppRouter />
        </LoadingProvider>
      </BrowserRouter>
    </ConfirmDialogProvider>
  );
};

export default App;
