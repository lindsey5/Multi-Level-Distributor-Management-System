import { useEffect, useState } from "react"
import { useGetCommissionLogs } from "../../hooks/commissionLog/use-get-commission-logs"
import { formatDate, formatToPeso } from "../../utils/helpers";
import Card from "../../components/ui/Card";
import { Wallet } from "lucide-react";
import type { CommissionLog } from "../../types/commissionLog.type";
import Button from "../../components/ui/Button";

export default function CommissionLogs () {
    const [page, setPage] = useState(1);
    const [commissionLogs, setCommissionLogs] = useState<CommissionLog[]>([]);
    const { data, isFetching } = useGetCommissionLogs({
        page,
        limit: 5
    })

    useEffect(() => {
        if(data?.commissionLogs){
            setCommissionLogs(prev => 
                page === 1 ? data.commissionLogs : [...prev, ...data.commissionLogs]
            )
        }
    }, [data])

    return (
        <div className="px-3">
             <h1 className="font-bold text-lg mb-3">Commission Logs</h1>
             <div className="flex flex-col space-y-2">
                {isFetching && !commissionLogs.length ? (
                    Array.from({ length: 5}).map((_, i) => (
                        <Card key={i} className="py-10 flex justify-between gap-5 md:gap-10">
                            <div className="flex-1 bg-gray-400 h-5 animate-pulse"></div>
                            <div className="w-30 bg-gray-400 h-5 animate-pulse"></div>
                        </Card>
                    ))
                ) : commissionLogs.map(log => (
                    <Card key={log._id} className="flex items-center justify-between py-10">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Wallet />
                            <p className="text-xs md:text-sm text-gray-400">Date: {formatDate(log.createdAt)}</p>
                        </div>
                        <p className="min-w-20 font-bold text-sm md:text-lg text-green-600">
                            + {formatToPeso(log.commission_amount)}
                        </p>
                    </Card>
                ))}
                {!(page >= (data?.pagination.totalPages || 1)) && (
                    <div className="flex justify-center mt-2">
                        <Button
                            disabled={isFetching}
                            className="disabled:cursor-not-allowed cursor-pointer bg-black text-white text-sm py-2 rounded-md"
                            onClick={() => setPage(prev => prev + 1)}
                        >{isFetching ? 'Loading...' : 'See more'}</Button>
                    </div>
                )}
             </div>
        </div>
    )
}