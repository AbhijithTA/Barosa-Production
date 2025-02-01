import { useOutletContext, useParams } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { Grid, Stack } from "@mui/material";
import { ProductCard } from "../components/ProductCard";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";

const SubcategoryLayout = () => {
  const { categoryTitle, subcategoryTitle } = useParams();
  const { categories, subCategories } = useOutletContext();

  //finding the current category and subcategory ids
  const currentCategory = categories.find(
    (category) =>
      category.name.toLowerCase() === categoryTitle.toLocaleLowerCase()
  );

  const currentSubCategory = subCategories.find(
    (subCategory) =>
      subCategory.name.toLowerCase() === subcategoryTitle.toLowerCase()
  );

  console.log(currentCategory, "curent cateogry");
  console.log(currentSubCategory, "current subcategory");

  const { products, fetchStatus } = useProducts({
    category: currentCategory?._id,
    subCategory: currentSubCategory?._id,
    sort: null,
    page: 1,
    limit: 10,
  });

  return fetchStatus === "pending" ? (
    <Stack alignItems="center" justifyContent="center" height="50vh">
      <Lottie animationData={loadingAnimation} />
    </Stack>
  ) : (
    <Grid container spacing={2} justifyContent="center">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </Grid>
  );
};

export default SubcategoryLayout;
