import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorStocks } from "../controllers/distributorStockController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getDistributorStocks
)

const distributorStockRoutes = router;

export default distributorStockRoutes;