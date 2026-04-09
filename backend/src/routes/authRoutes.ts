import { Router } from "express";
import { changePassword, login, refreshAccessToken } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.post('/login', login);
router.post('/refreshToken', refreshAccessToken);
router.post('/change-password', requireAuth, changePassword);

const authRoutes = router;

export default authRoutes;