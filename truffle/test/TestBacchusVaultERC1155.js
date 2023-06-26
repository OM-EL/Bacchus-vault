const BacchusVaultERC1155 = artifacts.require("BacchusVaultERC1155");
const { BN, expectRevert, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require('@openzeppelin/test-helpers/src/constants');
const { expect } = require('chai');

contract("BacchusVault", accounts => {

  let _owner = accounts[0];
  let _user1 = accounts[1];
  let _user2 = accounts[2];

  let BacchusVaultERC1155Instance;

  beforeEach(async function () {
    BacchusVaultERC1155Instance = await BacchusVaultERC1155.new({ from: _owner });
  });

  context("\n:::: Id ::::", function () {
    describe(":: getCurrentId function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.initNewToken(10, 1, "", { from: _owner });
      });

      it("...should return the current token id", async () => {
        let id = await BacchusVaultERC1155Instance.getCurrentId();
        expect(id).to.be.bignumber.equal(BN(1));
      });

    })
  });

  context("\n:::: Supply ::::", function () {
    describe(":: getMaxSupply function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.initNewToken(100, 1, "", { from: _owner });
      });

      it("...should return the max supply of a token id", async () => {
        let maxSupply = await BacchusVaultERC1155Instance.getMaxSupply(0);
        expect(maxSupply).to.be.bignumber.equal(BN(100));
      });
    });

  });

  context("\n:::: Mint price ::::", function () {
    describe(":: getMintPrice function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.initNewToken(10, 1, "", { from: _owner });
      });

      it("...should return the mint price of a token id", async () => {
        let mintPrice = await BacchusVaultERC1155Instance.getMintPrice(0);
        expect(mintPrice).to.be.bignumber.equal(ether('1'));
      });

    });
  });

  context("\n:::: Status management ::::", function () {
    const PreRelease = BN(0);
    const WhiteListMinting = BN(1);
    const PublicMinting = BN(2);
    const Hold = BN(3);
    const ReadyToBeSold = BN(4);
    const Sold = BN(5);
    const ReadyToBurn = BN(6);

    beforeEach(async function () {
      await BacchusVaultERC1155Instance.initNewToken(10, 1, "", { from: _owner });
    });

    describe(":: setBottleStatusToWhiteListMinting function ::", function () {

      it("...should update the status from PreRelease to WhiteListMinting", async () => {
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(PreRelease);
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(WhiteListMinting);
      });

      it("...should revert is the status is not 0", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
        await expectRevert(BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner }), "status != from PreRelease");
      });

    });

    describe(":: setBottleStatusToPublicMinting function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
      });

      it("...should update the status from WhiteListMinting to PublicMinting", async () => {
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(WhiteListMinting);
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(PublicMinting);
      });

      it("...should revert is the status is not WhiteListMinting", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        await expectRevert(BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner }), " status != from WhiteListMinting ");
      });

    });

    // TODO: to add in governance tests
    describe.skip(":: setBottleStatusToSold function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('10');
        await BacchusVaultERC1155Instance.publicMint(0, 10, { from: _owner, value: _value });
        await BacchusVaultERC1155Instance._setBottleStatusToHold(0, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToReadyToBeSold(0, { from: _owner });
      });

      it("...should update the status from ReadyToBeSold to Sold", async () => {
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(ReadyToBeSold);
        await BacchusVaultERC1155Instance.setBottleStatusToSold(0, { from: _owner });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(Sold);
      });

      it("...should revert is the status is not ReadyToBeSold", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToSold(0, { from: _owner });
        await expectRevert(BacchusVaultERC1155Instance.setBottleStatusToSold(0, { from: _owner }), " status != from ReadyToBeSold");
      });

    });

    // TODO: to add in governance tests
    describe.skip(":: setBottleStatusToReadyToBurn function ::", function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('10');
        await BacchusVaultERC1155Instance.publicMint(0, 10, { from: _owner, value: _value });
        await BacchusVaultERC1155Instance._setBottleStatusToHold(0, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToReadyToBeSold(0, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToSold(0, { from: _owner });
      });

      it("...should update the status from Sold to ReadyToBurn", async () => {
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(Sold);
        await BacchusVaultERC1155Instance.setBottleStatusToReadyToBurn(0, { from: _owner });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(ReadyToBurn);
      });

      it("...should revert is the status is not Sold", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToReadyToBurn(0, { from: _owner });
        await expectRevert(BacchusVaultERC1155Instance.setBottleStatusToReadyToBurn(0, { from: _owner }), " status != from Sold");
      });

    });

  });

  context("\n:::: Whitelist ::::", function () {

    describe(':: isAddressInwhitelist ::', function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
      });

      it("...should return true if an address is whitelisted", async () => {
        let bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_owner, { from: _owner });
        expect(bool).to.be.true;
      });

      it("...should return false if an address is not whitelisted", async () => {
        let bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_user1, { from: _owner });
        expect(bool).to.be.false;
      });

    });

    describe(':: addAddressToWhitelist ::', function () {

      it("...should add an address to the whitelist", async () => {
        let bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_owner, { from: _owner });
        expect(bool).to.be.false;
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
        bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_owner, { from: _owner });
        expect(bool).to.be.true;
      });

      it("...should revert if caller is not the owner", async () => {
        await expectRevert(BacchusVaultERC1155Instance.addAddressToWhitelist(_user1, { from: _user1 }), "Ownable: caller is not the owner");
      });

    });

    describe(':: removeAddressFromWhitelist ::', function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
      });

      it("...should remove an address to the whitelist", async () => {
        let bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_owner, { from: _owner });
        expect(bool).to.be.true;
        await BacchusVaultERC1155Instance.removeAddressFromWhitelist(_owner, { from: _owner });
        bool = await BacchusVaultERC1155Instance.isAddressInwhitelist(_owner, { from: _owner });
        expect(bool).to.be.false;
      });

      it("...should revert if caller is not the owner", async () => {
        await expectRevert(BacchusVaultERC1155Instance.removeAddressFromWhitelist(_owner, { from: _user1 }), "Ownable: caller is not the owner");
      });

    });

  });

  context("\n:::: Mint ::::", function () {

    const WhiteListMinting = BN(1);
    const PublicMinting = BN(2);
    const Hold = BN(3);

    describe(':: initNewToken function ::', function () {

      it("...should increment the current token id", async () => {
        let currentId = await BacchusVaultERC1155Instance.getCurrentId();
        expect(currentId).to.be.bignumber.equal(BN(0));
        await BacchusVaultERC1155Instance.initNewToken(100, 1, "", { from: _owner });
        currentId = await BacchusVaultERC1155Instance.getCurrentId();
        expect(currentId).to.be.bignumber.equal(BN(1));
      });

      it("...should update the max supply of the current token id", async () => {
        await BacchusVaultERC1155Instance.initNewToken(100, 1, "", { from: _owner });
        let maxSupply = await BacchusVaultERC1155Instance.getMaxSupply(0);
        expect(maxSupply).to.be.bignumber.equal(BN(100));
      });

      it("...should update the current token uri", async () => {
        let uri = await BacchusVaultERC1155Instance.uri(0);
        expect(uri).to.be.equal("");
        await BacchusVaultERC1155Instance.initNewToken(100, 1, "CIDEXAMPLE", { from: _owner });
        await BacchusVaultERC1155Instance.setTokenURI(0, "CIDEXAMPLE", { from: _owner });
        uri = await BacchusVaultERC1155Instance.uri(0);
        expect(uri).to.be.equal("ipfs://CIDEXAMPLE");
      });

      it("...should revert if not the owner", async () => {
        await expectRevert(BacchusVaultERC1155Instance.initNewToken(100, 1, "", { from: _user1 }), "Ownable: caller is not the owner");
      });

      it("...should revert if mint price less than 1 MATIC", async () => {
        await expectRevert(BacchusVaultERC1155Instance.initNewToken(100, 0, "", { from: _owner }), "mint price too low");
      });

    });

    describe(':: whiteListMint function ::', function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.initNewToken(10, 1, "", { from: _owner });
        await BacchusVaultERC1155Instance.addAddressToWhitelist(_owner, { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
      });

      it("...should mint 1 token", async () => {
        let balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(0));
        let _value = ether('1');
        await BacchusVaultERC1155Instance.whiteListMint(0, 1, { from: _owner, value: _value });
        balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(1));
      });

      it("...should mint 10 tokens", async () => {
        let balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(0));
        let _value = ether('10');
        await BacchusVaultERC1155Instance.whiteListMint(0, 10, { from: _owner, value: _value });
        balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(10));
      });

      it("...should update the status from WhiteListMinting to Hold if soldout", async () => {
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(WhiteListMinting);
        let _value = ether('10');
        await BacchusVaultERC1155Instance.whiteListMint(0, 10, { from: _owner, value: _value });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(Hold);
      });

      it("...should revert if the amount exceeds the max supply", async () => {
        let _value = ether('11');
        await expectRevert(BacchusVaultERC1155Instance.whiteListMint(0, 11, { from: _owner, value: _value }), "mint amount exceeds maxSupply");
      });

      it("...should revert if the contract is paused", async () => {
        await BacchusVaultERC1155Instance.pause();
        let _value = ether('1');
        await expectRevert(BacchusVaultERC1155Instance.whiteListMint(0, 1, { from: _owner, value: _value }), "Pausable: paused");
      });

      it("...should revert if the current status is not WhiteListMinting", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('1');
        await expectRevert(BacchusVaultERC1155Instance.whiteListMint(0, 1, { from: _owner, value: _value }), "status != from WhiteListMinting");
      });

      it("...should revert if the wrong value is sent", async () => {
        let _value = ether('7');
        await expectRevert(BacchusVaultERC1155Instance.whiteListMint(0, 1, { from: _owner, value: _value }), "wrong value");
      });

      it("...should emit an event", async () => {
        let _value = ether('1');
        let transaction = await BacchusVaultERC1155Instance.whiteListMint(0, 1, { from: _owner, value: _value });
        expectEvent(transaction, "TransferSingle", {
          operator: _owner,
          from: ZERO_ADDRESS,
          to: _owner,
          id: BN(0),
          value: BN(1),
        });
      });
    });

    describe(':: publicMint function ::', function () {

      beforeEach(async function () {
        await BacchusVaultERC1155Instance.initNewToken(10, 1, "", { from: _owner });
        await BacchusVaultERC1155Instance.setBottleStatusToWhiteListMinting(0, { from: _owner });
      });

      it("...should mint 1 token", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(0));
        let _value = ether('1');
        await BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: _value });
        balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(1));
      });

      it("...should mint 10 tokens", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(0));
        let _value = ether('10');
        await BacchusVaultERC1155Instance.publicMint(0, 10, { from: _owner, value: _value });
        balance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        expect(balance).to.be.bignumber.equal(BN(10));
      });

      it("...should mint tokens for multiple users", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let ownerBalance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        let user1Balance = await BacchusVaultERC1155Instance.balanceOf(_user1, 0);
        let user2Balance = await BacchusVaultERC1155Instance.balanceOf(_user2, 0);
        expect(ownerBalance).to.be.bignumber.equal(BN(0));
        expect(user1Balance).to.be.bignumber.equal(BN(0));
        expect(user2Balance).to.be.bignumber.equal(BN(0));
        let ownerAmount = ether('1');
        let user1Amount = ether('2');
        let user2Amount = ether('3');
        await BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: ownerAmount });
        await BacchusVaultERC1155Instance.publicMint(0, 2, { from: _user1, value: user1Amount });
        await BacchusVaultERC1155Instance.publicMint(0, 3, { from: _user2, value: user2Amount });
        ownerBalance = await BacchusVaultERC1155Instance.balanceOf(_owner, 0);
        user1Balance = await BacchusVaultERC1155Instance.balanceOf(_user1, 0);
        user2Balance = await BacchusVaultERC1155Instance.balanceOf(_user2, 0);
        expect(ownerBalance).to.be.bignumber.equal(BN(1));
        expect(user1Balance).to.be.bignumber.equal(BN(2));
        expect(user2Balance).to.be.bignumber.equal(BN(3));
      });

      it("...should mint the total remaining supply of the token", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let balance = await BacchusVaultERC1155Instance.balanceOf(_user1, 0);
        expect(balance).to.be.bignumber.equal(BN(0));
        let amount = ether('10');
        await BacchusVaultERC1155Instance.publicMint(0, 10, { from: _user1, value: amount });
        balance = await BacchusVaultERC1155Instance.balanceOf(_user1, 0);
        expect(balance).to.be.bignumber.equal(BN(10));
      });

      it("...should update the status from PublicMinting to Hold if soldout", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(PublicMinting);
        let _value = ether('10');
        await BacchusVaultERC1155Instance.publicMint(0, 10, { from: _owner, value: _value });
        status = await BacchusVaultERC1155Instance.getBottleStatus(0, { from: _owner });
        expect(status).to.be.bignumber.equal(Hold);
      });

      it("...should revert if the amount exceeds the max supply", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('11');
        await expectRevert(BacchusVaultERC1155Instance.publicMint(0, 11, { from: _owner, value: _value }), "mint amount exceeds maxSupply");
      });

      it("...should revert if the contract is paused", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        await BacchusVaultERC1155Instance.pause();
        let _value = ether('1');
        await expectRevert(BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: _value }), "Pausable: paused");
      });

      it("...should revert if the current status is not PublicListMinting", async () => {
        let _value = ether('1');
        await expectRevert(BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: _value }), "status != from PublicListMinting");
      });

      it("...should revert if the wrong value is sent", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('7');
        await expectRevert(BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: _value }), "wrong value");
      });

      it("...should emit an event", async () => {
        await BacchusVaultERC1155Instance.setBottleStatusToPublicMinting(0, { from: _owner });
        let _value = ether('1');
        let transaction = await BacchusVaultERC1155Instance.publicMint(0, 1, { from: _owner, value: _value });
        expectEvent(transaction, "TransferSingle", {
          operator: _owner,
          from: ZERO_ADDRESS,
          to: _owner,
          id: BN(0),
          value: BN(1),
        });
      });
    });

  });

  context("\n:::: Uri ::::", function () {

    beforeEach(async function () {
      await BacchusVaultERC1155Instance.setTokenURI(0, "QmchUSJq7ih5uHKJZYUh2i8cGCq1NWRPiHjxSxGE6UJmdr", { from: _owner });
    });

    describe(":: setBaseURI function ::", function () {

      it("...should update the base URI", async () => {
        await BacchusVaultERC1155Instance.setBaseURI("https://", { from: _owner });
        let uri = await BacchusVaultERC1155Instance.uri(0);
        expect(uri).to.be.equal("https://QmchUSJq7ih5uHKJZYUh2i8cGCq1NWRPiHjxSxGE6UJmdr");
      });

    });

    describe(":: setTokenUri function ::", function () {

      it("...should update a token URI", async () => {
        await BacchusVaultERC1155Instance.setTokenURI(0, "abcdef", { from: _owner });
        let uri = await BacchusVaultERC1155Instance.uri(0);
        expect(uri).to.be.equal("ipfs://abcdef");
      });

    });

    describe(":: uri function ::", function () {

      it("...should return a token URI if set", async () => {
        let uri = await BacchusVaultERC1155Instance.uri(0);
        expect(uri).to.be.equal("ipfs://QmchUSJq7ih5uHKJZYUh2i8cGCq1NWRPiHjxSxGE6UJmdr");
      });

      it("...should return an empty string if not set", async () => {
        let uri = await BacchusVaultERC1155Instance.uri(1);
        expect(uri).to.be.equal("");
      });

    });

  });

  context("\n:::: Name ::::", function () {

    describe(":: name function ::", function () {

      it("...should return the collection name", async () => {
        let name = await BacchusVaultERC1155Instance.name();
        expect(name).to.be.equal("Bacchus Vault");
      });

    });
  });

  context("\n:::: Royalties ::::", function () {

    beforeEach(async function () {
      // create 3 tokens id
      await BacchusVaultERC1155Instance.initNewToken(10, 1, { from: _owner });
      await BacchusVaultERC1155Instance.initNewToken(10, 1, { from: _owner });
      await BacchusVaultERC1155Instance.initNewToken(10, 1, { from: _owner });
    });

    describe(":: setDefaultRoyalty function ::", function () {

      it("...should update the royalty for all tokens", async () => {
        let address = "0xdFCB30B9E7EF4384cEE523664DA13B2e8B9e4169";
        let royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        let royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        let receiverAddress1 = royaltyInfo1[0];
        let receiverAddress2 = royaltyInfo2[0];
        let fees1 = royaltyInfo1[1];
        let fees2 = royaltyInfo2[1];
        expect(receiverAddress1).to.be.equal(ZERO_ADDRESS);
        expect(receiverAddress2).to.be.equal(ZERO_ADDRESS);
        expect(fees1).to.be.bignumber.equal(BN(0));
        expect(fees2).to.be.bignumber.equal(BN(0));

        await BacchusVaultERC1155Instance.setDefaultRoyalty(address, 50, { from: _owner });

        royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('100'));
        receiverAddress1 = royaltyInfo1[0];
        receiverAddress2 = royaltyInfo2[0];
        fees1 = royaltyInfo1[1];
        fees2 = royaltyInfo2[1];
        expect(receiverAddress1).to.be.equal(address);
        expect(receiverAddress2).to.be.equal(address);
        expect(fees1).to.be.bignumber.equal(ether('5'));
        expect(fees2).to.be.bignumber.equal(ether('50'));
      });

    });

    describe(":: setTokenRoyalty function ::", function () {

      it("...should update the royalty for one token", async () => {
        let address1 = "0xdFCB30B9E7EF4384cEE523664DA13B2e8B9e4169";
        let address2 = "0xc6Ea96cAD37f58c83a6E6e525aFB749D84f54395";

        await BacchusVaultERC1155Instance.setDefaultRoyalty(address1, 50, { from: _owner });
        await BacchusVaultERC1155Instance.setTokenRoyalty(1, address2, 10, { from: _owner });

        let royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        let royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        let royaltyInfo3 = await BacchusVaultERC1155Instance.royaltyInfo(2, ether('10'));
        let receiverAddress1 = royaltyInfo1[0];
        let receiverAddress2 = royaltyInfo2[0];
        let receiverAddress3 = royaltyInfo3[0];
        let fees1 = royaltyInfo1[1];
        let fees2 = royaltyInfo2[1];
        let fees3 = royaltyInfo3[1];

        expect(receiverAddress1).to.be.equal(address1);
        expect(receiverAddress2).to.be.equal(address2);
        expect(receiverAddress3).to.be.equal(address1);
        expect(fees1).to.be.bignumber.equal(ether('5'));
        expect(fees2).to.be.bignumber.equal(ether('1'));
        expect(fees3).to.be.bignumber.equal(ether('5'));
      });

    });

    describe(":: deleteDefaultRoyalty function ::", function () {

      it("...should delete the default royalty for all tokens", async () => {
        let address1 = "0xdFCB30B9E7EF4384cEE523664DA13B2e8B9e4169";
        await BacchusVaultERC1155Instance.setDefaultRoyalty(address1, 50, { from: _owner });
        await BacchusVaultERC1155Instance.setTokenRoyalty(1, address1, 10, { from: _owner });

        let royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        let royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        let receiverAddress1 = royaltyInfo1[0];
        let receiverAddress2 = royaltyInfo2[0];
        let fees1 = royaltyInfo1[1];
        let fees2 = royaltyInfo2[1];
        expect(receiverAddress1).to.be.equal(address1);
        expect(receiverAddress2).to.be.equal(address1);
        expect(fees1).to.be.bignumber.equal(ether('5'));
        expect(fees2).to.be.bignumber.equal(ether('1'));

        await BacchusVaultERC1155Instance.deleteDefaultRoyalty({ from: _owner });

        royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        receiverAddress1 = royaltyInfo1[0];
        receiverAddress2 = royaltyInfo2[0];
        fees1 = royaltyInfo1[1];
        fees2 = royaltyInfo2[1];
        expect(receiverAddress1).to.be.equal(ZERO_ADDRESS);
        expect(receiverAddress2).to.be.equal(address1);
        expect(fees1).to.be.bignumber.equal(ether('0'));
        expect(fees2).to.be.bignumber.equal(ether('1'));
      });

    });

    describe(":: resetTokenRoyalty function ::", function () {

      it("...should delete the royalty for one token", async () => {
        let address1 = "0xdFCB30B9E7EF4384cEE523664DA13B2e8B9e4169";
        let address2 = "0xc6Ea96cAD37f58c83a6E6e525aFB749D84f54395";
        await BacchusVaultERC1155Instance.setDefaultRoyalty(address1, 50, { from: _owner });
        await BacchusVaultERC1155Instance.setTokenRoyalty(1, address2, 10, { from: _owner });
        let royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        let royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        let royaltyInfo3 = await BacchusVaultERC1155Instance.royaltyInfo(2, ether('10'));
        let receiverAddress1 = royaltyInfo1[0];
        let receiverAddress2 = royaltyInfo2[0];
        let receiverAddress3 = royaltyInfo3[0];
        let fees1 = royaltyInfo1[1];
        let fees2 = royaltyInfo2[1];
        let fees3 = royaltyInfo3[1];
        expect(receiverAddress1).to.be.equal(address1);
        expect(receiverAddress2).to.be.equal(address2);
        expect(receiverAddress3).to.be.equal(address1);
        expect(fees1).to.be.bignumber.equal(ether('5'));
        expect(fees2).to.be.bignumber.equal(ether('1'));
        expect(fees3).to.be.bignumber.equal(ether('5'));

        await BacchusVaultERC1155Instance.resetTokenRoyalty(1, { from: _owner });

        royaltyInfo1 = await BacchusVaultERC1155Instance.royaltyInfo(0, ether('10'));
        royaltyInfo2 = await BacchusVaultERC1155Instance.royaltyInfo(1, ether('10'));
        royaltyInfo3 = await BacchusVaultERC1155Instance.royaltyInfo(2, ether('10'));
        receiverAddress1 = royaltyInfo1[0];
        receiverAddress2 = royaltyInfo2[0];
        receiverAddress3 = royaltyInfo3[0];
        fees1 = royaltyInfo1[1];
        fees2 = royaltyInfo2[1];
        fees3 = royaltyInfo3[1];
        expect(receiverAddress1).to.be.equal(address1);
        expect(receiverAddress2).to.be.equal(address1);
        expect(receiverAddress3).to.be.equal(address1);
        expect(fees1).to.be.bignumber.equal(ether('5'));
        expect(fees2).to.be.bignumber.equal(ether('5'));
        expect(fees3).to.be.bignumber.equal(ether('5'));
      });

    });

  });

  context("\n:::: Pause ::::", function () {

    describe(":: pause function ::", function () {

      it("...should set pause", async () => {
        let paused = await BacchusVaultERC1155Instance.paused();
        expect(paused).to.be.false;
        await BacchusVaultERC1155Instance.pause();
        paused = await BacchusVaultERC1155Instance.paused();
        expect(paused).to.be.true;
      });

    });

    describe(":: unpause function ::", function () {

      it("...should unpause contract", async () => {
        await BacchusVaultERC1155Instance.pause();
        let paused = await BacchusVaultERC1155Instance.paused();
        expect(paused).to.be.true;
        await BacchusVaultERC1155Instance.unpause();
        paused = await BacchusVaultERC1155Instance.paused();
        expect(paused).to.be.false;
      });

    });

  });

});