"use client"

import NFTCard from "@/components/NFTCard"
// import { useMoralis } from "react-moralis"
import networkMapping from "../../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"
import { useChainId } from "wagmi"
import { ConnectBtn } from "@/components/ConnectBtn"

type NetworkMapping = Record<string, { NftMarketplace: string[] }>

export default function Home() {
    // const { chainId, isWeb3Enabled } = useMoralis()
    const chainId = useChainId()
    const isWeb3Enabled = !!chainId

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    console.log("chainId", chainId, isWeb3Enabled)

    console.log("loading", loading, listedNfts)
    const chainString = chainId ? chainId.toString() : "31137"

    const networkMap: NetworkMapping = networkMapping
    const marketplaceAddress = chainId ? networkMap[chainString].NftMarketplace[0] : null

    return (
        <div className="container mx-auto mb-10">
            {/* <ConnectBtn /> */}

            <h1 className="py-4 ml-10 font-semibold text-2xl text-blue-400">Recently Listed</h1>
            <div className="flex flex-wrap ml-12">
                {isWeb3Enabled && chainId ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return marketplaceAddress ? (
                                <NFTCard
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>Network error, please switch to a supported network. </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
