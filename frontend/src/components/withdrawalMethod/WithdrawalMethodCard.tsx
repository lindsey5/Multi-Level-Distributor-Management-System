import { Landmark, Smartphone, Wallet, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import type { WithdrawalMethod } from "../../types/distributor.type";
import { useDeleteWithdrawalMethod } from "../../hooks/distributor/use-delete-withdrawal-method";
import Button from "../ui/Button";
import { promiseToast } from "../../utils/sileo";

const getIcon = (type: string) => {
    if (type === "bank") return <Landmark size={18} />;
    if (type === "gcash") return <Smartphone size={18} />;

    return <Wallet size={18} />;
};

export default function WithdrawalMethodCard({ method, disabled }: { method: WithdrawalMethod, disabled: boolean }) {
    const deleteWithdrawalMethodMutation = useDeleteWithdrawalMethod();

    const handleDelete = () => {
        const isConfirmed = confirm("Are you sure you want to delete this withdrawal method? This action cannot be undone.");

        if(!isConfirmed) return;

        promiseToast(deleteWithdrawalMethodMutation.mutateAsync(method._id), "top-center", () => {});
    };

    return (
        <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                    {getIcon(method.type)}
                </div>

                <div>
                    <p className="font-medium capitalize">
                        {method.type}
                        {method.is_default && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Default
                            </span>
                        )}
                    </p>

                    <p className="text-sm text-gray-600">
                        {method.account_name}
                    </p>

                    <p className="text-sm text-gray-500">
                        {method.bank_name ? `${method.bank_name} • ` : ""}
                        {method.account_number}
                    </p>
                </div>
            </div>

            {/* DELETE BUTTON */}
            <Button
                onClick={handleDelete}
                disabled={deleteWithdrawalMethodMutation.isPending || disabled}
                className="p-2 text-red-500 bg-transparent border-none shadow-none"
                title="Delete"
            >
                <Trash2 size={18} />
            </Button>
        </Card>
    );
}