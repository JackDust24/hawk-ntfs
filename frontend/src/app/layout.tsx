import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/providers/providers"
import { headers } from "next/headers"
import "@rainbow-me/rainbowkit/styles.css"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
}

type Props = {
    children: React.ReactNode
    cookie?: string | null
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // const cookie = (await headers()).get("cookie")

    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
