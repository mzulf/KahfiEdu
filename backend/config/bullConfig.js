const Bull = require('bull');
const { createClient } = require('@redis/client');
const path = require('path');

// Redis configuration
const redisConfig = {
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    socket: {
        reconnectStrategy: (retries) => {
            return Math.min(retries * 50, 2000);
        }
    }
};

// Create Redis clients
const redisClient = createClient(redisConfig);
const redisSubscriber = createClient(redisConfig);

// Connect Redis clients
(async () => {
    try {
        await redisClient.connect();
        console.log('📌 Redis client connected');

        await redisSubscriber.connect();
        console.log('📌 Redis subscriber connected');
    } catch (error) {
        console.error('❌ Redis connection error:', error);
    }
})();

// Handle Redis errors
redisClient.on('error', (error) => console.error('❌ Redis client error:', error));
redisSubscriber.on('error', (error) => console.error('❌ Redis subscriber error:', error));

/**
 * Create a Bull queue with consistent configuration
 * @param {String} name - Queue name
 * @param {Object} options - Additional Bull options
 * @returns {Bull.Queue} - Configured Bull queue
 */
const createQueue = (name, options = {}) => {
    const defaultOptions = {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            retryStrategy: (times) => Math.min(times * 50, 2000)
        },
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            removeOnFail: 10 // Keep last 10 failed jobs
        }
    };

    const queue = new Bull(name, { ...defaultOptions, ...options });

    // Set up standard event handlers for monitoring
    queue.on('error', (error) => {
        console.error(`❌ Queue '${name}' error:`, error);
    });

    queue.on('completed', (job, result) => {
        console.log(`✅ Job #${job.id} in queue '${name}' completed`);
    });

    queue.on('failed', (job, error) => {
        console.error(`❌ Job #${job.id} in queue '${name}' failed:`, error);
    });

    queue.on('stalled', (jobId) => {
        console.warn(`⚠️ Job #${jobId} in queue '${name}' stalled`);
    });

    return queue;
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    await redisClient.quit();
    await redisSubscriber.quit();
    process.exit(0);
});

module.exports = {
    redisClient,
    redisSubscriber,
    createQueue
};