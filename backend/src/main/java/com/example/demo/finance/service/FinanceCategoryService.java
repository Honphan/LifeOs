package com.example.demo.finance.service;

import com.example.demo.finance.dto.request.CreateCategoryRequest;
import com.example.demo.finance.dto.request.UpdateCategoryRequest;
import com.example.demo.finance.dto.response.CategoryResponse;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceTransaction;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.mapper.FinanceMapper;
import com.example.demo.finance.repository.FinanceCategoryRepository;
import com.example.demo.finance.repository.FinanceTransactionRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FinanceCategoryService {

    private final FinanceCategoryRepository categoryRepository;
    private final FinanceTransactionRepository transactionRepository;
    private final FinanceProfileService profileService;
    private final SecurityUtils securityUtils;

    public FinanceCategoryService(
            FinanceCategoryRepository categoryRepository,
            FinanceTransactionRepository transactionRepository,
            FinanceProfileService profileService,
            SecurityUtils securityUtils) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.profileService = profileService;
        this.securityUtils = securityUtils;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(TransactionType type) {
        User user = securityUtils.requireCurrentUser();
        profileService.getOrCreateProfile();
        List<FinanceCategory> categories = type == null
                ? categoryRepository.findByUserIdOrderByNameAsc(user.getId())
                : categoryRepository.findByUserIdAndTypeOrderByNameAsc(user.getId(), type);
        return categories.stream().map(FinanceMapper::toCategoryResponse).toList();
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        User user = securityUtils.requireCurrentUser();
        profileService.getOrCreateProfile();

        categoryRepository.findByUserIdAndTypeAndNameIgnoreCase(user.getId(), request.type(), request.name())
                .ifPresent(c -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục đã tồn tại");
                });

        FinanceCategory category = new FinanceCategory();
        category.setUserId(user.getId());
        category.setName(request.name().trim());
        category.setType(request.type());
        category.setIcon(request.icon());
        category.setColor(request.color());
        category.setDefault(false);
        return FinanceMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        FinanceCategory category = requireOwnedCategory(id);
        if (request.name() != null && !request.name().isBlank()) {
            if (categoryRepository.existsByUserIdAndNameIgnoreCaseAndIdNot(
                    category.getUserId(), request.name().trim(), category.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục đã tồn tại");
            }
            category.setName(request.name().trim());
        }
        if (request.icon() != null) category.setIcon(request.icon());
        if (request.color() != null) category.setColor(request.color());
        return FinanceMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        FinanceCategory category = requireOwnedCategory(id);
        if (category.isDefault()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa danh mục mặc định");
        }

        if (transactionRepository.countByCategoryId(category.getId()) > 0) {
            FinanceCategory fallback = categoryRepository
                    .findByUserIdAndTypeAndNameIgnoreCase(category.getUserId(), category.getType(), "Khác")
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Không thể xóa danh mục đang có giao dịch"));
            List<FinanceTransaction> transactions = transactionRepository.findByCategoryId(category.getId());
            transactions.forEach(tx -> tx.setCategoryId(fallback.getId()));
            transactionRepository.saveAll(transactions);
        }

        categoryRepository.delete(category);
    }

    public FinanceCategory requireOwnedCategory(Long id) {
        User user = securityUtils.requireCurrentUser();
        return categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));
    }

    public FinanceCategory requireOwnedCategory(Long id, TransactionType type) {
        FinanceCategory category = requireOwnedCategory(id);
        if (category.getType() != type) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không khớp loại giao dịch");
        }
        return category;
    }
}