import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createBulkDistributorSale, getDistributorSales, getDistributorItemsSoldPerMonth, getDistributorItemsSoldThisMonth, getDistributorItemsSoldThisWeek, getDistributorItemsSoldThisYear, getDistributorItemsSoldToday, getDistributorMonthlySales, getDistributorSalesThisMonth, getDistributorSalesThisWeek, getDistributorSalesThisYear, getDistributorSalesToday } from "../controllers/distributorSaleController";

const router = Router();

router.get(
    '/',
    requireAuth,
    getDistributorSales
)

router.post(
    '/',
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
    requireAuth,
    getDistributorSalesToday
);

router.get(
    "/this-week",
    requireAuth,
    getDistributorSalesThisWeek
);

router.get(
    "/this-month",
    requireAuth,
    getDistributorSalesThisMonth
);

router.get(
    "/this-year",
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
    requireAuth,
    getDistributorItemsSoldToday
);

router.get(
    "/items/this-week",
    requireAuth,
    getDistributorItemsSoldThisWeek
);

router.get(
    "/items/this-month",
    requireAuth,
    getDistributorItemsSoldThisMonth
);

router.get(
    "/items/this-year",
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
    requireAuth,
    getDistributorMonthlySales
);

router.get(
    "/items-sold",
    requireAuth,
    getDistributorItemsSoldPerMonth
);

const distributorSaleRoutes = router;

export default distributorSaleRoutes;