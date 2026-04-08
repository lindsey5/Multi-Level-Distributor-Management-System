import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getCommissionLogs } from "../controllers/commissionLogController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getCommissionLogs
)

const commissionLogRoutes = router;

export default commissionLogRoutes;