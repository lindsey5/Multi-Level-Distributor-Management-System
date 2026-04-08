import { useState } from "react";
import Chart, { ChartSkeleton } from "../ui/Chart";
import Dropdown from "../ui/Dropdown";
import { userGetDistributorItemsSoldPerMonth } from "../../hooks/sale/use-get-sales-analytics.hook";
import { yearOptions } from "../../lib/contants/contants";

export default function DistributorItemsSoldPerMonth () {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string | number>(currentYear);

    const { data, isFetching } = userGetDistributorItemsSoldPerMonth(Number(year));
    
    if(isFetching) return <ChartSkeleton />

    return (
        <div className="relative">
            <Dropdown
                className="w-18 md:w-25 absolute right-5 top-5"
                options={yearOptions}
                value={year}
                onChange={(value) => setYear(value)}
            />
            <Chart 
                labels={data?.itemsSoldPerMonth.map(sale => sale.month) || []}
                title="Items Sold Per Month"
                values={data?.itemsSoldPerMonth.map(sale => sale.totalQuantity) || []}
            />
        </div>
    )
}