import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getCommissionLogs, getCommissionsPerMonth } from "../controllers/commissionLogController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getCommissionLogs
)

router.get(
    '/monthly',
    requireAuth,
    getCommissionsPerMonth
)

const commissionLogRoutes = router;

export default commissionLogRoutes;