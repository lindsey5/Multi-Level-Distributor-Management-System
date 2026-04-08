import { BarChartBig, Package } from "lucide-react";
import { useGetDistributorItemsSoldByPeriod, useGetDistributorSalesByPeriod } from "../../hooks/sale/use-get-sales-analytics.hook";
import { formatToPeso } from "../../utils/helpers";
import MetricCard, { MetricCardSkeleton } from "../ui/MetricCard";

export const DistributorSalesToday = () => {
    const { data, isFetching } = useGetDistributorSalesByPeriod("today");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales Today"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChartBig size={20} />}
        />
    )
}

export const DistributorSalesThisWeek = () => {
    const { data, isFetching } = useGetDistributorSalesByPeriod("this-week");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Week"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChartBig size={20} />}
        />
    )
}

export const DistributorSalesThisMonth = () => {
    const { data, isFetching } = useGetDistributorSalesByPeriod("this-month");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Month"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChartBig size={20} />}
        />
    )
}

export const DistributorSalesThisYear = () => {
    const { data, isFetching } = useGetDistributorSalesByPeriod("this-year");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Sales This Year"
            content={formatToPeso(data?.sales || 0)}
            icon={<BarChartBig size={20} />}
        />
    )
}

export const DistributorItemsSoldToday = () => {
    const { data, isFetching } = useGetDistributorItemsSoldByPeriod("today");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Items Sold Today"
            content={data?.totalQuantity.toString() || "0"}
            icon={<Package size={20} />}
        />
    )
}

export const DistributorItemsSoldThisWeek = () => {
    const { data, isFetching } = useGetDistributorItemsSoldByPeriod("this-week");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Items Sold This Week"
            content={data?.totalQuantity.toString() || "0"}
            icon={<Package size={20} />}
        />
    )
}

export const DistributorItemsSoldThisMonth = () => {
    const { data, isFetching } = useGetDistributorItemsSoldByPeriod("this-month");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
           title="Items Sold This Month"
            content={data?.totalQuantity.toString() || "0"}
            icon={<Package size={20} />}
        />
    )
}

export const DistributorItemsSoldThisYear = () => {
    const { data, isFetching } = useGetDistributorItemsSoldByPeriod("this-year");

    if(isFetching) return <MetricCardSkeleton />

    return (
        <MetricCard 
            title="Items Sold This Year"
            content={data?.totalQuantity.toString() || "0"}
            icon={<Package size={20} />}
        />
    )
}