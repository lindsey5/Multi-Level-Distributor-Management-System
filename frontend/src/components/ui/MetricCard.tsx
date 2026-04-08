import Card from "./Card";

interface MetricCardProps {
    title: string;
    content: string;
    icon: React.ReactNode;
}

export default function MetricCard({ title, content, icon }: MetricCardProps) {
    return (
        <Card className="p-5 flex gap-5 justify-between items-center border-l-5 border-l-black">
            <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-xs md:text-sm">{title}</span>
                <span className="text-md sm:text-lg font-bold">
                    {content}
                </span>
            </div>
            <span className="md:block hidden text-white bg-black p-2 md:p-3 rounded-full">
                {icon}
            </span>
        </Card>
    );
}

export function MetricCardSkeleton() {
    return (
        <Card className="p-5">
            <div className="flex flex-col gap-2 md:gap-5">
                <div className="w-full h-5 bg-gray-400 animate-pulse"></div>
                <div className="w-full h-5 bg-gray-400 animate-pulse"></div>
            </div>
        </Card>
    )
}