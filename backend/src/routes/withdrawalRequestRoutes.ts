import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import createRateLimiter from "../utils/rate-limit";
import { createWithdrawalRequest, updateWithdrawalRequestStatus } from "../controllers/withdrawalRequestController";
const router = Router();

router.post(
    '/',     
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    createWithdrawalRequest
);

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateWithdrawalRequestStatus
)

const withdrawaRequestRoutes = router;

export default withdrawaRequestRoutes;