import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ items, vendorId }) {
  const [cartItems, setCartItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  // Initialize cartItems when the component mounts or when items prop changes
  useEffect(() => {
    if (items && items.length > 0) {
      setCartItems(items.map((item) => ({ ...item, quantity: 0 })));
    }
  }, [items]);

  const handleIncrement = (id) => {
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem._id === id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCartItems(updatedCartItems);
  };

  const handleDecrement = (id) => {
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem._id === id && cartItem.quantity > 0
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
    setCartItems(updatedCartItems);
  };

  const handleAddItems = async () => {
    const newOrderId = `OD${Math.floor(Math.random() * 1000)}`;
    const userid = JSON.parse(localStorage.getItem("user")).userid;
    console.log("userid=",userid)
    
    // while (!newOrderId) {
    //   newOrderId = `OD${Math.floor(Math.random() * 1000)}`;
    // }
    setOrderId(newOrderId);
    // console.log(newOrderId, orderId);
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; // Formatting date as dd-mm-yyyy
    const orderData = cartItems.map((item) => ({
      AllorderId: newOrderId,
      itemId: item._id,
      price: item.price,
      qty: item.quantity,
      vendorId: vendorId,
      userId: userid,
      orderDate: formattedDate, // Using formatted date
      orderTime: new Date().toLocaleTimeString(),
      houseNo: "  ",
      city: "  ",
      state: "  ",
      locality: "  ",
    }));

    const nonZeroItems = orderData.filter((item) => item.qty > 0);
    if (nonZeroItems.length === 0) {
      setSnackbarMessage("Please add items to the cart.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/items/ordercart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nonZeroItems),
      });
      const responseData = await response.json();
      console.log(responseData);
      setSnackbarMessage(`Items added to the Cart with orderId ${newOrderId}`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to post data to the backend:", error);
      setSnackbarMessage("Failed to add items to the Cart.");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleGoToCart = () => {
    if (cartItems.length === 0) {
      alert("Cart is Empty");
      return;
    }
    navigate(`/ordercart/${orderId}`);
  };


  return (
    <div className="cart">
      <table className="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.item}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleDecrement(item._id)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleIncrement(item._id)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons-container">
        <button
          className="btn btn-primary action"
          style={{ width: "50%" }}
          onClick={handleAddItems}
        >
          Add Item(s)
        </button>
        <button
          className="btn btn-primary action"
          style={{ width: "50%" }}
          onClick={handleGoToCart}
        >
          Go to Cart
        </button>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="warning"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Cart;