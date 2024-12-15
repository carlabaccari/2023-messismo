package com.messismo.bar.Services;

import com.messismo.bar.DTOs.*;
import com.messismo.bar.Entities.*;
import com.messismo.bar.Exceptions.*;
import com.messismo.bar.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    private final ProductOrderRepository productOrderRepository;

    private final ComboOrderRepository comboOrderRepository;

    private final ComboRepository comboRepository;

    public String addNewOrder(OrderRequestDTO orderRequestDTO) throws Exception {
        try {
            System.out.println(orderRequestDTO);
            User employee = userRepository.findByEmail(orderRequestDTO.getRegisteredEmployeeEmail()).orElseThrow(() -> new UserNotFoundException("No user has that email"));
            NewProductOrderListDTO newProductOrderListDTO = new NewProductOrderListDTO(new ArrayList<>(), 0.0, 0.0);
            if (orderRequestDTO.getProductOrders() != null && !orderRequestDTO.getProductOrders().isEmpty()) {
                newProductOrderListDTO = createProductOrder(orderRequestDTO.getProductOrders());
            }


            NewComboOrderListDTO newComboOrderListDTO = new NewComboOrderListDTO(new ArrayList<>(), 0.0, 0.0);
            if (orderRequestDTO.getComboOrders() != null && !orderRequestDTO.getComboOrders().isEmpty()) {
                newComboOrderListDTO = createComboOrder(orderRequestDTO.getComboOrders());
            }

            double totalCost = newProductOrderListDTO.getTotalCost() + newComboOrderListDTO.getTotalCost();
            double totalPrice = newProductOrderListDTO.getTotalPrice() + newComboOrderListDTO.getTotalPrice();




            Order newOrder = new Order(employee, orderRequestDTO.getDateCreated(), newProductOrderListDTO.getProductOrderList(), newComboOrderListDTO.getComboOrderList(), totalPrice, totalCost);
            System.out.println(newOrder);
            orderRepository.save(newOrder);
            return "Order created successfully";
        } catch (UserNotFoundException | ProductQuantityBelowAvailableStock e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("CANNOT create an order at the moment");
        }
    }

    public String closeOrder(OrderIdDTO orderIdDTO) throws Exception {
        try {
            Order order = orderRepository.findById(orderIdDTO.getOrderId()).orElseThrow(() -> new OrderNotFoundException("Order not found"));
            order.close();
            orderRepository.save(order);
            return "Order closed successfully";
        } catch (OrderNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("CANNOT close an order at the moment");
        }
    }

    public String modifyOrder(ModifyOrderDTO modifyOrderDTO) throws Exception {
        try {
            System.out.println(modifyOrderDTO);
            Order order = orderRepository.findById(modifyOrderDTO.getOrderId()).orElseThrow(() -> new OrderNotFoundException("Order not found"));
            NewProductOrderListDTO newProductOrderListDTO = new NewProductOrderListDTO(new ArrayList<>(), 0.0, 0.0);
            NewComboOrderListDTO newComboOrderListDTO = new NewComboOrderListDTO(new ArrayList<>(), 0.0, 0.0);


            if (modifyOrderDTO.getProductOrders() != null && !modifyOrderDTO.getProductOrders().isEmpty()) {
                newProductOrderListDTO = createProductOrder(modifyOrderDTO.getProductOrders());
            }


            if (modifyOrderDTO.getComboOrders() != null && !modifyOrderDTO.getComboOrders().isEmpty()) {
                newComboOrderListDTO = createComboOrder(modifyOrderDTO.getComboOrders());
            }
            order.updateProductOrders(newProductOrderListDTO.getProductOrderList());
            order.updateComboOrders(newComboOrderListDTO.getComboOrderList());

            double totalPrice = newProductOrderListDTO.getTotalPrice() + newComboOrderListDTO.getTotalPrice();
            double totalCost = newProductOrderListDTO.getTotalCost() + newComboOrderListDTO.getTotalCost();

            order.updateTotalPrice(totalPrice);
            order.updateTotalCost(totalCost);
            System.out.println(newComboOrderListDTO);
            System.out.println(newProductOrderListDTO);
            System.out.println(order);
            orderRepository.save(order);
            return "Order modified successfully";
        } catch (ProductQuantityBelowAvailableStock | OrderNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("CANNOT modify this order at the moment");
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getAllOrdersBetweenTwoDates(Date startingDate, Date endingDate) {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrderByDate = new ArrayList<>();
        for (Order order : allOrders) {
            if (order.getDateCreated().after(startingDate) && order.getDateCreated().before(endingDate)) {
                filteredOrderByDate.add(order);
            }
        }
        return filteredOrderByDate;
    }

    public NewProductOrderListDTO createProductOrder(List<ProductOrderDTO> productOrderDTOList) throws ProductQuantityBelowAvailableStock {
        List<ProductOrder> productOrderList = new ArrayList<>();
        double totalPrice = 0.00;
        double totalCost = 0.00;
        for (ProductOrderDTO productOrderDTO : productOrderDTOList) {
            if (productOrderDTO.getProduct().getStock() < productOrderDTO.getQuantity()) {
                throw new ProductQuantityBelowAvailableStock("Not enough stock of a product");
            } else {
                Product product = productOrderDTO.getProduct();
                product.removeStock(productOrderDTO.getQuantity());
                productRepository.save(product);
                totalPrice += (product.getUnitPrice() * productOrderDTO.getQuantity());
                totalCost += (product.getUnitCost() * productOrderDTO.getQuantity());
                ProductOrder productOrder = new ProductOrder(product.getName(), product.getUnitPrice(), product.getUnitCost(), product.getCategory(), productOrderDTO.getQuantity());
                productOrderRepository.save(productOrder);
                productOrderList.add(productOrder);
            }
        }
        return NewProductOrderListDTO.builder().productOrderList(productOrderList).totalCost(totalCost).totalPrice(totalPrice).build();
    }


    public NewComboOrderListDTO createComboOrder(List<ComboOrderDTO> comboOrderListDTO) throws ProductQuantityBelowAvailableStock {
        List<ComboOrder> comboOrderList = new ArrayList<>();
        double totalPrice = 0.00;
        double totalCost = 0.00;

        for (ComboOrderDTO comboOrderDTO : comboOrderListDTO) {
            Combo combo = comboOrderDTO.getCombo();

            for (ProductCombo productCombo : combo.getProducts()) {
                Product product = productCombo.getProduct();

                int totalRequiredQuantity = productCombo.getQuantity() * comboOrderDTO.getQuantity();


                if (product.getStock() < totalRequiredQuantity) {
                    throw new ProductQuantityBelowAvailableStock(
                            "Not enough stock of product: " + product.getName());
                }


                product.removeStock(totalRequiredQuantity);
                productRepository.save(product);




            }
            totalCost += (combo.getTotalCost() * comboOrderDTO.getQuantity());
            totalPrice += (combo.getPrice() * comboOrderDTO.getQuantity());



            ComboOrder comboOrder = new ComboOrder(combo.getId(), combo.getName(), combo.getPrice(), combo.getTotalCost(), comboOrderDTO.getQuantity());
            comboOrderRepository.save(comboOrder);
            comboOrderList.add(comboOrder);

        }


        return NewComboOrderListDTO.builder().comboOrderList(comboOrderList).totalCost(totalCost).totalPrice(totalPrice).build();
    }

}