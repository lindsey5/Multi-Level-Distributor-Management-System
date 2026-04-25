import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createBulkDistributorSale, getDistributorSales, getDistributorItemsSoldPerMonth, getDistributorItemsSoldThisMonth, getDistributorItemsSoldThisWeek, getDistributorItemsSoldThisYear, getDistributorItemsSoldToday, getDistributorMonthlySales, getDistributorSalesThisMonth, getDistributorSalesThisWeek, getDistributorSalesThisYear, getDistributorSalesToday } from "../controllers/distributorSaleController";
import createRateLimiter from "../utils/rate-limit";

const router = Router();

router.get(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorSales
)

router.post(
    '/',
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    createBulkDistributorSale
)

/**
 * ============================================================
 * OVERALL SALES STATISTICS (ALL DISTRIBUTORS)
 * ============================================================
 * Used for dashboard stats/analytics (today, week, month, year)
 */
router.get(
    "/today",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorSalesToday
);

router.get(
    "/this-week",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorSalesThisWeek
);

router.get(
    "/this-month",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorSalesThisMonth
);

router.get(
    "/this-year",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorSalesThisYear
);

/**
 * ============================================================
 * OVERALL ITEMS SOLD STATISTICS (ALL DISTRIBUTORS)
 * ============================================================
 * Returns total quantity of items sold (today, week, month, year)
 */
router.get(
    "/items/today",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorItemsSoldToday
);

router.get(
    "/items/this-week",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorItemsSoldThisWeek
);

router.get(
    "/items/this-month",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorItemsSoldThisMonth
);

router.get(
    "/items/this-year",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorItemsSoldThisYear
);

/**
 * ============================================================
 * OVERALL MONTHLY REPORTS (ALL DISTRIBUTORS)
 * ============================================================
 * Returns monthly sales/items sold breakdown (Jan-Dec)
 */
router.get(
    "/monthly",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorMonthlySales
);

router.get(
    "/items-sold",
    createRateLimiter(5 * 60 * 1000, 100),
    requireAuth,
    getDistributorItemsSoldPerMonth
);

const distributorSaleRoutes = router;

export default distributorSaleRoutes;