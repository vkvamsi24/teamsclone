import React from "react";
import Divider from "@material-ui/core/Divider";
import teamslogo from "../images/teamslogo.png";
import "./ChatLandingScreen.css";
import Zoom from "@material-ui/core/Zoom";

function ChatLandingScreen({ showLandingScreenPhoto }) {
  return (
    <div className="chat-landing-screen">
      <div>
        <Zoom
          in={showLandingScreenPhoto}
          style={{ transitionDelay: showLandingScreenPhoto ? "300ms" : "0ms" }}
        >
          <img
            className="chat-landing-screen__photo"
            src={teamslogo}
            alt="Teams logo"
          />
        </Zoom>
      </div>

      

      <div>
        <p>
          This is clone of Microsoft Teams. 
          You can find the original application <a href="https://www.microsoft.com/en-in/microsoft-teams/group-chat-software">Here </a> 
          . Find me on <a href="https://github.com/vkvamsi24/">Github</a>
          

        </p>
      </div>

      <Divider />

      
    </div>
  );
}

export default ChatLandingScreen;
