import { useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import type { Distributor } from "../../types/distributor.type";
import { type WithdrawalMethodFormData } from "../../schemas/distributorSchema";
import AddWithdrawalMethodForm from "../../components/withdrawalMethod/AddWithdrawalMethodForm";
import { promiseToast } from "../../utils/sileo";
import { useAddWithdrawalMethod } from "../../hooks/distributor/use-add-withdrawal-method.hook";
import WithdrawalMethodCard from "../../components/withdrawalMethod/WithdrawalMethodCard";

export default function WithdrawalMethods() {
    const auth = useSelector((store: RootState) => store.auth);
    const withdrawal_methods = auth.distributor?.withdrawal_methods || [];
    const [withdrawalMethods, setWithdrawalMethods] = useState<Distributor['withdrawal_methods']>([]);
    const [showForm, setShowForm] = useState(false);
    const addWithdrawalMethodMutation = useAddWithdrawalMethod();

    useEffect(() => {
        if(withdrawalMethods) setWithdrawalMethods(withdrawal_methods)
    }, [withdrawal_methods])

    const handleAddMethod = async (data : WithdrawalMethodFormData) => {
        if(!auth.distributor) return;

        await promiseToast(addWithdrawalMethodMutation.mutateAsync(data), "top-center", () => {});
        setShowForm(false)
    }

    return (
        <div className="flex-1 bg-white p-4 rounded-lg space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Withdrawal Methods</h2>

                {/* Add Button */}
                {!showForm && (
                    <Button 
                        className="flex gap-3 py-2 items-center"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={16} />
                        Add
                    </Button>
                )}
            </div>

            {showForm && (
                <AddWithdrawalMethodForm 
                    close={() => setShowForm(false)}
                    handleAddMethod={handleAddMethod}
                    disabled={addWithdrawalMethodMutation.isPending}
                />
            )}

            {/* List */}
            {withdrawalMethods.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No withdrawal methods yet.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {withdrawalMethods.map((method, index) => (
                        <WithdrawalMethodCard key={index} method={method} disabled={addWithdrawalMethodMutation.isPending}/>
                    ))}
                </div>
            )}
        </div>
    );
}