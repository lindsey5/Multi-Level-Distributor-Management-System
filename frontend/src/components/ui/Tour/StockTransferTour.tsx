import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="stock-transfer-controls"]',
        content:
        "Use these controls to search, and filter your stock transfer history",
    },
    {
        target: '[data-tour="stock-transfer-table"]',
        content:
        "This table displays your complete stock transfer history.",
    },
];

export default function StockTransferTour() {
    const seen = localStorage.getItem("stockTransferTourSeen");

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
                if(data.status === 'finished') localStorage.setItem("stockTransferTourSeen", "true");
            }}
        />
    )
}