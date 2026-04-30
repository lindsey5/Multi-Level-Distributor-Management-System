import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import createRateLimiter from "../utils/rate-limit";
import { createWithdrawalRequest, getWithdrawalRequests, updateWithdrawalRequestStatus } from "../controllers/withdrawalRequestController";
const router = Router();

router.post(
    '/',     
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    createWithdrawalRequest
);

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getWithdrawalRequests
)

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateWithdrawalRequestStatus
)

const withdrawaRequestRoutes = router;

export default withdrawaRequestRoutes;