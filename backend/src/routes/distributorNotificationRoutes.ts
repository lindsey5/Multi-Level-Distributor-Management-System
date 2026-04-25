import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorNotifications, readAllNotifications, readNotification } from "../controllers/distributorNotificationController";
import createRateLimiter from "../utils/rate-limit";
const router = Router();

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorNotifications
)

router.patch(
    '/',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    readAllNotifications
)

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    readNotification
)

const distributorNotificationRoutes = router;

export default distributorNotificationRoutes;