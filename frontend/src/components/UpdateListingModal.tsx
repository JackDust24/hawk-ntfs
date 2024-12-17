import { useEffect, useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import { parseEther } from "viem"
import { Modal, Input, useNotification } from "web3uikit"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("0")
    const dispatch = useNotification()
    const { data: hash, writeContract: updateListing } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const handleUpdateListingSuccess = async () => {
        dispatch({
            type: "success",
            message: "Listing updated successfully!",
            title: "Listing Updated",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const handleUpdateListing = () => {
        updateListing({
            address: marketplaceAddress,
            abi: nftMarketplaceAbi,
            functionName: "updateListing",
            args: [nftAddress, tokenId, parseEther(priceToUpdateListingWith || "0")],
        })
    }

    useEffect(() => {
        if (isConfirmed) {
            handleUpdateListingSuccess()
        }
    }, [isConfirmed])

    return (
        // <div className={`modal ${isVisible ? "visible" : "hidden"}`}>
        //     <div>
        //         <label>Update Listing Price (ETH):</label>
        //         <input
        //             type="number"
        //             value={priceToUpdateListingWith}
        //             onChange={(e) => setPriceToUpdateListingWith(e.target.value)}
        //         />
        //         <button
        //             onClick={() => {
        //                 handleUpdateListing()
        //             }}
        //         >
        //             Update Listing
        //         </button>
        //         <button onClick={onClose}>Cancel</button>
        //     </div>
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => handleUpdateListing()}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
        // </div>
    )
}
