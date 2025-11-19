const socketIO = require('socket.io');
const { createClient } = require('@redis/client');
const jwt = require("jsonwebtoken");
const clientSocketMap = new Map();

// Map untuk menyimpan clientId <-> socket.id

let io;

const initSocket = async (server) => {
    const redisConfig = {
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
        password: process.env.REDIS_PASSWORD,
        socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
        }
    };

    const socketConfig = {
        cors: {
            origin: process.env.CORS_ORIGIN || process.env.APP_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Authorization", "x-api-key"]
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        path: '/socket.io'
    };

    // Optional: Redis adapter for multi-server scale
    if (process.env.USE_REDIS_ADAPTER === 'true') {
        try {
            const { createAdapter } = require('@socket.io/redis-adapter');
            const pubClient = createClient(redisConfig);
            const subClient = createClient(redisConfig);

            await Promise.all([pubClient.connect(), subClient.connect()]);

            socketConfig.adapter = createAdapter(pubClient, subClient);

            pubClient.on('error', (err) => console.error('❌ Redis pub error:', err));
            subClient.on('error', (err) => console.error('❌ Redis sub error:', err));

            process.on('SIGTERM', async () => {
                await Promise.all([pubClient.quit(), subClient.quit()]);
                process.exit(0);
            });

            console.log('📡 Redis adapter connected');
        } catch (err) {
            console.error('❌ Redis adapter init failed:', err);
        }
    }

    io = socketIO(server, socketConfig);


    io.on('connection', (socket) => {
        let clientId = null;  // deklarasi di luar try

        const { token } = socket.handshake.auth;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            clientId = decoded.userId || decoded.id;

            if (clientId) {
                clientSocketMap.set(clientId, socket.id);
                console.log(`🔌 Socket connected for user ${clientId}: ${socket.id}`);
            } else {
                console.warn("❌ Token valid but no user ID in payload");
            }
        } catch (err) {
            console.error("❌ Invalid JWT token:", err.message);
            socket.disconnect(true);
        }

        socket.on('disconnect', (reason) => {
            if (clientId) {
                clientSocketMap.delete(clientId);
            }
            console.log(`📴 Socket disconnected: ${socket.id} (${reason})`);
        });

        socket.on('error', (err) => {
            console.error(`❌ Socket error on ${socket.id}:`, err);
        });
    });

    console.log('✅ Socket.IO initialized');
    return io;
};

// Helper: Emit to client by clientId
const emitToClient = (clientId, event, data) => {
    if (!io) return;
    const socketId = clientSocketMap.get(clientId);
    if (socketId) {
        io.to(socketId).emit(event, data);
    } else {
        console.warn(`⚠️ No active socket for clientId: ${clientId}`);
    }
};

const getIO = () => {
    if (!io) throw new Error("Socket.IO not initialized!");
    return io;
};

module.exports = {
    initSocket,
    getIO,
    emitToClient
};
