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

const combosService = {
    getAllCombos,
    addCombos,

  
  };
  
  export default combosService;