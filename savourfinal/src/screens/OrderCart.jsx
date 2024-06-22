import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./OrderCart.css"; // Assuming you have a separate CSS file for this component
import { useParams, useNavigate } from "react-router-dom";
import PaymentReceiptModal from "./PaymentReceiptModal.jsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function OrderCart() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [acceptedOrder, setAcceptedOrder] = useState(false);
  const [canceledOrder, setCanceledOrder] = useState(false);
  // payment
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/orders/${orderId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order data.");
        }
        const data = await response.json();
        setOrderStatus(data[0].status);
        if (data[0].status === "paid") {
          setShowPaymentModal(true); // Show payment receipt modal if status is paid
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/orderat/${orderId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    navigate("/user"); // Navigate to the home page
  };
 //OrderCart.js

const handleDownloadReceipt = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/auth/orders/${orderId}/receipt`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch receipt data.');
    }
    const receiptData = await response.json();

    // Assuming receiptData is an object with the transaction details
    const transaction = receiptData;

    const doc = new jsPDF();
    doc.setProperties({
      title: `Payments Report for ${orderId}`,
    });
    let y = 20;
    doc.setFontSize(17);
    doc.text(`Transaction Report for ${orderId}`, 105, y, { align: "center" });
    y += 10;
    const headers = [
      "DATE",
      "TRANSACTION ID",
      "ORDERID",
      "USERID",
      "VENDORID",
      "AMOUNT(INR)",
    ];
    // Create an array with a single transaction object
    const data = [
      [
        transaction.paymentDate,
        transaction.razorpay_payment_id,
        transaction.orderId,
        transaction.userId,
        transaction.vendorId,
        `${transaction.amount} ${transaction.currency}`,
      ],
    ];
    doc.autoTable({
      startY: y,
      head: [headers],
      body: data,
    });

    doc.save(`${transaction.receipt}.pdf`);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw new Error('Failed to download receipt.');
  }
};
  
   //AANYA
   const paymentHandler = async () => {
    try {
      const amount = calculateTotalPrice() * 100; // Amount in paise for Razorpay
      console.log(amount);
      const { userId, vendorId, orderId } = orderDetails;
      const currency = "INR";
      const receipt = `receipt_${userId}`;

      // Step 2: Create order with Razorpay
      const orderResponse = await fetch(
        "http://localhost:5000/api/auth/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount, // Send amount in rupees for display
            currency,
            receipt,
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      var options = {
        key: "rzp_test_pjnalyGsno3BIq", // Your Razorpay Key ID
        amount,
        currency,
        name: "SAVOUR",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, // Ensure order.id is correct
        handler: async function (response) {
          // Assuming response is an object containing payment data
          const body = {
            ...response,
            userId,
            vendorId,
            orderId,
            amount,
            currency,
            receipt,
          };
          console.log("BODY", body);

          try {
            const validateRes = await fetch(
              "http://localhost:5000/api/auth/transaction/validate",
              {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!validateRes.ok) {
              throw new Error("Failed to validate transaction");
            }

            const jsonRes = await validateRes.json();
            if (jsonRes) {
              try {
                // Your existing code for creating the Razorpay order

                // Assuming payment is successful, call updatePaid API
                const response = await fetch(
                  `http://localhost:5000/api/auth/orders/${orderId}/updateStatus`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "paid" }), // Send status as "paid"
                  }
                );

                if (!response.ok) {
                  throw new Error("Failed to update order status.");
                }

                const data = await response.json();
                console.log("Order status updated successfully!", data);
                setShowPaymentModal(true)
                alert("Thank You for making the payment, Your order will be delivered soon!");
                // navigate('/user/profile');

                // Now you can handle other actions after payment and order update, such as showing success message, redirecting, etc.
              } catch (error) {
                console.error("Error updating order status:", error);
                // Handle error scenario
                alert("Error updating order status");
              }
            }
            console.log(jsonRes);
          } catch (error) {
            console.error("Error while validating transaction:", error);
            // Handle error scenario
            alert("Error processing payment");
          }
        },

        prefill: {
          name: "AANYA",
          email: "aanya240503@gmail.com",
          contact: "7080061482",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        // Handle payment failure
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
    } catch (error) {
      console.error("Error handling payment:", error);
      // Handle error scenario
      alert("Error processing payment");
    }
  };


 // payment
  
 const [showForm, setShowForm] = useState(true); // New state for showing the form
  const [formData, setFormData] = useState({
    houseNo: "",
    state: "",
    city: "",
    locality: "",
  });


  //show status
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
          const response = await fetch(`http://localhost:5000/api/auth/orders/${orderId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch order data.");
          }
          const data = await response.json();
          setOrderStatus(data[0].status);
          console.log(data[0]);

          // If order status is not "accepted", call fetchOrderStatus again after a delay
          if (data[0].status == 'placed') {
            console.log(data[0].status)
            setTimeout(fetchOrderStatus, 10000); // Delay in milliseconds
          } else {
            setShowStatus(false); // Hide the status bar when order is accepted
            if(data[0].status == 'accepted'){
            setAcceptedOrder(true);
            }
            if(data[0].status == 'canceled')
            setCanceledOrder(true);
          }
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
    };

    if (showStatus) {
      fetchOrderStatus();
    }
  }, [showStatus]);
  //show status

  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;

        const response = await fetch(`http://localhost:5000/api/auth/user/${userId}/address`);
        if (!response.ok) {
          throw new Error("Failed to fetch address details.");
        }
        const data = await response.json();

        setFormData({
          houseNo: data.houseNo || "",
          state: data.state || "",
          city: data.city || "",
          locality: data.locality || "",
        });
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };

    fetchAddressDetails();
  }, []);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order data.");
        }
        const data = await response.json();
        console.log("Data received from backend:", data);
        if (data) {
          console.log(data[0]);
          const itemDetails = [];
          for (let i = 0; i < data.length; i++) {
            itemDetails.push({
              id: data[i].id,
              name: data[i].name,
              category: data[i].category,
              price: data[i].price,
              quantity: data[i].quantity,
            });
          }
          setCartItems(itemDetails);
        } else {
          throw new Error("Invalid data received from the server.");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchItemDetails();
  }, [orderId]);

  const handleIncrement = (id) => {
    console.log("Increment ID:", id);
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem.id === id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    console.log("Updated Items:", updatedCartItems);
    setCartItems(updatedCartItems);
  };

  const handleDecrement = (id) => {
    console.log("Decrement ID:", id);
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem.id === id && cartItem.quantity > 1 // Validate quantity is greater than 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
  
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem.quantity === 1) {
      // Display alert if quantity is already 1 and decrement is attempted
      alert("Quantity cannot be less than 1.");
      return; // Stop further execution
    }
  
    console.log("Updated Items:", updatedCartItems);
    setCartItems(updatedCartItems);
  };
  

  const handleDelete = async (id) => {
    console.log("Delete ID:", id);
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== id);
    console.log("Updated Items:", updatedCartItems);
    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    if (cartItems.length === 0) {
      return 0; // Return 0 if cart is empty
    }

    const itemsTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = itemsTotal + 50;

    return shipping; // Return the total amount including shipping charges
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Assuming formData contains the address details
      });
      if (!response.ok) {
        throw new Error("Failed to update order.");
      }
      const data = await response.json();
      console.log("Address Details updated successfully!", data);
      setSnackbarMessage("Order updated successfully!");
      setOpenSnackbar(true);
      setShowForm(false); // Hide the form after successful update
    } catch (error) {
      console.error("Error updating order:", error);
      setSnackbarMessage("Failed to update order.");
      setOpenSnackbar(true);
    }
  };

  //onProceed Harsha
  const onProceed = async () => {
    try {
      //update
       const updatedCartItems = cartItems.map((item) => ({
        itemId: item.id, // Assuming item ID is used as itemId
        qty: item.quantity,
        price: item.price, // Include the price of each item
      }));
      console.log("UPDATED CART ITEMS", updatedCartItems);
      //AANYA

      // Update the order status and cart items
      const response1 = await fetch(
        `http://localhost:5000/api/auth/orders/${orderId}/updateQuantity`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems: updatedCartItems,
          }), // Include updated cart items
        }
      );
      if (!response1.ok) {
        throw new Error("Failed to update order status.");
      }
      const data1 = await response1.json();
      console.log("cart items updated successfully!", data1);
      //update

       const response = await fetch(`http://localhost:5000/api/auth/orders/${orderId}/updateStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "placed" }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }
      const data = await response.json();
      console.log("Order status updated successfully!", data);
      setSnackbarMessage("Order status updated successfully!");
      setOpenSnackbar(true);
      setShowForm(false); // Hide the form after successful update
      setShowStatus(true);
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbarMessage("Failed to update order status.");
      setOpenSnackbar(true);
    }
  };  

  const saveAddress = async (event) => {
    console.log("saving address")
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/user/${userId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to save address.");
      }
      const data = await response.json();
      setSnackbarMessage("Address details saved successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to save address.");
      setOpenSnackbar(true);
    }
  };


  //onProceed Harsha

  return (
    <div className="order-cart">
      <h3>Order Cart</h3>
      <table className="cart-table">
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
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDecrement(item.id)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleIncrement(item.id)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-summary">
        <h4>Order Summary</h4>
        <div className="total-container">
          <p>Total Items Price: Rs. {calculateTotalPrice()-50}</p>
          <p>Shipping Charges: Rs. 50</p>
          <p>Total Amount: Rs. {calculateTotalPrice()}</p>
        </div>
      </div>

      {showForm && (
        <div className="order-form">
          <h4>Enter Address Details</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="houseNo">House No:</label>
            <input
              type="text"
              id="houseNo"
              name="houseNo"
              value={formData.houseNo}
              onChange={(e) =>
                setFormData({ ...formData, houseNo: e.target.value })
              }
              required
            />
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
            <label htmlFor="locality">Locality:</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={(e) =>
                setFormData({ ...formData, locality: e.target.value })
              }
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-light btn-sm" style={{ width: 'auto' }} onClick={()=>saveAddress()}>
                Save Address
              </button>
            </div>
            < button type="submit" onClick={() => onProceed()}>Place Order</button>
          </form>
        </div>
      )}

      {/* Status Bar */}
              {showStatus && (
              <div>
                <p>Please don't switch the page while your order is being placed. thank You!</p>
                <div class="progress">
                    <div class="indeterminate" style={{width:"600px"}}></div>
                </div>
                <button type="button" class="btn btn-warning" disabled data-bs-toggle="button">Please Wait for Order Acceptance</button>
              </div>)}
      {/* Status Bar */}

      {/* Accepted Order */}
        {acceptedOrder && (
              <div class="d-grid gap-2" style={{textAlign:"center", display:"flex"}}>
                <button class="btn btn-danger" type="button" onClick={paymentHandler}>Your Order has been Accepted, Click Here to Pay!</button>
                <p style={{color:"red"}}>Payment must be done within 10 mins or your order will be discarded</p>
              </div>)}
      {/* Accepted Order */}

      {/* Canceled Order */}
      {canceledOrder && (
              <div class="d-grid gap-2" style={{textAlign:"center", display:"flex"}}>
                <button class="btn btn-danger" type="button" disabled>Your Order has been Canceled by the vendor!</button>
                <p style={{color:"red"}}>We are sorry for the inconvenience caused to you!</p>
              </div>)}
      {/* Canceled Order */}

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

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onDownloadReceipt={handleDownloadReceipt} // Pass the download receipt handler
      />
      {/* Payment Receipt Modal */}

    </div>
  );
}

export default OrderCart;