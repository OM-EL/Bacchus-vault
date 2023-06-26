# Bacchus Vault dApp - React & Web3.js

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)

![https://github.com/tehjul](https://img.shields.io/badge/Compiler-0.8.17-blue?style=plastic)

## ***About***

Contracts deployed on mumbai :

ERC1155 contract : [0xd4732e54a8452fe960653db898e5Cc4B5C7CAf6F](https://mumbai.polygonscan.com/token/0xd4732e54a8452fe960653db898e5cc4b5c7caf6f).
Governor contract : [0x759282103f3e0e6C95BdD1e1cCDAcCe0B68777FE](https://mumbai.polygonscan.com/address/0x759282103f3e0e6c95bdd1e1ccdacce0b68777fe)

Collection available on [Opensea](https://testnets.opensea.io/fr/collection/bacchus-vault-v3).

Online dApp available [here](https://bacchus-vault.vercel.app/).

Demo video available on [Google Drive](https://drive.google.com/file/d/1kCJf_ijbipNSX-WBzrCK0youo-7pN12q/view?usp=share_link).

## Installation
Install all dependencies :

```sh
# Truffle
cd truffle/
npm install
```
```sh
# Client
cd client/
npm install
```

## Launch dApp

Open 3 terminals :

### 1) Ganache
Launch a local blockchain.
```sh
ganache
```
### 2) Truffle
Compile and deploy on the local blockchain.
```sh
cd truffle/
truffle migrate --reset
```
### 3) Client
Launch the front-end of the app.
```sh
cd client/
npm start
```

# ***Unit tests***

## ERC1155 contract

```sh
:::: Id ::::
      :: getCurrentId function ::
        ✓ ...should return the current token id
    
:::: Supply ::::
      :: getMaxSupply function ::
        ✓ ...should return the max supply of a token id
    
:::: Mint price ::::
      :: getMintPrice function ::
        ✓ ...should return the mint price of a token id
    
:::: Status management ::::
      :: setBottleStatusToWhiteListMinting function ::
        ✓ ...should update the status from PreRelease to WhiteListMinting (48359 gas)
        ✓ ...should revert is the status is not 0 (48359 gas)
      :: setBottleStatusToPublicMinting function ::
        ✓ ...should update the status from WhiteListMinting to PublicMinting (29014 gas)
        ✓ ...should revert is the status is not WhiteListMinting (29014 gas)
      :: setBottleStatusToSold function ::
        - ...should update the status from ReadyToBeSold to Sold
        - ...should revert is the status is not ReadyToBeSold
      :: setBottleStatusToReadyToBurn function ::
        - ...should update the status from Sold to ReadyToBurn
        - ...should revert is the status is not Sold
    
:::: Whitelist ::::
      :: isAddressInwhitelist ::
        ✓ ...should return true if an address is whitelisted
        ✓ ...should return false if an address is not whitelisted
      :: addAddressToWhitelist ::
        ✓ ...should add an address to the whitelist (46187 gas)
        ✓ ...should revert if caller is not the owner
      :: removeAddressFromWhitelist ::
        ✓ ...should remove an address to the whitelist (24281 gas)
        ✓ ...should revert if caller is not the owner
    
:::: Mint ::::
      :: initNewToken function ::
        ✓ ...should increment the current token id (99613 gas)
        ✓ ...should update the max supply of the current token id (99613 gas)
        ✓ ...should update the current token uri (153351 gas)
        ✓ ...should revert if not the owner
        ✓ ...should revert if mint price less than 1 MATIC
      :: whiteListMint function ::
        ✓ ...should mint 1 token (83936 gas)
        ✓ ...should mint 10 tokens (87567 gas)
        ✓ ...should update the status from WhiteListMinting to Hold if soldout (87567 gas)
        ✓ ...should revert if the amount exceeds the max supply
        ✓ ...should revert if the contract is paused (27810 gas)
        ✓ ...should revert if the current status is not WhiteListMinting (29014 gas)
        ✓ ...should revert if the wrong value is sent
        ✓ ...should emit an event (83936 gas)
      :: publicMint function ::
        ✓ ...should mint 1 token (110737 gas)
        ✓ ...should mint 10 tokens (114153 gas)
        ✓ ...should mint tokens for multiple users (239983 gas)
        ✓ ...should mint the total remaining supply of the token (114153 gas)
        ✓ ...should update the status from PublicMinting to Hold if soldout (114153 gas)
        ✓ ...should revert if the amount exceeds the max supply (29014 gas)
        ✓ ...should revert if the contract is paused (56824 gas)
        ✓ ...should revert if the current status is not PublicListMinting
        ✓ ...should revert if the wrong value is sent (29014 gas)
        ✓ ...should emit an event (110737 gas)
    
:::: Uri ::::
      :: setBaseURI function ::
        ✓ ...should update the base URI (29982 gas)
      :: setTokenUri function ::
        ✓ ...should update a token URI (36864 gas)
      :: uri function ::
        ✓ ...should return a token URI if set
        ✓ ...should return an empty string if not set
    
:::: Name ::::
      :: name function ::
        ✓ ...should return the collection name
    
:::: Royalties ::::
      :: setDefaultRoyalty function ::
        ✓ ...should update the royalty for all tokens (46772 gas)
      :: setTokenRoyalty function ::
        ✓ ...should update the royalty for one token (93750 gas)
      :: deleteDefaultRoyalty function ::
        ✓ ...should delete the default royalty for all tokens (117509 gas)
      :: resetTokenRoyalty function ::
        ✓ ...should delete the royalty for one token (117778 gas)
    
:::: Pause ::::
      :: pause function ::
        ✓ ...should set pause (27810 gas)
      :: unpause function ::
        ✓ ...should unpause contract (55531 gas)
```

```java
·-------------------------------------------------------------|---------------------------|-------------|----------------------------·
|            Solc version: 0.8.17+commit.8df45f5f             ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
······························································|···························|·············|·····························
|  Methods                                                    ·               31 gwei/gas               ·       0.91 usd/matic       │
························|·····································|·············|·············|·············|··············|··············
|  Contract             ·  Method                             ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  _setGouvernanceAddress             ·          -  ·          -  ·      46404  ·           1  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  addAddressToWhitelist              ·          -  ·          -  ·      46187  ·          17  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  deleteDefaultRoyalty               ·          -  ·          -  ·      23759  ·           2  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  initNewToken                       ·      82513  ·     120269  ·      97032  ·          45  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  pause                              ·          -  ·          -  ·      27810  ·           7  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  publicMint                         ·      64623  ·      85139  ·      79523  ·          14  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  removeAddressFromWhitelist           ·          -  ·          -  ·      24281  ·           2  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  resetTokenRoyalty                  ·          -  ·          -  ·      24028  ·           2  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setBaseURI                         ·          -  ·          -  ·      29982  ·           2  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setBottleStatusToPublicMinting     ·          -  ·          -  ·      29014  ·          17  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setBottleStatusToWhiteListMinting  ·          -  ·          -  ·      48359  ·          27  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setDefaultRoyalty                  ·          -  ·          -  ·      46772  ·           5  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setTokenRoyalty                    ·          -  ·          -  ·      46978  ·           4  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  setTokenURI                        ·      33082  ·      98541  ·      73114  ·          10  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  unpause                            ·          -  ·          -  ·      27721  ·           1  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155  ·  whiteListMint                      ·      83936  ·      87567  ·      85752  ·           8  ·       0.00  │
························|·····································|·············|·············|·············|··············|··············
|  Deployments                                                ·                                         ·  % of limit  ·             │
······························································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155                                        ·          -  ·          -  ·    3363311  ·      50.1 %  ·       0.09  │
······························································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor                                       ·          -  ·          -  ·    1647327  ·      24.5 %  ·       0.05  │
·-------------------------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```

## Governance contract

```sh    
:::: Selling Session Status Management ::::
      :: test _onSetVotingSessionStatusToVoting Method ::
        ✓ ... sould reverse if the caller is not the owner
        ✓ ... should update status to Voting when calling _onSetVotingSessionStatusToVoting (117489 gas)
        ✓ ... sould reverse if the Status is different from Closed
      :: test Vote Method ::
        ✓ ... sould revert if the Status is different from Closed 
        ✓ ... should have more than 0 share  (117489 gas)
        ✓ ... should have more than 0 share to vote  (117489 gas)
        ✓ ... voting   (339276 gas)
      :: test _onSetVotingSessionToAuction Method ::
        ✓ ... sould reverse if the caller is not the owner
        ✓ ... voting when sell   (419448 gas)
        ✓ ... voting when hold   (301729 gas)
      :: test addAuctionSell Method ::
        ✓ ... sould reverse if the caller is not the owner
        ✓ ... Add Auction On Hold Bottle   (390981 gas)
        ✓ ... Add Auction On ReadyToBeSold Bottle    (519703 gas)
```

```java
·--------------------------------------------------------------|---------------------------|-------------|----------------------------·
|             Solc version: 0.8.17+commit.8df45f5f             ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·······························································|···························|·············|·····························
|  Methods                                                     ·               45 gwei/gas               ·       0.89 usd/matic       │
·························|·····································|·············|·············|·············|··············|··············
|  Contract              ·  Method                             ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155   ·  _setGouvernanceAddress             ·          -  ·          -  ·      46366  ·          14  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155   ·  initNewToken                       ·          -  ·          -  ·      99613  ·          13  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155   ·  publicMint                         ·      68039  ·      81723  ·      74881  ·          26  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155   ·  setBottleStatusToPublicMinting     ·          -  ·          -  ·      29014  ·          13  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155   ·  setBottleStatusToWhiteListMinting  ·          -  ·          -  ·      48359  ·          13  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor  ·  _onSetVotingSessionStatusToVoting  ·          -  ·          -  ·     117489  ·          11  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor  ·  _onSetVotingSessionToAuction       ·      51705  ·      82172  ·      64762  ·           7  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor  ·  addAuctionSell                     ·          -  ·          -  ·     100255  ·           1  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor  ·  deposit                            ·          -  ·          -  ·      21227  ·          18  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor  ·  Vote                               ·      85785  ·     134002  ·     110494  ·          10  ·       0.00  │
·························|·····································|·············|·············|·············|··············|··············
|  Deployments                                                 ·                                         ·  % of limit  ·             │
·······························································|·············|·············|·············|··············|··············
|  BacchusVaultERC1155                                         ·          -  ·          -  ·    3370099  ·      50.2 %  ·       0.13  │
·······························································|·············|·············|·············|··············|··············
|  BacchusVaultGovernor                                        ·    1842285  ·    1842297  ·    1842294  ·      27.4 %  ·       0.07  │
·--------------------------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```