import InitNewToken from "./Bottles/InitNewToken";
import SetBottleStatus from "./Status/SetBottleStatus";
import BaseURI from "./URI/BaseURI";
import TokenURI from "./URI/TokenURI";
import AddAddressToWhitelist from "./Whitelist/AddAddressToWhitelist";
import RemoveAddressTowhitelist from "./Whitelist/RemoveAddressToWhitelist";
import SetBottleActualSellingPrice from "./Bottles/SetBottleActualSellingPrice";
import Pause from "./Pause/Pause";
import Unpause from "./Pause/Unpause";
import SetDefaultRoyalty from "./Royalties/SetDefaultRoyalty";
import SetTokenRoyalty from "./Royalties/SetTokenRoyalty";
import DeleteDefaultRoyalty from "./Royalties/DeleteDefaultRoyalty";
import ResetTokenRoyalty from "./Royalties/ResetTokenRoyalty";
import Ownership from "./Ownership/Ownership";

function ERC1155() {
  return (
    <>
      <div>
        <h2>Bottles</h2>
        <InitNewToken />
        <SetBottleActualSellingPrice />
      </div>
      <hr />
      <div>
        <h2>Status</h2>
        <SetBottleStatus />
      </div>
      <hr />
      <div>
        <h2>URI</h2>
        <BaseURI />
        <TokenURI />
      </div>
      <hr />
      <div>
        <h2>Whitelist</h2>
        <AddAddressToWhitelist />
        <RemoveAddressTowhitelist />
      </div>
      <hr />
      <div>
        <h2>Pause</h2>
        <Pause />
        <Unpause />
      </div>
      <hr />
      <div>
        <h2>Royalties</h2>
        <SetDefaultRoyalty />
        <SetTokenRoyalty />
        <DeleteDefaultRoyalty />
        <ResetTokenRoyalty />
      </div>
      <hr />
      <div>
        <h2>Ownership</h2>
        <Ownership />
      </div>
    </>
  )
}

export default ERC1155;