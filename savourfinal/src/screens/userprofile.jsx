import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import "./userprofile.css"
import Cart from "./Cart.jsx";

const UserProfile  = ()=>{
    const [showPopup, setShowPopup] = useState(false);
    const [profile, setProfile] = useState({ posts: [] });
    const [rating, setRating] = useState(0);
    const [allRatings, setAllRatings] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [items, setItems] = useState([])
    const {userid}= useParams()


    //sharma
    
    useEffect(() => {
        fetchItems();
    }, []);
    const fetchItems = async () => {
        try {
        const menuResponse = await fetch("http://localhost:5000/api/auth/allitems", {
            method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            vendorId: userid
        })
        });

        if (!menuResponse.ok) {
            throw new Error("Failed to fetch data");
        }

        const menuData = await menuResponse.json();
        console.log("Fetched menu data:", menuData);

        if (Array.isArray(menuData)) {
            setItems(menuData);
        } else {
            console.error("Menu data received is not an array");
        }
        } catch (error) {
        console.log("Error fetching data:", error);
        }
    };

    //sharma
    
    const togglePopup = () => {
        setShowPopup(!showPopup);
      };

      const handlePopUpSubmit = () => {
        const userId = JSON.parse(localStorage.getItem("user")).userid;
        fetch("http://localhost:5000/api/auth/post-ratings",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                ratings: rating, 
                comment: feedback, 
                vendorId: userid, 
                userId: userId
            })
        }).then(res=>res.json())
        .then(data=>{
    
            if(data.error){
            alert(data.errors)
            M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                alert("Thank You for your Ratings")
                M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
                // history('/home')
            }
        }).catch(err=>{
            console.log(err)
        })
        setShowPopup(!showPopup);
      };

      useEffect(()=>{
         fetch("http://localhost:5000/api/auth/getRatings",{
             method:"post",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 vendorId: userid
             })
         }).then(res=>res.json())
         .then(data=>{
            setAllRatings(data.allRatings);
         }).catch(err=>{
             console.log(err)
         })
     },[])

    useEffect(()=>{
       fetch(`http://localhost:5000/api/auth/user/${userid}`,{
        method:"get",
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
       }).then(res=>res.json())
       .then(result=>{
           setProfile(result);
       })
    },[userid])
    // useEffect(()=>{
    //    if(image){
    //     const data = new FormData()
    //     data.append("file",image)
    //     data.append("upload_preset","insta-clone")
    //     data.append("cloud_name","cnq")
    //     fetch("https://api.cloudinary.com/v1_1/cnq/image/upload",{
    //         method:"post",
    //         body:data
    //     })
    //     .then(res=>res.json())
    //     .then(data=>{
    
       
    //        fetch('/updatepic',{
    //            method:"put",
    //            headers:{
    //                "Content-Type":"application/json",
    //                "Authorization":"Bearer "+localStorage.getItem("jwt")
    //            },
    //            body:JSON.stringify({
    //                pic:data.url
    //            })
    //        }).then(res=>res.json())
    //        .then(result=>{
    //            console.log(result)
    //            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
    //            dispatch({type:"UPDATEPIC",payload:result.pic})
    //            //window.location.reload()
    //        })
       
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    //    }
    // },[image])
    // const updatePhoto = (file)=>{
    //     setImage(file)
    // }
   return (
       <div style={{maxWidth:"680px",margin:"50px"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey",
               display:"flex",
               justifyContent:"space-around"
           }}>
         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px", marginRight:"40px"}}
                   src=""
                   />
                 
               </div>
               <div>
                   <h4 className='text-light' style={{display:"inline"}}>{profile.user && profile.user.userid}</h4>
                   <p style={{color:"green", display:"inline", marginLeft:"10px"}}>{profile.isVendor=="true" ? "(Vendor)":""}</p>
                   {/* <h5>{state?state.email:"loading"}</h5> */}
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6 className='text-warning'>{profile.posts && profile.posts.length} posts</h6>
                   </div>
                   {profile.isVendor=="true" && <button type="button" className="btn btn-danger btn-sm" style={{margin:"2px"}} data-bs-toggle="offcanvas" data-bs-target="#menuOffCampus" aria-controls="offcanvasScrolling"> MENU </button>}
                   {profile.isVendor=="true" && <button className="btn btn-danger btn-sm" type="button" style={{margin:"3px"}} data-bs-toggle="offcanvas" data-bs-target="#ratingsOffCampus" aria-controls="offcanvasScrolling">VIEW RATINGS</button>}
                        
                        {/* RATINGS FRONTEND START*/}

                    <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="ratingsOffCampus" aria-labelledby="offcanvasScrollingLabel" style={{maxWidth:"350px"}}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasScrollingLabel">RATINGS</h5>
                        
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <button type="button" className="btn btn-danger btn-sm" style={{margin:"2px 20px"}} onClick={togglePopup}>Rate Now</button>
                    <div className="offcanvas-body">
                            {allRatings.length > 0 && allRatings.map(item => (
                                <div className="card" style={{maxWidth:"350px"}}>
                                    <div className="card-header" style={{fontSize:"10px",marginBottom:"2px", marginTop:"0px"}}>
                                        {item.userId}
                                    </div>
                                    <div className="card-body">
                                        <p style={{fontSize:"16px", fontWeight:"bold", marginBottom:"2px"}} >Rating: {item.ratings}</p>
                                        <p style={{fontSize:"10px", marginBottom:"2px"}}>{item.comment}</p>
                                    </div>
                                </div>
                            ))}
                            {/* )) */}
                        {/* } */}  
                    </div>
                    </div>

                        {/* RATINGS FRONTEND START*/}

                    
                        {/* MENU FRONTEND START*/}

                    <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="menuOffCampus" aria-labelledby="offcanvasScrollingLabel" style={{width:"480px"}}>
                        <div className="offcanvas-header" style={{margin:"0px"}}>
                            <h5 className="offcanvas-title" id="offcanvasScrollingLabel" style={{margin:"0px"}}>MENU</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style={{margin:"0px"}}></button>
                        </div>
                        <div className="offcanvas-body"> 
                            <Cart items={items} vendorId={userid}/>
                        </div>
                    </div>
                    
                        {/* MENU FRONTEND END*/}

                        {/* POP UP TO RATE VENDOR */}

                        {showPopup && (
                            <div className="popup-overlay">
                            <div className="popup">
                                <div className="head">
                                    <h5 className="popup-heading" style={{display:"inline", color:"rgb(214, 121, 7)"}}>Please Rate</h5>
                                    <button className="btn-close" onClick={togglePopup}></button>
                                </div>
                                <div className="rating">
                                <label style={{color:"black", width:"100%"}}>
                                    Rating:
                                    <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    />
                                    {rating}
                                </label>
                                </div>
                                <div className="feedback">
                                <label style={{color:"black", width:"100%"}}>
                                    Feedback:
                                    <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    maxLength={50} style={{color:"black"}}
                                    />
                                </label>
                                </div>
                                <button className="submit-btn" onClick={handlePopUpSubmit}>
                                Submit
                                </button>
                            </div>
                            </div>
                        )}

                        {/* POP UP TO RATE VENDOR */}

               </div>
           </div>
        
            {/* <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div> */}
            </div>      
           <div className="gallery">
               {
                   profile.posts.map(item=>{
                       return(
                        <img className="item1" src={item.photo} alt={item.title} width="220px" height="220px" style={{margin:"2px"}}/>
                       )
                   })
               }

           
           </div>
       </div>
   )
}


export default UserProfile