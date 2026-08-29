package com.agri.platform.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class FarmerCropRequest {
    @NotNull(message = "Crop ID is required")
    private Long cropId;

    private Long varietyId;
    private Long gradeId;

    @NotNull(message = "Quantity is mandatory")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
    private Double quantity;

    private LocalDate expectedHarvestDate;

    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;

    @DecimalMin(value = "0.0", message = "Expected price cannot be negative")
    private Double expectedPrice;

    // Getters and Setters
    public Long getCropId() {
        return cropId;
    }
    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public Long getVarietyId() {
        return varietyId;
    }
    public void setVarietyId(Long varietyId) {
        this.varietyId = varietyId;
    }

    public Long getGradeId() {
        return gradeId;
    }
    public void setGradeId(Long gradeId) {
        this.gradeId = gradeId;
    }

    public Double getQuantity() {
        return quantity;
    }
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpectedHarvestDate() {
        return expectedHarvestDate;
    }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public Double getExpectedPrice() {
        return expectedPrice;
    }
    public void setExpectedPrice(Double expectedPrice) {
        this.expectedPrice = expectedPrice;
    }
}
