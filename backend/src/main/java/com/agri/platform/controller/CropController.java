package com.agri.platform.controller;

import com.agri.platform.entity.Crop;
import com.agri.platform.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    @GetMapping
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAll());
    }

}
