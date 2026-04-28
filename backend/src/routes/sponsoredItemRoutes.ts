import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import createRateLimiter from "../utils/rate-limit";
import { createSponsoredItem, getSponsoredItemById, getSponsoredItems, updateSponsoredItemStatus } from "../controllers/sponsoredItemController";
const router = Router();

router.post(
    '/', 
    createRateLimiter(60 * 1000, 20),  
    requireAuth,
    createSponsoredItem
);

router.get(
    '/',     
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getSponsoredItems
);

router.get(
    '/:id',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getSponsoredItemById
)

router.patch(
    '/:id',
    createRateLimiter(60 * 1000, 20),
    requireAuth,
    updateSponsoredItemStatus
)

const sponsoredItemRoutes = router;

export default sponsoredItemRoutes;