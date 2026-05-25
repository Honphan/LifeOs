package com.example.demo.finance.repository;

import com.example.demo.finance.entity.FinanceTransactionAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinanceTransactionAttachmentRepository extends JpaRepository<FinanceTransactionAttachment, Long> {
    List<FinanceTransactionAttachment> findByTransactionIdOrderByCreatedAtAsc(Long transactionId);

    long countByTransactionId(Long transactionId);

    Optional<FinanceTransactionAttachment> findByIdAndTransactionId(Long id, Long transactionId);
}