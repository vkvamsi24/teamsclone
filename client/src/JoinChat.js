import React,{ useState} from 'react';
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
import db from "./firebase";

// nw

export default function JoinChat(props) {
    const { roomkey } = useParams();
    const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [group,setGroup]=useState([]);
  const [{ user }] = useStateValue();

  const dontWant = () => {
    window.location = "http://www.google.com"
  };

  const handleClose = () => {
    setOpen(false);
    console.log("User agreed to join the group");

    function addtogrp(){
        if (user.uid) {
            db.collection("users")
              .doc(user.uid)
              .onSnapshot(function (doc) {
                
                
                var grps=doc.data().groups;
               
                
                 
                
                grps = [ ...grps, {roomkey} ];
                setGroup(grps);
                console.log(group);
                console.log(group);
               
                
              })}

    }



        addtogrp();
    


  };

    console.log(props.newUser+"Is trying to join "+roomkey);
    return (
        <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Join Chat?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You were invited to join the chat. Upon confirming, you will be added to the chat group. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={dontWant} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
}
