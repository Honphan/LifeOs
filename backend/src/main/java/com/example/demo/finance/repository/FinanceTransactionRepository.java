package com.example.demo.finance.repository;

import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceTransaction;
import com.example.demo.finance.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FinanceTransactionRepository extends JpaRepository<FinanceTransaction, Long>,
        JpaSpecificationExecutor<FinanceTransaction> {

    Optional<FinanceTransaction> findByIdAndUserId(Long id, Long userId);

    long countByCategoryId(Long categoryId);

    List<FinanceTransaction> findByCategoryId(Long categoryId);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM FinanceTransaction t
            WHERE t.userId = :userId AND t.type = :type
              AND t.transactionDate BETWEEN :from AND :to
            """)
    BigDecimal sumAmountByUserAndTypeAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
            SELECT COUNT(t) FROM FinanceTransaction t
            WHERE t.userId = :userId
              AND t.transactionDate BETWEEN :from AND :to
            """)
    long countByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM FinanceTransaction t
            WHERE t.userId = :userId AND t.categoryId = :categoryId AND t.type = 'EXPENSE'
              AND t.transactionDate BETWEEN :from AND :to
            """)
    BigDecimal sumExpenseByCategoryAndDateRange(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
            SELECT c.name, c.color, COALESCE(SUM(t.amount), 0)
            FROM FinanceTransaction t
            JOIN FinanceCategory c ON c.id = t.categoryId
            WHERE t.userId = :userId AND t.type = :type
              AND t.transactionDate BETWEEN :from AND :to
            GROUP BY c.id, c.name, c.color
            ORDER BY SUM(t.amount) DESC
            """)
    List<Object[]> sumByCategory(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}