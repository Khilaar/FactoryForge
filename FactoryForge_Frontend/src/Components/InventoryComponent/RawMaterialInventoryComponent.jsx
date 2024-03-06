const RawMaterialInventoryComponent = ({
  rawMaterials,
  navigate,
  toggleFormRawMat,
  showFormRawMat,
  handleFormRawMaterialSubmit,
  handleCloseRawMatForm,
  rawMaterialFormData,
  handleRawMaterialInputChange,
}) => {
  return (
    <section>
      <section>
        {/*Raw Materials Inventory*/}
        <ul>
          <h2>Raw Materials</h2>
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
                  <p>cost</p>
                </span>
                <span>
                  <p>available amount</p>
                </span>
                <span>
                  <p>restock required?</p>
                </span>
              </li>
            }
          </ul>
          {/*Products List sort fields End*/}
          {rawMaterials.slice(0, 4).map((rawMaterials) => (
            <li key={rawMaterials.id} className="list-item">
              <span>{rawMaterials.id}</span>
              <span>{rawMaterials.name}</span>
              <span>{rawMaterials.cost}</span>
              <span>{rawMaterials.quantity_available}</span>
              <span>{rawMaterials.restock_required ? "Yes" : "No"}</span>
            </li>
          ))}
        </ul>
        {/*Raw Materials Inventory End*/}
      </section>

      {/*Products Add and See Button*/}
      <section className="inventory-background-buttons">
        <button
          className="see-more-button"
          onClick={() => navigate("/rawmaterialinventory")}
        >
          <span>SEE</span>
        </button>

        <button onClick={!showFormRawMat ? toggleFormRawMat : undefined}>
          <span>ADD</span>
        </button>
        {showFormRawMat && (
          <div
            className="order-form"
            style={{ maxWidth: "700px", minWidth: "500px" }}
          >
            <form
              className="inner-part-form"
              onSubmit={handleFormRawMaterialSubmit}
            >
              {/* Inventory Order Form Raw Material */}
              <span className="title-close-button-pop-up-form">
                <h2>Add Raw Material</h2>
                <button onClick={handleCloseRawMatForm}>X</button>
              </span>
              <div className="inventory-order-form-raw-material">
                <span>
                  <h3>Raw Material </h3>
                  <input
                    className="inventory-order-form-mat-input"
                    type="text"
                    name="name"
                    value={rawMaterialFormData.name}
                    onChange={handleRawMaterialInputChange}
                  />
                </span>
                <div className="quantity-span-add-raw-mat">
                  <div>
                    <h3>Quantity </h3>
                    <input
                      className="inventory-order-form-mat-quantity-input"
                      type="text"
                      name="quantity_available"
                      value={rawMaterialFormData.quantity_available}
                      onChange={handleRawMaterialInputChange}
                    />
                  </div>

                  <span>
                    <div>
                      <h3>Max Quantity </h3>
                      <input
                        className="inventory-order-form-mat-quantity-input"
                        type="text"
                        name="max_quantity"
                        value={rawMaterialFormData.max_quantity}
                        onChange={handleRawMaterialInputChange}
                      />
                    </div>
                  </span>
                </div>
              </div>
              {/* Inventory Order Form Raw Material End */}

              {/* Inventory Order Form Supplier */}

              {/* Inventory Order Form Supplier End */}

              <div className="inventory-order-form-supplier">
                <span className="span-cost-add-raw-mat">
                  <h3>Cost</h3>
                  <input
                    className="inventory-order-form-mat-input"
                    type="text"
                    name="cost"
                    value={rawMaterialFormData.cost}
                    onChange={handleRawMaterialInputChange}
                  />
                </span>
              </div>
              <button type="submit">
                <span>ADD</span>
              </button>
            </form>
          </div>
        )}
      </section>
      {/*Products Add and See Button End*/}
    </section>
  );
};

export default RawMaterialInventoryComponent;
