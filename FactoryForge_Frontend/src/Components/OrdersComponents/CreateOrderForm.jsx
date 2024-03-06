import { useEffect, useState } from "react";
import API from "../../api/API";

const CreateOrderForm = ({
  toggleCreateOrder,
  createOrderTitle,
  fetchRawMaterialOrders,
  fetchClientOrders,
  config,
  accessToken,
}) => {
  const [clientOrderFormData, setClientOrderFormData] = useState({
    client: "",
    ordered_products: [],
    client_note: "",
    due_date: "",
  });
  const [rawMaterialFormData, setRawMaterialFormData] = useState({
    supplier: "",
    raw_materials_order: {},
    delivery_date: "",
  });
  const [productsList, setProductsList] = useState([]); // fetching
  const [rawMaterialsList, setRawMaterialsList] = useState([]); //fetching

  const [addedProductsList, setAddedProductsList] = useState([]);
  const [addedRawMaterialsList, setAddedRawMaterialsList] = useState([]);

  const [clientsList, setClientsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);

  const fetchProductsList = async () => {
    try {
      const response = await API.get("products/");
      setProductsList(response.data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const fetchClientsList = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("users/clients/");
      setClientsList(response.data);
    } catch (error) {
      console.error("Error fetching clients: ", error);
    }
  };

  const fetchSuppliersList = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("suppliers/");
      setSuppliersList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers: ", error);
    }
  };

  const fetchRawMaterialsList = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("raw_materials/");
      setRawMaterialsList(response.data);
    } catch (error) {
      console.error("Error fetching raw materials: ", error);
    }
  };

  useEffect(() => {
    fetchProductsList();
    fetchClientsList();
    fetchSuppliersList();
    fetchRawMaterialsList();
  }, []);

  const handleClientOrderSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const res = await API.post("client_orders/", clientOrderFormData, config);
      toggleCreateOrder();
      fetchClientOrders();
      console.log("Client Order created:", res.data);
    } catch (error) {
      console.error("Error creating client order: ", error);
    }
  };

  const handleRawMaterialOrderSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const res = await API.post(
        "raw_materials_orders/",
        rawMaterialFormData,
        config,
      );
      toggleCreateOrder();
      fetchRawMaterialOrders();
      console.log("Raw Materials Order created:", res.data);
    } catch (error) {
      console.error("Error creating raw materials order: ", error);
    }
  };

  const handleAddedProductChange = (newValue) => {
    if (!addedProductsList.includes(newValue)) {
      setAddedProductsList((prevAddedProds) => [...prevAddedProds, newValue]);
    }
  };

  const handleAddedRawMaterialsChange = (newValue) => {
    if (!addedRawMaterialsList.includes(newValue)) {
      setAddedRawMaterialsList((prevAddedRawMats) => [
        ...prevAddedRawMats,
        newValue,
      ]);
    }
  };

  const handleProductListChange = (e, productName) => {
    const { value } = e.target;
    setClientOrderFormData((prevData) => {
      const updatedProducts = prevData.ordered_products.map((product) => {
        if (product.product_name === productName) {
          return {
            ...product,
            quantity: parseInt(value) || 0,
          };
        }
        return product;
      });

      if (
        !updatedProducts.some((product) => product.product_name === productName)
      ) {
        updatedProducts.push({
          product_name: productName,
          quantity: parseInt(value) || 0,
        });
      }
      return {
        ...prevData,
        ordered_products: updatedProducts,
      };
    });
  };

  const handleRawMaterialListChange = (e, rawMaterialName) => {
    const { value } = e.target;

    setRawMaterialFormData((prevData) => ({
      ...prevData,
      raw_materials_order: {
        ...prevData.raw_materials_order,
        [rawMaterialName]: parseInt(value) || 0,
      },
    }));
  };

  const handleDeleteProductFromList = (e, index) => {
    e.preventDefault();
    setAddedProductsList((prevProductData) =>
      prevProductData.filter((_, i) => i !== index),
    );
  };

  const handleDeleteRawMaterialFromList = (e, index) => {
    e.preventDefault();
    setAddedRawMaterialsList((prevRawMaterialData) =>
      prevRawMaterialData.filter((_, i) => i !== index),
    );
  };

  const handleClientChange = (e) => {
    setClientOrderFormData({
      ...clientOrderFormData,
      client: e.target.value,
    });
  };

  const handleSupplierChange = (e) => {
    setRawMaterialFormData({
      ...rawMaterialFormData,
      supplier: e.target.value,
    });
  };

  return (
    <>
      <div className="add-order-form">
        <span className="title-close-button-pop-up-form">
          <h3>{createOrderTitle}</h3>
          {createOrderTitle === "Create Client Order" ? (
            <button
              className="sendButton"
              type="submit"
              onClick={(e) => handleClientOrderSubmit(e)}
            >
              SEND
            </button>
          ) : (
            <button
              className="sendButton"
              type="submit"
              onClick={(e) => handleRawMaterialOrderSubmit(e)}
            >
              SEND
            </button>
          )}
          <button onClick={toggleCreateOrder}>X</button>
        </span>
        {createOrderTitle === "Create Client Order" ? (
          <div className="formdata_inputfields">
            <form>
              <div className="left-side-order-form">
                <select
                  className="client-select"
                  onChange={(e) => handleClientChange(e)}
                >
                  <option>Select Client</option>
                  {clientsList.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.username}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Client Note"
                  onChange={(e) =>
                    setClientOrderFormData({
                      ...clientOrderFormData,
                      client_note: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  placeholder="Due Date"
                  title="Add a Due Date"
                  onChange={(e) =>
                    setClientOrderFormData({
                      ...clientOrderFormData,
                      due_date: e.target.value,
                    })
                  }
                />
                <div>
                  <select
                    onChange={(e) => handleAddedProductChange(e.target.value)}
                    className="product-select"
                  >
                    <option value="requiredproduct">Select Product</option>
                    {productsList.map((product) => (
                      <option key={product.id} value={product.title}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {addedProductsList.length > 0 && (
                <div className="right-side-order-form">
                  <ul>
                    {addedProductsList.map((product, index) => (
                      <li key={index}>
                        <div>{product}</div>
                        <input
                          type="number"
                          placeholder="qty"
                          onChange={(e) => handleProductListChange(e, product)}
                        />
                        <button
                          onClick={(e) => handleDeleteProductFromList(e, index)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="formdata_inputfields">
            <form>
              <div className="left-side-order-form">
                <select
                  className="client-select"
                  onChange={(e) => handleSupplierChange(e)}
                >
                  <option>Select Supplier</option>
                  {suppliersList.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.username}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  title="Add a Delivery Date"
                  placeholder="Delivery Date"
                  onChange={(e) =>
                    setRawMaterialFormData({
                      ...rawMaterialFormData,
                      delivery_date: e.target.value,
                    })
                  }
                />
                <div>
                  <select
                    onChange={(e) =>
                      handleAddedRawMaterialsChange(e.target.value)
                    }
                    className="product-select"
                  >
                    <option value="requiredrawmaterial">
                      Select Raw Material
                    </option>
                    {rawMaterialsList.map((rawMaterial) => (
                      <option key={rawMaterial.id} value={rawMaterial.name}>
                        {rawMaterial.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {addedRawMaterialsList.length > 0 && (
                <div className="right-side-order-form">
                  <ul>
                    {addedRawMaterialsList.map((rawmaterialName, index) => (
                      <li key={index}>
                        <div>{rawmaterialName}</div>
                        <input
                          type="number"
                          placeholder="qty"
                          onChange={(e) =>
                            handleRawMaterialListChange(e, rawmaterialName)
                          }
                        />
                        <button
                          onClick={(e) =>
                            handleDeleteRawMaterialFromList(e, index)
                          }
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateOrderForm;
