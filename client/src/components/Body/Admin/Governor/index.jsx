import ToVoting from "./Status/ToVoting";
import ToAuction from "./Status/ToAuction";
import ToClosed from "./Status/ToClosed";

import AddAuctionSell from "./Auction/AddAuctionSell";
import UpdateAuctionSell from "./Auction/UpdateAuctionSell";
import DeleteAuctionSell from "./Auction/DeleteAuctionSell";

import Ownership from "./Ownership/Ownership";

import Deposit from "./Deposit/Deposit";

function Governor() {
  return (
    <>
      <div>
        <h2>Status</h2>
        <ToVoting />
        <ToAuction />
        <ToClosed />
      </div>
      <hr />
      <div>
        <h2>Auction</h2>
        <AddAuctionSell />
        <UpdateAuctionSell />
        <DeleteAuctionSell />
      </div>
      <hr />
      <div>
        <h2>Ownership</h2>
        <Ownership />
      </div>
      <hr />
      <div>
        <h2>Send value</h2>
        <Deposit />
      </div>
    </>
  )
}

export default Governor;