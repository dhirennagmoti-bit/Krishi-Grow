package com.agri.platform.repository;

import com.agri.platform.entity.FarmerProfile;
import com.agri.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {
    Optional<FarmerProfile> findByUserId(Long userId);
    Optional<FarmerProfile> findByUser(User user);
}
