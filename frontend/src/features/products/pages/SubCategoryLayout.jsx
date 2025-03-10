import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { Grid, Stack } from "@mui/material";
import { ProductCard } from "../components/ProductCard";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";

const SubcategoryLayout = () => {
  const { categoryTitle, subcategoryTitle } = useParams();
  const { categories, subCategories } = useOutletContext();
  const navigate = useNavigate();

  //finding the current category and subcategory ids
  const currentCategory = categories.find(
    (category) =>
      category.name.toLowerCase() === categoryTitle.toLocaleLowerCase()
  );

  const currentSubCategory = subCategories.find(
    (subCategory) =>
      subCategory.name.toLowerCase() === subcategoryTitle.toLowerCase()
  );

  const { products, fetchStatus } = useProducts({
    category: currentCategory?._id,
    subCategory: currentSubCategory?._id,
    sort: null,
    page: 1,
    limit: 10,
  });

  if (fetchStatus === "loading") {
    return (
      <Stack alignItems="center" justifyContent="center" height="50vh">
        <Lottie animationData={loadingAnimation} />
      </Stack>
    );
  }

  if (fetchStatus === "fulfilled" && (!products || products.length === 0)) {
    return (
      <p className="text-center text-gray-500 w-full mt-8 ">
        No products found for this subcategory.
      </p>
    );
  }

 

  return (
    <Grid container spacing={2} justifyContent="center">
      {products.map((product) => (
        
        <ProductCard
          key={product._id}
          id={product._id}
          title={product.title}
          thumbnail={product.thumbnail}
          price={product.price}
          onClick={() => navigate(`/product-details/${product._id}`)}
        />
      ))}
    </Grid>
  );
};

export default SubcategoryLayout;
