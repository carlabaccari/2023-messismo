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


}
