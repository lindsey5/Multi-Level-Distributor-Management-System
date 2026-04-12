import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createReturnRequest } from "../controllers/returnRequestController";
const router = Router();

router.post(
    '/', 
    requireAuth,
    createReturnRequest
);
const returnRequestRoutes = router;

export default returnRequestRoutes;