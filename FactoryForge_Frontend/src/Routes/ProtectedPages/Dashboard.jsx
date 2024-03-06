import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BarChart from "../../Components/Charts/BarChart.jsx";
import PieChart from "../../Components/Charts/PieChart.jsx";
import { useEffect, useState } from "react";
import API from "../../api/API.js";

Chart.register(CategoryScale);

const Dashboard = () => {
  const [profitLoss, setProfitLoss] = useState({
    profit: 1000,
    "Total Cost": 100,
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [query, setQuery] = useState([]);
  const [searchResultsProducts, setSearchResultsProducts] = useState([]);
  const [searchResultsOrders, setSearchResultsOrders] = useState([]);
  const [searchResultsRawMaterials, setSearchResultsRawMaterials] = useState(
    [],
  );

  const [showItemOverlay, setShowItemOverlay] = useState(false);
  const [overlayItem, setOverlayItem] = useState({});

  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [clientOrders, setClientOrders] = useState([]);
  const [rawMaterialChartData, setRawMaterialChartData] = useState({
    datasets: [],
  });
  const [profitChartData, setProfitChartData] = useState({
    datasets: [
      {
        data: [1000, 100],
        backgroundColor: ["#008000FF", "#D0312D"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const tasks = [
    {
      todo: "Ship Order #13335",
      due: "3 March",
    },
    {
      todo: "Order M1 chip",
      due: "3 March",
    },
    {
      todo: "Confirm Order #44331",
      due: "3 March",
    },
    {
      todo: "Prepare Order #28733",
      due: "3 March",
    },
  ];
  const suppliers = [
    {
      name: "Apple",
      phone: "077-445-6678",
      email: "apple@icloud.com",
      address: "waldstrasse 3, zurich",
    },
    {
      name: "Microsoft",
      phone: "077-445-6678",
      email: "microsoft@icloud.com",
      address: "waldstrasse 3, zurich",
    },
    {
      name: "Nvidia",
      phone: "077-445-6678",
      email: "nvidia@icloud.com",
      address: "waldstrasse 3, zurich",
    },
  ];
  async function fetchSoldProducts() {
    try {
      const response = await API.get("/analytics/statistics/", {
        params: {
          start_date: "2024-01-01",
          end_date: "2024-03-31",
        },
      });
      setSoldProducts(response.data[1]["Sold Products"]);
    } catch (error) {
      console.error("Error fetching statistics: ", error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await API.get(`products/`);
      setProducts(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchClientOrders() {
    try {
      const response = await API.get(`client_orders/`);
      setClientOrders(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchRawMaterials() {
    try {
      const response = await API.get(`raw_materials/`);
      setRawMaterials(response.data);
      const filteredRawMaterials = response.data.filter(
        (item) => response.data.indexOf(item) < 6,
      );
      setRawMaterialChartData({
        labels: filteredRawMaterials.map((data) => data.name),
        datasets: [
          {
            label: "Quantity Available ",
            data: filteredRawMaterials.map((data) => data.quantity_available),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchProfit() {
    try {
      const response = await API.get(
        `/analytics/profit/?start_date=2024-02-16&end_date=2025-01-01`,
      );
      setProfitLoss(response.data);
      setProfitChartData({
        datasets: [
          {
            data: [response.data.profit, response.data["Total Cost"]],
            backgroundColor: ["#008000FF", "#D0312D"],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.log("fetch profit error:", error.message);
    }
  }

  function handleSearch() {
    event.preventDefault();
    event.target.reset();
    setSearchResultsProducts(
      products.filter((product) => product.title.toLowerCase().includes(query)),
    );
    setSearchResultsOrders(
      clientOrders.filter(
        (order) =>
          order.tracking_number.toLowerCase().includes(query) ||
          order.client.last_name.toLowerCase().includes(query) ||
          order.client.first_name.toLowerCase().includes(query),
      ),
    );
    setSearchResultsRawMaterials(
      rawMaterials.filter((item) => item.name.toLowerCase().includes(query)),
    );
    setShowSearchResults(true);
  }

  function handleItemOverlay(item) {
    setOverlayItem(item);
    setShowItemOverlay(true);
    console.log(searchResultsOrders);
  }

  useEffect(() => {
    fetchProducts();
    fetchClientOrders();
    fetchRawMaterials();
    fetchProfit();
    fetchSoldProducts();
  }, []);

  return (
    <>
      <div className={"search"} onClick={() => setShowSearchResults(false)}>
        <h1 className={"route-title"}>Dashboard</h1>
        <form className={"search_bar"} onSubmit={handleSearch}>
          <input
            placeholder={"Search "}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
          <button>GO</button>
        </form>
      </div>
      {showSearchResults && (
        <div className={"search_results"}>
          <button onClick={() => setShowSearchResults(false)}>close</button>
          <p>Search Results for: {query}</p>
          {searchResultsProducts.length > 0 && <h3>Products:</h3>}
          {searchResultsProducts.map((item) => (
            <p
              className={"product"}
              key={searchResultsProducts.indexOf(item)}
              onClick={() => handleItemOverlay(item)}
            >
              {item.title}
            </p>
          ))}
          {searchResultsOrders.length > 0 && <h3>Orders:</h3>}
          {searchResultsOrders.map((item) => (
            <p
              className={"product"}
              key={searchResultsOrders.indexOf(item)}
              onClick={() => {
                handleItemOverlay(item);
              }}
            >
              {item.client.last_name}
              <p>{item.tracking_number}</p>
            </p>
          ))}
          {searchResultsRawMaterials.length > 0 && <h3>Raw Material:</h3>}
          {searchResultsRawMaterials.map((item) => (
            <p
              className={"product"}
              key={searchResultsRawMaterials.indexOf(item)}
              onClick={() => handleItemOverlay(item)}
            >
              {item.name}
            </p>
          ))}
        </div>
      )}
      {showItemOverlay && (
        <div
          className={"item_overlay_bg"}
          onClick={() => setShowItemOverlay(false)}
        >
          {overlayItem.client ? (
            <div className={"item_overlay"}>
              <p>
                {overlayItem.client.first_name} {overlayItem.client.last_name}
              </p>
              <p>Client Note: {overlayItem.client_note}</p>
              <p>Tracking Number: {overlayItem.tracking_number}</p>
              <div>
                Ordered Products:
                <div>
                  {overlayItem.ordered_products.map((item) => (
                    <p key={item.product}>
                      {" "}
                      ID: {item.product}. Quantity: {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={"item_overlay"}>
              {overlayItem.title && <p>{overlayItem.title}</p>}
              {overlayItem.name && <p>{overlayItem.name}</p>}
              {overlayItem.description && (
                <p>Description: {overlayItem.description}</p>
              )}
              <p>Quantity Available: {overlayItem.quantity_available}</p>
              {overlayItem.max_quantity && (
                <p>Max Quantity: {overlayItem.max_quantity}</p>
              )}
              {overlayItem.price && <p>Price: {overlayItem.price}</p>}
              {overlayItem.cost && <p>Cost: {overlayItem.cost}</p>}
              {overlayItem.production_cost && (
                <p>Production Cost: {overlayItem.production_cost}</p>
              )}
              {overlayItem.category && <p>Category: {overlayItem.category}</p>}
            </div>
          )}
        </div>
      )}
      <div>
        <div className="dash_top" onClick={() => setShowSearchResults(false)}>
          <div className={"left"}>
            <div className="top_products">
              <h3 className={"header"}>Top Products</h3>
              <ol>
                {soldProducts &&
                  Object.keys(soldProducts)
                    .sort(
                      (productNameA, productNameB) =>
                        soldProducts[productNameB] - soldProducts[productNameA],
                    )
                    .slice(0, 5)
                    .map((productName) => (
                      <li key={productName} className="task">
                        <p>{productName}</p>
                        <p>{soldProducts[productName]} Sold</p>
                      </li>
                    ))}
              </ol>
            </div>
            <div className={"tasks"}>
              <div className={"header"}>
                <h3>Tasks</h3> <p>Due Date</p>
              </div>
              {tasks.map((task) => (
                <div className={"task"} key={tasks.indexOf(task)}>
                  <input type={"checkbox"} />
                  <p>{task.todo}</p>
                  <p>{task.due}</p>
                </div>
              ))}
            </div>
            <div className={"suppliers"}>
              <div className={"header"}>
                <h3>Suppliers</h3>
              </div>
              <div className={"supplier_container"}>
                {suppliers.map((supplier) => (
                  <div className={"supplier"} key={suppliers.indexOf(supplier)}>
                    <h4>{supplier.name}</h4>
                    <p>{supplier.phone}</p>
                    <p>{supplier.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={"right"}>
            <div className="weekly_budget">
              <h3>YTD Income & Expenses</h3>
              <div className={"earnings"}>
                {/*<h4>Income</h4>*/}
                <h2 className={"income"}>
                  {profitLoss.profit.toLocaleString()}
                </h2>
                {/*<h4>Expenses</h4>*/}
                <h2 className={"expenses"}>
                  {profitLoss["Total Cost"].toLocaleString()}
                </h2>
              </div>
              <div className={"pie_chart"}>
                <PieChart chartData={profitChartData} />
              </div>
            </div>
            <div className={"customer_orders"}>
              <h3>Customer Orders</h3>
              <div className={"order-header"}>
                <h5 className={"tracking_num"}>Track</h5>
                <h5 className={"status"}>Status</h5>
                <h5>Due Date</h5>
              </div>
              {clientOrders
                .filter((item) => clientOrders.indexOf(item) < 5)
                .map((order) => (
                  <div className={"order"} key={order.id}>
                    <p className={""}>{order.tracking_number.slice(-6)}</p>
                    <p>{order.order_status === 1 ? "Working" : "Completed"}</p>
                    <p className={""}>
                      {order.due_date ? order.due_date : "None"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={"raw_material_inventory"}>
          <h3>Raw Material Inventory</h3>
          <BarChart chartdata={rawMaterialChartData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
