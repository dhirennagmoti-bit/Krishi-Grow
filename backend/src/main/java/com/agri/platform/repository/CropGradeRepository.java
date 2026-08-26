package com.agri.platform.repository;

import com.agri.platform.entity.CropGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropGradeRepository extends JpaRepository<CropGrade, Long> {
    List<CropGrade> findByCropId(Long cropId);
    Optional<CropGrade> findByGradeCodeAndCropId(String gradeCode, Long cropId);
}
