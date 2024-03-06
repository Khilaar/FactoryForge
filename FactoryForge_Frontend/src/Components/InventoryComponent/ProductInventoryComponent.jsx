const ProductInventoryComponent = ({
  products,
  navigate,
  toggleFormProduct,
  showFormProduct,
  handleFormProductSubmit,
  handleCloseProductForm,
  formDataProduct,
  handleInputChange,
  requiredMat,
  rawMaterials,
  handleRequiredMatChange,
  handleRawMaterialChange,
  handleDeleteRequiredMaterial,
}) => {
  const getTotalCost = () => {
    let totalCost = 0;
    if (formDataProduct.raw_material_requirements) {
      for (let item in formDataProduct.raw_material_requirements) {
        const value = formDataProduct.raw_material_requirements[item];
        for (let y in rawMaterials) {
          if (item === rawMaterials[y].name) {
            totalCost += rawMaterials[y].cost * value;
          }
        }
      }
      return totalCost;
    }
  };

  const deleteRequiredMaterial = (index) => {
    const material = requiredMat[index];
    const updatedFormData = { ...formDataProduct };
    // Check if quantity is specified before setting it to 0
    if (
      updatedFormData.raw_material_requirements &&
      updatedFormData.raw_material_requirements.hasOwnProperty(material)
    ) {
      updatedFormData.raw_material_requirements[material] = 0;
    }
  
    // Call handleRawMaterialChange to update state with quantity 0
    handleRawMaterialChange(
      { target: { value: 0 } }, // Simulate event object with value 0
      material
    );
  
    // Then remove the material from requiredMat
    handleDeleteRequiredMaterial(index);
  };

  return (
    <>
      <section>
        {/*Products Inventory Small*/}
        <ul>
          <h2>Products</h2>
          {/*Products List sort fields*/}
          <ul className="items-list" id="sort-list">
            {
              <li key="sort-product" className="list-item-header">
                <span>
                  <p>id</p>
                </span>
                <span>
                  <p>name</p>
                </span>
                <span>
                  <p>production cost</p>
                </span>
                <span>
                  <p>available amount</p>
                </span>
                <span>
                  <p>price</p>
                </span>
              </li>
            }
          </ul>
          {/*Products List sort fields End*/}
          {products.slice(0, 4).map((product) => (
            <li key={product.id} className="list-item">
              <span>{product.id}</span>
              <span>{product.title}</span>
              <span>{product.production_cost}</span>
              <span>{product.quantity_available}</span>
              <span>{product.price}</span>
            </li>
          ))}
        </ul>
        {/*Products Inventory Small End*/}
      </section>

      {/*Products Add and See Button*/}
      <section className="inventory-background-buttons">
        <button
          className="see-more-button"
          onClick={() => navigate("/productinventory")}
        >
          <span>SEE</span>
        </button>

        <button onClick={!showFormProduct ? toggleFormProduct : undefined}>
          <span>ADD</span>
        </button>
        {showFormProduct && (
          <div
            className="add-form"
            style={{ maxWidth: "500px", maxHeight: "450px" }}
          >
            <form onSubmit={handleFormProductSubmit}>
              {/*Inventory Order Form Raw Material*/}

              <div className="inventory-add-form-product">
                <span>
                  <span className="title-close-button-pop-up-form">
                    <h3>Add Product</h3>
                    <button onClick={handleCloseProductForm}>X</button>
                  </span>
                </span>
                <span className="input-fields-add-product">
                  <span className="left-side-add-product">
                    <span className="left-left-add-product">
                      <span>
                        <h3>Name</h3>
                        <input
                          className="inventory-add-product-input"
                          type="text"
                          name="title"
                          value={formDataProduct.title}
                          onChange={handleInputChange}
                        />
                      </span>

                      <span>
                        <h3>Price</h3>
                        <input
                          className="inventory-add-product-input"
                          type="textarea"
                          name="price"
                          value={formDataProduct.price}
                          onChange={handleInputChange}
                        />
                      </span>

                      <span>
                        <h3>Category</h3>
                        <input
                          className="inventory-add-product-input"
                          type="textarea"
                          name="category"
                          value={formDataProduct.category}
                          onChange={handleInputChange}
                        />
                      </span>
                      <button type="submit">
                        <span>ADD</span>
                      </button>
                    </span>

                    <span>
                      <span>
                        <h3>Quantity available</h3>
                        <input
                          className="inventory-add-product-input"
                          type="text"
                          name="quantity_available"
                          value={formDataProduct.quantity_available}
                          onChange={handleInputChange}
                        />
                      </span>

                      <span>
                        <h3>Required Material</h3>
                        <select
                          onChange={(e) =>
                            handleRequiredMatChange(e.target.value)
                          }
                          className="required-raw-mat-select"
                        >
                          <option value="requiredMat">
                            Select Raw Material
                          </option>
                          {rawMaterials.map((material) => (
                            <option key={material.id} value={material.name}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                        <span>
                          <h3>List of Raw Materials</h3>
                          <p style={{ margin: "12px 0px" }}>
                            Total Cost:{" "}
                            {getTotalCost() > 0
                              ? getTotalCost() + ".-"
                              : 0 + ".-"}
                          </p>
                          <ul className="list-required-raw-mat">
                            {requiredMat.map((material, index) => (
                              <li key={index}>
                                <span className="name-and-quantity-required-mat">
                                  <div className="name-required-mat-added">
                                    {material}
                                  </div>
                                  <input
                                    className="qty-raw-mat-input"
                                    type="number"
                                    placeholder="qty"
                                    value={
                                      formDataProduct.raw_material_requirements[
                                        material
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleRawMaterialChange(e, material)
                                    }
                                  />
                                </span>
                                <button
                                  onClick={() => deleteRequiredMaterial(index)}
                                >
                                  X
                                </button>
                              </li>
                            ))}
                          </ul>
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="right-side-add-product"></span>
                </span>
              </div>

              {/*Inventory Order Form Raw Material End*/}
            </form>
          </div>
        )}
      </section>
      {/*Products Add and See Button End*/}
    </>
  );
};

export default ProductInventoryComponent;
