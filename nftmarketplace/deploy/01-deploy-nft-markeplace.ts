import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config'
import verify from '../utils/verify'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

// hre is the functionality that is exposed by Hardhat
const deployNftMarketplace: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1 // If the network is a deployment chain
    : VERIFICATION_BLOCK_CONFIRMATIONS

  log('......................................................')

  const args: any[] = []
  // "deploy" from the deployments object that gets deployed by the appropriate contract
  const nftMarketplace = await deploy('NftMarketplace', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  //Verify the deployment if the deploymemt is NOT a network chain and only needs verifying on a REAL or PUBLIC network
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('verifying...')
    await verify(nftMarketplace.address, args)
  }

  log('......................................................')
}

export default deployNftMarketplace
deployNftMarketplace.tags = ['all', 'nftMarkerplace']
