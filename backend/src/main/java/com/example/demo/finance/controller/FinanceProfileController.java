package com.example.demo.finance.controller;

import com.example.demo.finance.dto.request.UpdateBalanceRequest;
import com.example.demo.finance.dto.response.FinanceProfileResponse;
import com.example.demo.finance.service.FinanceProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance/profile")
public class FinanceProfileController {

    private final FinanceProfileService profileService;

    public FinanceProfileController(FinanceProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public FinanceProfileResponse getProfile() {
        return profileService.getMyProfile();
    }

    @PutMapping("/balance")
    public FinanceProfileResponse updateBalance(@Valid @RequestBody UpdateBalanceRequest request) {
        return profileService.updateBalance(request);
    }
}
