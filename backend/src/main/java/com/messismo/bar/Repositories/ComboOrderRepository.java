package com.messismo.bar.Repositories;

import com.messismo.bar.Entities.ComboOrder;
import com.messismo.bar.Entities.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComboOrderRepository extends JpaRepository<ComboOrder, Long> {

        boolean existsByComboId(Long comboId);



}
