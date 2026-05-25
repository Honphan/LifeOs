package com.example.demo.finance.service;

import com.example.demo.finance.dto.response.CategorySummaryResponse;
import com.example.demo.finance.dto.response.FinanceSummaryResponse;
import com.example.demo.finance.dto.response.MonthlyTrendResponse;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.repository.FinanceTransactionRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinanceAnalyticsService {

    private final FinanceTransactionRepository transactionRepository;
    private final FinanceProfileService profileService;
    private final SecurityUtils securityUtils;

    public FinanceAnalyticsService(
            FinanceTransactionRepository transactionRepository,
            FinanceProfileService profileService,
            SecurityUtils securityUtils) {
        this.transactionRepository = transactionRepository;
        this.profileService = profileService;
        this.securityUtils = securityUtils;
    }

    @Transactional(readOnly = true)
    public FinanceSummaryResponse getSummary(int month, int year) {
        User user = securityUtils.requireCurrentUser();
        var profile = profileService.getOrCreateProfile();
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = YearMonth.of(year, month).atEndOfMonth();

        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndTypeAndDateRange(
                user.getId(), TransactionType.INCOME, from, to);
        BigDecimal totalExpense = transactionRepository.sumAmountByUserAndTypeAndDateRange(
                user.getId(), TransactionType.EXPENSE, from, to);
        long count = transactionRepository.countByUserAndDateRange(user.getId(), from, to);

        return new FinanceSummaryResponse(
                profile.getCurrentBalance(),
                totalIncome,
                totalExpense,
                totalIncome.subtract(totalExpense),
                count
        );
    }

    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getCategorySummary(int month, int year, TransactionType type) {
        User user = securityUtils.requireCurrentUser();
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = YearMonth.of(year, month).atEndOfMonth();

        List<Object[]> rows = transactionRepository.sumByCategory(user.getId(), type, from, to);
        BigDecimal total = rows.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategorySummaryResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            String name = (String) row[0];
            String color = row[1] != null ? (String) row[1] : null;
            BigDecimal amount = (BigDecimal) row[2];
            double percentage = total.compareTo(BigDecimal.ZERO) == 0
                    ? 0
                    : amount.multiply(BigDecimal.valueOf(100))
                            .divide(total, 2, RoundingMode.HALF_UP)
                            .doubleValue();
            result.add(new CategorySummaryResponse(name, amount, percentage, color));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<MonthlyTrendResponse> getMonthlyTrend(int year) {
        User user = securityUtils.requireCurrentUser();
        List<MonthlyTrendResponse> result = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            LocalDate from = LocalDate.of(year, month, 1);
            LocalDate to = YearMonth.of(year, month).atEndOfMonth();
            BigDecimal income = transactionRepository.sumAmountByUserAndTypeAndDateRange(
                    user.getId(), TransactionType.INCOME, from, to);
            BigDecimal expense = transactionRepository.sumAmountByUserAndTypeAndDateRange(
                    user.getId(), TransactionType.EXPENSE, from, to);
            if (income.compareTo(BigDecimal.ZERO) > 0 || expense.compareTo(BigDecimal.ZERO) > 0) {
                result.add(new MonthlyTrendResponse(month, income, expense));
            }
        }
        return result;
    }
}