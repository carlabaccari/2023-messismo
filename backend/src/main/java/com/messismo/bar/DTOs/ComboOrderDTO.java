package com.messismo.bar.DTOs;

import com.messismo.bar.Entities.Combo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComboOrderDTO {

    private Combo combo;

    private Integer quantity;
}
