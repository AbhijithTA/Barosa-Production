import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      setLoading(false);
      return;
    }

    try {
    //   const res = await axiosi.post("/category", categoryName);
      if (Response.status === 201) {
        toast.success("Category added successfully");
        setCategoryName("");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return <>(

    <Box sx={{ maxWidth:400,margin:'50px auto',padding:3,boxShadow:3,borderRadius:2,textAlign:'center'}}>
    <Typography variant="h4" color="h1" sx={{mb:2}}>
        Add Category
    </Typography>

    {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

<form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={categoryName}
          onChange={handleInputChange}
          error={!!error}
          helperText={error && "Please enter a valid category name."}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </Button>
      </form>
    </Box>
  )</>;
};

export default AddCategory;
