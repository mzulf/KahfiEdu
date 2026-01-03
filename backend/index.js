require("dotenv").config();
const express = require("express");
const http = require("http");
const { sequelize } = require("./models");
const corsHelper = require("./helpers/corsHelper");
const apiKeyMiddleware = require("./middlewares/apiKeyMiddleware");
const validateEnv = require("./helpers/validateEnv");
const {
    configureMiddleware,
    configureLogging,
    configureErrorHandling
} = require("./config/serverConfig");
const { initSocket } = require("./config/socketConfig");
const { redisClient } = require("./config/bullConfig");
const route = require("./routers/route");

// Validate environment variables
validateEnv();

const app = express();
const server = http.createServer(app);

/* ===============================
   🔥 WAJIB: BODY PARSER
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

/* ===============================
   MIDDLEWARE
================================ */
configureLogging(app);
app.use(corsHelper());

// 🔐 API KEY SETELAH BODY PARSER
app.use(apiKeyMiddleware);

// middleware lain
configureMiddleware(app, redisClient);

/* ===============================
   ROUTES
================================ */
const v = process.env.API_VERSION || "v1";
app.use(`/api/${v}/`, route);

/* ===============================
   ERROR HANDLING
================================ */
configureErrorHandling(app);

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected");

        await initSocket(server);
        console.log("📡 Socket.IO initialized");

        const redisStatus = await redisClient.ping();
        console.log(
            redisStatus === "PONG"
                ? "🟥 Redis connected"
                : "⚠️ Redis connection issue"
        );

        console.log(`🚀 Server running at http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Startup error:", error);
        process.exit(1);
    }
});

/* ===============================
   GRACEFUL SHUTDOWN
================================ */
process.on("SIGTERM", async () => {
    console.log("📝 Shutting down gracefully...");
    await server.close();
    await sequelize.close();
    await redisClient.quit();
    process.exit(0);
});
