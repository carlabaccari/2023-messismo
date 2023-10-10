import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useActionData } from "react-router-dom";
import categoryService from "../services/category.service";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CategoryValidation from "../CategoryValidation";
import './CategoriesList.css'



const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const { user: currentUser } = useSelector((state) => state.auth);
  const role = currentUser.role;
  const [openForm, setOpenForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isOperationSuccessful, setIsOperationSuccessful] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
  }

  const handleCloseForm = () => {
    setOpenForm(false);
    setErrors({});
  }

  const handleAddCategory = async () => {
    const validationErrors = CategoryValidation({
      name: categoryName,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      
    try {
      const response = await categoryService.addCategory(categoryName);

        const updatedCategoriesResponse = await categoryService.getAllCategories();
        const updatedCategories = updatedCategoriesResponse.data;
  
        setCategories(updatedCategories);
        setIsOperationSuccessful(true);
        setOpenSnackbar(true);
        setAlertText("Category added successfully");
        setCategoryName(""); 
        handleCloseForm();
      
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      setIsOperationSuccessful(false);
      setOpenSnackbar(true);
      if (error.response) {
      setAlertText("Failed to create category: " + error.response.data);
      }
    }
  }
  };

  const handleNameChange = (event) => {
    setCategoryName(event.target.value);
  }

  const handleDeleteClick = (category) => {
    console.log(category);
    setSelectedCategory(category);
    setOpen(true);
  };
  const handleDeleteCategory = async (category) => {
    if (selectedCategory) {
      try {
        console.log(selectedCategory.name);
        await deleteCategoryAsync(selectedCategory.name);
        setSelectedCategory(null);
        setIsOperationSuccessful(true);
        setAlertText("Category deleted successfully");
        categoryService
      .getAllCategories()
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
        setOpenSnackbar(true);
        
      } catch (error) {
        if (error.response) {
          console.log("Datos de respuesta del error:", error.response.data);
          setAlertText("Failed to delete category: " + error.response.data);
        }
        setIsOperationSuccessful(false);
        setOpenSnackbar(true);
      }
      setOpen(false);

    }
    }
  

  const deleteCategoryAsync = async (categoryName) => {
    console.log(categoryName);
    return categoryService.deleteCategory(categoryName);
  }

  const handleClose = () => {
    setOpen(false);
  }


  return (
    <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div style={{flex:1, display: "flex", width: "90%" , justifyContent: "flex-start"}}>
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        style={{
          color: "white",
          borderColor: "#007bff",
          marginTop: "4%",
          fontSize: "1.3rem",
          height: "40px",
          marginBottom: "4%",
        }}
        onClick={handleOpenForm}
      >
        Add Category
      </Button>
      </div>
      <Dialog
        open={openForm}
        dividers={true}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
        className="custom-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
        <h1 style={{ marginBottom: "5%", fontSize: "2 rem" }}>New Category</h1>
        <p>Name *</p>
      <TextField
        required
        id="name"
        value={categoryName}
        onChange={handleNameChange}
        variant="outlined"
        error={errors.name ? true : false}
        helperText={errors.name || ''}
        style={{ width: '80%', marginTop: '3%', marginBottom: '3%', fontSize: '1.5rem'}}
        InputProps={{
          style: {
            fontSize: '1.3rem', 
          },}}
          FormHelperTextProps={{
            style: {
              fontSize: '1.1rem', 
            },
          }}
      />
       <div className="buttons-add">
        <Button
          variant="outlined"
          style={{ color: "grey", borderColor: "grey" , width: "40%", fontSize: '1.3rem'}}
          onClick={handleCloseForm}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "green",
            color: "White",
            borderColor: "green",
            width: "40%",
            fontSize: '1.3rem',
          }}
          onClick={handleAddCategory}
        >
          Add
        </Button>
      </div>
        </DialogContent>
      </Dialog>
      
      {categories.map((category) => (
        <div key={category.id} className="category-data" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "5px", width: "20%" }}>
          <p className="text">
            {category.name}
          </p>
          <div className="buttons-edit">
            {role === "ADMIN" || role === "MANAGER" ? (
              <Tooltip
                title="Delete Product"
                arrow
                style={{ fontSize: "2rem" }}
              >
                <IconButton
                  aria-label="delete"
                  size="large"
                  style={{ color: "red", fontSize: "1.5 rem" }}
                  onClick={() => handleDeleteClick(category)}
                >
                  <DeleteIcon style={{ fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
            ) : (
              console.log("hola")
            )}
          </div>
        </div>
      ))}
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: "white",
              boxShadow: "none",
              zIndex: 1000,
              fontSize: "24px",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "1.8rem" }}>
            {selectedCategory &&
              `Are you sure you want to delete the category ${selectedCategory.name}?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              style={{ fontSize: "1.3rem" }}
            >
              The category will be permanently deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ fontSize: "1.3rem" }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCategory}
              style={{ color: "red", fontSize: "1.3rem" }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
     open={openSnackbar}
     autoHideDuration={10000} 
     onClose={() => setOpenSnackbar(false)}
     anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
   >
     <Alert onClose={() => setOpenSnackbar(false)} severity={isOperationSuccessful ? "success" : "error"} sx={{fontSize: '100%'}}>
       {alertText}
     </Alert>
   </Snackbar>
    </div>
  );
};

export default CategoriesList;
