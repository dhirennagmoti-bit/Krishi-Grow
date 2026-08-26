package com.agri.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crops")
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "default_shelf_life_days")
    private Integer defaultShelfLifeDays;

    private Boolean active = true;

    public Crop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDefaultShelfLifeDays() { return defaultShelfLifeDays; }
    public void setDefaultShelfLifeDays(Integer defaultShelfLifeDays) { this.defaultShelfLifeDays = defaultShelfLifeDays; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
