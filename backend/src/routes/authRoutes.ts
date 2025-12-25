import { Router } from 'express';
import { body } from 'express-validator';
import { login, refreshToken, logout } from '../controllers/authController';

const router = Router();

// Login route
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Refresh token route
router.post('/refresh-token', refreshToken);

// Logout route
router.post('/logout', logout);

export default router;
