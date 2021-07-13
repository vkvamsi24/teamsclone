import React from 'react';
import { auth, provider } from './firebase';
import { toastInfo } from './shared/toastInfo';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';
import GoogleLogo from './images/Google G Logo.png';
import './Login.css';



function Login() {
    const signInGoogle = () => {
        const google ="google";

        auth.signInWithPopup(provider)
            .catch((error) => toastInfo(`${error}`, google, "top-center"));
    };

    const handleMeeting=()=>{
        var result='';
        
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 25; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
   }
   var meetinglink="https://serverteams.herokuapp.com/join/"+result;

   window.open(meetinglink);

    }

   

    return (
        <div>
            
        <div className="login"> 

            <div className="login__container">
            <img 
                src="http://www.marshall.edu/it/files/microsoft-team-2019.png"
                alt="WhatsApp Logo" 
            />
            <div className="login__text">
                <h1>Sign in to Teams Clone</h1>
            </div>
            
            <div className="login__withGoogle" onClick={signInGoogle}>
                <img 
                    src={GoogleLogo}
                    alt="Google Logo" 
                />
                <span>Sign in with Google</span>
            </div>

            <div className="login__withGoogle login__Anonymously" onClick={handleMeeting} >
                < VideoCallOutlinedIcon />
                <span>Start a meeting now</span>
            </div>
    
            </div>
        </div>
        </div>
    )
}

export default Login
