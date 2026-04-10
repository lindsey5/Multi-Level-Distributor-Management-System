import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="sales-controls"]',
        content: "Use this to search and sort your sales.",
    },
    {
        target: '[data-tour="sales-table"]',
        content: "This table shows all your sales history including products your sold, quantities, date and sales",
    },
];

export default function SalesTour() {
    const seen = localStorage.getItem("salesTourSeen");

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
                if(data.status === 'finished') localStorage.setItem("salesTourSeen", "true");
            }}
        />
    )
}