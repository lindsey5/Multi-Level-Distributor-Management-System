import type React from "react";
import Dropdown from "../ui/Dropdown";
import type { SortOption } from "../../types/types.type";
import TextField from "../ui/Textfield";
import { Search } from "lucide-react";
import { getKeyByValue } from "../../utils/helpers";

const options: Record<string, SortOption> = {
    'Newest' : { sortBy: 'createdAt', order: 'desc' },
    'Oldest' : { sortBy: 'createdAt', order: 'asc' },
    'A-Z': { sortBy: 'variant_name', order: 'asc' },
    'Z-A': { sortBy: 'variant_name', order: 'desc' },
    'Quantity (ASC)' : { sortBy: 'quantity', order: 'asc' },
    'Quantity (DESC)' : { sortBy: 'quantity', order: 'desc' },
};

interface InventoryControlsProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setSorting: React.Dispatch<React.SetStateAction<SortOption>>
    sorting: SortOption
}

export default function InventoryControls ({
    setSearch,
    setSorting,
    sorting,
} : InventoryControlsProps) {

    return (
        <div className="flex items-end justify-between gap-5" data-tour="inventory-controls">
            <div className="flex-1 flex-0 md:max-w-100">
                <TextField 
                    className="md:max-w-84"
                    icon={<Search className="text-gray-400"/>}
                    placeholder="Search by product name, variant name, sku..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Dropdown 
                className="max-w-60 w-[40%]"
                label="Sort"
                options={Object.keys(options).map(opt => ({ label: opt, value: opt }))}
                onChange={(value) => setSorting(options[value]) }
                value={getKeyByValue(options, sorting) || ""}
            />
        </div>
    )
}