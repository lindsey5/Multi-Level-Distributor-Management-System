import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createStockOrder, getStockOrderById, getStockOrders, updateStockOrder } from "../controllers/stockOrderController";
const router = Router();

router.post(
    '/', 
    requireAuth,
    createStockOrder
);

router.get(
    '/',
    requireAuth,
    getStockOrders
)

router.get(
    '/:id',
    requireAuth,
    getStockOrderById
)

router.patch(
    '/:id',
    requireAuth,
    updateStockOrder
)

const stockOrderRoutes = router;

export default stockOrderRoutes