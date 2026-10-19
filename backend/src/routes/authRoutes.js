import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', writeLimiter, registerValidation, validate, register);
router.post('/login', writeLimiter, loginValidation, validate, login);
router.get('/me', requireAuth, getMe);

export default router;
