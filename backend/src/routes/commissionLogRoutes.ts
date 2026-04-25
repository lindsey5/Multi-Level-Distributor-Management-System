import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getCommissionLogs, getCommissionsPerMonth } from "../controllers/commissionLogController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getCommissionLogs
)

router.get(
    '/monthly',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getCommissionsPerMonth
)

const commissionLogRoutes = router;

export default commissionLogRoutes;