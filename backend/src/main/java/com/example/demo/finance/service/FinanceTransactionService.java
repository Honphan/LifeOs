package com.example.demo.finance.service;

import com.example.demo.finance.dto.request.CreateTransactionRequest;
import com.example.demo.finance.dto.request.UpdateTransactionRequest;
import com.example.demo.finance.dto.response.AttachmentResponse;
import com.example.demo.finance.dto.response.TransactionResponse;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceTransaction;
import com.example.demo.finance.entity.FinanceTransactionAttachment;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.mapper.FinanceMapper;
import com.example.demo.finance.repository.FinanceTransactionAttachmentRepository;
import com.example.demo.finance.repository.FinanceTransactionRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class FinanceTransactionService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final int MAX_ATTACHMENTS = 5;

    private final FinanceTransactionRepository transactionRepository;
    private final FinanceTransactionAttachmentRepository attachmentRepository;
    private final FinanceCategoryService categoryService;
    private final FinanceProfileService profileService;
    private final SecurityUtils securityUtils;
    private final Path uploadRoot;

    public FinanceTransactionService(
            FinanceTransactionRepository transactionRepository,
            FinanceTransactionAttachmentRepository attachmentRepository,
            FinanceCategoryService categoryService,
            FinanceProfileService profileService,
            SecurityUtils securityUtils,
            @Value("${app.finance.upload-dir:uploads/finance}") String uploadDir) {
        this.transactionRepository = transactionRepository;
        this.attachmentRepository = attachmentRepository;
        this.categoryService = categoryService;
        this.profileService = profileService;
        this.securityUtils = securityUtils;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(
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
        return transactionRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionDetail(Long id) {
        return toResponse(requireOwnedTransaction(id));
    }

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
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
        return toResponse(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, UpdateTransactionRequest request) {
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
        return toResponse(saved);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        FinanceTransaction transaction = requireOwnedTransaction(id);
        profileService.rollbackTransaction(transaction.getType(), transaction.getAmount());
        attachmentRepository.findByTransactionIdOrderByCreatedAtAsc(transaction.getId())
                .forEach(attachment -> deleteAttachmentFile(attachment.getImageUrl()));
        attachmentRepository.deleteAll(attachmentRepository.findByTransactionIdOrderByCreatedAtAsc(transaction.getId()));
        transactionRepository.delete(transaction);
    }

    @Transactional
    public AttachmentResponse uploadAttachment(Long transactionId, MultipartFile file) {
        FinanceTransaction transaction = requireOwnedTransaction(transactionId);
        validateFile(file);

        if (attachmentRepository.countByTransactionId(transactionId) >= MAX_ATTACHMENTS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tối đa 5 ảnh cho mỗi giao dịch");
        }

        try {
            Path dir = uploadRoot.resolve(String.valueOf(transaction.getUserId()))
                    .resolve(String.valueOf(transactionId));
            Files.createDirectories(dir);

            String extension = extensionFromContentType(file.getContentType());
            String storedName = System.currentTimeMillis() + extension;
            Path target = dir.resolve(storedName);
            Files.copy(file.getInputStream(), target);

            String imageUrl = "/uploads/finance/" + transaction.getUserId() + "/" + transactionId + "/" + storedName;

            FinanceTransactionAttachment attachment = new FinanceTransactionAttachment();
            attachment.setTransactionId(transactionId);
            attachment.setImageUrl(imageUrl);
            attachment.setFileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : storedName);
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            return FinanceMapper.toAttachmentResponse(attachmentRepository.save(attachment));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể lưu file");
        }
    }

    @Transactional
    public void deleteAttachment(Long transactionId, Long attachmentId) {
        requireOwnedTransaction(transactionId);
        FinanceTransactionAttachment attachment = attachmentRepository
                .findByIdAndTransactionId(attachmentId, transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh"));
        deleteAttachmentFile(attachment.getImageUrl());
        attachmentRepository.delete(attachment);
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

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File không hợp lệ");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File vượt quá 5MB");
        }
        if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ chấp nhận jpg, png, webp");
        }
    }

    private String extensionFromContentType(String contentType) {
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    private void deleteAttachmentFile(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploads/finance/")) {
            return;
        }
        String relative = imageUrl.substring("/uploads/finance/".length());
        Path path = uploadRoot.resolve(relative);
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }
}