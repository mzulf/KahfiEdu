import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import AuthContext from "../contexts/authContext";
import { cookieService } from "../services/cookieService";

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    const socketRef = useRef(null);

    const initializeSocket = useCallback((authToken) => {
        if (!authToken || socketRef.current) return;

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
            auth: { token: cookieService.getAuthToken() },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
            path: '/socket.io',
            transports: ['websocket', 'polling']
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
            cookieService.setSocketId(newSocket.id);
            setSocket(newSocket);
            socketRef.current = newSocket;
        });

        newSocket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message);
            if (err.data) console.error("Error data:", err.data);
            cookieService.clearSocketId();
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            cookieService.clearSocketId();
        });
    }, []);

    useEffect(() => {
        const storedToken = cookieService.getAuthToken();
        const storedRole = cookieService.getUserRole();

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
            setIsAuthenticated(true);
            initializeSocket(storedToken);
        } else {
            setIsAuthenticated(false);
        }

        setLoading(false);
    }, [initializeSocket]);

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                console.log("Disconnecting socket");
                socketRef.current.disconnect();
            }
        };
    }, []);

    const login = (authToken, roleUser) => {
        setToken(authToken);
        setRole(roleUser);
        setIsAuthenticated(true);
        cookieService.setAuthCookies(authToken, roleUser);
        initializeSocket(authToken);
    };

    const logout = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }

        setToken('');
        setRole('');
        setIsAuthenticated(false);
        cookieService.clearAuthCookies();
        cookieService.clearSocketId();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, role, socket, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
