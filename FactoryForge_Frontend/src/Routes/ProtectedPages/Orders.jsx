import { useState, useEffect, useMemo } from "react";
import API from "../../api/API";
import ClientOrderCard from "../../Components/OrdersComponents/ClientOrderCard";
import { useNavigate, useLocation } from "react-router-dom";
import RawMaterialOrderCard from "../../Components/OrdersComponents/RawMaterialOrderCard";
import CreateOrderForm from "../../Components/OrdersComponents/CreateOrderForm";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [rawMaterialOrders, setRawMaterialOrders] = useState([]);
  const [openedOrderId, setOpenedOrderId] = useState(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [displayPage, setDisplayPage] = useState(
    location.state ? location.state.displayPage : "Client Orders",
  );
  const accessToken = localStorage.getItem("access_token");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const fetchClientOrders = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("client_orders/");
      const sortedClientOrders = response.data.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
      });
      setOrders(sortedClientOrders);
    } catch (error) {
      console.error("Error fetching client orders: ", error);
    }
  };

  const fetchRawMaterialOrders = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("raw_materials_orders/");
      const sortedRawMaterialOrders = response.data.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
      });
      setRawMaterialOrders(sortedRawMaterialOrders);
    } catch (error) {
      console.error("Error fetching raw materials orders: ", error);
    }
  };

  useEffect(() => {
    fetchClientOrders();
    fetchRawMaterialOrders();
  }, []);

  const toggleCreateOrder = () => {
    setShowCreateOrder((prevShowCreateOrder) => !prevShowCreateOrder);
  };

  const toggleOrderDetails = (orderId) => {
    setOpenedOrderId((prevOpenedOrderId) =>
      prevOpenedOrderId === orderId ? null : orderId,
    );
  };

  const handleNavigate = () => {
    navigate("/orders/history/", { state: { displayPage } });
  };

  const togglePage = (page) => {
    setDisplayPage(page);
    setOpenedOrderId("");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        Object.values(order).some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        Object.values(order.client).some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [orders, searchQuery]);

  const filteredRawMaterialOrders = useMemo(() => {
    return rawMaterialOrders.filter(
      (order) =>
        Object.values(order).some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        Object.values(order.supplier).some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [rawMaterialOrders, searchQuery]);

  if (!orders || !rawMaterialOrders) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="topBar">
        <div className="selectPage">
          <h1
            className={` ${displayPage === "Client Orders" ? "active" : ""}`}
            onClick={() => togglePage("Client Orders")}
          >
            Client Orders
          </h1>

          <h1
            className={` ${displayPage === "Raw Material Orders" ? "active" : ""}`}
            onClick={() => togglePage("Raw Material Orders")}
          >
            Raw Material Orders
          </h1>
        </div>
        <div className="headerButtons">
          <form className="searchbar-orders">
            <input
              style={{ padding: "5px" }}
              type="text"
              value={searchQuery}
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </form>
          <button
            className={`createOrder ${showCreateOrder ? "active" : ""}`}
            onClick={toggleCreateOrder}
          >
            Create Order
          </button>
          <button
            className="pastOrders"
            onClick={handleNavigate}
            style={{ marginRight: "200px" }}
          >
            Past Orders
          </button>
        </div>
      </div>
      <div className="background-frame-orders">
        {displayPage === "Client Orders" ? (
          <section>
            {filteredOrders.length
              ? filteredOrders.map((order) => (
                  <ClientOrderCard
                    order={order}
                    key={order.id}
                    isOpen={order.id === openedOrderId}
                    toggleDetails={() => toggleOrderDetails(order.id)}
                    config={config}
                    accessToken={accessToken}
                    fetchClientOrders={fetchClientOrders}
                  />
                ))
              : orders.map((order) => (
                  <ClientOrderCard
                    order={order}
                    key={order.id}
                    isOpen={order.id === openedOrderId}
                    toggleDetails={() => toggleOrderDetails(order.id)}
                    config={config}
                    accessToken={accessToken}
                    fetchClientOrders={fetchClientOrders}
                  />
                ))}
          </section>
        ) : (
          <section>
            {filteredRawMaterialOrders.length
              ? filteredRawMaterialOrders.map((order) => (
                  <RawMaterialOrderCard
                    order={order}
                    key={order.id}
                    isOpen={order.id === openedOrderId}
                    toggleDetails={() => toggleOrderDetails(order.id)}
                    config={config}
                    accessToken={accessToken}
                    fetchRawMaterialOrders={fetchRawMaterialOrders}
                  />
                ))
              : rawMaterialOrders.map((order) => (
                  <RawMaterialOrderCard
                    order={order}
                    key={order.id}
                    isOpen={order.id === openedOrderId}
                    toggleDetails={() => toggleOrderDetails(order.id)}
                    config={config}
                    accessToken={accessToken}
                    fetchRawMaterialOrders={fetchRawMaterialOrders}
                  />
                ))}
          </section>
        )}
      </div>
      {showCreateOrder && (
        <div className="createOrderForm-container">
          {displayPage == "Client Orders" ? (
            <CreateOrderForm
              toggleCreateOrder={() => toggleCreateOrder()}
              createOrderTitle={"Create Client Order"}
              fetchClientOrders={fetchClientOrders}
              config={config}
              accessToken={accessToken}
            />
          ) : (
            <CreateOrderForm
              toggleCreateOrder={() => toggleCreateOrder()}
              createOrderTitle={"Create Raw Material Order"}
              fetchRawMaterialOrders={fetchRawMaterialOrders}
              config={config}
              accessToken={accessToken}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Orders;
