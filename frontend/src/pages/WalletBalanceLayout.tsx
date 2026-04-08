import Card from "../components/ui/Card";
import { cn, formatToPeso } from "../utils/helpers";
import { NavLink, Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useGetBalance } from "../hooks/distributor/use-get-balance";

export default function WalletBalanceLayout () {
    const { data, isFetching } = useGetBalance();

    return (
        <div className="flex-1 p-3">
            <div className="flex items-center gap-5 p-5 bg-black rounded-xl">
                <Wallet className="text-white" size={30}/>
                <div className="space-y-2 text-white">
                    <h1 className="font-semibold">Wallet Balance</h1>
                    {isFetching ? <div className="w-50 h-6 bg-gray-700" /> :
                    <span className="text-2xl font-bold">{formatToPeso(data?.wallet_balance || 0)}</span>}
                </div>
            </div>
            <div className="flex items-start justify-center my-3">
                <NavLink
                    to="/distributor/profile/wallet-balance/withdraw"
                    className={({ isActive }) => cn( "font-semibold text-sm flex flex-col items-center w-24 pb-2", isActive && "border-b-2 border-black")}
                >
                    Withdraw
                </NavLink>
                <NavLink
                    to="/distributor/profile/wallet-balance/commissions"
                    className={({ isActive }) => cn( "font-semibold text-sm flex flex-col items-center w-24 pb-2", isActive && "border-b-2 border-black")}
                >
                    Commissions
                </NavLink>
            </div>
            <Outlet />
        </div>   
    )
}