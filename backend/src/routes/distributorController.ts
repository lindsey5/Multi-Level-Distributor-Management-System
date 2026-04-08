import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getDistributorBalance } from "../controllers/distributorController";
const router = Router();

router.get(
    '/balance',
    requireAuth,
    getDistributorBalance   
)

const distributorRoutes = router;

export default distributorRoutes;