import { useState, useEffect } from "react";
import API from "../../api/API";
import PieChart from "../../Components/Charts/PieChart.jsx";

const Analytics = () => {
  const [soldProducts, setSoldProducts] = useState(null);
  const [usedMaterials, setUsedMaterials] = useState(null);
  const [totalQuantityByClient, setTotalQuantityByClient] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await API.get("/analytics/statistics/", {
          params: {
            start_date: "2024-01-01",
            end_date: "2024-03-31",
          },
        });
        setSoldProducts(response.data[1]["Sold Products"]);
        setUsedMaterials(response.data[0]["Used Material"]);
        totalSoldProducts();
      } catch (error) {
        console.error("Error fetching statistics: ", error);
      }
    };
    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchClientOrderAmount = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await API.get("/client_orders/history/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const newTotalQuantityByClient = {};

        response.data.forEach((clientOrder) => {
          const clientId = clientOrder.client.id;
          const clientName = `${clientOrder.client.first_name} ${clientOrder.client.last_name}`;
          let totalQuantity = 0;

          clientOrder.ordered_products.forEach((orderedProduct) => {
            totalQuantity += orderedProduct.quantity;
          });

          if (newTotalQuantityByClient[clientId]) {
            newTotalQuantityByClient[clientId].totalQuantity += totalQuantity;
          } else {
            newTotalQuantityByClient[clientId] = { clientName, totalQuantity };
          }
        });
        const totalQuantityArray = Object.values(newTotalQuantityByClient);
        totalQuantityArray.sort((a, b) => b.totalQuantity - a.totalQuantity);
        const top3Clients = totalQuantityArray.slice(0, 3);
        setTotalQuantityByClient(top3Clients);
      } catch (error) {
        console.error("Error fetching statistics: ", error);
      }
    };

    fetchClientOrderAmount();
  }, []);

  const totalSoldProducts = () => {
    if (soldProducts) {
      const valuesArray = Object.values(soldProducts);
      const sum = valuesArray.reduce(
        (total, currentValue) => total + currentValue,
        0,
      );
      return sum;
    }
  };

  const totalUsedMaterials = () => {
    if (usedMaterials) {
      const valuesArray = Object.values(usedMaterials);
      const sum = valuesArray.reduce(
        (total, currentValue) => total + currentValue,
        0,
      );
      return sum;
    }
  };

  return (
    <>
      <h1 className="route-title">Analytics</h1>
      <div className="analytics-cotainer">
        <div className="analytics-overlay">
          <span>
            <div className="background-frame-analytics-top-seller">
              <h2>Top Seller</h2>
              <ul>
                {soldProducts &&
                  Object.keys(soldProducts)
                    .sort(
                      (productNameA, productNameB) =>
                        soldProducts[productNameB] - soldProducts[productNameA],
                    )
                    .slice(0, 3)
                    .map((productName) => (
                      <li key={productName} className="list-item">
                        <p>{productName}</p>
                        <p>Quantity: {soldProducts[productName]}</p>
                      </li>
                    ))}
              </ul>
            </div>
            <div className="background-frame-analytics-top-seller">
              <h2>Most used materials</h2>
              <ul>
                {usedMaterials &&
                  Object.keys(usedMaterials)
                    .sort(
                      (materialNameA, materialNameB) =>
                        usedMaterials[materialNameB] -
                        usedMaterials[materialNameA],
                    )
                    .slice(0, 3)
                    .map((materialName) => (
                      <li key={materialName} className="list-item">
                        <p>{materialName}</p>
                        <p>Quantity: {usedMaterials[materialName]}</p>
                      </li>
                    ))}
              </ul>
            </div>
            <div>
              <div className="background-frame-analytics-top-seller">
                <h2>Top Clients</h2>
                <h3>By Product amounts ordered</h3>
                <ul>
                  {totalQuantityByClient.map((clientInfo, index) => (
                    <li key={index} className="list-item">
                      <p>{clientInfo.clientName}</p>
                      <p>Total Bought Products: {clientInfo.totalQuantity}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </span>

          <span className="small-screen-change-span">
            <span>
              <div className="background-frame-analytics">
                <h2>Sold Products</h2>
                <ul>
                  {soldProducts &&
                    Object.entries(soldProducts).map(
                      ([productName, quantity]) => (
                        <li key={productName} className="list-item">
                          <p>{productName}</p>
                          <p>Quantity: {quantity}</p>
                        </li>
                      ),
                    )}
                </ul>
                <h4>Total sold products: {totalSoldProducts()}</h4>
                <div className="background-frame-piechart">
                  <div className={"sold-products-chart"}>
                    {soldProducts && (
                      <PieChart
                        chartData={{
                          labels: Object.keys(soldProducts),

                          datasets: [
                            {
                              label: "Quantity Sold",
                              data: Object.values(soldProducts),
                              backgroundColor: [
                                "#151724",
                                "#6e248a",
                                "#fcff00",
                                "#40C9A2",
                                "#CC4BC2",
                                "#BBB5BD",
                                "#8EE3F5",
                              ],
                              borderWidth: 0,
                            },
                          ],
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </span>
            <div className="background-frame-analytics">
              <h2>Used Materials</h2>
              <ul>
                {usedMaterials &&
                  Object.entries(usedMaterials).map(
                    ([usedMaterialsName, quantity], index) => (
                      <li
                        key={`${usedMaterialsName}-${index}`}
                        className="list-item"
                      >
                        <span>{usedMaterialsName}</span>
                        <span>Quantity: {quantity}</span>
                      </li>
                    ),
                  )}
              </ul>
              <h4>Total used Materials: {totalUsedMaterials()}</h4>
              <div className="background-frame-piechart">
                <div className={"used-materials-chart"}>
                  {usedMaterials && (
                    <PieChart
                      chartData={{
                        labels: Object.keys(usedMaterials),
                        datasets: [
                          {
                            label: "Quantity Used",
                            data: Object.values(usedMaterials),
                            backgroundColor: [
                              "#151724",
                              "#6e248a",
                              "#fcff00",
                              "#40C9A2",
                              "#CC4BC2",
                              "#BBB5BD",
                              "#8EE3F5",
                            ],
                            borderWidth: 0,
                          },
                        ],
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default Analytics;
