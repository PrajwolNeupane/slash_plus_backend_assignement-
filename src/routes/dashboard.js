import express from 'express';
import authenticateAccessToken from '../middleware/authenticateAccessToken.js';
import getDashboard from '../controllers/dashboard/getDashboard.js';

const router = express.Router();

router.get("/", authenticateAccessToken, getDashboard)

export default router;