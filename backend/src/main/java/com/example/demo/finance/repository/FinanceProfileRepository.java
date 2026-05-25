package com.example.demo.finance.repository;

import com.example.demo.finance.entity.FinanceProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FinanceProfileRepository extends JpaRepository<FinanceProfile, Long> {
    Optional<FinanceProfile> findByUserId(Long userId);
}