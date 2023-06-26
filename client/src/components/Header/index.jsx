import Banner from "./Banner";
import ConnectButton from "./ConnectButton";
import Menu from "./Menu";
import "./index.css";

function Header({ pages, setCurrentPage }) {

  return (
    <>
      <div className="banner-div">
        <Banner />
        <ConnectButton />
      </div>
      <div className="menu-div">
        <Menu
          pages={pages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>

  )
}

export default Header;