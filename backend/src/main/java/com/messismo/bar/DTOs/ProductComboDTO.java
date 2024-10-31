package com.messismo.bar.DTOs;

import com.messismo.bar.Entities.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductComboDTO {

    private Long productId;

    private String productName;

    private Integer quantity;

}
