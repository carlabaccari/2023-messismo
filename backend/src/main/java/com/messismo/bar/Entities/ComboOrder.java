package com.messismo.bar.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "combo_order")
public class ComboOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comboOrderId")
    private Long comboOrderId;

    @Column(name = "comboName")
    private String comboName;

    @Column(name = "comboUnitCost")
    private Double comboUnitCost;

    @Column(name = "comboUnitPrice")
    private Double comboUnitPrice;


    @Column(name = "quantity")
    private Integer quantity;


    public ComboOrder(String comboName, Double comboUnitPrice, Double comboUnitCost, Integer quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Combo quantity must be greater than 0");
        } else {
            this.comboName = comboName;
            this.comboUnitPrice = comboUnitPrice;
            this.comboUnitCost = comboUnitCost;
            this.quantity = quantity;
        }
    }

    @Override
    public String toString() {
        return "ComboOrder{" + "comboOrderId=" + comboOrderId + ", combo=" + comboName + ", quantity=" + quantity + '}';
    }
}
