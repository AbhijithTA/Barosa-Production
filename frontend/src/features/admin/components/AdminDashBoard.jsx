import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  Fab,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  fetchAllCategoriesAsync,
  selectCategories,
} from "../../categories/CategoriesSlice";
import { ProductCard } from "../../products/components/ProductCard";
import {
  deleteProductByIdAsync,
  fetchProductsAsync,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  softDeleteProductByIdAsync,
  toggleFilters,
  toggleProductFeaturedAsync,
  undeleteProductByIdAsync,
} from "../../products/ProductSlice";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import { ITEMS_PER_PAGE } from "../../../constants";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

export const AdminDashBoard = () => {
  const [filters, setFilters] = useState({
    category: [],
    subcategory: [],
  });

  const categories = useSelector(selectCategories);
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const theme = useTheme();
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const totalResults = useSelector(selectProductTotalResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is800 = useMediaQuery(theme.breakpoints.down(800));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  useEffect(() => {
    setPage(1);
  }, [totalResults]);
  
  

  useEffect(() => {
  const finalFilters = { ...filters };


  if (searchQuery) {
    // Ignore pagination when searching
    finalFilters.search = searchQuery;
    delete finalFilters.pagination;
  } else {
    // Apply pagination only when not searching
    finalFilters.pagination = { page: page, limit: ITEMS_PER_PAGE };
  }

  finalFilters.sort = sort;

  dispatch(fetchProductsAsync(finalFilters));
}, [filters, sort, page, searchQuery]);


  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray });
  };


  const handleProductSoftDelete = (productId) => {
  dispatch(softDeleteProductByIdAsync(productId));
};
  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId));
  };

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync(productId));
  };
const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
  await dispatch(deleteProductByIdAsync(selectedProductId));
  setOpenDialog(false);
  setSelectedProductId(null);

  // Refresh the product list
  const finalFilters = { ...filters };
  finalFilters["pagination"] = { page: page, limit: ITEMS_PER_PAGE };
  finalFilters["sort"] = sort;

  dispatch(fetchProductsAsync(finalFilters));
};
const cancelDelete = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };
  const handleFilterToggle = () => {
    dispatch(toggleFilters());
  };

  const [filteredProductId, setFilteredProductId] = useState(null);

  const location = useLocation();

  const productsToDisplay = products.filter(product => {
  if (filteredProductId) {
    return product._id === filteredProductId;
  } else if (searchQuery) {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query))
    );
  }
  return true;
});

  useEffect(() => {
  if (location.state?.filteredProductId) {
    setFilteredProductId(location.state.filteredProductId);
    setSearchQuery('');
    setPage(1);
  } else if (location.state?.searchQuery) {
    setSearchQuery(location.state.searchQuery);
    setFilteredProductId(null);
    setPage(1);
  } else {
    setFilteredProductId(null);
    setSearchQuery('');
  }
}, [location.state]);
  const handleToggleFeatured = (productId) => {
    const product = products.find((prod) => prod._id === productId);
    const isFeatured = product.isFeatured;
    dispatch(
      toggleProductFeaturedAsync({ id: productId, isFeatured: !isFeatured })
    );
  };

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  const handleSubcategoryFilters = (e) => {
    const filterSet = new Set(filters.subcategory);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    setFilters({ ...filters, subcategory: Array.from(filterSet) });
  };

  const FilterPanel = () => (
    <Stack
      p={2}
      sx={{ 
        height: "100%", 
        width: is500 ? "100vw" : "25rem",
        overflowY: "auto"
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={handleFilterToggle}>
          <ClearIcon />
        </IconButton>
      </Stack>

      {/* Category Filters */}
      <Stack spacing={2} mb={2}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<AddIcon />}
            aria-controls="category-filters"
            id="category-filters"
          >
            <Typography>Category</Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {categories?.map((category) => (
              <div key={category._id} style={{ marginBottom: "0.5rem" }}>
                {/* Category Checkbox */}
                <FormGroup onChange={handleCategoryFilters}>
                  <motion.div
                    style={{ width: "fit-content" }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FormControlLabel
                      sx={{ ml: 1 }}
                      control={<Checkbox />}
                      label={category.name}
                      value={category._id}
                      checked={filters.category.includes(category._id)}
                    />
                  </motion.div>
                </FormGroup>

                {/* Subcategory Checkboxes */}
                <FormGroup sx={{ ml: 4 }} onChange={handleSubcategoryFilters}>
                  {category.subCategory?.map((subcat) => (
                    <FormControlLabel
                      key={subcat._id}
                      control={<Checkbox />}
                      label={subcat.name}
                      value={subcat._id}
                      checked={filters.subcategory.includes(subcat._id)}
                    />
                  ))}
                </FormGroup>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );

  return (
    <>
      {/* Filter button for mobile/tablet */}
      <Fab
        color="primary"
        aria-label="filter"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 999,
          display: { xs: "flex", md: "none" }
        }}
        onClick={handleFilterToggle}
      >
        <FilterListIcon />
      </Fab>

      {/* Filter panel drawer */}
      <Drawer
        variant={is600 ? "temporary" : "persistent"}
        anchor="left"
        open={isProductFilterOpen}
        onClose={handleFilterToggle}
        sx={{
          width: isProductFilterOpen ? (is500 ? "100%" : "25rem") : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: is500 ? "100%" : "25rem",
            boxSizing: 'border-box',
          },
        }}
      >
        <FilterPanel />
      </Drawer>

      <Stack 
        rowGap={5} 
        mt={is600 ? 2 : 5} 
        mb={"3rem"}
        sx={{
          marginLeft: isProductFilterOpen && !is600 ? (is500 ? "0" : "25rem") : 0,
          transition: "margin 0.3s ease",
          width: "100%",
          padding: { xs: '0 1rem', sm: '0 2rem' }
        }}
      >
        {/* Top bar with filter & sort options */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          width="100%"
          p={2}
        >
          {/* Filter button for desktop */}
          <Button 
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterToggle}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {isProductFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Sort dropdown */}
          <FormControl sx={{ minWidth: 150, maxWidth: 250 }}>
            <InputLabel id="sort-dropdown">Sort</InputLabel>
            <Select
              variant="outlined"
              labelId="sort-dropdown"
              label="Sort"
              onChange={(e) => setSort(e.target.value)}
              value={sort || ""}
              size={is488 ? "small" : "medium"}
            >
              <MenuItem value="">
                Reset
              </MenuItem>
              {sortOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Products grid */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
        >
          {productsToDisplay.length === 0 ? (
            <Stack width="100%" alignItems="center" mt={5}>
              <Typography variant="h6">No products found</Typography>
            </Stack>
          ) : (
            productsToDisplay.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Stack
                  sx={{
                    height: '100%',
                    opacity: product.isDeleted ? 0.7 : 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <ProductCard
                    id={product._id}
                    title={product.title}
                    thumbnail={product.thumbnail}
                    price={product.price}
                    isAdminCard={true}
                  />
                  
                  <Stack
                    p={2}
                    spacing={1}
                    direction="column"
                  >
                    <Stack direction="row" spacing={1}>
                      <Button
                        component={Link}
                        to={`/admin/product-update/${product._id}`}
                        variant="contained"
                        size={is488 ? "small" : "medium"}
                        fullWidth
                      >
                        Update
                      </Button>
                      
                      {product.isDeleted ? (
                        <Button
                          onClick={() => handleProductUnDelete(product._id)}
                          color="success"
                          variant="outlined"
                          size={is488 ? "small" : "medium"}
                          fullWidth
                        >
                          Un-Hide
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleProductSoftDelete(product._id)}
                          color="error"
                          variant="outlined"
                          size={is488 ? "small" : "medium"}
                          fullWidth
                        >
                          Hide
                        </Button>
                      )}
                    </Stack>
                    <Button
        onClick={() => handleDeleteClick(product._id)}
        color="error"
        variant="outlined"
      >
        Delete
      </Button>

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Do you really want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
                    
                    <Button
                      onClick={() => handleToggleFeatured(product._id)}
                      color={product.isFeatured ? "secondary" : "primary"}
                      variant="outlined"
                      size={is488 ? "small" : "medium"}
                      fullWidth
                    >
                      {product.isFeatured ? "Remove Featured" : "Make Featured"}
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {totalResults > 0 && (
          <Stack 
            spacing={2} 
            alignItems="center"
            mt={3}
            mb={5}
          >
            <Pagination
              size={is488 ? "small" : "medium"}
              page={page}
              onChange={(e, page) => setPage(page)}
              count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
              variant="outlined"
              shape="rounded"
            />
            <Typography variant="body2" color="text.secondary">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {page * ITEMS_PER_PAGE > totalResults
                ? totalResults
                : page * ITEMS_PER_PAGE}{" "}
              of {totalResults} results
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
};