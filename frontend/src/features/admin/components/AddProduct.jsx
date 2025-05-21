import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
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



export const AddProduct = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories) || [];
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  // const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState({});
  // const [thumbnail, setThumbnail] = useState("");
  const [isAnyImageUploading, setIsAnyImageUploading] = useState(false);

  //lunu
const [thumbnail, setThumbnail] = useState(null);
const [uploadedImageUrls, setUploadedImageUrls] = useState([]);


const isLoading = productAddStatus === "pending";


  // Handle product addition status
  useEffect(() => {
    if (productAddStatus === "fullfilled") {
      reset();
      toast.success("New product added");
      navigate("/admin/dashboard");
    } else if (productAddStatus === "rejected") {
      toast.error("Error adding product, please try again later");
    }
  }, [productAddStatus, navigate, reset]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    const category = categories.find((cat) => cat._id === categoryId);
    setSubCategories(category?.subCategory || []);
  };

  // const handleFileUpload = useCallback(async (file, index, isThumbnail = false) => {
  //   if (!file) return;
  //   try {
  //     setUploadingImages((prev) => ({ ...prev, [index]: true }));
  //     setIsAnyImageUploading(true);

  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", "first_time_cloudinary");
  //     formData.append("cloud_name", "dlgy2avhv");

  //     const response = await fetch("https://api.cloudinary.com/v1_1/dlgy2avhv/image/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error("Image upload failed");
  //     const result = await response.json();

  //     if (isThumbnail) {
  //       setThumbnail(result.url);
  //     } else {
  //       setUploadedImageUrls((prev) => [...prev, result.url]);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     toast.error("Failed to upload image");
  //   } finally {
  //     setUploadingImages((prev) => ({ ...prev, [index]: false }));
  //     setIsAnyImageUploading(Object.values(uploadingImages).some((status) => status));
  //   }
  // }, [uploadingImages]);

  // const handleAddProduct = (data) => {
  //   if (isAnyImageUploading) {
  //     toast.warning("Please wait for images to finish uploading.");
  //     return;
  //   }

  //   const newProduct = {
  //     ...data,
  //     images: uploadedImageUrls,
  //     thumbnail,
  //   };
  //   dispatch(addProductAsync(newProduct));
  // };

const handleAddProduct = (data) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("discountPercentage", data.discountPercentage);
  formData.append("category", data.category);
  formData.append("subCategory", data.subCategory);
  formData.append("stockQuantity", JSON.stringify(data.stockQuantity));

  // Append thumbnail
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  // Append other images
  uploadedImageUrls.forEach((imageFile, index) => {
    formData.append("images", imageFile); // name must match backend multer field
  });

  dispatch(addProductAsync(formData));
};



  return (
    <Stack p={2} justifyContent="center" alignItems="center">
      <Stack
        width={is1100 ? "100%" : "60rem"}
        spacing={4}
        mt={is480 ? 4 : 6}
        mb={6}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
      >
        {/* Product Name */}
        <TextField
          label="Product Name"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* Category and Sub Category */}
        <Stack direction={is480 ? "column" : "row"} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              {...register("category", { required: "Category is required" })}
              value={selectedCategoryId}
              onChange={handleCategoryChange}
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
              {...register("subCategory", { required: "Sub Category is required" })}
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

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={4}
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        {/* Price and Discount */}
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
            {...register("discountPercentage", { required: "Discount is required" })}
            error={!!errors.discountPercentage}
            helperText={errors.discountPercentage?.message}
          />
        </Stack>

        {/* Stock Quantity */}
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

        {/* Upload Thumbnail */}
        <Typography>Upload Thumbnail</Typography>
       <input
  type="file"
  accept="image/*"
  onChange={(e) => setThumbnail(e.target.files[0])}
/>
        {/* {uploadingImages[0] && <CircularProgress size={20} />} */}

        {/* Upload Images */}
        <Typography>Upload Images</Typography>
        {[1, 2, 3, 4].map((index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={2}>
           <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImageUrls((prev) => [...prev, file]);
    }
  }}
/>
            {uploadingImages[index] && <CircularProgress size={20} />}
          </Stack>
        ))}

        {/* Action Buttons */}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
         <Button
  variant="contained"
  type="submit"
  disabled={isLoading}
>
  {isLoading ? "Adding..." : "Add Product"}
</Button>
          <Button variant="outlined" color="error" component={Link} to="/admin/dashboard">
            Cancel
          </Button>
        </Stack>
      </Stack>
      
    </Stack>
    
  );
};
