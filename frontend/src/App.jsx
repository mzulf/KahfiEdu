import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routers/Index";
import { LoadingProvider } from "./providers/LoadingProvider";
import ConfirmDialogProvider from "./providers/ConfirmDialogProvider";

const App = () => {
  return (
    <ConfirmDialogProvider>
      <BrowserRouter>
        <LoadingProvider>
          <AppRouter />
        </LoadingProvider>
      </BrowserRouter>
    </ConfirmDialogProvider>
  );
};

export default App;
