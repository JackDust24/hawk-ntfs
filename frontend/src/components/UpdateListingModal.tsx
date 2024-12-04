import { useState } from "react"
import { useContractWrite } from "wagmi"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import { parseEther } from "viem"
import { useNotification } from "web3uikit"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("0")
    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (transaction) => {
        dispatch({
            type: "success",
            message: "Listing updated successfully!",
            title: "Listing Updated",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { write: updateListing } = useContractWrite({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "updateListing",
        args: [nftAddress, tokenId, parseEther(priceToUpdateListingWith || "0")],
        onError: (error) => console.log(error),
        onSuccess: handleUpdateListingSuccess,
    })

    return (
        <div className={`modal ${isVisible ? "visible" : "hidden"}`}>
            <div>
                <label>Update Listing Price (ETH):</label>
                <input
                    type="number"
                    value={priceToUpdateListingWith}
                    onChange={(e) => setPriceToUpdateListingWith(e.target.value)}
                />
                <button
                    onClick={() => {
                        updateListing()
                    }}
                >
                    Update Listing
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}
