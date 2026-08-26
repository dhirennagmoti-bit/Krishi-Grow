package com.agri.platform.dto;

import java.time.LocalDate;

public class BuyerRequirementRequest {
    private Long cropId;
    private Long varietyId;
    private Long gradeId;
    private Double quantityRequired;
    private LocalDate targetDate;
    private Double targetPrice;
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
