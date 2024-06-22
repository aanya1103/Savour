import React, { useState } from "react";
import {Cancel} from '@mui/icons-material';
import {CropIcon} from '@mui/icons-material';
import {Box, Button, DailogActions, DailogContent, Slider, Typography} from '@mui/icons-material';
import Cropper from 'react-easy-crop';

const Cropeasy=({photoURL, setOpenCrop})=>{
    const [crop, setCrop]= useState({x:0, y:0})
    const [zoom, setZoom]= useState(1)
    const [rotation, setRotation]= useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels]= useState(null)
    const cropComplete= (croppedArea, croppedAreaPixels)=>{
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const cropImage=async()=>{

    }

    return(
        <>
        <DailogContent dividers sx={{background: "#333333", position:"relative", height:400, width:"auto", minWidth:{sm:500}}}>
            <Cropper 
            image={photoURL}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
            />
        </DailogContent>
        <DailogActions>
            <box>
                <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                <Slider 
                valueLabelDisplay="auto"
                valueLabelFormat={zoomPercent}
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e,zoom)=> setZoom(zoom)}
                />
            </box>
            <box>
                <Typography>Rotation: {rotation}</Typography>
                <Slider 
                valueLabelDisplay="auto"

                    min={1}
                    max={3}

                    value={rotation}
                    onChange={(e,rotation)=> setRotation(rotation)}
                />
            </box>
            <box sx={{ display:"flex", gap:2, flexWrap:"wrap"}}>
                <Button
                varian='outlined'
                startIcon={<Cancel/>}
                onClick={()=> setOpenCrop(false)}
                >Cancel</Button>
                <Button
                varian='contained'
                startIcon={<CropIcon/>}
                onClick={cropImage}
                >Crop</Button>
            </box>
        </DailogActions>
        </>
    );
}

const zoomPercent=(value)=>{
    return '${Math.round(value * 100)}'
}

export default Cropeasy;

