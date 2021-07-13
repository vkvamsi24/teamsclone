import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Room from './components/Room/Room'
import { useStateValue } from "./StateProvider";

//importing firebase
import db from "./firebase";
import { auth, firebase } from "./firebase";
//importing actions
import { setUser } from "./actions/userAction";
//importing components
import Login from "./Login";
import Sidebar from "../src/Sidebar/Sidebar";
import Chat from "../src/Chat/Chat";
import { ToastContainer } from "react-toastify";
import { toastInfo } from "./shared/toastInfo";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import JoinChat from '../src/Chat/JoinChat';
//importing styles
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {

  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [isRoomExist, setIsRoomExist] = useState("");
  const [loading, setLoading] = useState(false);
  var check=[];

 

  




  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
        setLoading(true);

        db.collection("rooms")
          .orderBy("timestamp", "desc")
          
          
          .onSnapshot((snapshot) =>
          
          //   setRooms(
          //     snapshot.docs.map((doc) => (doc.data().members.includes(authUser.uid)&&{ 
          //       id: doc.id,
          //       data: doc.data(),
          //     }))

             
          //   )
            snapshot.docs.map((doc)=>{ // eslint-disable-line
              if(doc.data().members.includes(authUser.uid)){
              check = [ ...check, {id: doc.id,data:doc.data()} ]; // eslint-disable-line
              setRooms(check);
              }
            })
           );

          

        if (authUser.isAnonymous === true && authUser.displayName === null) {
          var anonymousName = "Anonymous" + " " + Math.floor(Math.random() * 1000000); // eslint-disable-line

          auth.currentUser.updateProfile({
            displayName: anonymousName,
            photoURL: "",
          });

          db.collection("users")
            .doc(authUser.uid)
            .set({
              name: anonymousName,
              about: "Hi! I'm new to teams",
              photoURL: "",
              role: "anonymous",
              groups: [],
              dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function () {
              console.log("Document successfully updated!");
            })
            .catch(function (error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        }

        if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL !== null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                // console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  name: authUser.displayName,
                  about: "Hi! I'm new to teams",
                  photoURL: user.photoURL,
                  role: "regular",
                  groups: [],
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        } else if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL === null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  name: authUser.displayName,
                  about: "Hi! I'm new to teams",
                  photoURL: "",
                  role: "regular",
                  groups: [],
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        }
      } else {
        dispatch(setUser(null));
        setLoading(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, user]);






  return (
    <div className={`app ${loading === false && "app-no-bg"}`}>
      {loading ? (
        <>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
          {!user ? (
            <Login />
          ) : (
            <div className="app__body">

<Router>
     
        <Switch>
         
          {/* <Route exact path="/videocall/:roomId/:username" component={Main} /> */}
          <Route exact path="/room/:roomId" component={Room} />

          
         
        </Switch>
     
    </Router>



              <Router>
                <Switch>
                  
                  <Route exact path="/">
                    <Sidebar
                      rooms={rooms}
                      setIsRoomExist={setIsRoomExist}
                      isRoomExist={isRoomExist}
                    />
                    <Hidden only={["xs"]}>
                      {" "}
                      {/* Chat component will be hidden in mobile view */}
                      <Chat isRoomExist={isRoomExist} />
                    </Hidden>
                  </Route>

                  <Route exact path="/rooms/:roomId">
                    <Hidden only={["xs"]}>
                      {" "}
                      {/* Sidebar component will be hidden in mobile view */}
                      <Sidebar
                        rooms={rooms}
                        setIsRoomExist={setIsRoomExist}
                        isRoomExist={isRoomExist}
                      />
                    </Hidden>
                    <Chat isRoomExist={isRoomExist} />
                  </Route>

                  <Route exact path="/rooms/join/:roomkey">
                    
                      <JoinChat
                        newUser={user.uid}
                      />
                  
                    
                  </Route>

                  {/* <Route path="*">
                    <Redirect to="/" />
                  </Route> */}
                </Switch>
              </Router>
            </div>
          )}
        </>
      ) : (
        <div className="app__loading">
          <div>
            <div className="app__loading_circular">
              <CircularProgress />
            </div>
            <div className="app__loading_linear">
              <LinearProgress />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;