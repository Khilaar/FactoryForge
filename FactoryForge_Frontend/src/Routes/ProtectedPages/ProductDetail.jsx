import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import defaultproductimage from "../../Assets/default-product-image.png";
import { useFetchRawMaterials } from "../../Components/InventoryComponent/FetchesInventory";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [requiredMat, setRequiredMat] = useState([]);
  const [updatedProduct, setUpdatedProduct] = useState({
    title: "",
    description: "",
    quantity_available: 0,
    price: "",
    production_cost: "",
    category: null,
    raw_material_requirements: {},
  });

  useFetchRawMaterials(setRawMaterials);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (rawMaterials.length > 0 && product) {
      setIsLoading(false);
    }
  }, [rawMaterials, product]);

  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const getRawMaterialNameById = (id) => {
    const rawMaterial = rawMaterials.find(
      (material) => material.id === Number(id),
    );
    return rawMaterial ? rawMaterial.name : "Loading...";
  };

  const handleFormSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const updatedFields = {};
      if (updatedProduct.title) {
        updatedFields.title = updatedProduct.title;
      }
      if (updatedProduct.description) {
        updatedFields.description = updatedProduct.description;
      }
      if (updatedProduct.price) {
        updatedFields.price = updatedProduct.price;
      }
      if (updatedProduct.category) {
        updatedFields.category = updatedProduct.category;
      }
      if (updatedProduct.raw_material_requirements) {
        updatedFields.raw_material_requirements =
          updatedProduct.raw_material_requirements;
      }

      if (Object.keys(updatedFields).length === 0) {
        console.error("No fields updated.");
        return;
      }

      const response = await API.patch(
        `/products/${id}/`,
        updatedFields,
        config,
      );
      console.log("Product updated successfully:", response.data);
      setProduct(response.data);
      setShowForm(false);
      setUpdatedProduct({});
      window.location.reload();
    } catch (error) {
      console.error("Error updating Product: ", error);
    }
  };

  const handleRequiredMatChange = (newValue) => {
    if (!requiredMat.includes(newValue)) {
      setRequiredMat((prevRequiredMat) => [...prevRequiredMat, newValue]);
    }
  };

  const handleDeleteRequiredMaterial = (index) => {
    setRequiredMat((prevRequiredMat) =>
      prevRequiredMat.filter((_, i) => i !== index),
    );
  };

  const handleRawMaterialChange = (e, materialName) => {
    const { value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      raw_material_requirements: {
        ...prevProduct.raw_material_requirements,
        [materialName]: parseInt(value) || 0,
      },
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background-frame-product-detail">
      <h1>ProductDetail</h1>

      <img className="product-image-default" src={defaultproductimage} alt="" />
      <div className="product-detail-table">
        <li key={"product-name"} className="list-item">
          <span>
            <p>name</p>
            <p className="p-rigth">{product.title}</p>
          </span>
        </li>
        <li key={"product-id"} className="list-item">
          <span>
            <p>id</p>
            <p className="p-rigth">{product.id}</p>
          </span>
        </li>
        <li key={"product-description"} className="list-item">
          <span>
            <p>description</p>
            <p className="p-rigth">{product.description}</p>
          </span>
        </li>
        <li key={"product-price"} className="list-item">
          <span>
            <p>price</p>
            <p className="p-rigth">{product.price}</p>
          </span>
        </li>
        <li key={"product-production-cost"} className="list-item">
          <span>
            <p>production cost</p>
            <p className="p-rigth">{product.production_cost}</p>
          </span>
        </li>
        <li key={"product-category"} className="list-item">
          <span>
            <p>category</p>
            <p className="p-rigth">{product.category}</p>
          </span>
        </li>
        <li key={"product-rawMatReq"} className="list-item">
          <span>
            <p>Raw Materials Required</p>
            <span className="product-detail-rawMatList">
              {Object.entries(product.raw_material_requirements).map(
                ([rawMatId, quantity]) => (
                  <p key={rawMatId}>
                    {getRawMaterialNameById(rawMatId)}: {quantity}
                  </p>
                ),
              )}
            </span>
          </span>
        </li>
        <button onClick={() => setShowForm(true)}>Edit Product</button>
      </div>
      {showForm && (
        <div className="add-form-product-detail">
          <div className="title-close-button-pop-up-form-patch">
            <h2>Update Product</h2>
            <button
              onClick={() => {
                setShowForm(false);
                setUpdatedProduct({});
                window.location.reload();
              }}
            >
              X
            </button>
          </div>
          <span className="product-patch-input-span">
            <input
              type="text"
              placeholder={product.title || ""}
              value={updatedProduct.title}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  title: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder={product.price}
              value={updatedProduct.price || ""}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  price: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="description"
              value={updatedProduct.description || ""}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="category"
              value={updatedProduct.category || ""}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  category: e.target.value,
                })
              }
            />
          </span>
          <span className="product-patch-rawmat-span-title">
            <h3>Required Material</h3>
            <select
              value={requiredMat > 0 ? requiredMat[0] : ""}
              onChange={(e) => handleRequiredMatChange(e.target.value)}
              className="required-raw-mat-select"
            >
              <option value="requiredMat">Select Raw Material</option>
              {rawMaterials.map((material) => (
                <option key={material.id} value={material.name}>
                  {material.name}
                </option>
              ))}
            </select>
          </span>
          <span className="product-patch-rawmat-span">
            {requiredMat.length > 0 && <h3>List of Raw Materials</h3>}
            <ul className="list-required-raw-mat">
              {requiredMat.map((material, index) => (
                <li key={index}>
                  <span className="name-and-quantity-required-mat">
                    <div className="name-required-mat-added">{material}</div>
                    <input
                      type="number"
                      placeholder="qty"
                      value={
                        updatedProduct.raw_material_requirements[material] || ""
                      }
                      onChange={(e) => handleRawMaterialChange(e, material)}
                    />
                  </span>
                  <button
                    className="item-delete-button-patch-rawmatreq"
                    onClick={() => handleDeleteRequiredMaterial(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </span>
          <button onClick={handleFormSubmit}>Update</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
