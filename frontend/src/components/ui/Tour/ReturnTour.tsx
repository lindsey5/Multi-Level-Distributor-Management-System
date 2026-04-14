import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="return-history-controls"]',
        content: "Use these controls to filter return history by date range.",
    },
    {
        target: '[data-tour="return-history-table"]',
        content: "This table shows all processed return requests including their status and details.",
    },
];

const ReturnTour = () => {
    const seen = localStorage.getItem("returnTourSeen");

    if(seen) return <></> 

    return (
        <Joyride
            continuous 
            run={true}
            options={{
                skipBeacon: true,
                showProgress: true,
                skipScroll: true,
            }}
            steps={steps}
            onEvent={(data) => {
                if(data.status === 'finished') {
                    localStorage.setItem("returnTourSeen", "true");
                }
            }}
        />
    )
};

export default ReturnTour;