import React, { useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './Form.css'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormValidation from "../FormValidation";
import categoryService from "../services/category.service";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import productsService from "../services/products.service";
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ComboForm = (props) => {

    const [name, setName] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [price, setPrice] = useState(null);
    const [profitPercentage, setProfitPercentage] = useState(0);
    const handleNombreChange = (event) => {
        setName(event.target.value);
    }
    
    const handleProductChange = (event) => {
        const product = event.target.value;
        console.log(product);



  const productExists = selectedProducts.find(p => p.productId === product.productId);

  if (productExists) {
    setSelectedProducts(prevProducts => prevProducts.map(p =>
      p.productId === product.productId ? { ...p, quantity: p.quantity + 1 } : p
    ));
  } else {
    if (productExists) {
        setSelectedProducts(prevProducts => prevProducts.map(p =>
          p.productId === product.productId ? { ...p, quantity: p.quantity + 1 } : p
        ));
      } else {

        
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1, unitCost: product.unitCost }]);
        console.log(selectedProducts);
      }
  }
      };

      const handleQuantityChange = (productId, newQuantity) => {
        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.map((product) =>
                product.productId === productId
                    ? { ...product, quantity: parseInt(newQuantity, 10) }
                    : product
            )
        );
    };
    


      const handleAddProduct = (product) => {
        const existingProduct = selectedProducts.find(p => p.productId === product.productId);
        
        if (existingProduct) {
          setSelectedProducts(prevProducts =>
            prevProducts.map(p =>
              p.productId === product.productId ? { ...p, quantity: p.quantity + 1 } : p
            )
          );
        } else {
          setSelectedProducts([...selectedProducts, { ...product, quantity: 1, unitCost: product.unitCost, name: product.name }]);
        }
      };
      
      const handleRemoveProduct = (productId) => {
        const existingProduct = selectedProducts.find(p => p.productId === productId);
      
        if (existingProduct && existingProduct.quantity > 1) {
          setSelectedProducts(prevProducts =>
            prevProducts.map(p =>
              p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
            )
          );
        } else {
           
          setSelectedProducts(prevProducts => prevProducts.filter(p => p.productId !== productId));
          console.log(selectedProducts);
        }
      };

      const handleAddCombo = () => {
        const validationErrors = FormValidation({
            name: name,
            products: products,
        
          });
        

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log(validationErrors);
           
        
        }
        const newComboData = {
            name: name,
            products: selectedProducts,
            price: price,
            profit: profitPercentage             
          };


          console.log(newComboData);

          props.onSave(newComboData);
          props.onClose();

          console.log("Combo added");

          setName("");
          setPrice(null);
          setProducts([]);
          setProfitPercentage(0);
         
            
      }

 
        const cancelarButton = (event) => {
            props.onClose();
          };

        
          const getProductQuantity = (product) => {
            const selectedProduct = selectedProducts.find(p => p.productId === product.productId);
            return selectedProduct ? selectedProduct.quantity : 0;
          };
          
      

      //const handleRemoveProduct = (productId) => {
        //setSelectedProducts(selectedProducts.filter(p => p.productId !== productId))
      //}

    
      const handlePriceChange = (event) => {
        const newPrice = parseFloat(event.target.value) || 0;
        setPrice(newPrice);
        updateProfitPercentage(newPrice); 
    }

    const updateProfitPercentage = (newPrice) => {
    
        const profit = ((newPrice - totalCost) / totalCost) * 100;
        setProfitPercentage(isNaN(profit) ? 0 : profit.toFixed(2)); 
    }

    const handleProfitChange = (event) => {
        const newProfit = parseFloat(event.target.value) || 0; // Captura el nuevo valor de ganancia
        const totalCost = selectedProducts.reduce((total, product) => total + (product.unitCost * product.quantity), 0)// Calcula el totalCost nuevamente
        
        if (isNaN(newProfit) || newProfit === 0) {
            setPrice(totalCost);
            setProfitPercentage(0); 
        } else {
            const newPrice = totalCost * (1 + newProfit / 100); 
            setPrice(newPrice);
            setProfitPercentage(newProfit);
        }
    }
    
      const totalCost = selectedProducts.reduce((total, product) => total + (product.unitCost * product.quantity), 0).toFixed(2);

    useEffect(() => {
        productsService
          .getAllProducts()
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error("Error al mostrar los productos", error);
          });
        
    }, []);

  return (
    <div>
      <h1 style={{marginBottom: '5%', fontSize: '1.8rem'}}>New Combo</h1>
      <p style={{ color: errors.name ? "red" : "black" }}>Name *</p>
      <TextField
        required
        id="name"
        value={name}
        onChange={handleNombreChange}
        variant="outlined"
        error={errors.name ? true : false}
        helperText={errors.name || ''}
        style={{ width: '80%', marginTop: '3%', marginBottom: '3%', fontSize: '1.5rem'}}
        InputProps={{
          style: {
            fontSize: '1.1rem', 
          },
        }}
          FormHelperTextProps={{
            style: {
              fontSize: '1.1rem', 
            },
          }}
      />
      <p style={{ color: errors.category ? "red" : "black" }}>Products *</p>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        multiple
        value={selectedProducts}
        onChange={handleProductChange}
        error={errors.category ? true : false}
        helperText={errors.category || ''}
        style={{ width: '80%', marginTop: '3%', marginBottom: '3%', fontSize: '1.1rem'}}
        renderValue={(selected) => (
            <div>
              {selected.map((product) => (
                <Chip key={product.productId} label={`${product.name} x${product.quantity}`} />
              ))}
            </div>
          )}
          
        InputProps={{
          style: {
            fontSize: '1.1rem',
            }} }
        FormHelperTextProps={{
          style: {
            fontSize: '1.1rem',
          },
        }}
      >
        {products.map(product => (
          <MenuItem key={product.productId} value={product}>
            {product.name}
          </MenuItem>
        ))}
      </Select>
      <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Productos</Typography>
    </AccordionSummary>
    <AccordionDetails style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {products.map(product => (
        <div key={product.productId} style={{ display: "flex", alignItems: "center" }}>
          <p>{product.name}</p>
          <Button onClick={() => handleRemoveProduct(product)}>-</Button>
          <span>{getProductQuantity(product)}</span>
          <Button onClick={() => handleAddProduct(product)}>+</Button>
        </div>
      ))}
    </AccordionDetails>
  </Accordion>
      <p>Selected Products</p>
      <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
    {/* Encabezado de las columnas */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ccc', marginBottom: '5px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>Product Name</div>
        <div style={{ width: '100px' }}>Unit Cost</div>
        <div style={{ width: '80px' }}>Quantity</div>
        <div style={{ width: '100px' }}>Total Cost</div>
        <div style={{ width: '50px' }}>Action</div>
    </div>

    {selectedProducts.map((product) => (
        <div key={product.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ccc', marginBottom: '5px', borderRadius: '5px' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>{product.name}</div>
            <div style={{ width: '100px' }}>${product.unitCost.toFixed(2)}</div>
            {/* Mostrar cantidad */}
            <div style={{ width: '80px', textAlign: 'center' }}>
                <input 
                    type="number" 
                    value={product.quantity} 
                    min="1" 
                    onChange={(e) => handleQuantityChange(product.productId, e.target.value)} 
                    style={{ width: '60px' }} 
                />
            </div>
            {/* Calcular el total cost basado en la cantidad */}
            <div style={{ width: '100px' }}>${(product.unitCost * product.quantity).toFixed(2)}</div>
            <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={() => handleRemoveProduct(product.productId)}
            >
                <CloseIcon />
            </Button>
        </div>
    ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', fontWeight: 'bold', borderTop: '2px solid #ccc', marginTop: '10px' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>Total Cost</div>
                    <div style={{ width: '100px' }}>${totalCost}</div>
                    <div style={{ width: '65px' }}></div>
                </div>
            </div>
            
            <p style={{ color: errors.price ? "red" : "black" }}>Price *</p>
      <TextField
        required
        id="price"
        value={price}
        onChange={handlePriceChange}
        variant="outlined"
        style={{ width: '80%', marginTop: '3%', marginBottom: '3%', fontSize: '1.3rem'}}
        error={errors.price ? true : false}
        helperText={errors.price || ''}
        InputProps={{
          style: {
            fontSize: '1.1rem', 
            inputMode: 'numeric', pattern: '[0-9]*'
          },}}
          FormHelperTextProps={{
            style: {
              fontSize: '1.1rem', 
            },
          }}
      />


            <p>Profit (%)</p>
            <TextField
                required
                id="profit"
                value={profitPercentage || ''}
                onChange={handleProfitChange}
                variant="outlined"
                style={{ width: '80%', marginTop: '3%', marginBottom: '3%' }}
            />
     
      
      
      <div className="buttons-add">
        <Button
          variant="outlined"
          style={{ color: "grey", borderColor: "grey" , width: "40%", fontSize: '1rem'}}
          onClick={cancelarButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#a4d4cc",
            color: "black",
            borderColor: "green",
            width: "40%",
            fontSize: '1rem'
          }}
          onClick={handleAddCombo}

        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default ComboForm;