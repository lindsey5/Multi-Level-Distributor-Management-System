import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="inventory-mode-controls"]',
        content: "Choose whether you want to sell or return items.",
    },
    {
        target: '[data-tour="inventory-controls"]',
        content: "Use this to search and sort your inventory items.",
    },
    {
        target: '[data-tour="inventory-table"]',
        content: "This is your stock list with product details.",
    },
    {
        target: '[data-tour="inventory-selected-items"]',
        content: "View all items you selected for selling or returning here.",
    },
];

export default function InventoryTour() {
    const seen = localStorage.getItem("inventoryTourSeen");

    if(seen) return <></> 

    return (
        <Joyride
            continuous 
            run={true}
            options={{
                skipBeacon: true,
                showProgress: true
            }}
            steps={steps}
            onEvent={(data) => {
                if(data.status === 'finished') localStorage.setItem("inventoryTourSeen", "true");
            }}
        />
    )
}