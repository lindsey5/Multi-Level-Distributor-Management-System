import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getStockTransferLogs, markStockTransferAsReceived } from "../controllers/stockTransferController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getStockTransferLogs
)

router.patch(
    '/:id/received',
    requireAuth,
    markStockTransferAsReceived
)

const stockTransferRoutes = router;

export default stockTransferRoutes;