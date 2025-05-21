import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductUpdateStatus,
  selectProductUpdateStatus,
  selectSelectedProduct,
  updateProductByIdAsync,
} from "../../products/ProductSlice";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Box,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { selectCategories } from "../../categories/CategoriesSlice";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProductUpdate = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { id } = useParams(); // product id

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const selectedProduct = useSelector(selectSelectedProduct);
  const productUpdateStatus = useSelector(selectProductUpdateStatus);
  const categories = useSelector(selectCategories || []);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct && categories.length > 0) {
      // Find the actual category object
      const categoryId = selectedProduct.category?._id || "";
      const subcategoryId = selectedProduct.subcategory?._id || "";

      // Set form values with complete product data
      const formData = {
        ...selectedProduct,
        category: categoryId,
        subcategory: subcategoryId,
      };

      reset(formData);

      // Update state variables
      setSelectedCategoryId(categoryId);
      setCurrentThumbnail(selectedProduct.thumbnail || "");
      setCurrentImages(selectedProduct.images || []);

      // Update subcategories based on selected category
      if (categoryId) {
        const category = categories.find((cat) => cat._id === categoryId);
        if (category) {
          setSubCategories(category.subCategory || []);
        }
      }
    }
  }, [selectedProduct, categories, reset]);

  useEffect(() => {
    if (productUpdateStatus === "fullfilled") {
      toast.success("Product Updated");
      navigate("/admin/dashboard");
    } else if (productUpdateStatus === "rejected") {
      toast.error("Error updating product, please try again later");
    }
  }, [productUpdateStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
    };
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setValue("category", categoryId);

    // Update subcategories list
    const category = categories.find((cat) => cat._id === categoryId);
    if (category) {
      setSubCategories(category.subCategory || []);
    } else {
      setSubCategories([]);
    }

    // Clear subcategory selection when category changes
    setValue("subCategory", "");
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setValue("subcategory", subcategoryId);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(file);
      // Preview the new thumbnail
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

const handleImagesChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    setNewImages([...newImages, ...files]);
  }
};

  const removeImage = (index) => {
    // If it's an existing image (URL), add to removedImages
    if (typeof currentImages[index] === 'string') {
      setRemovedImages([...removedImages, currentImages[index]]);
    }
    
    // Remove from current images display
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    setCurrentImages(updatedImages);
    
    // If it's a new image (File object), remove from newImages
    if (currentImages[index] instanceof File) {
      const updatedNewImages = newImages.filter((_, i) => 
        i !== index - (currentImages.length - newImages.length)
      );
      setNewImages(updatedNewImages);
    }
  };

  const removeExistingImage = (index) => {
  // Add to removed images list
  setRemovedImages([...removedImages, currentImages[index]]);
  // Remove from current images display
  setCurrentImages(currentImages.filter((_, i) => i !== index));
};

const removeNewImage = (index) => {
  setNewImages(newImages.filter((_, i) => i !== index));
};
  

const handleProductUpdate = (data) => {
  const formData = new FormData();

  // Basic product data
  formData.append("_id", selectedProduct._id);
  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("subcategory", data.subcategory);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("discountPercentage", data.discountPercentage);

  // Stock quantity
  Object.entries(data.stockQuantity || {}).forEach(([size, quantity]) => {
    formData.append(`stockQuantity[${size}]`, quantity);
  });

  // Handle thumbnail
  if (newThumbnail) {
    formData.append("thumbnail", newThumbnail);
  } else if (!currentThumbnail) {
    // If thumbnail was removed
    formData.append("thumbnail", "");
  }

   currentImages
    .filter(img => !removedImages.includes(img))
    .forEach(img => {
      formData.append("existingImages", img);
    });

  // Handle images to remove
  removedImages.forEach(img => {
    formData.append("removedImages", img);
  });

  // Handle new images (only the files from newImages state)
  newImages.forEach(image => {
    formData.append("images", image);
  });

  dispatch(updateProductByIdAsync(formData));
};

  return (
    <Stack p={2} justifyContent="center" alignItems="center">
      {selectedProduct && (
        <Stack
          width={is1100 ? "100%" : "60rem"}
          spacing={4}
          mt={is480 ? 4 : 6}
          mb={6}
          component="form"
          noValidate
          onSubmit={handleSubmit(handleProductUpdate)}
        >
          <TextField
            label="Product Name"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <Stack direction={is480 ? "column" : "row"} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Controller
                name="category"
                control={control}
                defaultValue={selectedCategoryId}
                render={({ field }) => (
                  <Select
                    labelId="category-label"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCategoryChange(e);
                    }}
                    error={!!errors.category}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="subcategory-label">Sub Category</InputLabel>
              <Controller
                name="subcategory"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    labelId="subcategory-label"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSubcategoryChange(e);
                    }}
                    error={!!errors.subCategory}
                    disabled={!selectedCategoryId || subCategories.length === 0}
                    label="Sub Category"
                  >
                    {subCategories.map((subCat) => (
                      <MenuItem key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Stack>

          <TextField
            label="Description"
            multiline
            rows={4}
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Stack direction={is480 ? "column" : "row"} spacing={2}>
            <TextField
              label="Price"
              type="number"
              {...register("price", { required: "Price is required" })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Discount Percentage"
              type="number"
              {...register("discountPercentage", {
                required: "Discount is required",
              })}
              error={!!errors.discountPercentage}
              helperText={errors.discountPercentage?.message}
            />
          </Stack>

          <Typography>Stock Quantity by Size</Typography>
          {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
            <TextField
              key={size}
              label={`Stock for ${size}`}
              type="number"
              {...register(`stockQuantity.${size}`, {
                required: `${size} stock quantity is required`,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
              error={!!errors.stockQuantity?.[size]}
              helperText={errors.stockQuantity?.[size]?.message}
            />
          ))}

          <Box>
            <Typography gutterBottom>Current Thumbnail</Typography>
            {currentThumbnail && (
              <Box sx={{ position: 'relative', width: 'fit-content' }}>
                <Avatar
                  src={currentThumbnail}
                  alt="Thumbnail preview"
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
                <IconButton
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={() => {
                    setCurrentThumbnail("");
                    setNewThumbnail(null);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              style={{ marginTop: '8px' }}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Product Images</Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
             {currentImages.map((image, index) => (
    !removedImages.includes(image) && (
      <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
        <Avatar
          src={image}
          alt={`Product image ${index + 1}`}
          sx={{ width: 100, height: 100 }}
          variant="rounded"
        />
        <IconButton onClick={() => removeExistingImage(index)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    )
  ))}

  {/* New images preview */}
  {newImages.map((image, index) => (
    <Box key={`new-${index}`} sx={{ position: 'relative' }}>
      <Avatar
        src={URL.createObjectURL(image)}
        alt={`New image ${index + 1}`}
        sx={{ width: 100, height: 100 }}
        variant="rounded"
      />
      <IconButton onClick={() => removeNewImage(index)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
            </Stack>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              style={{ marginTop: '16px' }}
            />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" type="submit">
              Update Product
            </Button>
            <Button
              variant="outlined"
              color="error"
              component={Link}
              to="/admin/dashboard"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};