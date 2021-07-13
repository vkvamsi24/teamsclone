import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing components
import DropdownMenu from "../shared/DropdownMenu";
import DrawerRightSearch from "./DrawerRightSearch";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DrawerRightInfo from "./DrawerRightInfo";
import TooltipCustom from "../shared/TooltipCustom";
import { toastInfo } from "../shared/toastInfo";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
//importing material-ui-icons
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import VideocamIcon from '@material-ui/icons/Videocam';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

//importing styles
import "./ChatHeader.css";

function ChatHeader({
  roomCreatedBy,
  roomOwner,
  roomName,
  roomId,
  _roomId,
  messages,
  db,
  history,
  isRoomExist,
  firebase
}) {
  const [{ user }] = useStateValue();
  const [drawerRightSearch, setDrawerRightSearch] = useState(false);
  const [drawerRightInfo, setDrawerRightInfo] = useState(false);
  const [menuChat, setMenuChat] = useState(null);
  const [role, setRole] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [isLastMessage, setIsLastMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaveopen,setleaveopen]=useState(false);
  const [group,setGroup]=useState([]);
  const[mems,setMems]=useState([]);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [copied, setCopied] = useState(false);
  
  const [roomKey,setRoomKey]=useState(null);
  const [callOpen, setCallOpen] = React.useState(false);


  const dontwant = () => {
    window.location = "http://localhost:3000";
  };

  const handleGroupLinkOpen = () => {
    setGroupOpen(true);
  };

  const handleGroupLinkClose = () => {
    setGroupOpen(false);
  };

  const handleCallOpen = () => {
    setCallOpen(true);
  };

  const handleCallClose = () => {
    setCallOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    deleteRoom();
  };

  const handleLeaveOpen = () => {
    setleaveopen(true);
  };

  const handleLeaveClose = () => {
    setleaveopen(false);
    exitgroup(user.uid);
    
  };

  const newVideoCall=()=>{
    setCallOpen(false);
    console.log("Beginning of video call");
    var result='';
        
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 25; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
   }
   var meetinglink="http://localhost:7000/join/"+result;

   window.open(meetinglink);


   db.collection("rooms")
   .doc(roomId)
    .collection("messages")
    .add({
      message: "New meeting started. Open the below link to join 👇 👇 👇",
      name: user.displayName,
      uid: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
   })
   .then(function () {
    console.log("Document successfully updated!");
    
    
  })
  .catch(function (error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
  });


  
  db.collection("rooms")
  .doc(roomId)
   .collection("messages")
   .add({
     message: meetinglink,
     name: user.displayName,
     uid: user.uid,
     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .then(function () {
   console.log("Document successfully updated!");
   
   
 })
 .catch(function (error) {
   // The document probably doesn't exist.
   console.error("Error updating document: ", error);
 });

   








  }

  const handleVideoCall = () => {
    console.log("User wants to start a video call")
   
handleCallOpen();

    

    
  };






 useEffect(() => {
   
  db.collection("rooms")
  .doc(roomId)
  .onSnapshot(function (doc) {
            
            
    var roomkey=doc.data().roomkey;
    
    setRoomKey(roomkey);
    
    
   
    
  })




 }, [groupOpen]) // eslint-disable-line









  const exitgroup=(idtoremove)=>{
    console.log(idtoremove);
    var grps=group;
    console.log(grps);
    console.log(roomId);
    console.log(_roomId);
    var index = grps.indexOf(_roomId);
    console.log(index);
   if (index > -1) {
    grps.splice(index, 1);
    }
    console.log(grps);
    setGroup(grps);

    console.log(group);

    var members=mems;
       
         index = members.indexOf(idtoremove);
         console.log(index);
           if (index > -1) {
            members.splice(index, 1);
            }
            
        
        
   setMems(members);
   console.log(members);
   console.log(mems);



   if (user.uid) {
    db.collection("users")
      .doc(user.uid)
      .update({
        groups: group,
      })
      .then(function () {
        console.log("Document successfully updated!");
        const roomDeleted = "roomDeleted";
        toastInfo("Performing task. Please wait.", roomDeleted, "top-center");
        
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });



      db.collection("rooms")
      .doc(roomId)
      .update({
        members: mems,
      })
      .then(function () {
        console.log("Document successfully updated!");
         
        
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });


      db.collection("rooms")
           .doc(roomId)
            .collection("messages")
            .add({
             message: "A person just left the group",
              notification: true,
             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
           })
           .then(function () {
            console.log("Document successfully updated!");
            
            setTimeout(function() {
              window.location.reload();
         }, 5000);
            
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });

          


      




    
  }











    
  }

  useEffect(() => {
    
    if (user.uid) {
        db.collection("users")
          .doc(user.uid)
          .onSnapshot(function (doc) {
            
            
            var grps=doc.data().groups;
            console.log(grps);
            
            
            setGroup(grps);
            
            
           
            
          })

}
  
}, [leaveopen]) // eslint-disable-line


useEffect(() => {

  if (user.uid) {
    db.collection("rooms")
      .doc(roomId)
      .onSnapshot(function (doc) {
        
        
        var members=doc.data().members;
       
        
        
        setMems(members);
        console.log(members);
        console.log(mems);
        
       
        
      })

}



}, [leaveopen]) // eslint-disable-line











  useEffect(() => {
    const errorAbout = "errorAbout";
    if (user.uid) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setRole(doc.data().role);
          }
        })
        .catch(function (error) {
          toastInfo(`${error}`, errorAbout, "top-center");
        });
    }

    if (messages[messages.length - 1]?.timestamp) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }

    if (messages[messages.length - 1]) {
      setIsLastMessage(true);
    } else {
      setIsLastMessage(false);
    }

    //listens when room is changed, then it closes DrawerRight
    if (isRoomExist >= 0) {
      setDrawerRightInfo(false);
      setDrawerRightSearch(false);
    }
  }, [user.uid, user.displayName, user.isAnonymous, db, messages, roomId,isRoomExist]);

  console.log("ROOOM ID", roomId);
  console.log("__ROOOM ID", _roomId);

  const getDateFromMessage = () => {
    return new Date(
      messages[messages.length - 1]?.timestamp?.toDate()
    ).toLocaleTimeString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  const getDateLocal = () => {
    return new Date().toLocaleTimeString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  const searchMessage = () => {
    setDrawerRightSearch(true);
  };

  

  

  const viewMembers = () => {
    handleGroupLinkOpen();
  };

  

  const deleteRoom = () => {
    const roomDeleted = "roomDeleted";
    

     if (roomOwner === user.uid || role === "admin") {
     db.collection("rooms")
       .doc(roomId)
        .delete()
        .then(function () {
         toastInfo("Deleting chat room. Please wait.", roomDeleted, "top-center");
         setTimeout(function() {
           window.location.reload();
      }, 5000);
         
        })
        .catch(function (error) {
          
          toastInfo(`Error removing room! ${error}`, roomDeleted, "top-center");
        });
      history.push("/");
    } else {
      toastInfo(
        `Cant delete the group. You are not the group admin`,
        roomDeleted,
         "top-center"
      );
    }
  };

  const handleMenuClose = () => {
    setMenuChat(null);
  };

  const handleMenuOpen = (event) => {
    setMenuChat(event.currentTarget);
  };

  const menuChatLists = [
    
    
    {
      title: "View group invite link",
      onClick: () => viewMembers(),
      id: Math.random() * 100000,
    },
    {
      title: "Leave Group",
      onClick: () => handleLeaveOpen(),
      id: Math.random() * 100000,
    },
    
    {
      title: "Delete Group",
      onClick: () => handleClickOpen(),
      id: Math.random() * 100000,
    }
  ];

  return (
    <div>
      <div>
        <div>
        <Dialog
        open={callOpen}
        onClose={handleCallClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Are you sure want to initiate a video call?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCallClose} color="primary">
            Cancel
          </Button>
          <Button onClick={newVideoCall} color="primary" autoFocus>
            Start
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      <div>
      
      <Dialog
        open={groupOpen}
        onClose={handleGroupLinkClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Tooltip title="Click to copy to clipboard" arrow>
          <span className={copied ? 'lucky-coupon coupon-applied' : 'lucky-coupon'} >
        <span className="lucky-coupon-code"></span>
        
          
        <CopyToClipboard text={"http://localhost:3000/rooms/join/"+roomKey} onCopy={() => {

setCopied(true);
setTimeout(function() {
 setCopied(false);
}, 500);
}
 
 
 
 }>
 <p className="copy-code">{"http://localhost:3000/rooms/join/..."}</p>
</CopyToClipboard>
        

      </span>
      </Tooltip>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGroupLinkClose} color="primary">
            Close
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
      </div>
      <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete the group?
          </DialogContentText>
          <DialogActions>
          <Button onClick={dontwant} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
          
        </DialogContent>
        
      </Dialog>
      </div>
      <div>
      <Dialog
        open={leaveopen}
        onClose={handleLeaveClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to leave the group?
          </DialogContentText>
          <DialogActions>
          <Button onClick={dontwant} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeaveClose} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
          
        </DialogContent>
        
      </Dialog>
      </div>
      
    <div className="chat__header">
      
      <DrawerRightSearch
        drawerRightSearch={drawerRightSearch}
        setDrawerRightSearch={setDrawerRightSearch}
        roomId={roomId}
        messages={messages}
        db={db}
        user={user}
      />

      <DrawerRightInfo
        drawerRightInfo={drawerRightInfo}
        setDrawerRightInfo={setDrawerRightInfo}
        roomId={roomId}
        messages={messages}
        db={db}
        user={user}
      />

      <Hidden smUp>
        <Link to="/">
          <div className="chat__back_button">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </div>
        </Link>
      </Hidden>

      <Avatar>{roomName[0]}</Avatar>
      <div className="chat__headerInfo">
        <h3>{roomName}</h3>
        <Hidden only={["xs"]}>
          {isLastMessage ? (
            <>
              {showDate ? (
                <p>Last activity at {getDateFromMessage()}</p>
              ) : (
                <p>Last activity at {getDateLocal()}</p>
              )}
            </>
          ) : null}
        </Hidden>
      </div>

      <div className="chat__headerRight">

        <TooltipCustom
          name="Search"
          icon={<SearchOutlinedIcon style={{fill: "white"}} />}
          onClick={searchMessage}
        />
        

        
<TooltipCustom
          name="Video Call"
          icon={<VideocamIcon style={{fill: "white"}} onClick={handleVideoCall}/>}

         
        />








        <TooltipCustom
          name="Menu"
          icon={<MoreVertIcon style={{fill: "white"}} />}
          onClick={handleMenuOpen}
        />
        <DropdownMenu 
          menuLists={menuChatLists}
          menu={menuChat}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          
        />
      </div>
    </div>
    </div>
  );
}

export default ChatHeader;
