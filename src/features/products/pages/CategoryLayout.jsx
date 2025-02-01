import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { axiosi } from "../../../config/axios";
import { Navbar } from "../../navigation/components/Navbar";
import {
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import { ProductCard } from "../components/ProductCard";
import { useTheme } from "@emotion/react";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";

const CategoryLayout = () => {
  const { categoryTitle } = useParams();
  const [products, setProducts] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sort, setSort] = useState(null);

  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));

  const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosi.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Update subcategories when categoryTitle changes
  useEffect(() => {
    const currentCategory = categories.find(
      (category) => category.name.toLowerCase() === categoryTitle.toLowerCase()
    );
    setSubCategories(currentCategory?.subCategory || []);
  }, [categoryTitle, categories]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchStatus("pending");

        const params = sort ? { sort: sort.sort, order: sort.order } : {};
        const productResponse = await axiosi.get(
          `/products/latest-products/${categoryTitle}`,
          { params }
        );

        setProducts(productResponse.data);
        setFetchStatus("fulfilled");
      } catch (error) {
        console.error("Error fetching products:", error);
        setFetchStatus("error");
      }
    };

    fetchProducts();
  }, [categoryTitle, sort]);

  const handleSubCategoryClick = (subcategoryTitle) => {
    navigate(`/categories/${categoryTitle}/${subcategoryTitle}`);
  };

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

  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-[65px]">
        {/* Left Sidebar */}
        <div className="w-[20vw] min-w-[250px] p-4 bg-white border-r border-gray-200 shadow-sm">
          <h2 className="font-bold text-xl mb-6 text-gray-800">
            {categoryTitle}
          </h2>

          {subCategories.length > 0 ? (
            <ul className="space-y-2">
              {subCategories.map((subCategory) => (
                <li
                  key={subCategory._id}
                  className="text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                  onClick={() => handleSubCategoryClick(subCategory.name)}
                >
                  <div className="px-4 py-2 text-sm sm:text-md">
                    {subCategory.name}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No subcategories available.</p>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6 bg-gray-50">
          <Stack flexDirection="row" justifyContent="flex-end">
            <FormControl variant="standard">
              <InputLabel>Sort</InputLabel>
              <Select
                value={sort?.name || ""}
                onChange={(e) =>
                  setSort(sortOptions.find((o) => o.name === e.target.value))
                }
              >
                <MenuItem value="">Reset</MenuItem>
                {sortOptions.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Render Products or Subcategory Layout */}
          <Outlet context={{ categories, subCategories }} />

          {fetchStatus === "pending" ? (
            <Stack alignItems="center" justifyContent="center" height="50vh">
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : fetchStatus === "error" ? (
            <p className="text-center text-red-500">
              Failed to load products. Please try again later.
            </p>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    thumbnail={product.thumbnail}
                    price={product.price}
                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 w-full">
                  No products found for this category.
                </p>
              )}
            </Grid>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryLayout;
