import {
  frontEndContractsFile,
  frontEndAbiLocation,
} from '../helper-hardhat-config'
import 'dotenv/config'
import fs from 'fs'
import { network, ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const updateFrontEnd: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  if (process.env.UPDATE_FRONTEND) {
    console.log('Writing to front end updateContractAddresses...')
    await updateContractAddresses()
    console.log('Writing to front end updateAbi...')

    await updateAbi()
    console.log('Front end written!')
  }
}

async function updateAbi() {
  const nftMarketplace = await ethers.getContract('NftMarketplace')
  fs.writeFileSync(
    `${frontEndAbiLocation}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
  )

  const basicNft = await ethers.getContract('BasicNft')
  fs.writeFileSync(
    `${frontEndAbiLocation}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
  )

  const basicNft2 = await ethers.getContract('BasicNftTwo')
  fs.writeFileSync(
    `${frontEndAbiLocation}BasicNftTwo.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
  )
}

async function updateContractAddresses() {
  const chainId = network.config.chainId?.toString() || '1337'
  const nftMarketplace = await ethers.getContract('NftMarketplace')
  console.log('nftMarketplace > ', nftMarketplace)
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, 'utf8')
  )
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]['NftMarketplace'].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]['NftMarketplace'].push(nftMarketplace.address)
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

export default updateFrontEnd
updateFrontEnd.tags = ['all', 'frontend']
