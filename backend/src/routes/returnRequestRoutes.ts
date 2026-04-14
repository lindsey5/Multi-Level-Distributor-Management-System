import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createReturnRequest, getReturnRequests } from "../controllers/returnRequestController";
const router = Router();

router.post(
    '/', 
    requireAuth,
    createReturnRequest
);

router.get(
    '/',
    requireAuth,
    getReturnRequests
)

const returnRequestRoutes = router;

export default returnRequestRoutes;