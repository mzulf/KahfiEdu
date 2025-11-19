import KahfLogo from "./KahfLogo";

const AuthLayout = ({ children, sidebarText, greeting }) => {
    return (
        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div
                className="w-full md:w-[90%] relative flex items-center justify-center text-white text-center"
            >
                {/* Background image */}
                <img
                    src="/img/quran.jpeg"
                    alt="Islamic study materials"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                />

                {/* Overlay gradasi */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D2E]/90 via-[#0A3D2E]/70 to-transparent z-10" />

                {/* Sidebar content */}
                <div className="relative z-20 px-6 md:px-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{greeting}</h1>
                    <p className="text-lg md:text-xl">{sidebarText}</p>
                </div>
            </div>

            {/* Konten Login/Register */}
            <div className="w-full md:w-[45%] bg-white flex items-center justify-center">
                <div className="w-full max-w-md p-6 md:p-12 min-h-screen flex flex-col justify-center">
                    <div className="mb-10 flex justify-center">
                        <KahfLogo />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;