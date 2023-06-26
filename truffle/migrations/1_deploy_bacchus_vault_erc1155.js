const BacchusVaultERC1155 = artifacts.require("BacchusVaultERC1155");
const BacchusVaultGovernor = artifacts.require("BacchusVaultGovernor");

module.exports = async (deployer) => {
  await deployer.deploy(BacchusVaultERC1155);
  let ercContract = await BacchusVaultERC1155.deployed();
  await deployer.deploy(BacchusVaultGovernor, ercContract.address);
  let governorContract = await BacchusVaultGovernor.deployed();
  await ercContract._setGouvernanceAddress(governorContract.address);
};
