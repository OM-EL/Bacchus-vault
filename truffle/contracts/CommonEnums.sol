// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

enum SellingSessionStatus {
    // when a selling sessions closes.
    Closed,
    // people are voting on selling or not there bottles
    Voting,
    // when a auction sessions starts.
    Auction
}

enum BottleStatus {
    // when the bottle get add at first to the collection.
    PreRelease,
    // when members or whitelisted addresses get to Mint at first.
    WhiteListMinting,
    // when everyone can mint.
    PublicMinting,
    // when an NFT is fully minted.
    Hold,
    // NFT holder have voted to sell this bottle
    ReadyToBeSold,
    // when an NFT has being sold
    Sold,
    // when the NFT can be burned and replaced for money.
    ReadyToBurn
}
