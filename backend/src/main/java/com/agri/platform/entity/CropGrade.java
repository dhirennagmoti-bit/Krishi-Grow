package com.agri.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crop_grades")
public class CropGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(name = "grade_code", nullable = false)
    private String gradeCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    public CropGrade() {}

    public CropGrade(Long id, Crop crop, String gradeCode, String description) {
        this.id = id;
        this.crop = crop;
        this.gradeCode = gradeCode;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public String getGradeCode() { return gradeCode; }
    public void setGradeCode(String gradeCode) { this.gradeCode = gradeCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
