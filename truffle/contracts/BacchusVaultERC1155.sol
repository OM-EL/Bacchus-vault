// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/common/ERC2981.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./CommonEnums.sol";
import "./BottlesSupply.sol";

contract BacchusVaultERC1155 is
    Pausable,
    ERC1155Burnable,
    ERC1155URIStorage,
    ERC2981,
    ERC1155Supply,
    BottlesSupply
{
    using Counters for Counters.Counter;
    Counters.Counter private _currentId;
    mapping(address => bool) private whitelist;

    bool private votingState;

    event DepositReceived(address addr, uint256 value);

    /////////////////
    // constructor //
    /////////////////
    constructor() ERC1155("") {
        _setBaseURI("ipfs://");
    }

    //////////////////////
    // receive function //
    //////////////////////
    receive() external payable {
        emit DepositReceived(msg.sender, msg.value);
    }

    ///////////////////////
    // fallback function //
    ///////////////////////
    fallback() external payable {
        require(msg.data.length == 0);
        emit DepositReceived(msg.sender, msg.value);
    }

    //////////////
    // external //
    //////////////
    function getCurrentId() external view returns (uint256) {
        return _currentId.current();
    }

    function setVoting(bool voting) external onlyGovernance {
        votingState = voting;
    }

    function getVoting() external view returns (bool) {
        return votingState;
    }

    function isAddressInwhitelist(address _address)
        external
        view
        returns (bool)
    {
        return whitelist[_address];
    }

    function addAddressToWhitelist(address _address) external onlyOwner {
        whitelist[_address] = true;
    }

    function removeAddressFromWhitelist(address _address) external onlyOwner {
        whitelist[_address] = false;
    }

    function setBottleStatusToHold(uint256 _id) external onlyGovernance {
        require(getMaxSupply(_id) == totalSupply(_id), "not soldout yet");
        _setBottleStatusToHold(_id);
    }

    function setBottleStatusToReadyToBeSold(uint256 _id)
        external
        onlyGovernance
    {
        require(
            bottles[_id].bottleStatus == BottleStatus.Hold,
            "status != from Hold"
        );
        bottles[_id].bottleStatus = BottleStatus.ReadyToBeSold;
    }

    function initNewToken(
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _mintEnd,
        string memory _cid
    ) external onlyOwner returns (uint256) {
        require(_mintPrice > 0, "mint price too low");
        require(_maxSupply > 0, "supply too low");
        require(_mintEnd > block.timestamp, "can't set end of mint before now");
        uint256 _id = _currentId.current();
        _setMaxSupply(_id, _maxSupply);
        _setMintPrice(_id, _mintPrice);
        _setBottleMintEnd(_id, _mintEnd);
        _setURI(_id, _cid);
        _currentId.increment();
        return _id;
    }

    function whiteListMint(uint256 _id, uint256 _amount) external payable {
        require(whitelist[msg.sender], "not in whitelist");
        require(
            getBottleStatus(_id) == BottleStatus.WhiteListMinting,
            "status != from WhiteListMinting"
        );
        _mint(_id, _amount);
    }

    function publicMint(uint256 _id, uint256 _amount) external payable {
        require(
            getBottleStatus(_id) == BottleStatus.PublicMinting,
            "status != from PublicListMinting"
        );
        _mint(_id, _amount);
    }

    function claimRemainingSupply(uint256 _id) external onlyOwner {
        uint256 remainingSupply = getMaxSupply(_id) - totalSupply(_id);
        _mint(msg.sender, _id, remainingSupply, "");
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        _setBaseURI(_baseURI);
    }

    function setTokenURI(uint256 _tokenId, string memory _cid)
        external
        onlyOwner
    {
        _setURI(_tokenId, _cid);
    }

    function setDefaultRoyalty(address _receiver, uint96 _percentage)
        external
        onlyOwner
    {
        require(_percentage <= 100, "can't set more than 100%");
        uint96 feeNumerator = _percentage * 100;
        _setDefaultRoyalty(_receiver, feeNumerator);
    }

    function setTokenRoyalty(
        uint256 _tokenId,
        address _receiver,
        uint96 _percentage
    ) external onlyOwner {
        require(_percentage <= 100, "can't set more than 100%");
        uint96 feeNumerator = _percentage * 100;
        _setTokenRoyalty(_tokenId, _receiver, feeNumerator);
    }

    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    function resetTokenRoyalty(uint256 _tokenId) external onlyOwner {
        _resetTokenRoyalty(_tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    ////////////
    // public //
    ////////////
    function uri(uint256 tokenId)
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return super.uri(tokenId);
    }

    function name() public pure returns (string memory) {
        string memory collection = "Bacchus Vault";
        return collection;
    }

    // EIP2981 standard Interface return. Adds to ERC1155 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }

    //////////////
    // internal //
    //////////////
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155Supply, ERC1155) whenNotPaused {
        require(!votingState, "can't transfer bottle in Voting state");
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /////////////
    // private //
    /////////////
    function _mint(uint256 _id, uint256 _amount) private {
        require(getBottleMintEnd(_id) > block.timestamp, "mint is over");
        bool isMintable = _amount + totalSupply(_id) <= getMaxSupply(_id);
        require(isMintable, "mint amount exceeds maxSupply");
        require(msg.value == getMintPrice(_id) * _amount, "wrong value");
        _mint(msg.sender, _id, _amount, "");
        if (totalSupply(_id) == getMaxSupply(_id)) {
            _setBottleStatusToHold(_id);
        }
    }
}
