import { useDispatch, useSelector } from "react-redux";
import { Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { axiosi } from "../../../config/axios";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";

export const ProductFeatured = () => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is500 = useMediaQuery(theme.breakpoints.down(500));

  // featured products fetching
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosi.get("/products/featured");

        setFeaturedProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching featured products", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, [page]);

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

  const handleNextPage = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="py-10">
      <h1 className="text-center text-2xl mb-8 font-semibold">
        FEATURED PRODUCTS
      </h1>
      {loading ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <Grid
            gap={is700 ? 1 : 2}
            container
            justifyContent={"center"}
            alignContent={"center"}
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                thumbnail={product.thumbnail}
                // brand={product.brand.name}
                price={product.price}
                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
              />
            ))}
          </Grid>
          {/* pagination controls here  */}
          <div className="flex justify-center  mt-8">
            <button
              className="bg-gray-200 px-4 py-2 rounded-l disabled:opacity-50"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="mx-4 flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              className="bg-gray-200 px-4 py-2 rounded-r disabled:opacity-50"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
          <div className="bg-black/70 text-white text-center py-8 mt-8 overflow-hidden">
            <motion.div
              className="whitespace-nowrap font-bold text-lg gap-10 flex"
              animate={{ x: ["100%", "-100%"] }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear",
              }}
            >
              {Array(3)
                .fill(
                  <div className="flex items-center gap-10">
                    <p>Free delivery above order 49 dirhams! 🚚</p>
                    <p>Free delivery above order 49 dirhams! 🚚</p>
                    <p>Free delivery above order 49 dirhams! 🚚</p>
                    <p>Free delivery above order 49 dirhams! 🚚</p>
                  </div>
                )
                .map((content, index) => (
                  <React.Fragment key={index}>{content}</React.Fragment>
                ))}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};
