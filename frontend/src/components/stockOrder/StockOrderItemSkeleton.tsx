
export default function StockOrderItemSkeleton ({ length = 8 } : { length?: number }) { 
    return (
        Array.from({ length }).map((_, i) => (
            <div
                key={i}
                className="animate-pulse flex flex-col items-center space-y-3 border border-gray-200 rounded-lg p-4"
            >
                <div className="w-full h-36 bg-gray-300 rounded" />

                <div className="w-3/4 h-4 bg-gray-300 rounded" />

                <div className="w-1/2 h-5 bg-gray-300 rounded" />

                <div className="w-full h-4 bg-gray-300 rounded" />

                <div className="w-full h-10 bg-gray-300 rounded" />
            </div>
        ))
    )
}