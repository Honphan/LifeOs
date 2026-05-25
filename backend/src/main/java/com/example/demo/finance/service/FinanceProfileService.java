package com.example.demo.finance.service;

import com.example.demo.finance.dto.request.UpdateBalanceRequest;
import com.example.demo.finance.dto.response.FinanceProfileResponse;
import com.example.demo.finance.entity.FinanceCategory;
import com.example.demo.finance.entity.FinanceProfile;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.mapper.FinanceMapper;
import com.example.demo.finance.repository.FinanceCategoryRepository;
import com.example.demo.finance.repository.FinanceProfileRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FinanceProfileService {

    private static final List<DefaultCategory> DEFAULT_EXPENSE = List.of(
            new DefaultCategory("Ăn uống", "utensils", "#F97316"),
            new DefaultCategory("Di chuyển", "car", "#3B82F6"),
            new DefaultCategory("Mua sắm", "shopping-bag", "#EC4899"),
            new DefaultCategory("Học tập", "book", "#8B5CF6"),
            new DefaultCategory("Giải trí", "gamepad-2", "#10B981"),
            new DefaultCategory("Hóa đơn", "receipt", "#EF4444"),
            new DefaultCategory("Sức khỏe", "heart-pulse", "#14B8A6"),
            new DefaultCategory("Khác", "more-horizontal", "#64748B")
    );

    private static final List<DefaultCategory> DEFAULT_INCOME = List.of(
            new DefaultCategory("Lương", "wallet", "#06B6D4"),
            new DefaultCategory("Thưởng", "gift", "#F59E0B"),
            new DefaultCategory("Làm thêm", "briefcase", "#6366F1"),
            new DefaultCategory("Quà tặng", "heart", "#F472B6"),
            new DefaultCategory("Khác", "more-horizontal", "#64748B")
    );

    private final FinanceProfileRepository profileRepository;
    private final FinanceCategoryRepository categoryRepository;
    private final SecurityUtils securityUtils;

    public FinanceProfileService(
            FinanceProfileRepository profileRepository,
            FinanceCategoryRepository categoryRepository,
            SecurityUtils securityUtils) {
        this.profileRepository = profileRepository;
        this.categoryRepository = categoryRepository;
        this.securityUtils = securityUtils;
    }

    @Transactional(readOnly = true)
    public FinanceProfileResponse getMyProfile() {
        return FinanceMapper.toProfileResponse(getOrCreateProfile());
    }

    @Transactional
    public FinanceProfileResponse updateBalance(UpdateBalanceRequest request) {
        FinanceProfile profile = getOrCreateProfile();
        profile.setCurrentBalance(request.currentBalance());
        if (profile.getInitialBalance().compareTo(BigDecimal.ZERO) == 0) {
            profile.setInitialBalance(request.currentBalance());
        }
        return FinanceMapper.toProfileResponse(profileRepository.save(profile));
    }

    @Transactional
    public FinanceProfile getOrCreateProfile() {
        User user = securityUtils.requireCurrentUser();
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> createProfileWithDefaults(user.getId()));
    }

    @Transactional
    public void applyTransaction(TransactionType type, BigDecimal amount) {
        FinanceProfile profile = getOrCreateProfile();
        if (type == TransactionType.INCOME) {
            profile.setCurrentBalance(profile.getCurrentBalance().add(amount));
        } else {
            profile.setCurrentBalance(profile.getCurrentBalance().subtract(amount));
        }
        profileRepository.save(profile);
    }

    @Transactional
    public void rollbackTransaction(TransactionType type, BigDecimal amount) {
        FinanceProfile profile = getOrCreateProfile();
        if (type == TransactionType.INCOME) {
            profile.setCurrentBalance(profile.getCurrentBalance().subtract(amount));
        } else {
            profile.setCurrentBalance(profile.getCurrentBalance().add(amount));
        }
        profileRepository.save(profile);
    }

    private FinanceProfile createProfileWithDefaults(Long userId) {
        FinanceProfile profile = new FinanceProfile();
        profile.setUserId(userId);
        profile.setInitialBalance(BigDecimal.ZERO);
        profile.setCurrentBalance(BigDecimal.ZERO);
        profile.setCurrency("VND");
        FinanceProfile savedProfile = profileRepository.save(profile);

        DEFAULT_EXPENSE.forEach(item -> saveDefaultCategory(userId, TransactionType.EXPENSE, item));
        DEFAULT_INCOME.forEach(item -> saveDefaultCategory(userId, TransactionType.INCOME, item));
        return savedProfile;
    }

    private void saveDefaultCategory(Long userId, TransactionType type, DefaultCategory item) {
        FinanceCategory category = new FinanceCategory();
        category.setUserId(userId);
        category.setName(item.name());
        category.setType(type);
        category.setIcon(item.icon());
        category.setColor(item.color());
        category.setDefault(true);
        categoryRepository.save(category);
    }

    public FinanceProfile requireProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có hồ sơ tài chính"));
    }

    private record DefaultCategory(String name, String icon, String color) {}
}