import Head from "next/head"
import Header from "../components/Header"
import { ConnectBtn } from "@/components/ConnectBtn"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { NotificationProvider } from "web3uikit"
import { config } from "@/lib/config"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
    const queryClient = new QueryClient()

    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <Header /> */}
            {/* <Component {...pageProps} /> */}
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider>
                        <ApolloProvider client={client}>
                            <NotificationProvider>
                                <Header />
                                <Component {...pageProps} />
                            </NotificationProvider>
                        </ApolloProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    )
}

export default MyApp
