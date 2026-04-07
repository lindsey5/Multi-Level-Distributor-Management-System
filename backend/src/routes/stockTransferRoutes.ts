import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getStockTransferLogs } from "../controllers/stockTransferController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getStockTransferLogs
)

const stockTransferRoutes = router;

export default stockTransferRoutes;