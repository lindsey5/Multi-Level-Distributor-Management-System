import { Router } from "express";
import { adminLogin, adminRefreshAccessToken } from "../controllers/authController";
const router = Router();

router.post('/admin/login', adminLogin);
router.post('/admin/refreshToken', adminRefreshAccessToken);

const authRoutes = router;

export default authRoutes;