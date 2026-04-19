import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorNotifications, readAllNotifications, readNotification } from "../controllers/distributorNotificationController";
const router = Router();

router.get(
    '/',
    requireAuth,
    getDistributorNotifications
)

router.patch(
    '/',
    requireAuth,
    readAllNotifications
)

router.patch(
    '/:id',
    requireAuth,
    readNotification
)

const distributorNotificationRoutes = router;

export default distributorNotificationRoutes;