import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorBalance, updateDistributor } from "../controllers/distributorController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.get(
    '/balance',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorBalance   
)

router.put(
    '/',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateDistributor
)

const distributorRoutes = router;

export default distributorRoutes;