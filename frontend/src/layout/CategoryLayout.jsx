import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../features/products/components/ProductCard";
import FilterPanel from "../features/products/components/FilterPanel";
import { axiosi } from "../config/axios";

const CategoryLayout = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axiosi.get(
          `/products/latest-products/${categoryName}`,
          {
            params: filters,
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching Products", error);
      }
    };
    loadProducts();
  }, [categoryName, filters]);

  console.log(products, "Products");

  return (
    <div className="flex container mx-auto px-6 md:px-12">
      {/* filter component  */}
      <FilterPanel filters={filters} setFilters={setFilters} />

      {/* products */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found for {categoryName}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryLayout;
