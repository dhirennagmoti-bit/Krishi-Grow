package com.agri.platform.controller;

import com.agri.platform.dto.FarmerCropRequest;
import com.agri.platform.dto.MessageResponse;
import com.agri.platform.entity.*;
import com.agri.platform.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/farmer-crops")
public class FarmerCropController {

    @Autowired
    private FarmerCropRepository farmerCropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private CropRepository cropRepository;

    @GetMapping
    public ResponseEntity<?> getMyCrops(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        return ResponseEntity.ok(farmerCropRepository.findByFarmerId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addCrop(@Valid @RequestBody FarmerCropRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }

        Crop crop = cropRepository.findById(request.getCropId()).orElse(null);
        if (crop == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Crop not found"));
        }

        FarmerCrop farmerCrop = new FarmerCrop();
        farmerCrop.setFarmer(user);
        farmerCrop.setCrop(crop);
        
        BigDecimal qty = request.getQuantity() != null ? BigDecimal.valueOf(request.getQuantity()) : BigDecimal.ZERO;
        farmerCrop.setQuantity(qty);
        farmerCrop.setQuantityKg(qty); // default 1:1 if unit kg
        farmerCrop.setUnit("kg");
        farmerCrop.setHarvestDate(request.getExpectedHarvestDate());
        farmerCrop.setStatus(request.getStatus() != null ? request.getStatus() : "AVAILABLE");
        farmerCrop.setVillage(request.getLocation());

        farmerCropRepository.save(farmerCrop);

        return ResponseEntity.ok(new MessageResponse("Crop added successfully"));
    }
}
