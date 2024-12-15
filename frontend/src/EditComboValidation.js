const EditComboValidation = (values) => {
    let errors = {};
  
    if (!values.price && !values.profit) {
      errors.fields = "At least one field (Price or Profit) must be filled.";
    }
  
    if (values.price && values.price < 0) {
      errors.price = "Price must be greater than or equal to 0.";
    }
  
    if (values.profit && values.profit < 0) {
      errors.profit = "Profit must be greater than or equal to 0.";
    }
  
    return errors;
  };
  
  export default EditComboValidation;
  