import { Provider } from '@ethersproject/abstract-provider'
import { assert, expect } from 'chai'
import { Signer } from 'ethers'
import { network, deployments, ethers } from 'hardhat'
import { developmentChains, networkConfig } from '../../helper-hardhat-config'
import { NftMarketplace, BasicNft } from '../../typechain-types'

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Nft marketplace unit tests', () => {
      let nftMarketplace: NftMarketplace,
        nftMarketplaceContract: NftMarketplace,
        basicNft: BasicNft
      const PRICE = ethers.utils.parseEther('0.1')
      const TOKEN_ID = 0
      let deployer: Signer
      let user: Signer

      beforeEach(async () => {
        const accounts = await ethers.getSigners() // could also do with getNamedAccounts
        deployer = accounts[0]
        user = accounts[1]

        await deployments.fixture(['all'])
        nftMarketplaceContract = await ethers.getContract('NftMarketplace')
        nftMarketplace = nftMarketplaceContract.connect(deployer)

        basicNft = await ethers.getContract('BasicNft', deployer)
        await basicNft.mintNft()
        await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
      })

      describe('nftItem', () => {
        it('emits an event after listing an item', async function () {
          expect(
            await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.emit(nftMarketplace, 'ItemListed')
        })
        it("exclusively items that haven't been listed", async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          //   const error = `NftIsAlreadyListed("${basicNft.address}", ${TOKEN_ID})`
          await expect(
            nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NftIsAlreadyListed')
          //   await expect(
          //     nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          //   ).to.be.revertedWith(error)
        })
        it('needs approvals to list item', async function () {
          await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
          await expect(
            nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NftNotApprovedForMarketplace')
        })
        it('exclusively allows owners to list', async function () {
          nftMarketplace = nftMarketplaceContract.connect(user)
          await basicNft.approve(await user.getAddress(), TOKEN_ID)
          await expect(
            nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NotOwnerOfNft')
        })
      })

      describe('buyItem', () => {
        it('transfers the nft to the buyer and updates internal proceeds record', async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          expect(
            await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
              value: PRICE,
            })
          ).to.emit(nftMarketplace, 'ItemBought')
          const newOwner = await basicNft.ownerOf(TOKEN_ID)
          const deployerProceeds = await nftMarketplace.getProceeds(
            await deployer.getAddress()
          )
          assert(newOwner.toString() == (await user.getAddress()))
          assert(deployerProceeds.toString() == PRICE.toString())
        })

        it('reverts if the price isnt met', async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          await expect(
            nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('PriceNotMet')
        })

        it('reverts if the item isnt listed', async function () {
          await expect(
            nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftIsNotListed')
        })
      })

      describe('cancelListing', function () {
        it('reverts if there is no listing', async function () {
          const error = `NotListed("${basicNft.address}", ${TOKEN_ID})`
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftIsNotListed')
        })
        it('reverts if anyone but the owner tries to call', async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await basicNft.approve(await user.getAddress(), TOKEN_ID)
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NotOwnerOfNft')
        })
        it('emits event and removes listing', async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          expect(
            await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.emit(nftMarketplace, 'ItemCanceled')
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          )
          assert(listing.price.toString() == '0')
        })
      })
      describe('updateListing', function () {
        it('must be owner and listed', async function () {
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NftIsNotListed')
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NotOwnerOfNft')
        })
        it('updates the price of the item', async function () {
          const updatedPrice = ethers.utils.parseEther('0.2')
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          expect(
            await nftMarketplace.updateListing(
              basicNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.emit(nftMarketplace, 'ItemListed')
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          )
          assert(listing.price.toString() == updatedPrice.toString())
        })
      })
      describe('withdrawProceeds', function () {
        it("doesn't allow 0 proceed withdrawls", async function () {
          await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
            'NoProceedsForSeller'
          )
        })
        it('withdraws proceeds', async function () {
          await nftMarketplace.nftItem(basicNft.address, TOKEN_ID, PRICE)
          nftMarketplace = nftMarketplaceContract.connect(user)
          await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
            value: PRICE,
          })
          nftMarketplace = nftMarketplaceContract.connect(deployer)

          const deployerProceedsBefore = await nftMarketplace.getProceeds(
            await deployer.getAddress()
          )
          const deployerBalanceBefore = await deployer.getBalance()
          const txResponse = await nftMarketplace.withdrawProceeds()
          const transactionReceipt = await txResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const deployerBalanceAfter = await deployer.getBalance()

          assert(
            deployerBalanceAfter.add(gasCost).toString() ==
              deployerProceedsBefore.add(deployerBalanceBefore).toString()
          )
        })
      })
    })
