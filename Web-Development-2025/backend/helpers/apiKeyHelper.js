require('dotenv').config();

const validateApiKey = (apiKey) => {

    if (apiKey !== process.env.API_KEY) {
        return false;
    }
    return true;
};

module.exports = validateApiKey;