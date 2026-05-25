package com.example.demo.finance.repository;

import com.example.demo.finance.entity.FinanceBudget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinanceBudgetRepository extends JpaRepository<FinanceBudget, Long> {
    List<FinanceBudget> findByUserIdAndMonthAndYearOrderByNameAsc(Long userId, int month, int year);

    Optional<FinanceBudget> findByIdAndUserId(Long id, Long userId);
}