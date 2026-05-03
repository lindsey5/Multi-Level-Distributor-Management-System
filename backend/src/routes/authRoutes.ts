import { Router } from "express";
import { changePassword, forgotPassword, login, refreshAccessToken, resetPassword } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.post(
    '/login', 
    createRateLimiter(15 * 60 * 1000, 5),  
    login
);

router.post(
    '/refreshToken',     
    createRateLimiter(60 * 1000, 20),  
    refreshAccessToken
);

router.patch(
    '/change-password',     
    createRateLimiter(60 * 1000, 20), 
    requireAuth, 
    changePassword
);

router.post(
    '/forgot-password',
    createRateLimiter(15 * 60 * 1000, 5),  
    forgotPassword
)

router.post(
    '/reset-password',
    createRateLimiter(15 * 60 * 1000, 5),  
    resetPassword
)

const authRoutes = router;

export default authRoutes;