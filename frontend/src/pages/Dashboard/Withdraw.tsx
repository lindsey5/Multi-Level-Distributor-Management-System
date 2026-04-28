import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/Textfield";
import type { RootState } from "../../lib/features/store";
import { useState } from "react";
import type { WithdrawalRequestMethod } from "../../types/withdrawalRequest.type";
import Card from "../../components/ui/Card";
import WithdrawalMethodIcon from "../../components/ui/WithdrawalMethodIcon";
import { cn, formatToPeso } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useCreateWithdrawalRequest } from "../../hooks/withdrawalRequest/use-create-withdrawal-request.hook";
import { errorToast, promiseToast } from "../../utils/sileo";

export default function Withdraw() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<WithdrawalRequestMethod | null>(null);

    const auth = useSelector((store: RootState) => store.auth);
    const withdrawal_methods = auth.distributor?.withdrawal_methods || [];
    const wallet_balance = auth.distributor?.wallet_balance || 0;

    const createWithdrawalRequestMutation = useCreateWithdrawalRequest();

    const handleSelectMethod = (method: WithdrawalRequestMethod) => {
        setSelectedMethod({
            type: method.type,
            account_name: method.account_name,
            account_number: method.account_number,
            bank_name: method.bank_name,
        });
    };

    const handleRequestWithdraw = async () => {
        if (!selectedMethod) return errorToast("Error", "Please select withdrawal method");

        const confirmWithdraw = window.confirm(`Confirm withdrawal request of ${formatToPeso(amount)}?`);

        if (!confirmWithdraw) return;

        const payload = {
            amount,
            withdrawal_method: selectedMethod,
        };
        await promiseToast(createWithdrawalRequestMutation.mutateAsync(payload))
       
    };

    return (
        <Card className="space-y-3">
            <h2 className="text-lg font-semibold">Withdraw Balance</h2>
            <div className="my-5 w-full h-[1px] bg-gray-300" />
            <TextField
                label="Withdraw Amount"
                placeholder="Enter amount"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                onKeyDown={(e) => {
                    if (e.key === "." || e.key === "," || e.key === "e" || e.key === "-") {
                    e.preventDefault();
                    }
                }}
            />

            <div className="space-y-3 pb-5 border-b border-gray-300">
                <p className="font-medium text-sm text-gray-700">
                    Select Withdrawal Method
                </p>

                <div className="space-y-2">
                    <label className={cn(
                        "flex items-center justify-between p-5 border border-gray-300 rounded-md cursor-pointer",
                        selectedMethod?.type === 'cash' && 'border-2 border-black bg-gray-100'
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                                <WithdrawalMethodIcon type="Cash" />
                            </div>

                            <p className="font-medium capitalize">
                                Cash
                            </p>
                        </div>
                        <input
                            type="radio"
                            name="withdrawal_method"
                            checked={selectedMethod?.type === 'cash'}
                            onChange={() => handleSelectMethod({
                                type: 'cash'
                            })}
                            className="mt-1 accent-black"
                        />
                    </label>
                     {withdrawal_methods.map((method, index) => {
                        const isSelected =
                            selectedMethod?.type === method.type &&
                            selectedMethod?.account_number === method.account_number;

                        return (
                            <label 
                                key={index}
                                className={cn(
                                    "flex items-center justify-between p-5 border border-gray-300 rounded-md cursor-pointer",
                                    isSelected && 'border-2 border-black bg-gray-100'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <WithdrawalMethodIcon type={method.type} />
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
                                <input
                                    type="radio"
                                    name="withdrawal_method"
                                    checked={isSelected}
                                    onChange={() => handleSelectMethod(method)}
                                    className="accent-black"
                                />
                            </label>
                        )
                     })}
                </div>
                <div className="w-full flex justify-center">
                    <Button
                        onClick={() => navigate('/distributor/profile/withdrawal-methods')}
                        className="text-sm py-2 bg-white text-black border-gray-400 shadow-none"
                    >Add Withdrawal Method</Button>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleRequestWithdraw}
                    disabled={!amount || !selectedMethod || wallet_balance < amount || createWithdrawalRequestMutation.isPending}
                    className="bg-black text-white disabled:border-gray-400 hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-600"
                >
                    Request Withdraw
                </Button>
            </div>
        </Card>
    );
}