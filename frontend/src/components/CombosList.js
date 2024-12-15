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
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [filteredCombos, setFilteredCombos] = useState([]);
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
    combosService
      .getAllCombos()
      .then((response) => {
        setCombos(response.data);
        setFilteredCombos(response.data); 
      })
      .catch((error) => {
        console.error("Error al mostrar los combos", error);
      });
  }, []);

  useEffect(() => {
    if (!isEditFormOpen) {
    combosService
      .getAllCombos()
      .then((response) => {
        console.log(response.data);
        setCombos(response.data);
        console.log(response.data);
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
    setSearchValue("");
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



  const handleDeleteClick = (combo) => {
    console.log(combo)
    setSelectedCombo(combo)
    setOpen(true);
  };



  const deleteCombo = async () => {
    console.log('hola')
    console.log(selectedCombo)
    if (selectedCombo) {
      console.log(selectedCombo.id);
      try {
        const response = await combosService.deleteCombo(selectedCombo.id);
        console.log(response);
        setSelectedCombo(null);
        setIsOperationSuccessful(true);
        setAlertText("Combo deleted successfully");
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


  const handleEditClick = (combo) => {
    setEditingCombo(combo);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsLoading(true);
    combosService
      .getAllCombos()
      .then((response) => {
        setCombos(response.data);
        setFilteredCombos(response.data);
        setSearchValue("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al mostrar los combos", error);
      });
    setIsEditFormOpen(false);
  };

  


  const handleSaveCombo = async (newComboData) => {
    try {
      const response = await addComboAsync(newComboData);
      console.log(response)
      setIsOperationSuccessful(true);
      setAlertText("Product added successfully!");

      const updatedComboResponse = await combosService.getAllCombos();
      setCombos(updatedComboResponse.data);
      setFilteredCombos(updatedComboResponse.data);
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

  const handleEditCombo = () => {
    handleCloseEditForm();
    setIsEditFormOpen(false);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase(); 
    setSearchValue(searchQuery); 
  
    const filtered = combos.filter((combo) =>
      combo.name.toLowerCase().includes(searchQuery)
    );
    setFilteredCombos(filtered); 
  };
  


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };



  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  
    const sortedCombos = [...filteredCombos].sort((a, b) => {
      const aValue = field === "products" ? a[field].length : a[field];
      const bValue = field === "products" ? b[field].length : b[field];
  
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  
    setFilteredCombos(sortedCombos);
  };
 
  useEffect(() => {
    if (sortField) {
      const sortedCombos = [...filteredCombos].sort((a, b) => {
        const aValue = sortField === "products" ? a[sortField].length : a[sortField];
        const bValue = sortField === "products" ? b[sortField].length : b[sortField];
  
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      setFilteredCombos(sortedCombos);
    }
  }, [sortField, sortOrder]);
  
  
  
  
  

  return (
   
    <div className="container">
     
      <div className="input-container">
      <input
          type="text"
          className="custom-input"
          placeholder="Search combos..."
          value={searchValue}
          onChange={handleSearch} 
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
      <ExpandLessIcon style={{ color: "white" }} />
    ) : (
      <ExpandMoreIcon style={{ color: "white" }} />
    )
  ) : (
    <ExpandMoreIcon style={{ color: "white", opacity: 0.5 }} />
  )}
</IconButton>
        </div>
        <div className="title">
          <p style={{ color: "white", fontWeight: "bold" }}>Products</p>
          <IconButton size="small" onClick={() => handleSort("products")}>
      {sortField === "products" ? (
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
          <IconButton size="small" onClick={() => handleSort("price")}>
      {sortField === "price" ? (
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
          <IconButton size="small" onClick={() => handleSort("profit")}>
      {sortField === "profit" ? (
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
      {filteredCombos.map((combo, index) => (
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
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.9em' }}>
                    {combo.products.map((product, productIndex) => (
                      <li key={productIndex} className="text" style={{ fontSize: '0.7em' }}>
                        {product.productName}
                      </li>
                    ))}
                </ul>
                </div>
                <div className="category">
                  <p className="text">${combo.price}</p>
                </div>
                <div className="category">
                <p className="text">
                  {combo.profit.toFixed(2)}%
                </p>
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
              combo={editingCombo}
              setCombos={setCombos}
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
            {selectedCombo &&
              <p style={{ fontSize: "1.3rem" }}>
              Are you sure you want to delete the combo <strong>{selectedCombo.name}</strong>?
            </p>}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              style={{ fontSize: "1.2rem" }}
            >
              The Combo will be permanently deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ fontSize: "1.1rem" }}>
              Cancel
            </Button>
            <Button
              onClick={deleteCombo}
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
