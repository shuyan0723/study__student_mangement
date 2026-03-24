"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.testConnection = exports.sequelize = void 0;
require("dotenv/config");
// 导入所有模型以确保它们被注册到 Sequelize
require("./models");
// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};
exports.testConnection = testConnection;
// Synchronize database models
const syncDatabase = async () => {
    try {
        await sequelize.sync({
            alter: process.env.NODE_ENV === 'development' ? true : false,
            force: false
        });
        console.log('✅ Database models synchronized successfully.');
    }
    catch (error) {
        console.error('❌ Failed to synchronize database models:', error);
        process.exit(1);
    }
};
exports.syncDatabase = syncDatabase;
exports.default = sequelize;
