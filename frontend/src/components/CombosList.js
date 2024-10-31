import React, { useEffect } from "react";
import "./Products.css";
import { useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Form from "./Form";
import EditForm from "./EditForm";
import productsService from "../services/products.service";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import Fab from "@mui/material/Fab";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterRedux from "./FilterRedux";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ComboForm from "./ComboForm";
import combosService from "../services/combo.service";
import EditComboForm from "./EditComboForm";

const CombosList = () => {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const role = currentUser.role;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isOperationSuccessful, setIsOperationSuccessful] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFullDescriptions, setShowFullDescriptions] = useState([]);
  const [combos, setCombos] = useState([]);
  const [ editingCombo ,setEditingCombo] = useState(null);

  const [appliedFilters, setAppliedFilters] = useState({});
  const selectedCategory = useSelector(
    (state) => state.filters.selectedCategory
  );

  const [sortField, setSortField] = useState(null);
const [sortOrder, setSortOrder] = useState("asc");
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEditFormOpen) {
    productsService
      .getAllProducts()
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al mostrar los productos", error);
        setIsLoading(false);
      });
    }
  }, [openFormModal, open]);

  useEffect(() => {
    if (!isEditFormOpen) {
    combosService
      .getAllCombos()
      .then((response) => {
        setCombos(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al mostrar los combos", error);
        setIsLoading(false);
      });
    }
  }, [openFormModal, open]);

  const handleClose = () => {
    setOpen(false);
    setIsLoading(true);
  };

  const handleOpenProductsModal = () => {
    setOpenFormModal(true);
  };

  const handleCloseProductsModal = () => {
    setOpenFormModal(false);
    setIsLoading(true);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleApplyFilter = async (product) => {
    try {
      setAppliedFilters(product);
      const response = await productsService
        .filter(product)
        .then((response) => {
          console.log(response);
          setProducts(response);
        });
    } catch (error) {
      console.error("Error al buscar productos", error);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDeleteClick = (producto) => {
    console.log(producto);
    setSelectedProduct(producto);
    console.log(producto);
    setOpen(true);
  };

  const deleteProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await productsService.deleteProduct(selectedProduct.productId);
        console.log(response);
        setSelectedProduct(null);
        setIsOperationSuccessful(true);
        setAlertText("Product deleted successfully");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error al eliminar el producto", error);
        setIsOperationSuccessful(false);
        setAlertText("Failed to delete product");
        setOpenSnackbar(true);
      }
      setOpen(false);
    }
  };

  const deleteProductAsync = async (productId) => {
    return productsService.deleteProduct(productId);
  };

  const handleEditClick = (combo) => {
    setEditingCombo(combo);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsLoading(true);
    productsService
      .getAllProducts()
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al mostrar los productos", error);
      });
    setIsEditFormOpen(false);
  };

  const handleSaveProduct = async (newProductData) => {
    try {
      const response = await addProductAsync(newProductData);
      console.log(response)
      setIsOperationSuccessful(true);
      setAlertText("Product added successfully!");

      const updatedProductsResponse = await productsService.getAllProducts();
      setProducts(updatedProductsResponse.data);
    } catch (error) {
      console.error("Error al agregar el producto", error);
      setIsOperationSuccessful(false);
      setAlertText("Failed to add product");
    } finally {
      setOpenSnackbar(true);
    }
  };


  const handleSaveCombo = async (newComboData) => {
    try {
      const response = await addComboAsync(newComboData);
      console.log(response)
      setIsOperationSuccessful(true);
      setAlertText("Product added successfully!");

      const updatedComboResponse = await combosService.getAllCombos();
      setCombos(updatedComboResponse.data);
      console.log(updatedComboResponse.data);
    } catch (error) {
      console.error("Error al agregar el combo", error);
      setIsOperationSuccessful(false);
      setAlertText("Failed to add combo");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const addComboAsync = async (newComboData) => {
    return combosService.addCombos(newComboData);
  };
  const addProductAsync = async (newProductData) => {
    return productsService.addProducts(newProductData);
  };

  const handleEditProduct = (newProductData) => {
    const productToUpdate = products.find(
      (product) => product.id === editingProduct.id
    );

    if (productToUpdate) {
      const updatedProduct = { ...productToUpdate, ...newProductData };

      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? updatedProduct : product
      );

      setProducts(updatedProducts);
    }

    handleCloseEditForm();
  };

  const handleSearch = async () => {
    console.log(searchValue);

    const allfilters = {
      productName: searchValue,
      categoryName: selectedCategory,
      
    };
    try {
      const response = await productsService
        .filter(allfilters)
        .then((response) => {
          console.log(response);
          setProducts(response);
        });
    } catch (error) {
      console.error("Error al buscar productos", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleShowMoreClick = (index) => {
    const newShowFullDescriptions = [...showFullDescriptions];
    newShowFullDescriptions[index] = true;
    setShowFullDescriptions(newShowFullDescriptions);
  };

  const handleShowLessClick = (index) => {
    const newShowFullDescriptions = [...showFullDescriptions];
    newShowFullDescriptions[index] = false;
    setShowFullDescriptions(newShowFullDescriptions);
  };

  
  
  const handleSort = (field) => {
  
    
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      
      setSortField(field);
      setSortOrder("asc");
    }
  
  };
 
  useEffect(() => {
    if (sortField) {
      if (sortField !== "category"){
      const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === "asc") {
          if (a[sortField] < b[sortField]) {
            return -1;
          }
          if (a[sortField] > b[sortField]) {
            return 1;
          }
          return 0;
        } else {
          if (a[sortField] > b[sortField]) {
            return -1;
          }
          if (a[sortField] < b[sortField]) {
            return 1;
          }
          return 0;
        }
      });
      setProducts(sortedProducts);
    }
    else {
      const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === "asc") {
          if (a[sortField]["name"] < b[sortField]["name"]) {
            return -1;
          }
          if (a[sortField]["name"] > b[sortField]["name"]) {
            return 1;
          }
          return 0;
        } else {
          if (a[sortField]["name"] > b[sortField]["name"]) {
            return -1;
          }
          if (a[sortField]["name"] < b[sortField]["name"]) {
            return 1;
          }
          return 0;
        }
    });
    setProducts(sortedProducts);
  }
      
    }
  }, [sortField, sortOrder]);
  
  
  
  

  return (
   
    <div className="container">
     
      <div className="input-container">
        <input
          type="text"
          className="custom-input"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            //handleSearch(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
        <Fab
          color="primary"
          aria-label="edit"
          size="small"
          onClick={handleSearch}
          style={{ backgroundColor: "#a4d4cc", color: "black" }}
        >
          <SearchIcon style={{ fontSize: "1.5rem" }} />
        </Fab>
      </div>

      <div className="firstRow">
        <div className="add-product">
          {role === "ADMIN" ||
          role === "MANAGER" ? (
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              style={{
                backgroundColor: "#a4d4cc",
                color: "black",
                borderColor: "#007bff",
                marginTop: "4%",
                fontSize: "1rem",
                height: "50px",
              }}
              onClick={handleOpenProductsModal}
            >
              Add Combo
            </Button>
          ) : (
            console.log("")
          )}
        </div>
        <div className="filterBy">
          <Button
            variant="contained"
            onClick={handleOpenFilter}
            endIcon={<FilterListIcon />}
            style={{
              backgroundColor: '#a4d4cc',
              color: "black",
              borderColor: "#007bff",
              marginTop: "4%",
              fontSize: "1rem",
              height: "40px",
            }}
          >
            Filter by
          </Button>
          <Dialog
            open={openFilter}
            dividers={true}
            onClose={handleCloseFilter}
            aria-labelledby="form-dialog-title"
            className="custom-dialog"
            maxWidth="sm"
            fullWidth
          >
            <DialogContent>
              <FilterRedux
                onClose={handleCloseFilter}
                onSave={handleApplyFilter}
                appliedFilters={appliedFilters}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Dialog
          open={openFormModal}
          dividers={true}
          onClose={handleCloseProductsModal}
          aria-labelledby="form-dialog-title"
          className="custom-dialog"
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <ComboForm
              onClose={handleCloseProductsModal}
              onSave={handleSaveCombo}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="titles">
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Combo Name</p>
          <IconButton size="small" onClick={() => handleSort("name")}>
      {sortField === "name" ? (
        sortOrder === "asc" ? (
          <ExpandLessIcon className="ExpandIcon" style={{ color: "white"}}/>
        ) : (
          <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
        )
      ) : (
        <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
      )}
    </IconButton>
        </div>
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Products</p>
          <IconButton size="small" onClick={() => handleSort("category")}>
      {sortField === "category" ? (
        sortOrder === "asc" ? (
          <ExpandLessIcon className="ExpandIcon" style={{ color: "white"}}/>
        ) : (
          <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
        )
      ) : (
        <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
      )}
    </IconButton>
        </div>
       
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Price</p>
          <IconButton size="small" onClick={() => handleSort("stock")}>
      {sortField === "stock" ? (
        sortOrder === "asc" ? (
          <ExpandLessIcon className="ExpandIcon" style={{ color: "white"}}/>
        ) : (
          <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
        )
      ) : (
        <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
      )}
    </IconButton>
        </div>
        
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Profit</p>
          <IconButton size="small" onClick={() => handleSort("unitPrice")}>
      {sortField === "unitPrice" ? (
        sortOrder === "asc" ? (
          <ExpandLessIcon className="ExpandIcon" style={{ color: "white"}}/>
        ) : (
          <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
        )
      ) : (
        <ExpandMoreIcon className="ExpandIcon" style={{ color: "white"}}/>
      )}
    </IconButton>
        </div>
        
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Actions</p>
        </div>
        
      </div>
      {isLoading ? ( 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
          <CircularProgress style={{ color:"#a4d4cc"}}/>
        </Box>
      
      ) : (
        
        <>
      {combos.map((combo, index) => (
        <div className="entradas" key={index}>
          <div className="product">
            <div className="firstLine">
              <div className="names">
                <div className="name">
                  <p className="text" style={{ fontWeight: "bold" }}>
                    {combo.name}
                  </p>
                </div>
                <div className="category">
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {combo.products.map((product, productIndex) => (
                <li key={productIndex} className="text">{product.name}</li>
              ))}
            </ul>
          </div>
                <div className="category">
                  <p className="text">${combo.price}</p>
                </div>
                <div className="category">
                  <p className="text">{combo.profit}%</p>
                </div>
              </div>
              <div className="buttons-edit">
                {role === "ADMIN" || role === "MANAGER" ? (
                  <Tooltip arrow style={{ fontSize: "2rem" }}>
                    <IconButton
                      aria-label="edit"
                      size="large"
                      color="red"
                      onClick={() => handleEditClick(combo)}
                    >
                      <EditIcon style={{ fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  console.log("")
                )}
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
                      onClick={() => handleDeleteClick(combo)}
                    >
                      <DeleteIcon style={{ fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          
          </div>

        </div>
      ))}
      </>
      )}
      
      {isEditFormOpen && (
        <Dialog
          open={isEditFormOpen}
          onClose={handleCloseEditForm}
          aria-labelledby="edit-form-dialog-title"
          className="custom-dialog"
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <EditComboForm
              product={editingCombo}
              onSave={handleEditProduct}
              onClose={handleCloseEditForm}
            />
          </DialogContent>
        </Dialog>
      )}
      {open && (
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
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "1.5rem" }}>
            {selectedProduct &&
              <p style={{ fontSize: "1.3rem" }}>
              Are you sure you want to delete the product <strong>{selectedProduct.name}</strong>?
            </p>}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              style={{ fontSize: "1.2rem" }}
            >
              The product will be permanently deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ fontSize: "1.1rem" }}>
              Cancel
            </Button>
            <Button
              onClick={deleteProduct}
              style={{ color: "red", fontSize: "1.1rem" }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          variant="filled"
          severity={isOperationSuccessful ? "success" : "error"}
          sx={{ fontSize: "75%" }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    
    </div>

  );

};

export default CombosList;
