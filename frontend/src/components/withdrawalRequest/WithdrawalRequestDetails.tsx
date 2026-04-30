import { X } from "lucide-react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { WithdrawalRequest } from "../../types/withdrawalRequest.type";
import { formatDate, formatToPeso } from '../../utils/helpers';
import DeliveryStatusChip from "../ui/DeliveryChip";
import Button from "../ui/Button";

interface WithdrawalRequestDetailsProps {
    withdrawalRequest: WithdrawalRequest | null;
    close: () => void;
}

export default function WithdrawalRequestDetails({ withdrawalRequest, close } : WithdrawalRequestDetailsProps) {

    return (
        <Modal
            open={withdrawalRequest !== null}
            onClose={close}
        >
            <Card className="max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-md md:text-lg font-bold">Withdrawal Request Details</h2>
                    <button
                        onClick={close}
                        className="cursor-pointer hover:opacity-50"
                    >
                        <X />
                    </button>
                </div>

                {/* Status + Date */}
                <div className="flex flex-col items-start gap-3 mb-5 pb-5 border-b border-gray-400">
                    <div className="w-full flex gap-3 flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-xs">Status:</p>
                            <DeliveryStatusChip status={withdrawalRequest?.status || ""} />
                        </div>
                    </div>
                    <div className="text-xs">
                        Requested on:{" "}
                        <span className="font-medium">
                            {formatDate(withdrawalRequest?.createdAt || "")}
                        </span>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="text-xs uppercase tracking-widest mb-3">
                        Requested By
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-gray-400">Distributor Name</p>
                            <p className="font-medium">
                                {withdrawalRequest?.distributor.distributor_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">Distributor ID</p>
                            <p className="font-medium">
                                {withdrawalRequest?.distributor.distributor_id}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="font-medium">{withdrawalRequest?.distributor.email}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 mb-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-xs text-gray-400">Withdrawal Method</p>
                        <p className="font-medium capitalize">
                            {withdrawalRequest?.withdrawal_method.type}
                        </p>
                    </div>

                    {withdrawalRequest?.withdrawal_method.account_name && (
                        <div>
                            <p className="text-xs text-gray-400">Account Name</p>
                            <p className="font-medium capitalize">
                                {withdrawalRequest?.withdrawal_method.account_name}
                            </p>
                        </div>
                    )}

                    {withdrawalRequest?.withdrawal_method.account_number && (
                        <div>
                            <p className="text-xs text-gray-400">Account Number</p>
                            <p className="font-medium capitalize">
                                {withdrawalRequest?.withdrawal_method.account_number}
                            </p>
                        </div>
                    )}

                    {withdrawalRequest?.withdrawal_method.bank_name && (
                        <div>
                            <p className="text-xs text-gray-400">Bank Name</p>
                            <p className="font-medium capitalize">
                                {withdrawalRequest?.withdrawal_method.bank_name}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-gray-400">Amount</p>
                        <p className="font-medium capitalize font-semibold">
                            {formatToPeso(withdrawalRequest?.amount || 0)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-5">
                    <Button
                        onClick={close}
                    >Close</Button>
                </div>
            </Card>
        </Modal>
    )
}