const BacchusVaultERC1155 = artifacts.require("BacchusVaultERC1155");
const BacchusVaultGovernor = artifacts.require("BacchusVaultGovernor");
const { BN, expectRevert, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require('@openzeppelin/test-helpers/src/constants');
const { expect } = require('chai');
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

contract("BacchusVault", accounts => {

  let _owner = accounts[0];
  let _user1 = accounts[1];
  let _user2 = accounts[2];
  let _user3 = accounts[3];
  let _bottleId1;

  let BacchusVaultERC1155Instance;
  let BacchusVaultGovernorInstance;

  let address_Gouvernance;
  let address_ERC1155;

  beforeEach(async function () {
    BacchusVaultERC1155Instance = await BacchusVaultERC1155.new({ from: _owner });
    await BacchusVaultERC1155Instance.initNewToken(20, 1, { from: _owner });
    _bottleId1 = 0;
    await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(_bottleId1);
    await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(_bottleId1);
    let user1AmountBottle1 = ether('11');
    let user2AmountBottle1 = ether('9');
    await BacchusVaultERC1155Instance.publicMint(_bottleId1, 11, { from: _user1, value: user1AmountBottle1 });
    await BacchusVaultERC1155Instance.publicMint(_bottleId1, 9, { from: _user2, value: user2AmountBottle1 });

    address_ERC1155 = BacchusVaultERC1155Instance.address;
    BacchusVaultGovernorInstance = await BacchusVaultGovernor.new(address_ERC1155, { from: _owner });
    address_Gouvernance = BacchusVaultGovernorInstance.address;
    await BacchusVaultERC1155Instance._setGouvernanceAddress(address_Gouvernance, { from: _owner });
    await BacchusVaultGovernorInstance.deposit({ from: _owner });
    //await web3.eth.sendTransaction({from: _owner,to: address_Gouvernance, value: web3.utils.toWei("1", "ether")})
  });

  context("\n:::: Selling Session Status Management ::::", function () {

    describe(":: test _onSetVotingSessionStatusToVoting Method ::", function () {

      it("... sould reverse if the caller is not the owner", async () => {
        await expectRevert(BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _user1 }) , "Ownable: caller is not the owner" );
      });

      it("... should update status to Voting when calling _onSetVotingSessionStatusToVoting", async () => {

        let initalState = await BacchusVaultGovernorInstance.getSellingSessionStatus();
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        let updatedState = await BacchusVaultGovernorInstance.getSellingSessionStatus();
        let isVoting = await BacchusVaultERC1155Instance.getVoting.call();
        expect(initalState).to.be.bignumber.equal(BN(0));
        expect(updatedState).to.be.bignumber.equal(BN(1));
        expect(isVoting).to.be.true;
      });

      it("... sould reverse if the Status is different from Closed", async () => {
        await expectRevert(BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _user1 }) , "Ownable: caller is not the owner" );
      });

    })

    describe(":: test Vote Method ::", function () {
      
      it("... sould revert if the Status is different from Closed ", async () => {
        await expectRevert( BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user1 }) , " SelingSessionStatus != from Voting " );
      });

      it("... should have more than 0 share ", async () => {
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await expectRevert( BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user3 }) , " you should have at least one token to be able to vote ");
      });
      
      it("... should have more than 0 share to vote ", async () => {
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await expectRevert( BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user3 }) , " you should have at least one token to be able to vote ");
      });
     
      it("... voting  ", async () => {
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user1 });
        await BacchusVaultGovernorInstance.Vote(0 , false ,{ from: _user2 });
        expect(await BacchusVaultGovernorInstance.getVotedToHold( 0 , _user1)).to.be.true;
        expect(await BacchusVaultGovernorInstance.getVotedToHold( 0 , _user2)).to.be.false;
        expect(await BacchusVaultGovernorInstance.getVoted( 0 , _user1)).to.be.true;
        expect(await BacchusVaultGovernorInstance.getVoted( 0 , _user2)).to.be.true;
      }); 


    })

    describe(":: test _onSetVotingSessionToAuction Method ::", function () {
      it("... sould reverse if the caller is not the owner", async () => {
        await expectRevert(BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _user1 }) , "Ownable: caller is not the owner" );
      });

      it("... voting when sell  ", async () => {
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await BacchusVaultGovernorInstance.Vote(0 , false ,{ from: _user1 });
        await BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user2 });
        await BacchusVaultGovernorInstance._onSetVotingSessionToAuction({ from: _owner });
        expect(await BacchusVaultGovernorInstance.getSellingSessionStatus( { from: _owner })).to.be.bignumber.equal(BN(2));
        expect(await BacchusVaultERC1155Instance.getBottleStatus( _bottleId1 ,{ from: _owner })).to.be.bignumber.equal(BN(4));
        
      }); 

      it("... voting when hold  ", async () => {
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user2 });
        await BacchusVaultGovernorInstance._onSetVotingSessionToAuction({ from: _owner });
        expect(await BacchusVaultGovernorInstance.getSellingSessionStatus( { from: _owner })).to.be.bignumber.equal(BN(2));
        expect(await BacchusVaultERC1155Instance.getBottleStatus( _bottleId1 ,{ from: _owner })).to.be.bignumber.equal(BN(3));
        
      }); 

    })

    describe(":: test addAuctionSell Method ::", function () {
      it("... sould reverse if the caller is not the owner", async () => {
        await expectRevert(BacchusVaultGovernorInstance.addAuctionSell(_bottleId1 , 20000 ,{ from: _user1 }) , "Ownable: caller is not the owner" );
      });

      it("... Add Auction On Hold Bottle  ", async () => {
        let AuctionPriceBottle1 = 20000;
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user1 });
        await BacchusVaultGovernorInstance.Vote(0 , false ,{ from: _user2 });
        let vat = await BacchusVaultGovernorInstance._onSetVotingSessionToAuction({ from: _owner });
        await expectRevert( BacchusVaultGovernorInstance.addAuctionSell( _bottleId1 , 20000 , { from: _owner }) , "bottle status != from ReadyToBeSold" );
        
      });

      it("... Add Auction On ReadyToBeSold Bottle   ", async () => {
        let AuctionPriceBottle1 = 20000;
        await BacchusVaultGovernorInstance._onSetVotingSessionStatusToVoting({ from: _owner });
        await BacchusVaultGovernorInstance.Vote(0 , false ,{ from: _user1 });
        await BacchusVaultGovernorInstance.Vote(0 , true ,{ from: _user2 });
        await BacchusVaultGovernorInstance._onSetVotingSessionToAuction({ from: _owner });
        await BacchusVaultGovernorInstance.addAuctionSell( _bottleId1 , AuctionPriceBottle1 , { from: _owner });
        expect( (await BacchusVaultGovernorInstance.getBottleAuctionResults(_bottleId1)).sold ).to.be.true;

      });

    })

  })
  });

