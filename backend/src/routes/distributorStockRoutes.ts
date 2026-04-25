import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorStocks } from "../controllers/distributorStockController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorStocks
)

const distributorStockRoutes = router;

export default distributorStockRoutes;