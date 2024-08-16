import plusSign from "../../assets/plus.png";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { GroupContext } from "../../context/groupContext";
import "./groupDropdown.scss";

const GroupDropdown = ({isVisible}) => {
  const { isLoading, error, data } = useQuery(["groups"], () =>
    makeRequest.get("/groups").then((res) => {
      return res.data;
    })
  );

  const { groupSwitch } = useContext(GroupContext);
  const { currentGroup } = useContext(GroupContext);

  //handle functions
  const handleSwitch = async (buttonInput) => {
    try {
      await groupSwitch(buttonInput);
    } catch (err) {
      console.log(err);
    }
  }
  const handleAddGroup = async (e) => {
    //navigate to add group page or open a popup
    e.preventDefault();

  }

  return (
    <>
        {isVisible ?  
          <>
          {error ? 
            "Something went wrong!"
            : isLoading ? 
            "loading"
            : <div className="groupDropdown-container"> 
                {data.map((group) => group.groupId == currentGroup.groupId ?  
                <button className = "element-curr" onClick={() => handleSwitch({id:group.groupId})}>
                      <img src={group.groupPic}/>
                      <div>{group.groupName}</div>
                  </button>
                  :
                  <button className = "element" onClick={() => handleSwitch({id:group.groupId})}>
                      <img src={group.groupPic}/>
                      <div>{group.groupName}</div>
                  </button>)
                }
                <button className="element" onClick={() => handleAddGroup()}>
                    <img src={plusSign}/>
                    <div>Add Group</div>
                </button>
              </div>
          }
          </>
        : null}
    </>
  );
};

export default GroupDropdown;