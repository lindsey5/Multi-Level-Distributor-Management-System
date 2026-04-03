import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createDistributor, getDistributors } from "../controllers/distributorController";
const router = Router();

router.post(
    '/', 
    requireAuth("admin"),
    createDistributor
);

router.get(
    '/',
    requireAuth("admin"),
    getDistributors
)

const distributorRoutes = router;

export default distributorRoutes;