package com.example.demo.finance.controller;

import com.example.demo.finance.dto.request.CreateTransactionRequest;
import com.example.demo.finance.dto.request.UpdateTransactionRequest;
import com.example.demo.finance.dto.response.AttachmentResponse;
import com.example.demo.finance.dto.response.TransactionResponse;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.service.FinanceTransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/finance/transactions")
public class FinanceTransactionController {

    private final FinanceTransactionService transactionService;

    public FinanceTransactionController(FinanceTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public Page<TransactionResponse> getTransactions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @PageableDefault(size = 20, sort = "transactionDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return transactionService.getTransactions(keyword, type, categoryId, from, to, minAmount, maxAmount, pageable);
    }

    @GetMapping("/{id}")
    public TransactionResponse getTransaction(@PathVariable Long id) {
        return transactionService.getTransactionDetail(id);
    }

    @PostMapping
    public TransactionResponse createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return transactionService.createTransaction(request);
    }

    @PutMapping("/{id}")
    public TransactionResponse updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTransactionRequest request) {
        return transactionService.updateTransaction(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }

    @PostMapping("/{id}/attachments")
    public AttachmentResponse uploadAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return transactionService.uploadAttachment(id, file);
    }

    @DeleteMapping("/{transactionId}/attachments/{attachmentId}")
    public void deleteAttachment(@PathVariable Long transactionId, @PathVariable Long attachmentId) {
        transactionService.deleteAttachment(transactionId, attachmentId);
    }
}
