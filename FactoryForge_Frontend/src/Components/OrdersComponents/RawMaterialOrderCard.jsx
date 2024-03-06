import { useEffect, useState } from "react";
import API from "../../api/API";

const RawMaterialOrderCard = ({
  order,
  isOpen,
  toggleDetails,
  config,
  accessToken,
  fetchRawMaterialOrders,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const deliveryyDate = new Date(order.delivery_date);
  const formattedDeliveryDate = deliveryyDate.toISOString().slice(0, 10);
  const formattedDeliveryTime = deliveryyDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [editableFields, setEditableFields] = useState({
    status: order.status,
    delivery_date: order.delivery_date || "",
  });
  const [showSetNewDate, setShowSetNewDate] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const statusChoices = {
    1: "Ordered",
    2: "In Transit",
    3: "Delivered",
  };

  useEffect(() => {
    setActiveStatus(getStatusLabel(order.status));
  }, [order.status]);

  const getStatusLabel = (statusKey) => {
    return statusChoices[statusKey];
  };

  const handleStatusClick = (statusLabel) => {
    const statusCode = Object.keys(statusChoices).find(
      (key) => statusChoices[key] === statusLabel,
    );
    setActiveStatus(statusLabel);
    handleFieldChange("status", statusCode);
  };

  const handleCloseDetails = () => {
    toggleDetails();
    setShowDetails(false);
    setActiveStatus(getStatusLabel(order.status));
  };

  const submitRawMaterialOrderUpdate = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      await API.patch(
        `raw_materials_orders/${order.id}/`,
        editableFields,
        config,
      );
      toggleDetails();
      fetchRawMaterialOrders();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data[0]);
        /*For now that works, but if there is more than one raw material missing it will still show only one i think*/
      }
      console.log(
        "Raw material order update was not successful.",
        error.message,
      );
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setEditableFields({
      ...editableFields,
      [fieldName]: value,
    });
  };

  const toggleShowSetDeliveryDate = () => {
    setShowSetNewDate((prevData) => !prevData);
  };

  const submitDeleteOrder = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const res = await API.delete(`raw_materials_orders/${order.id}/`, config);
      console.log("Success!", res.data);
      fetchRawMaterialOrders();
    } catch (error) {
      console.log(
        "Raw material order update was not successful.",
        error.message,
      );
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
          <span>Supplier: {order.supplier.username}</span>
          <span>Order ID: {order.id}</span>
        </div>
        <div className="co-productlist">
          {order.raw_materials_order != null &&
            Object.entries(order.raw_materials_order).map(
              ([rawMatID, quantity]) => (
                <li key={rawMatID}>
                  Raw Material ID: {rawMatID}. Quantity: {quantity}
                </li>
              ),
            )}
        </div>
        <div className="rmo-fields">
          <span>Due Date: {formattedDeliveryDate}</span>
          <span>Delivery Time: {formattedDeliveryTime}</span>
          <span>Status: {getStatusLabel(order.status)}</span>
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
                  onClick={(e) => submitRawMaterialOrderUpdate(e)}
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
          <div className="showDetailsRawMats">
            <div className="leftContainer">
              <div className="client">
                <div className="clientDetails">
                  <h2>Client Details</h2>
                  <span>
                    Name: {order.supplier.first_name || "N/A"}{" "}
                    {order.supplier.last_name}
                  </span>
                  <span>Username: {order.supplier.username}</span>
                  <span>Email: {order.supplier.email || "N/A"}</span>
                </div>
                <div className="orderedProducts">
                  <h2>Ordered Materials</h2>
                  <div
                    className="orderedProductsList"
                    style={{ marginLeft: "5px" }}
                  >
                    <ul>
                      {order.raw_materials_order != null &&
                        Object.entries(order.raw_materials_order).map(
                          ([rawMatID, quantity]) => (
                            <li key={rawMatID} className="list-item">
                              <span className="idSpan">ID: {rawMatID}</span>
                              <span className="quantitySpan">
                                Quantity: {quantity}
                              </span>
                            </li>
                          ),
                        )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="clientNote"></div>
            </div>
            <div className="rightContainer rawmats">
              <div className="duedate rawmats">
                <div>
                  <h2>Delivery</h2>
                  <div>
                    {formattedDeliveryDate} | {formattedDeliveryTime}
                  </div>
                </div>
                {showSetNewDate ? (
                  <>
                    <button
                      onClick={toggleShowSetDeliveryDate}
                      style={{ marginBottom: "28px" }}
                    >
                      Set New Date
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="datetime-local"
                      title="Set New Delivery Date"
                      onChange={(e) =>
                        handleFieldChange(
                          "delivery_date",
                          new Date(e.target.value).toISOString(),
                        )
                      }
                    />
                    <button onClick={toggleShowSetDeliveryDate}>Cancel</button>
                  </>
                )}
              </div>
              <div className="orderStatus">
                <h2>Order Status</h2>
                <div className="orderStatusSelection rawmats">
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

export default RawMaterialOrderCard;
