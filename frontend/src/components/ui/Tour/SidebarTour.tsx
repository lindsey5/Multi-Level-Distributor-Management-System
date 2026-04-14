import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="sidebar-dashboard"]',
        content: "Overview of your system performance and stats.",
    },
    {
        target: '[data-tour="sidebar-sales"]',
        content: "Track all your sales and earnings here.",
    },
    {
        target: '[data-tour="sidebar-inventory"]',
        content: "Manage your stock, products, and availability.",
    },
    {
        target: '[data-tour="sidebar-transfer-history"]',
        content: "View all product transfers and logs here.",
    },
    {
        target: '[data-tour="sidebar-return-history"]',
        content: "View the status of all your return requests",
    },
    {
        target: '[data-tour="sidebar-profile"]',
        content: "Manage your profile, password, view wallet balance, withdraw commission and view commission details",
    },
    {
        target: '[data-tour="sidebar-logout"]',
        content: "Logout safely from your account here.",
    },
];

const SidebarTour = () => {
    const seen = localStorage.getItem("sidebarTourSeen");

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
                if(data.status === 'finished') {
                    localStorage.setItem("sidebarTourSeen", "true");
                }
            }}
        />
    )
};

export default SidebarTour;