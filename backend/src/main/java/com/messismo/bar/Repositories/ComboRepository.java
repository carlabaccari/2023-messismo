package com.messismo.bar.Repositories;

import com.messismo.bar.Entities.Combo;
import com.messismo.bar.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {
    Optional<Combo> findByName(String name);

    @Query("SELECT c FROM Combo c LEFT JOIN FETCH c.products pc LEFT JOIN FETCH pc.product")
    List<Combo> findAllWithProducts();

    @Query("SELECT c FROM Combo c JOIN c.products pc WHERE pc.product.productId = :productId")
    List<Combo> findByProducts_Product(@Param("productId") Long productId);





}
