'use strict';
require('dotenv').config();
// require("../config/sequelizeContext");

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

// Initialize database connection
let sequelize;
if (env === 'production') {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required in production');
  }

  sequelize = new Sequelize(dbUrl, {
    ...config,
    dialect: 'mysql', // Explicitly set dialect
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Override config with environment variables if provided
  config.username = process.env.DB_USER || config.username;
  config.password = process.env.DB_PASSWORD || config.password;
  config.database = process.env.DB_NAME || config.database;
  config.host = process.env.DB_HOST || config.host;
  config.dialect = process.env.DB_DIALECT || config.dialect;

  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      ...config,
      logging: false
    }
  );
}

const db = {};

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });




// Define models first
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const PaperTrail = require('sequelize-paper-trail').init(sequelize, {
  debug: false,
  log: null,
  exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'created_at', 'updated_at', 'deleted_at', 'revision'],
  revisionAttribute: 'revision',
  revisionModel: 'Revision',
  revisionChangeModel: 'RevisionChange',
  enableRevisionChangeModel: true,
  UUID: true,
  underscored: false,
  underscoredAttributes: false,
  defaultAttributes: {
    documentId: 'documentId',
    revisionId: 'revisionId'
  },
  userModel: "User",
  userModelAttribute: 'userId',
  enableCompression: false,
  enableMigration: true,
  enableStrictDiff: true,
  continuationKey: 'userId',
  metaDataFields: null,
  metaDataContinuationKey: 'metaData',
  mysql: true
});

PaperTrail.defineModels(db);

Object.keys(db).forEach(modelName => {
  if (modelName !== 'Revision' && modelName !== 'RevisionChange' && modelName !== 'Otp') {
    db[modelName].hasPaperTrail();
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
