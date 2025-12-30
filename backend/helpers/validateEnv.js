const requiredEnvVars = [
    'JWT_SECRET',
    'SESSION_SECRET',
    'API_KEY',
    'DB_HOST',
    'DB_NAME',
    'DB_USER'
];

const validateEnv = () => {
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        process.exit(1);
    }
};

module.exports = validateEnv;