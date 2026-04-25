import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { cancelReturnRequest, createReturnRequest, getReturnRequests } from "../controllers/returnRequestController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.post(
    '/', 
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    createReturnRequest
);

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getReturnRequests
)

router.patch(
    '/cancel/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    cancelReturnRequest
)

const returnRequestRoutes = router;

export default returnRequestRoutes;