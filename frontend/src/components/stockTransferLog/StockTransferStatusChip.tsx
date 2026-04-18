import Chip from "../ui/Chip";

const StockTransferStatusChip = ({ status }: { status: string }) => {
    switch (status) {
        case "pending":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Pending
                </Chip>
            );

        case "approved":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Approved
                </Chip>
            );

        case "processing":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Processing
                </Chip>
            );

        case "delivered":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Delivered
                </Chip>
            );

        case "received":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Received
                </Chip>
            );

        case "cancelled":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    Cancelled
                </Chip>
            );

        case "rejected":
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    Rejected
                </Chip>
            );

        default:
            return (
                <Chip className="flex items-center gap-2 capitalize text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {status}
                </Chip>
            );
    }
};

export default StockTransferStatusChip;