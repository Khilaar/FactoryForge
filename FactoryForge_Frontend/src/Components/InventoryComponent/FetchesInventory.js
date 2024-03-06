import { useEffect } from "react";
import API from "../../api/API";

export function useFetchProducts(setProducts) {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching Products: ", error);
      }
    };
    fetchProducts();
  }, [setProducts]);
}

export function useFetchRawMaterials(setRawMaterials) {
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await API.get("/raw_materials/");
        setRawMaterials(response.data);
      } catch (error) {
        console.error("Error fetching raw materials: ", error);
      }
    };

    fetchRawMaterials();
  }, [setRawMaterials]);
}
