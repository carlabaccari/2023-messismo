import React, { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form'
import styled from "styled-components";
import { GrAddCircle } from 'react-icons/gr'
import productsService from "../services/products.service";
import ordersService from "../services/orders.service";
import combosService from "../services/combo.service";


const Form = styled.form`
    padding: 2rem;
    background-color: rgb(164, 212, 204, 0.6);

    .fail {
        color: red;
    }

    .form-totalprice{
        margin-top: 1.5rem;
        text-align: center;
        span{
            font-size: 24px;
        }
    }

    small{
        font-size: 10px;

        @media (max-width: 550px) {
            font-size: 9px;
        }

        @media (max-width: 450px) {
            font-size: 8px;
        }

        @media (max-width: 350px) {
            font-size: 7px;
        }
    }

    @media (max-width: 250px) {
        min-width: 250px;
    }

`;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2rem;

    .form-product{
        margin-right: 1rem;
        width: 70%;
    }

    .form-amount{
        margin-right: 1rem;
        width: 15%;
        text-align: center;
    }

    .form-price{
        width: 15%;
        overflow: hidden;
        text-align: center;
        margin-top: 3.5rem;

        span{
            font-size: 14px;
        
            @media (max-width: 550px) {
                font-size: 12px;
            }

            @media (max-width: 450px) {
                font-size: 10px;
            }

            @media (max-width: 350px) {
                font-size: 8px;
            }
        }
    }

`;

const Label = styled.label`
    display: inline-block;
    margin-bottom: 7px;
    font-size: 1.3rem;
    text-transform: uppercase;
    color: black;
`;

const Select = styled.select`
    border: 1px solid rgb(164, 212, 204, 0.7);
    background-color: transparent;
    display: block;
    font-family: inherit;
    font-size: 16px;
    padding: 1rem;
    width: 100%;   

    &:focus{
        outline: none;
        border-color: #A4D4CC;
    }

    @media(max-width: 350px){
      font-size: 12px;
    }
`;

const Input = styled.input`
    border: 1px solid rgb(164, 212, 204, 0.7);
    background-color: transparent;
    display: block;
    font-family: inherit;
    font-size: 16px;
    padding: 1.1rem;
    width: 100%;
    text-align: center;   

    &:focus{
        outline: none;
        border-color: #A4D4CC;
    }

    @media(max-width: 350px){
      font-size: 12px;
    }
`;

const AddIcon = styled(GrAddCircle)`
    cursor: pointer;
    font-size: 20px;
    width: 100%;
`;

// const RemoveIcon = styled(RiDeleteBinLine)`
//     color: red;
//     font-size: 20px;
// `;

const Button = styled.button`
    display: block;
    width: 100%;
    font-size: 1.5rem;
    border-radius: 3px;
    padding: 1rem 3.5rem;
    margin-top: 2rem;
    border: 1px solid black;
    background-color: #a4d4cc;
    color: black;
    text-transform: uppercase;
    cursor: pointer;
    letter-spacing: 1px;
    box-shadow: 0 3px #999;
    font-family: 'Roboto',serif;
    text-align: center;

    &:hover{
        background-color: #a7d0cd;
    }
    &:active{
        background-color: #a4d4cc;
        box-shadow: 0 3px #666;
        transform: translateY(4px);
    }
    &:focus{
        outline: none;
    }



`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .placeorder{
        margin-right: 1rem;
    }

    @media(max-width: 477px){
      width: 100%;
      flex-direction: column;
      text-align: center;
    }
`;

const EditOrderForm = ({onCancel, orderId, onAdd}) => {

    const { control, register, handleSubmit, formState: {errors}, watch } = useForm()
    const [selectedProducts, setSelectedProducts] = useState({});
    const [productStocks, setProductStocks] = useState({});
    const [products, setProducts] = useState([]);
    const [formField, setFormField] = useState([
        { product: '', amount: '' }
    ]);
    const [options, setOptions] = useState({
        products: [],
        // paymentMethods: ['cash', 'credit card', 'debit card'],
      });
    const [selectedProductNames, setSelectedProductNames] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState({});
    const [combos, setCombos] = useState([]);
    const [comboOptions, setComboOptions] = useState([]);
    const [comboField, setComboField] = useState([{ combo: '', amount: '' }]);



    useEffect(() => {
        productsService
          .getAllProducts()
          .then((response) => {
            const formattedProducts = response.data.map(product => ({
                id: product.productId,
                name: product.name,
                unitPrice: product.unitPrice,
                description: product.description,
                stock: product.stock,
                category: product.category,
                unitCost: product.unitCost
            }));
            setProducts(formattedProducts);
            const productNames = formattedProducts.map(product => product.name);
            setOptions(prevOptions => ({
              ...prevOptions,
              products: productNames
            }));
          })
          .catch((error) => {
            console.error("Error al mostrar los productos", error);
          });

          combosService
                .getAllCombos()
                .then((response) => {
                    const formattedCombos = response.data.map(combo => ({
                        id: combo.id,
                        name: combo.name,
                        price: combo.price,
                        profit: combo.profit,
                        products: combo.products
                    }));
                    setCombos(formattedCombos);
                    const comboNames = formattedCombos.map(combo => combo.name);
                    setComboOptions(comboNames);
                })
                .catch((error) => {
                    console.error("Error al mostrar los combos", error);
                });
    }, []);

    useEffect(() => {
        const stockData = {};
        products.forEach(product => {
            stockData[product.name] = product.stock;
        });
        setProductStocks(stockData);
    }, [products]);
    
    const addField = () => {
        let object = {
            product: '', 
            amount: ''
        }
        setFormField([...formField, object])
    }

    const orderSubmit = (data) => {
        const orderedProducts = formField.map((form, index) => {
            const productName = data[`product-${index}`];
            const product = products.find(product => product.name === productName);
            const amount = parseInt(data[`amount-${index}`]) || 0;

            if (product && !isNaN(product.unitPrice) && !isNaN(amount)) {
                return {
                    id: product.id,
                    name: product.name,
                    unitPrice: parseFloat(product.unitPrice),
                    description: product.description,
                    stock: product.stock,
                    category: product.category,
                    amount: amount,
                    unitCost: parseFloat(product.unitCost),
                };
            } else {
                return null;
            }
        }).filter(product => product !== null);

        const orderedCombos = comboField.map((form, index) => {
            const comboName = data[`combo-${index}`];
            const combo = combos.find(combo => combo.name === comboName);
            const amount = parseInt(data[`amount-combo-${index}`]) || 0;

            
    
            if (combo && !isNaN(combo.price) && !isNaN(amount)) {
                return {
                    id: combo.id,
                    name: combo.name,
                    price: combo.price,
                    profit: combo.profit,
                    amount: amount,
                    products: combo.products
                };
            } else {
                return null;
            }
        }).filter(combo => combo !== null);


        const totalPrice = orderedProducts.reduce((total, product) => {
            return total + product.unitPrice * product.amount;
        }, 0);

        
        const totalCost = orderedProducts.reduce((total, product) => {
            return total + product.unitCost * product.amount;
        }, 0);

      

        /*const orderDataNew = {
            orderId: orderId,
            productOrders: orderedProducts.map(product => ({
                product,
                quantity: product.amount
            })),
            comboOrders: orderedCombos.map(combo => ({
                combo,
                quantity: combo.amount
            }))
        };*/

        const orderDataNew = {
            orderId: orderId,
            productOrders: orderedProducts.map(product => ({
                product: {
                    productId: product.id, // Asegúrate de incluir el ID
                    name: product.name,
                    unitPrice: product.unitPrice,
                    description: product.description,
                    stock: product.stock,
                    category: product.category,
                    unitCost: product.unitCost,
                },
                quantity: product.amount,
            })),
            comboOrders: orderedCombos.map(combo => ({
                combo: {
                  id: combo.id,
                  name: combo.name,
                  products: combo.products.map((productCombo) => {
                    const fullProduct = products.find(
                      (p) => p.id === productCombo.productId
                    );
                    console.log(products);
                    console.log(productCombo.productId);
                    console.log(fullProduct);
                    return {
                      id: null, // El ID del `ProductCombo` si está disponible
                      comboId: combo.id, // El ID del combo
                      product: {
                        productId: fullProduct?.id,
                        name: fullProduct?.name,
                        unitPrice: fullProduct?.unitPrice,
                        unitCost: fullProduct?.unitCost,
                        description: fullProduct?.description,
                        stock: fullProduct?.stock,
                        category: fullProduct?.category,
                    },
                    quantity: productCombo.quantity, // La cantidad específica del producto en el combo
                    }; }),
                    price: combo.price,
                    profit: combo.profit,
                },
                quantity: combo.amount,
            })),
        };

         console.log(orderDataNew);
        
    
  

        ordersService.modifyOrder(orderDataNew)
        .then(response => {
            console.log("Orden enviada con éxito:", response.data);
            onCancel();
        })
        .catch(error => {
            console.error("Error al enviar la orden:", error);
        });
       
    };

    const handleAddProductsClick = () => {
            orderSubmit();
            onAdd();
    };

    const handleCancelClick = () => {
        onCancel();
    };

    const totalPrice = formField.reduce((total, form, index) => {
        const productName = watch(`product-${index}`);
        const product = products.find(product => product.name === productName);
        const amount = parseInt(watch(`amount-${index}`)) || 0;
        return total + (product?.unitPrice || 0) * amount;
    }, 0) + comboField.reduce((total, form, index) => {
        const comboName = watch(`combo-${index}`);
        const combo = combos.find(combo => combo.name === comboName);
        const amount = parseInt(watch(`amount-combo-${index}`)) || 0;
        return total + (combo?.price || 0) * amount;
    }, 0);

    return(
        <>
            
            <Form onSubmit={ handleSubmit(orderSubmit) } className="form-react">
            <h1 style={{fontSize: '2rem', marginBottom: '3%'}}>Edit order</h1>
                {formField.map((form, index) => {
                    return(
                        <ProductContainer key={index}>

                            <div className="form-product">
                                <Label>Product</Label>

                                <Controller
                                name={`product-${index}`}
                                control={control}
                                defaultValue=""
                                {...register(`product-${index}`, { required: true })}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        onChange={(e) => {
                                            const selectedProduct = e.target.value;
                                            setSelectedProductNames(prevSelectedProductNames => (
                                                prevSelectedProductNames.includes(selectedProduct)
                                                    ? prevSelectedProductNames
                                                    : [...prevSelectedProductNames, selectedProduct]
                                            ));
                                            setSelectedProducts(prevState => ({
                                                ...prevState,
                                                [field.name]: selectedProduct
                                            }));
                                            field.onChange(selectedProduct);
                                        }}
                                    >
                                        <option value="" disabled></option>
                                        {options.products.map(product => (
                                            <option
                                                key={product}
                                                value={product}
                                                disabled={selectedProductNames.includes(product)}
                                            >
                                                {product}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                                />
                                {errors[`product-${index}`]?.type === 'required' && <small className="fail">Field is empty</small>}
                            </div>

                            <div className="form-amount">
                                <Label>Units</Label>
                                <Input
                                name={`amount-${index}`}
                                type="number"
                                {...register(`amount-${index}`, {
                                    required: true,
                                    min: 1,
                                    max: productStocks[selectedProducts[`product-${index}`]] || 1
                                })}
                                />
                                {errors[`amount-${index}`]?.type === 'required' && <small className="fail">Field is empty</small>}

                                {errors[`amount-${index}`]?.type === 'min' && (
                                    <small className="fail">
                                        {products.find(product => product.name === selectedProducts[`product-${index}`]).stock === 0
                                            ? "Out of Stock"
                                            : "Min: 1"
                                        }
                                    </small>
                                )}

                                {errors[`amount-${index}`]?.type === 'max' && (
                                    <small className="fail">
                                        {products.find(product => product.name === selectedProducts[`product-${index}`]).stock === 0
                                            ? "Out of Stock"
                                            : `Stock: ${products.find(product => product.name === selectedProducts[`product-${index}`]).stock}`
                                        }
                                    </small>
                                )}

                            </div>

                            <div className="form-price">
                                    {selectedProducts[`product-${index}`] && (
                                        <span>
                                            {`$${(products.find(product => product.name === selectedProducts[`product-${index}`]).unitPrice * watch(`amount-${index}`)).toFixed(2)}`}
                                        </span>
                                    )}
                            </div>

                            {/* <RemoveIcon onClick={() => removeField(index)}/> */}

                        </ProductContainer>
                    )
                })}

                <AddIcon onClick={addField} />

                {/* <div className="form-paymentmethod">
                    <Label>Payment Method</Label>
                    <Controller
                        control={control}
                        defaultValue=""
                        {...register('paymentmethod', { required: true })}
                        render={({ field }) => (
                            <Select {...field}>
                                <option value="" disabled></option>
                                {options.paymentMethods.map(method => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.paymentmethod?.type === 'required' && <small className="fail">Field is empty</small>}
                </div> */}

{comboField.map((field, index) => (
    <ProductContainer key={`combo-${index}`}>
        <div className="form-product">
            <Label>Combo</Label>
            <Controller
                name={`combo-${index}`}
                control={control}
                defaultValue=""
                {...register(`combo-${index}`, { required: true })}
                render={({ field }) => (
                    <Select
                        {...field}
                        onChange={(e) => {
                            const selectedCombo = e.target.value;
                            setSelectedCombos(prevState => ({
                                ...prevState,
                                [field.name]: selectedCombo
                            }));
                            field.onChange(selectedCombo);
                        }}
                    >
                        <option value="" disabled>Select a combo</option>
                        {comboOptions.map(combo => (
                            <option
                                key={combo}
                                value={combo}
                                disabled={Object.values(selectedCombos).includes(combo)}
                            >
                                {combo}
                            </option>
                        ))}
                    </Select>
                )}
            />
            {errors[`combo-${index}`]?.type === 'required' && <small className="fail">Field is empty</small>}
        </div>

        <div className="form-amount">
            <Label>Units</Label>
            <Input
                name={`amount-combo-${index}`}
                type="number"
                {...register(`amount-combo-${index}`, {
                    required: true,
                    min: 1
                })}
            />
            {errors[`amount-combo-${index}`]?.type === 'required' && <small className="fail">Field is empty</small>}
        </div>

        <div className="form-price">
            {selectedCombos[`combo-${index}`] && (
                <span>
                    {`$${(
                        combos.find(combo => combo.name === selectedCombos[`combo-${index}`])?.price *
                        (parseInt(watch(`amount-combo-${index}`)) || 0)
                    ).toFixed(2)}`}
                </span>
            )}
        </div>
    </ProductContainer>
))}
<AddIcon onClick={() => setComboField([...comboField, { combo: '', amount: '' }])} />

                <div className="form-totalprice">
                    <Label>Total</Label>
                    <div>
                        <span>{`$${totalPrice.toFixed(2)}`}</span>
                    </div>
                </div>
        
                <Buttons>
                    <Button type="submit" className="placeorder">Add Products</Button>
                    <Button type="button" className="cancel" onClick={handleCancelClick}>Cancel</Button>
                </Buttons>

            </Form>
        </>
    )

}

export default EditOrderForm;