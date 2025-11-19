import { Outlet } from "react-router-dom";
import Navbar from "../components/Auth/common/Navbar";
import Footer from "../components/Auth/common/Footer";

export default function AuthLayout() {
    return (
        <div className="min-h-screen m-0 p-0">
            <Navbar />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
