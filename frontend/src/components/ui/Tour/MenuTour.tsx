import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="menu-dashboard"]',
        content: "Overview of your system performance and stats.",
    },
    {
        target: '[data-tour="menu-sales"]',
        content: "Track all your sales and earnings here.",
    },
    {
        target: '[data-tour="menu-inventory"]',
        content: "Manage your stock, products, and availability.",
    },
    {
        target: '[data-tour="menu-transfer-history"]',
        content: "View all product transfers and logs here.",
    },
    {
        target: '[data-tour="menu-return-history"]',
        content: "View the status of all your return requests including product details",
    },
    {
        target: '[data-tour="menu-profile"]',
        content: "Manage your profile, password, view wallet balance, withdraw commission and view commissions details",
    },
    {
        target: '[data-tour="menu-logout"]',
        content: "Logout safely from your account here.",
    },
];

const MenuTour = () => {
    const seen = localStorage.getItem("menuTourSeen");

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
                    localStorage.setItem("menuTourSeen", "true");
                }
            }}
        />
    )
};

export default MenuTour;