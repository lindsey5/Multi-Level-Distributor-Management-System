import { Landmark, Smartphone, Wallet } from "lucide-react";

const WithdrawalMethodIcon = ({ type } : { type: string }) => {
    if (type === "bank") return <Landmark size={18} />;
    if (type === "gcash") return <Smartphone size={18} />;

    return <Wallet size={18} />;
};

export default WithdrawalMethodIcon;
