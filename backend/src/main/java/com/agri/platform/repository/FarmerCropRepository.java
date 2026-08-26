package com.agri.platform.repository;

import com.agri.platform.entity.FarmerCrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmerCropRepository extends JpaRepository<FarmerCrop, Long> {
    List<FarmerCrop> findByFarmerId(Long farmerId);
    List<FarmerCrop> findByStatus(String status);
}
