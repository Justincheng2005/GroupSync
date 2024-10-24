import plusSign from "../../assets/plus.png";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { GroupContext } from "../../context/groupContext";
import tempImg from "../../assets/tempImg.png"
import "./groupDropdown.scss";

const GroupDropdown = ({isVisible, stateChange}) => {
  const { isLoading, error, data } = useQuery(["groups"], () =>
    makeRequest.get("/groups").then((res) => {
      return res.data;
    })
  );

  const { groupSwitch, currentGroup, groupCreate, groupJoin } = useContext(GroupContext);
  const [ createVisible, setCreateVisible ] = useState(false);
  const [ joinVisible, setJoinVisible ] = useState(false);
  const [ groupName, setGroupName ] = useState("");
  const [ inviteCode, setInviteCode ] = useState("");

  const [err, setErr] = useState(null);

  //handle functions
  const handleSwitch = async (buttonInput) => {
    try {
      await groupSwitch(buttonInput);
    } catch (err) {
      console.log(err);
    }
  }

  const toggleCreatePopUp = async () => {
    setCreateVisible(!createVisible);
    setJoinVisible(false);
    setErr(null);
  }
  const toggleJoinPopUp = async () => {
    setJoinVisible(!joinVisible);
    setCreateVisible(false);
    setErr(null);
  }
  const handleCreateChange = (e) => {
    setGroupName(e.target.value);
  }

  const handleJoinChange = (e) => {
    setInviteCode(e.target.value);
  }

  const handleCreateGroup = async(e) => {
    e.preventDefault();
    try{
      await groupCreate({
        groupName: groupName,
        //groupPic: groupPic,
      });
      setCreateVisible(false);
      stateChange(false);
    } catch(err){
      setErr(err.response.data);
    }
  }

  const handleJoinGroup = async(e) => {
    e.preventDefault();
    try{
      await groupJoin({inviteCode: inviteCode});
      setJoinVisible(false);
      stateChange(false);
    } catch(err){
      setErr(err.response.data);
    }
  }

  return (
    <>
        {isVisible ?  
          <>
          {error ? 
            "Something went wrong!"
            : isLoading ? 
            "loading"
            : <div className="container">
                <div className="groupDropdown-container"> 
                  {data.map((group) => group.groupId === currentGroup.groupId ?  
                  <button className = "element-curr" key={group.groupId} onClick={() => handleSwitch({id:group.groupId})}>
                        <img src={group.groupPic} alt = ""/>
                        <div>{group.groupName}</div>
                    </button>
                    :
                    <button className = "element" onClick={() => handleSwitch({id:group.groupId})}>
                        <img src={group.groupPic} alt = ""/>
                        <div>{group.groupName}</div>
                    </button>)
                  }
                  {/* combine and redesign UI */}
                  <button className="element" onClick={toggleCreatePopUp}>
                      <img src={plusSign} alt="+"/>
                      <div>Create Group</div>
                  </button>
                  <button className="element" onClick={toggleJoinPopUp}>
                      <img src={plusSign} alt="+"/>
                      <div>Join Group</div>
                  </button>
                </div>
                {createVisible ? 
                  <div className="create-popUp">
                    <h2>Create Group</h2>
                    <form>
                      {/*add image upload*/}
                      <img src={tempImg} alt="Temp Image"></img>
                      <h6>Upload Group Profile Picture</h6>
                      <input type="text" placeholder="Group Name" className="groupName-input" name="groupName" onChange={handleCreateChange}/>
                      <h6>{err && err}</h6>
                      <button className="popup-submit" onClick={handleCreateGroup}>Create</button>
                    </form>
                  </div>
                : null
                }
                {joinVisible ? 
                  <div className="join-popUp">
                    <h2>Join Group</h2>
                    <form>
                      <input type="text" placeholder="Invite Code" className="inviteCode-input" name="inviteCode" onChange={handleJoinChange}/>
                      <h6>{err && err}</h6>
                      <button className="popup-submit" onClick={handleJoinGroup}>Join</button>
                    </form>
                  </div>
                : null
                }
              </div>
          }
          </>
        : null}
    </>
  );
};

export default GroupDropdown;