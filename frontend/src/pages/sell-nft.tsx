"use client"

import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../../constants/BasicNft.json"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import networkMapping from "../../constants/networkMapping.json"
import { useEffect, useState } from "react"
import { useChainId, useAccount, useWriteContract, useReadContract } from "wagmi"
// import { writeContract } from '@wagmi/core'

// import { waitForTransactionReceipt } from "@wagmi/core"

type NetworkMapping = Record<string, { NftMarketplace: string[] }>

export default function Home() {
    const networkMap: NetworkMapping = networkMapping

    const { address } = useAccount()
    const chainId = useChainId()
    const dispatch = useNotification()
    const { data: hash, writeContract } = useWriteContract()

    const [proceeds, setProceeds] = useState("0")

    const isWeb3Enabled = !!chainId
    const chainString = chainId ? chainId.toString() : "31337"
    const marketplaceAddress = networkMap[chainString].NftMarketplace[0]

    const {
        data: tokenURI,
        isError,
        isLoading,
    } = useReadContract({
        abi: nftMarketplaceAbi,
        address: `0x${marketplaceAddress}`,
        functionName: "getProceeds",
        blockTag: "safe",
        args: [address],
    })

    async function approveAndList(data) {
        console.log("Approving...", data)
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        console.log("price", price)

        try {
            writeContract({
                address: nftAddress,
                abi: nftAbi,
                functionName: "approve",
                args: [marketplaceAddress, tokenId],
            })

            await handleApproveSuccess(hash, nftAddress, tokenId, price)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        await tx.wait()

        try {
            writeContract({
                address: nftAddress,
                abi: nftMarketplaceAbi,
                functionName: "nftItem",
                args: [nftAddress, tokenId, price],
            })

            await handleListSuccess()
        } catch (error) {
            console.log(error)
        }
    }

    async function handleWithdrawProceeds() {
        console.log("Ok! handleWithdrawProceeds")

        try {
            writeContract({
                address: `0x${marketplaceAddress}`,
                abi: nftMarketplaceAbi,
                functionName: "withdrawProceeds",
                args: [],
            })

            await handleWithdrawSuccess()
        } catch (error) {
            console.log(error)
        }
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    useEffect(() => {
        if (tokenURI) {
            console.log("result", tokenURI)
            setProceeds(tokenURI.toString())
        }
    }, [proceeds, address, isWeb3Enabled, chainId, tokenURI])

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
            <div>Withdraw {proceeds} proceeds</div>
            {proceeds != "0" ? (
                <Button onClick={handleWithdrawProceeds} text="Withdraw" type="button" />
            ) : (
                <div>No proceeds detected</div>
            )}
        </div>
    )
}
