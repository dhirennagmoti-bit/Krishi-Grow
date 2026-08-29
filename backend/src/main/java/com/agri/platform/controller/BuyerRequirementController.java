package com.agri.platform.controller;

import com.agri.platform.dto.BuyerRequirementRequest;
import com.agri.platform.dto.MessageResponse;
import com.agri.platform.entity.*;
import com.agri.platform.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer-requirements")
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
    public ResponseEntity<?> getMyRequirements(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        BuyerProfile profile = buyerProfileRepository.findByUser(user).orElse(null);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Buyer profile not found"));
        }
        
        return ResponseEntity.ok(requirementRepository.findByBuyerId(profile.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addRequirement(@Valid @RequestBody BuyerRequirementRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        BuyerProfile profile = buyerProfileRepository.findByUser(user).orElse(null);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Only buyers can post requirements"));
        }

        Crop crop = cropRepository.findById(request.getCropId()).orElse(null);
        if (crop == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Crop not found"));
        }

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
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        BuyerRequirement req = requirementRepository.findById(id).orElse(null);
        if (req == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Requirement not found"));
        }

        // Authorization check: Verify that the current user owns this requirement
        String username = authentication.getName();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null || req.getBuyer() == null || req.getBuyer().getUser() == null ||
            !req.getBuyer().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access denied: You do not own this requirement"));
        }

        // Matching logic
        List<FarmerCrop> matches = farmerCropRepository.findAll().stream()
                .filter(fc -> fc.getCrop() != null && fc.getCrop().getId().equals(req.getCrop().getId()))
                .filter(fc -> fc.getQuantity() != null && req.getQuantityRequired() != null &&
                        fc.getQuantity().doubleValue() >= req.getQuantityRequired() * 0.5) // At least 50% match
                .toList();
        return ResponseEntity.ok(matches);
    }
}
