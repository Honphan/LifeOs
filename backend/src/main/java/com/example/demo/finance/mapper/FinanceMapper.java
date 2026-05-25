package com.example.demo.finance.mapper;

import com.example.demo.finance.dto.response.AttachmentResponse;
import com.example.demo.finance.dto.response.BudgetResponse;
import com.example.demo.finance.dto.response.CategoryResponse;
import com.example.demo.finance.dto.response.FinanceProfileResponse;
import com.example.demo.finance.dto.response.TransactionResponse;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceProfile;
import com.example.demo.finance.entity.FinanceTransaction;
import com.example.demo.finance.entity.FinanceTransactionAttachment;

import java.util.List;

public final class FinanceMapper {

    private FinanceMapper() {}

    public static FinanceProfileResponse toProfileResponse(FinanceProfile profile) {
        return new FinanceProfileResponse(
                profile.getCurrentBalance(),
                profile.getInitialBalance(),
                profile.getCurrency()
        );
    }

    public static CategoryResponse toCategoryResponse(FinanceCategory category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getIcon(),
                category.getColor(),
                category.isDefault()
        );
    }

    public static AttachmentResponse toAttachmentResponse(FinanceTransactionAttachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getImageUrl(),
                attachment.getFileName(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getCreatedAt()
        );
    }

    public static TransactionResponse toTransactionResponse(
            FinanceTransaction transaction,
            FinanceCategory category,
            List<FinanceTransactionAttachment> attachments) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getName(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategoryId(),
                category.getName(),
                category.getColor(),
                category.getIcon(),
                transaction.getNote(),
                transaction.getTransactionDate(),
                attachments.stream().map(FinanceMapper::toAttachmentResponse).toList(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}
