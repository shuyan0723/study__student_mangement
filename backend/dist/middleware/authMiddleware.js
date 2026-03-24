"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
// Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from header
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: 'Access token not provided'
            });
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: 'Invalid or expired access token'
            });
            return;
        }
        // Find user
        const user = await User_1.default.findByPk(decoded.userId, {
            attributes: ['id', 'username', 'email', 'avatar_url', 'role', 'status']
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: 'User not found'
            });
            return;
        }
        if (user.status !== 'active') {
            res.status(403).json({
                success: false,
                error: 'ACCOUNT_INACTIVE',
                message: 'Account is inactive or locked'
            });
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication failed due to server error'
        });
    }
};
exports.authMiddleware = authMiddleware;
// Role-based authorization middleware
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: 'User not authenticated'
            });
            return;
        }
        if (!roles.includes(user.role)) {
            res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Insufficient permissions'
            });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
