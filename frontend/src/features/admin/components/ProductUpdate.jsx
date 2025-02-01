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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { selectCategories } from "../../categories/CategoriesSlice";
import { toast } from "react-toastify";

export const ProductUpdate = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const selectedProduct = useSelector(selectSelectedProduct);
  const productUpdateStatus = useSelector(selectProductUpdateStatus);
  const categories = useSelector(selectCategories || []);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState({});
  const [thumbnail, setThumbnail] = useState("");
  const [isAnyImageUploading, setIsAnyImageUploading] = useState(false);

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  console.log(subCategories, "subCateogries  ");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      reset(selectedProduct);
      setSelectedCategoryId(selectedProduct.category?._id || "");
      setSelectedSubcategoryId(
        selectedProduct?.category?.subCategory?._id || ""
      );
      setThumbnail(selectedProduct.thumbnail || "");
      setUploadedImageUrls(selectedProduct.images || []);
      setSubCategories(
        categories.find((cat) => cat._id === selectedProduct.category?._id)
          ?.subCategory || []
      );
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
    const category = categories.find((cat) => cat._id === categoryId);
    setSubCategories(category?.subCategory || []);
    setValue("subCategory", "");
  };

  const handleFileUpload = useCallback(
    async (file, index, isThumbnail = false) => {
      if (!file) return;
      try {
        setUploadingImages((prev) => ({ ...prev, [index]: true }));
        setIsAnyImageUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "first_time_cloudinary");
        formData.append("cloud_name", "dlgy2avhv");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dlgy2avhv/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Image upload failed");
        const result = await response.json();

        if (isThumbnail) {
          setThumbnail(result.url);
        } else {
          const newImages = [...uploadedImageUrls];
          newImages[index] = result.url;
          setUploadedImageUrls(newImages);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload image");
      } finally {
        setUploadingImages((prev) => ({ ...prev, [index]: false }));
        setIsAnyImageUploading(
          Object.values(uploadingImages).some((status) => status)
        );
      }
    },
    [uploadedImageUrls, uploadingImages]
  );

  const handleProductUpdate = (data) => {
    if (isAnyImageUploading) {
      toast.warning("Please wait for images to finish uploading.");
      return;
    }

    const updatedProduct = {
      ...data,
      _id: selectedProduct._id,
      thumbnail,
      images: uploadedImageUrls,
    };
    dispatch(updateProductByIdAsync(updatedProduct));
  };

  console.log(selectedProduct, "selectedProduct");
  console.log(selectedSubcategoryId, "selectedSubcategoryId");


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
            disabled
          />

          <Stack direction={is480 ? "column" : "row"} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategoryId}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  setSelectedCategoryId(categoryId);
                  setValue("category", categoryId);
                  const category = categories.find(
                    (cat) => cat._id === categoryId
                  );
                  setSubCategories(category?.subCategory || []);
                  setValue("subCategory", "");
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
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={watch("subCategory")}
                onChange={(e) => setValue("subCategory", e.target.value)}
                error={!!errors.subCategory}
                disabled={!selectedCategoryId}
                label="Sub Category"
              >
                {subCategories.map((subCat) => (
                  <MenuItem key={subCat._id} value={subCat._id}>
                    {subCat.name}
                  </MenuItem>
                ))}
              </Select>
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

          <Typography>Upload Thumbnail</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files[0], 0, true)}
          />
          {uploadingImages[0] && <CircularProgress size={20} />}

          <Typography>Upload Images</Typography>
          {[1, 2, 3, 4].map((index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={2}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], index)}
              />
              {uploadingImages[index] && <CircularProgress size={20} />}
            </Stack>
          ))}

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="contained"
              type="submit"
              disabled={isAnyImageUploading}
            >
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
