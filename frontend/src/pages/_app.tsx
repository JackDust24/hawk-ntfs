import Head from "next/head"
import Header from "../components/Header"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <Component {...pageProps} />
        </div>
    )
}

export default MyApp
