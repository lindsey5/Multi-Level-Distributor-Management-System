import CommissionsPerMonth from "../../components/dashboard.tsx/CommissionsPerMonth";
import DistributorItemsSoldPerMonth from "../../components/dashboard.tsx/DistributorItemSoldPerMonth";
import DistributorMonthlySales from "../../components/dashboard.tsx/DistributorMonthlySales";
import { DistributorItemsSoldThisMonth, DistributorItemsSoldThisWeek, DistributorItemsSoldThisYear, DistributorItemsSoldToday, DistributorSalesThisMonth, DistributorSalesThisWeek, DistributorSalesThisYear, DistributorSalesToday } from "../../components/dashboard.tsx/StatCards";

export default function Dashboard () {
    return (
        <div className="space-y-5 p-5">
            <div className="space-y-3 md:space-y-5">
                <div className="flex flex-col gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    <DistributorSalesToday  />
                    <DistributorSalesThisWeek />
                    <DistributorSalesThisMonth />
                    <DistributorSalesThisYear />
                    <DistributorItemsSoldToday />
                    <DistributorItemsSoldThisWeek />
                    <DistributorItemsSoldThisMonth />
                    <DistributorItemsSoldThisYear />
                </div>
                <CommissionsPerMonth />
                <div className="grid lg:grid-cols-2 gap-3">
                    <DistributorMonthlySales />
                    <DistributorItemsSoldPerMonth />
                </div>
            </div>
        </div>
    )
}