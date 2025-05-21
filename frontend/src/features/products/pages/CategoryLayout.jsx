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
  IconButton,
  Menu,
  Button,
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
// Import icons
// import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CategoryIcon from "@mui/icons-material/Category";

const CategoryLayout = () => {
  const { categoryTitle, subcategoryTitle } = useParams();
  const [products, setProducts] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sort, setSort] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // For mobile category dropdown
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const categoryMenuOpen = Boolean(categoryMenuAnchor);

  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down(700));

  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(true);
    }
  }, [isMobile, isTablet]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleOpenCategoryMenu = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCloseCategoryMenu = () => {
    setCategoryMenuAnchor(null);
  };

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
      (category) => category.name.toLowerCase() === categoryTitle?.toLowerCase()
    );
    setSubCategories(currentCategory?.subCategory || []);
  }, [categoryTitle, categories]);

  if (!categoryTitle) return null; // don't render anything if no category

  const handleSubCategoryClick = (subcategoryTitle) => {
    const encodedName = encodeURIComponent(subcategoryTitle);
    navigate(`/categories/${categoryTitle}/${encodedName}`);
    handleCloseCategoryMenu();

    // Auto-collapse sidebar on mobile after selection
    if (isMobile) {
      setSidebarExpanded(false);
    }
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
      <div className="flex flex-col h-screen pt-[65px]">
        {/* Header bar for mobile - Categories and Sort */}
        {isMobile && (
          <div className="bg-white p-2 border-b border-gray-200 flex justify-between items-center">
            <Button
              variant="outlined"
              size="small"
              startIcon={<CategoryIcon />}
              onClick={handleOpenCategoryMenu}
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                mr: 1,
                maxWidth: "50%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {categoryTitle}
            </Button>

            <FormControl
              variant="standard"
              size="small"
              sx={{ minWidth: 120, maxWidth: "50%" }}
            >
              <InputLabel>Sort</InputLabel>
              <Select
                value={sort?.name || ""}
                onChange={(e) => {
                  const selectedSort = sortOptions.find(
                    (o) => o.name === e.target.value
                  );
                  console.log("Selected sort option:", selectedSort); // <-- Console log here
                  setSort(selectedSort);
                }}
                sx={{ fontSize: "0.8rem" }}
              >
                <MenuItem value="">Reset</MenuItem>
                {sortOptions.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mobile Categories Menu */}
            <Menu
              anchorEl={categoryMenuAnchor}
              open={categoryMenuOpen}
              onClose={handleCloseCategoryMenu}
              PaperProps={{
                style: {
                  maxHeight: 300,
                  width: "80vw",
                  maxWidth: 300,
                },
              }}
            >
              <MenuItem disabled>
                <div className="font-bold">{categoryTitle} - Subcategories</div>
              </MenuItem>

              {subCategories.length > 0 ? (
                subCategories.map((subCategory) => (
                  <MenuItem
                    key={subCategory._id}
                    onClick={() => handleSubCategoryClick(subCategory.name)}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    {subCategory.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No subcategories available</MenuItem>
              )}
            </Menu>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar toggle button */}
          {!sidebarExpanded && !isMobile && (
            <div className="fixed z-10 top-[70px] left-0 bg-white p-1 rounded-r-lg shadow-md">
              <IconButton onClick={toggleSidebar} size="small">
                <ChevronRightIcon />
              </IconButton>
            </div>
          )}

          {/* Left Sidebar - Only visible on desktop/tablet */}
          {!isMobile && (
            <div
              className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
                sidebarExpanded
                  ? "w-[20vw] min-w-[250px]"
                  : "w-0 min-w-0 overflow-hidden"
              }`}
            >
              <div className="flex justify-between items-center p-4">
                <h2 className="font-bold text-xl text-gray-800 truncate">
                  {categoryTitle}
                </h2>
                <IconButton onClick={toggleSidebar} size="small">
                  <ChevronLeftIcon />
                </IconButton>
              </div>

              {subCategories.length > 0 ? (
                <ul className="space-y-2 p-4 pt-0">
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
                <p className="text-gray-500 text-sm p-4">
                  No subcategories available.
                </p>
              )}
            </div>
          )}

          {/* Right Content */}
          <div className="flex-1 p-3 sm:p-6 bg-gray-50 overflow-y-auto">
            {/* Desktop sort controls */}
            {!isMobile && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    value={sort?.name || ""}
                    onChange={(e) =>
                      setSort(
                        sortOptions.find((o) => o.name === e.target.value)
                      )
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
            )}

            {/* Render Products or Subcategory Layout */}
            {subcategoryTitle ? (
              <Outlet context={{ categories, subCategories, sort }} />
            ) : (
              <>
                {fetchStatus === "pending" ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="50vh"
                  >
                    <Lottie
                      animationData={loadingAnimation}
                      style={{ width: isMobile ? 150 : 200 }}
                    />
                  </Stack>
                ) : fetchStatus === "error" ? (
                  <p className="text-center text-red-500">
                    Failed to load products. Please try again later.
                  </p>
                ) : products.length > 0 ? (
                  <Grid
                    container
                    spacing={isMobile ? 1 : 2}
                    justifyContent="center"
                    sx={{ padding: isMobile ? "4px" : "16px" }}
                  >
                    {products.map((product) => (
                      <Grid
                        item
                        xs={6}
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
                          handleAddRemoveFromWishlist={
                            handleAddRemoveFromWishlist
                          }
                          onClick={() =>
                            navigate(`/product-details/${product._id}`)
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : fetchStatus === "fulfilled" ? (
                  <p className="text-center text-gray-500 w-full">
                    No products found for this category.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryLayout;
