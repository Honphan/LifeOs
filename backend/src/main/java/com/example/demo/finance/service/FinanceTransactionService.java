package com.example.demo.finance.service;

import com.example.demo.finance.dto.request.CreateTransactionRequest;
import com.example.demo.finance.dto.request.UpdateTransactionRequest;
import com.example.demo.common.dto.ApiResponse;
import com.example.demo.finance.dto.response.AttachmentResponse;
import com.example.demo.finance.dto.response.TransactionResponse;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceTransaction;
import com.example.demo.finance.entity.FinanceTransactionAttachment;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.mapper.FinanceMapper;
import com.example.demo.finance.repository.FinanceTransactionAttachmentRepository;
import com.example.demo.finance.repository.FinanceTransactionRepository;
import com.example.demo.common.service.UploadService;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class FinanceTransactionService {

    private static final int MAX_ATTACHMENTS = 5;

    private final FinanceTransactionRepository transactionRepository;
    private final FinanceTransactionAttachmentRepository attachmentRepository;
    private final FinanceCategoryService categoryService;
    private final FinanceProfileService profileService;
    private final SecurityUtils securityUtils;
    private final UploadService uploadService;

    public FinanceTransactionService(
            FinanceTransactionRepository transactionRepository,
            FinanceTransactionAttachmentRepository attachmentRepository,
            FinanceCategoryService categoryService,
            FinanceProfileService profileService,
            SecurityUtils securityUtils,
            UploadService uploadService) {
        this.transactionRepository = transactionRepository;
        this.attachmentRepository = attachmentRepository;
        this.categoryService = categoryService;
        this.profileService = profileService;
        this.securityUtils = securityUtils;
        this.uploadService = uploadService;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            String keyword,
            TransactionType type,
            Long categoryId,
            LocalDate from,
            LocalDate to,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            Pageable pageable) {
        User user = securityUtils.requireCurrentUser();
        var spec = FinanceTransactionSpecifications.forUser(
                user.getId(), keyword, type, categoryId, from, to, minAmount, maxAmount);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giao dịch thành công",
                transactionRepository.findAll(spec, pageable).map(this::toResponse)));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionDetail(Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết giao dịch thành công",
                toResponse(requireOwnedTransaction(id))));
    }

    @Transactional
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(CreateTransactionRequest request) {
        User user = securityUtils.requireCurrentUser();
        FinanceCategory category = categoryService.requireOwnedCategory(request.categoryId(), request.type());

        FinanceTransaction transaction = new FinanceTransaction();
        transaction.setUserId(user.getId());
        transaction.setCategoryId(category.getId());
        transaction.setName(request.name().trim());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setNote(request.note());
        transaction.setTransactionDate(request.transactionDate());

        FinanceTransaction saved = transactionRepository.save(transaction);
        profileService.applyTransaction(saved.getType(), saved.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Tạo giao dịch thành công", toResponse(saved)));
    }

    @Transactional
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(Long id, UpdateTransactionRequest request) {
        FinanceTransaction transaction = requireOwnedTransaction(id);
        TransactionType oldType = transaction.getType();
        BigDecimal oldAmount = transaction.getAmount();

        profileService.rollbackTransaction(oldType, oldAmount);

        if (request.name() != null && !request.name().isBlank()) {
            transaction.setName(request.name().trim());
        }
        if (request.amount() != null) {
            transaction.setAmount(request.amount());
        }
        if (request.type() != null) {
            transaction.setType(request.type());
        }
        if (request.categoryId() != null) {
            TransactionType type = request.type() != null ? request.type() : transaction.getType();
            FinanceCategory category = categoryService.requireOwnedCategory(request.categoryId(), type);
            transaction.setCategoryId(category.getId());
        } else if (request.type() != null) {
            categoryService.requireOwnedCategory(transaction.getCategoryId(), request.type());
        }
        if (request.note() != null) {
            transaction.setNote(request.note());
        }
        if (request.transactionDate() != null) {
            transaction.setTransactionDate(request.transactionDate());
        }

        FinanceTransaction saved = transactionRepository.save(transaction);
        profileService.applyTransaction(saved.getType(), saved.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật giao dịch thành công", toResponse(saved)));
    }

    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(Long id) {
        FinanceTransaction transaction = requireOwnedTransaction(id);
        profileService.rollbackTransaction(transaction.getType(), transaction.getAmount());
        attachmentRepository.findByTransactionIdOrderByCreatedAtAsc(transaction.getId())
                .forEach(this::deleteCloudinaryAttachment);
        attachmentRepository.deleteAll(attachmentRepository.findByTransactionIdOrderByCreatedAtAsc(transaction.getId()));
        transactionRepository.delete(transaction);
        return ResponseEntity.ok(ApiResponse.success("Xóa giao dịch thành công", null));
    }

    @Transactional
    public ResponseEntity<ApiResponse<AttachmentResponse>> uploadAttachment(Long transactionId, MultipartFile file) {
        requireOwnedTransaction(transactionId);

        if (attachmentRepository.countByTransactionId(transactionId) >= MAX_ATTACHMENTS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tối đa 5 ảnh cho mỗi giao dịch");
        }

        var uploaded = uploadService.uploadImage(file);

        FinanceTransactionAttachment attachment = new FinanceTransactionAttachment();
        attachment.setTransactionId(transactionId);
        attachment.setImageUrl(uploaded.url());
        attachment.setPublicId(uploaded.publicId());
        attachment.setFileName(uploaded.fileName());
        attachment.setFileType(uploaded.fileType());
        attachment.setFileSize(uploaded.fileSize());
        return ResponseEntity.ok(ApiResponse.success("Tải ảnh lên thành công",
                FinanceMapper.toAttachmentResponse(attachmentRepository.save(attachment))));
    }

    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(Long transactionId, Long attachmentId) {
        requireOwnedTransaction(transactionId);
        FinanceTransactionAttachment attachment = attachmentRepository
                .findByIdAndTransactionId(attachmentId, transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh"));
        deleteCloudinaryAttachment(attachment);
        attachmentRepository.delete(attachment);
        return ResponseEntity.ok(ApiResponse.success("Xóa ảnh thành công", null));
    }

    private FinanceTransaction requireOwnedTransaction(Long id) {
        User user = securityUtils.requireCurrentUser();
        return transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch"));
    }

    private TransactionResponse toResponse(FinanceTransaction transaction) {
        FinanceCategory category = categoryService.requireOwnedCategory(transaction.getCategoryId());
        List<FinanceTransactionAttachment> attachments =
                attachmentRepository.findByTransactionIdOrderByCreatedAtAsc(transaction.getId());
        return FinanceMapper.toTransactionResponse(transaction, category, attachments);
    }

    private void deleteCloudinaryAttachment(FinanceTransactionAttachment attachment) {
        try {
            uploadService.delete(attachment.getPublicId());
        } catch (Exception ignored) {
        }
    }
}