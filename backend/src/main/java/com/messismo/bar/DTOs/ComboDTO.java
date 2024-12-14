package com.messismo.bar.DTOs;

import com.messismo.bar.Entities.Product;
import com.messismo.bar.Entities.ProductCombo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComboDTO {
    private Long id;

    private String name;

    private List<ProductComboDTO> products;

    private Double price;

    private Double totalCost;

    private Double profit;

    public ComboDTO(Long id, String name, Double price, List<ProductComboDTO> products, Double totalCost, Double profit) {
        this.id = id;
        this.name = name;
        this.products = products;
        this.price = price;
        this.totalCost = totalCost;
        this.profit = profit;
    }

}
