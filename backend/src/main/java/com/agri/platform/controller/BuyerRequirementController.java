package com.agri.platform.controller;

import com.agri.platform.dto.BuyerRequirementRequest;
import com.agri.platform.dto.MessageResponse;
import com.agri.platform.entity.*;
import com.agri.platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer-requirements")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BuyerRequirementController {

    @Autowired
    private BuyerRequirementRepository requirementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuyerProfileRepository buyerProfileRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FarmerCropRepository farmerCropRepository;

    @GetMapping
    public ResponseEntity<List<BuyerRequirement>> getMyRequirements(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        BuyerProfile profile = buyerProfileRepository.findByUser(user).orElseThrow();
        
        return ResponseEntity.ok(requirementRepository.findByBuyerId(profile.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addRequirement(@RequestBody BuyerRequirementRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElseThrow();
        BuyerProfile profile = buyerProfileRepository.findByUser(user).orElseThrow();

        Crop crop = cropRepository.findById(request.getCropId()).orElseThrow(() -> new RuntimeException("Crop not found"));

        BuyerRequirement req = new BuyerRequirement();
        req.setBuyer(profile);
        req.setCrop(crop);
        req.setQuantityRequired(request.getQuantityRequired());
        req.setTargetDate(request.getTargetDate());
        req.setTargetPrice(request.getTargetPrice());
        req.setDeliveryLocation(request.getDeliveryLocation());

        requirementRepository.save(req);

        return ResponseEntity.ok(new MessageResponse("Requirement added successfully"));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<?> getMatches(@PathVariable Long id, Authentication authentication) {
        BuyerRequirement req = requirementRepository.findById(id).orElseThrow(() -> new RuntimeException("Requirement not found"));
        // Basic matching logic: find FarmerCrops of the same crop that are available
        List<FarmerCrop> matches = farmerCropRepository.findAll().stream()
                .filter(fc -> fc.getCrop() != null && fc.getCrop().getId().equals(req.getCrop().getId()))
                .filter(fc -> fc.getQuantity() != null && req.getQuantityRequired() != null &&
                        fc.getQuantity().doubleValue() >= req.getQuantityRequired() * 0.5) // At least 50% match
                .toList();
        return ResponseEntity.ok(matches);
    }
}
