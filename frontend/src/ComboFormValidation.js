function ComboFormValidation(values) {
    const errors = {};
    const numberRegex = /^[-+]?\d*\.?\d+$/; 

  
    if (!values.price || values.price === "") {
        errors.price = "Field is empty";
    } else if (!numberRegex.test(values.price)) {
        errors.price = "Invalid price";
    } else if (parseFloat(values.price) < 0) {
        errors.price = "Price cannot be negative";
    }

    if (!values.name || values.name.trim() === "") {
        errors.name = "Field is empty";
    }

    if (!values.profit || values.profit === "") {
        errors.profit = "Field is empty";
    } else if (!numberRegex.test(values.profit)) {
        errors.profit = "Invalid profit";
    } else if (parseFloat(values.profit) < 0) {
        errors.profit = "Profit cannot be negative";
    }

    
    if (!values.selectedProducts || values.selectedProducts.length <=  1) {
        errors.selectedProducts = "At least two products must be selected";
    }

    return errors;
}

export default ComboFormValidation;
