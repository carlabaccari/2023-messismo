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
import { IconButton, PopoverPaper } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import combosService from "../services/combo.service";

const EditComboForm = (props) => {
  const [precio, setPrecio] = useState(props.combo.price);
  const { user: currentUser } = useSelector((state) => state.auth);
  const token = currentUser.access_token;
  const role = currentUser.role;
  const [errors, setErrors] = useState({});
  const [isOperationSuccessful, setIsOperationSuccessful] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [profit, setProfit] = useState(props.combo.profit);
  const [selectedOption, setSelectedOption] = useState("");

 

  

  const handlePrecioChange = (event) => {
    setPrecio(event.target.value);
  };

  const handleProfitChange = (event) => {
    setProfit(event.target.value);
  };


  const cancelarButton = (event) => {
    props.onClose();
  };

 

  const handleEditCombo = async () => {
    const validationErrors = EditFormValidation({
      price: precio,
      profit: profit,
    });

    const comboId = props.combo.id
    console.log(profit)
    console.log(precio)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(validationErrors);
    } else {
      if (selectedOption === 'Edit Price'){
        const comboUpdated = {
          id: comboId,
          price: precio
        }
        try {
            const response = await combosService
              .updateComboPrice(comboUpdated)
              .then((response) => {
                console.log(response);
                setIsOperationSuccessful(true);
                setAlertText("Combo price updated successfully");
                setOpenSnackbar(true);
              });
          } catch (error) {
            console.error("Error", error);
            setIsOperationSuccessful(false);
            setAlertText("Failed to modify combo");
            setOpenSnackbar(true);
          }
        }
        else if ( selectedOption === 'Edit Profit'){
          const comboUpdated = {
            id: comboId,
            profit: profit
          }
          try {
              const response = await combosService
                .updateComboProfit(comboUpdated)
                .then((response) => {
                  console.log(response);
                  setIsOperationSuccessful(true);
                  setAlertText("Combo price updated successfully");
                  setOpenSnackbar(true);
                });
            } catch (error) {
              console.error("Error", error);
              setIsOperationSuccessful(false);
              setAlertText("Failed to modify combo");
              setOpenSnackbar(true);
            }

        }
    }


  };

  

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  

  


  return (
    <div>
      <h1 style={{ marginBottom: "5%", fontSize: "1.8rem" }}>Edit Combo</h1>

   
       


      
      {role === "ADMIN" || role === "MANAGER" ? (
        <div>
           <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={selectedOption}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="Edit Price" control={<Radio />} label="Edit Price" />
        <FormControlLabel value="Edit Profit" control={<Radio />} label="Edit Profit" />
  
      </RadioGroup>
    </FormControl>
    {selectedOption === "Edit Price" && (
    <div>
    <p>Price</p>
          <TextField
            required
            id="precio"
            onChange={handlePrecioChange}
            variant="outlined"
            value={precio}
            error={errors.price ? true : false}
            helperText={errors.price || ""}
            style={{ width: "80%", marginTop: "3%", marginBottom: "3%" }}
            defaultValue={props.combo.unitPrice}
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
    )}
    {selectedOption === "Edit Profit" && (
      <div>
         <p>Profit</p>
          <TextField
            required
            id="profit"
            onChange={handleProfitChange}
            variant="outlined"
            value={profit}
            error={errors.profit ? true : false}
            helperText={errors.profit || ""}
            style={{ width: "80%", marginTop: "3%", marginBottom: "3%" }}
            
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
    )}
        </div>
    
      ) : (
        <div>
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
        <p>Profit</p>
        <TextField
        disabled
        id="outlined-disabled"
        style={{ width: "80%" }}
        defaultValue={0}
        InputProps={{
          style: {
            fontSize: "1.1rem",
          },
        }}
      />
      </div>
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
          onClick={handleEditCombo}
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

export default EditComboForm;
