import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createBulkDistributorSale, getDistributorSales } from "../controllers/distributorSaleController";

const router = Router();

router.get(
    '/',
    requireAuth,
    getDistributorSales
)

router.post(
    '/',
    requireAuth,
    createBulkDistributorSale
)

const distributorSaleRoutes = router;

export default distributorSaleRoutes;