package com.agri.platform.controller;

import com.agri.platform.dto.JwtResponse;
import com.agri.platform.dto.LoginRequest;
import com.agri.platform.dto.MessageResponse;
import com.agri.platform.dto.RegisterRequest;
import com.agri.platform.entity.BuyerProfile;
import com.agri.platform.entity.FarmerProfile;
import com.agri.platform.entity.User;
import com.agri.platform.repository.BuyerProfileRepository;
import com.agri.platform.repository.FarmerProfileRepository;
import com.agri.platform.repository.UserRepository;
import com.agri.platform.security.JwtUtils;
import com.agri.platform.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FarmerProfileRepository farmerProfileRepository;

    @Autowired
    BuyerProfileRepository buyerProfileRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                role));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (userRepository.existsByPhone(signUpRequest.getPhone())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Phone number is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .phone(signUpRequest.getPhone())
                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole().toUpperCase())
                .build();

        user = userRepository.save(user);

        if ("FARMER".equalsIgnoreCase(signUpRequest.getRole())) {
            FarmerProfile profile = FarmerProfile.builder()
                    .user(user)
                    .farmSize(signUpRequest.getFarmSize())
                    .state(signUpRequest.getState())
                    .district(signUpRequest.getDistrict())
                    .taluka(signUpRequest.getTaluka())
                    .village(signUpRequest.getVillage())
                    .latitude(signUpRequest.getLatitude())
                    .longitude(signUpRequest.getLongitude())
                    .build();
            farmerProfileRepository.save(profile);
        } else if ("BUYER".equalsIgnoreCase(signUpRequest.getRole())) {
            BuyerProfile profile = BuyerProfile.builder()
                    .user(user)
                    .businessName(signUpRequest.getBusinessName())
                    .buyerType(signUpRequest.getBuyerType())
                    .gstNumber(signUpRequest.getGstNumber())
                    .address(signUpRequest.getAddress())
                    .state(signUpRequest.getState())
                    .district(signUpRequest.getDistrict())
                    .taluka(signUpRequest.getTaluka())
                    .latitude(signUpRequest.getLatitude())
                    .longitude(signUpRequest.getLongitude())
                    .build();
            buyerProfileRepository.save(profile);
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid role!"));
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
