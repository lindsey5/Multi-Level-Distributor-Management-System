import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createStockOrder, getStockOrderById, getStockOrders, updateStockOrder } from "../controllers/stockOrderController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.post(
    '/', 
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    createStockOrder
);

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getStockOrders
)

router.get(
    '/:id',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getStockOrderById
)

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateStockOrder
)

const stockOrderRoutes = router;

export default stockOrderRoutes