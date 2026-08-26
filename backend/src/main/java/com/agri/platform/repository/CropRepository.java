package com.agri.platform.repository;

import com.agri.platform.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    Optional<Crop> findByName(String name);
}
