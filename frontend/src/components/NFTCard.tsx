import { useState, useEffect } from "react"
import { useReadContract, useWaitForTransactionReceipt, useWriteContract, useAccount } from "wagmi"
import { parseEther, formatEther } from "viem"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import nftAbi from "../../constants/BasicNft.json"
import Image from "next/image"
import UpdateListingModal from "./UpdateListingModal"
import { Card, useNotification } from "web3uikit"

const truncateStr = (fullStr: string, strLen: number) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const charsToShow = strLen - separator.length
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTCard({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { address } = useAccount()

    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()
    const { data: hash, writeContract } = useWriteContract()

    const {
        data: tokenURI,
        isError,
        isLoading,
    } = useReadContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: "tokenURI",
        args: [tokenId],
    })

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : writeContract({
                  address: marketplaceAddress,
                  abi: nftMarketplaceAbi,
                  functionName: "buyItem",
                  args: [nftAddress, tokenId],
              })
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    useEffect(() => {
        console.log("Token URI back:", tokenURI)

        if (tokenURI && typeof tokenURI === "string") {
            console.log("Token URI is string:", tokenURI)
            const fetchMetadata = async () => {
                const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                const tokenURIResponse = await fetch(requestURL).then((res) => res.json())
                setImageURI(tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
                setTokenName(tokenURIResponse.name)
                setTokenDescription(tokenURIResponse.description)
            }
            fetchMetadata()
        }
    }, [tokenURI])

    useEffect(() => {
        if (isConfirmed) {
            handleBuyItemSuccess()
        }
    }, [isConfirmed])

    const isOwnedByUser = seller === address?.toLowerCase() || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    console.log("Check seller and account", seller, address?.toLowerCase, isOwnedByUser)

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>Token #{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                        alt="nft image"
                                    />
                                    <div className="font-bold italic">
                                        Price {formatEther(price)} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
            </div>
        </div>
    )
}
