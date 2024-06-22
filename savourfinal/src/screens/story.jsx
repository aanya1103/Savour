import React from "react";
import storypic from '../assets/storypic.png';

function Storybar(){
    return(
        <div className="container pt-3 pb-2" style={{ background: 'linear-gradient(0deg, #000000, #1d100d)'}}>
            < div className="container p-1 m-0" style={{height:'92px', width:'90px'}}>
                <div className="storybg container p-0" style={{ height: '76px', width: '76px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={storypic} alt="" className="round-circle" style={{maxWidth: '100%', maxHeight: '100%' }} />
                </div>
                <div className="container" style={{height:'16px', fontSize:'9px'}}> 
                    <p style={{display:'inline', fontWeight:'bold', color:'rgb(256,256,256)'}}>Harsha Sahni</p>
                </div>
            </div>
        </div>
    );
}

export default Storybar;