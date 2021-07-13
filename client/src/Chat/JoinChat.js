import React,{ useState, useEffect } from 'react';
import {useParams } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useStateValue } from "../StateProvider";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import db from "../firebase";
import { firebase } from "../firebase";

export default function JoinChat(props) {
    const { roomkey } = useParams();
    const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [group,setGroup]=useState([]);
  const[mems,setMems]=useState([]);
  const[roomid,setRoomid]=useState([]);
  const [exists,setExists]=useState(false);
  const [{ user }] = useStateValue();
  var members=[];
  var ids;

  const dontWant = () => {
    window.location = "http://localhost:3000";
  };


  useEffect(() => {
    
        if (user.uid) {
            db.collection("users")
              .doc(user.uid)
              .onSnapshot(function (doc) {
                
                
                var grps=doc.data().groups;
               
                if(grps.includes(roomkey)){
                    setExists(true)
                }
                else{
                grps = [ ...grps, roomkey ];
                setGroup(grps);
                console.log(grps);
                console.log(group);
                }
               
                
              })

    }
      
  }, [open]) // eslint-disable-line


  useEffect(() => {
    
    if (user.uid) {
         db.collection("rooms")
         
          .where("roomkey", "==", roomkey)
          .onSnapshot(docs => {
            docs.forEach(doc => {
                
                members=[...members,doc.data().members] // eslint-disable-line
                ids=doc.data().id; // eslint-disable-line
                
            })
            
            setMems(members)
            setRoomid(ids)
            
        })

        

}


  
}, [open])



  const handleClose = () => {
    setOpen(false);
    console.log("User agreed to join the group");
    
    var grpmems= mems[0];
    var grpp= group;
    var roomide=roomid;
    console.log(roomid);
    console.log(grpmems);
    console.log(grpp);
    grpmems=[...grpmems,user.uid];
    
    grpp.push(roomid);
    console.log(grpmems);
    console.log(grpp);

    db.collection("users")
    .doc(user.uid)
    .update({
      groups: grpp,
    })
    .then(function () {
      console.log("Document successfully updated!");
      
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
    console.log(roomide);

    db.collection("rooms")
    .doc(roomide)
    .update({
      members: grpmems,
    })
    .then(function () {
      console.log("Document successfully updated!");
      
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });


    db.collection("rooms")
           .doc(roomide)
            .collection("messages")
            .add({
             message: user.displayName+ " joined the group using the invite link",
              notification: true,
             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
           })
           .then(function () {
            console.log("Document successfully updated!");
            window.location.href = "http://localhost:3000";
            
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });

          

    
    


  };

    console.log(props.newUser+"Is trying to join "+roomkey);
    return (
        <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            
        {exists ?(
        <>Info</>
        ): <>Join Chat?</>
      }
            
            
            
            
            
            
            
            </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {exists ?(
        <>You are already a member of this chat.</>
        ): <> You were invited to join the chat. Upon confirming, you will be added to the chat group. </>
      }
            
           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={dontWant} color="primary">
            Close
          </Button>
          {
          
          

          
          !exists && <Button onClick={handleClose} color="primary" autoFocus>
            Confirm
          </Button>




      }
          
        </DialogActions>
      </Dialog>
    )
}
