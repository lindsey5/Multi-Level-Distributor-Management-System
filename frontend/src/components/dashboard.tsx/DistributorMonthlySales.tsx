import { useState } from "react";
import { useGetDistributorMonthlySales } from "../../hooks/sale/use-get-sales-analytics.hook";
import Chart, { ChartSkeleton } from "../ui/Chart";
import { yearOptions } from "../../lib/contants/contants";
import Dropdown from "../ui/Dropdown";

export default function DistributorMonthlySales () {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string | number>(currentYear);
    const { data, isFetching } = useGetDistributorMonthlySales(Number(year));

    if(isFetching) return <ChartSkeleton />

    return (
        <div className="relative">
            <Dropdown
                className="w-18 md:w-25 absolute right-5 top-5"
                options={yearOptions}
                value={year}
                onChange={setYear}
            />
            <Chart 
                labels={data?.monthlySales.map(sale => sale.month) || []}
                title="Monthly Sales"
                values={data?.monthlySales.map(sale => sale.totalSales) || []}
            />
        </div>
    )
}