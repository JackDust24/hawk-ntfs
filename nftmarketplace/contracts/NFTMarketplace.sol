// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftIsAlreadyListed(address nftAddress, uint256 tokenId);
error NftIsNotListed(address nftAddress, uint256 tokenId);
error PriceMustBeAboveZero();
error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftNotApprovedForMarketplace();
error NotOwnerOfNft();
error NoProceedsForSeller();

contract NftMarketplace is ReentrancyGuard {
  // 1. Listing
  struct Listing {
    uint256 price;
    address seller;
    // uint256 likes; // later
  }
  //2.Event
  event ItemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemBought(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemCancelled(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId
  );

  //////////////////////////////
  /// Modifiers and Mappings ///
  //////////////////////////////

  mapping(address => mapping(uint256 => Listing)) private s_listings;
  mapping(address => uint256) private s_proceeds;

  modifier alreadyListed(address nftAddress, uint256 tokenId) {
    Listing memory listing = s_listings[nftAddress][tokenId];
    if (listing.price <= 0) {
      revert NftIsNotListed(nftAddress, tokenId);
    }
    _;
  }

  modifier notYetListed(address nftAddress, uint256 tokenId) {
    Listing memory listing = s_listings[nftAddress][tokenId];
    if (listing.price > 0) {
      revert NftIsAlreadyListed(nftAddress, tokenId);
    }
    _;
  }

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address spender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (spender != owner) {
      revert NotOwnerOfNft();
    }
    _;
  }

  ////////////////////////
  /// Main functions /////
  ////////////////////////
  /*
   * @notice Method for listing NFT
   * @param nftAddress Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */
  function nftItem(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  )
    external
    notYetListed(nftAddress, tokenId)
    isOwner(nftAddress, tokenId, msg.sender)
  {
    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }

    IERC721 nft = IERC721(nftAddress);
    if (nft.getApproved(tokenId) != address(this)) {
      revert NftNotApprovedForMarketplace();
    }

    s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
    emit ItemListed(msg.sender, nftAddress, tokenId, price);
  }

  function buyItem(
    address nftAddress,
    uint256 tokenId
  )
    external
    payable
    nonReentrant
    alreadyListed(nftAddress, tokenId) // isNotOwner(nftAddress, tokenId, msg.sender)
  {
    Listing memory listedItem = s_listings[nftAddress][tokenId];
    if (msg.value < listedItem.price) {
      revert PriceNotMet(nftAddress, tokenId, listedItem.price);
    }

    s_proceeds[listedItem.seller] += msg.value;
    delete (s_listings[nftAddress][tokenId]);

    IERC721(nftAddress).safeTransferFrom(
      listedItem.seller,
      msg.sender,
      tokenId
    );
    emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
  }

  /*
   * @notice Method for cancelling item
   */

  function cancelListing(
    address nftAddress,
    uint256 tokenId
  )
    external
    isOwner(nftAddress, tokenId, msg.sender)
    alreadyListed(nftAddress, tokenId)
  {
    delete (s_listings[nftAddress][tokenId]);
    emit ItemCancelled(msg.sender, nftAddress, tokenId);
  }

  function updateListing(
    address nftAddress,
    uint256 tokenId,
    uint256 newPrice
  )
    external
    alreadyListed(nftAddress, tokenId)
    nonReentrant
    isOwner(nftAddress, tokenId, msg.sender)
  {
    if (newPrice <= 0) {
      revert PriceMustBeAboveZero();
    }
    s_listings[nftAddress][tokenId].price = newPrice;
    emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
  }

  /*
   * @notice Method for withdrawing proceeds for the sellet
   */

  function withdrawProceeds() external {
    uint256 proceeds = s_proceeds[msg.sender];
    if (proceeds <= 0) {
      revert NoProceedsForSeller();
    }

    s_proceeds[msg.sender] = 0;
    // The .call{value: proceeds} invokes a contract with a specified amount of ether
    (bool success, ) = payable(msg.sender).call{value: proceeds}(""); // The curly braxes contains optional data that can be passed
    require(success, "The transfer of funds failed");
  }

  /////////////////////
  // Getter Functions //
  /////////////////////

  function getListing(
    address nftAddress,
    uint256 tokenId
  ) external view returns (Listing memory) {
    return s_listings[nftAddress][tokenId];
  }

  function getProceeds(address seller) external view returns (uint256) {
    return s_proceeds[seller];
  }
}
