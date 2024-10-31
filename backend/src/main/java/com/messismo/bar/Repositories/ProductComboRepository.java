package com.messismo.bar.Repositories;

import com.messismo.bar.Entities.Combo;
import com.messismo.bar.Entities.ProductCombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductComboRepository extends JpaRepository<ProductCombo, Long> {
}
