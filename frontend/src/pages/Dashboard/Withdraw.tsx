import Button from "../../components/ui/Button";
import TextField from "../../components/ui/Textfield";


export default function Withdraw() {
    return (
        <div className="space-y-3 p-3">
            <TextField
                label="Withdraw Amount"
                placeholder="Enter amount to withdraw"
            />
            <div className="flex justify-end">
                <Button>
                    Request Withdraw
                </Button>
            </div>
        </div>
    );
}