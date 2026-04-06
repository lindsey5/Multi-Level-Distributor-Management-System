import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createBulkDistributorSale } from "../controllers/distributorSaleController";

const router = Router();

router.post(
    '/',
    requireAuth,
    createBulkDistributorSale
)

const distributorSaleRoutes = router;

export default distributorSaleRoutes;