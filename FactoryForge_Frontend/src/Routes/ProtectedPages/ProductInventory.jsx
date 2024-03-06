import { useState, useEffect, useMemo } from "react";
import API from "../../api/API";
import { Link } from "react-router-dom";

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /*********************************************************************/

  /*Fetch all the products and save them with use state*/
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await API.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching Products: ", error);
      }
    };

    fetchRawMaterials();
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  /*********************************************************************/

  /*********************************************************************/

  /*Delete a product by pressing the X button*/
  const handleDeleteProduct = async (productId) => {
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

      await API.delete(`/products/${productId}/`, config);
      setProducts(products.filter((product) => product.id !== productId));
      console.log("Product deleted");
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  /*********************************************************************/

  return (
    <div className="background-frame-productinventory">
      <section>
        {/*********************************************************************/}

        {/*Products Title and search*/}
        <div className="title-and-searchbar">
          <h2>All Products</h2>
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
                <p>production cost</p>
              </span>
              <span>
                <p>available amount</p>
              </span>
              <span className="list-item-price">
                <p>price</p>
              </span>
              <button className="x-button">X</button>
            </li>
          }
        </ul>
        {/*Products List sort fields End*/}

        {/*********************************************************************/}

        {/*********************************************************************/}

        {/*Products List*/}
        <ul className="items-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="list-item">
              <Link
                to={`/productdetail/${product.id}`}
                className="product-link"
              >
                <span>{product.id}</span>
                <span>{product.title}</span>
                <span>{product.production_cost}</span>
                <span>{product.quantity_available}</span>
                <span>{product.price}.-</span>
              </Link>
              <button
                className="x-button"
                onClick={() => handleDeleteProduct(product.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        {/*Products List End*/}

        {/*********************************************************************/}
      </section>
    </div>
  );
};

export default ProductInventory;
