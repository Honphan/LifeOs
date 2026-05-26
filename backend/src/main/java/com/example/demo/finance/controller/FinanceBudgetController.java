package com.example.demo.finance.controller;

import com.example.demo.finance.dto.request.CreateBudgetRequest;
import com.example.demo.finance.dto.request.UpdateBudgetRequest;
import com.example.demo.finance.service.FinanceBudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance/budgets")
public class FinanceBudgetController {

    private final FinanceBudgetService budgetService;

    public FinanceBudgetController(FinanceBudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<?> getBudgets(@RequestParam int month, @RequestParam int year) {
        return budgetService.getBudgets(month, year);
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@Valid @RequestBody CreateBudgetRequest request) {
        return budgetService.createBudget(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBudgetRequest request) {
        return budgetService.updateBudget(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        return budgetService.deleteBudget(id);
    }
}
