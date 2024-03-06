import { useState, useEffect, useMemo } from "react";
import API from "../../api/API";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormRawMat, setShowFormRawMat] = useState(false);
  const [showSortPopUp, setShowSortPopUp] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [rawMaterialFormData, setRawMaterialFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    type_of_user: "",
    address: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await API.get("/users/clients/");

        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };

    fetchClients();
  }, [searchQuery, showFormRawMat]);

  const handleSubmitRawMaterial = async (e) => {
    e.preventDefault();
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

      const requestData = {
        ...rawMaterialFormData,
        type_of_user: "C",
      };

      const response = await API.post("/users/", requestData, config);
      console.log("User created:", response.data);
      setRawMaterialFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        type_of_user: "C",
        address: "",
      });
      handleCloseRawMatForm();
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  const handleRawMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setRawMaterialFormData({
      ...rawMaterialFormData,
      [name]: value,
    });
  };

  const toggleFormRawMat = () => {
    setShowFormRawMat(!showFormRawMat);
  };

  const handleCloseRawMatForm = () => {
    setShowFormRawMat(false);
  };

  const toggleSortPopUp = () => {
    setShowSortPopUp(!showSortPopUp);
  };

  const sortedClients = useMemo(() => {
    let sortedList = [...clients];

    if (sortOption) {
      sortedList.sort((a, b) => {
        const fieldA = a[sortOption].toString().toLowerCase();
        const fieldB = b[sortOption].toString().toLowerCase();
        return fieldA.localeCompare(fieldB);
      });
    }

    return sortedList.filter((client) =>
      Object.values(client).some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [clients, searchQuery, sortOption]);

  /*###########################*/
  return (
    <div>
      <div className="title-and-searchbar">
        <h1 className="route-title">Clients</h1>
      </div>

      <div
        className="background-frame-productinventory"
        style={{ minWidth: "1075px", maxWidth: "1150px" }}
      >
        {/*clients Title and search*/}
        <div className="title-and-searchbar-suppliers">
          <button onClick={toggleSortPopUp} className="supplier-button-sort">
            sort
          </button>
          <h1 className="route-title"></h1>
          <span className="searchbar-suppliers">
            <h3>Search</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>
        </div>
        {/*clients Title and search End*/}

        {/*clients List sort fields*/}
        {showSortPopUp && (
          <span className="sort-span">
            <button
              className="sort-span-button"
              onClick={() => {
                setSortOption("id");
                setShowSortPopUp(false);
              }}
            >
              id
            </button>
            <button
              className="sort-span-button"
              onClick={() => {
                setSortOption("username");
                setShowSortPopUp(false);
              }}
            >
              username
            </button>
            <button
              className="sort-span-button"
              onClick={() => {
                setSortOption("first_name");
                setShowSortPopUp(false);
              }}
            >
              first name
            </button>
            <button
              className="sort-span-button"
              onClick={() => {
                setSortOption("last_name");
                setShowSortPopUp(false);
              }}
            >
              last name
            </button>
          </span>
        )}
        <ul className="items-list" id="sort-list">
          {
            <li key="sort-product" className="list-item-client-sort">
              <span style={{ maxWidth: "70px" }}>
                <p>id</p>
              </span>
              <span style={{ minWidth: "30px", maxWidth: "200px" }}>
                <p>username</p>
              </span>
              <span style={{ minWidth: "30px", maxWidth: "200px" }}>
                <p>name</p>
              </span>
              <span style={{ minWidth: "30px", maxWidth: "275px" }}>email</span>
              <span style={{ minWidth: "30px", maxWidth: "275px" }}>
                <p>address</p>
              </span>
              <button className="invisible-button">X</button>
            </li>
          }
        </ul>
        {/*clients List sort fields End*/}

        {/*clients List*/}
        <ul className="items-list">
          {sortedClients.map((user) => (
            <li key={user.id} className="list-item">
              <span style={{ maxWidth: "70px" }}>{user.id}</span>
              <span style={{ minWidth: "30px", maxWidth: "200px" }}>
                {user.username}
              </span>
              <span style={{ minWidth: "30px", maxWidth: "200px" }}>
                {user.first_name} {user.last_name}
              </span>
              <span style={{ minWidth: "30px", maxWidth: "275px" }}>
                {user.email}
              </span>
              <span style={{ minWidth: "30px", maxWidth: "245px" }}>
                {user.address}
              </span>
              <button className="x-button">X</button>
            </li>
          ))}
        </ul>
        {/*clients List End*/}

        {/*clients Add Button*/}
        <section className="inventory-background-buttons">
          <button onClick={toggleFormRawMat}>
            <span>ADD</span>
          </button>
          {showFormRawMat && (
            <div className="order-form">
              <span className="title-close-button-pop-up-form">
                <h3>Add Client</h3>
                <button onClick={handleCloseRawMatForm}>X</button>
              </span>
              <form
                className="inner-part-form"
                onSubmit={handleSubmitRawMaterial}
              >
                {/* Input fields for adding a new client */}
                <span className="add-client-fields">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={rawMaterialFormData.username}
                    onChange={handleRawMaterialInputChange}
                  />
                  <span>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={rawMaterialFormData.first_name}
                      onChange={handleRawMaterialInputChange}
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={rawMaterialFormData.last_name}
                      onChange={handleRawMaterialInputChange}
                    />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={rawMaterialFormData.email}
                    onChange={handleRawMaterialInputChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={rawMaterialFormData.address}
                    onChange={handleRawMaterialInputChange}
                  />
                </span>

                {/* Submit button */}
                <button type="submit">
                  <span>ADD</span>
                </button>
              </form>
            </div>
          )}
        </section>
        {/*clients Add Button End*/}
      </div>
    </div>
  );
};

export default Clients;
