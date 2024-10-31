package com.messismo.bar.Repositories;

import com.messismo.bar.Entities.Combo;
import com.messismo.bar.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {
    Optional<Combo> findByName(String name);

}
