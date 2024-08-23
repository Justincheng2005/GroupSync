import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GroupIcon from "../../assets/2.png";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { GroupContext } from "../../context/groupContext"; 
import GroupDropdown from "../group-dropdown/GroupDropdown";
import React, {useState} from "react";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const { currentGroup } = useContext(GroupContext);


  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>temp</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="group-dropdown-container">
          <button className = "group-dropdown-button" onClick={()=> setIsVisible(!isVisible)}>
            <img src={GroupIcon} alt=""/>
            {/* <img src={currentGroup.profilePic} alt=""/> add handling if there is no currentGroup*/}
            <div>{currentGroup.groupName}</div>
          </button>
          <GroupDropdown isVisible={isVisible}/>
        </div>
        
      </div>
      <div className="right">
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <button className="user">
          <Link to= { "/profile/:"+currentUser.id }>
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
