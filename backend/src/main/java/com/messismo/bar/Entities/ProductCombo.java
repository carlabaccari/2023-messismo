package com.messismo.bar.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "product_combos")
public class ProductCombo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_combo_id")
    private Long id;

    @Column(name = "combo_id", insertable = false, updatable = false)
    private Long comboId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    @JsonIgnore
    private Product product;



    @Column(name = "quantity")
    private Integer quantity;

    public ProductCombo(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}
