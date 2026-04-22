import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { cancelReturnRequest, createReturnRequest, getReturnRequests } from "../controllers/returnRequestController";
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

router.patch(
    '/cancel/:id',
    requireAuth,
    cancelReturnRequest
)

const returnRequestRoutes = router;

export default returnRequestRoutes;