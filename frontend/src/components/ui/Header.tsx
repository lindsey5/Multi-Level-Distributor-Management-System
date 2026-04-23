import DistributorHeaderMenu from "../distributor/DistributorHeaderMenu";

export default function Header ({ title, description } : { title: string, description: string}) {
    return (
        <header className="flex gap-5 justify-between items-center bg-white z-20 p-3 md:p-5 md:border-b border-[var(--border-panel)] md:shadow-panel md:shadow-md">
            <div className="flex gap-3 items-center"> 
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-black">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="break-words">
                    <h1 className="text-md sm:text-lg xl:text-xl font-semibold text-gold mb-1">{title}</h1>
                    {description && <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500">{description}</p>}
                </div>
            </div>
            <DistributorHeaderMenu />
        </header>
    )
}