import Card from "./Card";

interface MetricCardProps {
    title: string;
    content: string;
}

export default function MetricCard({ title, content }: MetricCardProps) {
    return (
        <Card className="p-3 md:p-5">
            <div className="flex flex-col gap-2">
                <span className="text-gold text-xs md:text-md font-bold">{title}</span>
                <h1 className="text-sm sm:text-lg lg:text-2xl">
                    {content}
                </h1>
            </div>
        </Card>
    );
}

export function MetricCardSkeleton() {
    return (
        <Card className="p-3 md:p-5">
            <div className="flex flex-col gap-5">
                <div className="w-full h-5 bg-gray-400 animate-pulse"></div>
                <div className="w-full h-5 bg-gray-400 animate-pulse"></div>
            </div>
        </Card>
    )
}