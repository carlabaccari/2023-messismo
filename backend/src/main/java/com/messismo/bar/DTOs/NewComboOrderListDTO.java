package com.messismo.bar.DTOs;

import com.messismo.bar.Entities.ComboOrder;
import com.messismo.bar.Entities.ProductOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewComboOrderListDTO {
    private List<ComboOrder> comboOrderList;
    private Double totalCost;
    private Double totalPrice;
}

