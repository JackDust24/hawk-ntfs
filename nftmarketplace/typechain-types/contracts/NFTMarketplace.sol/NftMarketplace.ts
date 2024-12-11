/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace NftMarketplace {
  export type ListingStruct = { price: BigNumberish; seller: AddressLike };

  export type ListingStructOutput = [price: bigint, seller: string] & {
    price: bigint;
    seller: string;
  };
}

export interface NftMarketplaceInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "buyItem"
      | "cancelListing"
      | "getListing"
      | "getProceeds"
      | "nftItem"
      | "updateListing"
      | "withdrawProceeds"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "ItemBought" | "ItemCancelled" | "ItemListed"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "buyItem",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelListing",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getListing",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getProceeds",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "nftItem",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateListing",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawProceeds",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "buyItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelListing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getListing", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getProceeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nftItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateListing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawProceeds",
    data: BytesLike
  ): Result;
}

export namespace ItemBoughtEvent {
  export type InputTuple = [
    buyer: AddressLike,
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    price: BigNumberish
  ];
  export type OutputTuple = [
    buyer: string,
    nftAddress: string,
    tokenId: bigint,
    price: bigint
  ];
  export interface OutputObject {
    buyer: string;
    nftAddress: string;
    tokenId: bigint;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ItemCancelledEvent {
  export type InputTuple = [
    seller: AddressLike,
    nftAddress: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [
    seller: string,
    nftAddress: string,
    tokenId: bigint
  ];
  export interface OutputObject {
    seller: string;
    nftAddress: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ItemListedEvent {
  export type InputTuple = [
    seller: AddressLike,
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    price: BigNumberish
  ];
  export type OutputTuple = [
    seller: string,
    nftAddress: string,
    tokenId: bigint,
    price: bigint
  ];
  export interface OutputObject {
    seller: string;
    nftAddress: string;
    tokenId: bigint;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface NftMarketplace extends BaseContract {
  connect(runner?: ContractRunner | null): NftMarketplace;
  waitForDeployment(): Promise<this>;

  interface: NftMarketplaceInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  buyItem: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "payable"
  >;

  cancelListing: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getListing: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [NftMarketplace.ListingStructOutput],
    "view"
  >;

  getProceeds: TypedContractMethod<[seller: AddressLike], [bigint], "view">;

  nftItem: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;

  updateListing: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawProceeds: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "buyItem"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "cancelListing"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getListing"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [NftMarketplace.ListingStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getProceeds"
  ): TypedContractMethod<[seller: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "nftItem"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateListing"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawProceeds"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "ItemBought"
  ): TypedContractEvent<
    ItemBoughtEvent.InputTuple,
    ItemBoughtEvent.OutputTuple,
    ItemBoughtEvent.OutputObject
  >;
  getEvent(
    key: "ItemCancelled"
  ): TypedContractEvent<
    ItemCancelledEvent.InputTuple,
    ItemCancelledEvent.OutputTuple,
    ItemCancelledEvent.OutputObject
  >;
  getEvent(
    key: "ItemListed"
  ): TypedContractEvent<
    ItemListedEvent.InputTuple,
    ItemListedEvent.OutputTuple,
    ItemListedEvent.OutputObject
  >;

  filters: {
    "ItemBought(address,address,uint256,uint256)": TypedContractEvent<
      ItemBoughtEvent.InputTuple,
      ItemBoughtEvent.OutputTuple,
      ItemBoughtEvent.OutputObject
    >;
    ItemBought: TypedContractEvent<
      ItemBoughtEvent.InputTuple,
      ItemBoughtEvent.OutputTuple,
      ItemBoughtEvent.OutputObject
    >;

    "ItemCancelled(address,address,uint256)": TypedContractEvent<
      ItemCancelledEvent.InputTuple,
      ItemCancelledEvent.OutputTuple,
      ItemCancelledEvent.OutputObject
    >;
    ItemCancelled: TypedContractEvent<
      ItemCancelledEvent.InputTuple,
      ItemCancelledEvent.OutputTuple,
      ItemCancelledEvent.OutputObject
    >;

    "ItemListed(address,address,uint256,uint256)": TypedContractEvent<
      ItemListedEvent.InputTuple,
      ItemListedEvent.OutputTuple,
      ItemListedEvent.OutputObject
    >;
    ItemListed: TypedContractEvent<
      ItemListedEvent.InputTuple,
      ItemListedEvent.OutputTuple,
      ItemListedEvent.OutputObject
    >;
  };
}
