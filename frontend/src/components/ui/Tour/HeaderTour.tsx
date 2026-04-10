import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="header-notification"]',
        content: "View your latest notifications, alerts, and system updates here.",
    },
    {
        target: '[data-tour="header-menu"]',
        content: "Open this menu to dashboard, sales, inventory, transfer history, profile and logout.",
    },
];

const HeaderTour = () => {
    const seen = localStorage.getItem("headerTourSeen");

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
                    localStorage.setItem("headerTourSeen", "true");
                }
            }}
        />
    )
};

export default HeaderTour;