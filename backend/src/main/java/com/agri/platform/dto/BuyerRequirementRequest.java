package com.agri.platform.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class BuyerRequirementRequest {
    @NotNull(message = "Crop ID is required")
    private Long cropId;

    private Long varietyId;
    private Long gradeId;

    @NotNull(message = "Quantity required is mandatory")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
    private Double quantityRequired;

    private LocalDate targetDate;

    @DecimalMin(value = "0.0", message = "Target price cannot be negative")
    private Double targetPrice;

    @Size(max = 255, message = "Delivery location cannot exceed 255 characters")
    private String deliveryLocation;

    // Getters and Setters
    public Long getCropId() { return cropId; }
    public void setCropId(Long cropId) { this.cropId = cropId; }

    public Long getVarietyId() { return varietyId; }
    public void setVarietyId(Long varietyId) { this.varietyId = varietyId; }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public Double getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public Double getTargetPrice() { return targetPrice; }
    public void setTargetPrice(Double targetPrice) { this.targetPrice = targetPrice; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }
}
