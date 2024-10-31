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




    public Combo(String name, List<ProductCombo> products, Double price){
        this.name = name;
        this.products = products;
        this.price = price;

    }


}

