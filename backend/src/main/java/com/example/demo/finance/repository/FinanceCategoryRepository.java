package com.example.demo.finance.repository;

import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinanceCategoryRepository extends JpaRepository<FinanceCategory, Long> {
    List<FinanceCategory> findByUserIdOrderByNameAsc(Long userId);

    List<FinanceCategory> findByUserIdAndTypeOrderByNameAsc(Long userId, TransactionType type);

    Optional<FinanceCategory> findByIdAndUserId(Long id, Long userId);

    Optional<FinanceCategory> findByUserIdAndTypeAndNameIgnoreCase(Long userId, TransactionType type, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(Long userId, String name, Long id);
}