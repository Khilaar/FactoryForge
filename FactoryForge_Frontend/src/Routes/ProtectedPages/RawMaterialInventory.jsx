import { useEffect, useState, useMemo } from "react";
import API from "../../api/API";

const RawMaterialInventory = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /*********************************************************************/

  /*Fetch all the raw materials and save them with use state*/
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/raw_materials/");
        setRawMaterials(response.data);
      } catch (error) {
        console.error("Error fetching raw materials: ", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredRawMaterials = useMemo(() => {
    return rawMaterials.filter((rawMaterial) =>
      rawMaterial.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [rawMaterials, searchQuery]);

  /*********************************************************************/

  /*********************************************************************/

  /*Delete a product by pressing the X button*/
  const handleDeleteRawMat = async (matId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access Token not found");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await API.delete(`/raw_materials/${matId}/`, config);
      setRawMaterials((prevRawMaterials) =>
        prevRawMaterials.filter((rawMat) => rawMat.id !== matId),
      );
      console.log("Raw Material deleted");
    } catch (error) {
      console.error("Error deleting raw Material: ", error);
    }
  };

  /*********************************************************************/

  return (
    <div className="background-frame-productinventory">
      <section>
        {/*********************************************************************/}

        {/*Products Title and search*/}
        <div className="title-and-searchbar">
          <h3>All Raw Materials</h3>
          <span className="searchbar">
            <h3>search</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>
        </div>
        {/*Products Title and search End*/}

        {/*********************************************************************/}

        {/*********************************************************************/}

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
              <button className="x-button">X</button>
            </li>
          }
        </ul>
        {/*Products List sort fields End*/}

        {/*********************************************************************/}
      </section>
      <section>
        {/*********************************************************************/}

        {/*Raw Materials Inventory*/}
        <ul>
          {filteredRawMaterials.map((rawMaterials) => (
            <li key={rawMaterials.id} className="list-item">
              <span>{rawMaterials.id}</span>
              <span>{rawMaterials.name}</span>
              <span>{rawMaterials.cost}</span>
              <span>{rawMaterials.quantity_available}</span>
              <span>{rawMaterials.restock_required ? "Yes" : "No"}</span>
              <button
                className="x-button"
                onClick={() => handleDeleteRawMat(rawMaterials.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        {/*Raw Materials Inventory End*/}

        {/*********************************************************************/}
      </section>
    </div>
  );
};

export default RawMaterialInventory;
