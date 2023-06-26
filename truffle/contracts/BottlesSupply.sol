// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./BacchusVaultERC1155.sol";
import "./CommonEnums.sol";

abstract contract BottlesSupply is Ownable, ERC1155 {
    struct Bottle {
        uint256 maxSupply;
        uint256 mintPrice;
        uint256 mintEnd;
        uint256 currentSuggestedPrice;
        uint256 actualSellingPrice;
        BottleStatus bottleStatus;
    }
    mapping(uint256 => Bottle) public bottles;

    address private gouvernanceAddress;
    // bool to make gouvernanceAddress not updatable
    bool private gouvernanceAddressSet;

    // :: BOTTLE ::
    function setBottleActualSellingPrice(uint256 bottleId, uint256 price)
        external
        onlyGovernance
    {
        bottles[bottleId].actualSellingPrice = price;
    }

    function getBottle(uint256 _id) external view returns (Bottle memory) {
        return bottles[_id];
    }

    // :: MINT END ::
    function _setBottleMintEnd(uint256 bottleId, uint256 timestamp) internal {
        bottles[bottleId].mintEnd = timestamp;
    }

    function getBottleMintEnd(uint256 bottleId) public view returns (uint256) {
        return bottles[bottleId].mintEnd;
    }

    // :: STATUS ::
    function getBottleStatus(uint256 _id) public view returns (BottleStatus) {
        return bottles[_id].bottleStatus;
    }

    function setBottleStatusToWhiteListMinting(uint256 _id) external onlyOwner {
        require(
            bottles[_id].bottleStatus == BottleStatus.PreRelease,
            "status != from PreRelease"
        );
        require(bottles[_id].maxSupply > 0, "id not initialized yet ");
        bottles[_id].bottleStatus = BottleStatus.WhiteListMinting;
    }

    function setBottleStatusToPublicMinting(uint256 _id) external onlyOwner {
        require(
            bottles[_id].bottleStatus == BottleStatus.WhiteListMinting,
            " status != from WhiteListMinting "
        );
        bottles[_id].bottleStatus = BottleStatus.PublicMinting;
    }

    function _setBottleStatusToHold(uint256 _id) internal {
        require(
            bottles[_id].bottleStatus == BottleStatus.PublicMinting ||
                bottles[_id].bottleStatus == BottleStatus.WhiteListMinting ||
                bottles[_id].bottleStatus == BottleStatus.ReadyToBeSold,
            " status not in [ PublicMinting , WhiteListMinting , ReadyToBeSold ] "
        );
        bottles[_id].bottleStatus = BottleStatus.Hold;
    }

    function setBottleStatusToSold(uint256 _id) external onlyGovernance {
        require(
            bottles[_id].bottleStatus == BottleStatus.ReadyToBeSold,
            " status != from ReadyToBeSold"
        );
        bottles[_id].bottleStatus = BottleStatus.Sold;
    }

    function setBottleStatusToReadyToBurn(uint256 _id) external onlyOwner {
        require(
            bottles[_id].bottleStatus == BottleStatus.Sold,
            " status != from Sold"
        );
        bottles[_id].bottleStatus = BottleStatus.ReadyToBurn;
    }

    // :: SUPPLY ::
    function getMaxSupply(uint256 _id) public view returns (uint256) {
        return bottles[_id].maxSupply;
    }

    function _setMaxSupply(uint256 _id, uint256 _maxSupply) internal {
        bottles[_id].maxSupply = _maxSupply;
    }

    // :: MINT PRICE ::
    function getMintPrice(uint256 _id) public view returns (uint256) {
        return bottles[_id].mintPrice;
    }

    function _setMintPrice(uint256 _id, uint256 _price) internal {
        bottles[_id].mintPrice = _price * 1 ether;
    }

    modifier onlyGovernance() {
        require(msg.sender == gouvernanceAddress, " Only Gouvernance ");
        _;
    }

    // :: GOVERNANCE ::
    function _setGouvernanceAddress(address _gouvernanceAddress)
        public
        onlyOwner
    {
        require(
            !gouvernanceAddressSet,
            "gouvernance Address can be set only once"
        );
        gouvernanceAddress = _gouvernanceAddress;
        gouvernanceAddressSet = true;
    }

    function getGovernanceAddress() external view returns (address) {
        return gouvernanceAddress;
    }
}
