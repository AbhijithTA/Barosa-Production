import { useState, useEffect } from "react";
import { axiosi } from "../config/axios";

export const useProducts = ({ category, subCategory, sort, page, limit }) => {
  const [products, setProducts] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchStatus("pending");

        // Ensure category and subCategory are correctly formatted
        const params = {
          ...(category ? { category } : {}), // Only include category if it exists
          ...(subCategory ? { subCategory } : {}), // Only include subCategory if it exists
          ...(sort?.sort ? { sort: sort.sort } : {}),
          ...(sort?.order ? { order: sort.order } : {}),
          page: page || 1, // Default to page 1
          limit: limit || 10, // Default limit if not specified
        };

        console.log("Fetching products with params:", params); 

        // Fetch products with query parameters
        const response = await axiosi.get("/products", { params });

        setProducts(response.data);
        setTotalCount(Number(response.headers["x-total-count"]) || 0);
        setFetchStatus("fulfilled");
      } catch (error) {
        console.error("Error fetching products:", error);
        setFetchStatus("error");
      }
    };

    fetchProducts();
  }, [category, subCategory, sort, page, limit]); // Dependencies ensure re-fetch

  return { products, fetchStatus, totalCount };
};
