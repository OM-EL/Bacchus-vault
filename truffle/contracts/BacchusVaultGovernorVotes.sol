// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


import "./BacchusVaultERC1155.sol";

abstract contract BacchusVaultGovernorVotes{
    BacchusVaultERC1155 public immutable bacchusVaultERC1155;

    constructor(BacchusVaultERC1155 bacchusVaultERC1155Address) {
        bacchusVaultERC1155 = bacchusVaultERC1155Address;
    }

    function _getVotes(
        address account,
        uint256 tokenId
    ) internal view returns (uint256) {
        return bacchusVaultERC1155.balanceOf(account, tokenId);
    }
}
