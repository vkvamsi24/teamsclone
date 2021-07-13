import React, { useState,useEffect } from 'react';
import TooltipCustom from '../shared/TooltipCustom';
// import db from '../firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'

import Tooltip from '@material-ui/core/Tooltip';
import GroupIcon from '@material-ui/icons/Group';

import { CopyToClipboard } from 'react-copy-to-clipboard';



function NewGroup({ user, db, firebase }) {
    const [roomName, setRoomName] = useState("");
    const [open, setOpen] = useState(false);
    const [addopen, setaddOpen] = useState(false);
    const [result, setResult] = useState("");
    const [group,setGroup]=useState([]);
  const [copied, setCopied] = useState(false);
    
    
    
    function makeid() {
        var result='';
        
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 30; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
      setResult(result)
    }


    useEffect(() => {
        

        makeid();

        
    }, [])









    
    function addtogrp(roomid){
        if (user.uid) {

          


        db.collection("users")
          .doc(user.uid)
          .onSnapshot(function (doc) {
            
            
            var grps=doc.data().groups;
           
            grps.push(roomid); 
             
            setGroup(grps);
            
            console.log(grps);
            console.log(group);
           
            
            
          });
    }}

    function append(){
        if (user.uid) {
            db.collection("users")
              .doc(user.uid)
              .update({
                groups: group,
              })
              .then(function () {
                console.log("Document successfully updated!");
                
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
      
            
          }
    }

    //  useEffect(() => {
    //     append()
        
    //    }, [group])
      
    
    















    useEffect(() => {
        if(open){
    addtogrp()
        }
        
      }, [open]); // eslint-disable-line


      
      


    const handleClickOpen = () => {
        setaddOpen(true);
      };
    
      const handleClose = () => {
        setaddOpen(false);
        window.location.reload();
        
      };





    const handleNewGroupOpen = () => {
        setOpen(true);
    };

    const handleNewGroupClose = () => {
        setOpen(false);
        setRoomName("");
    };

    const createChat = (e) => {
        e.preventDefault();
        

        if(roomName) {
            if (user.uid) {
          console.log(result);
          db.collection("rooms")
            .add({
                roomOwner: user.uid,
                createdBy: user.displayName,
                name: roomName,
                roomkey: result,
                members: [user.uid],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function(docRef) {
                
              addtogrp(docRef.id);

                db.collection("rooms").doc(docRef.id).set({
                    id: docRef.id
                },{ merge: true });

                append();
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }}
       
        setOpen(false);
        setRoomName("");
        
        handleClickOpen();

       


    }

    return (
        <div>
            <TooltipCustom 
                name="New Chat" 
                onClick={() => handleNewGroupOpen()} 
                icon={<GroupIcon style={{fill: "white"}}  />}
            />

            <Dialog open={open} onClose={handleNewGroupClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Chat Room</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room Name"
                    type="text"
                    fullWidth
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNewGroupClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={createChat} color="primary" disabled={!roomName}>
                    Create
                </Button>
                </DialogActions>
            </Dialog>

            {/* for adding users */}


            <Dialog open={addopen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Chat Created Succesfully</DialogTitle>
        
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
        Use the below link to invite people to join the chat
          </DialogContentText>
         
          <DialogContentText id="alert-dialog-description">
          <Tooltip title="Click to copy to clipboard" arrow>
          <span className={copied ? 'lucky-coupon coupon-applied' : 'lucky-coupon'} >
        <span className="lucky-coupon-code"></span>
        
          
            <CopyToClipboard text={"http://localhost:3000/rooms/join/"+result} onCopy={() => {

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
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          
        </DialogActions>
      </Dialog>









        </div>
    )
}

export default NewGroup
