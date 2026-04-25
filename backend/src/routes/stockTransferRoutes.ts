import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getStockTransferLogs, updateStockTransferStatus } from "../controllers/stockTransferController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getStockTransferLogs
)

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateStockTransferStatus
)

const stockTransferRoutes = router;

export default stockTransferRoutes;