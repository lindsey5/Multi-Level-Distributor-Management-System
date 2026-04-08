import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorBalance, updateDistributor } from "../controllers/distributorController";
const router = Router();

router.get(
    '/balance',
    requireAuth,
    getDistributorBalance   
)

router.put(
    '/',
    requireAuth,
    updateDistributor
)

const distributorRoutes = router;

export default distributorRoutes;