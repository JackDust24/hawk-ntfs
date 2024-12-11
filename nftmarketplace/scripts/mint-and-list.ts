import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"
import "@nomiclabs/hardhat-ethers"

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList(): Promise<void> {
  // Get contract
  const nftMarketplace = await ethers.getContract("NftMarketplace")

  // Do a random NFT
  const randomNumber = Math.floor(Math.random() * 2)
  let basicNft

  if (randomNumber === 1) {
    basicNft = await ethers.getContract("BasicNft")
  } else {
    basicNft = await ethers.getContract("BasicNft")
  }

  console.log("Minting NFT...")
  const mintTx = await basicNft.mintNft()
  const mintTxReceipt = await mintTx.wait(1)
  const tokenId = mintTxReceipt.events[0].args?.tokenId

  if (tokenId === undefined) {
    console.error("Failed to get tokenId from mint transaction.")
    process.exit(1)
  }

  console.log("Approving NFT...")
  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
  await approvalTx.wait(1)

  console.log("Listing NFT...")
  const tx = await nftMarketplace.nftItem(basicNft.address, tokenId, PRICE)
  await tx.wait(1)

  console.log("NFT Listed!")

  if (network.config.chainId === 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    await moveBlocks(1, 1000)
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("errpr", error)
    process.exit(1)
  })
