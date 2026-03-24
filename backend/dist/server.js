"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const websocketServer_1 = __importDefault(require("./websocket/websocketServer"));
const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || 'localhost';
const server = app_1.default.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    console.log(`📝 API Documentation: http://${HOST}:${PORT}/api`);
    console.log(`💚 Health Check: http://${HOST}:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Initialize WebSocket server
const wsServer = new websocketServer_1.default(server);
console.log(`📡 WebSocket server initialized`);
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📋 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('🛑 Server closed');
        process.exit(0);
    });
});
exports.default = server;
