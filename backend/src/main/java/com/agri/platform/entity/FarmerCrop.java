package com.agri.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_crops")
public class FarmerCrop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variety_id")
    private CropVariety variety;

    @Column(name = "custom_variety")
    private String customVariety;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit = "kg";

    @Column(name = "quantity_kg", nullable = false)
    private BigDecimal quantityKg;

    @Column(name = "quality_level")
    private String qualityLevel;

    private String grade;

    private BigDecimal moisture;

    private String size;

    @Column(name = "damage_percentage")
    private BigDecimal damagePercentage;

    private Boolean organic = false;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "storage_condition")
    private String storageCondition;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    private String state;
    private String district;
    private String taluka;
    private String village;

    private String status = "AVAILABLE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public FarmerCrop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public CropVariety getVariety() { return variety; }
    public void setVariety(CropVariety variety) { this.variety = variety; }

    public String getCustomVariety() { return customVariety; }
    public void setCustomVariety(String customVariety) { this.customVariety = customVariety; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getQuantityKg() { return quantityKg; }
    public void setQuantityKg(BigDecimal quantityKg) { this.quantityKg = quantityKg; }

    public String getQualityLevel() { return qualityLevel; }
    public void setQualityLevel(String qualityLevel) { this.qualityLevel = qualityLevel; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public BigDecimal getMoisture() { return moisture; }
    public void setMoisture(BigDecimal moisture) { this.moisture = moisture; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public BigDecimal getDamagePercentage() { return damagePercentage; }
    public void setDamagePercentage(BigDecimal damagePercentage) { this.damagePercentage = damagePercentage; }

    public Boolean getOrganic() { return organic; }
    public void setOrganic(Boolean organic) { this.organic = organic; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public Integer getShelfLifeDays() { return shelfLifeDays; }
    public void setShelfLifeDays(Integer shelfLifeDays) { this.shelfLifeDays = shelfLifeDays; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluka() { return taluka; }
    public void setTaluka(String taluka) { this.taluka = taluka; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
