import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Form.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSlotProps } from "@mui/base";
import productsService from "../services/products.service";
import { useSelector, useDispatch } from "react-redux";
import FormValidation from "../FormValidation";
import EditFormValidation from "../EditFormValidation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { convertQuickFilterV7ToLegacy } from "@mui/x-data-grid/internals";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import modifyProductStock from "../services/products.service";
import { IconButton } from "@mui/material";
const EditForm = (props) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(props.product.unitPrice);
  const { user: currentUser } = useSelector((state) => state.auth);
  const token = currentUser.access_token;
  const role = currentUser.role;
  const [errors, setErrors] = useState({});
  const [stock, setStock] = useState("");
  const [isOperationSuccessful, setIsOperationSuccessful] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [newStock, setNewStock] = useState(props.product.stock)
  const [cost, setCost] = useState(props.product.unitCost);
  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleCategoriaChange = (event: SelectChangeEvent) => {
    setCategoria(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handlePrecioChange = (event) => {
    setPrecio(event.target.value);
  };

  const handleCostChange = (event) => {
    setCost(event.target.value);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const cancelarButton = (event) => {
    props.onClose();
  };

  const handleEditProduct = async () => {
    const validationErrors = EditFormValidation({
      price: precio,
      stock: stock,
      cost: cost,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(validationErrors);
    } else {
      //productsService.updateProductStock(stockDTO)
      if (precio !== "") {
        try {
          const response = await productsService
            .updateProductPrice(props.product.productId, precio)
            .then((response) => {
              console.log(response);
              setIsOperationSuccessful(true);
              setAlertText("Product updated successfully");
              setOpenSnackbar(true);
            });
        } catch (error) {
          console.error("Error al buscar productos", error);
          setIsOperationSuccessful(false);
          setAlertText("Failed to modify price");
          setOpenSnackbar(true);
        }
      }

      if (cost !== "") {
        try {
          const response = await productsService
            .updateProductCost(props.product.productId, cost)
            .then((response) => {
              console.log(response);
              setIsOperationSuccessful(true);
              setAlertText("Product updated successfully");
              setOpenSnackbar(true);
            });
        } catch (error) {
          setIsOperationSuccessful(false);
          console.log(error)
          setAlertText("Failed to modify cost");
          setOpenSnackbar(true);
        }
      }
      

      const stock = newProductStock();
      if (stock !== 0)
      {
      try {
        console.log(stock);
        await productsService.modifyProductStock(
          stock
        );
        setIsOperationSuccessful(true);
        setAlertText("Product updated successfully");
        setOpenSnackbar(true);
      } catch (error) {
        setIsOperationSuccessful(false);
        setAlertText("Failed to modify stock");
        setOpenSnackbar(true);
      }



      setNombre("");
      setCategoria("");
      setDescripcion("");
      setPrecio("");
      setStock("");
    }
  }

  };

  const addStock = () => {
    setNewStock(newStock + 1);
  }

  const removeStock = () => {
    if (newStock - 1 >= 0){
    setNewStock(newStock - 1);
    }
  }

  const handleModifyStock = () => {
    const productStock = newProductStock();
    console.log(productStock)

  }

  const newProductStock = () => {
   if (newStock !== props.product.stock){
    
    console.log(newStock)
    console.log(props.productStock)
    if (newStock < props.product.stock)
    {

      const modifyProductStock = 
    {
      productId: props.product.productId,
      operation: "substract",
      modifyStock: props.product.stock - newStock,

    }
    return modifyProductStock
    }
    else {
      const modifyProductStock = 
      {
        productId: props.product.productId,
        operation: "add",
        modifyStock: newStock - props.product.stock,
  
      }

      return modifyProductStock
  }
}
else {
  return 0;
}
}


  return (
    <div>
      <h1 style={{ marginBottom: "5%", fontSize: "1.8rem" }}>Edit Product</h1>

      {/* <p>Name</p>
      <TextField
        disabled
        id="nombre"
        onChange={handleNombreChange}
        variant="outlined"
        style={{ width: "80%", marginTop: '3%', marginBottom: '3%', fontSize: '1.3rem'}}
        defaultValue={props.product.name}
        InputProps={{
          style: {
            fontSize: '1.5rem', 
          },}}
      />
      <p>Category</p>
      <Select
        disabled
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleCategoriaChange}
        style={{ width: "80%", marginTop: '3%', marginBottom: '3%', fontSize: '1.5rem'}}
        defaultValue={props.product.category}
      >
        <MenuItem value={"Entradas"}>Entradas</MenuItem>
        <MenuItem value={"Platos"}>Platos</MenuItem>
        <MenuItem value={"Tragos"}>Tragos</MenuItem>
        <MenuItem value={"Bebidas sin alcohol"}>Bebidas sin alcohol</MenuItem>
        <MenuItem value={"Postres"}>Postres</MenuItem>
      </Select>
      <p>Description</p>
      <TextField
        disabled
        id="descripcion"
        onChange={handleDescripcionChange}
        variant="outlined"
        style={{ width: "80%", marginTop: '3%', marginBottom: '3%' }}
        defaultValue={props.product.description}
        InputProps={{
          style: {
            fontSize: '1.5rem', 
          },}}
      /> */}

      <p>Price</p>
      {role === "ADMIN" || role === "MANAGER" ? (
        <div>
          <TextField
            required
            id="precio"
            onChange={handlePrecioChange}
            variant="outlined"
            value={precio}
            error={errors.price ? true : false}
            helperText={errors.price || ""}
            style={{ width: "80%", marginTop: "3%", marginBottom: "3%" }}
            defaultValue={props.product.unitPrice}
            InputProps={{
              style: {
                fontSize: "1.1rem",
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            FormHelperTextProps={{
              style: {
                fontSize: "1.1rem",
              },
            }}
          />
        </div>
        
      ) : (
        <TextField
          disabled
          id="outlined-disabled"
          style={{ width: "80%" }}
          defaultValue={props.product.unitPrice}
          InputProps={{
            style: {
              fontSize: "1.1rem",
            },
          }}
        />
      )}
       <p>Cost</p>
      {role === "ADMIN" || role === "MANAGER" ? (
        <div>
          <TextField
            required
            id="precio"
            onChange={handleCostChange}
            variant="outlined"
            value={cost}
            error={errors.price ? true : false}
            helperText={errors.price || ""}
            style={{ width: "80%", marginTop: "3%", marginBottom: "3%" }}
            defaultValue={props.product.unitCost}
            InputProps={{
              style: {
                fontSize: "1.1rem",
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            FormHelperTextProps={{
              style: {
                fontSize: "1.1rem",
              },
            }}
          />
        </div>
        
      ) : (
        <TextField
          disabled
          id="outlined-disabled"
          style={{ width: "80%" }}
          defaultValue={props.product.unitCost}
          InputProps={{
            style: {
              fontSize: "1.1rem",
            },
          }}
        />
      )}
      <p>Modify Stock</p>
      {role === "ADMIN" || role === "MANAGER" ? (
        <div style={{marginTop: "3%"}}>
         { /*<TextField
            required
            id="filled-number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleStockChange}
            variant="outlined"
            value={stock}
            error={errors.stock ? true : false}
            helperText={errors.stock || ""}
            style={{ width: "80%", marginTop: "3%", marginBottom: "3%" }}
            defaultValue={props.product.unitPrice}
            InputProps={{
              style: {
                fontSize: "1.5rem",
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            FormHelperTextProps={{
              style: {
                fontSize: "1.1rem",
              },
            }}
          />*/}
          <div className="priceChange">
            <IconButton size="medium" style={{backgroundColor: "#a4d4cc", color: "black", alignItems: "center", alignSelf: "center",alignContent: "center"}} aria-label="add" onClick={removeStock}>
              <RemoveIcon style={{fontSize: "1.1rem"}}/>
            </IconButton>
            <TextField
              required
              id="precio"
              onChange={handleModifyStock}
              variant="outlined"
              value={newStock}
              //error={errors.price ? true : false}
              //helperText={errors.price || ''}
              style={{ width: "15%", marginRight: "1%", marginLeft: "1%", textAlign: "center",}}
              defaultValue={props.product.stock}
              size="small"
              InputProps={{
                style: {
                  fontSize: "1.1rem",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  textAlign: "center",
                },
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "1.1rem",
                },
              }}
            />
           
            <IconButton size="medium" style={{backgroundColor: "#a4d4cc", color: "black"}}  onClick={addStock}>
              <AddIcon style={{fontSize: "1.1rem"}}/>
            </IconButton>
          </div>
        </div>
      ) : (
        <TextField
          disabled
          id="outlined-disabled"
          style={{ width: "80%" }}
          defaultValue={props.product.unitPrice}
          InputProps={{
            style: {
              fontSize: "1.5rem",
            },
          }}
        />
      )}
      <div className="buttons-add">
        <Button
          variant="outlined"
          style={{
            color: "grey",
            borderColor: "grey",
            width: "40%",
            fontSize: "1rem",
          }}
          onClick={cancelarButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#a4d4cc",
            color: "black",
            borderColor: "#a4d4cc",
            width: "40%",
            fontSize: "1rem",
          }}
          onClick={handleEditProduct}
        >
          Save
        </Button>
      </div>
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
          sx={{ fontSize: "100%" }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditForm;
