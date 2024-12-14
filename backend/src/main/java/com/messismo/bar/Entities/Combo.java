package com.messismo.bar.Entities;

import com.messismo.bar.DTOs.ProductDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "combos")
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "combo_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "combo_id")
    private List<ProductCombo> products = new ArrayList<>();

    @Column(name = "price")
    private Double price;

    @Column(name = "profit")
    private Double profit;



    public Combo(String name, List<ProductCombo> products, Double price, Double profit) {
        this.name = name;
        this.products = products;
        this.price = price;
        this.profit = profit;
    }

    public void updatePrice(Double price) {
        if(price<=0.00){
            throw new IllegalArgumentException("Unit price must be greater than 0.00");
        }
        else {
            this.price=price;
            this.profit = calculateProfitFromPrice(price);

        }
    }

    public void updateProfit(Double profit) {
        System.out.println("Updating profit");
        if(profit<=0.00){
            throw new IllegalArgumentException("profit must be greater than 0.00");
        }
        else {
            this.profit=profit;
            this.price = calculatePriceFromProfit(profit);

        }

    }

    public Double getTotalCost() {
        return products.stream()
                .mapToDouble(ProductCombo::getTotalCost)
                .sum();
    }

    private Double calculatePriceFromProfit(Double profit) {
        return getTotalCost() * (1 + profit / 100);
    }

    private Double calculateProfitFromPrice(Double price) {
        return ((price - getTotalCost()) / getTotalCost()) * 100;
    }


}

