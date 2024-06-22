// createpost.jsx

import React, {useState, useEffect} from "react";
import './createpost.css';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';

const CreatePost=()=>{
  const history = useNavigate()
  const [title, setTitle]= useState("")
  const [body, setBody]= useState("")
  const [image, setImage]= useState("")
  const [mediaPreview, setMediaPreview]=useState("")
  const [url,setUrl] = useState("")

  useEffect(()=>{
    if(url){
    const { id, userid } = JSON.parse(localStorage.getItem("user"));
     fetch("http://localhost:5000/api/auth/createpost",{
         method:"post",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             title,
             body,
             pic:url,
             postedBy: {id:id, username: userid}
         })
     }).then(res=>res.json())
     .then(data=>{
 
        if(data.error){
          alert(data.errors)
           M.toast({html: data.error,classes:"#c62828 red darken-3"})
        }
        else{
            alert("Created post Successfully")
            M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
            // history('/home')
        }
     }).catch(err=>{
         console.log(err)
     })
 }
 },[url])

  const handleMediaChange=(e)=>{
    const file=e.target.files[0]
    setImage(file)
    if (file){
      const reader= new FileReader();
      reader.onload=()=>{
        setMediaPreview(reader.result);
      }
      reader.readAsDataURL(file)
    }
  }

  const postDetails= () =>{
    const data= new FormData()
    data.append("file", image)
    data.append("upload_preset","savour")
    data.append("cloud_name", "drze1lkbu")
    fetch("https://api.cloudinary.com/v1_1/drze1lkbu/image/upload", {
    method:"post",
    body: data
  })
  .then(res=>res.json())
  .then(data=>{
    setUrl(data.url)
  }).catch(error=>
  {
    console.log(error)
  })
  }

    return (
        < div className="container mt-4 shadow-sm bgcolor" style={{margin: "10px auto", maxWidth: "500px", padding:"20px", textAlign:"center", justifyContent:"center"}}>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1" >Title</span>
                <textarea className="form-control" aria-label="Title" onChange={(e)=> setTitle(e.target.value)}></textarea>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Description</span>
                <textarea className="form-control" aria-label="Description" onChange={(e)=> setBody(e.target.value)}></textarea>
            </div>
    
          {/* from bootstrap */}
    
          <div className="input-group mb-3">
            <input type="file" className="form-control" id="inputGroupFile02" onChange={handleMediaChange} />
            <label className="input-group-text" htmlFor="inputGroupFile02">
              Upload
            </label>
          </div>

          {mediaPreview && (
                <>
                  <img className="image-fluid m-2" src={mediaPreview} alt="MediaPreview" width="300px" height="300px"/>
                </>
              )
            }

          <input className="btn btn-primary" type="submit" value="Submit" style={{ display:"flex"}} onClick={()=>postDetails()}></input>
        </div>
      );
}

export default CreatePost;