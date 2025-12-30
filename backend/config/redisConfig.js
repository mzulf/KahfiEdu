const { createClient } = require("@redis/client");
const RedisStore = require("connect-redis").default;

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().catch(console.error);

// Initialize store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "kahfi:"
});

module.exports = {
    redisClient,
    redisStore
}