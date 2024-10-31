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
                    comboDTO.getPrice()
            );

            return comboRepository.save(combo);



        } catch (ExistingComboNameFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Combo was not created", e);
        }
    }

    public List<Combo> getAllCombos() {
        return comboRepository.findAll();
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
            Combo combo = comboRepository.findById(comboPriceDTO.getId())
                    .orElseThrow(() -> new ComboNotFoundException("ComboId DOES NOT match any comboId"));

            combo.setPrice(comboPriceDTO.getPrice());
            comboRepository.save(combo);

            return "Combo price updated successfully";
        } catch (ComboNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Error updating combo price: " + e.getMessage());
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





}
