import Link from "next/link"
import { ConnectBtn } from "@/components/ConnectBtn"

export default function Header() {
    const navButtonClass =
        "bg-white/70 rounded-xl text-blue-500 border-solid border border-blue-500 p-2"
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-blue-500 text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center justify-between gap-3">
                <Link href="/" className={navButtonClass}>
                    Home
                </Link>
                <Link href="/create-asset" className={navButtonClass}>
                    Sell Asset
                </Link>
                <Link href="/my-assets" className={navButtonClass}>
                    My digit assets
                </Link>
                <Link href="/creator-dashboard" className={navButtonClass}>
                    Creator dashboard
                </Link>
                <ConnectBtn />
            </div>
        </nav>
    )
}
