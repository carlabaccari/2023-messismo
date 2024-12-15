import axios from "axios";
import authHeader from "./auth-header";
import { useSelector } from "react-redux";
import apiUrl from "../deploy";



const getAllCombos = () => {
  return axios.get(
    apiUrl + "/api/v1/validatedEmployee/getAllCombos",
    { headers: authHeader(), method: "GET", "Content-Type": "application/json" }
  );
};

const addCombos = (combo) => {
    console.log(combo)
  const newCombo = {
    name: combo.name,
    products: combo.products.map(productCombo => ({
        productId: productCombo.productId,
        productName: productCombo.name,
        quantity: productCombo.quantity, 
    })),
    price: combo.price,
    profit: combo.profit
  };

  console.log(newCombo);

  return axios
  .post(
    apiUrl + "/api/v1/validatedEmployee/combo/addCombo",
    newCombo,
    {
      headers: authHeader(),
      method: "POST",
      "Content-Type": "application/json",
    }
  )
  .then((response) => {
    console.log("Combo agregado con éxito:", response.data);
  })
  .catch((error) => {
    console.log(combo);
    console.error("Error al agregar el combo:", error);
  });
};


const updateComboPrice = (modifiedCombo) => {
  

  return axios.put(
    apiUrl + "/api/v1/manager/combo/updatePrice",
    modifiedCombo,
    { headers: authHeader(), 
      method: "Post", 
      "Content-Type": "application/json" }
  )
  .then((response) => {
    console.log("Precio modificado con éxito:", response.data);
  })
  .catch((error) => {
    
    console.error("Error al modificar el precio del combo:", error);
  });
};

const updateComboProfit = (modifiedCombo) => {
  

  return axios.put(
    apiUrl + "/api/v1/manager/combo/updateProfit",
    modifiedCombo,
    { headers: authHeader(), 
      method: "Post", 
      "Content-Type": "application/json" }
  )
  .then((response) => {
    console.log("Profit modificado con éxito:", response.data);
  })
  .catch((error) => {
    
    console.error("Error al modificar el profit del combo:", error);
  });
};

const getComboCost = (comboId) => {
  return axios.get(
    apiUrl + "/api/v1/validatedEmployee/getComboCost/" + comboId,
    { headers: authHeader(), method: "GET", "Content-Type": "application/json" }
  );
};

const combosService = {
    getAllCombos,
    addCombos,
    updateComboPrice,
    updateComboProfit,
    getComboCost
  };
  
  export default combosService;