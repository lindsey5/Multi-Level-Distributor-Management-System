import { useState } from "react";
import Chart, { ChartSkeleton } from "../ui/Chart";
import Dropdown from "../ui/Dropdown";
import { yearOptions } from "../../lib/contants/contants";
import { useGetCommissionsPerMonth } from "../../hooks/commissionLog/use-get-commissions-per-month.hook";

export default function CommissionsPerMonth () {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string | number>(currentYear);

    const { data, isFetching } = useGetCommissionsPerMonth(Number(year));

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
                formatToPeso
                labels={data?.commissionsPerMonth.map(sale => sale.month) || []}
                title="Commissions Per Month"
                values={data?.commissionsPerMonth.map(sale => sale.totalCommission) || []}
            />
        </div>
    )
}