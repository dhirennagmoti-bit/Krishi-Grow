package com.agri.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class RegisterRequest {
    @NotBlank(message = "Role is required")
    @jakarta.validation.constraints.Pattern(regexp = "(?i)^(FARMER|BUYER|ADMIN)$", message = "Role must be FARMER, BUYER, or ADMIN")
    private String role; // "FARMER" or "BUYER"
    
    @NotBlank(message = "Name is required")
    @jakarta.validation.constraints.Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @jakarta.validation.constraints.Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Please provide a valid phone number")
    private String phone;

    @NotBlank(message = "Password is required")
    @jakarta.validation.constraints.Size(min = 8, max = 128, message = "Password must be at least 8 characters long")
    private String password;

    // Common location
    private String state;
    private String district;
    private String taluka;
    private BigDecimal latitude;
    private BigDecimal longitude;

    // Farmer specific
    private String village;
    private BigDecimal farmSize;

    // Buyer specific
    private String businessName;
    private String buyerType; // "AGGREGATOR", "PROCESSOR", "WHOLESALER"
    private String address;
    private String gstNumber;

    public RegisterRequest() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluka() { return taluka; }
    public void setTaluka(String taluka) { this.taluka = taluka; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public BigDecimal getFarmSize() { return farmSize; }
    public void setFarmSize(BigDecimal farmSize) { this.farmSize = farmSize; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBuyerType() { return buyerType; }
    public void setBuyerType(String buyerType) { this.buyerType = buyerType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }
}
