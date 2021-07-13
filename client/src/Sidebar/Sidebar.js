import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing firebase
import db from "../firebase";
import { auth, storage, firebase } from "../firebase";
//importing components
import UserAvatar from "./UserAvatar";
import NewGroup from "./NewGroup";
import DropdownMenu from "../shared/DropdownMenu";
import DrawerLeft from "./DrawerLeft";
import SearchBar from "../shared/SearchBar";
import SidebarChat from "./SidebarChat";
import { toastInfo } from "../shared/toastInfo";
import TooltipCustom from "../shared/TooltipCustom";
//importing material-ui
import MoreVertIcon from "@material-ui/icons/MoreVert";

//importing styles
import "./Sidebar.css";

function Sidebar({ rooms, setIsRoomExist, isRoomExist,newUser }) {
  const history = useHistory();
  const { roomId } = useParams();
  const [{ user }] = useStateValue();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState(null);
  const [isSearchFound, setIsSetSearchFound] = useState(false);

//   useEffect(() => {
    
//     var arr=rooms;
//     console.log(arr);
    
//     arr.forEach(function(element,index){


//       console.log(element.data.members);
//       console.log(index);
//       console.log(element.data.members.includes(user.uid) )

// console.log(element.data);
//   });

//   }, [rooms])
 

  const findRoom = function (myRooms) {
    return function (x) {
      var searchRoom = x.data.name + "";
      return (
        searchRoom.toLowerCase().includes(myRooms.toLowerCase()) || !myRooms
      );
    };
  };

  useEffect(() => {
    const roomResult = () => {
      return (
        <>
          {rooms.filter(findRoom(search)).map((room) => (
            <p key={room.id}>{room.name}</p>
          ))}
        </>
      );
    };

    if (search) {
      var result = roomResult();
      // console.log("result", result)
      if (result.props.children.length > 0) {
        setIsSetSearchFound(true);
        // console.log("search sucess");
      } else {
        setIsSetSearchFound(false);
        // console.log("search fail");
      }
    }

    //checks if room exists, else will be redirect to landing screen
    var roomList = rooms;
    if (roomList) {
      //checks if the current route(roomId) exists in roomList(array)
      const index = roomList.findIndex(function (id, index) {
        return id.id === roomId;
      });

      if (index >= 0) {
        setIsRoomExist(index);
        // console.log("ROOM EXISTS");
      } else if (index === -1) {
        setIsRoomExist(index);
        history.push("/");
        // console.log("ROOM DOES NOT EXIST");
      }
    }
  }, [search, rooms, roomId, history, setIsRoomExist]);











  // useEffect(() => {
  //   if (rooms) {
  //     if (rooms.length > 0) {
  //       setNoRooms(false);
  //       setLoading(true);
  //     } else if (rooms.length === 0 && isRoomExist === -1) {
  //       setNoRooms(true);
  //       setLoading(true);
  //     }
  //   }
    
  // }, [rooms]);



  useEffect(() => {
    let isComponentMounted = true;
      const seerooms = async () => {
       
        if(isComponentMounted) {
          if (rooms) {
            if (rooms.length > 0) {
              setNoRooms(false);
              setLoading(true);
            } else if (rooms.length === 0 && isRoomExist === -1) {
              setNoRooms(true);
              setLoading(true);
            }
          }
        }
      };
      seerooms();
      return () => {
        isComponentMounted = false;
      }
    }, [rooms]); // eslint-disable-line






  // console.log("ROOMS> >", noRooms);
  // console.log("ROOMS EXIST> >", isRoomExist);

  const handleDrawerLeftOpen = () => {
    setMenuSidebar(null);
    setDrawerLeft(true);
  };

  const handleMenuOpen = (event) => {
    setMenuSidebar(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuSidebar(null);
  };

  

  const settings = () => {
    const settings = "settings";
    toastInfo("Settings is not yet available!", settings, "top-center");
  };

  const logout = () => {
    if (user.isAnonymous === true) {
      auth.currentUser
        .delete()
        .then(function () {
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          console.log("error deleting anonymous user", error);
        });
    } else {
      
     
      auth.signOut();
      window.location.reload();
    }
  };

  const menuLists = [
    {
      title: "Profile",
      onClick: () => handleDrawerLeftOpen(),
      id: Math.random() * 100000,
    },
    
    {
      title: "Project Info",
      onClick: () => settings(),
      id: Math.random() * 100000,
    },
    {
      title: "Logout",
      onClick: () => logout(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <UserAvatar
          id="UserProfile"
          photoURL={user.photoURL}
          onClick={() => handleDrawerLeftOpen()}
        />
        <DrawerLeft
          drawerLeft={drawerLeft}
          setDrawerLeft={setDrawerLeft}
          db={db}
          auth={auth}
          storage={storage}
        />

        <div className="sidebar__headerRight">
         
          
          <NewGroup db={db} user={user} firebase={firebase} />
          
          <TooltipCustom
            name="Menu"
            icon={<MoreVertIcon style={{fill: "white"}} />}
            onClick={handleMenuOpen}
          />
          <DropdownMenu
            menuLists={menuLists}
            menu={menuSidebar}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
          />
        </div>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search or start new chat"
      />

      <div className="sidebar__chats">
        {loading ? (
          <>
            {search ? (
              <>
                {isSearchFound ? (
                  <div>
                    {rooms.filter(findRoom(search)).map((room) => (
                      <SidebarChat
                        key={room.id}
                        id={room.id}
                        name={room.data.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="sidebar__chatsContainer_empty">
                    <span>No chat room found</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {rooms.map((room) => (
                  <SidebarChat
                    key={room.id}
                    id={room.id}
                    name={room.data.name}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <div className="sidebar__chatsContainer_loading">
            <div>
            <span>No chats</span>
            </div>
          </div>
        )}

        {noRooms && loading ? (
          <div className="sidebar__chatsContainer_empty">
            <span>No chats</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
