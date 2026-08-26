package com.agri.platform.repository;

import com.agri.platform.entity.BuyerProfile;
import com.agri.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerProfileRepository extends JpaRepository<BuyerProfile, Long> {
    Optional<BuyerProfile> findByUserId(Long userId);
    Optional<BuyerProfile> findByUser(User user);
}
