"use client"

import { WagmiProvider, cookieToInitialState } from "wagmi"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { config } from "@/lib/config"

const queryClient = new QueryClient()

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_NEW_SUBGRAPH_URL,
})

type Props = {
    children: React.ReactNode
    cookie?: string | null
}

export default function Providers({ children, cookie }: Props) {
    console.log("Providers")
    // We need the initial state for essentially "hydrates" the cookie data on the client-side
    const initialState = cookieToInitialState(config, cookie)

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: "#0E76FD",
                        accentColorForeground: "white",
                        borderRadius: "large",
                        fontStack: "system",
                        overlayBlur: "small",
                    })}
                >
                    <ApolloProvider client={client}>{children}</ApolloProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
