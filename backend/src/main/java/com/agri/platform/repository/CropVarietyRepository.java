package com.agri.platform.repository;

import com.agri.platform.entity.CropVariety;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropVarietyRepository extends JpaRepository<CropVariety, Long> {
    List<CropVariety> findByCropId(Long cropId);
    Optional<CropVariety> findByNameAndCropId(String name, Long cropId);
}
