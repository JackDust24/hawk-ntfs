"use client"

import { http, createStorage, cookieStorage } from "wagmi"
import { sepolia, bscTestnet, blastSepolia } from "wagmi/chains"
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit"

const projectId = ""

const supportedChains: Chain[] = [sepolia, bscTestnet, blastSepolia]

export const config = getDefaultConfig({
    appName: "NFT Marketplace",
    projectId: "5fdbb8ff79ca4dc261a946c9b9dab0a0",
    chains: supportedChains as any,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {}),
})
