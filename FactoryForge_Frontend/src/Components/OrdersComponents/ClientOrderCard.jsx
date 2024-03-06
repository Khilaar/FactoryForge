import { useEffect, useState } from "react";
import API from "../../api/API";

const ClientOrderCard = ({
  order,
  isOpen,
  toggleDetails,
  config,
  accessToken,
  fetchClientOrders,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const [editableFields, setEditableFields] = useState({
    client_note: order.client_note || "",
    due_date: order.due_date || "",
    order_status: order.order_status,
  });
  const [showSetNewDate, setShowSetNewDate] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const statusChoices = {
    1: "Created",
    2: "In Progress",
    3: "Quality Control",
    4: "Ready for Shipping",
    5: "In Transit",
    6: "Completed",
  };

  useEffect(() => {
    setActiveStatus(getStatusLabel(order.order_status));
  }, [order.order_status]);

  const getStatusLabel = (statusKey) => {
    return statusChoices[statusKey];
  };

  const handleStatusClick = (statusLabel) => {
    const statusCode = Object.keys(statusChoices).find(
      (key) => statusChoices[key] === statusLabel,
    );
    setActiveStatus(statusLabel);
    handleFieldChange("order_status", statusCode);
  };

  const handleCloseDetails = () => {
    toggleDetails();
    setShowDetails(false);
    setActiveStatus(getStatusLabel(order.order_status));
  };

  const submitClientOrderUpdate = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const res = await API.patch(
        `client_orders/${order.id}/`,
        editableFields,
        config,
      );
      console.log("Success!", res.data);
      toggleDetails();
      fetchClientOrders();
    } catch (error) {
      console.log("Client order update was not successful.", error.message);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data[0]);
        /*For now that works, but if there is more than one raw material missing it will still show only one i think*/
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setEditableFields({
      ...editableFields,
      [fieldName]: value,
    });
  };

  const toggleShowSetDueDate = () => {
    setShowSetNewDate((prevData) => !prevData);
  };

  const submitDeleteOrder = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const res = await API.delete(`client_orders/${order.id}/`, config);
      console.log("Success!", res.data);
      fetchClientOrders();
    } catch (error) {
      console.log("Client order update was not successful.", error.message);
    }
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <>
      {errorMessage && (
        <div className="error-popup">
          <div className="error-message">{errorMessage}</div>
          <button onClick={handleCloseError}>X</button>
        </div>
      )}
      <div className={`list-item-orders ${showDetails ? "expanded" : ""}`}>
        <div className="co-fields">
          <span>Client: {order.client.username}</span>
          <span>Order ID: {order.id}</span>
          <span>{order.tracking_number}</span>
        </div>
        <div className="co-productlist">
          {order.ordered_products.map((product) => (
            <li key={product.product}>
              Product ID: {product.product}. Quantity: {product.quantity}
            </li>
          ))}
        </div>
        <div className="co-fields">
          <span>Due Date: {order.due_date}</span>
          <span>Status: {getStatusLabel(order.order_status)}</span>
        </div>
        <div>
          {!isOpen ? (
            <button
              onClick={() => {
                toggleDetails();
                setShowDetails(!showDetails);
              }}
            >
              Details
            </button>
          ) : (
            <div className="xSave">
              <button className="xButton" onClick={handleCloseDetails}>
                X
              </button>
              <div className="saveDelete">
                <button
                  className="saveButton"
                  onClick={(e) => submitClientOrderUpdate(e)}
                >
                  SAVE
                </button>
                <button
                  className="saveButton delete"
                  onClick={(e) => submitDeleteOrder(e)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <>
          <div className="showDetails">
            <div className="leftContainer">
              <div className="client">
                <div className="clientDetails">
                  <h2>Client Details</h2>
                  <span>
                    Name: {order.client.first_name || "N/A"}{" "}
                    {order.client.last_name}
                  </span>
                  <span>Username: {order.client.username}</span>
                  <span>Email: {order.client.email || "N/A"}</span>
                </div>
                <div className="duedate">
                  <div>
                    <h2>Due Date</h2>
                    <div>{order.due_date}</div>
                  </div>
                  {showSetNewDate ? (
                    <>
                      <button
                        onClick={toggleShowSetDueDate}
                        style={{ marginBottom: "28px" }}
                      >
                        Set New Date
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="date"
                        title="Set New Due Date"
                        onChange={(e) =>
                          handleFieldChange("due_date", e.target.value)
                        }
                      />
                      <button onClick={toggleShowSetDueDate}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
              <div className="clientNote">
                <h2>Client Note</h2>
                <textarea
                  value={editableFields.client_note}
                  onChange={(e) =>
                    handleFieldChange("client_note", e.target.value)
                  }
                >
                  {order.client_note}
                </textarea>
              </div>
            </div>
            <div className="rightContainer">
              <div className="orderedProducts">
                <h2>Ordered Products</h2>
                <div className="orderedProductsList">
                  <ul>
                    {order.ordered_products.map((product) => (
                      <li key={product.product} className="list-item">
                        <span className="idSpan">ID: {product.product}</span>
                        <span className="quantitySpan">
                          Quantity: {product.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="orderStatus">
                <h2>Order Status</h2>
                <div className="orderStatusSelection">
                  {Object.values(statusChoices).map((statusLabel) => (
                    <button
                      key={statusLabel}
                      className={activeStatus === statusLabel ? "active" : ""}
                      onClick={() => handleStatusClick(statusLabel)}
                    >
                      {statusLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ClientOrderCard;
