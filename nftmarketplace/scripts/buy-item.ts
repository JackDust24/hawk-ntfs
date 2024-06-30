import { ethers, network } from 'hardhat'
import { moveBlocks } from '../utils/move-blocks'

const TOKEN_ID = 1

async function buyItem() {
  // Get contracts
  const nftMarketplace = await ethers.getContract('NftMarketplace')
  const basicNft = await ethers.getContract('BasicNft')
  // Get the specific listing and price
  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
  const price = listing.price.toString()
  // Transaction
  const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: price,
  })

  await tx.wait(1)
  console.log('NFT Bought!')

  if (network.config.chainId === 31337) {
    await moveBlocks(2, 1000)
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
