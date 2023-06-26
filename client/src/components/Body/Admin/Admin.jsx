import "./Admin.css";
import ERC1155 from "./ERC1155";
import Governor from "./Governor";

function Admin() {

  return (
    <>
      <div className="admin-div">
        <h1>ERC1155 ADMINISTRATION</h1>
        <ERC1155 />
        <hr />
        <hr />
        <h1>GOVERNOR ADMINISTRATION</h1>
        <Governor />
      </div>

    </>

  )
}

export default Admin;