package com.messismo.bar.Services;

import com.messismo.bar.DTOs.*;
import com.messismo.bar.Entities.*;
import com.messismo.bar.Exceptions.ComboNotFoundException;
import com.messismo.bar.Exceptions.ProductNotFoundException;
import com.messismo.bar.Repositories.ComboRepository;
import com.messismo.bar.Repositories.ProductComboRepository;
import com.messismo.bar.Repositories.ProductRepository;
import com.messismo.bar.Exceptions.ExistingComboNameFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
@RequiredArgsConstructor
public class ComboService {

    private final ComboRepository comboRepository;

    private final ProductRepository productRepository;

    private final ProductComboRepository productComboRepository;

    public Combo addCombo(ComboDTO comboDTO) throws Exception, ExistingComboNameFoundException {
        try {
            Optional<Combo> existingCombo = comboRepository.findByName(comboDTO.getName());
            if (existingCombo.isPresent()) {
                throw new ExistingComboNameFoundException("This name is already in use");
            }


            List<ProductCombo> productCombos = new ArrayList<>();
            for (var productComboDTO : comboDTO.getProducts()) {
                Long productId = productComboDTO.getProductId();
                Integer quantity = productComboDTO.getQuantity();

                Optional<Product> productOptional = productRepository.findById(productId);
                if (productOptional.isPresent()) {
                    Product product = productOptional.get();
                    ProductCombo productCombo = new ProductCombo(product, quantity);
                    productCombos.add(productCombo);


                    productCombos.add(productCombo);
                }
            }

            List<Combo> existingCombos = comboRepository.findAll();
            for (Combo combo : existingCombos) {
                if (isSameProductCombination(combo.getProducts(), productCombos)) {
                    throw new Exception("A combo with the same combination of products already exists");
                }
            }



            Combo combo = new Combo(
                    comboDTO.getName(),
                    productCombos,
                    comboDTO.getPrice(),
                    comboDTO.getProfit()
            );

            return comboRepository.save(combo);



        } catch (ExistingComboNameFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Combo was not created", e);
        }
    }

    public List<ComboDTO> getAllCombos() {
        List<Combo> combos = comboRepository.findAllWithProducts();
        return combos.stream().map(this::toComboDTO).toList();
    }

    public Double getComboCostById(Long comboId) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new IllegalArgumentException("Combo no encontrado con ID: " + comboId));
        return combo.getTotalCost();
    }

    private ComboDTO toComboDTO(Combo combo) {
        double totalCost = combo.getProducts().stream()
                .mapToDouble(pc -> pc.getProduct().getUnitCost() * pc.getQuantity())
                .sum();

        double profit = (combo.getPrice() - totalCost) / totalCost * 100;

        List<ProductComboDTO> productComboDTOs = combo.getProducts().stream()
                .map(pc -> new ProductComboDTO(
                        pc.getProduct().getProductId(),
                        pc.getProduct().getName(),
                        pc.getQuantity()
                ))
                .toList();

        return new ComboDTO(combo.getId(), combo.getName(), productComboDTOs, combo.getPrice(), totalCost, profit);
    }


    public String deleteCombo(Long id) throws Exception {
        try {
            Combo combo = comboRepository.findById(id).orElseThrow(() -> new ComboNotFoundException("Combo ID DOES NOT match any combo ID"));
            comboRepository.delete(combo);
            return "Combo deleted successfully";
        } catch (ComboNotFoundException e) {
            throw e;
        }
        catch(Exception e){
            throw new Exception("Combo CANNOT be deleted");
        }
    }

    public String modifyComboPrice(ComboPriceDTO comboPriceDTO) throws Exception {
        try {
            Combo combo = comboRepository.findById(comboPriceDTO.getId()).orElseThrow(() -> new ProductNotFoundException("ProductId DOES NOT match any productId"));
            combo.updatePrice(comboPriceDTO.getPrice());
            comboRepository.save(combo);
            return "Product price updated successfully";
        } catch (ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("");
        }
    }

    public String modifyComboProfit(ComboProfitDTO comboProfitDTO) throws Exception {
        try {
            Combo combo = comboRepository.findById(comboProfitDTO.getId()).orElseThrow(() -> new ProductNotFoundException("ProductId DOES NOT match any productId"));
            combo.updateProfit(comboProfitDTO.getProfit());
            comboRepository.save(combo);
            System.out.println(combo);
            return "Combo profit updated successfully";
        } catch (ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("");
        }
    }

    private boolean isSameProductCombination(List<ProductCombo> existingProducts, List<ProductCombo> newProducts) {
        if (existingProducts.size() != newProducts.size()) {
            return false;
        }


        Map<Long, Integer> existingProductMap = new HashMap<>();
        for (ProductCombo pc : existingProducts) {
            existingProductMap.put(pc.getProduct().getProductId(), pc.getQuantity());
        }

        for (ProductCombo pc : newProducts) {
            if (!existingProductMap.containsKey(pc.getProduct().getProductId()) ||
                    !existingProductMap.get(pc.getProduct().getProductId()).equals(pc.getQuantity())) {
                return false;
            }
        }

        return true;
    }


    public List<ProductCombo> getProductCombosByComboId(Long comboId) {
        Optional<Combo> comboOptional = comboRepository.findById(comboId);
        if (comboOptional.isEmpty()) {
            throw new NoSuchElementException("Combo not found with ID: " + comboId);
        }

        return comboOptional.get().getProducts();
    }








}
