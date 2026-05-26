package com.example.demo.finance.service;

import com.example.demo.finance.dto.request.CreateBudgetRequest;
import com.example.demo.finance.dto.request.UpdateBudgetRequest;
import com.example.demo.common.dto.ApiResponse;
import com.example.demo.finance.dto.response.BudgetResponse;
import com.example.demo.finance.entity.FinanceBudget;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.repository.FinanceBudgetRepository;
import com.example.demo.finance.repository.FinanceTransactionRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class FinanceBudgetService {

    private final FinanceBudgetRepository budgetRepository;
    private final FinanceTransactionRepository transactionRepository;
    private final FinanceCategoryService categoryService;
    private final FinanceProfileService profileService;
    private final SecurityUtils securityUtils;

    public FinanceBudgetService(
            FinanceBudgetRepository budgetRepository,
            FinanceTransactionRepository transactionRepository,
            FinanceCategoryService categoryService,
            FinanceProfileService profileService,
            SecurityUtils securityUtils) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.profileService = profileService;
        this.securityUtils = securityUtils;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(int month, int year) {
        User user = securityUtils.requireCurrentUser();
        profileService.getOrCreateProfile();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ngân sách thành công",
                budgetRepository.findByUserIdAndMonthAndYearOrderByNameAsc(user.getId(), month, year)
                        .stream()
                        .map(budget -> toResponse(budget, user.getId()))
                        .toList()));
    }

    @Transactional
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(CreateBudgetRequest request) {
        User user = securityUtils.requireCurrentUser();
        profileService.getOrCreateProfile();
        FinanceCategory category = categoryService.requireOwnedCategory(request.categoryId(), TransactionType.EXPENSE);

        FinanceBudget budget = new FinanceBudget();
        budget.setUserId(user.getId());
        budget.setCategoryId(category.getId());
        budget.setName(request.name().trim());
        budget.setAmountLimit(request.amountLimit());
        budget.setMonth(request.month());
        budget.setYear(request.year());
        return ResponseEntity.ok(ApiResponse.success("Tạo ngân sách thành công",
                toResponse(budgetRepository.save(budget), user.getId())));
    }

    @Transactional
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(Long id, UpdateBudgetRequest request) {
        FinanceBudget budget = requireOwnedBudget(id);
        if (request.name() != null && !request.name().isBlank()) {
            budget.setName(request.name().trim());
        }
        if (request.categoryId() != null) {
            FinanceCategory category = categoryService.requireOwnedCategory(request.categoryId(), TransactionType.EXPENSE);
            budget.setCategoryId(category.getId());
        }
        if (request.amountLimit() != null) {
            budget.setAmountLimit(request.amountLimit());
        }
        if (request.month() != null) {
            budget.setMonth(request.month());
        }
        if (request.year() != null) {
            budget.setYear(request.year());
        }
        return ResponseEntity.ok(ApiResponse.success("Cập nhật ngân sách thành công",
                toResponse(budgetRepository.save(budget), budget.getUserId())));
    }

    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteBudget(Long id) {
        budgetRepository.delete(requireOwnedBudget(id));
        return ResponseEntity.ok(ApiResponse.success("Xóa ngân sách thành công", null));
    }

    private FinanceBudget requireOwnedBudget(Long id) {
        User user = securityUtils.requireCurrentUser();
        return budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ngân sách"));
    }

    private BudgetResponse toResponse(FinanceBudget budget, Long userId) {
        FinanceCategory category = categoryService.requireOwnedCategory(budget.getCategoryId());
        LocalDate from = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate to = YearMonth.of(budget.getYear(), budget.getMonth()).atEndOfMonth();
        BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateRange(
                userId, budget.getCategoryId(), from, to);
        BigDecimal remaining = budget.getAmountLimit().subtract(spent);
        double percentage = budget.getAmountLimit().compareTo(BigDecimal.ZERO) == 0
                ? 0
                : spent.multiply(BigDecimal.valueOf(100))
                        .divide(budget.getAmountLimit(), 2, RoundingMode.HALF_UP)
                        .doubleValue();

        return new BudgetResponse(
                budget.getId(),
                budget.getName(),
                budget.getCategoryId(),
                category.getName(),
                budget.getAmountLimit(),
                spent,
                remaining,
                percentage,
                budget.getMonth(),
                budget.getYear()
        );
    }
}