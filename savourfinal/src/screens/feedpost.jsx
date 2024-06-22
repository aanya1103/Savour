import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";

const FeedPost = () => {
  const [data, setData] = useState([]);
  // const [likedPosts, setLikedPosts] = useState([]);
  // const [dislikedPosts, setDislikedPosts] = useState([]);
  const { id, email } = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/allpost', {
      method: "get",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then(result => {
      setData(result.posts);
      // const likes = result.posts.filter(post => post.likes.includes(result.user._id)).map(post => post._id);
      // const dislikes = result.posts.filter(post => post.dislikes.includes(result.user._id)).map(post => post._id);
      // setLikedPosts(likes);
      // setDislikedPosts(dislikes);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
  }, []);

  const likePost = (idd) => {
    fetch('http://localhost:5000/api/auth/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: idd,
        userid: id
      })
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      setData(newData);
      // setLikedPosts([...likedPosts, id]);
      // setDislikedPosts(dislikedPosts.filter(postId => postId !== id));
    }).catch(err => {
      console.log(err);
    });
  };

  const dislikePost = (idd) => {
    console.log("Disliking post")
    fetch('http://localhost:5000/api/auth/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: idd,
        userid: id
      })
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      setData(newData);
      // setDislikedPosts([...dislikedPosts, id]);
      // setLikedPosts(likedPosts.filter(postId => postId !== id));
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <div className="home" style={{ marginBottom: "30px" }}>
      {data.length > 0 &&
        data.map(item => (
          <div
            className="card home-card"
            key={item._id}
            style={{
              maxWidth: "400px",
              maxHeight: "max-content",
              margin: "26px auto"
            }}
          >
            <h5 style={{ padding: "5px" }}> < Link to={item.postedBy.id !== id ?"/user/profile/"+item.postedBy.id : "/user/profile" }> {item.postedBy.username}</Link></h5>
            <div className="card-image">
              <img src={item.photo} alt="post" width="200px" height="250px"/>
            </div>
            <div className="card-content">
              {/* < i className="material-icons" style={{ color: "red" }}>
                favorite
              </i> */}

              { item.likes.includes(id) ? (
                <i className="material-icons" onClick={() => { dislikePost(item._id) }} style={{cursor:"default"}}>
                  thumb_down
                </i>
              ) : (
                <i className="material-icons" onClick={() => { likePost(item._id) }} style={{cursor:"default"}}>
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {/* <input type="text" placeholder="add a comment" /> */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FeedPost;
