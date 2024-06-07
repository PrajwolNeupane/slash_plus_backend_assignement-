import express from 'express';
import registerUser from '../controllers/auth/registerUser.js';
import userAuthorization from '../controllers/auth/userAuthorization.js';
import authenticateAccessToken from '../middleware/authenticateAccessToken.js';
import authenticateRefreshToken from '../middleware/authenticateRefreshToken.js';
import refreshToken from '../controllers/auth/refreshToken.js';
import loginUser from '../controllers/auth/loginUser.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/", authenticateAccessToken, userAuthorization)
router.get("/refresh", authenticateRefreshToken, refreshToken)

export default router;