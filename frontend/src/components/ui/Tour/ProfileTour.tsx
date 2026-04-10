import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="profile-my-profile"]',
        content:
        "View and manage your personal profile information such as name, and email",
    },
    {
        target: '[data-tour="profile-wallet-balance"]',
        content:
        "Check your current wallet balance, withdraw and view commission details",
    },
    {
        target: '[data-tour="profile-change-password"]',
        content:
        "Click here to securely update your account password for better security.",
    },
];

export default function ProfileTour() {
    const seen = localStorage.getItem("profileTourSeen");

    if(seen) return <></> 

    return (
        <Joyride
            run={true}
            continuous
            options={{
                skipBeacon: true,
                showProgress: true
            }}
            steps={steps}
            onEvent={(data) => {
                if(data.index !== 0 && data.status === 'finished') localStorage.setItem("profileTourSeen", "true");
            }}
        />
    )
}