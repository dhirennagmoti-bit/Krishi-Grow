package com.agri.platform.repository;

import com.agri.platform.entity.BuyerRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuyerRequirementRepository extends JpaRepository<BuyerRequirement, Long> {
    List<BuyerRequirement> findByBuyerId(Long buyerId);
    List<BuyerRequirement> findByStatus(String status);
}
