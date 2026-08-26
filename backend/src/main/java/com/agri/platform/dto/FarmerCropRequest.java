package com.agri.platform.dto;

import java.time.LocalDate;

public class FarmerCropRequest {
    private Long cropId;
    private Long varietyId;
    private Long gradeId;
    private Double quantity;
    private LocalDate expectedHarvestDate;
    private String status;
    private String location;
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
