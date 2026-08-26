package com.agri.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crop_varieties")
public class CropVariety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "default_shelf_life_days")
    private Integer defaultShelfLifeDays;

    public CropVariety() {}

    public CropVariety(Long id, Crop crop, String name, String description, Integer defaultShelfLifeDays) {
        this.id = id;
        this.crop = crop;
        this.name = name;
        this.description = description;
        this.defaultShelfLifeDays = defaultShelfLifeDays;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDefaultShelfLifeDays() { return defaultShelfLifeDays; }
    public void setDefaultShelfLifeDays(Integer defaultShelfLifeDays) { this.defaultShelfLifeDays = defaultShelfLifeDays; }
}
