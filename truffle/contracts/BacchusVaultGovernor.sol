// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "../node_modules/@openzeppelin/contracts/utils/Timers.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";
import "../node_modules/@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "./BacchusVaultERC1155.sol";
import "./CommonEnums.sol";

contract BacchusVaultGovernor is Context, Ownable {
    struct BottleVoteResults {
        uint256 bottleId;
        uint256 sellVotes;
        uint256 sessionId;
    }
    struct BottleAuctionResults {
        bool sold;
        uint256 price;
        uint256 sessionId;
    }

    using Counters for Counters.Counter;

    // :: ERC1155 smart contract instance ::
    BacchusVaultERC1155 public immutable bacchusVaultERC1155;

    // :: Selling session Information ::
    Counters.Counter private _sessionId;
    SellingSessionStatus public sellingSessionStatus;
    uint256 public sellingSessionStartDate;
    // Voting minimum duration
    uint256 public sellingSessionMinimumDuration;

    // :: Mappings ::
    mapping(uint256 => mapping(address => uint256)) private voted;
    // false --> Sell // true --> Hold
    mapping(uint256 => mapping(address => bool)) private vote;
    mapping(uint256 => BottleAuctionResults) private auctionResults;

    // :: Lists ::
    //BottleVoteResults[] private bottleVoteResults;
    mapping(uint256 => BottleVoteResults) private bottleVoteResults;
    uint256[] public votedOnBottlesIds;
    uint256[] private bottlesInReadyToBeSoldStatus;

    constructor(BacchusVaultERC1155 bacchusVaultERC1155Address) {
        bacchusVaultERC1155 = bacchusVaultERC1155Address;
        sellingSessionStatus = SellingSessionStatus.Closed;
    }

    // Closed --> Voting --> Auction

    // Closed --> Voting
    function _onSetVotingSessionStatusToVoting() external onlyOwner {
        require(
            sellingSessionStatus == SellingSessionStatus.Closed,
            "SelingSessionStatus != from Closed"
        );
        // Incremenet selling sessionId ( new selling session started )
        sellingSessionStartDate = block.timestamp;
        // Change ERC1155 smart contract to Voting status ( block transfers )
        bacchusVaultERC1155.setVoting(true);
        sellingSessionStatus = SellingSessionStatus.Voting;
        _sessionId.increment();
    }

    function Vote(uint256 bottleId, bool hold) public returns (uint256) {
        // Session is in voting status
        require(
            sellingSessionStatus == SellingSessionStatus.Voting,
            " SelingSessionStatus != from Voting "
        );
        // Bottle is in hold status
        require(
            bacchusVaultERC1155.getBottleStatus(bottleId) == BottleStatus.Hold,
            " You can't vote on bottle not in hold state "
        );
        // ERC1155 is in voting status
        require(bacchusVaultERC1155.getVoting(), " ERC1155 Voting is False");
        // Voter has not already voted
        require(
            voted[bottleId][msg.sender] != _sessionId.current(),
            " You have already voted "
        );
        // Voter has some tokens
        require(
            bacchusVaultERC1155.balanceOf(msg.sender, bottleId) > 0,
            " you should have at least one token to be able to vote "
        );

        uint256 weight = bacchusVaultERC1155.balanceOf(msg.sender, bottleId);
        _vote(bottleId, hold);

        return weight;
    }

    function _vote(uint256 bottleId, bool hold) internal {
        voted[bottleId][msg.sender] = _sessionId.current();
        vote[bottleId][msg.sender] = hold;
        // delete results of previous voting

        if (bottleVoteResults[bottleId].sessionId != _sessionId.current()) {
            bottleVoteResults[bottleId].sellVotes = 0;
            bottleVoteResults[bottleId].sessionId = _sessionId.current();
            votedOnBottlesIds.push(bottleId);
        }
        if (!hold) {
            bottleVoteResults[bottleId].sellVotes += bacchusVaultERC1155
                .balanceOf(msg.sender, bottleId);
        }
    }

    // Voting --> Auction
    function _onSetVotingSessionToAuction() external onlyOwner {
        require(
            block.timestamp >=
                sellingSessionStartDate + sellingSessionMinimumDuration,
            concatenate(
                "can't close before timestamp : ",
                Strings.toString(
                    sellingSessionStartDate + sellingSessionMinimumDuration
                )
            )
        );
        require(
            sellingSessionStatus == SellingSessionStatus.Voting,
            "SelingSessionStatus != from Voting"
        );

        for (uint256 i; i < votedOnBottlesIds.length; i++) {
            uint256 bottleId = bottleVoteResults[votedOnBottlesIds[i]].bottleId;
            if (
                bottleVoteResults[votedOnBottlesIds[i]].sellVotes * 2 >
                bacchusVaultERC1155.getMaxSupply(votedOnBottlesIds[i])
            ) {
                bacchusVaultERC1155.setBottleStatusToReadyToBeSold(bottleId);
                bottlesInReadyToBeSoldStatus.push(bottleId);
            }
        }
        sellingSessionStatus = SellingSessionStatus.Auction;
        bacchusVaultERC1155.setVoting(false);
        delete votedOnBottlesIds;
    }

    function addAuctionSell(uint256 bottleId, uint256 price)
        external
        onlyOwner
    {
        require(
            sellingSessionStatus == SellingSessionStatus.Auction,
            "you can change Action results only on Auction status"
        );
        require(
            bacchusVaultERC1155.getBottleStatus(bottleId) ==
                BottleStatus.ReadyToBeSold,
            "bottle status != from ReadyToBeSold"
        );

        _setAuctionResult(true, bottleId, price, _sessionId.current());
    }

    function updateAuctionSell(uint256 bottleId, uint256 price)
        external
        onlyOwner
    {
        require(
            sellingSessionStatus == SellingSessionStatus.Auction,
            "you can change Action results only on Auction status"
        );
        require(
            bacchusVaultERC1155.getBottleStatus(bottleId) == BottleStatus.Hold,
            "bottle status != from Hold"
        );
        require(
            auctionResults[bottleId].sessionId == _sessionId.current(),
            "This selling session is closed"
        );
        _setAuctionResult(true, bottleId, price, _sessionId.current());
    }

    function deleteAuctionSell(uint256 bottleId) external onlyOwner {
        require(
            sellingSessionStatus == SellingSessionStatus.Auction,
            "you can change Action results only on Auction status"
        );
        require(
            bacchusVaultERC1155.getBottleStatus(bottleId) == BottleStatus.Hold,
            "bottle status != from Hold"
        );
        require(
            auctionResults[bottleId].sessionId == _sessionId.current(),
            "This selling session is closed"
        );
        _setAuctionResult(false, bottleId, 0, 0);
    }

    // Auction --> Closed
    function _onSetVotingSessionToClosed() external onlyOwner {
        require(
            sellingSessionStatus == SellingSessionStatus.Auction,
            "bottle status != from Auction"
        );
        _sessionId.increment();
        for (uint256 i; i < bottlesInReadyToBeSoldStatus.length; i++) {
            uint256 bottleId = bottlesInReadyToBeSoldStatus[i];
            if (auctionResults[bottleId].sold) {
                bacchusVaultERC1155.setBottleStatusToSold(bottleId);
                bacchusVaultERC1155.setBottleActualSellingPrice(
                    bottleId,
                    auctionResults[bottleId].price
                );
            } else {
                bacchusVaultERC1155.setBottleStatusToHold(bottleId);
            }
        }
        sellingSessionStatus = SellingSessionStatus.Closed;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155BatchReceived}.
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function _setAuctionResult(
        bool sold,
        uint256 bottleId,
        // price is by default in dollar
        uint256 price,
        uint256 sessionId
    ) internal {
        auctionResults[bottleId].sold = sold;
        auctionResults[bottleId].price = price;
        auctionResults[bottleId].sessionId = sessionId;
    }

    function _setsellingSessionMinimumDuration(
        uint256 _sellingSessionMinimumDuration
    ) external onlyOwner {
        sellingSessionMinimumDuration = _sellingSessionMinimumDuration;
    }

    function concatenate(string memory a, string memory b)
        public
        pure
        returns (string memory)
    {
        return string(bytes.concat(bytes(a), " ", bytes(b)));
    }

    // :: GETTERS ::

    function getSellingSessionStatus()
        public
        view
        returns (SellingSessionStatus)
    {
        return sellingSessionStatus;
    }

    function getBottleAuctionResults(uint256 _bottleId)
        public
        view
        returns (BottleAuctionResults memory)
    {
        return auctionResults[_bottleId];
    }

    function getVoted(uint256 _bottleId, address _address)
        public
        view
        returns (bool)
    {
        return voted[_bottleId][_address] == _sessionId.current();
    }

    function getVotedToHold(uint256 _bottleId, address _address)
        public
        view
        returns (bool)
    {
        return vote[_bottleId][_address];
    }

    function deposit() public payable {}

    function getNumberOfSellVotes(uint256 _bottleId)
        public
        view
        returns (uint256)
    {
        return bottleVoteResults[_bottleId].sellVotes;
    }
}
