import Chip from "../ui/Chip";

const ReturnRequestStatusChip = ({ status } : { status: string }) => {
    switch (status) {
        case "pending":
        return (
            <Chip className="flex items-center gap-2 capitalize text-sm bg-black text-white">
                <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
                Pending
            </Chip>
        );

        case "rejected":
        return (
            <Chip className="flex items-center gap-2 capitalize text-sm bg-black text-white">
                 <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Rejected
            </Chip>
        );

        case "expired":
        return (
            <Chip className="flex items-center gap-2 capitalize text-sm bg-black text-white">
                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                Expired
            </Chip>
        );

        case "insufficient stock":
        return (
            <Chip className="flex items-center gap-2 capitalize text-sm bg-black text-white">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                Insufficient Stock
            </Chip>
        );

        default:
        return (
            <Chip className="flex items-center gap-2 capitalize text-sm bg-black text-white">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                {status}
            </Chip>
        );
    }
};

export default ReturnRequestStatusChip;