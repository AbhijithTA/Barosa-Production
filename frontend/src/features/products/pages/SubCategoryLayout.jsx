import { useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { Grid, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ProductCard } from "../components/ProductCard";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import { useSelector, useDispatch } from "react-redux";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
} from "../../wishlist/WishlistSlice";

const SubcategoryLayout = () => {
  const { categoryTitle, subcategoryTitle } = useParams();
  const outletContext = useOutletContext();
  const { categories = [], subCategories = [] } = outletContext || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Finding the current category and subcategory ids
  const currentCategory = categories.find(
    (category) => category.name.toLowerCase() === categoryTitle?.toLowerCase()
  );

  const currentSubCategory = subCategories.find(
    (subCategory) => subCategory.name.toLowerCase() === subcategoryTitle?.toLowerCase()
  );

  const { products, fetchStatus } = useProducts({
    category: currentCategory?._id,
    subCategory: currentSubCategory?._id,
    sort: null,
    page: 1,
    limit: 12,
  });

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      if (!loggedInUser) {
        navigate("/login");
      } else {
        const data = { user: loggedInUser._id, product: productId };
        dispatch(createWishlistItemAsync(data));
      }
    } else {
      const index = wishlistItems.findIndex(
        (item) => item.product._id === productId
      );
      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

  if (fetchStatus === "loading" || fetchStatus === "pending") {
    return (
      <Stack alignItems="center" justifyContent="center" height="50vh">
        <Lottie animationData={loadingAnimation} style={{ width: isMobile ? 150 : 200 }} />
      </Stack>
    );
  }

  if (fetchStatus === "error") {
    return (
      <Stack alignItems="center" justifyContent="center" height="50vh">
        <p className="text-center text-red-500 p-4">
          Failed to load products. Please try again later.
        </p>
      </Stack>
    );
  }

  if (fetchStatus === "fulfilled" && (!products || products.length === 0)) {
    return (
      <Stack alignItems="center" justifyContent="center" height="50vh">
        <p className="text-center text-gray-500 p-4">
          No products found for this subcategory.
        </p>
      </Stack>
    );
  }

  return (
    <Grid 
      container 
      spacing={isMobile ? 1 : 2} 
      justifyContent="center" 
      sx={{ padding: isMobile ? "8px" : "16px" }}
    >
      {products.map((product) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          key={product._id}
          sx={{ padding: isMobile ? "4px" : undefined }}
        >
          <ProductCard
            id={product._id}
            title={product.title}
            thumbnail={product.thumbnail}
            price={product.price}
            handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
            onClick={() => navigate(`/product-details/${product._id}`)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SubcategoryLayout;