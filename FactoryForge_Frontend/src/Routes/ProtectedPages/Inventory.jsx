import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFetchProducts,
  useFetchRawMaterials,
} from "../../Components/InventoryComponent/FetchesInventory";
import {
  handleSubmitProduct,
  handleSubmitRawMaterial,
} from "../../Components/InventoryComponent/SubmitFormsInventory";
import ProductInventoryComponent from "../../Components/InventoryComponent/ProductInventoryComponent";
import RawMaterialInventoryComponent from "../../Components/InventoryComponent/RawMaterialInventoryComponent";
import LowOnInventoryComponent from "../../Components/InventoryComponent/LowOnInventoryComponent";

const Inventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showFormRawMat, setShowFormRawMat] = useState(false);
  const [showFormProduct, setShowFormProduct] = useState(false);
  const [requiredMat, setRequiredMat] = useState([]);
  const [formDataProduct, setFormDataProduct] = useState({
    title: "",
    description: "",
    quantity_available: "",
    price: "",
    production_cost: "",
    category: "",
    raw_material_requirements: "",
  });
  const [rawMaterialFormData, setRawMaterialFormData] = useState({
    name: "",
    quantity_available: "",
    inventory: "",
    max_quantity: "",
    cost: "",
  });

  /*********************************************************************/
  /*-----Imported from other files-----*/

  /*Imported from ../../Components/InventoryComponent/FetchesInventory*/
  useFetchProducts(setProducts);
  useFetchRawMaterials(setRawMaterials);

  /*Imported from ../../Components/InventoryComponent/SubmitFormsInventory*/
  const handleFormProductSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitProduct(formDataProduct, toggleFormProduct);
  };

  /*Imported from ../../Components/InventoryComponent/SubmitFormsInventory*/
  const handleFormRawMaterialSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitRawMaterial(rawMaterialFormData, toggleFormRawMat);
  };

  /*-----Imported from other files End-----*/
  /*********************************************************************/

  /*********************************************************************/
  /*-----Product Form Functions-----*/

  const toggleFormProduct = () => {
    setShowFormProduct(!showFormProduct);
  };

  const handleCloseProductForm = () => {
    setShowFormProduct(false);
    setRequiredMat([]);
    setFormDataProduct({
      title: "",
      description: "",
      quantity_available: "",
      price: "",
      production_cost: "",
      category: "",
      raw_material_requirements: {},
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataProduct({
      ...formDataProduct,
      [name]: value,
    });
  };

  const handleRawMaterialChange = (e, materialName) => {
    const { value } = e.target;
    setFormDataProduct((prevData) => ({
      ...prevData,
      raw_material_requirements: {
        ...prevData.raw_material_requirements,
        [materialName]: parseInt(value) || 0,
      },
    }));
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

  /*-----Product Form Functions End-----*/
  /*********************************************************************/

  /*********************************************************************/
  /*-----Raw Material Form Functions-----*/

  const toggleFormRawMat = () => {
    setShowFormRawMat(!showFormRawMat);
  };

  const handleCloseRawMatForm = () => {
    setShowFormRawMat(false);
    setRawMaterialFormData({
      name: "",
      quantity_available: "",
      inventory: "",
      max_quantity: "",
      cost: "",
    });
  };

  const handleRawMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setRawMaterialFormData({
      ...rawMaterialFormData,
      [name]: value,
    });
  };

  /*-----Raw Material Form Functions End-----*/
  /*********************************************************************/

  return (
    <div>
      <h1 className="route-title">Inventory</h1>
      <div className="background-frame">
        {/*********************************************************************/}

        {/*Imported from ../../Components/InventoryComponent/ProductInventoryComponent*/}
        <ProductInventoryComponent
          products={products}
          navigate={navigate}
          toggleFormProduct={toggleFormProduct}
          showFormProduct={showFormProduct}
          handleFormProductSubmit={handleFormProductSubmit}
          handleCloseProductForm={handleCloseProductForm}
          formDataProduct={formDataProduct}
          handleInputChange={handleInputChange}
          requiredMat={requiredMat}
          rawMaterials={rawMaterials}
          handleRequiredMatChange={handleRequiredMatChange}
          handleRawMaterialChange={handleRawMaterialChange}
          handleDeleteRequiredMaterial={handleDeleteRequiredMaterial}
        />
        {/*********************************************************************/}

        {/*********************************************************************/}

        {/*Imported from ../../Components/InventoryComponent/RawMaterialInventoryComponent*/}
        <RawMaterialInventoryComponent
          rawMaterials={rawMaterials}
          navigate={navigate}
          toggleFormRawMat={toggleFormRawMat}
          showFormRawMat={showFormRawMat}
          handleFormRawMaterialSubmit={handleFormRawMaterialSubmit}
          handleCloseRawMatForm={handleCloseRawMatForm}
          rawMaterialFormData={rawMaterialFormData}
          handleRawMaterialInputChange={handleRawMaterialInputChange}
        />
      </div>
      {/*********************************************************************/}

      {/*********************************************************************/}
      <div className="inventory-bottom-part">
        {/*Imported from ../../Components/InventoryComponent/LowOnInventoryComponent*/}
        <LowOnInventoryComponent rawMaterials={rawMaterials} />
      </div>
      {/*********************************************************************/}
    </div>
  );
};

export default Inventory;
