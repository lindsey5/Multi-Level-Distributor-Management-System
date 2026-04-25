import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import createRateLimiter from "../utils/rate-limit";
import { createSponsoredItem, getSponsoredItems } from "../controllers/sponsoredItemController";
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

const sponsoredItemRoutes = router;

export default sponsoredItemRoutes;