import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  faHouse,
  faMinus,
  faPlus,
  faEdit,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./profile.css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [myorders, setMyOrders] = useState([]);
  const [pendingorders, setPendingOrders] = useState([]);
  const [oldorders, setOldOrders] = useState([]);
  const [usermyorders, setUserMyOrders] = useState([]);
  const [userpendingorders, setUserPendingOrders] = useState([]);
  const [usercancelorders, setUserCancelOrders] = useState([]);
  const [navSelect, setNavSelect] = useState("none");
  const [userNavSelect, setUserNavSelect] = useState("none");
  const [otp, setOtp] = useState();
  const [items, setItems] = useState([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [addItemMode, setAddItemMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { id, userid, isVendor } = JSON.parse(localStorage.getItem("user"));

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePostId, setDeletePostId] = useState();

  const [refresh, setReferesh] = useState(false);

  //pop up
  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const handleConfirmOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/orders/${selectedOrder.orderId}/updateStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }
      const data = await response.json();
      setSnackbarMessage(
        "Order accepted successfully! Please ensure the delivery is on time."
      );
      setOpenSnackbar(true);
      setShowPopup(false);
      setReferesh(!refresh);
    } catch (error) {
      setSnackbarMessage("Failed to accept the order.");
      setOpenSnackbar(true);
    }
  };

  //cancel order
  const handleCancelOrder = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/orders/${order.orderId}/updateStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "canceled" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }
      const data = await response.json();
      setSnackbarMessage("Order canceled successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to accept the order.");
      setOpenSnackbar(true);
      setReferesh(!refresh);
    }
  };
  //cancel order

  //cancel after payment order
  const handlePaidCancelOrder = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/orders/${order.orderId}/updateStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "paid canceled" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }
      const data = await response.json();
      setSnackbarMessage("Order canceled successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to accept the order.");
      setOpenSnackbar(true);
      setReferesh(!refresh);
    }
  };
  //cancel  aftre payment order

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleDeletePostPopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };
  //pop up

  //AAnya integrate

  useEffect(() => {
    if (isVendor == "true") {fetchItems(); }
  }, []);
  const [newItem, setNewItem] = useState({
    item: "",
    price: "",
    category: "",
  });

  const predefinedCategories = [
    "South Indian",
    "Indian",
    "Korean",
    "Italian",
    "Chinese",
  ];

  const fetchItems = async () => {
    try {
      console.log("hello");
      const menuResponse = await fetch("http://localhost:5000/api/auth/allitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          vendorId: id,
        }),
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/items/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );
      if (response.ok) {
        setItems(items.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = async (id, updatedItem) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (response.ok) {
        const updatedItems = items.map((item) =>
          item._id === id ? { ...item, ...updatedItem } : item
        );
        setItems(updatedItems);
        setEditItemId(null);
      } else {
        console.error("Failed to update item:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleClickUpdate = (id) => {
    const updatedItem = items.find((item) => item._id === id);
    console.log("Updating item with ID:", id, "Data:", updatedItem);
    handleUpdate(id, { item: updatedItem.item, price: updatedItem.price });
  };

  const toggleAddItemMode = () => {
    setAddItemMode(!addItemMode);
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e, fieldName) => {
    setItems(
      items.map((item) =>
        item._id === editItemId
          ? { ...item, [fieldName]: e.target.value }
          : item
      )
    );
  };

  const startEditingItem = (id) => {
    setEditItemId(id);
  };

  const addItem = async () => {
    try {
      if (!newItem.item || !newItem.price || !newItem.category) {
        alert(
          "Please fill in all three fields: Item Name, Price, and Category"
        );
        return;
      }

      if (newItem.price < 0) {
        alert("Price cannot be negative");
        return;
      }

      const vendorId = id;
      const newItemWithId = { ...newItem, vendorId };

      const response = await fetch("http://localhost:5000/api/auth/items/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemWithId),
      });

      if (!response.ok) {
        throw new Error(`Failed to add item: ${response.statusText}`);
      }
      const data = await response.json();
      setItems([...items, data]);
      setNewItem({ item: "", price: "", category: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const toggleSideMenu = () => {
    setShowSideMenu(!showSideMenu);
    setShowCart(false); // Close cart when opening side menu
  };

  //aanya integrate

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/mypost", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postedBy: { id, username: userid },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, [showDeletePopup]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/old-orders", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setOldOrders(result.myorders);
      });
  }, [refresh]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/my-orders", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setMyOrders(result.myorders);
      });
  }, [refresh]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/pending-orders", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPendingOrders(result.myorders);
      });
  }, [refresh]);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user")).id;
    fetch("http://localhost:5000/api/auth/getRatings", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        vendorId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllRatings(data.allRatings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const userid = JSON.parse(localStorage.getItem("user")).userid;
    console.log("NO", userid);
    fetch("http://localhost:5000/api/auth/user-my-orders", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserMyOrders(result.myorders);
      });
  }, []);

  useEffect(() => {
    const fetchUserCancelOrders = () => {
      const userid = JSON.parse(localStorage.getItem("user")).userid;
      fetch("http://localhost:5000/api/auth/user-cancel-orders", {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setUserCancelOrders(result.myorders);
        });
    };

    fetchUserCancelOrders(); // Initial fetch

    const interval = setInterval(fetchUserCancelOrders, 3 * 60 * 1000); // Fetch every 3 minutes

    return () => clearInterval(interval); // Clean up the interval
  }, []);

  useEffect(() => {
    const fetchUserPendingOrders = () => {
      const userid = JSON.parse(localStorage.getItem("user")).userid;
      fetch("http://localhost:5000/api/auth/user-pending-orders", {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setUserPendingOrders(result.myorders);
        });
    };

    fetchUserPendingOrders(); // Initial fetch

    const interval = setInterval(fetchUserPendingOrders, 3 * 60 * 1000); // Fetch every 3 minutes

    return () => clearInterval(interval); // Clean up the interval
  }, []);

  const handleOtpSubmit = async (orderId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            orderId,
            otp,
          }),
        }
      );

      if (!response.ok) {
        setSnackbarMessage("Failed to verify OTP");
        setOpenSnackbar(true);
      }

      const data = await response.json();

      if (data.error) {
        setSnackbarMessage("Failed to verify OTP!");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("OTP Verified!");
        setOpenSnackbar(true);
        setReferesh(!refresh);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setSnackbarMessage("Failed to verify OTP");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user")).id;
    fetch("http://localhost:5000/api/auth/getRatings", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        vendorId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllRatings(data.allRatings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deletePost = (postId) => {
    setShowDeletePopup(!showDeletePopup);
    fetch(`http://localhost:5000/api/auth/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Post has been deleted");
      });
  };

  const showDeletePopUp = (id) => {
    setDeletePostId(id);
    setShowDeletePopup(true);
  };

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
    <div style={{ maxWidth: "680px", margin: "50px" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "80px",
                marginRight: "40px",
              }}
              src=""
            />
          </div>
          <div>
            <h4
              className="text-light"
              style={{ color: "green", display: "inline" }}
            >
              {userid}
            </h4>
            <p
              style={{ color: "green", display: "inline", marginLeft: "10px" }}
            >
              {isVendor == "true" ? "(Vendor)" : ""}
            </p>
            {/* <h5>{state?state.email:"loading"}</h5> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6 className="text-warning">{mypics.length} posts</h6>
            </div>
            {isVendor == "true" && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{ margin: "3px" }}
                data-bs-toggle="offcanvas"
                data-bs-target="#menuOffCampus"
                aria-controls="offcanvasScrolling"
              >
                Your Menu
              </button>
            )}
            {isVendor == "true" && (
              <button
                className="btn btn-danger btn-sm"
                type="button"
                style={{ margin: "3px" }}
                data-bs-toggle="offcanvas"
                data-bs-target="#ratingsOffCampus"
                aria-controls="offcanvasScrolling"
              >
                YOUR RATINGS
              </button>
            )}
            {isVendor == "true" && (
              <button
                className="btn btn-danger btn-sm"
                type="button"
                style={{ margin: "3px" }}
                data-bs-toggle="offcanvas"
                data-bs-target="#ordersOffCampus"
                aria-controls="offcanvasScrolling"
              >
                ORDERS
              </button>
            )}
            {isVendor == "false" && (
              <button
                className="btn btn-danger btn-sm"
                type="button"
                style={{ margin: "3px" }}
                data-bs-toggle="offcanvas"
                data-bs-target="#UserCartOffCampus"
                aria-controls="offcanvasScrolling"
              >
                ORDER HISTORY
              </button>
            )}

            {/* ORDERS FRONTEND START*/}

            <div
              className="offcanvas offcanvas-end"
              data-bs-scroll="true"
              data-bs-backdrop="false"
              tabindex="-1"
              id="ordersOffCampus"
              aria-labelledby="offcanvasScrollingLabel"
              style={{ maxWidth: "350px" }}
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
                  ORDERS
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <nav className="navbar navbar-expand-lg bg-light">
                  <div className="container-fluid">
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setNavSelect("Old Orders")}
                          >
                            Old
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setNavSelect("Accepted Orders")}
                          >
                            Accepted
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setNavSelect("Pending Orders")}
                          >
                            New
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

                {navSelect === "Old Orders" &&
                  oldorders.length > 0 &&
                  oldorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Total price: {order.totalPrice}</h7>
                        <p style={{ color: "red", fontSize: "smaller" }}>
                          {order.status === "completed"
                            ? "Payment has been made to you"
                            : "Payment will be made to you in 7 working days"}
                        </p>
                      </div>
                    </div>
                  ))}

                {navSelect === "Accepted Orders" &&
                  myorders.length > 0 &&
                  myorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Total price: {order.totalPrice}</h7>
                        <p style={{ color: "red", fontSize: "smaller" }}>
                          {order.status === "accepted"
                            ? "The buyer will make the payment within 10 mins! Please don't start preparing the order unless we notify you on mail"
                            : "The buyer has made the payment, please make sure to deliver the order as soon as possible!"}
                        </p>
                        {order.status === "paid" && (
                          <div class="input-group input-group-sm mb-3">
                            <span
                              class="input-group-text"
                              id="inputGroup-sizing-sm"
                            >
                              OTP{" "}
                              <i
                                style={{ fontSize: "11px", marginLeft: "26px" }}
                              >
                                (Ask from customer at the time of delivery)
                              </i>
                            </span>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-sm"
                              maxlength="6"
                              pattern="\d*"
                              style={{ fontSize: "smaller", height: "30px" }}
                              onChange={(e) => setOtp(parseInt(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (order.status === "accepted") {
                            handleCancelOrder(order);
                          } else if (order.status === "paid") {
                            handlePaidCancelOrder(order);
                          }
                        }}
                        className="btn btn-danger"
                        style={{
                          marginTop: "0px",
                          width: "150px",
                          alignSelf: "center",
                          fontSize: "smaller",
                        }}
                      >
                        CANCEL
                      </button>
                      {order.status === "paid" && (
                        <button
                          className="btn btn-danger"
                          style={{
                            marginTop: "0px",
                            width: "150px",
                            alignSelf: "center",
                            fontSize: "smaller",
                          }}
                          onClick={() => handleOtpSubmit(order.orderId)}
                        >
                          DELIVERED
                        </button>
                      )}
                    </div>
                  ))}

                {navSelect === "Pending Orders" &&
                  pendingorders.length > 0 &&
                  pendingorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Address Details:</h7>
                        <p>
                          {order.houseNo} {order.locality} {order.city}{" "}
                          {order.state}
                        </p>
                        <h7>Total price: {order.totalPrice}</h7>
                      </div>
                      <button
                        onClick={() => handleAcceptOrder(order)}
                        className="btn btn-danger"
                        style={{
                          marginTop: "0px",
                          width: "150px",
                          alignSelf: "center",
                          fontSize: "smaller",
                        }}
                      >
                        ACCEPT
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="btn btn-danger"
                        style={{
                          marginTop: "0px",
                          width: "150px",
                          alignSelf: "center",
                          fontSize: "smaller",
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  ))}

                {/* //POP UP */}
                {showPopup && selectedOrder && (
                  <div className="popup-overlay">
                    <div className="popup">
                      <div className="popup-content">
                        <div className="head">
                          <h3
                            className="popup-heading"
                            style={{ display: "inline" }}
                          >
                            Order Details
                          </h3>
                          <button
                            className="btn-close"
                            onClick={togglePopup}
                          ></button>
                        </div>
                        <p>Order ID: {selectedOrder.orderId}</p>
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {selectedOrder.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${selectedOrder.itemNames[index]} - Quantity: ${selectedOrder.qty[index]} - Price: ${selectedOrder.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Total price: {selectedOrder.totalPrice}</h7>
                        <button onClick={handleConfirmOrder}>
                          Are you sure you want to take this order?
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* //POP UP       */}
              </div>
            </div>

            {/* ORDER FRONTEND END */}

            {/* USER ORDERS FRONTEND START*/}

            <div
              className="offcanvas offcanvas-end"
              data-bs-scroll="true"
              data-bs-backdrop="false"
              tabindex="-1"
              id="UserCartOffCampus"
              aria-labelledby="offcanvasScrollingLabel"
              style={{ maxWidth: "350px" }}
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
                  ORDERS
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <nav className="navbar navbar-expand-lg bg-light">
                  <div className="container-fluid">
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setUserNavSelect("All Orders")}
                          >
                            Previous
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setUserNavSelect("Pending Orders")}
                          >
                            Placed
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            onClick={(e) => setUserNavSelect("Cancel Orders")}
                          >
                            Canceled
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
                {userNavSelect === "All Orders" &&
                  usermyorders.length > 0 &&
                  usermyorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Total price: {order.totalPrice}</h7>
                      </div>
                    </div>
                  ))}

                {userNavSelect === "Pending Orders" &&
                  userpendingorders.length > 0 &&
                  userpendingorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Address Details:</h7>
                        <p>
                          {order.houseNo} {order.locality} {order.city}{" "}
                          {order.state}
                        </p>
                        <h7>Total price: {order.totalPrice}</h7>
                      </div>
                    </div>
                  ))}

                {userNavSelect === "Cancel Orders" &&
                  usercancelorders.length > 0 &&
                  usercancelorders.map((order) => (
                    <div
                      key={order.orderId}
                      className="card"
                      style={{ maxWidth: "350px" }}
                    >
                      <div className="card-header" style={{ fontSize: "12px" }}>
                        {order.orderId} <i>: {order.orderDate}</i>
                      </div>
                      <div className="card-body">
                        <h7>Order Details:</h7>
                        <ul className="list-group">
                          {order.itemId.map((itemId, index) => (
                            <li key={itemId} className="list-group-item">
                              {`${order.itemNames[index]} - Quantity: ${order.qty[index]} - Price: ${order.price[index]}`}
                            </li>
                          ))}
                        </ul>
                        <br />
                        <h7>Address Details:</h7>
                        <p>
                          {order.houseNo} {order.locality} {order.city}{" "}
                          {order.state}
                        </p>
                        <h7>Total price: {order.totalPrice}</h7>
                        <p style={{ color: "red", fontSize: "smaller" }}>
                          {order.status === "canceled"
                            ? "You placed an order that vendor was unable to accept! We are sorry for the convenience"
                            : "The order that you paid for has been canceled by the vendor. Your payment will be refunded to you in 7 working days, we are sorry for the incovenience!"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* USER ORDER FRONTEND END */}

            {/* RATINGS FRONTEND START*/}

            <div
              className="offcanvas offcanvas-end"
              data-bs-scroll="true"
              data-bs-backdrop="false"
              tabindex="-1"
              id="ratingsOffCampus"
              aria-labelledby="offcanvasScrollingLabel"
              style={{ maxWidth: "350px" }}
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
                  RATINGS
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                {allRatings.length > 0 &&
                  allRatings.map((item) => (
                    <div className="card" style={{ maxWidth: "350px" }}>
                      <div
                        className="card-header"
                        style={{
                          fontSize: "10px",
                          marginBottom: "2px",
                          marginTop: "0px",
                        }}
                      >
                        {item.userId}
                      </div>
                      <div className="card-body">
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "2px",
                          }}
                        >
                          Rating: {item.ratings}
                        </p>
                        <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* RATINGS FRONTEND START*/}

            {/* Side Menu */}
            <div
              className="offcanvas offcanvas-end"
              data-bs-scroll="true"
              data-bs-backdrop="false"
              tabindex="-1"
              id="menuOffCampus"
              aria-labelledby="offcanvasScrollingLabel"
              style={{ maxWidth: "450px" }}
            >
              <div className="full-view-menu">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
                    MENU
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {editItemId === item._id ? (
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => handleEditInputChange(e, "item")}
                              style={{ fontSize: "12px", color: "black" }}
                            />
                          ) : (
                            item.item
                          )}
                        </td>
                        <td>
                          {editItemId === item._id ? (
                            <input
                              type="number"
                              value={item.price}
                              min="0"
                              onChange={(e) =>
                                handleEditInputChange(e, "price")
                              }
                              style={{ fontSize: "12px", color: "black" }}
                            />
                          ) : (
                            `Rs.${item.price}`
                          )}
                        </td>
                        <td>
                          {editItemId === item._id ? (
                            <div className="dropdown">
                              <button
                                className="btn dropdown-toggle"
                                style={{ fontSize: "8px", color: "black" }}
                                type="button"
                                id={`dropdownCategory${item._id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {item.category}
                              </button>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby={`dropdownCategory${item._id}`}
                              >
                                {predefinedCategories.map((category) => (
                                  <li key={category}>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={(e) =>
                                        handleEditInputChange(e, "category")
                                      }
                                    >
                                      {category}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            item.category
                          )}
                        </td>
                        <td>
                          {editItemId === item._id ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleClickUpdate(item._id)}
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => startEditingItem(item._id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          )}
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {addItemMode && (
                      <tr>
                        <td>
                          <input
                            type="text"
                            style={{
                              color: "black",
                              fontSize: "12px",
                              width: "100px",
                            }}
                            placeholder="Item Name"
                            name="item"
                            value={newItem.item}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            style={{
                              color: "black",
                              fontSize: "12px",
                              width: "60px",
                            }}
                            type="number"
                            placeholder="Price"
                            name="price"
                            value={newItem.price}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn dropdown-toggle"
                              style={{
                                color: "black",
                                zIndex: "1001",
                                width: "80px",
                                fontSize: "12px",
                                padding: "0px",
                                margin: "0px",
                              }}
                              type="button"
                              id="dropdownCategoryNew"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Category
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownCategoryNew"
                            >
                              {predefinedCategories.map((category) => (
                                <li key={category}>
                                  <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={(e) =>
                                      setNewItem({
                                        ...newItem,
                                        category: e.target.innerText,
                                      })
                                    }
                                  >
                                    {category}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-primary" onClick={addItem}>
                            Add
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <button className="btn btn-primary" onClick={toggleAddItemMode}>
                  {addItemMode ? "Cancel" : "Add More"}
                </button>
              </div>
            </div>
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
        {mypics.map((item) => {
          return (
            <img
              className="item1"
              src={item.photo}
              alt={item.title}
              width="220px"
              height="220px"
              style={{ margin: "2px" }}
              onClick={() => showDeletePopUp(item._id)}
            />
          );
        })}
      </div>

      {/* //POP UP */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <div className="head">
                <h3 className="popup-heading" style={{ display: "inline" }}>
                  DELETE POST
                </h3>
                <button
                  className="btn-close"
                  onClick={toggleDeletePostPopup}
                ></button>
              </div>
              <h7>Are you sure you want to delete your post?</h7>
              <button onClick={() => deletePost(deletePostId)}>YES</button>
            </div>
          </div>
        </div>
      )}
      {/* POP UP */}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Profile;
