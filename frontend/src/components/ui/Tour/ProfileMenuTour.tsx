import { Joyride } from "react-joyride";

const steps = [
    {
        target: '[data-tour="profile-menu"]',
        content:"Click this to access profile settings, wallet balance, and password.",
    },
];

export default function ProfileMenuTour() {
    const seen = localStorage.getItem("profileMenuTourSeen");

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
                if(data.status === 'finished') localStorage.setItem("profileMenuTourSeen", "true");
            }}
        />
    )
}