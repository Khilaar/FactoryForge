const LowOnInventoryComponent = ({ rawMaterials }) => {
  return (
    <div className="low-on-inventory">
      <ul>
        <h2>Low on Raw Materials</h2>
        {rawMaterials
          .filter((material) => material.restock_required)
          .slice(0, 5)
          .map((rawMaterial) => (
            <li key={rawMaterial.id} className="list-item">
              <span>id {rawMaterial.id}</span>
              <span>{rawMaterial.name}</span>
              <span>quantity: {rawMaterial.quantity_available}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LowOnInventoryComponent;
