import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getStockTransferLogs, updateStockTransferStatus } from "../controllers/stockTransferController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getStockTransferLogs
)

router.patch(
    '/:id',
    requireAuth,
    updateStockTransferStatus
)

const stockTransferRoutes = router;

export default stockTransferRoutes;