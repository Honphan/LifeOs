package com.example.demo.finance.controller;

import com.example.demo.finance.dto.request.CreateCategoryRequest;
import com.example.demo.finance.dto.request.UpdateCategoryRequest;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.service.FinanceCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance/categories")
public class FinanceCategoryController {

    private final FinanceCategoryService categoryService;

    public FinanceCategoryController(FinanceCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<?> getCategories(@RequestParam(required = false) TransactionType type) {
        return categoryService.getCategories(type);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.createCategory(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        return categoryService.updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
}
