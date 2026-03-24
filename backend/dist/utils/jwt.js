"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate access token
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key';
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token
const generateRefreshToken = (payload) => {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
// Verify access token
const verifyAccessToken = (token) => {
    try {
        const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key';
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// Extract token from Authorization header
const extractTokenFromHeader = (header) => {
    if (!header)
        return null;
    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : null;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
